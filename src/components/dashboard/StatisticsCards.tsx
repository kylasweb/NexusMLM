import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, Users, PiggyBank, Award } from "lucide-react";

interface StatisticsCardsProps {
  stats: {
    earnings: string;
    teamSize: string;
    investments: string;
    rank: string;
  };
  loading?: boolean;
}

const StatisticsCards = ({ stats, loading = false }: StatisticsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Earnings */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Earnings
              </p>
              {loading ? (
                <Skeleton className="h-8 w-24 mt-1" />
              ) : (
                <h3 className="text-2xl font-bold mt-1">{stats.earnings}</h3>
              )}
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-700" />
            </div>
          </div>
          <div className="mt-4 text-xs text-green-600 flex items-center">
            <span className="font-medium">+12%</span>
            <span className="ml-1">from last month</span>
          </div>
        </CardContent>
      </Card>

      {/* Team Size */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Team Size</p>
              {loading ? (
                <Skeleton className="h-8 w-16 mt-1" />
              ) : (
                <h3 className="text-2xl font-bold mt-1">{stats.teamSize}</h3>
              )}
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-700" />
            </div>
          </div>
          <div className="mt-4 text-xs text-blue-600 flex items-center">
            <span className="font-medium">+5</span>
            <span className="ml-1">new members this week</span>
          </div>
        </CardContent>
      </Card>

      {/* Active Investments */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Active Investments
              </p>
              {loading ? (
                <Skeleton className="h-8 w-24 mt-1" />
              ) : (
                <h3 className="text-2xl font-bold mt-1">{stats.investments}</h3>
              )}
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <PiggyBank className="h-6 w-6 text-purple-700" />
            </div>
          </div>
          <div className="mt-4 text-xs text-purple-600 flex items-center">
            <span className="font-medium">+8.5%</span>
            <span className="ml-1">ROI this month</span>
          </div>
        </CardContent>
      </Card>

      {/* Current Rank */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Current Rank</p>
              {loading ? (
                <Skeleton className="h-8 w-20 mt-1" />
              ) : (
                <h3 className="text-2xl font-bold mt-1">{stats.rank}</h3>
              )}
            </div>
            <div className="p-3 bg-amber-100 rounded-full">
              <Award className="h-6 w-6 text-amber-700" />
            </div>
          </div>
          <div className="mt-4 text-xs text-amber-600 flex items-center">
            <span className="font-medium">75%</span>
            <span className="ml-1">progress to next rank</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsCards;
