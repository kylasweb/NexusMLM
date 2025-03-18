import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getUserStats, getUserActivities } from "@/lib/api";
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
import StatisticsCards from "./StatisticsCards";
import BinaryMatrixPreview from "./BinaryMatrixPreview";
import RecentActivities from "./RecentActivities";
import QuickActions from "./QuickActions";

interface DashboardOverviewProps {
  userName?: string;
  userAvatar?: string;
  stats?: {
    earnings: string;
    teamSize: string;
    investments: string;
    rank: string;
  };
}

const DashboardOverview = ({
  userName,
  userAvatar,
  stats: initialStats,
}: DashboardOverviewProps) => {
  const [stats, setStats] = useState(
    initialStats || {
      earnings: "$0",
      teamSize: "0",
      investments: "$0",
      rank: "Bronze",
    },
  );
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const [statsData, activitiesData] = await Promise.all([
          getUserStats(user.id),
          getUserActivities(user.id),
        ]);

        setStats(statsData || stats);
        setActivities(activitiesData || []);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data");
        console.error("Dashboard data error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          Welcome back, {userName || user?.email?.split("@")[0] || "User"}!
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
              <BinaryMatrixPreview userId={user?.id} />
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
              <Button variant="ghost" size="sm">
                View All
              </Button>
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
