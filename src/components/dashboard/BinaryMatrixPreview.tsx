import React, { useState, useEffect } from "react";
import { getBinaryMatrixStats } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Users } from "lucide-react";

interface BinaryMatrixPreviewProps {
  userId?: string;
}

interface LegStats {
  totalMembers: number;
  activeMembers: number;
  volume: number;
  growth: number;
}

const BinaryMatrixPreview = ({ userId }: BinaryMatrixPreviewProps) => {
  const [matrixStats, setMatrixStats] = useState<{
    leftLeg: LegStats;
    rightLeg: LegStats;
  }>({
    leftLeg: { totalMembers: 0, activeMembers: 0, volume: 0, growth: 0 },
    rightLeg: { totalMembers: 0, activeMembers: 0, volume: 0, growth: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatrixStats = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const data = await getBinaryMatrixStats(userId);
        setMatrixStats(data);
      } catch (err: any) {
        setError(err.message || "Failed to load matrix stats");
        console.error("Failed to load matrix stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatrixStats();
  }, [userId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-center mb-4">
          <Skeleton className="h-16 w-16 rounded-full" />
        </div>
        <div className="flex justify-between space-x-4">
          <Skeleton className="h-32 w-full rounded-md" />
          <Skeleton className="h-32 w-full rounded-md" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        <p>Error loading matrix data: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Node */}
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center overflow-hidden">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userId || "user"}`}
              alt="You"
              className="w-full h-full object-cover"
            />
          </div>
          <Badge className="absolute -top-2 -right-2 bg-blue-600">You</Badge>
        </div>
      </div>

      {/* Binary Structure */}
      <div className="relative">
        {/* Connecting Lines */}
        <div className="absolute top-0 left-1/2 w-0.5 h-8 bg-gray-300 -translate-x-1/2"></div>
        <div className="absolute top-8 left-1/4 w-1/2 h-0.5 bg-gray-300"></div>
        <div className="absolute top-8 left-1/4 w-0.5 h-8 bg-gray-300"></div>
        <div className="absolute top-8 left-3/4 w-0.5 h-8 bg-gray-300 -translate-x-full"></div>

        {/* Left and Right Legs */}
        <div className="flex justify-between pt-16">
          {/* Left Leg */}
          <div className="w-[48%]">
            <div className="border border-gray-200 rounded-md p-4 bg-white hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-800">Left Leg</h3>
                <Badge
                  variant="outline"
                  className="border-blue-300 text-blue-700"
                >
                  {matrixStats.leftLeg.totalMembers} members
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-blue-50 p-2 rounded">
                  <div className="flex items-center">
                    <Users className="h-3 w-3 text-blue-600 mr-1" />
                    <p className="text-xs text-gray-500">Active</p>
                  </div>
                  <p className="font-semibold">
                    {matrixStats.leftLeg.activeMembers}
                  </p>
                </div>
                <div className="bg-green-50 p-2 rounded">
                  <div className="flex items-center">
                    <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                    <p className="text-xs text-gray-500">Growth</p>
                  </div>
                  <p className="font-semibold">{matrixStats.leftLeg.growth}%</p>
                </div>
                <div className="col-span-2 bg-purple-50 p-2 rounded">
                  <p className="text-xs text-gray-500">Volume</p>
                  <p className="font-semibold">
                    ${matrixStats.leftLeg.volume.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Leg */}
          <div className="w-[48%]">
            <div className="border border-gray-200 rounded-md p-4 bg-white hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-800">Right Leg</h3>
                <Badge
                  variant="outline"
                  className="border-indigo-300 text-indigo-700"
                >
                  {matrixStats.rightLeg.totalMembers} members
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-blue-50 p-2 rounded">
                  <div className="flex items-center">
                    <Users className="h-3 w-3 text-blue-600 mr-1" />
                    <p className="text-xs text-gray-500">Active</p>
                  </div>
                  <p className="font-semibold">
                    {matrixStats.rightLeg.activeMembers}
                  </p>
                </div>
                <div className="bg-green-50 p-2 rounded">
                  <div className="flex items-center">
                    <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                    <p className="text-xs text-gray-500">Growth</p>
                  </div>
                  <p className="font-semibold">
                    {matrixStats.rightLeg.growth}%
                  </p>
                </div>
                <div className="col-span-2 bg-purple-50 p-2 rounded">
                  <p className="text-xs text-gray-500">Volume</p>
                  <p className="font-semibold">
                    ${matrixStats.rightLeg.volume.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BinaryMatrixPreview;
