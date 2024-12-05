import express from 'express';
import { SubscriptionModel } from '../models/subscription.js';
import { subscriptionSchema } from '../validators/subscription.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const subscriptions = SubscriptionModel.getAll();
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const subscription = SubscriptionModel.getById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', (req, res) => {
  try {
    const validatedData = subscriptionSchema.parse(req.body);
    const subscription = {
      id: Date.now().toString(),
      ...validatedData
    };
    SubscriptionModel.create(subscription);
    res.status(201).json(subscription);
  } catch (error) {
    if (error.errors) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', (req, res) => {
  try {
    const validatedData = subscriptionSchema.parse(req.body);
    const subscription = SubscriptionModel.getById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    SubscriptionModel.update(req.params.id, validatedData);
    res.json({ ...subscription, ...validatedData });
  } catch (error) {
    if (error.errors) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const subscription = SubscriptionModel.getById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    SubscriptionModel.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id/toggle', (req, res) => {
  try {
    const subscription = SubscriptionModel.getById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    SubscriptionModel.toggleActive(req.params.id);
    res.json({ ...subscription, active: !subscription.active });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;