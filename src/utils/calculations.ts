import { Subscription } from '../types/subscription';

export const calculateTotalSpending = (
  subscriptions: Subscription[],
  cycle: 'monthly' | 'yearly'
): number => {
  return subscriptions
    .filter(sub => sub.active && sub.billingCycle === cycle)
    .reduce((acc, sub) => acc + sub.price, 0);
};

export const calculateSubscriptionCounts = (subscriptions: Subscription[]) => {
  return {
    activeCount: subscriptions.filter(sub => sub.active).length,
    totalCount: subscriptions.length,
  };
};