import { supabase } from "./supabase";

// Error handling wrapper
const handleApiRequest = async <T>(requestFn: () => Promise<T>): Promise<T> => {
  try {
    return await requestFn();
  } catch (error: any) {
    console.error("API Error:", error);
    throw new Error(error.message || "An unexpected error occurred");
  }
};

// User Profile
export const getUserProfile = async (userId: string) => {
  return handleApiRequest(async () => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  });
};

export const updateUserProfile = async (userId: string, updates: any) => {
  return handleApiRequest(async () => {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", userId);

    if (error) throw error;
    return data;
  });
};

// Network and Team
export const getDirectReferrals = async (userId: string) => {
  // This is a mock implementation
  // In a real app, you would fetch this from the database
  return handleApiRequest(async () => {
    const mockReferrals = [
      {
        id: "1",
        name: "John Doe",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
        rank: "Gold",
        active: true,
        joinDate: "2023-05-15",
        referrals: 3,
      },
      {
        id: "2",
        name: "Jane Smith",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
        rank: "Silver",
        active: true,
        joinDate: "2023-06-22",
        referrals: 1,
      },
      {
        id: "3",
        name: "Robert Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=robert",
        rank: "Bronze",
        active: false,
        joinDate: "2023-07-10",
        referrals: 0,
      },
    ];

    return mockReferrals;
  });
};

export const getBinaryMatrixStats = async (userId: string) => {
  // This is a mock implementation
  // In a real app, you would fetch this from the database
  return handleApiRequest(async () => {
    return {
      leftLeg: {
        totalMembers: 24,
        activeMembers: 18,
        volume: 12500,
        growth: 15,
      },
      rightLeg: {
        totalMembers: 19,
        activeMembers: 14,
        volume: 9800,
        growth: 12,
      },
    };
  });
};

// Dashboard Stats
export const getUserStats = async (userId: string) => {
  return handleApiRequest(async () => {
    // In a real app, this would be fetched from the database
    return {
      earnings: "$1,245.50",
      teamSize: "43",
      investments: "$5,000",
      rank: "Gold",
    };
  });
};

// Investments
export interface InvestmentPlan {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  roi: number;
  duration: number;
  status: "active" | "inactive";
}

