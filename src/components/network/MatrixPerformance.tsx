import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { getMatrixPerformance, MatrixPerformance } from '@/lib/matrix';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Users, TrendingUp, DollarSign, Layers, Activity, Scale } from 'lucide-react';

export function MatrixPerformance() {
  const { user } = useAuth();
  const [performance, setPerformance] = useState<MatrixPerformance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadPerformance = async () => {
      try {
        const data = await getMatrixPerformance(user.id);
        setPerformance(data);
      } catch (error) {
        console.error('Error loading matrix performance:', error);
        toast.error('Failed to load matrix performance data');
      } finally {
        setLoading(false);
      }
    };

    loadPerformance();
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

  if (!performance) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No performance data available</p>
      </div>
    );
  }

  const metrics = [
    {
      title: 'Team Size',
      value: performance.total_members,
      active: performance.active_members,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Growth Rate',
      value: `${performance.growth_rate.toFixed(1)}%`,
      active: performance.active_members,
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Volume',
      value: `$${performance.total_volume.toFixed(2)}`,
      active: performance.active_members,
      icon: DollarSign,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Average Level',
      value: performance.average_level.toFixed(1),
      active: performance.active_members,
      icon: Layers,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Active Members',
      value: performance.active_members,
      active: performance.active_members,
      icon: Activity,
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Balance Ratio',
      value: `${performance.balance_ratio.toFixed(1)}%`,
      active: performance.active_members,
      icon: Scale,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.title} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">{metric.title}</h3>
              <p className="text-2xl font-semibold mt-1">{metric.value}</p>
            </div>
            <div className={`p-2 rounded-full ${metric.bgColor}`}>
              <metric.icon className={`h-6 w-6 ${metric.color}`} />
            </div>
          </div>
          {metric.title === 'Team Size' && (
            <p className="text-xs text-gray-500 mt-2">
              {metric.active} active members
            </p>
          )}
        </Card>
      ))}
    </div>
  );
} 