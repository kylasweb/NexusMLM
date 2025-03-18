import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserInvestments } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { DollarSign, Calendar, TrendingUp, Clock } from "lucide-react";

interface Investment {
  id: string;
  user_id: string;
  plan_id: string;
  amount: number;
  status: string;
  start_date: string;
  end_date: string;
  created_at: string;
  plan: {
    name: string;
    roi_percentage: number;
    duration_days: number;
  };
}

const UserInvestments = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchInvestments = async () => {
      if (!user) return;

      try {
        const data = await getUserInvestments(user.id);
        setInvestments(data);
      } catch (err: any) {
        setError(err.message || "Failed to load investments");
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, [user]);

  const calculateProgress = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();

    if (now >= end) return 100;
    if (now <= start) return 0;

    const total = end - start;
    const elapsed = now - start;
    return Math.round((elapsed / total) * 100);
  };

  const calculateDaysLeft = (endDate: string) => {
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return daysLeft > 0 ? daysLeft : 0;
  };

  const calculateTotalValue = (amount: number, roiPercentage: number) => {
    return amount + (amount * roiPercentage) / 100;
  };

  const activeInvestments = investments.filter(
    (inv) => inv.status === "active",
  );
  const completedInvestments = investments.filter(
    (inv) => inv.status === "completed",
  );

  if (loading) {
    return (
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
          <p className="mt-4 text-gray-600">Loading your investments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Investments</h1>
        <p className="text-gray-500">
          Track and manage your investment portfolio
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {investments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-10">
            <div className="rounded-full bg-blue-100 p-3 mb-4">
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Investments Yet</h3>
            <p className="text-gray-500 text-center max-w-md">
              You haven't made any investments yet. Explore our investment plans
              to get started on your wealth-building journey.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="active">
              Active Investments ({activeInvestments.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed Investments ({completedInvestments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            {activeInvestments.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No active investments at the moment.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeInvestments.map((investment) => {
                  const progress = calculateProgress(
                    investment.start_date,
                    investment.end_date,
                  );
                  const daysLeft = calculateDaysLeft(investment.end_date);
                  const totalValue = calculateTotalValue(
                    investment.amount,
                    investment.plan.roi_percentage,
                  );

                  return (
                    <Card key={investment.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">
                            {investment.plan.name}
                          </CardTitle>
                          <Badge
                            className={
                              progress < 100
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }
                          >
                            {progress < 100 ? "Active" : "Matured"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Progress</span>
                            <span className="font-medium">{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center text-gray-500 text-xs mb-1">
                              <DollarSign className="h-3 w-3 mr-1" /> Investment
                            </div>
                            <div className="font-semibold">
                              ${investment.amount.toFixed(2)}
                            </div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center text-gray-500 text-xs mb-1">
                              <TrendingUp className="h-3 w-3 mr-1" /> ROI
                            </div>
                            <div className="font-semibold">
                              {investment.plan.roi_percentage}%
                            </div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center text-gray-500 text-xs mb-1">
                              <Calendar className="h-3 w-3 mr-1" /> Maturity
                            </div>
                            <div className="font-semibold">
                              {new Date(
                                investment.end_date,
                              ).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center text-gray-500 text-xs mb-1">
                              <Clock className="h-3 w-3 mr-1" /> Days Left
                            </div>
                            <div className="font-semibold">{daysLeft}</div>
                          </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex justify-between">
                            <span className="text-gray-700">
                              Total Value at Maturity:
                            </span>
                            <span className="font-bold text-green-600">
                              ${totalValue.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            {completedInvestments.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No completed investments yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedInvestments.map((investment) => {
                  const totalValue = calculateTotalValue(
                    investment.amount,
                    investment.plan.roi_percentage,
                  );
                  const profit = totalValue - investment.amount;

                  return (
                    <Card key={investment.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">
                            {investment.plan.name}
                          </CardTitle>
                          <Badge className="bg-gray-100 text-gray-800">
                            Completed
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center text-gray-500 text-xs mb-1">
                              <DollarSign className="h-3 w-3 mr-1" /> Investment
                            </div>
                            <div className="font-semibold">
                              ${investment.amount.toFixed(2)}
                            </div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center text-gray-500 text-xs mb-1">
                              <TrendingUp className="h-3 w-3 mr-1" /> ROI
                            </div>
                            <div className="font-semibold">
                              {investment.plan.roi_percentage}%
                            </div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center text-gray-500 text-xs mb-1">
                              <Calendar className="h-3 w-3 mr-1" /> Start Date
                            </div>
                            <div className="font-semibold">
                              {new Date(
                                investment.start_date,
                              ).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center text-gray-500 text-xs mb-1">
                              <Calendar className="h-3 w-3 mr-1" /> End Date
                            </div>
                            <div className="font-semibold">
                              {new Date(
                                investment.end_date,
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-700">
                              Initial Investment:
                            </span>
                            <span className="font-medium">
                              ${investment.amount.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-700">
                              Profit Earned:
                            </span>
                            <span className="font-medium text-green-600">
                              +${profit.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-green-200">
                            <span className="text-gray-700 font-semibold">
                              Total Value:
                            </span>
                            <span className="font-bold text-green-600">
                              ${totalValue.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default UserInvestments;
