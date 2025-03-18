import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth";
import { getUserTokens, getTokenTransactions } from "@/lib/tokenApi";
import {
  Coins,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  RefreshCw,
  Wallet,
  History,
} from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";

interface UserToken {
  id: string;
  user_id: string;
  token_id: string;
  balance: number;
  token: {
    id: string;
    name: string;
    symbol: string;
    logo_url?: string;
  };
}

interface TokenTransaction {
  id: string;
  user_id: string;
  token_id: string;
  amount: number;
  transaction_type: string;
  created_at: string;
  description?: string;
  token: {
    id: string;
    name: string;
    symbol: string;
    logo_url?: string;
  };
}

const UserTokens = () => {
  const [userTokens, setUserTokens] = useState<UserToken[]>([]);
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUserTokens();
      fetchTransactions();
    }
  }, [user]);

  const fetchUserTokens = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await getUserTokens(user.id);
      setUserTokens(data);
    } catch (err: any) {
      setError(err.message || "Failed to load token balances");
      console.error("Error fetching user tokens:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      const data = await getTokenTransactions(user.id);
      setTransactions(data);
    } catch (err: any) {
      console.error("Error fetching transactions:", err);
    }
  };

  const refreshData = () => {
    fetchUserTokens();
    fetchTransactions();
    toast({
      title: "Refreshed",
      description: "Token data has been refreshed",
    });
  };

  const getTransactionTypeDetails = (type: string) => {
    switch (type) {
      case "deposit":
        return {
          icon: <ArrowDownRight className="h-4 w-4 text-green-500" />,
          label: "Deposit",
          className: "bg-green-100 text-green-800",
        };
      case "withdrawal":
        return {
          icon: <ArrowUpRight className="h-4 w-4 text-red-500" />,
          label: "Withdrawal",
          className: "bg-red-100 text-red-800",
        };
      case "airdrop":
        return {
          icon: <Coins className="h-4 w-4 text-purple-500" />,
          label: "Airdrop",
          className: "bg-purple-100 text-purple-800",
        };
      case "faucet":
        return {
          icon: <Wallet className="h-4 w-4 text-blue-500" />,
          label: "Faucet",
          className: "bg-blue-100 text-blue-800",
        };
      case "referral_bonus":
        return {
          icon: <Coins className="h-4 w-4 text-amber-500" />,
          label: "Referral Bonus",
          className: "bg-amber-100 text-amber-800",
        };
      default:
        return {
          icon: <Coins className="h-4 w-4 text-gray-500" />,
          label: "Transaction",
          className: "bg-gray-100 text-gray-800",
        };
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
            <p className="mt-4 text-gray-600">Loading your tokens...</p>
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
            <h1 className="text-2xl font-bold">My Tokens</h1>
            <p className="text-gray-500">
              Manage your token balances and transactions
            </p>
          </div>
          <Button variant="outline" onClick={refreshData}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {userTokens.length > 0 ? (
            userTokens.map((userToken) => (
              <Card key={userToken.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {userToken.token.logo_url ? (
                        <img
                          src={userToken.token.logo_url}
                          alt={userToken.token.name}
                          className="h-10 w-10 rounded-full mr-3"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <Coins className="h-5 w-5 text-blue-600" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium text-lg">
                          {userToken.token.name}
                        </h3>
                        <Badge variant="outline" className="font-mono">
                          {userToken.token.symbol}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Balance</p>
                    <p className="text-2xl font-bold">
                      {userToken.balance.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 8,
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="col-span-1 md:col-span-2 lg:col-span-3">
              <CardContent className="p-6 text-center">
                <div className="rounded-full bg-blue-100 p-3 mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                  <Coins className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Tokens Yet</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  You don't have any tokens in your wallet yet. Tokens can be
                  earned through faucets, airdrops, or referral bonuses.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="transactions">
              <History className="mr-2 h-4 w-4" /> Transaction History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="rounded-full bg-gray-100 p-3 mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                      <History className="h-8 w-8 text-gray-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      No Transactions Yet
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      You haven't made any token transactions yet. Transactions
                      will appear here when you receive or send tokens.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 text-left">
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date & Time
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Token
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {transactions.map((transaction) => {
                          const typeDetails = getTransactionTypeDetails(
                            transaction.transaction_type,
                          );
                          return (
                            <tr
                              key={transaction.id}
                              className="hover:bg-gray-50"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                                  <span>
                                    {new Date(
                                      transaction.created_at,
                                    ).toLocaleString()}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  {transaction.token.logo_url ? (
                                    <img
                                      src={transaction.token.logo_url}
                                      alt={transaction.token.name}
                                      className="h-6 w-6 rounded-full mr-2"
                                    />
                                  ) : (
                                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                                      <Coins className="h-3 w-3 text-blue-600" />
                                    </div>
                                  )}
                                  <span className="font-medium">
                                    {transaction.token.symbol}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge className={typeDetails.className}>
                                  <div className="flex items-center">
                                    {typeDetails.icon}
                                    <span className="ml-1">
                                      {typeDetails.label}
                                    </span>
                                  </div>
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                {transaction.amount.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 8,
                                })}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                {transaction.description || "-"}
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
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default UserTokens;
