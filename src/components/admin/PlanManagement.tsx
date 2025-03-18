import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";
import {
  getInvestmentPlans,
  createInvestmentPlan,
  updateInvestmentPlan,
  deleteInvestmentPlan,
  type InvestmentPlan,
} from "@/lib/api";

const PlanManagement = () => {
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Form state
  const [planForm, setPlanForm] = useState({
    name: "",
    minAmount: "",
    maxAmount: "",
    roi: "",
    duration: "",
    status: "active" as const,
  });

  // Load plans on component mount
  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setIsLoading(true);
      const data = await getInvestmentPlans();
      setPlans(data);
    } catch (error) {
      console.error("Error loading plans:", error);
      toast({
        title: "Error",
        description: "Failed to load investment plans",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePlan = async () => {
    try {
      setIsLoading(true);
      const newPlan = await createInvestmentPlan({
        name: planForm.name,
        minAmount: parseFloat(planForm.minAmount),
        maxAmount: parseFloat(planForm.maxAmount),
        roi: parseFloat(planForm.roi),
        duration: parseInt(planForm.duration),
        status: planForm.status,
      });

      setPlans([...plans, newPlan]);

      toast({
        title: "Success",
        description: "Investment plan created successfully",
      });

      resetForm();
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating plan:", error);
      toast({
        title: "Error",
        description: "Failed to create investment plan",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPlan = async () => {
    try {
      if (!selectedPlan) return;

      setIsLoading(true);
      const updatedPlan = await updateInvestmentPlan(selectedPlan.id, {
        name: planForm.name,
        minAmount: parseFloat(planForm.minAmount),
        maxAmount: parseFloat(planForm.maxAmount),
        roi: parseFloat(planForm.roi),
        duration: parseInt(planForm.duration),
        status: planForm.status,
      });

      const updatedPlans = plans.map((plan) =>
        plan.id === selectedPlan.id ? updatedPlan : plan
      );
      setPlans(updatedPlans);

      toast({
        title: "Success",
        description: "Investment plan updated successfully",
      });

      resetForm();
      setIsEditDialogOpen(false);
      setSelectedPlan(null);
    } catch (error) {
      console.error("Error updating plan:", error);
      toast({
        title: "Error",
        description: "Failed to update investment plan",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      setIsLoading(true);
      await deleteInvestmentPlan(planId);
      const updatedPlans = plans.filter((plan) => plan.id !== planId);
      setPlans(updatedPlans);

      toast({
        title: "Success",
        description: "Investment plan deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast({
        title: "Error",
        description: "Failed to delete investment plan",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setPlanForm({
      name: "",
      minAmount: "",
      maxAmount: "",
      roi: "",
      duration: "",
      status: "active",
    });
  };

  const openEditDialog = (plan: InvestmentPlan) => {
    setSelectedPlan(plan);
    setPlanForm({
      name: plan.name,
      minAmount: plan.minAmount.toString(),
      maxAmount: plan.maxAmount.toString(),
      roi: plan.roi.toString(),
      duration: plan.duration.toString(),
      status: plan.status,
    });
    setIsEditDialogOpen(true);
  };

  const filteredPlans = plans.filter((plan) =>
    plan.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Investment Plans</h1>
          <p className="text-gray-500">Manage your MLM investment plans</p>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search plans..."
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
            <Plus className="mr-2 h-4 w-4" /> Create New Plan
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <Badge
                    variant={plan.status === "active" ? "default" : "secondary"}
                  >
                    {plan.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Min Amount:</span>
                    <span className="font-medium">${plan.minAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Max Amount:</span>
                    <span className="font-medium">${plan.maxAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">ROI:</span>
                    <span className="font-medium">{plan.roi}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Duration:</span>
                    <span className="font-medium">{plan.duration} days</span>
                  </div>
                </div>
              </CardContent>
              <div className="px-6 pb-4 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(plan)}
                >
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeletePlan(plan.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Create Plan Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Plan</DialogTitle>
              <DialogDescription>
                Create a new investment plan for your MLM system
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="planName">Plan Name *</Label>
                <Input
                  id="planName"
                  placeholder="e.g., Starter Plan, Growth Plan"
                  value={planForm.name}
                  onChange={(e) =>
                    setPlanForm({ ...planForm, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minAmount">Minimum Amount ($) *</Label>
                <Input
                  id="minAmount"
                  type="number"
                  placeholder="e.g., 100"
                  value={planForm.minAmount}
                  onChange={(e) =>
                    setPlanForm({ ...planForm, minAmount: e.target.value })
                  }
                  min="0"
                  step="1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxAmount">Maximum Amount ($) *</Label>
                <Input
                  id="maxAmount"
                  type="number"
                  placeholder="e.g., 1000"
                  value={planForm.maxAmount}
                  onChange={(e) =>
                    setPlanForm({ ...planForm, maxAmount: e.target.value })
                  }
                  min="0"
                  step="1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="roi">ROI (%) *</Label>
                <Input
                  id="roi"
                  type="number"
                  placeholder="e.g., 5"
                  value={planForm.roi}
                  onChange={(e) =>
                    setPlanForm({ ...planForm, roi: e.target.value })
                  }
                  min="0"
                  step="0.1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (days) *</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="e.g., 30"
                  value={planForm.duration}
                  onChange={(e) =>
                    setPlanForm({ ...planForm, duration: e.target.value })
                  }
                  min="1"
                  step="1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <select
                  id="status"
                  value={planForm.status}
                  onChange={(e) =>
                    setPlanForm({
                      ...planForm,
                      status: e.target.value as "active" | "inactive",
                    })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreatePlan} disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Plan"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Plan Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Plan</DialogTitle>
              <DialogDescription>
                Edit the details of the investment plan
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editPlanName">Plan Name *</Label>
                <Input
                  id="editPlanName"
                  placeholder="e.g., Starter Plan, Growth Plan"
                  value={planForm.name}
                  onChange={(e) =>
                    setPlanForm({ ...planForm, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editMinAmount">Minimum Amount ($) *</Label>
                <Input
                  id="editMinAmount"
                  type="number"
                  placeholder="e.g., 100"
                  value={planForm.minAmount}
                  onChange={(e) =>
                    setPlanForm({ ...planForm, minAmount: e.target.value })
                  }
                  min="0"
                  step="1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editMaxAmount">Maximum Amount ($) *</Label>
                <Input
                  id="editMaxAmount"
                  type="number"
                  placeholder="e.g., 1000"
                  value={planForm.maxAmount}
                  onChange={(e) =>
                    setPlanForm({ ...planForm, maxAmount: e.target.value })
                  }
                  min="0"
                  step="1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editRoi">ROI (%) *</Label>
                <Input
                  id="editRoi"
                  type="number"
                  placeholder="e.g., 5"
                  value={planForm.roi}
                  onChange={(e) =>
                    setPlanForm({ ...planForm, roi: e.target.value })
                  }
                  min="0"
                  step="0.1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editDuration">Duration (days) *</Label>
                <Input
                  id="editDuration"
                  type="number"
                  placeholder="e.g., 30"
                  value={planForm.duration}
                  onChange={(e) =>
                    setPlanForm({ ...planForm, duration: e.target.value })
                  }
                  min="1"
                  step="1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editStatus">Status *</Label>
                <select
                  id="editStatus"
                  value={planForm.status}
                  onChange={(e) =>
                    setPlanForm({
                      ...planForm,
                      status: e.target.value as "active" | "inactive",
                    })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleEditPlan} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default PlanManagement; 