import db from '../db/index.js';

export const SubscriptionModel = {
  getAll() {
    return db.prepare('SELECT * FROM subscriptions ORDER BY created_at DESC').all();
  },

  getById(id) {
    return db.prepare('SELECT * FROM subscriptions WHERE id = ?').get(id);
  },

  create(subscription) {
    const stmt = db.prepare(`
      INSERT INTO subscriptions (id, name, price, billing_cycle, next_billing_date, category, active)
      VALUES (@id, @name, @price, @billing_cycle, @next_billing_date, @category, @active)
    `);
    return stmt.run(subscription);
  },

  update(id, subscription) {
    const stmt = db.prepare(`
      UPDATE subscriptions 
      SET name = @name, 
          price = @price, 
          billing_cycle = @billing_cycle, 
          next_billing_date = @next_billing_date, 
          category = @category, 
          active = @active
      WHERE id = @id
    `);
    return stmt.run({ ...subscription, id });
  },

  delete(id) {
    return db.prepare('DELETE FROM subscriptions WHERE id = ?').run(id);
  },

  toggleActive(id) {
    return db.prepare(`
      UPDATE subscriptions 
      SET active = NOT active 
      WHERE id = ?
    `).run(id);
  }
};