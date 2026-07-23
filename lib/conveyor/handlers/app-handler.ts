import { type App } from 'electron'
import { handle } from '@/lib/main/shared'
import { db } from '@/lib/main/database'
import crypto from 'crypto'

export const registerAppHandlers = (app: App) => {
  // App operations
  handle('version', () => app.getVersion())

  // Auth operations
  handle('auth-check', () => {
    const user = db.prepare('SELECT id, uuid, master_key FROM users LIMIT 1').get() as
      { id: number; uuid: string; master_key: string } | undefined
    if (user) {
      return { exists: true, id: user.id }
    }
    const uuid = crypto.randomUUID()
    const masterKey = crypto.randomBytes(16).toString('hex')
    const result = db.prepare('INSERT INTO users (uuid, master_key) VALUES (?, ?)').run(uuid, masterKey)
    return { exists: false, id: result.lastInsertRowid as number, uuid, master_key: masterKey }
  })

  handle('auth-login', (masterKey: string) => {
    const user = db.prepare('SELECT id FROM users WHERE master_key = ?').get(masterKey) as { id: number } | undefined
    return !!user
  })

  // Password operations
  handle('passwords-get-all', (userId: string) => {
    const uid = Number(userId)
    return db
      .prepare(
        'SELECT id, title, username, password, url, totp, notes, collection_id, created_at, updated_at FROM passwords WHERE user_id = ? ORDER BY updated_at DESC'
      )
      .all(uid) as Array<{
      id: number
      title: string
      username: string
      password: string
      url: string
      totp: string
      notes: string
      collection_id: number | null
      created_at: number
      updated_at: number
    }>
  })

  handle('passwords-get-by-id', (id: number) => {
    return db
      .prepare(
        'SELECT id, title, username, password, url, totp, notes, collection_id, created_at, updated_at FROM passwords WHERE id = ?'
      )
      .get(id) as {
      id: number
      title: string
      username: string
      password: string
      url: string
      totp: string
      notes: string
      collection_id: number | null
      created_at: number
      updated_at: number
    }
  })

  handle(
    'passwords-create',
    (
      userId: string,
      data: {
        title: string
        username: string
        password: string
        url?: string
        totp?: string
        notes?: string
        collection_id?: number | null
      }
    ) => {
      const uid = Number(userId)
      const now = Math.floor(Date.now() / 1000)
      const collectionId = data.collection_id ?? null
      const result = db
        .prepare(
          'INSERT INTO passwords (user_id, collection_id, title, username, password, url, totp, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        )
        .run(
          uid,
          collectionId,
          data.title,
          data.username,
          data.password,
          data.url || '',
          data.totp || '',
          data.notes || '',
          now,
          now
        )
      return result.lastInsertRowid as number
    }
  )

  handle(
    'passwords-update',
    (
      id: number,
      data: {
        title: string
        username: string
        password: string
        url?: string
        totp?: string
        notes?: string
        collection_id?: number | null
      }
    ) => {
      const now = Math.floor(Date.now() / 1000)
      const collectionId = 'collection_id' in data ? data.collection_id : undefined
      const result = db
        .prepare(
          'UPDATE passwords SET title = ?, username = ?, password = ?, url = ?, totp = ?, notes = ?, collection_id = ?, updated_at = ? WHERE id = ?'
        )
        .run(
          data.title,
          data.username,
          data.password,
          data.url || '',
          data.totp || '',
          data.notes || '',
          collectionId ?? null,
          now,
          id
        )
      return result.changes > 0
    }
  )

  handle('passwords-delete', (id: number) => {
    const result = db.prepare('DELETE FROM passwords WHERE id = ?').run(id)
    return result.changes > 0
  })

  // Collection operations
  handle('collections-get-all', (userId: string) => {
    const uid = Number(userId)
    return db
      .prepare(
        'SELECT id, uuid, name, created_at, updated_at FROM collections WHERE user_id = ? ORDER BY updated_at DESC'
      )
      .all(uid) as Array<{ id: number; uuid: string; name: string; created_at: number; updated_at: number }>
  })

  handle('collections-create', (userId: string, data: { name: string }) => {
    const uid = Number(userId)
    const uuid = crypto.randomUUID()
    const now = Math.floor(Date.now() / 1000)
    const result = db
      .prepare('INSERT INTO collections (user_id, uuid, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?)')
      .run(uid, uuid, data.name, now, now)
    return { id: result.lastInsertRowid as number, uuid }
  })

  handle('collections-update', (id: number, data: { name: string }) => {
    const now = Math.floor(Date.now() / 1000)
    const result = db.prepare('UPDATE collections SET name = ?, updated_at = ? WHERE id = ?').run(data.name, now, id)
    return result.changes > 0
  })

  handle('collections-delete', (id: number) => {
    const count = db.prepare('SELECT COUNT(*) as cnt FROM passwords WHERE collection_id = ?').get(id) as { cnt: number }
    if (count.cnt > 0) {
      return { success: false, isEmpty: false }
    }
    const result = db.prepare('DELETE FROM collections WHERE id = ?').run(id)
    return { success: result.changes > 0, isEmpty: true }
  })
}
