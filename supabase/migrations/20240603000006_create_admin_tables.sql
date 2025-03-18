-- Create system_settings table
CREATE TABLE IF NOT EXISTS public.system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create withdrawals table
CREATE TABLE IF NOT EXISTS public.withdrawals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    amount DECIMAL(10,2) NOT NULL,
    method TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT valid_status CHECK (status IN ('pending', 'completed', 'rejected'))
);

-- Create investment_plans table
CREATE TABLE IF NOT EXISTS public.investment_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    min_amount DECIMAL(10,2) NOT NULL,
    max_amount DECIMAL(10,2) NOT NULL,
    roi_percentage DECIMAL(5,2) NOT NULL,
    duration_days INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT valid_status CHECK (status IN ('active', 'inactive'))
);

-- Enable Row Level Security
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_plans ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public read access for system_settings"
    ON public.system_settings FOR SELECT
    USING (true);

CREATE POLICY "Admin full access for system_settings"
    ON public.system_settings FOR ALL
    USING (auth.jwt() ->> 'email' = 'admin@example.com');

CREATE POLICY "Users can view their own withdrawals"
    ON public.withdrawals FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Admin full access for withdrawals"
    ON public.withdrawals FOR ALL
    USING (auth.jwt() ->> 'email' = 'admin@example.com');

CREATE POLICY "Public read access for investment_plans"
    ON public.investment_plans FOR SELECT
    USING (true);

CREATE POLICY "Admin full access for investment_plans"
    ON public.investment_plans FOR ALL
    USING (auth.jwt() ->> 'email' = 'admin@example.com');

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER handle_system_settings_updated_at
    BEFORE UPDATE ON public.system_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_withdrawals_updated_at
    BEFORE UPDATE ON public.withdrawals
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_investment_plans_updated_at
    BEFORE UPDATE ON public.investment_plans
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Insert default system settings
INSERT INTO public.system_settings (key, value)
VALUES 
('general', '{
    "site_name": "MLM Matrix",
    "admin_email": "admin@example.com",
    "currency": "USD",
    "timezone": "UTC",
    "require_kyc": "yes",
    "min_withdrawal": "50",
    "withdrawal_fee": "2.5",
    "enable_2fa": "no"
}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Insert default investment plans
INSERT INTO public.investment_plans (name, min_amount, max_amount, roi_percentage, duration_days)
VALUES 
('Starter', 100, 1000, 5.00, 30),
('Professional', 1000, 5000, 7.50, 60),
('Enterprise', 5000, 50000, 10.00, 90)
ON CONFLICT DO NOTHING; 