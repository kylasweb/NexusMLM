import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import {
  Award,
  Plus,
  Search,
  Edit,
  Trash2,
  Star,
  Users,
  ArrowUp,
  ArrowDown,
  Sparkles,
  DollarSign,
} from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";

interface Rank {
  id: string;
  name: string;
  level: number;
  min_direct_referrals: number;
  min_team_size: number;
  min_investment: number;
  commission_rate: number;
  badge_color: string;
  benefits: string[];
  created_at: string;
}

const RankManagement = () => {
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRanks, setFilteredRanks] = useState<Rank[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRank, setSelectedRank] = useState<Rank | null>(null);

  // Form states
  const [rankName, setRankName] = useState("");
  const [rankLevel, setRankLevel] = useState("");
  const [minDirectReferrals, setMinDirectReferrals] = useState("");
  const [minTeamSize, setMinTeamSize] = useState("");
  const [minInvestment, setMinInvestment] = useState("");
  const [commissionRate, setCommissionRate] = useState("");
  const [badgeColor, setBadgeColor] = useState("#6366F1");
  const [benefits, setBenefits] = useState<string[]>([]);
  const [newBenefit, setNewBenefit] = useState("");

  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchRanks();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredRanks(ranks);
    } else {
      const filtered = ranks.filter((rank) =>
        rank.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRanks(filtered);
    }
  }, [searchQuery, ranks]);

  const fetchRanks = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, this would fetch from the database
      // For now, we'll use mock data
      const mockRanks: Rank[] = [
        {
          id: "1",
          name: "Bronze",
          level: 1,
          min_direct_referrals: 0,
          min_team_size: 0,
          min_investment: 0,
          commission_rate: 5,
          badge_color: "#CD7F32",
          benefits: ["Basic support", "Access to community"],
          created_at: "2023-01-15T10:30:00Z",
        },
        {
          id: "2",
          name: "Silver",
          level: 2,
          min_direct_referrals: 5,
          min_team_size: 10,
          min_investment: 500,
          commission_rate: 7,
          badge_color: "#C0C0C0",
          benefits: ["Priority support", "Monthly webinars", "Exclusive content"],
          created_at: "2023-01-15T10:35:00Z",
        },
        {
          id: "3",
          name: "Gold",
          level: 3,
          min_direct_referrals: 10,
          min_team_size: 30,
          min_investment: 1000,
          commission_rate: 10,
          badge_color: "#FFD700",
          benefits: [
            "VIP support",
            "Weekly strategy calls",
            "Exclusive content",
            "Quarterly bonus",
          ],
          created_at: "2023-01-15T10:40:00Z",
        },
        {
          id: "4",
          name: "Platinum",
          level: 4,
          min_direct_referrals: 20,
          min_team_size: 100,
          min_investment: 5000,
          commission_rate: 12,
          badge_color: "#E5E4E2",
          benefits: [
            "24/7 VIP support",
            "One-on-one coaching",
            "Exclusive events",
            "Monthly bonus",
            "Leadership council",
          ],
          created_at: "2023-01-15T10:45:00Z",
        },
        {
          id: "5",
          name: "Diamond",
          level: 5,
          min_direct_referrals: 50,
          min_team_size: 500,
          min_investment: 10000,
          commission_rate: 15,
          badge_color: "#B9F2FF",
          benefits: [
            "Dedicated account manager",
            "Executive coaching",
            "Global events",
            "Weekly bonus",
            "Leadership council",
            "Profit sharing",
          ],
          created_at: "2023-01-15T10:50:00Z",
        },
      ];
      
      setRanks(mockRanks);
      setFilteredRanks(mockRanks);
    } catch (err: any) {
      setError(err.message || "Failed to load ranks");
      console.error("Error fetching ranks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRank = async () => {
    try {
      if (!validateForm()) return;

      const newRank: Rank = {
        id: Date.now().toString(),
        name: rankName,
        level: parseInt(rankLevel),
        min_direct_referrals: parseInt(minDirectReferrals),
        min_team_size: parseInt(minTeamSize),
        min_investment: parseFloat(minInvestment),
        commission_rate: parseFloat(commissionRate),
        badge_color: badgeColor,
        benefits: benefits,
        created_at: new Date().toISOString(),
      };

      // In a real implementation, this would save to the database
      setRanks([...ranks, newRank]);

      toast({
        title: "Success",
        description: `Rank ${rankName} created successfully`,
      });

      // Reset form and close dialog
      resetForm();
      setIsCreateDialogOpen(false);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to create rank",
        variant: "destructive",
      });
    }
  };

  const handleEditRank = async () => {
    try {
      if (!selectedRank || !validateForm()) return;

      const updatedRank: Rank = {
        ...selectedRank,
        name: rankName,
        level: parseInt(rankLevel),
        min_direct_referrals: parseInt(minDirectReferrals),
        min_team_size: parseInt(minTeamSize),
        min_investment: parseFloat(minInvestment),
        commission_rate: parseFloat(commissionRate),
        badge_color: badgeColor,
        benefits: benefits,
      };

      // In a real implementation, this would update in the database
      const updatedRanks = ranks.map((rank) =>
        rank.id === selectedRank.id ? updatedRank : rank
      );
      setRanks(updatedRanks);

      toast({
        title: "Success",
        description: `Rank ${rankName} updated successfully`,
      });

      // Reset form and close dialog
      resetForm();
      setIsEditDialogOpen(false);
      setSelectedRank(null);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update rank",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRank = async () => {
    try {
      if (!selectedRank) return;

      // In a real implementation, this would delete from the database
      const updatedRanks = ranks.filter((rank) => rank.id !== selectedRank.id);
      setRanks(updatedRanks);

      toast({
        title: "Success",
        description: `Rank ${selectedRank.name} deleted successfully`,
      });

      // Reset and close dialog
      setIsDeleteDialogOpen(false);
      setSelectedRank(null);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete rank",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (rank: Rank) => {
    setSelectedRank(rank);
    setRankName(rank.name);
    setRankLevel(rank.level.toString());
    setMinDirectReferrals(rank.min_direct_referrals.toString());
    setMinTeamSize(rank.min_team_size.toString());
    setMinInvestment(rank.min_investment.toString());
    setCommissionRate(rank.commission_rate.toString());
    setBadgeColor(rank.badge_color);
    setBenefits([...rank.benefits]);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (rank: Rank) => {
    setSelectedRank(rank);
    setIsDeleteDialogOpen(true);
  };

  const addBenefit = () => {
    if (newBenefit.trim() !== "") {
      setBenefits([...benefits, newBenefit.trim()]);
      setNewBenefit("");
    }
  };

  const removeBenefit = (index: number) => {
    const updatedBenefits = [...benefits];
    updatedBenefits.splice(index, 1);
    setBenefits(updatedBenefits);
  };

  const validateForm = () => {
    if (
      !rankName ||
      !rankLevel ||
      !minDirectReferrals ||
      !minTeamSize ||
      !minInvestment ||
      !commissionRate
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return false;
    }

    if (isNaN(parseInt(rankLevel)) || parseInt(rankLevel) <= 0) {
      toast({
        title: "Validation Error",
        description: "Rank level must be a positive number",
        variant: "destructive",
      });
      return false;
    }

    if (
      isNaN(parseInt(minDirectReferrals)) ||
      parseInt(minDirectReferrals) < 0
    ) {
      toast({
        title: "Validation Error",
        description: "Minimum direct referrals must be a non-negative number",
        variant: "destructive",
      });
      return false;
    }

    if (isNaN(parseInt(minTeamSize)) || parseInt(minTeamSize) < 0) {
      toast({
        title: "Validation Error",
        description: "Minimum team size must be a non-negative number",
        variant: "destructive",
      });
      return false;
    }

    if (isNaN(parseFloat(minInvestment)) || parseFloat(minInvestment) < 0) {
      toast({
        title: "Validation Error",
        description: "Minimum investment must be a non-negative number",
        variant: "destructive",
      });
      return false;
    }

    if (
      isNaN(parseFloat(commissionRate)) ||
      parseFloat(commissionRate) < 0 ||
      parseFloat(commissionRate) > 100
    ) {
      toast({
        title: "Validation Error",
        description: "Commission rate must be between 0 and 100",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setRankName("");
    setRankLevel("");
    setMinDirectReferrals("");
    setMinTeamSize("");
    setMinInvestment("");
    setCommissionRate("");
    setBadgeColor("#6366F1");
    setBenefits([]);
    setNewBenefit("");
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
            <p className="mt-4 text-gray-600">Loading ranks...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Rank Management</h1>
          <p className="text-gray-500">
            Create and manage ranks for your MLM system
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
              placeholder="Search ranks..."
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
            <Plus className="mr-2 h-4 w-4" /> Create New Rank
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ranks</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredRanks.length === 0 ? (
              <div className="text-center py-8">
                <div className="rounded-full bg-purple-100 p-3 mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  No Ranks Found
                </h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  {searchQuery
                    ? "No ranks match your search criteria. Try a different search term."
                    : "You haven't created any ranks yet."}
                </p>
                {searchQuery ? (
                  <Button
                    variant="outline"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear Search
                  </Button>
                ) : (
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Create First Rank
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Level
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Requirements
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Commission
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Benefits
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredRanks.map((rank) => (
                      <tr key={rank.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className="h-8 w-8 rounded-full flex items-center justify-center mr-3"
                              style={{ backgroundColor: rank.badge_color + "33" }}
                            >
                              <Star
                                className="h-4 w-4"
                                style={{ color: rank.badge_color }}
                              />
                            </div>
                            <div className="font-medium text-gray-900">
                              {rank.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline">
                            Level {rank.level}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="flex items-center">
                              <Users className="h-3 w-3 mr-1 text-gray-400" />
                              <span>
                                {rank.min_direct_referrals} direct referrals
                              </span>
                            </div>
                            <div className="flex items-center mt-1">
                              <Users className="h-3 w-3 mr-1 text-gray-400" />
                              <span>{rank.min_team_size} team size</span>
                            </div>
                            <div className="flex items-center mt-1">
                              <DollarSign className="h-3 w-3 mr-1 text-gray-400" />
                              <span>
                                ${rank.min_investment.toLocaleString()} min
                                investment
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className="bg-green-100 text-green-800">
                            {rank.commission_rate}%
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <ul className="list-disc list-inside">
                              {rank.benefits.slice(0, 3).map((benefit, index) => (
                                <li key={index} className="text-gray-600">
                                  {benefit}
                                </li>
                              ))}
                              {rank.benefits.length > 3 && (
                                <li className="text-gray-500">
                                  +{rank.benefits.length - 3} more
                                </li>
                              )}
                            </ul>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(rank)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openDeleteDialog(rank)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
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

        {/* Create Rank Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Rank</DialogTitle>
              <DialogDescription>
                Create a new rank for your MLM system
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="rankName">Rank Name *</Label>
                <Input
                  id="rankName"
                  placeholder="e.g., Gold, Diamond, etc."
                  value={rankName}
                  onChange={(e) => setRankName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rankLevel">Rank Level *</Label>
                <Input
                  id="rankLevel"
                  type="number"
                  placeholder="e.g., 1, 2, 3, etc."
                  value={rankLevel}
                  onChange={(e) => setRankLevel(e.target.value)}
                  min="1"
                  step="1"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minDirectReferrals">
                    Min Direct Referrals *
                  </Label>
                  <Input
                    id="minDirectReferrals"
                    type="number"
                    placeholder="e.g., 5"
                    value={minDirectReferrals}
                    onChange={(e) => setMinDirectReferrals(e.target.value)}
                    min="0"
                    step="1"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minTeamSize">Min Team Size *</Label>
                  <Input
                    id="minTeamSize"
                    type="number"
                    placeholder="e.g., 20"
                    value={minTeamSize}
                    onChange={(e) => setMinTeamSize(e.target.value)}
                    min="0"
                    step="1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minInvestment">Min Investment ($) *</Label>
                  <Input
                    id="minInvestment"
                    type="number"
                    placeholder="e.g., 1000"
                    value={minInvestment}
                    onChange={(e) => setMinInvestment(e.target.value)}
                    min="0"
                    step="100"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commissionRate">Commission Rate (%) *</Label>
                  <Input
                    id="commissionRate"
                    type="number"
                    placeholder="e.g., 10"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(e.target.value)}
                    min="0"
                    max="100"
                    step="0.5"
                    required
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" onClick={handleCreateRank}>
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Rank Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Rank</DialogTitle>
              <DialogDescription>
                Edit the details of the rank
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="rankName">Rank Name *</Label>
                <Input
                  id="rankName"
                  placeholder="e.g., Gold, Diamond, etc."
                  value={rankName}
                  onChange={(e) => setRankName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rankLevel">Rank Level *</Label>
                <Input
                  id="rankLevel"
                  type="number"
                  placeholder="e.g., 1, 2, 3, etc."
                  value={rankLevel}
                  onChange={(e) => setRankLevel(e.target.value)}
                  min="1"
                  step="1"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minDirectReferrals">
                    Min Direct Referrals *
                  </Label>
                  <Input
                    id="minDirectReferrals"
                    type="number"
                    placeholder="e.g., 5"
                    value={minDirectReferrals}
                    onChange={(e) => setMinDirectReferrals(e.target.value)}
                    min="0"
                    step="1"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minTeamSize">Min Team Size *</Label>
                  <Input
                    id="minTeamSize"
                    type="number"
                    placeholder="e.g., 20"
                    value={minTeamSize}
                    onChange={(e) => setMinTeamSize(e.target.value)}
                    min="0"
                    step="1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minInvestment">Min Investment ($) *</Label>
                  <Input
                    id="minInvestment"
                    type="number"
                    placeholder="e.g., 1000"
                    value={minInvestment}
                    onChange={(e) => setMinInvestment(e.target.value)}
                    min="0"
                    step="100"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commissionRate">Commission Rate (%) *</Label>
                  <Input
                    id="commissionRate"
                    type="number"
                    placeholder="e.g., 10"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(e.target.value)}
                    min="0"
                    max="100"
                    step="0.5"
                    required
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" onClick={handleEditRank}>
                Update
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Rank Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Rank</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this rank?
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button type="submit" onClick={handleDeleteRank}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default RankManagement;
