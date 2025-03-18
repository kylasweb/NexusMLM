import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  getUserCommissions,
  createWithdrawal,
  createActivity,
} from "@/lib/api";
import { useAuth } from "@/lib/auth";
import {
  DollarSign,
  ArrowDownRight,
  Calendar,
  Check,
  AlertCircle,
} from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";

interface Commission {
  id: string;
  user_id: string;
  source_id: string;
  amount: number;
  type: string;
  description: string;
  status: string;
  created_at: string;
  source?: {
    full_name: string;
    avatar_url: string;
  };
}

const CommissionsDashboard = () => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [withdrawalAmount, setWithdrawalAmount] = useState<number>(0);
  const [withdrawalMethod, setWithdrawalMethod] = useState("bank");
  const [withdrawalDetails, setWithdrawalDetails] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCommissions = async () => {
      if (!user) return;

      try {
        const data = await getUserCommissions(user.id);
        setCommissions(data);
      } catch (err: any) {
        setError(err.message || "Failed to load commissions");
      } finally {
        setLoading(false);
      }
    };

    fetchCommissions();
  }, [user]);

  const handleWithdrawalSubmit = async () => {
    if (!user) return;

    try {
      setError(null);
      setSuccess(null);

      // Create the withdrawal request
      await createWithdrawal({
        user_id: user.id,
        amount: withdrawalAmount,
        status: "pending",
        payment_method: withdrawalMethod,
        payment_details: { details: withdrawalDetails },
      });

      // Create activity record
      await createActivity({
        user_id: user.id,
        type: "withdrawal",
        title: "Withdrawal Request",
        description: `${withdrawalMethod} transfer initiated`,
        amount: withdrawalAmount,
        status: "pending",
      });

      setSuccess(
        `Withdrawal request for $${withdrawalAmount} has been submitted successfully`,
      );
      setDialogOpen(false);
      setWithdrawalAmount(0);
      setWithdrawalDetails("");
    } catch (err: any) {
      setError(err.message || "Failed to process withdrawal request");
    }
  };

  const calculateTotalEarnings = () => {
    return commissions
      .filter((commission) => commission.status === "completed")
      .reduce((total, commission) => total + Number(commission.amount), 0);
  };

  const calculatePendingEarnings = () => {
    return commissions
      .filter((commission) => commission.status === "pending")
      .reduce((total, commission) => total + Number(commission.amount), 0);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const getCommissionTypeLabel = (type: string) => {
    switch (type) {
      case "direct_referral":
        return "Direct Referral";
      case "level_bonus":
        return "Level Bonus";
      case "matching_bonus":
        return "Matching Bonus";
      case "leadership_bonus":
        return "Leadership Bonus";
      default:
        return type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
            <p className="mt-4 text-gray-600">Loading your commissions...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Commissions Dashboard</h1>
          <p className="text-gray-500">
            Track your earnings and withdraw funds
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
            <Check className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${calculateTotalEarnings().toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Lifetime earnings from all sources
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${calculatePendingEarnings().toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Earnings waiting to be processed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Available for Withdrawal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${calculateTotalEarnings().toFixed(2)}
              </div>
              <Button
                onClick={() => {
                  setWithdrawalAmount(calculateTotalEarnings());
                  setDialogOpen(true);
                }}
                className="w-full mt-2"
                disabled={calculateTotalEarnings() <= 0}
              >
                <ArrowDownRight className="mr-2 h-4 w-4" /> Withdraw Funds
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Commissions</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>

          {["all", "completed", "pending"].map((tabValue) => (
            <TabsContent key={tabValue} value={tabValue} className="space-y-6">
              {commissions.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-10">
                    <div className="rounded-full bg-blue-100 p-3 mb-4">
                      <DollarSign className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      No Commissions Yet
                    </h3>
                    <p className="text-gray-500 text-center max-w-md">
                      You haven't earned any commissions yet. Refer new members
                      to start earning.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 text-left">
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Source
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {commissions
                          .filter((commission) => {
                            if (tabValue === "all") return true;
                            return commission.status === tabValue;
                          })
                          .map((commission) => (
                            <tr
                              key={commission.id}
                              className="hover:bg-gray-50"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                  {formatDate(commission.created_at)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {getCommissionTypeLabel(commission.type)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {commission.source ? (
                                  <div className="flex items-center">
                                    <Avatar className="h-6 w-6 mr-2">
                                      <AvatarImage
                                        src={
                                          commission.source.avatar_url ||
                                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${commission.source_id}`
                                        }
                                      />
                                      <AvatarFallback>
                                        {commission.source.full_name.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    {commission.source.full_name}
                                  </div>
                                ) : (
                                  "System"
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {commission.description}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                +${Number(commission.amount).toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge
                                  className={getStatusBadgeColor(
                                    commission.status,
                                  )}
                                >
                                  {commission.status.charAt(0).toUpperCase() +
                                    commission.status.slice(1)}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Withdraw Funds</DialogTitle>
              <DialogDescription>
                Enter the amount you want to withdraw and your payment details.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Withdrawal Amount ($)</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="amount"
                    type="number"
                    value={withdrawalAmount}
                    onChange={(e) =>
                      setWithdrawalAmount(Number(e.target.value))
                    }
                    min={10}
                    max={calculateTotalEarnings()}
                    className="flex-1"
                  />
                  <span className="text-gray-500">USD</span>
                </div>
                <p className="text-xs text-gray-500">
                  Available balance: ${calculateTotalEarnings().toFixed(2)}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="method">Payment Method</Label>
                <select
                  id="method"
                  value={withdrawalMethod}
                  onChange={(e) => setWithdrawalMethod(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="bank">Bank Transfer</option>
                  <option value="paypal">PayPal</option>
                  <option value="crypto">Cryptocurrency</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="details">Payment Details</Label>
                <Input
                  id="details"
                  placeholder="Enter your payment details"
                  value={withdrawalDetails}
                  onChange={(e) => setWithdrawalDetails(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleWithdrawalSubmit}>
                Submit Withdrawal Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default CommissionsDashboard;
