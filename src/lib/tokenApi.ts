import { supabase } from "./supabase";

// Error handling wrapper
const handleApiRequest = async <T>(requestFn: () => Promise<T>): Promise<T> => {
  try {
    return await requestFn();
  } catch (error: any) {
    console.error("Token API Error:", error);
    throw new Error(error.message || "An unexpected error occurred");
  }
};

// Token Management
export const getTokens = async () => {
  return handleApiRequest(async () => {
    const { data, error } = await supabase
      .from("tokens")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  });
};

export const getToken = async (tokenId: string) => {
  return handleApiRequest(async () => {
    const { data, error } = await supabase
      .from("tokens")
      .select("*")
      .eq("id", tokenId)
      .single();

    if (error) throw error;
    return data;
  });
};

export const createToken = async (token: any) => {
  return handleApiRequest(async () => {
    const { data, error } = await supabase
      .from("tokens")
      .insert([token])
      .select();

    if (error) throw error;
    return data[0];
  });
};

export const updateToken = async (tokenId: string, updates: any) => {
  return handleApiRequest(async () => {
    const { data, error } = await supabase
      .from("tokens")
      .update(updates)
      .eq("id", tokenId)
      .select();

    if (error) throw error;
    return data[0];
  });
};

// User Token Balances
export const getUserTokens = async (userId: string) => {
  return handleApiRequest(async () => {
    const { data, error } = await supabase
      .from("user_tokens")
      .select("*, token:token_id(*)")
      .eq("user_id", userId);

    if (error) throw error;
    return data;
  });
};

export const updateUserTokenBalance = async (
  userId: string,
  tokenId: string,
  amount: number,
  transactionType: string,
  referenceId?: string,
  description?: string,
) => {
  return handleApiRequest(async () => {
    // Start a transaction
    const { error: txError } = await supabase.rpc("begin");
    if (txError) throw txError;

    try {
      // Get current balance or create if not exists
      const { data: userToken, error: balanceError } = await supabase
        .from("user_tokens")
        .select("*")
        .eq("user_id", userId)
        .eq("token_id", tokenId)
        .maybeSingle();

      if (balanceError) throw balanceError;

      let newBalance = amount;
      if (userToken) {
        newBalance = userToken.balance + amount;
      }

      // Update or insert user token balance
      const { error: updateError } = await supabase.from("user_tokens").upsert({
        user_id: userId,
        token_id: tokenId,
        balance: newBalance,
        updated_at: new Date().toISOString(),
      });

      if (updateError) throw updateError;

      // Record the transaction
      const { data: transaction, error: transactionError } = await supabase
        .from("token_transactions")
        .insert({
          user_id: userId,
          token_id: tokenId,
          amount: amount,
          transaction_type: transactionType,
          reference_id: referenceId,
          description: description,
        })
        .select();

      if (transactionError) throw transactionError;

      // Commit the transaction
      const { error: commitError } = await supabase.rpc("commit");
      if (commitError) throw commitError;

      return transaction[0];
    } catch (error) {
      // Rollback on error
      await supabase.rpc("rollback");
      throw error;
    }
  });
};

