import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDirectReferrals, getBinaryMatrixStats } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Network, Users, ChevronDown, ChevronUp, Search } from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";
import { MatrixVisualization } from './MatrixVisualization';
import { MatrixStats } from './MatrixStats';

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  rank: string;
  active: boolean;
  joinDate: string;
  referrals: number;
}

interface LegStats {
  totalMembers: number;
  activeMembers: number;
  volume: number;
  growth: number;
}

const NetworkVisualization = () => {
  const [directReferrals, setDirectReferrals] = useState<TeamMember[]>([]);
  const [matrixStats, setMatrixStats] = useState<{
    leftLeg: LegStats;
    rightLeg: LegStats;
  }>({
    leftLeg: { totalMembers: 0, activeMembers: 0, volume: 0, growth: 0 },
    rightLeg: { totalMembers: 0, activeMembers: 0, volume: 0, growth: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedLevel, setExpandedLevel] = useState<number | null>(1);
  const { user } = useAuth();

  useEffect(() => {
    const fetchNetworkData = async () => {
      if (!user) return;

      try {
        const [referralsData, statsData] = await Promise.all([
          getDirectReferrals(user.id),
          getBinaryMatrixStats(user.id),
        ]);

        setDirectReferrals(referralsData);
        setMatrixStats(statsData);
      } catch (err: any) {
        setError(err.message || "Failed to load network data");
      } finally {
        setLoading(false);
      }
    };

    fetchNetworkData();
  }, [user]);

  const toggleLevel = (level: number) => {
    if (expandedLevel === level) {
      setExpandedLevel(null);
    } else {
      setExpandedLevel(level);
    }
  };

  // Generate mock data for deeper levels
  const generateMockLevelData = (level: number, parentId: string) => {
    // In a real app, this would be fetched from the backend
    const mockData = [];
    const count = Math.max(0, 5 - level); // Fewer members in deeper levels

    for (let i = 0; i < count; i++) {
      mockData.push({
        id: `${parentId}-${level}-${i}`,
        name: `Team Member ${i + 1}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${parentId}-${level}-${i}`,
        rank: ["Bronze", "Silver", "Gold"][Math.floor(Math.random() * 3)],
        active: Math.random() > 0.3,
        joinDate: new Date(Date.now() - Math.random() * 10000000000)
          .toISOString()
          .split("T")[0],
        referrals: Math.floor(Math.random() * 5),
      });
    }

    return mockData;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <svg
              className="animate-spin h-10 w-10 text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="mt-4 text-gray-600">Loading your network data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Network Visualization</h1>
          <p className="text-gray-500">View and manage your team structure</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <Tabs defaultValue="binary" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="binary">
              <Network className="mr-2 h-4 w-4" /> Binary Matrix
            </TabsTrigger>
            <TabsTrigger value="team">
              <Users className="mr-2 h-4 w-4" /> Team Members
            </TabsTrigger>
          </TabsList>

          <TabsContent value="binary" className="space-y-6">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Matrix Statistics</h2>
                <MatrixStats />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Matrix Structure</h2>
                <MatrixVisualization />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            {/* Team Members List */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Team Members</CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search members..."
                      className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {directReferrals.length > 0 ? (
                    directReferrals.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800 text-lg">
                              {member.name}
                            </h4>
                            <div className="flex items-center mt-1">
                              <Badge
                                className={
                                  member.active ? "bg-green-500" : "bg-gray-400"
                                }
                              >
                                {member.active ? "Active" : "Inactive"}
                              </Badge>
                              <span className="text-xs text-gray-500 ml-2">
                                Joined {member.joinDate}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant="outline"
                            className="mb-2 border-blue-300 text-blue-700 px-3 py-1"
                          >
                            {member.rank}
                          </Badge>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                            <Button size="sm">Contact</Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="rounded-full bg-blue-100 p-3 mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                        <Users className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        No Team Members Yet
                      </h3>
                      <p className="text-gray-500 max-w-md mx-auto mb-6">
                        You haven't added any team members to your network yet.
                        Start building your team by inviting new members.
                      </p>
                      <Button>
                        <Users className="mr-2 h-4 w-4" /> Invite New Members
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default NetworkVisualization;
