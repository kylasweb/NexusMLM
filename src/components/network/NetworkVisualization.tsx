import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDirectReferrals, getBinaryMatrixStats } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Network, Users, ChevronDown, ChevronUp, Search } from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";

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
            {/* Binary Matrix Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Binary Matrix Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center mb-8">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center overflow-hidden">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || "user"}`}
                        alt="You"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Badge className="absolute -top-2 -right-2 bg-blue-600">
                      You
                    </Badge>
                  </div>
                </div>

                {/* Binary Structure */}
                <div className="relative mb-8">
                  {/* Connecting Lines */}
                  <div className="absolute top-0 left-1/2 w-0.5 h-8 bg-gray-300 -translate-x-1/2"></div>
                  <div className="absolute top-8 left-1/4 w-1/2 h-0.5 bg-gray-300"></div>
                  <div className="absolute top-8 left-1/4 w-0.5 h-8 bg-gray-300"></div>
                  <div className="absolute top-8 left-3/4 w-0.5 h-8 bg-gray-300 -translate-x-full"></div>

                  {/* Left and Right Legs */}
                  <div className="flex justify-between pt-16">
                    {/* Left Leg */}
                    <div className="w-[48%]">
                      <Card className="border-l-4 border-blue-500">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold text-gray-800">
                              Left Leg
                            </h3>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-blue-50 p-2 rounded">
                              <p className="text-xs text-gray-500">Members</p>
                              <p className="font-semibold">
                                {matrixStats.leftLeg.totalMembers}
                              </p>
                            </div>
                            <div className="bg-green-50 p-2 rounded">
                              <p className="text-xs text-gray-500">Active</p>
                              <p className="font-semibold">
                                {matrixStats.leftLeg.activeMembers}
                              </p>
                            </div>
                            <div className="bg-purple-50 p-2 rounded">
                              <p className="text-xs text-gray-500">Volume</p>
                              <p className="font-semibold">
                                ${matrixStats.leftLeg.volume.toLocaleString()}
                              </p>
                            </div>
                            <div className="bg-amber-50 p-2 rounded">
                              <p className="text-xs text-gray-500">Growth</p>
                              <p className="font-semibold">
                                {matrixStats.leftLeg.growth}%
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Right Leg */}
                    <div className="w-[48%]">
                      <Card className="border-r-4 border-indigo-500">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold text-gray-800">
                              Right Leg
                            </h3>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-blue-50 p-2 rounded">
                              <p className="text-xs text-gray-500">Members</p>
                              <p className="font-semibold">
                                {matrixStats.rightLeg.totalMembers}
                              </p>
                            </div>
                            <div className="bg-green-50 p-2 rounded">
                              <p className="text-xs text-gray-500">Active</p>
                              <p className="font-semibold">
                                {matrixStats.rightLeg.activeMembers}
                              </p>
                            </div>
                            <div className="bg-purple-50 p-2 rounded">
                              <p className="text-xs text-gray-500">Volume</p>
                              <p className="font-semibold">
                                ${matrixStats.rightLeg.volume.toLocaleString()}
                              </p>
                            </div>
                            <div className="bg-amber-50 p-2 rounded">
                              <p className="text-xs text-gray-500">Growth</p>
                              <p className="font-semibold">
                                {matrixStats.rightLeg.growth}%
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>

                {/* Matrix Levels */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Matrix Levels</h3>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <Card key={level} className="overflow-hidden">
                        <div
                          className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer"
                          onClick={() => toggleLevel(level)}
                        >
                          <h4 className="font-medium">Level {level}</h4>
                          <div className="flex items-center">
                            <Badge className="mr-2 bg-blue-100 text-blue-800">
                              {level === 1
                                ? directReferrals.length
                                : Math.floor(Math.random() * 10) + 1}{" "}
                              members
                            </Badge>
                            {expandedLevel === level ? (
                              <ChevronUp className="h-5 w-5 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-500" />
                            )}
                          </div>
                        </div>
                        {expandedLevel === level && (
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              {level === 1 ? (
                                directReferrals.length > 0 ? (
                                  directReferrals.map((member) => (
                                    <div
                                      key={member.id}
                                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                    >
                                      <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                                          <img
                                            src={member.avatar}
                                            alt={member.name}
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                        <div>
                                          <h4 className="font-medium text-gray-800">
                                            {member.name}
                                          </h4>
                                          <div className="flex items-center">
                                            <Badge
                                              className={
                                                member.active
                                                  ? "bg-green-500"
                                                  : "bg-gray-400"
                                              }
                                            >
                                              {member.active
                                                ? "Active"
                                                : "Inactive"}
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
                                          className="mb-1 border-blue-300 text-blue-700"
                                        >
                                          {member.rank}
                                        </Badge>
                                        <p className="text-xs text-gray-500">
                                          {member.referrals} referrals
                                        </p>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-center py-4 text-gray-500">
                                    No team members at this level yet.
                                  </div>
                                )
                              ) : (
                                // Mock data for deeper levels
                                generateMockLevelData(
                                  level,
                                  user?.id || "user",
                                ).map((member) => (
                                  <div
                                    key={member.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                  >
                                    <div className="flex items-center">
                                      <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                                        <img
                                          src={member.avatar}
                                          alt={member.name}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <div>
                                        <h4 className="font-medium text-gray-800">
                                          {member.name}
                                        </h4>
                                        <div className="flex items-center">
                                          <Badge
                                            className={
                                              member.active
                                                ? "bg-green-500"
                                                : "bg-gray-400"
                                            }
                                          >
                                            {member.active
                                              ? "Active"
                                              : "Inactive"}
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
                                        className="mb-1 border-blue-300 text-blue-700"
                                      >
                                        {member.rank}
                                      </Badge>
                                      <p className="text-xs text-gray-500">
                                        {member.referrals} referrals
                                      </p>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
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
