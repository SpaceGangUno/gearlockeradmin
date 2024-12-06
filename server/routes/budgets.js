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
    console.log('Received budget data:', JSON.stringify(req.body, null, 2));
    
    // Validate the request body
    const validatedData = budgetSchema.parse(req.body);
    console.log('Validated data:', JSON.stringify(validatedData, null, 2));
    
    // Create budget object
    const budget = {
      id: Date.now().toString(),
      ...validatedData,
      // Ensure all required fields are present with correct types
      amount: Number(validatedData.amount),
      spent_amount: validatedData.spent_amount || 0,
      cycle_type: validatedData.cycle_type,
      category: validatedData.category,
      platform: validatedData.platform || null,
      start_date: validatedData.start_date,
      end_date: validatedData.end_date,
      active: validatedData.active !== undefined ? validatedData.active : true,
      notes: validatedData.notes || null
    };
    
    console.log('Attempting to create budget:', JSON.stringify(budget, null, 2));
    
    // Create the budget in the database
    const result = BudgetModel.create(budget);
    console.log('Create result:', result);
    
    res.status(201).json(budget);
  } catch (error) {
    console.error('Error creating budget:', error);
    console.error('Error stack:', error.stack);
    
    if (error.errors) {
      // Zod validation error
      console.error('Validation errors:', error.errors);
      return res.status(400).json({ 
        error: 'Validation failed',
        details: error.errors 
      });
    }
    
    if (error.code === 'SQLITE_CONSTRAINT') {
      // SQLite constraint violation
      return res.status(400).json({ 
        error: 'Database constraint violation',
        details: error.message 
      });
    }
    
    // Generic error
    res.status(500).json({ 
      error: 'Failed to create budget',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
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
