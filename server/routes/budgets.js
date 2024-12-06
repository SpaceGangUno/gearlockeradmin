import express from 'express';
import { BudgetModel } from '../models/budget.js';
import { budgetSchema } from '../validators/budget.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const budgets = BudgetModel.getAll();
    res.json(budgets);
  } catch (error) {
    console.error('Error getting budgets:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/stats', (req, res) => {
  try {
    const stats = BudgetModel.getStatsByCategory();
    res.json(stats);
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/', (req, res) => {
  try {
    console.log('Received budget data:', req.body);
    const validatedData = budgetSchema.parse(req.body);
    console.log('Validated data:', validatedData);
    
    const budget = {
      id: Date.now().toString(),
      ...validatedData
    };
    
    console.log('Attempting to create budget:', budget);
    BudgetModel.create(budget);
    res.status(201).json(budget);
  } catch (error) {
    console.error('Error creating budget:', error);
    if (error.errors) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id/spent', (req, res) => {
  try {
    const { spent_amount } = req.body;
    if (typeof spent_amount !== 'number' || spent_amount < 0) {
      return res.status(400).json({ error: 'Invalid spent amount' });
    }
    
    const budget = BudgetModel.getById(req.params.id);
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    
    BudgetModel.updateSpentAmount(req.params.id, spent_amount);
    res.json({ ...budget, spent_amount });
  } catch (error) {
    console.error('Error updating spent amount:', error);
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id/toggle', (req, res) => {
  try {
    const budget = BudgetModel.getById(req.params.id);
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    BudgetModel.toggleActive(req.params.id);
    res.json({ ...budget, active: !budget.active });
  } catch (error) {
    console.error('Error toggling budget:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
