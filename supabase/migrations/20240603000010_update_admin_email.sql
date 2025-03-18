-- Update system settings
UPDATE public.system_settings
SET value = jsonb_set(
    value,
    '{admin_email}',
    '"Kailaspnair@yahoo.com"'
)
WHERE key = 'general';

-- Update RLS policies for system_settings
DROP POLICY IF EXISTS "Admin full access for system_settings" ON public.system_settings;
CREATE POLICY "Admin full access for system_settings"
    ON public.system_settings FOR ALL
    USING (auth.jwt() ->> 'email' = 'Kailaspnair@yahoo.com');

-- Update RLS policies for withdrawals
DROP POLICY IF EXISTS "Admin full access for withdrawals" ON public.withdrawals;
CREATE POLICY "Admin full access for withdrawals"
    ON public.withdrawals FOR ALL
    USING (auth.jwt() ->> 'email' = 'Kailaspnair@yahoo.com');

-- Update RLS policies for investment_plans
DROP POLICY IF EXISTS "Admin full access for investment_plans" ON public.investment_plans;
CREATE POLICY "Admin full access for investment_plans"
    ON public.investment_plans FOR ALL
    USING (auth.jwt() ->> 'email' = 'Kailaspnair@yahoo.com');

-- Update RLS policies for page_templates
DROP POLICY IF EXISTS "Admin full access" ON public.page_templates;
CREATE POLICY "Admin full access"
    ON public.page_templates FOR ALL
    USING (auth.jwt() ->> 'email' = 'Kailaspnair@yahoo.com');

-- Update RLS policies for tokens
DROP POLICY IF EXISTS "Admins can do everything with tokens" ON public.tokens;
CREATE POLICY "Admins can do everything with tokens"
    ON public.tokens FOR ALL
    USING (auth.jwt() ->> 'email' = 'Kailaspnair@yahoo.com');

-- Update RLS policies for user_tokens
DROP POLICY IF EXISTS "Admins can do everything with user_tokens" ON public.user_tokens;
CREATE POLICY "Admins can do everything with user_tokens"
    ON public.user_tokens FOR ALL
    USING (auth.jwt() ->> 'email' = 'Kailaspnair@yahoo.com');

-- Update RLS policies for token_transactions
DROP POLICY IF EXISTS "Admins can do everything with token_transactions" ON public.token_transactions;
CREATE POLICY "Admins can do everything with token_transactions"
    ON public.token_transactions FOR ALL
    USING (auth.jwt() ->> 'email' = 'Kailaspnair@yahoo.com');

-- Update RLS policies for token_faucets
DROP POLICY IF EXISTS "Admins can do everything with token_faucets" ON public.token_faucets;
CREATE POLICY "Admins can do everything with token_faucets"
    ON public.token_faucets FOR ALL
    USING (auth.jwt() ->> 'email' = 'Kailaspnair@yahoo.com');

-- Update RLS policies for token_faucet_claims
DROP POLICY IF EXISTS "Admins can do everything with token_faucet_claims" ON public.token_faucet_claims;
CREATE POLICY "Admins can do everything with token_faucet_claims"
    ON public.token_faucet_claims FOR ALL
    USING (auth.jwt() ->> 'email' = 'Kailaspnair@yahoo.com');

-- Update RLS policies for token_airdrops
DROP POLICY IF EXISTS "Admins can do everything with token_airdrops" ON public.token_airdrops;
CREATE POLICY "Admins can do everything with token_airdrops"
    ON public.token_airdrops FOR ALL
    USING (auth.jwt() ->> 'email' = 'Kailaspnair@yahoo.com');

-- Update RLS policies for token_airdrop_claims
DROP POLICY IF EXISTS "Admins can do everything with token_airdrop_claims" ON public.token_airdrop_claims;
CREATE POLICY "Admins can do everything with token_airdrop_claims"
    ON public.token_airdrop_claims FOR ALL
    USING (auth.jwt() ->> 'email' = 'Kailaspnair@yahoo.com'); 