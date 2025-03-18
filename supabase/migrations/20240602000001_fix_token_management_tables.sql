-- Fix the syntax error in the previous migration by specifying table names for policies

-- Drop existing policies with proper syntax
DROP POLICY IF EXISTS "Admins can do everything with tokens" ON tokens;
DROP POLICY IF EXISTS "Users can view tokens" ON tokens;
DROP POLICY IF EXISTS "Admins can do everything with user_tokens" ON user_tokens;
DROP POLICY IF EXISTS "Users can view their own token balances" ON user_tokens;
DROP POLICY IF EXISTS "Admins can do everything with token_transactions" ON token_transactions;
DROP POLICY IF EXISTS "Users can view their own transactions" ON token_transactions;
DROP POLICY IF EXISTS "Admins can do everything with faucets" ON faucets;
DROP POLICY IF EXISTS "Users can view faucets" ON faucets;
DROP POLICY IF EXISTS "Admins can do everything with faucet_claims" ON faucet_claims;
DROP POLICY IF EXISTS "Users can view their own faucet claims" ON faucet_claims;
DROP POLICY IF EXISTS "Admins can do everything with airdrops" ON airdrops;
DROP POLICY IF EXISTS "Users can view airdrops" ON airdrops;
DROP POLICY IF EXISTS "Admins can do everything with airdrop_claims" ON airdrop_claims;
DROP POLICY IF EXISTS "Users can view their own airdrop claims" ON airdrop_claims;

-- Create policies with proper syntax
CREATE POLICY "Admins can do everything with tokens"
ON tokens
FOR ALL
TO authenticated
USING (auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin'));

CREATE POLICY "Users can view tokens"
ON tokens
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can do everything with user_tokens"
ON user_tokens
FOR ALL
TO authenticated
USING (auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin'));

CREATE POLICY "Users can view their own token balances"
ON user_tokens
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can do everything with token_transactions"
ON token_transactions
FOR ALL
TO authenticated
USING (auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin'));

CREATE POLICY "Users can view their own transactions"
ON token_transactions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can do everything with faucets"
ON faucets
FOR ALL
TO authenticated
USING (auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin'));

CREATE POLICY "Users can view faucets"
ON faucets
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can do everything with faucet_claims"
ON faucet_claims
FOR ALL
TO authenticated
USING (auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin'));

CREATE POLICY "Users can view their own faucet claims"
ON faucet_claims
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can do everything with airdrops"
ON airdrops
FOR ALL
TO authenticated
USING (auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin'));

CREATE POLICY "Users can view airdrops"
ON airdrops
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can do everything with airdrop_claims"
ON airdrop_claims
FOR ALL
TO authenticated
USING (auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin'));

CREATE POLICY "Users can view their own airdrop claims"
ON airdrop_claims
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE tokens;
ALTER PUBLICATION supabase_realtime ADD TABLE user_tokens;
ALTER PUBLICATION supabase_realtime ADD TABLE token_transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE faucets;
ALTER PUBLICATION supabase_realtime ADD TABLE faucet_claims;
ALTER PUBLICATION supabase_realtime ADD TABLE airdrops;
ALTER PUBLICATION supabase_realtime ADD TABLE airdrop_claims;