export const getInvestmentPlans = async () => {
  try {
    const { data, error } = await supabase
      .from('investment_plans')
      .select('*')
      .order('min_amount', { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
};

export const getUserInvestments = async (userId: string) => {
  return handleApiRequest(async () => {
    const { data, error } = await supabase
      .from("investments")
      .select("*, investment_plan:investment_plan_id(*)")
      .eq("user_id", userId);

    if (error) throw error;
    return data;
  });
};

export const createInvestment = async (investment: any) => {
  return handleApiRequest(async () => {
    const { data, error } = await supabase
      .from("investments")
      .insert([investment])
      .select();

    if (error) throw error;
    return data[0];
  });
};

// Commissions
export const getUserCommissions = async (userId: string) => {
  return handleApiRequest(async () => {
    const { data, error } = await supabase
      .from("commissions")
      .select("*, source:source_id(full_name, avatar_url)")
      .eq("user_id", userId);

    if (error) throw error;
    return data;
  });
};

export const createWithdrawal = async (withdrawal: any) => {
  return handleApiRequest(async () => {
    const { data, error } = await supabase
      .from("withdrawals")
      .insert([withdrawal])
      .select();

    if (error) throw error;
    return data[0];
  });
};

// Activities
export const createActivity = async (activity: any) => {
  return handleApiRequest(async () => {
    const { data, error } = await supabase
      .from("activities")
      .insert([activity])
      .select();

    if (error) throw error;
    return data[0];
  });
};

export const getUserActivities = async (userId: string) => {
  return handleApiRequest(async () => {
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  });
};

// Admin Functions
export const getAdminStats = async () => {
  return handleApiRequest(async () => {
    const [
      { data: users, error: usersError },
      { data: investments, error: investmentsError },
      { data: withdrawals, error: withdrawalsError }
    ] = await Promise.all([
      supabase.from("users").select("*"),
      supabase.from("investments").select("*"),
      supabase.from("withdrawals").select("*").eq("status", "pending")
    ]);

    if (usersError) throw usersError;
    if (investmentsError) throw investmentsError;
    if (withdrawalsError) throw withdrawalsError;

    const totalInvestments = investments.reduce((sum, inv) => sum + (inv.amount || 0), 0);

    return {
      totalUsers: users.length,
      activeUsers: users.filter(user => user.status === "active").length,
      totalInvestments,
      pendingWithdrawals: withdrawals.length,
      totalEarnings: 0, // This would need to be calculated based on your business logic
      pendingKYC: users.filter(user => user.kyc_status === "pending").length
    };
  });
};

export const getAllUsers = async () => {
  return handleApiRequest(async () => {
    const { data, error } = await supabase.from("users").select("*");

    if (error) throw error;
    return data;
  });
};

export const getAllWithdrawals = async () => {
  try {
    const { data, error } = await supabase
      .from('withdrawals')
      .select(`
        *,
        user:user_id (
          full_name,
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
};

export const updateWithdrawalStatus = async (
  withdrawalId: string,
  status: string,
) => {
  return handleApiRequest(async () => {
    const { data, error } = await supabase
      .from("withdrawals")
      .update({ status })
      .eq("id", withdrawalId);

    if (error) throw error;
    return data;
  });
};

export const createInvestmentPlan = async (plan: Omit<InvestmentPlan, "id">): Promise<InvestmentPlan> => {
  try {
    const { data, error } = await supabase
      .from("investment_plans")
      .insert([plan])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating investment plan:", error);
    throw error;
  }
};

export const updateInvestmentPlan = async (id: string, plan: Partial<InvestmentPlan>): Promise<InvestmentPlan> => {
  try {
    const { data, error } = await supabase
      .from("investment_plans")
      .update(plan)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating investment plan:", error);
    throw error;
  }
};

export const createRank = async (rank: any) => {
  return handleApiRequest(async () => {
    const { data, error } = await supabase
      .from("ranks")
      .insert([rank])
      .select();

    if (error) throw error;
    return data[0];
  });
};

export const updateRank = async (rankId: string, updates: any) => {
  return handleApiRequest(async () => {
    const { data, error } = await supabase
      .from("ranks")
      .update(updates)
      .eq("id", rankId);

    if (error) throw error;
    return data;
  });
};

export const updateMatrixSettings = async (settings: any) => {
  return handleApiRequest(async () => {
    const { data, error } = await supabase
      .from("system_settings")
      .update(settings)
      .eq("key", "matrix_settings");

    if (error) throw error;
    return data;
  });
};

export const getSystemSettings = async () => {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .eq('key', 'general')
      .single();

    if (error) throw error;
    return data?.value || null;
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
};

export const updateSystemSettings = async (key: string, value: any) => {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .upsert({ key, value })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Investment Plan Management
export const deleteInvestmentPlan = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("investment_plans")
      .delete()
      .eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting investment plan:", error);
    throw error;
  }
};

// Page Templates API
export interface PageTemplate {
  id: string;
  name: string;
  thumbnail: string;
  content: any;
  created_at: string;
  updated_at: string;
}

export async function getPageTemplates(): Promise<PageTemplate[]> {
  try {
    const { data, error } = await supabase
      .from('page_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching page templates:', error);
    throw error;
  }
}

export async function createPageTemplate(template: Partial<PageTemplate>): Promise<PageTemplate> {
  try {
    const { data, error } = await supabase
      .from('page_templates')
      .insert({
        name: template.name || 'New Page',
        thumbnail: template.thumbnail,
        content: template.content || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating page template:', error);
    throw error;
  }
}

export async function updatePageTemplate(id: string, template: Partial<PageTemplate>): Promise<PageTemplate> {
  try {
    const { data, error } = await supabase
      .from('page_templates')
      .update({
        name: template.name,
        thumbnail: template.thumbnail,
        content: template.content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating page template:', error);
    throw error;
  }
}

export async function deletePageTemplate(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('page_templates')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting page template:', error);
    throw error;
  }
}
