import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
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
import {
  DollarSign,
  TrendingUp,
  Clock,
  Check,
  AlertCircle,
} from "lucide-react";
import {
  getInvestmentPlans,
  createInvestment,
  createActivity,
} from "@/lib/api";
import { useAuth } from "@/lib/auth";

interface InvestmentPlan {
  id: string;
  name: string;
  description: string;
  min_amount: number;
  max_amount: number;
  roi_percentage: number;
  duration_days: number;
  status: string;
}

const InvestmentPlans = () => {
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getInvestmentPlans();
        setPlans(data);
      } catch (err: any) {
        setError(err.message || "Failed to load investment plans");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handlePlanSelect = (plan: InvestmentPlan) => {
    setSelectedPlan(plan);
    setInvestmentAmount(plan.min_amount);
    setDialogOpen(true);
  };

  const handleInvestmentSubmit = async () => {
    if (!selectedPlan || !user) return;

    try {
      setError(null);
      setSuccess(null);

      // Create the investment
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + selectedPlan.duration_days);

      await createInvestment({
        user_id: user.id,
        plan_id: selectedPlan.id,
        amount: investmentAmount,
        status: "active",
        start_date: new Date().toISOString(),
        end_date: endDate.toISOString(),
      });

      // Create activity record
      await createActivity({
        user_id: user.id,
        type: "investment",
        title: "New Investment",
        description: `${selectedPlan.name} plan activated`,
        amount: investmentAmount,
        status: "completed",
      });

      setSuccess(
        `Successfully invested $${investmentAmount} in ${selectedPlan.name} plan`,
      );
      setDialogOpen(false);
    } catch (err: any) {
      setError(err.message || "Failed to process investment");
    }
  };

  const calculateReturns = () => {
    if (!selectedPlan) return 0;
    return (investmentAmount * selectedPlan.roi_percentage) / 100;
  };

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
          <p className="mt-4 text-gray-600">Loading investment plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Investment Plans</h1>
        <p className="text-gray-500">
          Choose an investment plan that suits your goals
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription className="text-blue-100">
                {plan.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" /> Investment
                  </span>
                  <span className="font-semibold">
                    ${plan.min_amount} -{" "}
                    {plan.max_amount ? `$${plan.max_amount}` : "Unlimited"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" /> ROI
                  </span>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    {plan.roi_percentage}%
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center">
                    <Clock className="h-4 w-4 mr-1" /> Duration
                  </span>
                  <span className="font-semibold">
                    {plan.duration_days} days
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 p-6">
              <Button className="w-full" onClick={() => handlePlanSelect(plan)}>
                Invest Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invest in {selectedPlan?.name}</DialogTitle>
            <DialogDescription>
              Choose your investment amount and review the details before
              confirming.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Investment Amount ($)</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="amount"
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                  min={selectedPlan?.min_amount}
                  max={selectedPlan?.max_amount || 1000000}
                  className="flex-1"
                />
                <span className="text-gray-500">USD</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Adjust Amount</Label>
              <Slider
                value={[investmentAmount]}
                min={selectedPlan?.min_amount || 0}
                max={selectedPlan?.max_amount || 10000}
                step={100}
                onValueChange={(value) => setInvestmentAmount(value[0])}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>${selectedPlan?.min_amount}</span>
                <span>${selectedPlan?.max_amount || "Unlimited"}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">ROI Percentage:</span>
                <span className="font-semibold">
                  {selectedPlan?.roi_percentage}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-semibold">
                  {selectedPlan?.duration_days} days
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Expected Return:</span>
                <span className="font-semibold text-green-600">
                  ${calculateReturns().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Value at Maturity:</span>
                <span className="font-semibold text-green-600">
                  ${(investmentAmount + calculateReturns()).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInvestmentSubmit}>Confirm Investment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvestmentPlans;
