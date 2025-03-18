export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      activities: {
        Row: {
          created_at: string;
          description: string;
          id: string;
          related_id: string | null;
          type: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          description: string;
          id?: string;
          related_id?: string | null;
          type: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          id?: string;
          related_id?: string | null;
          type?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "activities_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      commissions: {
        Row: {
          amount: number;
          created_at: string;
          id: string;
          source_id: string | null;
          status: string;
          type: string;
          user_id: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          id?: string;
          source_id?: string | null;
          status?: string;
          type: string;
          user_id: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          id?: string;
          source_id?: string | null;
          status?: string;
          type?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "commissions_source_id_fkey";
            columns: ["source_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "commissions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      investment_plans: {
        Row: {
          created_at: string;
          description: string | null;
          duration_days: number;
          id: string;
          max_amount: number | null;
          min_amount: number;
          name: string;
          roi_percentage: number;
          status: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          duration_days: number;
          id?: string;
          max_amount?: number | null;
          min_amount: number;
          name: string;
          roi_percentage: number;
          status?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          duration_days?: number;
          id?: string;
          max_amount?: number | null;
          min_amount?: number;
          name?: string;
          roi_percentage?: number;
          status?: string;
        };
        Relationships: [];
      };
      investments: {
        Row: {
          amount: number;
          created_at: string;
          end_date: string;
          id: string;
          investment_plan_id: string;
          status: string;
          user_id: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          end_date: string;
          id?: string;
          investment_plan_id: string;
          status?: string;
          user_id: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          end_date?: string;
          id?: string;
          investment_plan_id?: string;
          status?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "investments_investment_plan_id_fkey";
            columns: ["investment_plan_id"];
            isOneToOne: false;
            referencedRelation: "investment_plans";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "investments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      matrix_positions: {
        Row: {
          created_at: string;
          id: string;
          leg: string;
          level: number;
          parent_id: string | null;
          position: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          leg: string;
          level: number;
          parent_id?: string | null;
          position: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          leg?: string;
          level?: number;
          parent_id?: string | null;
          position?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "matrix_positions_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "matrix_positions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "matrix_positions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      ranks: {
        Row: {
          commission_rate: number;
          created_at: string;
          direct_referrals_required: number;
          id: string;
          investment_required: number;
          name: string;
          team_size_required: number;
        };
        Insert: {
          commission_rate: number;
          created_at?: string;
          direct_referrals_required: number;
          id?: string;
          investment_required: number;
          name: string;
          team_size_required: number;
        };
        Update: {
          commission_rate?: number;
          created_at?: string;
          direct_referrals_required?: number;
          id?: string;
          investment_required?: number;
          name?: string;
          team_size_required?: number;
        };
        Relationships: [];
      };
      referrals: {
        Row: {
          created_at: string;
          id: string;
          referred_id: string;
          referrer_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          referred_id: string;
          referrer_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          referred_id?: string;
          referrer_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "referrals_referred_id_fkey";
            columns: ["referred_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey";
            columns: ["referrer_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      system_settings: {
        Row: {
          created_at: string;
          id: string;
          key: string;
          value: Json;
        };
        Insert: {
          created_at?: string;
          id?: string;
          key: string;
          value: Json;
        };
        Update: {
          created_at?: string;
          id?: string;
          key?: string;
          value?: Json;
        };
        Relationships: [];
      };
      users: {
        Row: {
          address: string | null;
          avatar_url: string | null;
          created_at: string;
          email: string;
          full_name: string;
          id: string;
          kyc_verified: boolean;
          phone: string | null;
          rank: string;
          status: string;
        };
        Insert: {
          address?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          email: string;
          full_name: string;
          id: string;
          kyc_verified?: boolean;
          phone?: string | null;
          rank?: string;
          status?: string;
        };
        Update: {
          address?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          email?: string;
          full_name?: string;
          id?: string;
          kyc_verified?: boolean;
          phone?: string | null;
          rank?: string;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "users_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      withdrawals: {
        Row: {
          amount: number;
          created_at: string;
          id: string;
          method: string;
          status: string;
          user_id: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          id?: string;
          method: string;
          status?: string;
          user_id: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          id?: string;
          method?: string;
          status?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "withdrawals_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
