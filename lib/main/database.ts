import Database from 'better-sqlite3'
import { app } from 'electron'
import path from 'path'

const getDbPath = (): string => {
  const userDataPath = app.getPath('userData')
  return path.join(userDataPath, 'facelock.db')
}

export const db = new Database(getDbPath(), {
  verbose: process.env.NODE_ENV !== 'production' ? console.log : undefined,
})

db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT UNIQUE NOT NULL,
    master_key TEXT NOT NULL
  )
`)

// Migrate: add collection_id to passwords if missing
const hasCollectionId = db
  .prepare('PRAGMA table_info(passwords)')
  .all()
  .some((col: { name: string }) => col.name === 'collection_id')

if (!hasCollectionId) {
  db.exec(`ALTER TABLE passwords ADD COLUMN collection_id INTEGER DEFAULT NULL`)
}

db.exec(`
  CREATE TABLE IF NOT EXISTS collections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    uuid TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`)

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_passwords_user_id ON passwords(user_id);
  CREATE INDEX IF NOT EXISTS idx_passwords_title ON passwords(title);
  CREATE INDEX IF NOT EXISTS idx_passwords_username ON passwords(username);
  CREATE INDEX IF NOT EXISTS idx_passwords_url ON passwords(url);
  CREATE INDEX IF NOT EXISTS idx_passwords_updated ON passwords(updated_at);
  CREATE INDEX IF NOT EXISTS idx_passwords_collection ON passwords(collection_id);
  CREATE INDEX IF NOT EXISTS idx_collections_user_id ON collections(user_id);
`)
