import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/app/components/ui/input'
import { Button } from '@/app/components/ui/button'
import { PasswordCard } from '@/app/components/password-card'
import { PasswordDetail } from '@/app/components/password-detail'

interface PasswordEntry {
  id: string
  title: string
  username: string
  password: string
  url: string
  totp?: string
}

interface LibraryScreenProps {
  onLogout: () => void
}

const mockData: PasswordEntry[] = [
  {
    id: '1',
    title: 'GitHub',
    username: 'user@gmail.com',
    password: 'ghp_xxxxxxxxxxxxxxxxxxxx',
    url: 'https://github.com',
    totp: '123456',
  },
  {
    id: '2',
    title: 'Google',
    username: 'user@gmail.com',
    password: 'super-secret-password',
    url: 'https://google.com',
  },
  {
    id: '3',
    title: 'Telegram',
    username: '+79991234567',
    password: 'tg-password-123',
    url: 'https://web.telegram.org',
    totp: '654321',
  },
  {
    id: '4',
    title: 'Netflix',
    username: 'user@gmail.com',
    password: 'netflix-pass-456',
    url: 'https://netflix.com',
  },
]

export function LibraryScreen({ onLogout }: LibraryScreenProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const selectedEntry = mockData.find((e) => e.id === selectedId)

  const filtered = mockData.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) || e.username.toLowerCase().includes(search.toLowerCase())
  )

  if (selectedEntry) {
    return (
      <PasswordDetail
        id={selectedEntry.id}
        title={selectedEntry.title}
        username={selectedEntry.username}
        password={selectedEntry.password}
        url={selectedEntry.url}
        totp={selectedEntry.totp || ''}
        onBack={() => setSelectedId(null)}
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
            <p className="text-purple-400/60 mt-1">{mockData.length} записей</p>
          </div>
          <Button
            variant="outline"
            onClick={onLogout}
            className="border-purple-700 text-purple-300 hover:bg-purple-900/50 hover:text-purple-100"
          >
            Выйти
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-purple-500" />
          <Input
            type="text"
            placeholder="Поиск по названию или логину..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-purple-950/30 border-purple-800/50 text-purple-100 placeholder:text-purple-600 h-12"
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((entry) => (
            <PasswordCard
              key={entry.id}
              id={entry.id}
              title={entry.title}
              username={entry.username}
              url={entry.url}
              onClick={() => setSelectedId(entry.id)}
            />
          ))}
        </div>

        {filtered.length === 0 && <div className="text-center py-12 text-purple-400/60">Ничего не найдено</div>}
      </div>
    </div>
  )
}
