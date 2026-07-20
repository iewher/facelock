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
