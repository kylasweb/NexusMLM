import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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
      }
    );

    // Create a Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get the request body
    const { airdropId, userIds } = await req.json();

    if (!airdropId || !userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid parameters" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Get the airdrop details
    const { data: airdrop, error: airdropError } = await supabaseAdmin
      .from("token_airdrops")
      .select("*, token:tokens(*)")
      .eq("id", airdropId)
      .single();

    if (airdropError || !airdrop) {
      return new Response(
        JSON.stringify({ error: "Airdrop not found", details: airdropError }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }

    // Check if airdrop is active
    if (!airdrop.is_active) {
      return new Response(
        JSON.stringify({ error: "This airdrop is not active" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Check if airdrop is distribution type
    if (airdrop.airdrop_type !== "distribution") {
      return new Response(
        JSON.stringify({ error: "This airdrop is not a distribution type" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Check date restrictions
    const now = new Date();
    if (airdrop.start_date && new Date(airdrop.start_date) > now) {
      return new Response(
        JSON.stringify({ error: "This airdrop is not yet available" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    if (airdrop.end_date && new Date(airdrop.end_date) < now) {
      return new Response(
        JSON.stringify({ error: "This airdrop has expired" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Check if there's enough remaining in the airdrop
    const totalNeeded = airdrop.amount_per_user * userIds.length;
    const remaining = airdrop.total_amount - airdrop.distributed_amount;

    if (totalNeeded > remaining) {
      return new Response(
        JSON.stringify({
          error: "Not enough tokens remaining in this airdrop",
          remaining,
          needed: totalNeeded,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Process each user
    const results = [];

    for (const userId of userIds) {
      try {
        // Check if user has already claimed
        const { data: existingClaim, error: claimError } = await supabaseAdmin
          .from("token_airdrop_claims")
          .select("*")
          .eq("user_id", userId)
          .eq("airdrop_id", airdropId)
          .maybeSingle();

        if (claimError) {
          results.push({
            userId,
            success: false,
            error: "Error checking existing claim",
            details: claimError,
          });
          continue;
        }

        if (existingClaim) {
          results.push({
            userId,
            success: false,
            error: "User has already received this airdrop",
          });
          continue;
        }

        // Create transaction
        const { data: transaction, error: transactionError } = await supabaseAdmin
          .from("token_transactions")
          .insert({
            user_id: userId,
            token_id: airdrop.token_id,
            amount: airdrop.amount_per_user,
            transaction_type: "airdrop",
            description: `Received from ${airdrop.name} airdrop`,
          })
