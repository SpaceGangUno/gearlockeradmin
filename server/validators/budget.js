import { z } from 'zod';

export const budgetSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  amount: z.number().positive('Amount must be positive'),
  spent_amount: z.number().min(0).default(0),
  cycle_type: z.enum(['monthly', 'quarterly', 'yearly']),
  category: z.enum(['ads', 'promos', 'influencers', 'content', 'other']),
  platform: z.string().optional(),
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
  active: z.boolean().default(true),
  notes: z.string().optional()
});