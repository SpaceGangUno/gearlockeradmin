export interface Budget {
  id: string;
  name: string;
  amount: number;
  spent_amount: number;
  cycle_type: 'monthly' | 'quarterly' | 'yearly';
  category: 'ads' | 'promos' | 'influencers' | 'content' | 'other';
  platform?: string;
  start_date: string;
  end_date: string;
  active: boolean;
  notes?: string;
}

export interface BudgetStats {
  category: string;
  totalBudget: number;
  totalSpent: number;
  activeCount: number;
  totalCount: number;
}
