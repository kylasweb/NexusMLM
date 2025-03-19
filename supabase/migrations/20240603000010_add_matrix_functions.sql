-- Function to calculate matrix stats
CREATE OR REPLACE FUNCTION public.calculate_matrix_stats(p_user_id UUID)
RETURNS TABLE (
  left_leg_volume NUMERIC,
  right_leg_volume NUMERIC,
  total_volume NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE downline AS (
    -- Base case: direct downline
    SELECT 
      id,
      user_id,
      parent_id,
      position,
      1 as level
    FROM binary_matrix
    WHERE parent_id = p_user_id
    
    UNION ALL
    
    -- Recursive case: rest of downline
    SELECT 
      bm.id,
      bm.user_id,
      bm.parent_id,
      bm.position,
      d.level + 1
    FROM binary_matrix bm
    INNER JOIN downline d ON d.id = bm.parent_id
  )
  SELECT 
    COALESCE(SUM(CASE WHEN position = 'left' THEN volume ELSE 0 END), 0) as left_leg_volume,
    COALESCE(SUM(CASE WHEN position = 'right' THEN volume ELSE 0 END), 0) as right_leg_volume,
    COALESCE(SUM(volume), 0) as total_volume
  FROM downline d
  LEFT JOIN user_volumes uv ON uv.user_id = d.user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to rebalance matrix
CREATE OR REPLACE FUNCTION public.rebalance_matrix(p_user_id UUID)
RETURNS void AS $$
BEGIN
  -- Implementation depends on your specific rebalancing rules
  -- This is a placeholder for the actual implementation
  NULL;
END;
$$ LANGUAGE plpgsql;