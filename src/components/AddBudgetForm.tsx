import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import { Budget } from '../types/budget';

interface AddBudgetFormProps {
  onAdd: (budget: Budget) => void;
}

type FormData = {
  name: string;
  amount: string;
  cycle_type: Budget['cycle_type'];
  category: Budget['category'];
  platform: string;
  notes: string;
};

export function AddBudgetForm({ onAdd }: AddBudgetFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    amount: '',
    cycle_type: 'monthly',
    category: 'ads',
    platform: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const startDate = new Date();
    const endDate = new Date();
    
    switch (formData.cycle_type) {
      case 'yearly':
        endDate.setMonth(endDate.getMonth() + 12);
        break;
      case 'quarterly':
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      default:
        endDate.setMonth(endDate.getMonth() + 1);
    }

    // Format dates as ISO strings without milliseconds
    const formatDate = (date: Date) => {
      return date.toISOString().split('.')[0] + 'Z';
    };

    const budget = {
      id: Date.now().toString(),
      name: formData.name,
      amount: parseFloat(formData.amount),
      spent_amount: 0,
      cycle_type: formData.cycle_type,
      category: formData.category,
      platform: formData.platform || undefined,
      start_date: formatDate(startDate),
      end_date: formatDate(endDate),
      active: true,
      notes: formData.notes || undefined
    };

    console.log('Submitting budget:', budget);
    onAdd(budget as unknown as Budget);
    
    setFormData({
      name: '',
      amount: '',
      cycle_type: 'monthly',
      category: 'ads',
      platform: '',
      notes: '',
    });
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 !p-4 rounded-full shadow-lg"
      >
        <Plus size={24} />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New Budget</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          
          <Input
            label="Amount"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
            min="0"
            step="0.01"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cycle Type
            </label>
            <select
              value={formData.cycle_type}
              onChange={(e) => setFormData({ ...formData, cycle_type: e.target.value as Budget['cycle_type'] })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as Budget['category'] })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="ads">Ads</option>
              <option value="promos">Promos</option>
              <option value="influencers">Influencers</option>
              <option value="content">Content</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <Input
            label="Platform (Optional)"
            type="text"
            value={formData.platform}
            onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
            placeholder="e.g., Facebook, Instagram"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              rows={3}
            />
          </div>
          
          <div className="flex space-x-3 pt-2">
            <Button type="submit" fullWidth>
              Add Budget
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsOpen(false)}
              fullWidth
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
