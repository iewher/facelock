import { type App } from 'electron'
import { handle } from '@/lib/main/shared'
import { db } from '@/lib/main/database'
import crypto from 'crypto'

export const registerAppHandlers = (app: App) => {
  // App operations
  handle('version', () => app.getVersion())

  // Auth operations
  handle('auth-check', () => {
    const user = db.prepare('SELECT uuid, master_key FROM users LIMIT 1').get() as
      { uuid: string; master_key: string } | undefined
    if (user) {
      return { exists: true }
    }
    const uuid = crypto.randomUUID()
    const masterKey = crypto.randomBytes(16).toString('hex')
    db.prepare('INSERT INTO users (uuid, master_key) VALUES (?, ?)').run(uuid, masterKey)
    return { exists: false, uuid, master_key: masterKey }
  })

  handle('auth-login', (masterKey: string) => {
    const user = db.prepare('SELECT id FROM users WHERE master_key = ?').get(masterKey) as { id: number } | undefined
    return !!user
  })
}
