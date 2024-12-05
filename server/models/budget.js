import db from '../db/index.js';

export const BudgetModel = {
  getAll() {
    return db.prepare('SELECT * FROM budgets ORDER BY created_at DESC').all();
  },

  getById(id) {
    return db.prepare('SELECT * FROM budgets WHERE id = ?').get(id);
  },

  create(budget) {
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
    return stmt.run(budget);
  },

  update(id, budget) {
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
  },

  updateSpentAmount(id, spentAmount) {
    return db.prepare(`
      UPDATE budgets 
      SET spent_amount = ? 
      WHERE id = ?
    `).run(spentAmount, id);
  },

  delete(id) {
    return db.prepare('DELETE FROM budgets WHERE id = ?').run(id);
  },

  toggleActive(id) {
    return db.prepare(`
      UPDATE budgets 
      SET active = NOT active 
      WHERE id = ?
    `).run(id);
  },

  getStatsByCategory() {
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
  }
};