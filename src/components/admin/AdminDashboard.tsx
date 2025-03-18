import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import {
  Users,
  DollarSign,
  Settings,
  Award,
  PiggyBank,
  Network,
  BarChart,
  Search,
  Filter,
  Plus,
  Check,
  X,
} from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";
import { updateSystemSettings, getSystemSettings } from "@/lib/api";

const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("users");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // System Settings State
  const [systemSettings, setSystemSettings] = useState({
    site_name: "MLM Matrix",
    admin_email: "admin@example.com",
    currency: "USD",
    timezone: "UTC",
    require_kyc: "yes",
    min_withdrawal: "50",
    withdrawal_fee: "2.5",
    enable_2fa: "no"
  });

  // Load system settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await getSystemSettings();
        if (settings) {
          setSystemSettings(settings);
        }
      } catch (error) {
        console.error("Error loading settings:", error);
        toast({
          title: "Error",
          description: "Failed to load system settings",
          variant: "destructive",
        });
      }
    };
    loadSettings();
  }, []);

  // Handle system settings save
  const handleSaveSettings = async () => {
    try {
      setIsLoading(true);
      await updateSystemSettings("general", systemSettings);
      toast({
        title: "Success",
        description: "System settings updated successfully",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save system settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle system settings change
  const handleSettingChange = (key: string, value: string) => {
    setSystemSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Mock data for demonstration
  const mockUsers = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      status: "active",
      rank: "Gold",
      joinDate: "2023-05-15",
      earnings: "$1,245.50",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
      status: "active",
      rank: "Silver",
      joinDate: "2023-06-22",
      earnings: "$845.75",
    },
    {
      id: "3",
      name: "Robert Johnson",
      email: "robert@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=robert",
      status: "inactive",
      rank: "Bronze",
      joinDate: "2023-07-10",
      earnings: "$320.25",
    },
  ];

  const mockWithdrawals = [
    {
      id: "1",
      user: "John Doe",
      amount: "$500.00",
      method: "Bank Transfer",
      status: "pending",
      date: "2023-08-15",
    },
    {
      id: "2",
      user: "Jane Smith",
      amount: "$250.00",
      method: "PayPal",
      status: "completed",
      date: "2023-08-12",
    },
    {
      id: "3",
      user: "Robert Johnson",
      amount: "$100.00",
      method: "Cryptocurrency",
      status: "rejected",
      date: "2023-08-10",
    },
  ];

  const mockPlans = [
    {
      id: "1",
      name: "Starter Plan",
      minAmount: "$100",
      maxAmount: "$500",
      roi: "5%",
      duration: "30 days",
      status: "active",
    },
    {
      id: "2",
      name: "Growth Plan",
      minAmount: "$500",
      maxAmount: "$2,000",
      roi: "8%",
      duration: "60 days",
      status: "active",
    },
    {
      id: "3",
      name: "Premium Plan",
      minAmount: "$2,000",
      maxAmount: "$10,000",
      roi: "12%",
      duration: "90 days",
      status: "active",
    },
  ];

  const mockRanks = [
    {
      id: "1",
      name: "Bronze",
      directReferrals: "0",
      teamSize: "0",
      investment: "$0",
      commissionRate: "5%",
    },
    {
      id: "2",
      name: "Silver",
      directReferrals: "2",
      teamSize: "10",
      investment: "$500",
      commissionRate: "7%",
    },
    {
      id: "3",
      name: "Gold",
      directReferrals: "5",
      teamSize: "30",
      investment: "$1,000",
      commissionRate: "10%",
    },
    {
      id: "4",
      name: "Platinum",
      directReferrals: "10",
      teamSize: "100",
      investment: "$5,000",
      commissionRate: "12%",
    },
    {
      id: "5",
      name: "Diamond",
      directReferrals: "20",
      teamSize: "300",
      investment: "$10,000",
      commissionRate: "15%",
    },
  ];

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500">Manage your MLM system</p>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Users
                  </p>
                  <h3 className="text-2xl font-bold mt-1">1,245</h3>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-700" />
                </div>
              </div>
              <div className="mt-4 text-xs text-green-600 flex items-center">
                <span className="font-medium">+12%</span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Earnings
                  </p>
                  <h3 className="text-2xl font-bold mt-1">$45,678</h3>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-700" />
                </div>
              </div>
              <div className="mt-4 text-xs text-green-600 flex items-center">
                <span className="font-medium">+8.5%</span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Active Investments
                  </p>
                  <h3 className="text-2xl font-bold mt-1">$125,430</h3>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <PiggyBank className="h-6 w-6 text-purple-700" />
                </div>
              </div>
              <div className="mt-4 text-xs text-green-600 flex items-center">
                <span className="font-medium">+15.2%</span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Pending Withdrawals
                  </p>
                  <h3 className="text-2xl font-bold mt-1">$8,540</h3>
                </div>
                <div className="p-3 bg-amber-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-amber-700" />
                </div>
              </div>
              <div className="mt-4 text-xs text-amber-600 flex items-center">
                <span className="font-medium">12 requests</span>
                <span className="ml-1">pending approval</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Tabs
          defaultValue="users"
          className="w-full"
          onValueChange={setSelectedTab}
        >
          <TabsList className="mb-6">
            <TabsTrigger value="users">
              <Users className="mr-2 h-4 w-4" /> User Management
            </TabsTrigger>
            <TabsTrigger value="finance">
              <DollarSign className="mr-2 h-4 w-4" /> Financial Management
            </TabsTrigger>
            <TabsTrigger value="plans">
              <PiggyBank className="mr-2 h-4 w-4" /> Investment Plans
            </TabsTrigger>
            <TabsTrigger value="ranks">
              <Award className="mr-2 h-4 w-4" /> Rank Management
            </TabsTrigger>
            <TabsTrigger value="matrix">
              <Network className="mr-2 h-4 w-4" /> Matrix Settings
            </TabsTrigger>
            <TabsTrigger value="reports">
              <BarChart className="mr-2 h-4 w-4" /> Reports
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="mr-2 h-4 w-4" /> System Settings
            </TabsTrigger>
          </TabsList>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>User Management</CardTitle>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search users..."
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Add User
                    </Button>
                  </div>
                </div>
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
                          Email
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rank
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Join Date
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Earnings
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {mockUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-3">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>
                                  {user.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="font-medium text-gray-900">
                                {user.name}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={getStatusBadgeColor(user.status)}>
                              {user.status.charAt(0).toUpperCase() +
                                user.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.rank}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.joinDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                            {user.earnings}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-800"
                              >
                                Suspend
                              </Button>
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

          {/* Financial Management Tab */}
          <TabsContent value="finance" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Withdrawal Requests</CardTitle>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search requests..."
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
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
                          Amount
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Method
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {mockWithdrawals.map((withdrawal) => (
                        <tr key={withdrawal.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {withdrawal.user}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {withdrawal.amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {withdrawal.method}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge
                              className={getStatusBadgeColor(withdrawal.status)}
                            >
                              {withdrawal.status.charAt(0).toUpperCase() +
                                withdrawal.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {withdrawal.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {withdrawal.status === "pending" && (
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Check className="mr-1 h-4 w-4" /> Approve
                                </Button>
                                <Button size="sm" variant="destructive">
                                  <X className="mr-1 h-4 w-4" /> Reject
                                </Button>
                              </div>
                            )}
                            {withdrawal.status !== "pending" && (
                              <Button size="sm" variant="outline">
                                View Details
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Investment Plans Tab */}
          <TabsContent value="plans" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Investment Plans</h2>
              <Button onClick={() => window.location.href = "/admin/plans"}>
                <Plus className="mr-2 h-4 w-4" /> Manage Plans
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockPlans.map((plan) => (
                <Card key={plan.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <Badge
                        variant={plan.status === "active" ? "default" : "secondary"}
                      >
                        {plan.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Min Amount:</span>
                        <span className="font-medium">{plan.minAmount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Max Amount:</span>
                        <span className="font-medium">{plan.maxAmount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">ROI:</span>
                        <span className="font-medium">{plan.roi}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Duration:</span>
                        <span className="font-medium">{plan.duration}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Rank Management Tab */}
          <TabsContent value="ranks" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Rank Management</CardTitle>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Create New Rank
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rank Name
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Direct Referrals
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Team Size
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Investment
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Commission Rate
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {mockRanks.map((rank) => (
                        <tr key={rank.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {rank.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {rank.directReferrals}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {rank.teamSize}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {rank.investment}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                            {rank.commissionRate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-800"
                              >
                                Delete
                              </Button>
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

          {/* Matrix Settings Tab */}
          <TabsContent value="matrix" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Binary Matrix Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        Matrix Configuration
                      </h3>
                      <div className="space-y-2">
                        <Label htmlFor="matrix_depth">
                          Matrix Depth (Levels)
                        </Label>
                        <Input
                          id="matrix_depth"
                          type="number"
                          defaultValue="10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="spillover_method">
                          Spillover Method
                        </Label>
                        <select
                          id="spillover_method"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="auto">Auto Balancing</option>
                          <option value="left">Left Leg Priority</option>
                          <option value="right">Right Leg Priority</option>
                          <option value="manual">Manual Placement</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="position_algorithm">
                          Position Algorithm
                        </Label>
                        <select
                          id="position_algorithm"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="width">Width First</option>
                          <option value="depth">Depth First</option>
                          <option value="balanced">Balanced</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        Commission Settings
                      </h3>
                      <div className="space-y-2">
                        <Label htmlFor="matching_bonus">
                          Matching Bonus Percentage
                        </Label>
                        <Input
                          id="matching_bonus"
                          type="number"
                          defaultValue="10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="level_commission">
                          Level Commission Structure
                        </Label>
                        <textarea
                          id="level_commission"
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          defaultValue="Level 1: 10%
Level 2: 7%
Level 3: 5%
Level 4: 3%
Level 5: 2%
Levels 6-10: 1%"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="binary_commission">
                          Binary Commission Rate
                        </Label>
                        <Input
                          id="binary_commission"
                          type="number"
                          defaultValue="10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <Button>Save Matrix Settings</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Financial Reports
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li>
                          <Button
                            variant="link"
                            className="p-0 h-auto text-blue-600"
                          >
                            Commission Payouts Report
                          </Button>
                        </li>
                        <li>
                          <Button
                            variant="link"
                            className="p-0 h-auto text-blue-600"
                          >
                            Investment Summary Report
                          </Button>
                        </li>
                        <li>
                          <Button
                            variant="link"
                            className="p-0 h-auto text-blue-600"
                          >
                            Withdrawal Transactions Report
                          </Button>
                        </li>
                        <li>
                          <Button
                            variant="link"
                            className="p-0 h-auto text-blue-600"
                          >
                            Revenue Analysis Report
                          </Button>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">User Reports</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li>
                          <Button
                            variant="link"
                            className="p-0 h-auto text-blue-600"
                          >
                            New Registrations Report
                          </Button>
                        </li>
                        <li>
                          <Button
                            variant="link"
                            className="p-0 h-auto text-blue-600"
                          >
                            User Activity Report
                          </Button>
                        </li>
                        <li>
                          <Button
                            variant="link"
                            className="p-0 h-auto text-blue-600"
                          >
                            Rank Distribution Report
                          </Button>
                        </li>
                        <li>
                          <Button
                            variant="link"
                            className="p-0 h-auto text-blue-600"
                          >
                            KYC Verification Status Report
                          </Button>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Matrix Reports
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li>
                          <Button
                            variant="link"
                            className="p-0 h-auto text-blue-600"
                          >
                            Network Growth Report
                          </Button>
                        </li>
                        <li>
                          <Button
                            variant="link"
                            className="p-0 h-auto text-blue-600"
                          >
                            Team Structure Analysis
                          </Button>
                        </li>
                        <li>
                          <Button
                            variant="link"
                            className="p-0 h-auto text-blue-600"
                          >
                            Spillover Distribution Report
                          </Button>
                        </li>
                        <li>
                          <Button
                            variant="link"
                            className="p-0 h-auto text-blue-600"
                          >
                            Leg Balance Report
                          </Button>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">
                    Custom Report Generator
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="report_type">Report Type</Label>
                      <select
                        id="report_type"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="financial">Financial Report</option>
                        <option value="user">User Report</option>
                        <option value="matrix">Matrix Report</option>
                        <option value="custom">Custom Report</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date_range">Date Range</Label>
                      <select
                        id="date_range"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="today">Today</option>
                        <option value="yesterday">Yesterday</option>
                        <option value="last7">Last 7 Days</option>
                        <option value="last30">Last 30 Days</option>
                        <option value="thisMonth">This Month</option>
                        <option value="lastMonth">Last Month</option>
                        <option value="custom">Custom Range</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="format">Export Format</Label>
                      <select
                        id="format"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="pdf">PDF</option>
                        <option value="excel">Excel</option>
                        <option value="csv">CSV</option>
                      </select>
                    </div>
                  </div>
                  <Button>Generate Report</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">General Settings</h3>
                      <div className="space-y-2">
                        <Label htmlFor="site_name">Site Name</Label>
                        <Input 
                          id="site_name" 
                          value={systemSettings.site_name}
                          onChange={(e) => handleSettingChange("site_name", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="admin_email">Admin Email</Label>
                        <Input
                          id="admin_email"
                          type="email"
                          value={systemSettings.admin_email}
                          onChange={(e) => handleSettingChange("admin_email", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currency">Default Currency</Label>
                        <select
                          id="currency"
                          value={systemSettings.currency}
                          onChange={(e) => handleSettingChange("currency", e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                          <option value="JPY">JPY (¥)</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <select
                          id="timezone"
                          value={systemSettings.timezone}
                          onChange={(e) => handleSettingChange("timezone", e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="UTC">UTC</option>
                          <option value="EST">Eastern Time (EST)</option>
                          <option value="CST">Central Time (CST)</option>
                          <option value="PST">Pacific Time (PST)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Security Settings</h3>
                      <div className="space-y-2">
                        <Label htmlFor="require_kyc">
                          Require KYC Verification
                        </Label>
                        <select
                          id="require_kyc"
                          value={systemSettings.require_kyc}
                          onChange={(e) => handleSettingChange("require_kyc", e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="min_withdrawal">
                          Minimum Withdrawal Amount
                        </Label>
                        <Input
                          id="min_withdrawal"
                          type="number"
                          value={systemSettings.min_withdrawal}
                          onChange={(e) => handleSettingChange("min_withdrawal", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="withdrawal_fee">
                          Withdrawal Fee (%)
                        </Label>
                        <Input
                          id="withdrawal_fee"
                          type="number"
                          value={systemSettings.withdrawal_fee}
                          onChange={(e) => handleSettingChange("withdrawal_fee", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="enable_2fa">Enable 2FA for Admin</Label>
                        <select
                          id="enable_2fa"
                          value={systemSettings.enable_2fa}
                          onChange={(e) => handleSettingChange("enable_2fa", e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <Button onClick={handleSaveSettings} disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save System Settings"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
