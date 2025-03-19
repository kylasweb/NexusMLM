import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { getMatrixOverflow, getMatrixRebalanceHistory, MatrixOverflow, MatrixRebalanceHistory, handleMatrixOverflow, rebalanceMatrix } from '@/lib/matrix';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { AlertCircle, RefreshCw, CheckCircle } from 'lucide-react';

export function MatrixOverflow() {
  const { user } = useAuth();
  const [overflow, setOverflow] = useState<MatrixOverflow[]>([]);
  const [history, setHistory] = useState<MatrixRebalanceHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const [overflowData, historyData] = await Promise.all([
        getMatrixOverflow(user.id),
        getMatrixRebalanceHistory(user.id)
      ]);
      setOverflow(overflowData);
      setHistory(historyData);
    } catch (error) {
      console.error('Error loading matrix data:', error);
      toast.error('Failed to load matrix data');
    } finally {
      setLoading(false);
    }
  };

  const handleOverflow = async (overflowId: string) => {
    try {
      await handleMatrixOverflow(user.id, overflowId);
      toast.success('Overflow position processed successfully');
      loadData();
    } catch (error) {
      console.error('Error processing overflow:', error);
      toast.error('Failed to process overflow position');
    }
  };

  const handleRebalance = async () => {
    try {
      await rebalanceMatrix(user.id);
      toast.success('Matrix rebalanced successfully');
      loadData();
    } catch (error) {
      console.error('Error rebalancing matrix:', error);
      toast.error('Failed to rebalance matrix');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Matrix Overflow</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRebalance}
            disabled={overflow.length === 0}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Rebalance Matrix
          </Button>
        </div>

        {overflow.length === 0 ? (
          <div className="text-center py-4">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-gray-500">No overflow positions to process</p>
          </div>
        ) : (
          <div className="space-y-4">
            {overflow.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">Position: {item.position}</p>
                  <p className="text-sm text-gray-500">Level: {item.level}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOverflow(item.id)}
                >
                  Process
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Rebalance History</h3>
        {history.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500">No rebalance history available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Position: {item.position}</p>
                    <p className="text-sm text-gray-500">Level: {item.level}</p>
                  </div>
                  <AlertCircle className="h-5 w-5 text-blue-500" />
                </div>
                <p className="text-sm text-gray-600 mt-2">{item.reason}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
} 