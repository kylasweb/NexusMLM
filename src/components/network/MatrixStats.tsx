import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { getMatrixStats, MatrixStats as MatrixStatsType } from '@/lib/matrix';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export function MatrixStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<MatrixStatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadStats = async () => {
      try {
        const matrixStats = await getMatrixStats(user.id);
        setStats(matrixStats);
      } catch (error) {
        console.error('Error loading matrix stats:', error);
        toast.error('Failed to load matrix statistics');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No matrix statistics available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-500">Team Size</h3>
        <div className="mt-2 flex justify-between">
          <div>
            <p className="text-xs text-gray-500">Left Leg</p>
            <p className="text-2xl font-semibold">{stats.left_leg_count}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Right Leg</p>
            <p className="text-2xl font-semibold">{stats.right_leg_count}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-500">Team Volume</h3>
        <div className="mt-2 flex justify-between">
          <div>
            <p className="text-xs text-gray-500">Left Leg</p>
            <p className="text-2xl font-semibold">${stats.left_leg_volume.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Right Leg</p>
            <p className="text-2xl font-semibold">${stats.right_leg_volume.toFixed(2)}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-500">Matrix Status</h3>
        <div className="mt-2">
          <p className="text-xs text-gray-500">Weaker Leg</p>
          <p className="text-2xl font-semibold capitalize">{stats.weaker_leg}</p>
          <p className="text-xs text-gray-500 mt-2">Total Volume</p>
          <p className="text-2xl font-semibold">${stats.total_volume.toFixed(2)}</p>
        </div>
      </Card>
    </div>
  );
} 