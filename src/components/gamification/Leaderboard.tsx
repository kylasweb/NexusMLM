import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Award,
  TrendingUp,
  Users,
  Calendar,
  Trophy,
  Target,
} from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";

const Leaderboard = () => {
  const [period, setPeriod] = useState("weekly");

  // Mock data for leaderboards
  const referralLeaders = [
    {
      id: "1",
      name: "John Doe",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      rank: "Diamond",
      score: 24,
      change: "+3",
      trend: "up",
    },
    {
      id: "2",
      name: "Jane Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
      rank: "Platinum",
      score: 18,
      change: "+2",
      trend: "up",
    },
    {
      id: "3",
      name: "Robert Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=robert",
      rank: "Gold",
      score: 15,
      change: "-1",
      trend: "down",
    },
    {
      id: "4",
      name: "Emily Davis",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
      rank: "Gold",
      score: 12,
      change: "+5",
      trend: "up",
    },
    {
      id: "5",
      name: "Michael Wilson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
      rank: "Silver",
      score: 10,
      change: "0",
      trend: "neutral",
    },
  ];

  const investmentLeaders = [
    {
      id: "6",
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      rank: "Diamond",
      score: "$45,250",
      change: "+$5,000",
      trend: "up",
    },
    {
      id: "7",
      name: "David Brown",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
      rank: "Platinum",
      score: "$32,800",
      change: "+$3,200",
      trend: "up",
    },
    {
      id: "8",
      name: "Lisa Taylor",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa",
      rank: "Diamond",
      score: "$28,500",
      change: "-$1,500",
      trend: "down",
    },
    {
      id: "9",
      name: "James Anderson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=james",
      rank: "Gold",
      score: "$21,750",
      change: "+$4,250",
      trend: "up",
    },
    {
      id: "10",
      name: "Patricia Martinez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=patricia",
      rank: "Silver",
      score: "$18,300",
      change: "+$2,100",
      trend: "up",
    },
  ];

  const teamGrowthLeaders = [
    {
      id: "11",
      name: "Thomas Wilson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=thomas",
      rank: "Platinum",
      score: "142 members",
      change: "+18",
      trend: "up",
    },
    {
      id: "12",
      name: "Jennifer Garcia",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jennifer",
      rank: "Diamond",
      score: "128 members",
      change: "+12",
      trend: "up",
    },
    {
      id: "13",
      name: "Christopher Lee",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=christopher",
      rank: "Gold",
      score: "95 members",
      change: "+8",
      trend: "up",
    },
    {
      id: "14",
      name: "Jessica Rodriguez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jessica",
      rank: "Gold",
      score: "87 members",
      change: "-3",
      trend: "down",
    },
    {
      id: "15",
      name: "Daniel Martinez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=daniel",
      rank: "Silver",
      score: "64 members",
      change: "+5",
      trend: "up",
    },
  ];

  // Mock active challenges
  const activeChallenges = [
    {
      id: "1",
      title: "Referral Sprint",
      description: "Refer 5 new members in the next 7 days",
      reward: "$250 Bonus",
      progress: 60,
      endDate: "2023-09-30",
      icon: <Users className="h-10 w-10 text-blue-600" />,
    },
    {
      id: "2",
      title: "Investment Challenge",
      description: "Reach $10,000 in team investment volume",
      reward: "2% Extra Commission",
      progress: 75,
      endDate: "2023-10-15",
      icon: <TrendingUp className="h-10 w-10 text-green-600" />,
    },
    {
      id: "3",
      title: "Rank Up Challenge",
      description: "Help 3 team members advance to Silver rank",
      reward: "Exclusive Training Access",
      progress: 33,
      endDate: "2023-10-31",
      icon: <Award className="h-10 w-10 text-purple-600" />,
    },
  ];

  const getTrendIcon = (trend: string) => {
    if (trend === "up")
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend === "down")
      return (
        <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />
      );
    return null;
  };

  const getTrendClass = (trend: string) => {
    if (trend === "up") return "text-green-600";
    if (trend === "down") return "text-red-600";
    return "text-gray-600";
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Leaderboards & Challenges</h1>
          <p className="text-gray-500">
            Compete with other members and earn rewards
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Trophy className="mr-2 h-5 w-5 text-amber-500" /> Your Rankings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-amber-600 mr-2" />
                    <span className="font-medium">Referrals Leaderboard</span>
                  </div>
                  <div>
                    <Badge className="bg-amber-100 text-amber-800">
                      Rank #8
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-medium">Investment Leaderboard</span>
                  </div>
                  <div>
                    <Badge className="bg-green-100 text-green-800">
                      Rank #12
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-medium">Team Growth Leaderboard</span>
                  </div>
                  <div>
                    <Badge className="bg-blue-100 text-blue-800">
                      Rank #15
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5 text-purple-500" /> Challenge
                Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeChallenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {challenge.title}
                      </h4>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" /> Ends{" "}
                        {challenge.endDate}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div
                          className="bg-purple-600 h-2.5 rounded-full"
                          style={{ width: `${challenge.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <Badge className="ml-4 bg-purple-100 text-purple-800">
                      {challenge.progress}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="referrals" className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="referrals">
                <Users className="mr-2 h-4 w-4" /> Referrals
              </TabsTrigger>
              <TabsTrigger value="investments">
                <TrendingUp className="mr-2 h-4 w-4" /> Investments
              </TabsTrigger>
              <TabsTrigger value="team-growth">
                <Users className="mr-2 h-4 w-4" /> Team Growth
              </TabsTrigger>
            </TabsList>

            <div className="flex space-x-2">
              <Button
                variant={period === "weekly" ? "default" : "outline"}
                size="sm"
                onClick={() => setPeriod("weekly")}
              >
                Weekly
              </Button>
              <Button
                variant={period === "monthly" ? "default" : "outline"}
                size="sm"
                onClick={() => setPeriod("monthly")}
              >
                Monthly
              </Button>
              <Button
                variant={period === "alltime" ? "default" : "outline"}
                size="sm"
                onClick={() => setPeriod("alltime")}
              >
                All Time
              </Button>
            </div>
          </div>

          <TabsContent value="referrals">
            <Card>
              <CardHeader>
                <CardTitle>Top Referrers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rank
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Member
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Level
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Referrals
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Change
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {referralLeaders.map((leader, index) => (
                        <tr key={leader.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                              <span className="font-bold text-gray-700">
                                {index + 1}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-3">
                                <AvatarImage src={leader.avatar} />
                                <AvatarFallback>
                                  {leader.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="font-medium text-gray-900">
                                {leader.name}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge
                              variant="outline"
                              className="border-blue-300 text-blue-700"
                            >
                              {leader.rank}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {leader.score}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className={`flex items-center ${getTrendClass(leader.trend)}`}
                            >
                              {getTrendIcon(leader.trend)}
                              <span className="ml-1">{leader.change}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="investments">
            <Card>
              <CardHeader>
                <CardTitle>Top Investors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rank
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Member
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Level
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Investment Volume
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Change
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {investmentLeaders.map((leader, index) => (
                        <tr key={leader.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                              <span className="font-bold text-gray-700">
                                {index + 1}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-3">
                                <AvatarImage src={leader.avatar} />
                                <AvatarFallback>
                                  {leader.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="font-medium text-gray-900">
                                {leader.name}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge
                              variant="outline"
                              className="border-blue-300 text-blue-700"
                            >
                              {leader.rank}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {leader.score}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className={`flex items-center ${getTrendClass(leader.trend)}`}
                            >
                              {getTrendIcon(leader.trend)}
                              <span className="ml-1">{leader.change}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team-growth">
            <Card>
              <CardHeader>
                <CardTitle>Team Growth Leaders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rank
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Member
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Level
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Team Size
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Change
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {teamGrowthLeaders.map((leader, index) => (
                        <tr key={leader.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                              <span className="font-bold text-gray-700">
                                {index + 1}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-3">
                                <AvatarImage src={leader.avatar} />
                                <AvatarFallback>
                                  {leader.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="font-medium text-gray-900">
                                {leader.name}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge
                              variant="outline"
                              className="border-blue-300 text-blue-700"
                            >
                              {leader.rank}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {leader.score}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className={`flex items-center ${getTrendClass(leader.trend)}`}
                            >
                              {getTrendIcon(leader.trend)}
                              <span className="ml-1">{leader.change}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Active Challenges</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeChallenges.map((challenge) => (
              <Card key={challenge.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-gray-100 p-4 rounded-full mb-4">
                      {challenge.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {challenge.title}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {challenge.description}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                      <div
                        className="bg-purple-600 h-2.5 rounded-full"
                        style={{ width: `${challenge.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between w-full text-sm">
                      <span className="text-gray-500">
                        Progress: {challenge.progress}%
                      </span>
                      <span className="text-gray-500">
                        Ends: {challenge.endDate}
                      </span>
                    </div>
                    <Badge className="mt-4 bg-amber-100 text-amber-800">
                      Reward: {challenge.reward}
                    </Badge>
                    <Button className="mt-4 w-full">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Leaderboard;
