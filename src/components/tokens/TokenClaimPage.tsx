import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth";
import {
  getFaucets,
  getUserFaucetClaims,
  canUserClaimFaucet,
  claimFaucet,
  getUserEligibleAirdrops,
  getUserAirdropClaims,
  claimAirdrop,
} from "@/lib/tokenApi";
import {
  Coins,
  Clock,
  RefreshCw,
  Droplet,
  Gift,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";

interface Token {
  id: string;
  name: string;
  symbol: string;
  logo_url?: string;
}

interface Faucet {
  id: string;
  name: string;
  token_id: string;
  amount_per_claim: number;
  claim_interval_hours: number;
  max_claims_per_user: number | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  description?: string;
  token: Token;
}

interface Airdrop {
  id: string;
  name: string;
  token_id: string;
  amount_per_user: number;
  airdrop_type: string;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  description?: string;
  token: Token;
}

interface FaucetClaim {
  id: string;
  user_id: string;
  faucet_id: string;
  amount: number;
  created_at: string;
}

interface AirdropClaim {
  id: string;
  user_id: string;
  airdrop_id: string;
  amount: number;
  created_at: string;
  airdrop: Airdrop;
}

const TokenClaimPage = () => {
  const [faucets, setFaucets] = useState<Faucet[]>([]);
  const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
  const [faucetClaims, setFaucetClaims] = useState<
    Record<string, FaucetClaim[]>
  >({});
  const [airdropClaims, setAirdropClaims] = useState<AirdropClaim[]>([]);
  const [claimStatus, setClaimStatus] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [claimingFaucet, setClaimingFaucet] = useState<string | null>(null);
  const [claimingAirdrop, setClaimingAirdrop] = useState<string | null>(null);

  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      await Promise.all([
        fetchFaucets(),
        fetchAirdrops(),
        fetchFaucetClaims(),
        fetchAirdropClaims(),
      ]);
    } catch (err: any) {
      setError(err.message || "Failed to load data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFaucets = async () => {
    const data = await getFaucets();
    setFaucets(data);

    // Check claim status for each faucet
    const statusPromises = data.map(async (faucet) => {
      if (!user) return;
      const status = await canUserClaimFaucet(user.id, faucet.id);
      return { faucetId: faucet.id, status };
    });

    const statuses = await Promise.all(statusPromises);
    const statusMap: Record<string, any> = {};
    statuses.forEach((item) => {
      if (item) {
        statusMap[item.faucetId] = item.status;
      }
    });

    setClaimStatus(statusMap);
  };

  const fetchAirdrops = async () => {
    if (!user) return;
    const data = await getUserEligibleAirdrops(user.id);
    setAirdrops(data);
  };

  const fetchFaucetClaims = async () => {
    if (!user) return;

    const claimsMap: Record<string, FaucetClaim[]> = {};
    for (const faucet of faucets) {
      const claims = await getUserFaucetClaims(user.id, faucet.id);
      claimsMap[faucet.id] = claims;
    }

    setFaucetClaims(claimsMap);
  };

  const fetchAirdropClaims = async () => {
    if (!user) return;
    const claims = await getUserAirdropClaims(user.id);
    setAirdropClaims(claims);
  };

  const handleClaimFaucet = async (faucetId: string) => {
    if (!user) return;

    try {
      setClaimingFaucet(faucetId);
      await claimFaucet(user.id, faucetId);

      toast({
        title: "Success",
        description: "Tokens claimed successfully!",
      });

      // Refresh data
      await fetchData();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to claim tokens",
        variant: "destructive",
      });
    } finally {
      setClaimingFaucet(null);
    }
  };

  const handleClaimAirdrop = async (airdropId: string) => {
    if (!user) return;

    try {
      setClaimingAirdrop(airdropId);
      await claimAirdrop(user.id, airdropId);

      toast({
        title: "Success",
        description: "Airdrop claimed successfully!",
      });

      // Refresh data
      await fetchData();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to claim airdrop",
        variant: "destructive",
      });
    } finally {
      setClaimingAirdrop(null);
    }
  };

  const formatTimeRemaining = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} hour${hours !== 1 ? "s" : ""} ${remainingMinutes > 0 ? `${remainingMinutes} minute${remainingMinutes !== 1 ? "s" : ""}` : ""}`;
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
            <p className="mt-4 text-gray-600">Loading token claims...</p>
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
            <h1 className="text-2xl font-bold">Token Claims</h1>
            <p className="text-gray-500">
              Claim tokens from faucets and airdrops
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

        <Tabs defaultValue="faucets" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="faucets">
              <Droplet className="mr-2 h-4 w-4" /> Faucets
            </TabsTrigger>
            <TabsTrigger value="airdrops">
              <Gift className="mr-2 h-4 w-4" /> Airdrops
            </TabsTrigger>
            <TabsTrigger value="history">
              <Clock className="mr-2 h-4 w-4" /> Claim History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="faucets" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Faucets</CardTitle>
              </CardHeader>
              <CardContent>
                {faucets.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="rounded-full bg-blue-100 p-3 mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                      <Droplet className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      No Faucets Available
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      There are no token faucets available at the moment. Check
                      back later.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {faucets.map((faucet) => {
                      const status = claimStatus[faucet.id] || {
                        canClaim: false,
                        reason: "Unknown status",
                      };
                      return (
                        <Card key={faucet.id} className="overflow-hidden">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                  <Droplet className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                  <h3 className="font-medium text-lg">
                                    {faucet.name}
                                  </h3>
                                  <Badge
                                    variant="outline"
                                    className="font-mono"
                                  >
                                    {faucet.token.symbol}
                                  </Badge>
                                </div>
                              </div>
                            </div>

                            <div className="mb-4">
                              <p className="text-sm text-gray-500">
                                Amount per claim
                              </p>
                              <p className="text-xl font-bold">
                                {faucet.amount_per_claim.toLocaleString(
                                  undefined,
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 8,
                                  },
                                )}
                              </p>
                            </div>

                            <div className="mb-4">
                              <p className="text-sm text-gray-500">
                                Claim interval
                              </p>
                              <p className="text-sm">
                                {faucet.claim_interval_hours} hour
                                {faucet.claim_interval_hours !== 1 ? "s" : ""}
                              </p>
                            </div>

                            {faucet.max_claims_per_user && (
                              <div className="mb-4">
                                <p className="text-sm text-gray-500">
                                  Max claims per user
                                </p>
                                <p className="text-sm">
                                  {faucet.max_claims_per_user}
                                </p>
                              </div>
                            )}

                            <div className="mb-4">
                              {status.canClaim ? (
                                <div className="flex items-center text-green-600 mb-2">
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  <span className="text-sm">
                                    Available to claim
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center text-amber-600 mb-2">
                                  <AlertCircle className="h-4 w-4 mr-1" />
                                  <span className="text-sm">
                                    {status.reason}
                                  </span>
                                </div>
                              )}

                              {status.timeRemaining && (
                                <div className="text-sm text-gray-500">
                                  Next claim in{" "}
                                  {formatTimeRemaining(status.timeRemaining)}
                                </div>
                              )}
                            </div>

                            <Button
                              className="w-full"
                              disabled={
                                !status.canClaim || claimingFaucet === faucet.id
                              }
                              onClick={() => handleClaimFaucet(faucet.id)}
                            >
                              {claimingFaucet === faucet.id ? (
                                <>
                                  <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <Droplet className="mr-2 h-4 w-4" /> Claim
                                  Tokens
                                </>
                              )}
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="airdrops" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Airdrops</CardTitle>
              </CardHeader>
              <CardContent>
                {airdrops.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="rounded-full bg-purple-100 p-3 mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                      <Gift className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      No Airdrops Available
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      There are no airdrops available for you to claim at the
                      moment. Check back later.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {airdrops.map((airdrop) => (
                      <Card key={airdrop.id} className="overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                                <Gift className="h-5 w-5 text-purple-600" />
                              </div>
                              <div>
                                <h3 className="font-medium text-lg">
                                  {airdrop.name}
                                </h3>
                                <Badge variant="outline" className="font-mono">
                                  {airdrop.token.symbol}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm text-gray-500">Amount</p>
                            <p className="text-xl font-bold">
                              {airdrop.amount_per_user.toLocaleString(
                                undefined,
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 8,
                                },
                              )}
                            </p>
                          </div>

                          {airdrop.description && (
                            <div className="mb-4">
                              <p className="text-sm text-gray-500">
                                Description
                              </p>
                              <p className="text-sm">{airdrop.description}</p>
                            </div>
                          )}

                          <div className="mb-4">
                            {airdrop.start_date && (
                              <div className="flex items-center text-sm text-gray-500 mb-1">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>
                                  Starts:{" "}
                                  {new Date(
                                    airdrop.start_date,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                            {airdrop.end_date && (
                              <div className="flex items-center text-sm text-gray-500">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>
                                  Ends:{" "}
                                  {new Date(
                                    airdrop.end_date,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>

                          <Button
                            className="w-full"
                            disabled={claimingAirdrop === airdrop.id}
                            onClick={() => handleClaimAirdrop(airdrop.id)}
                          >
                            {claimingAirdrop === airdrop.id ? (
                              <>
                                <svg
                                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                                Processing...
                              </>
                            ) : (
                              <>
                                <Gift className="mr-2 h-4 w-4" /> Claim Airdrop
                              </>
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Claim History</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="faucet-claims">
                  <TabsList className="mb-4">
                    <TabsTrigger value="faucet-claims">
                      <Droplet className="mr-2 h-4 w-4" /> Faucet Claims
                    </TabsTrigger>
                    <TabsTrigger value="airdrop-claims">
                      <Gift className="mr-2 h-4 w-4" /> Airdrop Claims
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="faucet-claims">
                    {Object.values(faucetClaims).flat().length === 0 ? (
                      <div className="text-center py-8">
                        <div className="rounded-full bg-gray-100 p-3 mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                          <Clock className="h-8 w-8 text-gray-600" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                          No Faucet Claims Yet
                        </h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                          You haven't claimed any tokens from faucets yet.
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
                                Faucet
                              </th>
                              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Token
                              </th>
                              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {Object.entries(faucetClaims).flatMap(
                              ([faucetId, claims]) =>
                                claims.map((claim) => {
                                  const faucet = faucets.find(
                                    (f) => f.id === faucetId,
                                  );
                                  return (
                                    <tr
                                      key={claim.id}
                                      className="hover:bg-gray-50"
                                    >
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center">
                                          <Clock className="h-4 w-4 mr-2 text-gray-400" />
                                          <span>
                                            {new Date(
                                              claim.created_at,
                                            ).toLocaleString()}
                                          </span>
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                          <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                                            <Droplet className="h-3 w-3 text-blue-600" />
                                          </div>
                                          <span className="font-medium">
                                            {faucet?.name || "Unknown Faucet"}
                                          </span>
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge
                                          variant="outline"
                                          className="font-mono"
                                        >
                                          {faucet?.token.symbol || "??"}
                                        </Badge>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {claim.amount.toLocaleString(
                                          undefined,
                                          {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 8,
                                          },
                                        )}
                                      </td>
                                    </tr>
                                  );
                                }),
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="airdrop-claims">
                    {airdropClaims.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="rounded-full bg-gray-100 p-3 mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                          <Clock className="h-8 w-8 text-gray-600" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                          No Airdrop Claims Yet
                        </h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                          You haven't claimed any airdrops yet.
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
                                Airdrop
                              </th>
                              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Token
                              </th>
                              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {airdropClaims.map((claim) => (
                              <tr key={claim.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                                    <span>
                                      {new Date(
                                        claim.created_at,
                                      ).toLocaleString()}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                                      <Gift className="h-3 w-3 text-purple-600" />
                                    </div>
                                    <span className="font-medium">
                                      {claim.airdrop.name}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <Badge
                                    variant="outline"
                                    className="font-mono"
                                  >
                                    {claim.airdrop.token.symbol}
                                  </Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  {claim.amount.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 8,
                                  })}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TokenClaimPage;
