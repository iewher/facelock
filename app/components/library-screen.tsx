import { useState, useEffect, useCallback, useRef } from 'react'
import { Plus, Search, Trash2, Edit2, Folder, FolderOpen, ChevronRight, Lock } from 'lucide-react'
import { Input } from '@/app/components/ui/input'
import { Button } from '@/app/components/ui/button'
import { PasswordCard } from '@/app/components/password-card'
import { AddPasswordScreen } from '@/app/components/add-password-screen'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/app/components/ui/dialog'

interface PasswordEntry {
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

interface Collection {
  id: number
  uuid: string
  name: string
  created_at: number
  updated_at: number
}

interface LibraryScreenProps {
  userId: string
  onLogout: () => void
}

type ModalMode = 'none' | 'add-collection' | 'edit-collection' | 'delete-confirmation'

export function LibraryScreen({ userId, onLogout }: LibraryScreenProps) {
  const [entries, setEntries] = useState<PasswordEntry[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [selectedCollection, setSelectedCollection] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Collection modals state
  const [modalMode, setModalMode] = useState<ModalMode>('none')
  const [collectionName, setCollectionName] = useState('')
  const [editingCollectionId, setEditingCollectionId] = useState<number | null>(null)
  const [deletingCollectionId, setDeletingCollectionId] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const collectionNameRef = useRef(collectionName)

  useEffect(() => {
    collectionNameRef.current = collectionName
  }, [collectionName])

  const isAddMode = modalMode === 'add-collection'

  const loadData = useCallback(async () => {
    try {
      const [data, colls] = await Promise.all([
        window.conveyor.app.passwordsGetAll(userId),
        window.conveyor.app.collectionsGetAll(userId),
      ])
      setEntries(data)
      setCollections(colls)
    } catch (err) {
      console.error('Failed to load data:', err)
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    if (userId) loadData()
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
    loadData()
  }

  const handleEdit = (entry: PasswordEntry) => {
    setEditingId(entry.id)
    setShowAdd(true)
  }

  // Collection CRUD
  const handleCreateCollection = async () => {
    const name = collectionNameRef.current.trim()
    if (!name) return
    setIsSaving(true)
    try {
      await window.conveyor.app.collectionsCreate(userId, { name })
      setCollectionName('')
      setModalMode('none')
      await loadData()
    } catch (err) {
      console.error('Failed to create collection:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateCollection = async () => {
    const name = collectionNameRef.current.trim()
    if (!name || !editingCollectionId) return
    setIsSaving(true)
    try {
      await window.conveyor.app.collectionsUpdate(editingCollectionId, { name })
      setCollectionName('')
      setModalMode('none')
      setEditingCollectionId(null)
      await loadData()
    } catch (err) {
      console.error('Failed to update collection:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteCollection = async () => {
    if (!deletingCollectionId) return
    try {
      await window.conveyor.app.collectionsDelete(deletingCollectionId)
      setModalMode('none')
      setDeletingCollectionId(null)
      if (selectedCollection === deletingCollectionId) setSelectedCollection(null)
      await loadData()
    } catch (err) {
      console.error('Failed to delete collection:', err)
    }
  }

  const openEditCollection = (coll: Collection) => {
    setEditingCollectionId(coll.id)
    setCollectionName(coll.name)
    setModalMode('edit-collection')
  }

  const openDeleteCollection = (coll: Collection) => {
    setDeletingCollectionId(coll.id)
    setModalMode('delete-confirmation')
  }

  const editingEntry = entries.filter((e) => e.id === editingId)[0]

  const unassignedCount = entries.filter((e) => e.collection_id === null).length

  const filtered = entries.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) || e.username.toLowerCase().includes(search.toLowerCase())
    if (!matchesSearch) return false
    if (selectedCollection === null) return true
    return e.collection_id === selectedCollection
  })

  const currentTitle =
    selectedCollection === null
      ? unassignedCount > 0
        ? `Независимые (${unassignedCount})`
        : 'Все записи'
      : collections.find((c) => c.id === selectedCollection)?.name || 'Коллекция'

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
        collections={collections.map((c) => ({ id: c.id, name: c.name }))}
        defaultCollectionId={editingId ? undefined : selectedCollection}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-purple-950 to-neutral-950 flex">
      {/* Left sidebar - Collections */}
      <div className="w-72 border-r border-purple-800/30 bg-purple-950/20 flex flex-col">
        <div className="p-4 border-b border-purple-800/30">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-purple-200 flex items-center gap-2">
              <Folder className="size-4" />
              Коллекции
            </h2>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => {
                setCollectionName('')
                setEditingCollectionId(null)
                setModalMode('add-collection')
              }}
              className="size-7 text-purple-400 hover:text-purple-200 hover:bg-purple-800/50"
            >
              <Plus className="size-4" />
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedCollection(null)}
            className={`w-full justify-start gap-2 text-sm mb-1 ${
              selectedCollection === null
                ? 'bg-purple-800/50 border-purple-600 text-purple-100'
                : 'border-purple-800/50 text-purple-400 hover:bg-purple-900/30'
            }`}
          >
            <FolderOpen className="size-3.5" />
            Независимые {unassignedCount > 0 ? `(${unassignedCount})` : ''}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {collections.map((coll) => {
            const count = entries.filter((e) => e.collection_id === coll.id).length
            return (
              <div
                key={coll.id}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer group transition-colors ${
                  selectedCollection === coll.id
                    ? 'bg-purple-800/50 text-purple-100'
                    : 'text-purple-400 hover:bg-purple-900/30 hover:text-purple-300'
                }`}
                onClick={() => setSelectedCollection(selectedCollection === coll.id ? null : coll.id)}
              >
                <ChevronRight className="size-3.5 shrink-0 opacity-60" />
                <Folder className="size-3.5 shrink-0" />
                <span className="flex-1 text-sm truncate">{coll.name}</span>
                <span className="text-xs text-purple-600">{count}</span>
                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      openEditCollection(coll)
                    }}
                    className="size-5 text-purple-400 hover:text-purple-200 hover:bg-purple-700"
                  >
                    <Edit2 className="size-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      openDeleteCollection(coll)
                    }}
                    className="size-5 text-red-400 hover:text-red-200 hover:bg-red-900"
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </div>
            )
          })}
          {collections.length === 0 && unassignedCount === 0 && (
            <div className="text-center py-6 text-purple-600/60 text-sm">Нет записей</div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-purple-100">{currentTitle}</h1>
              <p className="text-purple-400/60 mt-1">{filtered.length} записей</p>
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
                {filtered.map((entry) => {
                  const collName = entry.collection_id
                    ? collections.find((c) => c.id === entry.collection_id)?.name
                    : undefined
                  return (
                    <div key={entry.id} className="relative group">
                      <PasswordCard
                        id={String(entry.id)}
                        title={entry.title}
                        username={entry.username}
                        url={entry.url}
                        collectionName={collName}
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
                  )
                })}
              </div>

              {filtered.length === 0 && <div className="text-center py-12 text-purple-400/60">Ничего не найдено</div>}
            </>
          )}
        </div>
      </div>

      {/* Add/Edit Collection Modal */}
      <Dialog
        open={isAddMode || modalMode === 'edit-collection'}
        onOpenChange={(open) => {
          if (!open) {
            setModalMode('none')
            setCollectionName('')
            setEditingCollectionId(null)
          }
        }}
      >
        <DialogContent className="border-purple-700/50 bg-purple-950/90">
          <DialogHeader>
            <DialogTitle className="text-purple-100">
              {isAddMode ? 'Новая коллекция' : 'Редактировать коллекцию'}
            </DialogTitle>
            <DialogDescription className="text-purple-400">
              {isAddMode ? 'Введите название для новой коллекции' : 'Измените название коллекции'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              placeholder="Название коллекции..."
              className="bg-purple-950/50 border-purple-700/50 text-purple-100 placeholder:text-purple-600 h-10"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && collectionNameRef.current.trim()) {
                  isAddMode ? handleCreateCollection() : handleUpdateCollection()
                }
              }}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setModalMode('none')
                setCollectionName('')
                setEditingCollectionId(null)
              }}
              className="border-purple-700 hover:bg-purple-900/50"
            >
              Отмена
            </Button>
            <Button
              onClick={isAddMode ? handleCreateCollection : handleUpdateCollection}
              disabled={isSaving || !collectionNameRef.current.trim()}
              className="bg-purple-700 hover:bg-purple-600"
            >
              {isSaving ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={modalMode === 'delete-confirmation'} onOpenChange={(open) => !open && setModalMode('none')}>
        <DialogContent className="border-purple-700/50 bg-purple-950/90">
          <DeleteConfirmationModal
            collectionId={deletingCollectionId}
            collectionName={collections.find((c) => c.id === deletingCollectionId)?.name || ''}
            passwordCount={
              deletingCollectionId ? entries.filter((e) => e.collection_id === deletingCollectionId).length : 0
            }
            onClose={() => {
              setModalMode('none')
              setDeletingCollectionId(null)
            }}
            onConfirm={handleDeleteCollection}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Delete confirmation modal content
function DeleteConfirmationModal({
  collectionName,
  passwordCount,
  onClose,
  onConfirm,
}: {
  collectionId: number | null
  collectionName: string
  passwordCount: number
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-purple-100 flex items-center gap-2">
          <Trash2 className="size-5 text-red-400" />
          Удаление коллекции
        </DialogTitle>
        <DialogDescription className="text-purple-400">Вы уверены, что хотите удалить эту коллекцию?</DialogDescription>
      </DialogHeader>

      <div className="py-4 space-y-3">
        {passwordCount > 0 ? (
          <div className="flex items-start gap-3 p-3 bg-yellow-950/30 border border-yellow-800/30 rounded-lg">
            <Lock className="size-5 text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-200 font-medium">Коллекция не пуста</p>
              <p className="text-yellow-400/70 text-sm mt-1">
                В коллекции «{collectionName}» {passwordCount}{' '}
                {passwordCount === 1 ? 'запись' : passwordCount < 5 ? 'записи' : 'записей'}. При удалении коллекции все
                записи станут независимыми.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-purple-900/20 border border-purple-700/30 rounded-lg">
            <p className="text-purple-300">
              Коллекция <span className="font-medium">{collectionName}</span> пуста. Она будет удалена безвозвратно.
            </p>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose} className="border-purple-700 hover:bg-purple-900/50">
          Отмена
        </Button>
        <Button onClick={onConfirm} variant="destructive" className="bg-red-800 hover:bg-red-700">
          Удалить
        </Button>
      </DialogFooter>
    </>
  )
}
