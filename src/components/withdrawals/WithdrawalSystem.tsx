import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import {
  Wallet,
  CreditCard,
  Clock,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  BanknoteIcon,
} from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";

interface WithdrawalMethod {
  id: string;
  name: string;
  type: string;
  icon: React.ReactNode;
  minAmount: number;
  maxAmount: number;
  processingTime: string;
  fee: number;
  feeType: "percentage" | "fixed";
}

interface Withdrawal {
  id: string;
  amount: number;
  fee: number;
  status: "pending" | "approved" | "rejected";
  method: string;
  created_at: string;
  processed_at?: string;
  notes?: string;
}

const WithdrawalSystem = () => {
  const [balance, setBalance] = useState(1250.75);
  const [pendingBalance, setPendingBalance] = useState(320.5);
  const [withdrawalMethods, setWithdrawalMethods] = useState<
    WithdrawalMethod[]
  >([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New withdrawal form state
  const [isWithdrawalDialogOpen, setIsWithdrawalDialogOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [withdrawalAmount, setWithdrawalAmount] = useState<string>("");
  const [withdrawalDetails, setWithdrawalDetails] = useState<string>("");
  const [calculatedFee, setCalculatedFee] = useState<number>(0);
  const [netAmount, setNetAmount] = useState<number>(0);

  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    // Calculate fee and net amount when method or amount changes
    if (selectedMethod && withdrawalAmount) {
      const method = withdrawalMethods.find((m) => m.id === selectedMethod);
      if (method) {
        const amount = parseFloat(withdrawalAmount);
        let fee = 0;

        if (method.feeType === "percentage") {
          fee = (amount * method.fee) / 100;
        } else {
          fee = method.fee;
        }

        setCalculatedFee(fee);
        setNetAmount(amount - fee);
      }
    } else {
      setCalculatedFee(0);
      setNetAmount(0);
    }
  }, [selectedMethod, withdrawalAmount, withdrawalMethods]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // In a real implementation, these would be fetched from the database
      // For now, we'll use mock data

      // Mock withdrawal methods
      const mockWithdrawalMethods: WithdrawalMethod[] = [
        {
          id: "bank",
          name: "Bank Transfer",
          type: "bank",
          icon: <BanknoteIcon className="h-5 w-5 text-blue-600" />,
          minAmount: 50,
          maxAmount: 10000,
          processingTime: "1-3 business days",
          fee: 2.5,
          feeType: "percentage",
        },
        {
          id: "paypal",
          name: "PayPal",
          type: "digital",
          icon: <CreditCard className="h-5 w-5 text-blue-600" />,
          minAmount: 20,
          maxAmount: 5000,
          processingTime: "24 hours",
          fee: 3,
          feeType: "percentage",
        },
        {
          id: "crypto",
          name: "Cryptocurrency",
          type: "crypto",
          icon: <Wallet className="h-5 w-5 text-blue-600" />,
          minAmount: 100,
          maxAmount: 25000,
          processingTime: "1-24 hours",
          fee: 1,
          feeType: "percentage",
        },
      ];

      setWithdrawalMethods(mockWithdrawalMethods);

      // Mock withdrawal history
      const mockWithdrawals: Withdrawal[] = [
        {
          id: "w1",
          amount: 500,
          fee: 12.5,
          status: "approved",
          method: "bank",
          created_at: "2023-08-15T10:30:00Z",
          processed_at: "2023-08-17T14:20:00Z",
        },
        {
          id: "w2",
          amount: 200,
          fee: 6,
          status: "pending",
          method: "paypal",
          created_at: "2023-09-05T08:45:00Z",
        },
        {
          id: "w3",
          amount: 1000,
          fee: 10,
          status: "approved",
          method: "crypto",
          created_at: "2023-07-22T16:15:00Z",
          processed_at: "2023-07-23T09:30:00Z",
        },
        {
          id: "w4",
          amount: 150,
          fee: 4.5,
          status: "rejected",
          method: "paypal",
          created_at: "2023-06-10T11:20:00Z",
          processed_at: "2023-06-11T13:45:00Z",
          notes: "Insufficient account verification",
        },
      ];

      setWithdrawals(mockWithdrawals);
    } catch (err: any) {
      setError(err.message || "Failed to load withdrawal data");
      console.error("Error fetching withdrawal data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawalSubmit = async () => {
    try {
      if (!selectedMethod || !withdrawalAmount) {
        toast({
          title: "Validation Error",
          description: "Please select a withdrawal method and enter an amount",
          variant: "destructive",
        });
        return;
      }

      const amount = parseFloat(withdrawalAmount);
      if (isNaN(amount) || amount <= 0) {
        toast({
          title: "Validation Error",
          description: "Please enter a valid amount",
          variant: "destructive",
        });
        return;
      }

      const method = withdrawalMethods.find((m) => m.id === selectedMethod);
      if (!method) {
        toast({
          title: "Error",
          description: "Invalid withdrawal method",
          variant: "destructive",
        });
        return;
      }

      if (amount < method.minAmount) {
        toast({
          title: "Validation Error",
          description: `Minimum withdrawal amount is $${method.minAmount}`,
          variant: "destructive",
        });
        return;
      }

      if (amount > method.maxAmount) {
        toast({
          title: "Validation Error",
          description: `Maximum withdrawal amount is $${method.maxAmount}`,
          variant: "destructive",
        });
        return;
      }

      if (amount > balance) {
        toast({
          title: "Insufficient Balance",
          description: "You don't have enough balance for this withdrawal",
          variant: "destructive",
        });
        return;
      }

      // In a real implementation, this would create a withdrawal request in the database
      // For now, we'll simulate it by adding to the local state

      const newWithdrawal: Withdrawal = {
        id: `w${Date.now()}`,
        amount: amount,
        fee: calculatedFee,
        status: "pending",
        method: selectedMethod,
        created_at: new Date().toISOString(),
      };

      setWithdrawals([newWithdrawal, ...withdrawals]);
      setBalance(balance - amount);
      setPendingBalance(pendingBalance + amount);

      toast({
        title: "Withdrawal Requested",
        description: `Your withdrawal request for $${amount.toFixed(2)} has been submitted and is pending approval.`,
      });

      // Reset form and close dialog
      setSelectedMethod("");
      setWithdrawalAmount("");
      setWithdrawalDetails("");
      setIsWithdrawalDialogOpen(false);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to process withdrawal request",
        variant: "destructive",
      });
    }
  };

  const getMethodDetails = (methodId: string) => {
    return withdrawalMethods.find((m) => m.id === methodId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" /> Approved
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-800">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" /> Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800">
            <AlertCircle className="h-3 w-3 mr-1" /> Unknown
          </Badge>
        );
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
            <p className="mt-4 text-gray-600">Loading withdrawal system...</p>
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
            <h1 className="text-2xl font-bold">Withdrawals</h1>
            <p className="text-gray-500">
              Manage your withdrawals and view transaction history
            </p>
          </div>
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Available Balance</p>
                  <h3 className="text-2xl font-bold">${balance.toFixed(2)}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <Button
                className="w-full mt-4"
                onClick={() => setIsWithdrawalDialogOpen(true)}
              >
                <ArrowUpRight className="mr-2 h-4 w-4" /> Withdraw Funds
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending Withdrawals</p>
                  <h3 className="text-2xl font-bold">
                    ${pendingBalance.toFixed(2)}
                  </h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <div className="w-full mt-4 text-sm text-gray-500">
                Pending withdrawals are being processed and will be sent to your
                account soon.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Withdrawn</p>
                  <h3 className="text-2xl font-bold">
                    $
                    {withdrawals
                      .filter((w) => w.status === "approved")
                      .reduce((sum, w) => sum + w.amount, 0)
                      .toFixed(2)}
                  </h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="w-full mt-4 text-sm text-gray-500">
                Total amount successfully withdrawn from your account.
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="history" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="history">
              <Clock className="mr-2 h-4 w-4" /> Withdrawal History
            </TabsTrigger>
            <TabsTrigger value="methods">
              <CreditCard className="mr-2 h-4 w-4" /> Withdrawal Methods
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Withdrawal History</CardTitle>
              </CardHeader>
              <CardContent>
                {withdrawals.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="rounded-full bg-gray-100 p-3 mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                      <Clock className="h-8 w-8 text-gray-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      No Withdrawals Yet
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                      You haven't made any withdrawal requests yet.
                    </p>
                    <Button onClick={() => setIsWithdrawalDialogOpen(true)}>
                      <ArrowUpRight className="mr-2 h-4 w-4" /> Make a
                      Withdrawal
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 text-left">
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fee
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Method
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Details
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {withdrawals.map((withdrawal) => {
                          const method = getMethodDetails(withdrawal.method);
                          return (
                            <tr
                              key={withdrawal.id}
                              className="hover:bg-gray-50"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(
                                  withdrawal.created_at,
                                ).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="font-medium">
                                  ${withdrawal.amount.toFixed(2)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ${withdrawal.fee.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  {method?.icon}
                                  <span className="ml-2">
                                    {method?.name || withdrawal.method}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {getStatusBadge(withdrawal.status)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {withdrawal.notes && (
                                  <div className="text-xs text-gray-500">
                                    {withdrawal.notes}
                                  </div>
                                )}
                                {withdrawal.processed_at && (
                                  <div className="text-xs text-gray-500">
                                    Processed:{" "}
                                    {new Date(
                                      withdrawal.processed_at,
                                    ).toLocaleDateString()}
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="methods" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Withdrawal Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {withdrawalMethods.map((method) => (
                    <Card key={method.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            {method.icon}
                          </div>
                          <div>
                            <h3 className="font-medium text-lg">
                              {method.name}
                            </h3>
                            <Badge variant="outline">{method.type}</Badge>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Min Amount:</span>
                            <span>${method.minAmount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Max Amount:</span>
                            <span>${method.maxAmount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Fee:</span>
                            <span>
                              {method.feeType === "percentage"
                                ? `${method.fee}%`
                                : `$${method.fee}`}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">
                              Processing Time:
                            </span>
                            <span>{method.processingTime}</span>
                          </div>
                        </div>

                        <Button
                          className="w-full mt-4"
                          onClick={() => {
                            setSelectedMethod(method.id);
                            setIsWithdrawalDialogOpen(true);
                          }}
                        >
                          <ArrowUpRight className="mr-2 h-4 w-4" /> Withdraw
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Withdrawal Dialog */}
        <Dialog
          open={isWithdrawalDialogOpen}
          onOpenChange={setIsWithdrawalDialogOpen}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Withdraw Funds</DialogTitle>
              <DialogDescription>
                Request a withdrawal from your available balance
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="withdrawalMethod">Withdrawal Method *</Label>
                <Select
                  value={selectedMethod}
                  onValueChange={setSelectedMethod}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a withdrawal method" />
                  </SelectTrigger>
                  <SelectContent>
                    {withdrawalMethods.map((method) => (
                      <SelectItem key={method.id} value={method.id}>
                        <div className="flex items-center">
                          {method.icon}
                          <span className="ml-2">{method.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedMethod && (
                <div className="bg-gray-50 p-3 rounded-md text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-500">Min Amount:</span>
                    <span>
                      ${getMethodDetails(selectedMethod)?.minAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-500">Max Amount:</span>
                    <span>
                      ${getMethodDetails(selectedMethod)?.maxAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Fee:</span>
                    <span>
                      {getMethodDetails(selectedMethod)?.feeType ===
                      "percentage"
                        ? `${getMethodDetails(selectedMethod)?.fee}%`
                        : `$${getMethodDetails(selectedMethod)?.fee}`}
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="withdrawalAmount">Amount to Withdraw *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="withdrawalAmount"
                    type="number"
                    placeholder="0.00"
                    className="pl-10"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Available balance: ${balance.toFixed(2)}
                </p>
              </div>

              {withdrawalAmount && selectedMethod && (
                <div className="bg-blue-50 p-3 rounded-md">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">Amount:</span>
                    <span>${parseFloat(withdrawalAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">Fee:</span>
                    <span>${calculatedFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>You will receive:</span>
                    <span>${netAmount.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="withdrawalDetails">
                  {selectedMethod === "bank"
                    ? "Bank Account Details *"
                    : selectedMethod === "paypal"
                      ? "PayPal Email *"
                      : selectedMethod === "crypto"
                        ? "Wallet Address *"
                        : "Payment Details *"}
                </Label>
                <textarea
                  id="withdrawalDetails"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder={
                    selectedMethod === "bank"
                      ? "Enter your bank account details..."
                      : selectedMethod === "paypal"
                        ? "Enter your PayPal email address..."
                        : selectedMethod === "crypto"
                          ? "Enter your cryptocurrency wallet address..."
                          : "Enter payment details..."
                  }
                  value={withdrawalDetails}
                  onChange={(e) => setWithdrawalDetails(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsWithdrawalDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleWithdrawalSubmit}>
                <ArrowUpRight className="mr-2 h-4 w-4" /> Request Withdrawal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default WithdrawalSystem;
