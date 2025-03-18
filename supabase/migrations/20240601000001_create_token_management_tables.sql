-- Create tokens table
CREATE TABLE IF NOT EXISTS tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  symbol VARCHAR(50) NOT NULL,
  total_supply DECIMAL(24, 8) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  description TEXT,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

-- Create user_tokens table to track token balances
CREATE TABLE IF NOT EXISTS user_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  token_id UUID NOT NULL REFERENCES tokens(id),
  balance DECIMAL(24, 8) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, token_id)
);

-- Create token_transactions table
CREATE TABLE IF NOT EXISTS token_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  token_id UUID NOT NULL REFERENCES tokens(id),
  amount DECIMAL(24, 8) NOT NULL,
  transaction_type VARCHAR(50) NOT NULL, -- 'deposit', 'withdrawal', 'airdrop', 'faucet', 'referral_bonus'
  reference_id UUID, -- Optional reference to another entity (e.g., airdrop_id, faucet_id)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  description TEXT,
  status VARCHAR(50) DEFAULT 'completed'
);

-- Create faucets table
CREATE TABLE IF NOT EXISTS faucets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  token_id UUID NOT NULL REFERENCES tokens(id),
  amount_per_claim DECIMAL(24, 8) NOT NULL,
  claim_interval_hours INTEGER NOT NULL, -- Hours between claims
  max_claims_per_user INTEGER, -- NULL means unlimited
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE, -- NULL means no end date
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT TRUE,
  description TEXT
);

-- Create faucet_claims table
CREATE TABLE IF NOT EXISTS faucet_claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  faucet_id UUID NOT NULL REFERENCES faucets(id),
  amount DECIMAL(24, 8) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  transaction_id UUID REFERENCES token_transactions(id)
);

-- Create airdrops table
CREATE TABLE IF NOT EXISTS airdrops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  token_id UUID NOT NULL REFERENCES tokens(id),
  total_amount DECIMAL(24, 8) NOT NULL,
  amount_per_user DECIMAL(24, 8) NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE, -- NULL means no end date
  criteria JSONB, -- JSON object with criteria like {"min_referrals": 5, "min_rank": "Gold"}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT TRUE,
  description TEXT,
  airdrop_type VARCHAR(50) DEFAULT 'automatic' -- 'automatic', 'manual', 'claim'
);

-- Create airdrop_claims table
CREATE TABLE IF NOT EXISTS airdrop_claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  airdrop_id UUID NOT NULL REFERENCES airdrops(id),
  amount DECIMAL(24, 8) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  transaction_id UUID REFERENCES token_transactions(id),
  status VARCHAR(50) DEFAULT 'completed'
);

-- Enable RLS on all tables
ALTER TABLE tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE faucets ENABLE ROW LEVEL SECURITY;
ALTER TABLE faucet_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE airdrops ENABLE ROW LEVEL SECURITY;
ALTER TABLE airdrop_claims ENABLE ROW LEVEL SECURITY;

-- Create policies for tokens table
DROP POLICY IF EXISTS "Admins can do everything with tokens" ON tokens;
CREATE POLICY "Admins can do everything with tokens"
  ON tokens
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin'));

DROP POLICY IF EXISTS "Users can view tokens" ON tokens;
CREATE POLICY "Users can view tokens"
  ON tokens
  FOR SELECT
  USING (is_active = true);

-- Create policies for user_tokens table
DROP POLICY IF EXISTS "Users can view their own token balances" ON user_tokens;
CREATE POLICY "Users can view their own token balances"
  ON user_tokens
  FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can do everything with user_tokens" ON user_tokens;
CREATE POLICY "Admins can do everything with user_tokens"
  ON user_tokens
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin'));

-- Create policies for token_transactions table
DROP POLICY IF EXISTS "Users can view their own transactions" ON token_transactions;
CREATE POLICY "Users can view their own transactions"
  ON token_transactions
  FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can do everything with token_transactions" ON token_transactions;
CREATE POLICY "Admins can do everything with token_transactions"
  ON token_transactions
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin'));

-- Create policies for faucets table
DROP POLICY IF EXISTS "Users can view active faucets" ON faucets;
CREATE POLICY "Users can view active faucets"
  ON faucets
  FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins can do everything with faucets" ON faucets;
CREATE POLICY "Admins can do everything with faucets"
  ON faucets
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin'));

-- Create policies for faucet_claims table
DROP POLICY IF EXISTS "Users can view their own faucet claims" ON faucet_claims;
CREATE POLICY "Users can view their own faucet claims"
  ON faucet_claims
  FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can do everything with faucet_claims" ON faucet_claims;
CREATE POLICY "Admins can do everything with faucet_claims"
  ON faucet_claims
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin'));

-- Create policies for airdrops table
DROP POLICY IF EXISTS "Users can view active airdrops" ON airdrops;
CREATE POLICY "Users can view active airdrops"
  ON airdrops
  FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins can do everything with airdrops" ON airdrops;
CREATE POLICY "Admins can do everything with airdrops"
  ON airdrops
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin'));

-- Create policies for airdrop_claims table
DROP POLICY IF EXISTS "Users can view their own airdrop claims" ON airdrop_claims;
CREATE POLICY "Users can view their own airdrop claims"
  ON airdrop_claims
  FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can do everything with airdrop_claims" ON airdrop_claims;
CREATE POLICY "Admins can do everything with airdrop_claims"
  ON airdrop_claims
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin'));

-- Enable realtime for all tables
alter publication supabase_realtime add table tokens;
alter publication supabase_realtime add table user_tokens;
alter publication supabase_realtime add table token_transactions;
alter publication supabase_realtime add table faucets;
alter publication supabase_realtime add table faucet_claims;
alter publication supabase_realtime add table airdrops;
alter publication supabase_realtime add table airdrop_claims;