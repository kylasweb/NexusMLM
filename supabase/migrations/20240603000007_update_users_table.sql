-- Add missing columns to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS rank TEXT DEFAULT 'Bronze',
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS kyc_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS address TEXT;

-- Add constraints
ALTER TABLE public.users
ADD CONSTRAINT valid_status CHECK (status IN ('active', 'inactive', 'suspended')),
ADD CONSTRAINT valid_rank CHECK (rank IN ('Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'));

-- Update RLS policies
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
CREATE POLICY "Users can view their own data"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
CREATE POLICY "Users can update their own data"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can do everything with users" ON public.users;
CREATE POLICY "Admins can do everything with users"
  ON public.users FOR ALL
  USING (auth.jwt() ->> 'email' = 'Kailaspnair@yahoo.com');

-- Update existing admin user
UPDATE public.users
SET rank = 'Diamond',
    status = 'active',
    kyc_verified = true
WHERE email = 'Kailaspnair@yahoo.com'; 