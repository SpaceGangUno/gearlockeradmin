import React from 'react';
import { Calendar, DollarSign } from 'lucide-react';
import { Subscription } from '../types/subscription';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { formatCurrency, formatDate } from '../utils/formatters';

interface SubscriptionCardProps {
  subscription: Subscription;
  onToggleActive: (id: string) => void;
}

export function SubscriptionCard({ subscription, onToggleActive }: SubscriptionCardProps) {
  return (
    <Card className={`${subscription.active ? 'border-l-4 border-green-500' : 'border-l-4 border-gray-300'}`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">{subscription.name}</h3>
        <span className={`px-3 py-1 rounded-full text-sm ${subscription.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {subscription.active ? 'Active' : 'Inactive'}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center text-gray-600">
          <DollarSign size={18} className="mr-2" />
          <span>{formatCurrency(subscription.price)} / {subscription.billingCycle}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <Calendar size={18} className="mr-2" />
          <span>Next billing: {formatDate(subscription.nextBillingDate)}</span>
        </div>
        
        <div className="flex items-center">
          <span className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-700">
            {subscription.category}
          </span>
        </div>
      </div>
      
      <Button
        onClick={() => onToggleActive(subscription.id)}
        variant={subscription.active ? 'secondary' : 'primary'}
        fullWidth
        className="mt-4"
      >
        {subscription.active ? 'Pause Subscription' : 'Activate Subscription'}
      </Button>
    </Card>
  );
}