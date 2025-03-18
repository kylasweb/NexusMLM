-- Create tokens table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  symbol TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  total_supply NUMERIC(38, 8) NOT NULL DEFAULT 0,
  decimals INTEGER NOT NULL DEFAULT 8,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES public.users(id),
  updated_at TIMESTAMPTZ
);

-- Create user_tokens table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  token_id UUID NOT NULL REFERENCES public.tokens(id) ON DELETE CASCADE,
  balance NUMERIC(38, 8) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  UNIQUE(user_id, token_id)
);

-- Create token_transactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.token_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  token_id UUID NOT NULL REFERENCES public.tokens(id) ON DELETE CASCADE,
  amount NUMERIC(38, 8) NOT NULL,
  transaction_type TEXT NOT NULL,
  reference_id UUID,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Create token_faucets table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.token_faucets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  token_id UUID NOT NULL REFERENCES public.tokens(id) ON DELETE CASCADE,
  amount_per_claim NUMERIC(38, 8) NOT NULL,
  claim_interval_hours INTEGER NOT NULL,
  max_claims_per_user INTEGER,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES public.users(id),
  updated_at TIMESTAMPTZ
);

-- Create token_faucet_claims table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.token_faucet_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  faucet_id UUID NOT NULL REFERENCES public.token_faucets(id) ON DELETE CASCADE,
  claimed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  amount NUMERIC(38, 8) NOT NULL,
  transaction_id UUID REFERENCES public.token_transactions(id),
  UNIQUE(user_id, faucet_id, claimed_at)
);

-- Create token_airdrops table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.token_airdrops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  token_id UUID NOT NULL REFERENCES public.tokens(id) ON DELETE CASCADE,
  amount_per_user NUMERIC(38, 8) NOT NULL,
  total_amount NUMERIC(38, 8) NOT NULL,
  distributed_amount NUMERIC(38, 8) NOT NULL DEFAULT 0,
  airdrop_type TEXT NOT NULL,
  criteria JSONB,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES public.users(id),
  updated_at TIMESTAMPTZ
);

-- Create token_airdrop_claims table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.token_airdrop_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  airdrop_id UUID NOT NULL REFERENCES public.token_airdrops(id) ON DELETE CASCADE,
  claimed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  amount NUMERIC(38, 8) NOT NULL,
  transaction_id UUID REFERENCES public.token_transactions(id),
  UNIQUE(user_id, airdrop_id)
);

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.tokens;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_tokens;
ALTER PUBLICATION supabase_realtime ADD TABLE public.token_transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.token_faucets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.token_faucet_claims;
ALTER PUBLICATION supabase_realtime ADD TABLE public.token_airdrops;
ALTER PUBLICATION supabase_realtime ADD TABLE public.token_airdrop_claims;
