-- Create investment_plans table
CREATE TABLE IF NOT EXISTS public.investment_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    min_amount DECIMAL(10, 2) NOT NULL,
    max_amount DECIMAL(10, 2) NOT NULL,
    roi DECIMAL(5, 2) NOT NULL,
    duration INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT valid_status CHECK (status IN ('active', 'inactive')),
    CONSTRAINT valid_amounts CHECK (min_amount > 0 AND max_amount >= min_amount),
    CONSTRAINT valid_roi CHECK (roi > 0),
    CONSTRAINT valid_duration CHECK (duration > 0)
);

-- Enable Row Level Security
ALTER TABLE public.investment_plans ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to active plans"
    ON public.investment_plans
    FOR SELECT
    USING (status = 'active');

CREATE POLICY "Allow admin full access to plans"
    ON public.investment_plans
    FOR ALL
    USING (
        auth.uid() IN (
            SELECT id FROM auth.users
            WHERE email = 'Kailaspnair@yahoo.com'
        )
    );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.investment_plans
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Insert default plans
INSERT INTO public.investment_plans (name, min_amount, max_amount, roi, duration, status)
VALUES
    ('Starter Plan', 100, 500, 5.00, 30, 'active'),
    ('Growth Plan', 500, 2000, 8.00, 60, 'active'),
    ('Premium Plan', 2000, 10000, 12.00, 90, 'active'); 