// Token Transactions
export const getTokenTransactions = async (userId: string) => {
  return handleApiRequest(async () => {
    const { data, error } = await supabase
      .from("token_transactions")
      .select("*, token:token_id(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  });
};

// Faucet Management
export const getFaucets = async () => {
  return handleApiRequest(async () => {
    const { data, error } = await supabase
      .from("faucets")
      .select("*, token:token_id(*)")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  });
};

export const getFaucet = async (faucetId: string) => {
  return handleApiRequest(async () => {
    const { data, error } = await supabase
      .from("faucets")
      .select("*, token:token_id(*)")
      .eq("id", faucetId)
      .single();

    if (error) throw error;
    return data;
  });
};

export const createFaucet = async (faucet: any) => {
  return handleApiRequest(async () => {
    const { data, error } = await supabase
      .from("faucets")
      .insert([faucet])
      .select();

    if (error) throw error;
    return data[0];
  });
};

export const updateFaucet = async (faucetId: string, updates: any) => {
  return handleApiRequest(async () => {
    const { data, error } = await supabase
      .from("faucets")
      .update(updates)
      .eq("id", faucetId)
      .select();

    if (error) throw error;
    return data[0];
  });
};

export const getUserFaucetClaims = async (userId: string, faucetId: string) => {
  return handleApiRequest(async () => {
    const { data, error } = await supabase
      .from("faucet_claims")
      .select("*")
      .eq("user_id", userId)
      .eq("faucet_id", faucetId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  });
};

export const canUserClaimFaucet = async (userId: string, faucetId: string) => {
  return handleApiRequest(async () => {
    // Get faucet details
    const { data: faucet, error: faucetError } = await supabase
      .from("faucets")
      .select("*")
      .eq("id", faucetId)
      .eq("is_active", true)
      .single();

    if (faucetError) throw faucetError;
    if (!faucet)
      return { canClaim: false, reason: "Faucet not found or inactive" };

    // Check if faucet is within its active period
    const now = new Date();
    if (faucet.start_date && new Date(faucet.start_date) > now) {
      return { canClaim: false, reason: "Faucet not yet active" };
    }
    if (faucet.end_date && new Date(faucet.end_date) < now) {
      return { canClaim: false, reason: "Faucet has expired" };
    }

    // Get user's most recent claim
    const { data: claims, error: claimsError } = await supabase
      .from("faucet_claims")
      .select("*")
      .eq("user_id", userId)
      .eq("faucet_id", faucetId)
      .order("created_at", { ascending: false })
      .limit(1);

    if (claimsError) throw claimsError;

    // Check if user has reached max claims
    if (faucet.max_claims_per_user) {
      const { count, error: countError } = await supabase
        .from("faucet_claims")
        .select("*", { count: "exact" })
        .eq("user_id", userId)
        .eq("faucet_id", faucetId);

      if (countError) throw countError;
      if (count && count >= faucet.max_claims_per_user) {
        return { canClaim: false, reason: "Maximum claims reached" };
      }
    }

    // Check if enough time has passed since last claim
    if (claims && claims.length > 0) {
      const lastClaimDate = new Date(claims[0].created_at);
      const nextClaimDate = new Date(lastClaimDate);
      nextClaimDate.setHours(
        nextClaimDate.getHours() + faucet.claim_interval_hours,
      );

      if (nextClaimDate > now) {
        const timeRemaining = Math.ceil(
          (nextClaimDate.getTime() - now.getTime()) / (1000 * 60),
        );
        return {
          canClaim: false,
          reason: "Cooldown period active",
          nextClaimTime: nextClaimDate.toISOString(),
          timeRemaining: timeRemaining, // in minutes
        };
      }
    }

    return { canClaim: true };
  });
};

export const claimFaucet = async (userId: string, faucetId: string) => {
  return handleApiRequest(async () => {
    // Check if user can claim
    const claimCheck = await canUserClaimFaucet(userId, faucetId);
    if (!claimCheck.canClaim) {
      throw new Error(`Cannot claim faucet: ${claimCheck.reason}`);
    }

    // Get faucet details
    const { data: faucet, error: faucetError } = await supabase
      .from("faucets")
      .select("*")
      .eq("id", faucetId)
      .single();

    if (faucetError) throw faucetError;

    // Start a transaction
    const { error: txError } = await supabase.rpc("begin");
    if (txError) throw txError;

    try {
      // Create transaction record
      const { data: transaction, error: transactionError } = await supabase
        .from("token_transactions")
        .insert({
          user_id: userId,
          token_id: faucet.token_id,
          amount: faucet.amount_per_claim,
          transaction_type: "faucet",
          description: `Claimed from faucet: ${faucet.name}`,
        })
        .select();

      if (transactionError) throw transactionError;

      // Record the claim
      const { data: claim, error: claimError } = await supabase
        .from("faucet_claims")
        .insert({
          user_id: userId,
          faucet_id: faucetId,
          amount: faucet.amount_per_claim,
          transaction_id: transaction[0].id,
        })
        .select();

      if (claimError) throw claimError;

      // Update user's token balance
      const { data: userToken, error: balanceError } = await supabase
        .from("user_tokens")
        .select("*")
        .eq("user_id", userId)
        .eq("token_id", faucet.token_id)
        .maybeSingle();

      if (balanceError) throw balanceError;

      let newBalance = faucet.amount_per_claim;
      if (userToken) {
        newBalance = userToken.balance + faucet.amount_per_claim;
      }

      const { error: updateError } = await supabase.from("user_tokens").upsert({
        user_id: userId,
        token_id: faucet.token_id,
        balance: newBalance,
        updated_at: new Date().toISOString(),
      });

      if (updateError) throw updateError;

      // Commit the transaction
      const { error: commitError } = await supabase.rpc("commit");
      if (commitError) throw commitError;

      return {
        claim: claim[0],
        transaction: transaction[0],
        newBalance: newBalance,
      };
    } catch (error) {
      // Rollback on error
      await supabase.rpc("rollback");
      throw error;
    }
  });
};

// Airdrop Management
export const getAirdrops = async () => {
  return handleApiRequest(async () => {
    const { data, error } = await supabase
      .from("airdrops")
      .select("*, token:token_id(*)")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  });
};

export const getAirdrop = async (airdropId: string) => {
  return handleApiRequest(async () => {
    const { data, error } = await supabase
      .from("airdrops")
      .select("*, token:token_id(*)")
      .eq("id", airdropId)
      .single();

    if (error) throw error;
    return data;
  });
};

export const createAirdrop = async (airdrop: any) => {
  return handleApiRequest(async () => {
    const { data, error } = await supabase
      .from("airdrops")
      .insert([airdrop])
      .select();

    if (error) throw error;
    return data[0];
  });
};

export const updateAirdrop = async (airdropId: string, updates: any) => {
  return handleApiRequest(async () => {
    const { data, error } = await supabase
      .from("airdrops")
      .update(updates)
      .eq("id", airdropId)
      .select();

    if (error) throw error;
    return data[0];
  });
};

export const getUserAirdropClaims = async (userId: string) => {
  return handleApiRequest(async () => {
    const { data, error } = await supabase
      .from("airdrop_claims")
      .select("*, airdrop:airdrop_id(*, token:token_id(*))")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  });
};

export const getUserEligibleAirdrops = async (userId: string) => {
  return handleApiRequest(async () => {
    // Get all active airdrops
    const { data: airdrops, error: airdropsError } = await supabase
      .from("airdrops")
      .select("*, token:token_id(*)")
      .eq("is_active", true)
      .lte("start_date", new Date().toISOString())
      .or(`end_date.is.null,end_date.gte.${new Date().toISOString()}`)
      .eq("airdrop_type", "claim");

    if (airdropsError) throw airdropsError;
    if (!airdrops || airdrops.length === 0) return [];

    // Get user's profile for criteria matching
    const { data: userProfile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError) throw profileError;

    // Get user's existing claims
    const { data: claims, error: claimsError } = await supabase
      .from("airdrop_claims")
      .select("airdrop_id")
      .eq("user_id", userId);

    if (claimsError) throw claimsError;

    // Set of already claimed airdrop IDs
    const claimedAirdropIds = new Set(
      claims?.map((claim) => claim.airdrop_id) || [],
    );

    // Filter airdrops based on criteria and whether they've been claimed
    const eligibleAirdrops = airdrops.filter((airdrop) => {
      // Skip if already claimed
      if (claimedAirdropIds.has(airdrop.id)) return false;

      // If no criteria, user is eligible
      if (!airdrop.criteria) return true;

      // Check each criterion
      const criteria = airdrop.criteria as Record<string, any>;
      let isEligible = true;

      // Check rank criterion
      if (criteria.min_rank && userProfile.rank !== criteria.min_rank) {
        isEligible = false;
      }

      // TODO: Add more criteria checks as needed
      // For example, check referral count, investment amount, etc.

      return isEligible;
    });

    return eligibleAirdrops;
  });
};

export const claimAirdrop = async (userId: string, airdropId: string) => {
  return handleApiRequest(async () => {
    // Get airdrop details
    const { data: airdrop, error: airdropError } = await supabase
      .from("airdrops")
      .select("*")
      .eq("id", airdropId)
      .eq("is_active", true)
      .single();

    if (airdropError) throw airdropError;
    if (!airdrop) throw new Error("Airdrop not found or inactive");

    // Check if airdrop is within its active period
    const now = new Date();
    if (airdrop.start_date && new Date(airdrop.start_date) > now) {
      throw new Error("Airdrop not yet active");
    }
    if (airdrop.end_date && new Date(airdrop.end_date) < now) {
      throw new Error("Airdrop has expired");
    }

    // Check if user has already claimed this airdrop
    const { count, error: countError } = await supabase
      .from("airdrop_claims")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .eq("airdrop_id", airdropId);

    if (countError) throw countError;
    if (count && count > 0) {
      throw new Error("You have already claimed this airdrop");
    }

    // Start a transaction
    const { error: txError } = await supabase.rpc("begin");
    if (txError) throw txError;

    try {
      // Create transaction record
      const { data: transaction, error: transactionError } = await supabase
        .from("token_transactions")
        .insert({
          user_id: userId,
          token_id: airdrop.token_id,
          amount: airdrop.amount_per_user,
          transaction_type: "airdrop",
          reference_id: airdropId,
          description: `Claimed airdrop: ${airdrop.name}`,
        })
        .select();

      if (transactionError) throw transactionError;

      // Record the claim
      const { data: claim, error: claimError } = await supabase
        .from("airdrop_claims")
        .insert({
          user_id: userId,
          airdrop_id: airdropId,
          amount: airdrop.amount_per_user,
          transaction_id: transaction[0].id,
        })
        .select();

      if (claimError) throw claimError;

      // Update user's token balance
      const { data: userToken, error: balanceError } = await supabase
        .from("user_tokens")
        .select("*")
        .eq("user_id", userId)
        .eq("token_id", airdrop.token_id)
        .maybeSingle();

      if (balanceError) throw balanceError;

      let newBalance = airdrop.amount_per_user;
      if (userToken) {
        newBalance = userToken.balance + airdrop.amount_per_user;
      }

      const { error: updateError } = await supabase.from("user_tokens").upsert({
        user_id: userId,
        token_id: airdrop.token_id,
        balance: newBalance,
        updated_at: new Date().toISOString(),
      });

      if (updateError) throw updateError;

      // Commit the transaction
      const { error: commitError } = await supabase.rpc("commit");
      if (commitError) throw commitError;

      return {
        claim: claim[0],
        transaction: transaction[0],
        newBalance: newBalance,
      };
    } catch (error) {
      // Rollback on error
      await supabase.rpc("rollback");
      throw error;
    }
  });
};

// Admin functions for distributing airdrops
export const distributeAirdrop = async (
  airdropId: string,
  userIds: string[],
) => {
  return handleApiRequest(async () => {
    // Get airdrop details
    const { data: airdrop, error: airdropError } = await supabase
      .from("airdrops")
      .select("*")
      .eq("id", airdropId)
      .eq("is_active", true)
      .single();

    if (airdropError) throw airdropError;
    if (!airdrop) throw new Error("Airdrop not found or inactive");

    // Process each user
    const results = [];
    for (const userId of userIds) {
      try {
        // Check if user has already claimed this airdrop
        const { count, error: countError } = await supabase
          .from("airdrop_claims")
          .select("*", { count: "exact" })
          .eq("user_id", userId)
          .eq("airdrop_id", airdropId);

        if (countError) throw countError;
        if (count && count > 0) {
          results.push({
            userId,
            success: false,
            message: "User has already claimed this airdrop",
          });
          continue;
        }

        // Start a transaction
        const { error: txError } = await supabase.rpc("begin");
        if (txError) throw txError;

        try {
          // Create transaction record
          const { data: transaction, error: transactionError } = await supabase
            .from("token_transactions")
            .insert({
              user_id: userId,
              token_id: airdrop.token_id,
              amount: airdrop.amount_per_user,
              transaction_type: "airdrop",
              reference_id: airdropId,
              description: `Received airdrop: ${airdrop.name}`,
            })
            .select();

          if (transactionError) throw transactionError;

          // Record the claim
          const { data: claim, error: claimError } = await supabase
            .from("airdrop_claims")
            .insert({
              user_id: userId,
              airdrop_id: airdropId,
              amount: airdrop.amount_per_user,
              transaction_id: transaction[0].id,
            })
            .select();

          if (claimError) throw claimError;

          // Update user's token balance
          const { data: userToken, error: balanceError } = await supabase
            .from("user_tokens")
            .select("*")
            .eq("user_id", userId)
            .eq("token_id", airdrop.token_id)
            .maybeSingle();

          if (balanceError) throw balanceError;

          let newBalance = airdrop.amount_per_user;
          if (userToken) {
            newBalance = userToken.balance + airdrop.amount_per_user;
          }

          const { error: updateError } = await supabase
            .from("user_tokens")
            .upsert({
              user_id: userId,
              token_id: airdrop.token_id,
              balance: newBalance,
              updated_at: new Date().toISOString(),
            });

          if (updateError) throw updateError;

          // Commit the transaction
          const { error: commitError } = await supabase.rpc("commit");
          if (commitError) throw commitError;

          results.push({
            userId,
            success: true,
            claim: claim[0],
            transaction: transaction[0],
          });
        } catch (error: any) {
          // Rollback on error
          await supabase.rpc("rollback");
          results.push({
            userId,
            success: false,
            message: error.message || "Failed to process airdrop",
          });
        }
      } catch (error: any) {
        results.push({
          userId,
          success: false,
          message: error.message || "Failed to process airdrop",
        });
      }
    }

    return results;
  });
};
