import { useState, useEffect } from 'react'
import { ArrowLeft, Eye, EyeOff, Save, X, FolderOpen } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'

interface AddPasswordScreenProps {
  userId: string
  entryId?: number
  existingEntry?: {
    title: string
    username: string
    password: string
    url: string
    totp: string
    notes: string
    collection_id?: number | null
  }
  onSave: () => void
  onBack: () => void
  collections?: Array<{ id: number; name: string }>
}

export function AddPasswordScreen({
  userId,
  entryId,
  existingEntry,
  onSave,
  onBack,
  collections = [],
}: AddPasswordScreenProps) {
  const [title, setTitle] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [url, setUrl] = useState('')
  const [totp, setTotp] = useState('')
  const [notes, setNotes] = useState('')
  const [collectionId, setCollectionId] = useState<number | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showTotp, setShowTotp] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showCollectionPicker, setShowCollectionPicker] = useState(false)

  useEffect(() => {
    if (existingEntry) {
      setTitle(existingEntry.title)
      setUsername(existingEntry.username)
      setPassword(existingEntry.password)
      setUrl(existingEntry.url)
      setTotp(existingEntry.totp)
      setNotes(existingEntry.notes)
      setCollectionId(existingEntry.collection_id ?? null)
    }
  }, [existingEntry])

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
    let result = ''
    for (let i = 0; i < 20; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPassword(result)
  }

  const handleSave = async () => {
    if (!title.trim() || !password.trim()) return
    setSaving(true)
    try {
      const data = {
        title: title.trim(),
        username: username.trim(),
        password,
        url,
        totp,
        notes,
        collection_id: collectionId,
      }
      if (entryId) {
        await window.conveyor.app.passwordsUpdate(entryId, data)
      } else {
        await window.conveyor.app.passwordsCreate(userId, data)
      }
      onSave()
    } finally {
      setSaving(false)
    }
  }

  const selectedCollection = collections.find((c) => c.id === collectionId)
  const collectionName = selectedCollection ? selectedCollection.name : 'Без коллекции'

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-purple-950 to-neutral-950 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onBack}
            className="gap-2 text-purple-300 hover:text-purple-100 hover:bg-purple-900/30"
          >
            <ArrowLeft className="size-4" />
            Назад
          </Button>
          <h2 className="text-xl font-bold text-purple-100">{entryId ? 'Редактировать' : 'Новая запись'}</h2>
          <div />
        </div>

        <Card className="border-purple-500/30 shadow-lg shadow-purple-500/10">
          <CardHeader>
            <CardTitle className="text-2xl text-purple-100">
              {entryId ? 'Изменение записи' : 'Добавить запись'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-300">Название *</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="GitHub, Google..."
                className="bg-purple-950/30 border-purple-800/50 text-purple-100 placeholder:text-purple-600 h-10"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-300">Логин / Email</label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="user@gmail.com"
                className="bg-purple-950/30 border-purple-800/50 text-purple-100 placeholder:text-purple-600 h-10"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-300">Коллекция</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCollectionPicker(!showCollectionPicker)}
                  className="w-full flex items-center gap-2 px-3 h-10 bg-purple-950/30 border border-purple-800/50 rounded-md text-purple-100 hover:bg-purple-900/30 transition-colors text-left"
                >
                  <FolderOpen className="size-4 text-purple-500" />
                  <span className={collectionId ? 'text-purple-100' : 'text-purple-600'}>{collectionName}</span>
                </button>
                {showCollectionPicker && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowCollectionPicker(false)} />
                    <div className="absolute top-full left-0 right-0 mt-1 bg-purple-950 border border-purple-700/50 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setCollectionId(null)
                          setShowCollectionPicker(false)
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                          collectionId === null
                            ? 'bg-purple-800/50 text-purple-100'
                            : 'text-purple-400 hover:bg-purple-900/30 hover:text-purple-200'
                        }`}
                      >
                        <FolderOpen className="size-4" />
                        Без коллекции
                      </button>
                      {collections.map((coll) => (
                        <button
                          key={coll.id}
                          type="button"
                          onClick={() => {
                            setCollectionId(coll.id)
                            setShowCollectionPicker(false)
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                            collectionId === coll.id
                              ? 'bg-purple-800/50 text-purple-100'
                              : 'text-purple-400 hover:bg-purple-900/30 hover:text-purple-200'
                          }`}
                        >
                          <FolderOpen className="size-4" />
                          {coll.name}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-300">Пароль *</label>
              <div className="flex gap-2">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль"
                  className="bg-purple-950/30 border-purple-800/50 text-purple-100 placeholder:text-purple-600 h-10"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={generatePassword}
                  className="border-purple-700 hover:bg-purple-800 text-purple-400"
                  title="Сгенерировать пароль"
                >
                  🎲
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                  className="border-purple-700 hover:bg-purple-800"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-300">URL</label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="bg-purple-950/30 border-purple-800/50 text-purple-100 placeholder:text-purple-600 h-10"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-300">2FA / TOTP</label>
              <div className="flex gap-2">
                <Input
                  type={showTotp ? 'text' : 'password'}
                  value={totp}
                  onChange={(e) => setTotp(e.target.value)}
                  placeholder="123456"
                  className="bg-purple-950/30 border-purple-800/50 text-purple-100 placeholder:text-purple-600 h-10"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowTotp(!showTotp)}
                  className="border-purple-700 hover:bg-purple-800"
                >
                  {showTotp ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-300">Примечания</label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Дополнительная информация..."
                className="bg-purple-950/30 border-purple-800/50 text-purple-100 placeholder:text-purple-600 h-10"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSave}
                disabled={saving || !title.trim() || !password.trim()}
                className="flex-1 h-10 bg-purple-700 hover:bg-purple-600"
              >
                {saving ? (
                  'Сохранение...'
                ) : (
                  <>
                    <Save className="size-4 mr-2" />
                    Сохранить
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={onBack} className="h-10 border-purple-700 hover:bg-purple-900/50">
                <X className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
