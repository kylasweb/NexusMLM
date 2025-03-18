import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getUserStats, getUserActivities, getBinaryMatrixStats } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  TrendingUp,
  Award,
  Clock,
  ArrowRight,
  PiggyBank,
  Network,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import StatisticsCards from "./StatisticsCards";
import BinaryMatrixPreview from "./BinaryMatrixPreview";
import RecentActivities from "./RecentActivities";
import QuickActions from "./QuickActions";

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    earnings: "$0",
    teamSize: "0",
    investments: "$0",
    rank: "Bronze",
  });
  const [activities, setActivities] = useState([]);
  const [matrixStats, setMatrixStats] = useState({
    leftLeg: { totalMembers: 0, activeMembers: 0, volume: 0, growth: 0 },
    rightLeg: { totalMembers: 0, activeMembers: 0, volume: 0, growth: 0 },
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const [statsData, activitiesData, matrixData] = await Promise.all([
          getUserStats(user.id),
          getUserActivities(user.id),
          getBinaryMatrixStats(user.id),
        ]);

        if (statsData) setStats(statsData);
        if (activitiesData) setActivities(activitiesData);
        if (matrixData) setMatrixStats(matrixData);
      } catch (err: any) {
        console.error("Dashboard data error:", err);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, toast]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to view your dashboard</h2>
          <Link to="/login">
            <Button>Log In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          Welcome back, {user.email?.split("@")[0] || "User"}!
        </h1>
        <p className="text-gray-500">
          Here's what's happening with your network today.
        </p>
      </div>

      {/* Statistics Cards */}
      <StatisticsCards stats={stats} loading={loading} />

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Binary Matrix Preview */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">
                Binary Matrix Structure
              </CardTitle>
              <Link to="/network">
                <Button variant="ghost" size="sm" className="gap-1">
                  <span>View Full Network</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <BinaryMatrixPreview userId={user.id} matrixStats={matrixStats} loading={loading} />
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <div>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">
                Recent Activities
              </CardTitle>
              <Link to="/activities">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <RecentActivities activities={activities} loading={loading} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6">
        <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
        <QuickActions />
      </div>
    </div>
  );
};

export default DashboardOverview;
