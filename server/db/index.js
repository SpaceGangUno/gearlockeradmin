import Database from 'better-sqlite3';
import { schema } from './schema.js';

const db = new Database(':memory:'); // Using in-memory database for development

// Initialize database with schema
db.exec(schema);

export default db;