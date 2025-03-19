import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { getMatrixTree, MatrixPosition } from '@/lib/matrix';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Search, Filter, ZoomIn, ZoomOut, Info } from 'lucide-react';

interface MatrixNode extends MatrixPosition {
  children: MatrixNode[];
  expanded: boolean;
}

export function EnhancedMatrixVisualization() {
  const { user } = useAuth();
  const [matrixData, setMatrixData] = useState<MatrixNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [maxLevel, setMaxLevel] = useState(7);
  const [zoom, setZoom] = useState(1);
  const [selectedNode, setSelectedNode] = useState<MatrixNode | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadMatrixData();
  }, [user]);

  const loadMatrixData = async () => {
    try {
      const data = await getMatrixTree(user.id);
      const treeData = buildTree(data);
      setMatrixData(treeData);
    } catch (error) {
      console.error('Error loading matrix data:', error);
      toast.error('Failed to load matrix data');
    } finally {
      setLoading(false);
    }
  };

  const buildTree = (positions: MatrixPosition[]): MatrixNode[] => {
    const map = new Map<string, MatrixNode>();
    const roots: MatrixNode[] = [];

    // First pass: create nodes
    positions.forEach(pos => {
      map.set(pos.id, { ...pos, children: [], expanded: true });
    });

    // Second pass: build tree structure
    positions.forEach(pos => {
      const node = map.get(pos.id)!;
      if (pos.parent_id) {
        const parent = map.get(pos.parent_id);
        if (parent) {
          parent.children.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    return roots;
  };

  const toggleNode = (nodeId: string) => {
    const toggle = (nodes: MatrixNode[]): MatrixNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, expanded: !node.expanded };
        }
        return {
          ...node,
          children: toggle(node.children)
        };
      });
    };

    setMatrixData(toggle(matrixData));
  };

  const filterNodes = (nodes: MatrixNode[], query: string): MatrixNode[] => {
    if (!query) return nodes;
    
    return nodes.filter(node => {
      const matches = node.user_id.toLowerCase().includes(query.toLowerCase());
      const children = filterNodes(node.children, query);
      if (children.length > 0) {
        node.children = children;
        return true;
      }
      return matches;
    });
  };

  const renderNode = (node: MatrixNode, level: number = 0) => {
    if (level > maxLevel) return null;
    
    const filteredChildren = node.expanded
      ? filterNodes(node.children, searchQuery)
      : [];

    return (
      <div key={node.id} className="relative">
        <div
          className={`
            mx-2 p-2 rounded-lg cursor-pointer transition-all
            ${node.children.length > 0 ? 'bg-blue-50 hover:bg-blue-100' : 'bg-gray-50'}
            ${searchQuery && node.user_id.toLowerCase().includes(searchQuery.toLowerCase()) ? 'ring-2 ring-blue-500' : ''}
          `}
          style={{ transform: `scale(${zoom})` }}
          onClick={() => {
            setSelectedNode(node);
            setShowDetails(true);
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                {node.user_id.slice(0, 2).toUpperCase()}
              </div>
              <div className="ml-2">
                <p className="text-sm font-medium">Level {node.level}</p>
                <p className="text-xs text-gray-500">{node.position}</p>
              </div>
            </div>
            {node.children.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNode(node.id);
                }}
              >
                {node.expanded ? '−' : '+'}
              </Button>
            )}
          </div>
        </div>

        {node.expanded && filteredChildren.length > 0 && (
          <div className="flex justify-center mt-2">
            <div className="border-t-2 border-gray-200 w-full" />
          </div>
        )}

        <div className="flex justify-center space-x-4">
          {filteredChildren.map((child, index) => (
            <div key={child.id} className="relative">
              {index > 0 && (
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gray-200 transform -translate-y-1/2" />
              )}
              {renderNode(child, level + 1)}
            </div>
          ))}
        </div>
      </div>
    );
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500">Max Level:</span>
            <Slider
              value={[maxLevel]}
              onValueChange={([value]) => setMaxLevel(value)}
              min={1}
              max={7}
              step={1}
              className="w-32"
            />
            <span className="text-sm text-gray-500">{maxLevel}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.min(2, zoom + 0.1))}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="p-4 overflow-x-auto">
        <div className="min-w-full">
          {matrixData.map((node) => renderNode(node))}
        </div>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Member Details</DialogTitle>
          </DialogHeader>
          {selectedNode && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-semibold">
                  {selectedNode.user_id.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-medium">User ID: {selectedNode.user_id}</h3>
                  <p className="text-sm text-gray-500">
                    Level {selectedNode.level} • {selectedNode.position} Position
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Direct Referrals</p>
                  <p className="text-lg font-semibold">{selectedNode.children.length}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Join Date</p>
                  <p className="text-lg font-semibold">
                    {new Date(selectedNode.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 