-- Create matrix_positions table
CREATE TABLE IF NOT EXISTS public.matrix_positions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.matrix_positions(id) ON DELETE SET NULL,
    position TEXT CHECK (position IN ('left', 'right')),
    level INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create matrix_volumes table
CREATE TABLE IF NOT EXISTS public.matrix_volumes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    left_leg_volume DECIMAL(20,2) DEFAULT 0,
    right_leg_volume DECIMAL(20,2) DEFAULT 0,
    total_volume DECIMAL(20,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.matrix_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matrix_volumes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own matrix position"
    ON public.matrix_positions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own matrix volume"
    ON public.matrix_volumes FOR SELECT
    USING (auth.uid() = user_id);

-- Create functions for matrix operations
CREATE OR REPLACE FUNCTION public.get_matrix_stats(user_id UUID)
RETURNS TABLE (
    left_leg_count BIGINT,
    right_leg_count BIGINT,
    left_leg_volume DECIMAL(20,2),
    right_leg_volume DECIMAL(20,2),
    weaker_leg TEXT,
    total_volume DECIMAL(20,2)
) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE matrix_tree AS (
        SELECT id, user_id, parent_id, position, level, 1 as depth
        FROM public.matrix_positions
        WHERE user_id = $1
        UNION ALL
        SELECT mp.id, mp.user_id, mp.parent_id, mp.position, mp.level, mt.depth + 1
        FROM public.matrix_positions mp
        JOIN matrix_tree mt ON mp.parent_id = mt.id
    )
    SELECT
        COUNT(*) FILTER (WHERE position = 'left') as left_leg_count,
        COUNT(*) FILTER (WHERE position = 'right') as right_leg_count,
        COALESCE(SUM(mv.left_leg_volume), 0) as left_leg_volume,
        COALESCE(SUM(mv.right_leg_volume), 0) as right_leg_volume,
        CASE 
            WHEN COALESCE(SUM(mv.left_leg_volume), 0) <= COALESCE(SUM(mv.right_leg_volume), 0)
            THEN 'left'
            ELSE 'right'
        END as weaker_leg,
        COALESCE(SUM(mv.total_volume), 0) as total_volume
    FROM matrix_tree mt
    LEFT JOIN public.matrix_volumes mv ON mt.user_id = mv.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.update_matrix_volume(
    user_id UUID,
    volume_amount DECIMAL(20,2)
)
RETURNS void AS $$
BEGIN
    UPDATE public.matrix_volumes
    SET 
        left_leg_volume = left_leg_volume + volume_amount,
        total_volume = total_volume + volume_amount,
        updated_at = NOW()
    WHERE user_id = $1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_matrix_tree(user_id UUID)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    parent_id UUID,
    position TEXT,
    level INTEGER
) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE matrix_tree AS (
        SELECT id, user_id, parent_id, position, level
        FROM public.matrix_positions
        WHERE user_id = $1
        UNION ALL
        SELECT mp.id, mp.user_id, mp.parent_id, mp.position, mp.level
        FROM public.matrix_positions mp
        JOIN matrix_tree mt ON mp.parent_id = mt.id
    )
    SELECT * FROM matrix_tree;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.rebalance_matrix(user_id UUID)
RETURNS void AS $$
BEGIN
    -- Implement matrix rebalancing logic here
    -- This is a placeholder for the actual implementation
    NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_matrix_overflow(user_id UUID)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    parent_id UUID,
    position TEXT,
    level INTEGER
) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE matrix_tree AS (
        SELECT id, user_id, parent_id, position, level
        FROM public.matrix_positions
        WHERE user_id = $1
        UNION ALL
        SELECT mp.id, mp.user_id, mp.parent_id, mp.position, mp.level
        FROM public.matrix_positions mp
        JOIN matrix_tree mt ON mp.parent_id = mt.id
    )
    SELECT * FROM matrix_tree
    WHERE level > 7; -- Assuming max level is 7
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 