import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization") ?? "" },
        },
      },
    );

    // Create a Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Get the request body
    const { faucetId, userId } = await req.json();

    if (!faucetId || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    // Get the faucet details
    const { data: faucet, error: faucetError } = await supabaseAdmin
      .from("token_faucets")
      .select("*, token:tokens(*)")
      .eq("id", faucetId)
      .single();

    if (faucetError || !faucet) {
      return new Response(
        JSON.stringify({ error: "Faucet not found", details: faucetError }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        },
      );
    }

    // Check if faucet is active
    if (!faucet.is_active) {
      return new Response(
        JSON.stringify({ error: "This faucet is not active" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    // Check date restrictions
    const now = new Date();
    if (faucet.start_date && new Date(faucet.start_date) > now) {
      return new Response(
        JSON.stringify({ error: "This faucet is not yet available" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    if (faucet.end_date && new Date(faucet.end_date) < now) {
      return new Response(
        JSON.stringify({ error: "This faucet has expired" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    // Check if user has claimed recently
    const claimIntervalHours = faucet.claim_interval_hours;
    const earliestValidClaim = new Date();
    earliestValidClaim.setHours(
      earliestValidClaim.getHours() - claimIntervalHours,
    );

    const { data: recentClaims, error: claimsError } = await supabaseAdmin
      .from("token_faucet_claims")
      .select("*")
      .eq("user_id", userId)
      .eq("faucet_id", faucetId)
      .gte("claimed_at", earliestValidClaim.toISOString())
      .order("claimed_at", { ascending: false });

    if (claimsError) {
      return new Response(
        JSON.stringify({
          error: "Error checking recent claims",
          details: claimsError,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      );
    }

    if (recentClaims && recentClaims.length > 0) {
      const nextClaimTime = new Date(recentClaims[0].claimed_at);
      nextClaimTime.setHours(nextClaimTime.getHours() + claimIntervalHours);

      return new Response(
        JSON.stringify({
          error: "You have already claimed from this faucet recently",
          nextClaimTime,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    // Check max claims per user if set
    if (faucet.max_claims_per_user) {
      const { count, error: countError } = await supabaseAdmin
        .from("token_faucet_claims")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("faucet_id", faucetId);

      if (countError) {
        return new Response(
          JSON.stringify({
            error: "Error checking claim count",
            details: countError,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          },
        );
      }

      if (count && count >= faucet.max_claims_per_user) {
        return new Response(
          JSON.stringify({
            error:
              "You have reached the maximum number of claims for this faucet",
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          },
        );
      }
    }

    // Start a transaction
    const { data: transaction, error: transactionError } = await supabaseAdmin
      .from("token_transactions")
      .insert({
        user_id: userId,
        token_id: faucet.token_id,
        amount: faucet.amount_per_claim,
        transaction_type: "faucet",
        description: `Claimed from ${faucet.name}`,
      })
      .select()
      .single();

    if (transactionError) {
      return new Response(
        JSON.stringify({
          error: "Failed to create transaction",
          details: transactionError,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      );
    }

    // Record the claim
    const { data: claim, error: claimError } = await supabaseAdmin
      .from("token_faucet_claims")
      .insert({
        user_id: userId,
        faucet_id: faucetId,
        amount: faucet.amount_per_claim,
        transaction_id: transaction.id,
      })
      .select()
      .single();

    if (claimError) {
      return new Response(
        JSON.stringify({
          error: "Failed to record claim",
          details: claimError,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      );
    }

    // Update user token balance
    const { data: userToken, error: userTokenError } = await supabaseAdmin
      .from("user_tokens")
      .select("*")
      .eq("user_id", userId)
      .eq("token_id", faucet.token_id)
      .single();

    if (userTokenError && userTokenError.code !== "PGRST116") {
      // Error other than not found
      return new Response(
        JSON.stringify({
          error: "Failed to check user token balance",
          details: userTokenError,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      );
    }

    if (userToken) {
      // Update existing balance
      const { error: updateError } = await supabaseAdmin
        .from("user_tokens")
        .update({
          balance: userToken.balance + faucet.amount_per_claim,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userToken.id);

      if (updateError) {
        return new Response(
          JSON.stringify({
            error: "Failed to update token balance",
            details: updateError,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          },
        );
      }
    } else {
      // Create new user token record
      const { error: insertError } = await supabaseAdmin
        .from("user_tokens")
        .insert({
          user_id: userId,
          token_id: faucet.token_id,
          balance: faucet.amount_per_claim,
        });

      if (insertError) {
        return new Response(
          JSON.stringify({
            error: "Failed to create token balance",
            details: insertError,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          },
        );
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully claimed ${faucet.amount_per_claim} ${faucet.token.symbol} from ${faucet.name}`,
        amount: faucet.amount_per_claim,
        token: faucet.token,
        transaction: transaction,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error occurred" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
