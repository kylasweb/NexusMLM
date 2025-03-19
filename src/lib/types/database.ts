export type Database = {
  public: {
    Tables: {
      payment_transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          currency: string
          status: 'pending' | 'completed' | 'failed'
          payment_method: string
          token_address?: string
          transaction_hash?: string
          metadata?: Record<string, any>
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['payment_transactions']['Row'], 'id' | 'created_at' | 'updated_at'>
      }
      payment_methods: {
        Row: {
          id: string
          user_id: string
          payment_type: 'stripe' | 'crypto' | 'paypal'
          details: Record<string, any>
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['payment_methods']['Row'], 'id' | 'created_at' | 'updated_at'>
      }
      commission_payouts: {
        Row: {
          id: string
          user_id: string
          amount: number
          payment_method: string
          status: 'pending' | 'completed' | 'failed'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['commission_payouts']['Row'], 'id' | 'created_at' | 'updated_at'>
      }
    }
  }
}
