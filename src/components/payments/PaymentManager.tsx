import React, { useState, useEffect } from 'react';
import { PaymentService, PaymentMethod } from '@/lib/services/PaymentService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface PaymentManagerProps {
  userId: string;
  onPaymentComplete?: (transaction: any) => void;
}

export function PaymentManager({ userId, onPaymentComplete }: PaymentManagerProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPaymentMethods();
  }, [userId]);

  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      const methods = await PaymentService.getPaymentMethods(userId);
      setPaymentMethods(methods);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load payment methods",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (amount: number, currency: string) => {
    setLoading(true);
    try {
      const paymentIntent = await PaymentService.createPaymentIntent(amount, currency);
      
      // Handle the payment intent
      if (paymentIntent.client_secret) {
        // Process payment with Stripe Elements
        // Implementation depends on your UI requirements
      }

      onPaymentComplete?.(paymentIntent);
      
      toast({
        title: "Success",
        description: "Payment processed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Payment processing failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCryptoPayment = async (amount: number, tokenAddress: string) => {
    setLoading(true);
    try {
      // Assuming we have the user's wallet address from WalletConnect
      const transaction = await PaymentService.processCryptoPayment(
        amount,
        tokenAddress,
        userId
      );

      onPaymentComplete?.(transaction);
      
      toast({
        title: "Success",
        description: "Crypto payment initiated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Crypto payment failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between">
                <span>{method.type}</span>
                <Button
                  onClick={() => handlePayment(100, 'USD')}
                  disabled={loading}
                >
                  Pay with {method.type}
                </Button>
              </div>
            ))}
            <Button
              onClick={() => handleCryptoPayment(100, '0x...')}
              disabled={loading}
              variant="outline"
            >
              Pay with Crypto
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

