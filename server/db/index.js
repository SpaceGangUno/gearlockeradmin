import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbDir = join(__dirname);
const dbPath = join(dbDir, 'budgets.sqlite');

// Remove existing database file if it exists
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

// Ensure the directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Initialize database schema in a transaction
db.transaction(() => {
  // Create budgets table
  db.exec(`
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
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Add check constraints
  db.exec(`
    CREATE TRIGGER enforce_cycle_type
    BEFORE INSERT ON budgets
    BEGIN
      SELECT CASE
        WHEN NEW.cycle_type NOT IN ('monthly', 'quarterly', 'yearly')
        THEN RAISE(ABORT, 'Invalid cycle_type')
      END;
    END;
  `);

  db.exec(`
    CREATE TRIGGER enforce_category
    BEFORE INSERT ON budgets
    BEGIN
      SELECT CASE
        WHEN NEW.category NOT IN ('ads', 'promos', 'influencers', 'content', 'other')
        THEN RAISE(ABORT, 'Invalid category')
      END;
    END;
  `);

  // Create update timestamp trigger
  db.exec(`
    CREATE TRIGGER update_budget_timestamp
    AFTER UPDATE ON budgets
    BEGIN
      UPDATE budgets SET updated_at = CURRENT_TIMESTAMP
      WHERE id = NEW.id;
    END;
  `);
})();

export default db;
