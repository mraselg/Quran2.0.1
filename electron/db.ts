import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';
import fs from 'fs';

// Store the DB in the userData directory so it persists across updates and installs
const dbDir = path.join(app.getPath('userData'), 'quran-studio-db');

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'history.db');

let db: Database.Database;

try {
  db = new Database(dbPath, { verbose: console.log });
  db.pragma('journal_mode = WAL'); // Better concurrency
  
  // Create audit_logs table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type TEXT NOT NULL,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
} catch (err) {
  console.error("Failed to initialize SQLite database", err);
}

export function logEvent(eventType: string, details: string) {
  if (!db) return false;
  try {
    const stmt = db.prepare('INSERT INTO audit_logs (event_type, details) VALUES (?, ?)');
    stmt.run(eventType, details);
    return true;
  } catch (e) {
    console.error("Failed to log event:", e);
    return false;
  }
}

export function getHistoryLogs() {
  if (!db) return [];
  try {
    const stmt = db.prepare('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 500');
    return stmt.all();
  } catch (e) {
    console.error("Failed to get history logs:", e);
    return [];
  }
}

export function clearHistoryLogs() {
  if (!db) return false;
  try {
    db.exec('DELETE FROM audit_logs');
    return true;
  } catch (e) {
    console.error("Failed to clear history logs:", e);
    return false;
  }
}
