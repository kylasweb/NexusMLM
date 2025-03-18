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
    .rpc('get_matrix_tree', { user_id: userId });

  if (error) throw error;
  return data;
}

export async function rebalanceMatrix(userId: string): Promise<void> {
  const { error } = await supabase
    .rpc('rebalance_matrix', { user_id: userId });

  if (error) throw error;
}

export async function getMatrixOverflow(userId: string): Promise<MatrixPosition[]> {
  const { data, error } = await supabase
    .rpc('get_matrix_overflow', { user_id: userId });

  if (error) throw error;
  return data;
} 