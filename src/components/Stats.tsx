import React from 'react';
import { DollarSign, TrendingUp, Activity } from 'lucide-react';
import { Budget } from '../types/budget';
import { Card } from './ui/Card';
import { formatCurrency } from '../utils/formatters';

interface StatsProps {
  budgets: Budget[];
}

export function Stats({ budgets }: StatsProps) {
  const totalBudget = budgets.reduce((acc, budget) => acc + budget.amount, 0);
  const totalSpent = budgets.reduce((acc, budget) => acc + budget.spentAmount, 0);
  const activeCount = budgets.filter(budget => budget.active).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Budget</p>
            <p className="text-2xl font-bold">{formatCurrency(totalBudget)}</p>
          </div>
          <DollarSign size={24} className="text-indigo-600" />
        </div>
      </Card>
      
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Spent</p>
            <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
          </div>
          <TrendingUp size={24} className="text-indigo-600" />
        </div>
      </Card>
      
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Active Budgets</p>
            <p className="text-2xl font-bold">{activeCount} / {budgets.length}</p>
          </div>
          <Activity size={24} className="text-indigo-600" />
        </div>
      </Card>
    </div>
  );
}