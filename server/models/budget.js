import db from '../db/index.js';

export const BudgetModel = {
  getAll() {
    try {
      return db.prepare('SELECT * FROM budgets ORDER BY created_at DESC').all();
    } catch (error) {
      console.error('Error getting all budgets:', error);
      throw error;
    }
  },

  getById(id) {
    try {
      return db.prepare('SELECT * FROM budgets WHERE id = ?').get(id);
    } catch (error) {
      console.error(`Error getting budget with id ${id}:`, error);
      throw error;
    }
  },

  create(budget) {
    try {
      console.log('Creating budget with data:', budget);
      const stmt = db.prepare(`
        INSERT INTO budgets (
          id, name, amount, spent_amount, cycle_type, category, 
          platform, start_date, end_date, active, notes
        )
        VALUES (
          @id, @name, @amount, @spent_amount, @cycle_type, @category,
          @platform, @start_date, @end_date, @active, @notes
        )
      `);
      
      // Ensure all required fields are present
      const requiredFields = ['id', 'name', 'amount', 'cycle_type', 'category', 'start_date', 'end_date'];
      for (const field of requiredFields) {
        if (budget[field] === undefined || budget[field] === null) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // Set default values for optional fields
      const budgetWithDefaults = {
        ...budget,
        spent_amount: budget.spent_amount || 0,
        platform: budget.platform || null,
        active: budget.active !== undefined ? budget.active : true,
        notes: budget.notes || null
      };

      console.log('Executing insert with data:', budgetWithDefaults);
      const result = stmt.run(budgetWithDefaults);
      console.log('Insert result:', result);
      return result;
    } catch (error) {
      console.error('Error creating budget:', error);
      console.error('Budget data:', budget);
      throw error;
    }
  },

  update(id, budget) {
    try {
      const stmt = db.prepare(`
        UPDATE budgets 
        SET name = @name,
            amount = @amount,
            spent_amount = @spent_amount,
            cycle_type = @cycle_type,
            category = @category,
            platform = @platform,
            start_date = @start_date,
            end_date = @end_date,
            active = @active,
            notes = @notes
        WHERE id = @id
      `);
      return stmt.run({ ...budget, id });
    } catch (error) {
      console.error(`Error updating budget with id ${id}:`, error);
      throw error;
    }
  },

  updateSpentAmount(id, spentAmount) {
    try {
      return db.prepare(`
        UPDATE budgets 
        SET spent_amount = ? 
        WHERE id = ?
      `).run(spentAmount, id);
    } catch (error) {
      console.error(`Error updating spent amount for budget ${id}:`, error);
      throw error;
    }
  },

  delete(id) {
    try {
      return db.prepare('DELETE FROM budgets WHERE id = ?').run(id);
    } catch (error) {
      console.error(`Error deleting budget with id ${id}:`, error);
      throw error;
    }
  },

  toggleActive(id) {
    try {
      return db.prepare(`
        UPDATE budgets 
        SET active = NOT active 
        WHERE id = ?
      `).run(id);
    } catch (error) {
      console.error(`Error toggling active state for budget ${id}:`, error);
      throw error;
    }
  },

  getStatsByCategory() {
    try {
      return db.prepare(`
        SELECT 
          category,
          SUM(amount) as total_budget,
          SUM(spent_amount) as total_spent,
          COUNT(CASE WHEN active = 1 THEN 1 END) as active_count,
          COUNT(*) as total_count
        FROM budgets
        GROUP BY category
      `).all();
    } catch (error) {
      console.error('Error getting stats by category:', error);
      throw error;
    }
  }
};
