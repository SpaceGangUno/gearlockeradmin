import React from 'react';
import { DollarSign, Calendar, Globe } from 'lucide-react';
import { Budget } from '../types/budget';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { formatCurrency, formatDate } from '../utils/formatters';

interface BudgetCardProps {
  budget: Budget;
  onToggleActive: (id: string) => void;
  onUpdateSpent: (id: string, amount: number) => void;
}

export function BudgetCard({ budget, onToggleActive, onUpdateSpent }: BudgetCardProps) {
  const progress = (budget.spentAmount / budget.amount) * 100;
  const isOverBudget = progress > 100;

  return (
    <Card className={`${budget.active ? 'border-l-4 border-green-500' : 'border-l-4 border-gray-300'}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{budget.name}</h3>
          <span className="text-sm text-gray-500">{budget.category}</span>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${
          budget.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {budget.active ? 'Active' : 'Inactive'}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between text-gray-600">
          <div className="flex items-center">
            <DollarSign size={18} className="mr-2" />
            <span>{formatCurrency(budget.amount)}</span>
          </div>
          <span className="text-sm">{budget.cycleType}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <Calendar size={18} className="mr-2" />
          <span>{formatDate(budget.startDate)} - {formatDate(budget.endDate)}</span>
        </div>
        
        {budget.platform && (
          <div className="flex items-center text-gray-600">
            <Globe size={18} className="mr-2" />
            <span>{budget.platform}</span>
          </div>
        )}
        
        <div className="mt-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Budget Used</span>
            <span className={`text-sm font-medium ${isOverBudget ? 'text-red-600' : 'text-gray-600'}`}>
              {formatCurrency(budget.spentAmount)} / {formatCurrency(budget.amount)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                isOverBudget ? 'bg-red-600' : 'bg-green-600'
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        <input
          type="number"
          value={budget.spentAmount}
          onChange={(e) => onUpdateSpent(budget.id, parseFloat(e.target.value))}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          min="0"
          step="0.01"
        />
        
        <Button
          onClick={() => onToggleActive(budget.id)}
          variant={budget.active ? 'secondary' : 'primary'}
          fullWidth
        >
          {budget.active ? 'Pause Budget' : 'Activate Budget'}
        </Button>
      </div>
    </Card>
  );
}