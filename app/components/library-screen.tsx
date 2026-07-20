import { useState, useEffect } from 'react'
import { Plus, Search, Trash2, Edit2 } from 'lucide-react'
import { Input } from '@/app/components/ui/input'
import { Button } from '@/app/components/ui/button'
import { PasswordCard } from '@/app/components/password-card'
import { PasswordDetail } from '@/app/components/password-detail'
import { AddPasswordScreen } from '@/app/components/add-password-screen'

interface PasswordEntry {
  id: number
  title: string
  username: string
  password: string
  url: string
  totp: string
  notes: string
  created_at: number
  updated_at: number
}

interface LibraryScreenProps {
  userId: string
  onLogout: () => void
}

export function LibraryScreen({ userId, onLogout }: LibraryScreenProps) {
  const [entries, setEntries] = useState<PasswordEntry[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadPasswords = async () => {
    try {
      const data = await window.conveyor.app.passwordsGetAll(userId)
      setEntries(data)
    } catch (err) {
      console.error('Failed to load passwords:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (userId) loadPasswords()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить эту запись?')) return
    try {
      await window.conveyor.app.passwordsDelete(id)
      setEntries((prev) => prev.filter((e) => e.id !== id))
      if (selectedId === id) setSelectedId(null)
    } catch (err) {
      console.error('Failed to delete:', err)
    }
  }

  const handleSave = () => {
    setShowAdd(false)
    setEditingId(null)
    loadPasswords()
  }

  const handleEdit = (entry: PasswordEntry) => {
    setEditingId(entry.id)
    setShowAdd(true)
  }

  const selectedEntry = entries.find((e) => e.id === selectedId)
  const editingEntry = entries.find((e) => e.id === editingId)

  const filtered = entries.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) || e.username.toLowerCase().includes(search.toLowerCase())
  )

  if (showAdd) {
    return (
      <AddPasswordScreen
        userId={userId}
        entryId={editingId || undefined}
        existingEntry={editingEntry}
        onSave={handleSave}
        onBack={() => {
          setShowAdd(false)
          setEditingId(null)
        }}
      />
    )
  }

  if (selectedEntry) {
    return (
      <PasswordDetail
        id={String(selectedEntry.id)}
        title={selectedEntry.title}
        username={selectedEntry.username}
        password={selectedEntry.password}
        url={selectedEntry.url}
        totp={selectedEntry.totp || ''}
        notes={selectedEntry.notes || ''}
        onBack={() => setSelectedId(null)}
        onEdit={() => handleEdit(selectedEntry)}
        onDelete={() => handleDelete(selectedEntry.id)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-purple-950 to-neutral-950 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-purple-100">Библиотека</h1>
            <p className="text-purple-400/60 mt-1">{entries.length} записей</p>
          </div>
          <Button
            variant="outline"
            onClick={onLogout}
            className="border-purple-700 text-purple-300 hover:bg-purple-900/50 hover:text-purple-100"
          >
            Выйти
          </Button>
        </div>

        {/* Search & Add */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-purple-500" />
            <Input
              type="text"
              placeholder="Поиск по названию или логину..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-purple-950/30 border-purple-800/50 text-purple-100 placeholder:text-purple-600 h-12"
            />
          </div>
          <Button
            onClick={() => {
              setShowAdd(true)
              setEditingId(null)
            }}
            className="h-12 px-6 bg-purple-700 hover:bg-purple-600 text-purple-50"
          >
            <Plus className="size-4 mr-2" />
            Добавить
          </Button>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="text-center py-12 text-purple-400/60">Загрузка...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((entry) => (
                <div key={entry.id} className="relative group">
                  <PasswordCard
                    id={String(entry.id)}
                    title={entry.title}
                    username={entry.username}
                    url={entry.url}
                    onClick={() => setSelectedId(entry.id)}
                  />
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEdit(entry)
                      }}
                      className="size-8 bg-purple-900/80 hover:bg-purple-700 text-purple-300"
                    >
                      <Edit2 className="size-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(entry.id)
                      }}
                      className="size-8 bg-red-900/80 hover:bg-red-700 text-red-300"
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && <div className="text-center py-12 text-purple-400/60">Ничего не найдено</div>}
          </>
        )}
      </div>
    </div>
  )
}
