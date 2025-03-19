
-- Add admin user to auth.users table
DO $$
DECLARE
  admin_id UUID := gen_random_uuid();
BEGIN
  -- Insert into auth.users with role
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, role)
  VALUES (
    admin_id,
    'Kailaspnair@yahoo.com',
    crypt('@Cargo123#', gen_salt('bf')),
    now(),
    now(),
    now(),
    'admin'  -- Set the role to admin
  );
  
  -- Create public.users table if it doesn't exist first
  CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
  );
  
  -- Insert into public.users table with role
  INSERT INTO public.users (id, email, full_name, created_at, role)
  VALUES (admin_id, 'Kailaspnair@yahoo.com', 'Admin User', now(), 'admin');
END
$$;
