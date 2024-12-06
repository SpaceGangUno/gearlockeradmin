export const schema = `
  DROP TABLE IF EXISTS budgets;

  CREATE TABLE budgets (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    amount REAL NOT NULL,
    spent_amount REAL DEFAULT 0,
    cycle_type TEXT NOT NULL,
    category TEXT NOT NULL,
    platform TEXT,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    active INTEGER DEFAULT 1,
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    CHECK (cycle_type IN ('monthly', 'quarterly', 'yearly')),
    CHECK (category IN ('ads', 'promos', 'influencers', 'content', 'other'))
  );

  DROP TRIGGER IF EXISTS update_budget_timestamp;
  
  CREATE TRIGGER update_budget_timestamp 
  AFTER UPDATE ON budgets
  BEGIN
    UPDATE budgets SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;
`;
