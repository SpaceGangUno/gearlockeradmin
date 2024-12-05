import { Budget } from '../types/budget';

const API_BASE_URL = 'http://localhost:3001/api';

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'API request failed');
  }
  return response.json();
}

export async function fetchBudgets(): Promise<Budget[]> {
  const response = await fetch(`${API_BASE_URL}/budgets`);
  return handleResponse(response);
}

export async function fetchBudgetStats() {
  const response = await fetch(`${API_BASE_URL}/budgets/stats`);
  return handleResponse(response);
}

export async function createBudget(budget: Partial<Budget>) {
  const response = await fetch(`${API_BASE_URL}/budgets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(budget),
  });
  return handleResponse(response);
}

export async function updateSpentAmount(id: string, spentAmount: number) {
  const response = await fetch(`${API_BASE_URL}/budgets/${id}/spent`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ spent_amount: spentAmount }),
  });
  return handleResponse(response);
}

export async function toggleBudgetActive(id: string) {
  const response = await fetch(`${API_BASE_URL}/budgets/${id}/toggle`, {
    method: 'PATCH',
  });
  return handleResponse(response);
}