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
import {
  getAirdrops,
  createAirdrop,
  updateAirdrop,
  distributeAirdrop,
} from "@/lib/tokenApi";
import {
  Coins,
  Plus,
  Search,
  Edit,
  Trash2,
  Check,
  X,
  RefreshCw,
  Calendar,
  Clock,
  Users,
  Send,
} from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";

interface Token {
  id: string;
  name: string;
  symbol: string;
  logo_url?: string;
  is_active: boolean;
}

interface Airdrop {
  id: string;
  name: string;
  token_id: string;
  amount_per_user: number;
  total_amount: number;
  distributed_amount: number;
  airdrop_type: string;
  criteria?: Record<string, any>;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  description?: string;
  created_at: string;
  token: Token;
}

const AirdropManagement = () => {
  const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAirdrops, setFilteredAirdrops] = useState<Airdrop[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDistributeDialogOpen, setIsDistributeDialogOpen] = useState(false);
  const [selectedAirdrop, setSelectedAirdrop] = useState<Airdrop | null>(null);

  // Form states
  const [airdropName, setAirdropName] = useState("");
  const [selectedTokenId, setSelectedTokenId] = useState("");
  const [amountPerUser, setAmountPerUser] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [airdropType, setAirdropType] = useState("claim");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [airdropDescription, setAirdropDescription] = useState("");
  const [userIds, setUserIds] = useState("");

  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchAirdrops();
    fetchTokens();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredAirdrops(airdrops);
    } else {
      const filtered = airdrops.filter(
        (airdrop) =>
          airdrop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          airdrop.token.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          airdrop.token.symbol
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
      setFilteredAirdrops(filtered);
    }
  }, [searchQuery, airdrops]);

  const fetchAirdrops = async () => {
    try {
      setLoading(true);
      const data = await getAirdrops();
      setAirdrops(data);
      setFilteredAirdrops(data);
    } catch (err: any) {
      setError(err.message || "Failed to load airdrops");
      console.error("Error fetching airdrops:", err);
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

  const handleCreateAirdrop = async () => {
    try {
      if (!airdropName || !selectedTokenId || !amountPerUser || !totalAmount) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      const amount = parseFloat(amountPerUser);
      if (isNaN(amount) || amount <= 0) {
        toast({
          title: "Validation Error",
          description: "Amount per user must be a positive number",
          variant: "destructive",
        });
        return;
      }

      const total = parseFloat(totalAmount);
      if (isNaN(total) || total <= 0) {
        toast({
          title: "Validation Error",
          description: "Total amount must be a positive number",
          variant: "destructive",
        });
        return;
      }

      const newAirdrop = {
        name: airdropName,
        token_id: selectedTokenId,
        amount_per_user: amount,
        total_amount: total,
        distributed_amount: 0,
        airdrop_type: airdropType,
        start_date: startDate || null,
        end_date: endDate || null,
        description: airdropDescription || null,
        created_by: user?.id,
        is_active: true,
      };

      await createAirdrop(newAirdrop);
      toast({
        title: "Success",
        description: `Airdrop ${airdropName} created successfully`,
      });

      // Reset form and close dialog
      resetForm();
      setIsCreateDialogOpen(false);
      fetchAirdrops();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to create airdrop",
        variant: "destructive",
      });
    }
  };

  const handleEditAirdrop = async () => {
    try {
      if (!selectedAirdrop) return;

      if (!airdropName || !selectedTokenId || !amountPerUser || !totalAmount) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      const amount = parseFloat(amountPerUser);
      if (isNaN(amount) || amount <= 0) {
        toast({
          title: "Validation Error",
          description: "Amount per user must be a positive number",
          variant: "destructive",
        });
        return;
      }

      const total = parseFloat(totalAmount);
      if (isNaN(total) || total <= 0) {
        toast({
          title: "Validation Error",
          description: "Total amount must be a positive number",
          variant: "destructive",
        });
        return;
      }

      const updatedAirdrop = {
        name: airdropName,
        token_id: selectedTokenId,
        amount_per_user: amount,
        total_amount: total,
        airdrop_type: airdropType,
        start_date: startDate || null,
        end_date: endDate || null,
        description: airdropDescription || null,
        updated_at: new Date().toISOString(),
      };

      await updateAirdrop(selectedAirdrop.id, updatedAirdrop);
      toast({
        title: "Success",
        description: `Airdrop ${airdropName} updated successfully`,
      });

      // Reset form and close dialog
      resetForm();
      setIsEditDialogOpen(false);
      setSelectedAirdrop(null);
      fetchAirdrops();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update airdrop",
        variant: "destructive",
      });
    }
  };

  const handleToggleAirdropStatus = async (airdrop: Airdrop) => {
    try {
      await updateAirdrop(airdrop.id, {
        is_active: !airdrop.is_active,
        updated_at: new Date().toISOString(),
      });

      toast({
        title: "Success",
        description: `Airdrop ${airdrop.name} ${airdrop.is_active ? "deactivated" : "activated"} successfully`,
      });

      fetchAirdrops();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update airdrop status",
        variant: "destructive",
      });
    }
  };

  const handleDistributeAirdrop = async () => {
    try {
      if (!selectedAirdrop) return;

      if (!userIds.trim()) {
        toast({
          title: "Validation Error",
          description: "Please enter at least one user ID",
          variant: "destructive",
        });
        return;
      }

      const userIdList = userIds
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id);

      if (userIdList.length === 0) {
        toast({
          title: "Validation Error",
          description: "Please enter valid user IDs",
          variant: "destructive",
        });
        return;
      }

      const results = await distributeAirdrop(selectedAirdrop.id, userIdList);
      const successCount = results.filter((r) => r.success).length;
      const failCount = results.length - successCount;

      toast({
        title: "Airdrop Distribution Complete",
        description: `Successfully distributed to ${successCount} users. Failed: ${failCount}`,
        variant: successCount > 0 ? "default" : "destructive",
      });

      // Reset form and close dialog
      setUserIds("");
      setIsDistributeDialogOpen(false);
      setSelectedAirdrop(null);
      fetchAirdrops();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to distribute airdrop",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (airdrop: Airdrop) => {
    setSelectedAirdrop(airdrop);
    setAirdropName(airdrop.name);
    setSelectedTokenId(airdrop.token_id);
    setAmountPerUser(airdrop.amount_per_user.toString());
    setTotalAmount(airdrop.total_amount.toString());
    setAirdropType(airdrop.airdrop_type);
    setStartDate(airdrop.start_date || "");
    setEndDate(airdrop.end_date || "");
    setAirdropDescription(airdrop.description || "");
    setIsEditDialogOpen(true);
  };

  const openDistributeDialog = (airdrop: Airdrop) => {
    setSelectedAirdrop(airdrop);
    setUserIds("");
    setIsDistributeDialogOpen(true);
  };

  const resetForm = () => {
    setAirdropName("");
    setSelectedTokenId("");
    setAmountPerUser("");
    setTotalAmount("");
    setAirdropType("claim");
    setStartDate("");
    setEndDate("");
    setAirdropDescription("");
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
            <p className="mt-4 text-gray-600">Loading airdrops...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Airdrop Management</h1>
          <p className="text-gray-500">
            Create and manage token airdrops for your MLM system
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
              placeholder="Search airdrops..."
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
            <Plus className="mr-2 h-4 w-4" /> Create New Airdrop
          </Button>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="active">
              <Check className="mr-2 h-4 w-4" /> Active Airdrops
            </TabsTrigger>
            <TabsTrigger value="all">
              <Coins className="mr-2 h-4 w-4" /> All Airdrops
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Airdrops</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredAirdrops.filter((airdrop) => airdrop.is_active)
                  .length === 0 ? (
                  <div className="text-center py-8">
                    <div className="rounded-full bg-purple-100 p-3 mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                      <Coins className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      No Active Airdrops Found
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                      {searchQuery
                        ? "No airdrops match your search criteria. Try a different search term."
                        : "You haven't created any active airdrops yet."}
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
                            Airdrop
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Token
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Period
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredAirdrops
                          .filter((airdrop) => airdrop.is_active)
                          .map((airdrop) => (
                            <tr key={airdrop.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                                    <Coins className="h-4 w-4 text-purple-600" />
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {airdrop.name}
                                    </div>
                                    {airdrop.description && (
                                      <div className="text-xs text-gray-500">
                                        {airdrop.description.length > 50
                                          ? `${airdrop.description.substring(0, 50)}...`
                                          : airdrop.description}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant="outline" className="font-mono">
                                  {airdrop.token.symbol}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <div>
                                  <div>
                                    {airdrop.amount_per_user.toLocaleString()}{" "}
                                    per user
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Total:{" "}
                                    {airdrop.total_amount.toLocaleString()}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge className="bg-purple-100 text-purple-800">
                                  {airdrop.airdrop_type === "claim"
                                    ? "Claimable"
                                    : "Distribution"}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {airdrop.start_date && (
                                  <div className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {new Date(
                                      airdrop.start_date,
                                    ).toLocaleDateString()}
                                  </div>
                                )}
                                {airdrop.end_date && (
                                  <div className="flex items-center mt-1">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {new Date(
                                      airdrop.end_date,
                                    ).toLocaleDateString()}
                                  </div>
                                )}
                                {!airdrop.start_date &&
                                  !airdrop.end_date &&
                                  "No time limit"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openEditDialog(airdrop)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  {airdrop.airdrop_type === "distribution" && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        openDistributeDialog(airdrop)
                                      }
                                    >
                                      <Send className="h-4 w-4 text-blue-500" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleToggleAirdropStatus(airdrop)
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
                <CardTitle>All Airdrops</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredAirdrops.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="rounded-full bg-purple-100 p-3 mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                      <Coins className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      No Airdrops Found
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                      {searchQuery
                        ? "No airdrops match your search criteria. Try a different search term."
                        : "You haven't created any airdrops yet."}
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
                            Airdrop
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Token
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
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
                        {filteredAirdrops.map((airdrop) => (
                          <tr key={airdrop.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                                  <Coins className="h-4 w-4 text-purple-600" />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {airdrop.name}
                                  </div>
                                  {airdrop.description && (
                                    <div className="text-xs text-gray-500">
                                      {airdrop.description.length > 50
                                        ? `${airdrop.description.substring(0, 50)}...`
                                        : airdrop.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant="outline" className="font-mono">
                                {airdrop.token.symbol}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div>
                                <div>
                                  {airdrop.amount_per_user.toLocaleString()} per
                                  user
                                </div>
                                <div className="text-xs text-gray-500">
                                  Total: {airdrop.total_amount.toLocaleString()}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className="bg-purple-100 text-purple-800">
                                {airdrop.airdrop_type === "claim"
                                  ? "Claimable"
                                  : "Distribution"}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge
                                className={
                                  airdrop.is_active
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }
                              >
                                {airdrop.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(
                                airdrop.created_at,
                              ).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEditDialog(airdrop)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                {airdrop.is_active &&
                                  airdrop.airdrop_type === "distribution" && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        openDistributeDialog(airdrop)
                                      }
                                    >
                                      <Send className="h-4 w-4 text-blue-500" />
                                    </Button>
                                  )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleToggleAirdropStatus(airdrop)
                                  }
                                >
                                  {airdrop.is_active ? (
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

        {/* Create Airdrop Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Airdrop</DialogTitle>
              <DialogDescription>
                Create a new token airdrop for your MLM system
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="airdropName">Airdrop Name *</Label>
                <Input
                  id="airdropName"
                  placeholder="e.g., Launch Celebration Airdrop"
                  value={airdropName}
                  onChange={(e) => setAirdropName(e.target.value)}
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
                <Label htmlFor="amountPerUser">Amount Per User *</Label>
                <Input
                  id="amountPerUser"
                  type="number"
                  placeholder="e.g., 100"
                  value={amountPerUser}
                  onChange={(e) => setAmountPerUser(e.target.value)}
                  min="0.000001"
                  step="any"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalAmount">Total Amount *</Label>
                <Input
                  id="totalAmount"
                  type="number"
                  placeholder="e.g., 10000"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  min="0.000001"
                  step="any"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="airdropType">Airdrop Type *</Label>
                <Select value={airdropType} onValueChange={setAirdropType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="claim">Claimable by Users</SelectItem>
                    <SelectItem value="distribution">
                      Admin Distribution
                    </SelectItem>
                  </SelectContent>
                </Select>
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
                <Label htmlFor="airdropDescription">
                  Description (Optional)
                </Label>
                <textarea
                  id="airdropDescription"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter a description for your airdrop"
                  value={airdropDescription}
                  onChange={(e) => setAirdropDescription(e.target.value)}
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
              <Button onClick={handleCreateAirdrop}>Create Airdrop</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Airdrop Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Airdrop</DialogTitle>
              <DialogDescription>Update airdrop information</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editAirdropName">Airdrop Name *</Label>
                <Input
                  id="editAirdropName"
                  placeholder="e.g., Launch Celebration Airdrop"
                  value={airdropName}
                  onChange={(e) => setAirdropName(e.target.value)}
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
                <Label htmlFor="editAmountPerUser">Amount Per User *</Label>
                <Input
                  id="editAmountPerUser"
                  type="number"
                  placeholder="e.g., 100"
                  value={amountPerUser}
                  onChange={(e) => setAmountPerUser(e.target.value)}
                  min="0.000001"
                  step="any"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editTotalAmount">Total Amount *</Label>
                <Input
                  id="editTotalAmount"
                  type="number"
                  placeholder="e.g., 10000"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  min="0.000001"
                  step="any"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editAirdropType">Airdrop Type *</Label>
                <Select value={airdropType} onValueChange={setAirdropType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="claim">Claimable by Users</SelectItem>
                    <SelectItem value="distribution">
                      Admin Distribution
                    </SelectItem>
                  </SelectContent>
                </Select>
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
                <Label htmlFor="editAirdropDescription">
                  Description (Optional)
                </Label>
                <textarea
                  id="editAirdropDescription"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter a description for your airdrop"
                  value={airdropDescription}
                  onChange={(e) => setAirdropDescription(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  setIsEditDialogOpen(false);
                  setSelectedAirdrop(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleEditAirdrop}>Update Airdrop</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Distribute Airdrop Dialog */}
        <Dialog
          open={isDistributeDialogOpen}
          onOpenChange={setIsDistributeDialogOpen}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Distribute Airdrop</DialogTitle>
              <DialogDescription>
                {selectedAirdrop && (
                  <span>
                    Distribute {selectedAirdrop.name} (
                    {selectedAirdrop.token.symbol}) to users
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="userIds">User IDs *</Label>
                <textarea
                  id="userIds"
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter user IDs separated by commas"
                  value={userIds}
                  onChange={(e) => setUserIds(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500">
                  Enter user IDs separated by commas. Each user will receive{" "}
                  {selectedAirdrop?.amount_per_user.toLocaleString()}{" "}
                  {selectedAirdrop?.token.symbol} tokens.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setUserIds("");
                  setIsDistributeDialogOpen(false);
                  setSelectedAirdrop(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleDistributeAirdrop}>
                <Send className="mr-2 h-4 w-4" /> Distribute
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AirdropManagement;
