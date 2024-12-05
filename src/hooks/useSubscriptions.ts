import { useState, useEffect } from 'react';
import { Subscription } from '../types/subscription';
import * as api from '../services/api';

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSubscriptions = async () => {
    try {
      const data = await api.fetchSubscriptions();
      setSubscriptions(data.map((sub: any) => ({
        ...sub,
        nextBillingDate: new Date(sub.next_billing_date),
        billingCycle: sub.billing_cycle
      })));
      setError(null);
    } catch (err) {
      setError('Failed to load subscriptions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const addSubscription = async (newSubscription: Subscription) => {
    try {
      const formatted = {
        ...newSubscription,
        billing_cycle: newSubscription.billingCycle,
        next_billing_date: newSubscription.nextBillingDate.toISOString(),
      };
      await api.createSubscription(formatted);
      await loadSubscriptions();
    } catch (err) {
      setError('Failed to add subscription');
      console.error(err);
    }
  };

  const toggleSubscriptionActive = async (id: string) => {
    try {
      await api.toggleSubscriptionActive(id);
      await loadSubscriptions();
    } catch (err) {
      setError('Failed to toggle subscription status');
      console.error(err);
    }
  };

  return {
    subscriptions,
    loading,
    error,
    addSubscription,
    toggleSubscriptionActive,
  };
}