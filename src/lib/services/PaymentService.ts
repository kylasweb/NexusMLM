import { supabase } from '@/lib/supabase';
import Stripe from 'stripe';
import type { Database } from '@/lib/types/database';

const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

type Tables = Database['public']['Tables'];

// Interface for the database payment_methods table
type DbPaymentMethod = Tables['payment_methods']['Row'];

export interface PaymentMethod {
  id: string;
  type: 'stripe' | 'crypto' | 'paypal';
  details: any;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export class PaymentService {
  static async createPaymentIntent(amount: number, currency: string = 'USD') {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return paymentIntent;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  static async processCryptoPayment(
    amount: number,
    tokenAddress: string,
    userAddress: string
  ) {
    try {
      const { data, error } = await supabase
        .from('payment_transactions')
        .insert({
          user_id: userAddress,
          amount,
          currency: 'CRYPTO',
          status: 'pending',
          payment_method: 'crypto',
          token_address: tokenAddress,
        } as Tables['payment_transactions']['Insert'])
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error processing crypto payment:', error);
      throw error;
    }
  }

  static async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      return (data as DbPaymentMethod[]).map((method) => ({
        id: method.id,
        type: method.payment_type,
        details: {
          isDefault: method.is_default,
          createdAt: method.created_at,
          updatedAt: method.updated_at,
          ...method.details
        }
      }));
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  }

  static async processCommissionPayout(
    userId: string,
    amount: number,
    paymentMethod: PaymentMethod
  ) {
    try {
      const { data, error } = await supabase
        .from('commission_payouts')
        .insert({
          user_id: userId,
          amount,
          payment_method: paymentMethod.type,
          status: 'pending',
        } as Tables['commission_payouts']['Insert'])
        .select()
        .single();

      if (error) throw error;

      switch (paymentMethod.type) {
        case 'stripe':
          return await this.processStripePayout(data);
        case 'crypto':
          return await this.processCryptoPayout(data);
        case 'paypal':
          return await this.processPayPalPayout(data);
        default:
          throw new Error('Unsupported payment method');
      }
    } catch (error) {
      console.error('Error processing commission payout:', error);
      throw error;
    }
  }

  private static async processStripePayout(payout: any) {
    // Implement Stripe payout logic
    return payout;
  }

  private static async processCryptoPayout(payout: any) {
    // Implement crypto payout logic
    return payout;
  }

  private static async processPayPalPayout(payout: any) {
    // Implement PayPal payout logic
    return payout;
  }
}


