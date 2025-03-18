import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
import { getTokens } from "@/lib/tokenApi";
import { getFaucets, createFaucet, updateFaucet } from "@/lib/tokenApi";
import {
  Droplet,
  Plus,
  Search,
  Edit,
  Trash2,
  Check,
  X,
  RefreshCw,
  Calendar,
  Clock,
} from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";

interface Token {
  id: string;
  name: string;
  symbol: string;
  logo_url?: string;
  is_active: boolean;
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
  created_at: string;
  token: Token;
}

const FaucetManagement = () => {
  const [faucets, setFaucets] = useState<Faucet[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFaucets, setFilteredFaucets] = useState<Faucet[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedFaucet, setSelectedFaucet] = useState<Faucet | null>(null);

  // Form states
  const [faucetName, setFaucetName] = useState("");
  const [selectedTokenId, setSelectedTokenId] = useState("");
  const [amountPerClaim, setAmountPerClaim] = useState("");
  const [claimInterval, setClaimInterval] = useState("");
  const [maxClaims, setMaxClaims] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [faucetDescription, setFaucetDescription] = useState("");

  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchFaucets();
    fetchTokens();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFaucets(faucets);
    } else {
      const filtered = faucets.filter(
        (faucet) =>
          faucet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faucet.token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faucet.token.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredFaucets(filtered);
    }
  }, [searchQuery, faucets]);

  const fetchFaucets = async () => {
    try {
      setLoading(true);
      const data = await getFaucets();
      setFaucets(data);
      setFilteredFaucets(data);
    } catch (err: any) {
      setError(err.message || "Failed to load faucets");
      console.error("Error fetching faucets:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTokens = async () => {
    try {
      const data = await getTokens();
      setTokens(data.filter((token: Token) => token.is_active));
    } catch (err: any) {
      console.error("Error fetching tokens:", err);
    }
  };

  const handleCreateFaucet = async () => {
    try {
      if (
        !faucetName ||
        !selectedTokenId ||
        !amountPerClaim ||
        !claimInterval
      ) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      const amount = parseFloat(amountPerClaim);
      if (isNaN(amount) || amount <= 0) {
        toast({
          title: "Validation Error",
          description: "Amount per claim must be a positive number",
          variant: "destructive",
        });
        return;
      }

      const interval = parseInt(claimInterval);
      if (isNaN(interval) || interval <= 0) {
        toast({
          title: "Validation Error",
          description: "Claim interval must be a positive number",
          variant: "destructive",
        });
        return;
      }

      let maxClaimsValue = null;
      if (maxClaims) {
        maxClaimsValue = parseInt(maxClaims);
        if (isNaN(maxClaimsValue) || maxClaimsValue <= 0) {
          toast({
            title: "Validation Error",
            description: "Max claims must be a positive number",
            variant: "destructive",
          });
          return;
        }
      }

      const newFaucet = {
        name: faucetName,
        token_id: selectedTokenId,
        amount_per_claim: amount,
        claim_interval_hours: interval,
        max_claims_per_user: maxClaimsValue,
        start_date: startDate || null,
        end_date: endDate || null,
        description: faucetDescription || null,
        created_by: user?.id,
        is_active: true,
      };

      await createFaucet(newFaucet);
      toast({
        title: "Success",
        description: `Faucet ${faucetName} created successfully`,
      });

      // Reset form and close dialog
      resetForm();
      setIsCreateDialogOpen(false);
      fetchFaucets();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to create faucet",
        variant: "destructive",
      });
    }
  };

  const handleEditFaucet = async () => {
    try {
      if (!selectedFaucet) return;

      if (
        !faucetName ||
        !selectedTokenId ||
        !amountPerClaim ||
        !claimInterval
      ) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      const amount = parseFloat(amountPerClaim);
      if (isNaN(amount) || amount <= 0) {
        toast({
          title: "Validation Error",
          description: "Amount per claim must be a positive number",
          variant: "destructive",
        });
        return;
      }

      const interval = parseInt(claimInterval);
      if (isNaN(interval) || interval <= 0) {
        toast({
          title: "Validation Error",
          description: "Claim interval must be a positive number",
          variant: "destructive",
        });
        return;
      }

      let maxClaimsValue = null;
      if (maxClaims) {
        maxClaimsValue = parseInt(maxClaims);
        if (isNaN(maxClaimsValue) || maxClaimsValue <= 0) {
          toast({
            title: "Validation Error",
            description: "Max claims must be a positive number",
            variant: "destructive",
          });
          return;
        }
      }

      const updatedFaucet = {
        name: faucetName,
        token_id: selectedTokenId,
        amount_per_claim: amount,
        claim_interval_hours: interval,
        max_claims_per_user: maxClaimsValue,
        start_date: startDate || null,
        end_date: endDate || null,
        description: faucetDescription || null,
        updated_at: new Date().toISOString(),
      };

      await updateFaucet(selectedFaucet.id, updatedFaucet);
      toast({
        title: "Success",
        description: `Faucet ${faucetName} updated successfully`,
      });

      // Reset form and close dialog
      resetForm();
      setIsEditDialogOpen(false);
      setSelectedFaucet(null);
      fetchFaucets();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update faucet",
        variant: "destructive",
      });
    }
  };

  const handleToggleFaucetStatus = async (faucet: Faucet) => {
    try {
      await updateFaucet(faucet.id, {
        is_active: !faucet.is_active,
        updated_at: new Date().toISOString(),
      });

      toast({
        title: "Success",
        description: `Faucet ${faucet.name} ${faucet.is_active ? "deactivated" : "activated"} successfully`,
      });

      fetchFaucets();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update faucet status",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (faucet: Faucet) => {
    setSelectedFaucet(faucet);
    setFaucetName(faucet.name);
    setSelectedTokenId(faucet.token_id);
    setAmountPerClaim(faucet.amount_per_claim.toString());
    setClaimInterval(faucet.claim_interval_hours.toString());
    setMaxClaims(faucet.max_claims_per_user?.toString() || "");
    setStartDate(faucet.start_date || "");
    setEndDate(faucet.end_date || "");
    setFaucetDescription(faucet.description || "");
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFaucetName("");
    setSelectedTokenId("");
    setAmountPerClaim("");
    setClaimInterval("");
    setMaxClaims("");
    setStartDate("");
    setEndDate("");
    setFaucetDescription("");
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
            <p className="mt-4 text-gray-600">Loading faucets...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Faucet Management</h1>
          <p className="text-gray-500">
            Create and manage token faucets for your MLM system
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search faucets..."
              className="pl-10 w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            onClick={() => {
              resetForm();
              setIsCreateDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Create New Faucet
          </Button>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="active">
              <Check className="mr-2 h-4 w-4" /> Active Faucets
            </TabsTrigger>
            <TabsTrigger value="all">
              <Droplet className="mr-2 h-4 w-4" /> All Faucets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Faucets</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredFaucets.filter((faucet) => faucet.is_active).length ===
                0 ? (
                  <div className="text-center py-8">
                    <div className="rounded-full bg-blue-100 p-3 mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                      <Droplet className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      No Active Faucets Found
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                      {searchQuery
                        ? "No faucets match your search criteria. Try a different search term."
                        : "You haven't created any active faucets yet."}
                    </p>
                    {searchQuery && (
                      <Button
                        variant="outline"
                        onClick={() => setSearchQuery("")}
                      >
                        Clear Search
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 text-left">
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Faucet
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Token
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Interval
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Max Claims
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredFaucets
                          .filter((faucet) => faucet.is_active)
                          .map((faucet) => (
                            <tr key={faucet.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                    <Droplet className="h-4 w-4 text-blue-600" />
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {faucet.name}
                                    </div>
                                    {faucet.description && (
                                      <div className="text-xs text-gray-500">
                                        {faucet.description.length > 50
                                          ? `${faucet.description.substring(0, 50)}...`
                                          : faucet.description}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant="outline" className="font-mono">
                                  {faucet.token.symbol}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {faucet.amount_per_claim.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {faucet.claim_interval_hours} hour
                                {faucet.claim_interval_hours !== 1 ? "s" : ""}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {faucet.max_claims_per_user
                                  ? faucet.max_claims_per_user
                                  : "Unlimited"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openEditDialog(faucet)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleToggleFaucetStatus(faucet)
                                    }
                                  >
                                    <X className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Faucets</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredFaucets.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="rounded-full bg-blue-100 p-3 mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                      <Droplet className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      No Faucets Found
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                      {searchQuery
                        ? "No faucets match your search criteria. Try a different search term."
                        : "You haven't created any faucets yet."}
                    </p>
                    {searchQuery && (
                      <Button
                        variant="outline"
                        onClick={() => setSearchQuery("")}
                      >
                        Clear Search
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 text-left">
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Faucet
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Token
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Interval
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredFaucets.map((faucet) => (
                          <tr key={faucet.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                  <Droplet className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {faucet.name}
                                  </div>
                                  {faucet.description && (
                                    <div className="text-xs text-gray-500">
                                      {faucet.description.length > 50
                                        ? `${faucet.description.substring(0, 50)}...`
                                        : faucet.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant="outline" className="font-mono">
                                {faucet.token.symbol}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {faucet.amount_per_claim.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {faucet.claim_interval_hours} hour
                              {faucet.claim_interval_hours !== 1 ? "s" : ""}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge
                                className={
                                  faucet.is_active
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }
                              >
                                {faucet.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(faucet.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEditDialog(faucet)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleToggleFaucetStatus(faucet)
                                  }
                                >
                                  {faucet.is_active ? (
                                    <X className="h-4 w-4 text-red-500" />
                                  ) : (
                                    <Check className="h-4 w-4 text-green-500" />
                                  )}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create Faucet Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Faucet</DialogTitle>
              <DialogDescription>
                Create a new token faucet for your MLM system
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="faucetName">Faucet Name *</Label>
                <Input
                  id="faucetName"
                  placeholder="e.g., Daily Rewards Faucet"
                  value={faucetName}
                  onChange={(e) => setFaucetName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tokenSelect">Select Token *</Label>
                <Select
                  value={selectedTokenId}
                  onValueChange={setSelectedTokenId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a token" />
                  </SelectTrigger>
                  <SelectContent>
                    {tokens.map((token) => (
                      <SelectItem key={token.id} value={token.id}>
                        {token.name} ({token.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amountPerClaim">Amount Per Claim *</Label>
                <Input
                  id="amountPerClaim"
                  type="number"
                  placeholder="e.g., 100"
                  value={amountPerClaim}
                  onChange={(e) => setAmountPerClaim(e.target.value)}
                  min="0.000001"
                  step="any"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="claimInterval">Claim Interval (Hours) *</Label>
                <Input
                  id="claimInterval"
                  type="number"
                  placeholder="e.g., 24"
                  value={claimInterval}
                  onChange={(e) => setClaimInterval(e.target.value)}
                  min="1"
                  step="1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxClaims">
                  Max Claims Per User (Optional)
                </Label>
                <Input
                  id="maxClaims"
                  type="number"
                  placeholder="Leave empty for unlimited"
                  value={maxClaims}
                  onChange={(e) => setMaxClaims(e.target.value)}
                  min="1"
                  step="1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date (Optional)</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date (Optional)</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="faucetDescription">
                  Description (Optional)
                </Label>
                <textarea
                  id="faucetDescription"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter a description for your faucet"
                  value={faucetDescription}
                  onChange={(e) => setFaucetDescription(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  setIsCreateDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateFaucet}>Create Faucet</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Faucet Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Faucet</DialogTitle>
              <DialogDescription>Update faucet information</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editFaucetName">Faucet Name *</Label>
                <Input
                  id="editFaucetName"
                  placeholder="e.g., Daily Rewards Faucet"
                  value={faucetName}
                  onChange={(e) => setFaucetName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editTokenSelect">Select Token *</Label>
                <Select
                  value={selectedTokenId}
                  onValueChange={setSelectedTokenId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a token" />
                  </SelectTrigger>
                  <SelectContent>
                    {tokens.map((token) => (
                      <SelectItem key={token.id} value={token.id}>
                        {token.name} ({token.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="editAmountPerClaim">Amount Per Claim *</Label>
                <Input
                  id="editAmountPerClaim"
                  type="number"
                  placeholder="e.g., 100"
                  value={amountPerClaim}
                  onChange={(e) => setAmountPerClaim(e.target.value)}
                  min="0.000001"
                  step="any"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editClaimInterval">
                  Claim Interval (Hours) *
                </Label>
                <Input
                  id="editClaimInterval"
                  type="number"
                  placeholder="e.g., 24"
                  value={claimInterval}
                  onChange={(e) => setClaimInterval(e.target.value)}
                  min="1"
                  step="1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editMaxClaims">
                  Max Claims Per User (Optional)
                </Label>
                <Input
                  id="editMaxClaims"
                  type="number"
                  placeholder="Leave empty for unlimited"
                  value={maxClaims}
                  onChange={(e) => setMaxClaims(e.target.value)}
                  min="1"
                  step="1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editStartDate">Start Date (Optional)</Label>
                  <Input
                    id="editStartDate"
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editEndDate">End Date (Optional)</Label>
                  <Input
                    id="editEndDate"
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="editFaucetDescription">
                  Description (Optional)
                </Label>
                <textarea
                  id="editFaucetDescription"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter a description for your faucet"
                  value={faucetDescription}
                  onChange={(e) => setFaucetDescription(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  setIsEditDialogOpen(false);
                  setSelectedFaucet(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleEditFaucet}>Update Faucet</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default FaucetManagement;
