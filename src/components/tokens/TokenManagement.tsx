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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth";
import { getTokens, createToken, updateToken } from "@/lib/tokenApi";
import {
  Coins,
  Plus,
  Search,
  Edit,
  Trash2,
  Check,
  X,
  RefreshCw,
} from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";

interface Token {
  id: string;
  name: string;
  symbol: string;
  total_supply: number;
  description?: string;
  logo_url?: string;
  is_active: boolean;
  created_at: string;
}

const TokenManagement = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTokens, setFilteredTokens] = useState<Token[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  // Form states
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenSupply, setTokenSupply] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");
  const [tokenLogo, setTokenLogo] = useState("");

  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchTokens();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTokens(tokens);
    } else {
      const filtered = tokens.filter(
        (token) =>
          token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          token.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredTokens(filtered);
    }
  }, [searchQuery, tokens]);

  const fetchTokens = async () => {
    try {
      setLoading(true);
      const data = await getTokens();
      setTokens(data);
      setFilteredTokens(data);
    } catch (err: any) {
      setError(err.message || "Failed to load tokens");
      console.error("Error fetching tokens:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateToken = async () => {
    try {
      if (!tokenName || !tokenSymbol || !tokenSupply) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      const supply = parseFloat(tokenSupply);
      if (isNaN(supply) || supply <= 0) {
        toast({
          title: "Validation Error",
          description: "Total supply must be a positive number",
          variant: "destructive",
        });
        return;
      }

      const newToken = {
        name: tokenName,
        symbol: tokenSymbol.toUpperCase(),
        total_supply: supply,
        description: tokenDescription || null,
        logo_url: tokenLogo || null,
        created_by: user?.id,
        is_active: true,
      };

      await createToken(newToken);
      toast({
        title: "Success",
        description: `Token ${tokenName} (${tokenSymbol.toUpperCase()}) created successfully`,
      });

      // Reset form and close dialog
      resetForm();
      setIsCreateDialogOpen(false);
      fetchTokens();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to create token",
        variant: "destructive",
      });
    }
  };

  const handleEditToken = async () => {
    try {
      if (!selectedToken) return;

      if (!tokenName || !tokenSymbol || !tokenSupply) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      const supply = parseFloat(tokenSupply);
      if (isNaN(supply) || supply <= 0) {
        toast({
          title: "Validation Error",
          description: "Total supply must be a positive number",
          variant: "destructive",
        });
        return;
      }

      const updatedToken = {
        name: tokenName,
        symbol: tokenSymbol.toUpperCase(),
        total_supply: supply,
        description: tokenDescription || null,
        logo_url: tokenLogo || null,
        updated_at: new Date().toISOString(),
      };

      await updateToken(selectedToken.id, updatedToken);
      toast({
        title: "Success",
        description: `Token ${tokenName} (${tokenSymbol.toUpperCase()}) updated successfully`,
      });

      // Reset form and close dialog
      resetForm();
      setIsEditDialogOpen(false);
      setSelectedToken(null);
      fetchTokens();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update token",
        variant: "destructive",
      });
    }
  };

  const handleToggleTokenStatus = async (token: Token) => {
    try {
      await updateToken(token.id, {
        is_active: !token.is_active,
        updated_at: new Date().toISOString(),
      });

      toast({
        title: "Success",
        description: `Token ${token.name} ${token.is_active ? "deactivated" : "activated"} successfully`,
      });

      fetchTokens();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update token status",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (token: Token) => {
    setSelectedToken(token);
    setTokenName(token.name);
    setTokenSymbol(token.symbol);
    setTokenSupply(token.total_supply.toString());
    setTokenDescription(token.description || "");
    setTokenLogo(token.logo_url || "");
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setTokenName("");
    setTokenSymbol("");
    setTokenSupply("");
    setTokenDescription("");
    setTokenLogo("");
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
            <p className="mt-4 text-gray-600">Loading tokens...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Token Management</h1>
          <p className="text-gray-500">
            Create and manage tokens for your MLM system
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
              placeholder="Search tokens..."
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
            <Plus className="mr-2 h-4 w-4" /> Create New Token
          </Button>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="active">
              <Check className="mr-2 h-4 w-4" /> Active Tokens
            </TabsTrigger>
            <TabsTrigger value="all">
              <Coins className="mr-2 h-4 w-4" /> All Tokens
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Tokens</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredTokens.filter((token) => token.is_active).length ===
                0 ? (
                  <div className="text-center py-8">
                    <div className="rounded-full bg-blue-100 p-3 mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                      <Coins className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      No Active Tokens Found
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                      {searchQuery
                        ? "No tokens match your search criteria. Try a different search term."
                        : "You haven't created any active tokens yet."}
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
                            Token
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Symbol
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total Supply
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
                        {filteredTokens
                          .filter((token) => token.is_active)
                          .map((token) => (
                            <tr key={token.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  {token.logo_url ? (
                                    <img
                                      src={token.logo_url}
                                      alt={token.name}
                                      className="h-8 w-8 rounded-full mr-3"
                                    />
                                  ) : (
                                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                      <Coins className="h-4 w-4 text-blue-600" />
                                    </div>
                                  )}
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {token.name}
                                    </div>
                                    {token.description && (
                                      <div className="text-xs text-gray-500">
                                        {token.description.length > 50
                                          ? `${token.description.substring(0, 50)}...`
                                          : token.description}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant="outline" className="font-mono">
                                  {token.symbol}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {token.total_supply.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(
                                  token.created_at,
                                ).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openEditDialog(token)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleToggleTokenStatus(token)
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
                <CardTitle>All Tokens</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredTokens.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="rounded-full bg-blue-100 p-3 mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                      <Coins className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      No Tokens Found
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                      {searchQuery
                        ? "No tokens match your search criteria. Try a different search term."
                        : "You haven't created any tokens yet."}
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
                            Token
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Symbol
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total Supply
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
                        {filteredTokens.map((token) => (
                          <tr key={token.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {token.logo_url ? (
                                  <img
                                    src={token.logo_url}
                                    alt={token.name}
                                    className="h-8 w-8 rounded-full mr-3"
                                  />
                                ) : (
                                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                    <Coins className="h-4 w-4 text-blue-600" />
                                  </div>
                                )}
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {token.name}
                                  </div>
                                  {token.description && (
                                    <div className="text-xs text-gray-500">
                                      {token.description.length > 50
                                        ? `${token.description.substring(0, 50)}...`
                                        : token.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant="outline" className="font-mono">
                                {token.symbol}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {token.total_supply.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge
                                className={
                                  token.is_active
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }
                              >
                                {token.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(token.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEditDialog(token)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleToggleTokenStatus(token)}
                                >
                                  {token.is_active ? (
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

        {/* Create Token Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Token</DialogTitle>
              <DialogDescription>
                Create a new token for your MLM system
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="tokenName">Token Name *</Label>
                <Input
                  id="tokenName"
                  placeholder="e.g., Matrix Coin"
                  value={tokenName}
                  onChange={(e) => setTokenName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tokenSymbol">Token Symbol *</Label>
                <Input
                  id="tokenSymbol"
                  placeholder="e.g., MTX"
                  value={tokenSymbol}
                  onChange={(e) => setTokenSymbol(e.target.value)}
                  maxLength={10}
                  required
                />
                <p className="text-xs text-gray-500">Maximum 10 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tokenSupply">Total Supply *</Label>
                <Input
                  id="tokenSupply"
                  type="number"
                  placeholder="e.g., 1000000"
                  value={tokenSupply}
                  onChange={(e) => setTokenSupply(e.target.value)}
                  min="1"
                  step="any"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tokenDescription">Description (Optional)</Label>
                <textarea
                  id="tokenDescription"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter a description for your token"
                  value={tokenDescription}
                  onChange={(e) => setTokenDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tokenLogo">Logo URL (Optional)</Label>
                <Input
                  id="tokenLogo"
                  placeholder="https://example.com/logo.png"
                  value={tokenLogo}
                  onChange={(e) => setTokenLogo(e.target.value)}
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
              <Button onClick={handleCreateToken}>Create Token</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Token Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Token</DialogTitle>
              <DialogDescription>Update token information</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editTokenName">Token Name *</Label>
                <Input
                  id="editTokenName"
                  placeholder="e.g., Matrix Coin"
                  value={tokenName}
                  onChange={(e) => setTokenName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editTokenSymbol">Token Symbol *</Label>
                <Input
                  id="editTokenSymbol"
                  placeholder="e.g., MTX"
                  value={tokenSymbol}
                  onChange={(e) => setTokenSymbol(e.target.value)}
                  maxLength={10}
                  required
                />
                <p className="text-xs text-gray-500">Maximum 10 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="editTokenSupply">Total Supply *</Label>
                <Input
                  id="editTokenSupply"
                  type="number"
                  placeholder="e.g., 1000000"
                  value={tokenSupply}
                  onChange={(e) => setTokenSupply(e.target.value)}
                  min="1"
                  step="any"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editTokenDescription">
                  Description (Optional)
                </Label>
                <textarea
                  id="editTokenDescription"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter a description for your token"
                  value={tokenDescription}
                  onChange={(e) => setTokenDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editTokenLogo">Logo URL (Optional)</Label>
                <Input
                  id="editTokenLogo"
                  placeholder="https://example.com/logo.png"
                  value={tokenLogo}
                  onChange={(e) => setTokenLogo(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  setIsEditDialogOpen(false);
                  setSelectedToken(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleEditToken}>Update Token</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default TokenManagement;
