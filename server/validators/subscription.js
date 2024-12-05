import { z } from 'zod';

export const subscriptionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().positive('Price must be positive'),
  billing_cycle: z.enum(['monthly', 'yearly']),
  next_billing_date: z.string().datetime(),
  category: z.string().min(1, 'Category is required'),
  active: z.boolean().default(true),
});