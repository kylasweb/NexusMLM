import { supabase } from "./supabase";

export interface MatrixPosition {
  id: string;
  user_id: string;
  parent_id: string | null;
  position: 'left' | 'right';
  level: number;
  created_at: string;
  updated_at: string;
}

export interface MatrixStats {
  left_leg_count: number;
  right_leg_count: number;
  left_leg_volume: number;
  right_leg_volume: number;
  weaker_leg: 'left' | 'right';
  total_volume: number;
}

export interface MatrixPerformance {
  total_members: number;
  active_members: number;
  total_volume: number;
  average_level: number;
  growth_rate: number;
  balance_ratio: number;
}

export interface MatrixOverflow {
  id: string;
  user_id: string;
  original_parent_id: string;
  new_parent_id: string | null;
  position: 'left' | 'right';
  level: number;
  status: 'pending' | 'processed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface MatrixRebalanceHistory {
  id: string;
  user_id: string;
  old_parent_id: string;
  new_parent_id: string;
  position: 'left' | 'right';
  level: number;
  reason: string;
  created_at: string;
}

export async function getMatrixPosition(userId: string): Promise<MatrixPosition | null> {
  const { data, error } = await supabase
    .from('matrix_positions')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function getMatrixStats(userId: string): Promise<MatrixStats> {
  const { data, error } = await supabase
    .rpc('get_matrix_stats', { user_id: userId });

  if (error) throw error;
  return data;
}

export async function addToMatrix(
  userId: string,
  parentId: string,
  position: 'left' | 'right'
): Promise<MatrixPosition> {
  const parent = await getMatrixPosition(parentId);
  if (!parent) throw new Error('Parent position not found');

  const { data, error } = await supabase
    .from('matrix_positions')
    .insert({
      user_id: userId,
      parent_id: parentId,
      position,
      level: parent.level + 1
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function calculateMatrixCommission(
  userId: string,
  amount: number
): Promise<number> {
  const stats = await getMatrixStats(userId);
  const commissionRate = 0.1; // 10% commission rate

  // Calculate commission based on weaker leg
  const commission = Math.min(
    stats.left_leg_volume,
    stats.right_leg_volume
  ) * commissionRate;

  return commission;
}

export async function updateMatrixVolume(
  userId: string,
  amount: number
): Promise<void> {
  const { error } = await supabase
    .rpc('update_matrix_volume', {
      user_id: userId,
      volume_amount: amount
    });

  if (error) throw error;
}

export async function getMatrixTree(userId: string): Promise<MatrixPosition[]> {
  const { data, error } = await supabase
    .from('binary_matrix')
    .select(`
      id,
      user_id,
      parent_id,
      position,
      level,
      created_at,
      updated_at
    `)
    .eq('user_id', userId)
    .order('level', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getMatrixPerformance(userId: string): Promise<MatrixPerformance> {
  const { data, error } = await supabase
    .rpc('get_matrix_performance', { user_id: userId });

  if (error) throw error;
  return data;
}

export async function getMatrixOverflow(userId: string): Promise<MatrixOverflow[]> {
  const { data, error } = await supabase
    .from('matrix_overflow')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getMatrixRebalanceHistory(userId: string): Promise<MatrixRebalanceHistory[]> {
  const { data, error } = await supabase
    .from('matrix_rebalance_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function handleMatrixOverflow(userId: string): Promise<void> {
  const { error } = await supabase
    .rpc('handle_matrix_overflow', { user_id: userId });

  if (error) throw error;
}

export async function rebalanceMatrix(userId: string): Promise<void> {
  const { error } = await supabase
    .rpc('rebalance_matrix', { p_user_id: userId });
    
  if (error) throw error;
}

export async function processMatrixOverflow(userId: string, overflowId: string): Promise<void> {
  const { error } = await supabase
    .from('matrix_overflow')
    .update({ status: 'processed' })
    .eq('id', overflowId)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function placeInMatrix(
  userId: string,
  sponsorId: string
): Promise<MatrixPosition> {
  // Find the best position in the sponsor's downline
  const { data: sponsorPosition } = await supabase
    .from('binary_matrix')
    .select('*')
    .eq('user_id', sponsorId)
    .single();

  if (!sponsorPosition) {
    throw new Error('Sponsor not found in matrix');
  }

  // Find the first available position in the sponsor's downline
  const position = await findFirstAvailablePosition(sponsorPosition.id);
  
  const { data, error } = await supabase
    .from('binary_matrix')
    .insert({
      user_id: userId,
      parent_id: position.parentId,
      position: position.side,
      level: position.level
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function findFirstAvailablePosition(startNodeId: string): Promise<{
  parentId: string;
  side: 'left' | 'right';
  level: number;
}> {
  const queue: string[] = [startNodeId];
  
  while (queue.length > 0) {
    const currentNodeId = queue.shift()!;
    
    // Check left and right positions
    const { data: children } = await supabase
      .from('binary_matrix')
      .select('*')
      .eq('parent_id', currentNodeId);
      
    const hasLeft = children?.some(child => child.position === 'left');
    const hasRight = children?.some(child => child.position === 'right');
    
    if (!hasLeft) {
      return {
        parentId: currentNodeId,
        side: 'left',
        level: (children?.[0]?.level || 1) + 1
      };
    }
    
    if (!hasRight) {
      return {
        parentId: currentNodeId,
        side: 'right',
        level: (children?.[0]?.level || 1) + 1
      };
    }
    
    // Add children to queue
    children?.forEach(child => queue.push(child.id));
  }
  
  throw new Error('No available position found');
}

export async function calculateMatrixCommissions(userId: string): Promise<number> {
  const { data: stats } = await supabase
    .rpc('calculate_matrix_stats', { p_user_id: userId });
    
  if (!stats) return 0;
  
  const weaker_leg_volume = Math.min(
    stats.left_leg_volume || 0,
    stats.right_leg_volume || 0
  );
  
  // Apply commission rate (10%)
  return weaker_leg_volume * 0.1;
}
