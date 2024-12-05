export interface Budget {
  id: string;
  name: string;
  amount: number;
  spentAmount: number;
  cycleType: 'monthly' | 'quarterly' | 'yearly';
  category: 'ads' | 'promos' | 'influencers' | 'content' | 'other';
  platform?: string;
  startDate: Date;
  endDate: Date;
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