
-- Update admin policies to use role-based checks
DO $$ 
DECLARE
    table_name text;
    policy_name text;
BEGIN
    FOR table_name IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
    LOOP
        FOR policy_name IN
            SELECT policyname 
            FROM pg_policies 
            WHERE schemaname = 'public' 
            AND tablename = table_name
        LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', policy_name, table_name);
            EXECUTE format('CREATE POLICY %I ON public.%I FOR ALL USING (auth.jwt() ->> ''role'' = ''admin'')', policy_name, table_name);
        END LOOP;
    END LOOP;
END $$; 
