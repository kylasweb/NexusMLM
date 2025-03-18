import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import {
  CreditCard,
  Wallet,
  DollarSign,
  Bitcoin,
  AlertCircle,
} from "lucide-react";

interface PaymentGatewaysProps {
  onPaymentComplete?: (data: any) => void;
  amount?: number;
  purpose?: "deposit" | "investment" | "withdrawal";
}

const PaymentGateways = ({
  onPaymentComplete,
  amount = 100,
  purpose = "deposit",
}: PaymentGatewaysProps) => {
  const [selectedGateway, setSelectedGateway] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Form states
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cryptoAmount, setCryptoAmount] = useState(amount.toString());
  const [selectedCrypto, setSelectedCrypto] = useState("BTC");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");

  const handlePayment = () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);

      // Mock successful payment
      const paymentData = {
        gateway: selectedGateway,
        amount: amount,
        currency: selectedGateway === "crypto" ? selectedCrypto : "USD",
        timestamp: new Date().toISOString(),
        transactionId: `TX-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        status: "completed",
      };

      onPaymentComplete?.(paymentData);

      toast({
        title: "Payment Successful",
        description: `Your ${purpose} of $${amount} has been processed successfully.`,
      });
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return value;
  };

  return (
    <Card className="w-full max-w-md bg-white shadow-md">
      <CardHeader>
        <CardTitle>
          {purpose === "deposit" && "Deposit Funds"}
          {purpose === "investment" && "Make Investment"}
          {purpose === "withdrawal" && "Withdraw Funds"}
        </CardTitle>
        <CardDescription>
          {purpose === "deposit" &&
            "Add funds to your account using your preferred payment method"}
          {purpose === "investment" &&
            "Invest in your selected plan using your preferred payment method"}
          {purpose === "withdrawal" &&
            "Withdraw your earnings to your preferred payment method"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">
            Amount: ${amount.toFixed(2)}
          </p>
        </div>

        <Tabs defaultValue="card" onValueChange={setSelectedGateway}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="card" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Card
            </TabsTrigger>
            <TabsTrigger value="crypto" className="flex items-center gap-2">
              <Bitcoin className="h-4 w-4" />
              Crypto
            </TabsTrigger>
            <TabsTrigger value="bank" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Bank
            </TabsTrigger>
          </TabsList>

          <TabsContent value="card" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="4242 4242 4242 4242"
                value={cardNumber}
                onChange={(e) =>
                  setCardNumber(formatCardNumber(e.target.value))
                }
                maxLength={19}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cardExpiry">Expiry Date</Label>
                <Input
                  id="cardExpiry"
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                  maxLength={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardCvc">CVC</Label>
                <Input
                  id="cardCvc"
                  placeholder="123"
                  value={cardCvc}
                  onChange={(e) =>
                    setCardCvc(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  maxLength={3}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="crypto" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cryptoAmount">Amount</Label>
              <div className="flex gap-2">
                <Input
                  id="cryptoAmount"
                  value={cryptoAmount}
                  onChange={(e) =>
                    setCryptoAmount(e.target.value.replace(/[^0-9.]/g, ""))
                  }
                  className="flex-1"
                />
                <Select
                  value={selectedCrypto}
                  onValueChange={setSelectedCrypto}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="BTC" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BTC">BTC</SelectItem>
                    <SelectItem value="ETH">ETH</SelectItem>
                    <SelectItem value="USDT">USDT</SelectItem>
                    <SelectItem value="USDC">USDC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="p-3 bg-blue-50 rounded-md flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium">Payment Instructions:</p>
                <p>
                  Send exactly{" "}
                  {selectedCrypto === "BTC"
                    ? "0.0023"
                    : selectedCrypto === "ETH"
                      ? "0.031"
                      : "100"}{" "}
                  {selectedCrypto} to the address below:
                </p>
                <p className="font-mono text-xs mt-1 break-all">
                  {selectedCrypto === "BTC"
                    ? "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
                    : selectedCrypto === "ETH"
                      ? "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
                      : "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bank" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                placeholder="Enter your bank name"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                placeholder="Enter your account number"
                value={accountNumber}
                onChange={(e) =>
                  setAccountNumber(e.target.value.replace(/[^0-9]/g, ""))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="routingNumber">Routing Number</Label>
              <Input
                id="routingNumber"
                placeholder="Enter your routing number"
                value={routingNumber}
                onChange={(e) =>
                  setRoutingNumber(e.target.value.replace(/[^0-9]/g, ""))
                }
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing
            ? "Processing..."
            : purpose === "withdrawal"
              ? "Withdraw Funds"
              : "Complete Payment"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentGateways;
