import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { getMatrixTree, MatrixPosition } from '@/lib/matrix';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface MatrixNode {
  position: MatrixPosition;
  children: MatrixNode[];
}

export function MatrixVisualization() {
  const { user } = useAuth();
  const [matrixData, setMatrixData] = useState<MatrixNode | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadMatrixData = async () => {
      try {
        const positions = await getMatrixTree(user.id);
        const tree = buildMatrixTree(positions);
        setMatrixData(tree);
      } catch (error) {
        console.error('Error loading matrix data:', error);
        toast.error('Failed to load matrix data');
      } finally {
        setLoading(false);
      }
    };

    loadMatrixData();
  }, [user]);

  const buildMatrixTree = (positions: MatrixPosition[]): MatrixNode | null => {
    if (!positions.length) return null;

    const root = positions.find(p => !p.parent_id);
    if (!root) return null;

    const buildNode = (position: MatrixPosition): MatrixNode => {
      const children = positions
        .filter(p => p.parent_id === position.id)
        .map(p => buildNode(p));

      return {
        position,
        children
      };
    };

    return buildNode(root);
  };

  const renderMatrixNode = (node: MatrixNode, level: number = 0) => {
    return (
      <div key={node.position.id} className="flex flex-col items-center">
        <Card className="p-4 mb-4 w-48">
          <div className="text-sm font-medium">
            Level {node.position.level}
          </div>
          <div className="text-xs text-gray-500">
            Position: {node.position.position}
          </div>
        </Card>
        {node.children.length > 0 && (
          <div className="flex space-x-8">
            {node.children.map(child => renderMatrixNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!matrixData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No matrix data available</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-max p-4">
        {renderMatrixNode(matrixData)}
      </div>
    </div>
  );
} 