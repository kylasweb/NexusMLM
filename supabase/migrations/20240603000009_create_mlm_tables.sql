-- Create referrals table
CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID NOT NULL REFERENCES public.users(id),
    referred_id UUID NOT NULL REFERENCES public.users(id),
    level INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(referred_id)
);

-- Create binary_matrix table
CREATE TABLE IF NOT EXISTS public.binary_matrix (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id),
    parent_id UUID REFERENCES public.users(id),
    position TEXT NOT NULL CHECK (position IN ('left', 'right')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id)
);

-- Create user_investments table
CREATE TABLE IF NOT EXISTS public.user_investments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id),
    plan_id UUID NOT NULL REFERENCES public.investment_plans(id),
    amount DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    start_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create commissions table
CREATE TABLE IF NOT EXISTS public.commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id),
    amount DECIMAL(10,2) NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('referral', 'binary', 'matching', 'leadership')),
    source_id UUID NOT NULL,
    source_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create kyc_verifications table
CREATE TABLE IF NOT EXISTS public.kyc_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id),
    document_type TEXT NOT NULL,
    document_number TEXT NOT NULL,
    document_front_url TEXT NOT NULL,
    document_back_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    rejection_reason TEXT,
    verified_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create ranks table
CREATE TABLE IF NOT EXISTS public.ranks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    level INTEGER NOT NULL,
    requirements JSONB NOT NULL,
    benefits JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create user_ranks table
CREATE TABLE IF NOT EXISTS public.user_ranks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id),
    rank_id UUID NOT NULL REFERENCES public.ranks(id),
    achieved_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, rank_id)
);

-- Enable Row Level Security
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.binary_matrix ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ranks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_ranks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for referrals
CREATE POLICY "Users can view their own referrals"
    ON public.referrals FOR SELECT
    USING (referrer_id = auth.uid());

CREATE POLICY "Admins can do everything with referrals"
    ON public.referrals FOR ALL
    USING (auth.jwt() ->> 'email' = 'Kailaspnair@yahoo.com');

-- Create RLS policies for binary_matrix
CREATE POLICY "Users can view their own matrix position"
    ON public.binary_matrix FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Admins can do everything with binary_matrix"
    ON public.binary_matrix FOR ALL
    USING (auth.jwt() ->> 'email' = 'Kailaspnair@yahoo.com');

-- Create RLS policies for user_investments
CREATE POLICY "Users can view their own investments"
    ON public.user_investments FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Admins can do everything with user_investments"
    ON public.user_investments FOR ALL
    USING (auth.jwt() ->> 'email' = 'Kailaspnair@yahoo.com');

-- Create RLS policies for commissions
CREATE POLICY "Users can view their own commissions"
    ON public.commissions FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Admins can do everything with commissions"
    ON public.commissions FOR ALL
    USING (auth.jwt() ->> 'email' = 'Kailaspnair@yahoo.com');

-- Create RLS policies for kyc_verifications
CREATE POLICY "Users can view their own KYC verification"
    ON public.kyc_verifications FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Admins can do everything with kyc_verifications"
    ON public.kyc_verifications FOR ALL
    USING (auth.jwt() ->> 'email' = 'Kailaspnair@yahoo.com');

-- Create RLS policies for ranks
CREATE POLICY "Public read access for ranks"
    ON public.ranks FOR SELECT
    USING (true);

CREATE POLICY "Admins can do everything with ranks"
    ON public.ranks FOR ALL
    USING (auth.jwt() ->> 'email' = 'Kailaspnair@yahoo.com');

-- Create RLS policies for user_ranks
CREATE POLICY "Users can view their own ranks"
    ON public.user_ranks FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Admins can do everything with user_ranks"
    ON public.user_ranks FOR ALL
    USING (auth.jwt() ->> 'email' = 'Kailaspnair@yahoo.com');

-- Add updated_at triggers
CREATE TRIGGER handle_referrals_updated_at
    BEFORE UPDATE ON public.referrals
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_binary_matrix_updated_at
    BEFORE UPDATE ON public.binary_matrix
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_user_investments_updated_at
    BEFORE UPDATE ON public.user_investments
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_commissions_updated_at
    BEFORE UPDATE ON public.commissions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_kyc_verifications_updated_at
    BEFORE UPDATE ON public.kyc_verifications
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_ranks_updated_at
    BEFORE UPDATE ON public.ranks
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_user_ranks_updated_at
    BEFORE UPDATE ON public.user_ranks
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Insert default ranks
INSERT INTO public.ranks (name, level, requirements, benefits)
VALUES
    ('Bronze', 1, '{"min_investment": 100, "min_referrals": 2}', '{"referral_bonus": 5, "binary_bonus": 2}'),
    ('Silver', 2, '{"min_investment": 500, "min_referrals": 5}', '{"referral_bonus": 7, "binary_bonus": 3}'),
    ('Gold', 3, '{"min_investment": 1000, "min_referrals": 10}', '{"referral_bonus": 10, "binary_bonus": 5}'),
    ('Platinum', 4, '{"min_investment": 5000, "min_referrals": 20}', '{"referral_bonus": 12, "binary_bonus": 7}'),
    ('Diamond', 5, '{"min_investment": 10000, "min_referrals": 50}', '{"referral_bonus": 15, "binary_bonus": 10}')
ON CONFLICT DO NOTHING; 