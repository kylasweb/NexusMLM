import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import {
  Users,
  Link,
  Copy,
  Share2,
  Award,
  RefreshCw,
  UserPlus,
  ChevronRight,
  Coins,
} from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";

interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  pendingReferrals: number;
  totalEarnings: number;
}

interface ReferralUser {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  status: string;
  joined_date: string;
  level: number;
}

const ReferralDashboard = () => {
  const [referralLink, setReferralLink] = useState("");
  const [referralStats, setReferralStats] = useState<ReferralStats>({
    totalReferrals: 0,
    activeReferrals: 0,
    pendingReferrals: 0,
    totalEarnings: 0,
  });
  const [referrals, setReferrals] = useState<ReferralUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      generateReferralLink();
      fetchReferralData();
    }
  }, [user]);

  const generateReferralLink = () => {
    if (user) {
      const baseUrl = window.location.origin;
      setReferralLink(`${baseUrl}/register?ref=${user.id}`);
    }
  };

  const fetchReferralData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // In a real implementation, this would fetch actual referral data from the database
      // For now, we'll use mock data

      // Mock referral stats
      setReferralStats({
        totalReferrals: 12,
        activeReferrals: 8,
        pendingReferrals: 4,
        totalEarnings: 450,
      });

      // Mock referral users
      const mockReferrals: ReferralUser[] = [
        {
          id: "1",
          full_name: "John Smith",
          email: "john.smith@example.com",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
          status: "active",
          joined_date: "2023-05-15T10:30:00Z",
          level: 1,
        },
        {
          id: "2",
          full_name: "Sarah Johnson",
          email: "sarah.j@example.com",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
          status: "active",
          joined_date: "2023-06-22T14:45:00Z",
          level: 1,
        },
        {
          id: "3",
          full_name: "Michael Brown",
          email: "michael.b@example.com",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
          status: "pending",
          joined_date: "2023-07-10T09:15:00Z",
          level: 1,
        },
        {
          id: "4",
          full_name: "Emily Davis",
          email: "emily.d@example.com",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
          status: "active",
          joined_date: "2023-08-05T16:20:00Z",
          level: 2,
        },
        {
          id: "5",
          full_name: "David Wilson",
          email: "david.w@example.com",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
          status: "active",
          joined_date: "2023-09-18T11:10:00Z",
          level: 2,
        },
      ];

      setReferrals(mockReferrals);
    } catch (err: any) {
      setError(err.message || "Failed to load referral data");
      console.error("Error fetching referral data:", err);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Link Copied",
      description: "Referral link copied to clipboard",
    });
  };

  const shareReferralLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join MLM Matrix",
          text: "Join my network on MLM Matrix and start earning today!",
          url: referralLink,
        });
      } catch (err: any) {
        console.error("Error sharing:", err);
      }
    } else {
      copyReferralLink();
      toast({
        title: "Share Not Supported",
        description:
          "Your browser doesn't support sharing. Link copied instead.",
      });
    }
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
            <p className="mt-4 text-gray-600">Loading referral data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Referral Program</h1>
            <p className="text-gray-500">
              Invite friends and earn rewards for each successful referral
            </p>
          </div>
          <Button variant="outline" onClick={fetchReferralData}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold mb-2">
                  Your Referral Link
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Share this link with friends to earn rewards
                </p>
              </div>
              <div className="flex-1 flex items-center">
                <div className="relative flex-1">
                  <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    value={referralLink}
                    readOnly
                    className="pl-10 pr-24 w-full"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyReferralLink}
                      className="h-8"
                    >
                      <Copy className="h-4 w-4 mr-1" /> Copy
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={shareReferralLink}
                      className="h-8"
                    >
                      <Share2 className="h-4 w-4 mr-1" /> Share
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Referrals</p>
                  <h3 className="text-2xl font-bold">
                    {referralStats.totalReferrals}
                  </h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Referrals</p>
                  <h3 className="text-2xl font-bold">
                    {referralStats.activeReferrals}
                  </h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <UserPlus className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending Referrals</p>
                  <h3 className="text-2xl font-bold">
                    {referralStats.pendingReferrals}
                  </h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <RefreshCw className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Earnings</p>
                  <h3 className="text-2xl font-bold">
                    ${referralStats.totalEarnings}
                  </h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Coins className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">
              <Users className="mr-2 h-4 w-4" /> All Referrals
            </TabsTrigger>
            <TabsTrigger value="active">
              <UserPlus className="mr-2 h-4 w-4" /> Active Referrals
            </TabsTrigger>
            <TabsTrigger value="pending">
              <RefreshCw className="mr-2 h-4 w-4" /> Pending Referrals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Referrals</CardTitle>
              </CardHeader>
              <CardContent>
                {referrals.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="rounded-full bg-gray-100 p-3 mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                      <Users className="h-8 w-8 text-gray-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      No Referrals Yet
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                      You haven't referred anyone yet. Share your referral link
                      to start earning rewards.
                    </p>
                    <Button onClick={copyReferralLink}>
                      <Copy className="mr-2 h-4 w-4" /> Copy Referral Link
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 text-left">
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Level
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Joined Date
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {referrals.map((referral) => (
                          <tr key={referral.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0">
                                  {referral.avatar_url ? (
                                    <img
                                      className="h-10 w-10 rounded-full"
                                      src={referral.avatar_url}
                                      alt={referral.full_name}
                                    />
                                  ) : (
                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                      <span className="text-gray-500 font-medium">
                                        {referral.full_name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {referral.full_name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {referral.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant="outline">
                                Level {referral.level}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge
                                className={
                                  referral.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-amber-100 text-amber-800"
                                }
                              >
                                {referral.status === "active"
                                  ? "Active"
                                  : "Pending"}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(
                                referral.joined_date,
                              ).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <Button variant="ghost" size="sm">
                                View Details
                                <ChevronRight className="ml-1 h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Referrals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Level
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined Date
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {referrals
                        .filter((r) => r.status === "active")
                        .map((referral) => (
                          <tr key={referral.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0">
                                  {referral.avatar_url ? (
                                    <img
                                      className="h-10 w-10 rounded-full"
                                      src={referral.avatar_url}
                                      alt={referral.full_name}
                                    />
                                  ) : (
                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                      <span className="text-gray-500 font-medium">
                                        {referral.full_name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {referral.full_name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {referral.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant="outline">
                                Level {referral.level}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(
                                referral.joined_date,
                              ).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <Button variant="ghost" size="sm">
                                View Details
                                <ChevronRight className="ml-1 h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Referrals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Level
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined Date
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {referrals
                        .filter((r) => r.status === "pending")
                        .map((referral) => (
                          <tr key={referral.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0">
                                  {referral.avatar_url ? (
                                    <img
                                      className="h-10 w-10 rounded-full"
                                      src={referral.avatar_url}
                                      alt={referral.full_name}
                                    />
                                  ) : (
                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                      <span className="text-gray-500 font-medium">
                                        {referral.full_name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {referral.full_name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {referral.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant="outline">
                                Level {referral.level}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(
                                referral.joined_date,
                              ).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <Button variant="ghost" size="sm">
                                View Details
                                <ChevronRight className="ml-1 h-4 w-4" />
                              </Button>
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

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Referral Program Details</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <UserPlus className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Step 1</h3>
                  <p className="text-gray-600">
                    Share your unique referral link with friends and family
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Step 2</h3>
                  <p className="text-gray-600">
                    They sign up using your referral link and join your network
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Step 3</h3>
                  <p className="text-gray-600">
                    Earn commissions on their investments and activities
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">
                  Commission Structure
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Level 1 (Direct Referrals): 10% commission</li>
                  <li>Level 2: 5% commission</li>
                  <li>Level 3: 3% commission</li>
                  <li>Level 4-10: 1% commission</li>
                </ul>
                <p className="mt-4 text-sm text-gray-500">
                  Commissions are calculated based on the investment amount and
                  paid out immediately when your referrals make investments.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ReferralDashboard;
