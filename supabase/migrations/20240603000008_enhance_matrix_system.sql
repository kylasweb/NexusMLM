-- Add matrix_overflow table
CREATE TABLE IF NOT EXISTS public.matrix_overflow (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    original_parent_id UUID REFERENCES public.matrix_positions(id) ON DELETE SET NULL,
    new_parent_id UUID REFERENCES public.matrix_positions(id) ON DELETE SET NULL,
    position TEXT CHECK (position IN ('left', 'right')),
    level INTEGER NOT NULL,
    status TEXT CHECK (status IN ('pending', 'processed', 'failed')) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add matrix_rebalance_history table
CREATE TABLE IF NOT EXISTS public.matrix_rebalance_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    old_parent_id UUID REFERENCES public.matrix_positions(id) ON DELETE SET NULL,
    new_parent_id UUID REFERENCES public.matrix_positions(id) ON DELETE SET NULL,
    position TEXT CHECK (position IN ('left', 'right')),
    level INTEGER NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.matrix_overflow ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matrix_rebalance_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own matrix overflow"
    ON public.matrix_overflow FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own rebalance history"
    ON public.matrix_rebalance_history FOR SELECT
    USING (auth.uid() = user_id);

-- Enhanced rebalance_matrix function
CREATE OR REPLACE FUNCTION public.rebalance_matrix(user_id UUID)
RETURNS void AS $$
DECLARE
    max_level INTEGER := 7;
    overflow_positions RECORD;
BEGIN
    -- Find positions that exceed max level
    FOR overflow_positions IN
        SELECT mp.*, mv.left_leg_volume, mv.right_leg_volume
        FROM public.matrix_positions mp
        JOIN public.matrix_volumes mv ON mp.user_id = mv.user_id
        WHERE mp.user_id = $1 AND mp.level > max_level
    LOOP
        -- Find new parent with available position
        WITH available_parents AS (
            SELECT mp.*
            FROM public.matrix_positions mp
            WHERE mp.user_id = $1 
            AND mp.level <= max_level
            AND (
                (mp.position = 'left' AND mp.left_leg_volume <= mp.right_leg_volume)
                OR (mp.position = 'right' AND mp.right_leg_volume <= mp.left_leg_volume)
            )
        )
        UPDATE public.matrix_positions mp
        SET 
            parent_id = (
                SELECT id 
                FROM available_parents 
                ORDER BY level DESC, 
                    CASE 
                        WHEN position = 'left' THEN left_leg_volume
                        ELSE right_leg_volume
                    END ASC
                LIMIT 1
            ),
            level = (
                SELECT level + 1
                FROM available_parents 
                ORDER BY level DESC
                LIMIT 1
            )
        WHERE mp.id = overflow_positions.id
        RETURNING mp.id, mp.parent_id INTO overflow_positions.id, overflow_positions.parent_id;

        -- Record rebalance history
        INSERT INTO public.matrix_rebalance_history (
            user_id,
            old_parent_id,
            new_parent_id,
            position,
            level,
            reason
        ) VALUES (
            $1,
            overflow_positions.parent_id,
            overflow_positions.id,
            overflow_positions.position,
            overflow_positions.level,
            'Level exceeded maximum allowed'
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle matrix overflow
CREATE OR REPLACE FUNCTION public.handle_matrix_overflow(user_id UUID)
RETURNS void AS $$
DECLARE
    max_level INTEGER := 7;
    overflow_positions RECORD;
BEGIN
    -- Find positions that exceed max level
    FOR overflow_positions IN
        SELECT mp.*
        FROM public.matrix_positions mp
        WHERE mp.user_id = $1 AND mp.level > max_level
    LOOP
        -- Insert into overflow table
        INSERT INTO public.matrix_overflow (
            user_id,
            original_parent_id,
            position,
            level,
            status
        ) VALUES (
            $1,
            overflow_positions.parent_id,
            overflow_positions.position,
            overflow_positions.level,
            'pending'
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get matrix performance metrics
CREATE OR REPLACE FUNCTION public.get_matrix_performance(user_id UUID)
RETURNS TABLE (
    total_members BIGINT,
    active_members BIGINT,
    total_volume DECIMAL(20,2),
    average_level DECIMAL(10,2),
    growth_rate DECIMAL(10,2),
    balance_ratio DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    WITH matrix_data AS (
        SELECT 
            COUNT(*) as total_count,
            COUNT(*) FILTER (WHERE EXISTS (
                SELECT 1 FROM public.matrix_volumes mv 
                WHERE mv.user_id = mp.user_id AND mv.total_volume > 0
            )) as active_count,
            COALESCE(SUM(mv.total_volume), 0) as total_vol,
            AVG(level) as avg_level,
            COUNT(*) FILTER (WHERE level = 1) as direct_referrals,
            COALESCE(SUM(mv.left_leg_volume), 0) as left_vol,
            COALESCE(SUM(mv.right_leg_volume), 0) as right_vol
        FROM public.matrix_positions mp
        LEFT JOIN public.matrix_volumes mv ON mp.user_id = mv.user_id
        WHERE mp.user_id = $1
    )
    SELECT 
        total_count,
        active_count,
        total_vol,
        avg_level,
        CASE 
            WHEN direct_referrals > 0 
            THEN (active_count::DECIMAL / direct_referrals::DECIMAL) * 100
            ELSE 0
        END as growth_rate,
        CASE 
            WHEN total_vol > 0 
            THEN LEAST(left_vol, right_vol)::DECIMAL / GREATEST(left_vol, right_vol)::DECIMAL * 100
            ELSE 0
        END as balance_ratio
    FROM matrix_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 