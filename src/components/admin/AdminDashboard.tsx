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
import { 
  updateSystemSettings, 
  getSystemSettings,
  getAllUsers,
  getAllWithdrawals,
  getInvestmentPlans,
  createRank,
  updateRank,
} from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

interface SystemSettings {
  site_name: string;
  admin_email: string;
  currency: string;
  timezone: string;
  require_kyc: string;
  min_withdrawal: string;
  withdrawal_fee: string;
  enable_2fa: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: "active" | "inactive";
  rank: string;
  joinDate: string;
  earnings: string;
}

interface Withdrawal {
  id: string;
  user: string;
  amount: string;
  method: string;
  status: "pending" | "completed" | "rejected";
  date: string;
}

interface InvestmentPlan {
  id: string;
  name: string;
  minAmount: string;
  maxAmount: string;
  roi: string;
  duration: string;
  status: "active" | "inactive";
}

interface Rank {
  id: string;
  name: string;
  directReferrals: string;
  teamSize: string;
  investment: string;
  commissionRate: string;
}

const defaultSettings = {
  site_name: "Zocial MLM",
  admin_email: "Kailaspnair@yahoo.com",
  currency: "USD",
  timezone: "UTC",
  require_kyc: "yes",
  min_withdrawal: "50",
  withdrawal_fee: "2.5",
  enable_2fa: "no"
};

const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("users");
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    site_name: "Zocial MLM",
    admin_email: "Kailaspnair@yahoo.com",
    currency: "USD",
    timezone: "UTC",
    require_kyc: "yes",
    min_withdrawal: "50",
    withdrawal_fee: "2.5",
    enable_2fa: "no"
  });
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const [settings, usersData, withdrawalsData, plansData, ranksData] = await Promise.all([
          getSystemSettings(),
          getAllUsers(),
          getAllWithdrawals(),
          getInvestmentPlans(),
          // Add getRanks API call when implemented
        ]);

        if (settings) setSystemSettings(settings);
        if (usersData) setUsers(usersData);
        if (withdrawalsData) setWithdrawals(withdrawalsData);
        if (plansData) setPlans(plansData);
        // if (ranksData) setRanks(ranksData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user, navigate, toast]);

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

  const handleSettingChange = (key: keyof SystemSettings, value: string) => {
    setSystemSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

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

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500">Manage your MLM system</p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
            <TabsTrigger value="plans">Investment Plans</TabsTrigger>
            <TabsTrigger value="ranks">Ranks</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Users</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{user.name}</h3>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge className={getStatusBadgeColor(user.status)}>
                            {user.status}
                          </Badge>
                          <Badge variant="outline">{user.rank}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Withdrawals Tab */}
          <TabsContent value="withdrawals">
            <Card>
              <CardHeader>
                <CardTitle>Withdrawals</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {withdrawals.map((withdrawal) => (
                      <div key={withdrawal.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{withdrawal.user}</h3>
                          <p className="text-sm text-gray-500">{withdrawal.method}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="font-medium">{withdrawal.amount}</span>
                          <Badge className={getStatusBadgeColor(withdrawal.status)}>
                            {withdrawal.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Investment Plans Tab */}
          <TabsContent value="plans">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Investment Plans</CardTitle>
                <Button onClick={() => navigate("/admin/plans")}>
                  Manage Plans
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {plans.map((plan) => (
                      <Card key={plan.id}>
                        <CardHeader>
                          <CardTitle className="text-lg">{plan.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <p>Min: {plan.minAmount}</p>
                            <p>Max: {plan.maxAmount}</p>
                            <p>ROI: {plan.roi}</p>
                            <p>Duration: {plan.duration}</p>
                            <Badge className={getStatusBadgeColor(plan.status)}>
                              {plan.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ranks Tab */}
          <TabsContent value="ranks">
            <Card>
              <CardHeader>
                <CardTitle>Ranks</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {ranks.map((rank) => (
                      <div key={rank.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{rank.name}</h3>
                          <p className="text-sm text-gray-500">
                            Direct Referrals: {rank.directReferrals} | Team Size: {rank.teamSize}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="font-medium">{rank.commissionRate}</span>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <Button onClick={handleSaveSettings} disabled={isLoading}>
                  Save Changes
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      value={systemSettings.admin_email}
                      onChange={(e) => handleSettingChange("admin_email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Input
                      id="currency"
                      value={systemSettings.currency}
                      onChange={(e) => handleSettingChange("currency", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input
                      id="timezone"
                      value={systemSettings.timezone}
                      onChange={(e) => handleSettingChange("timezone", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="min_withdrawal">Minimum Withdrawal</Label>
                    <Input
                      id="min_withdrawal"
                      value={systemSettings.min_withdrawal}
                      onChange={(e) => handleSettingChange("min_withdrawal", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="withdrawal_fee">Withdrawal Fee (%)</Label>
                    <Input
                      id="withdrawal_fee"
                      value={systemSettings.withdrawal_fee}
                      onChange={(e) => handleSettingChange("withdrawal_fee", e.target.value)}
                    />
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
