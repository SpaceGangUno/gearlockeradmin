import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Stats } from './components/Stats';
import { BudgetCard } from './components/BudgetCard';
import { AddBudgetForm } from './components/AddBudgetForm';
import { Budget } from './types/budget';
import * as api from './services/api';

function App() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    try {
      const data = await api.fetchBudgets();
      setBudgets(data.map((budget: any) => ({
        ...budget,
        startDate: new Date(budget.start_date),
        endDate: new Date(budget.end_date),
        spentAmount: budget.spent_amount,
        cycleType: budget.cycle_type,
      })));
      setError(null);
    } catch (err) {
      setError('Failed to load budgets');
      console.error(err);
    }
  };

  const handleAddBudget = async (budget: Budget) => {
    try {
      const formatted = {
        ...budget,
        start_date: budget.startDate.toISOString(),
        end_date: budget.endDate.toISOString(),
        spent_amount: budget.spentAmount,
        cycle_type: budget.cycleType,
      };
      await api.createBudget(formatted);
      await loadBudgets();
      setError(null);
    } catch (err) {
      setError('Failed to add budget');
      console.error(err);
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await api.toggleBudgetActive(id);
      await loadBudgets();
      setError(null);
    } catch (err) {
      setError('Failed to toggle budget status');
      console.error(err);
    }
  };

  const handleUpdateSpent = async (id: string, amount: number) => {
    try {
      await api.updateSpentAmount(id, amount);
      await loadBudgets();
      setError(null);
    } catch (err) {
      setError('Failed to update spent amount');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <Stats budgets={budgets} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {budgets.map(budget => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              onToggleActive={handleToggleActive}
              onUpdateSpent={handleUpdateSpent}
            />
          ))}
        </div>
        <AddBudgetForm onAdd={handleAddBudget} />
      </main>
    </div>
  );
}

export default App;