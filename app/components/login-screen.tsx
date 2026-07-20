import { useState, useEffect } from 'react'
import { Lock, Eye, EyeOff, Copy, Check } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'

interface LoginScreenProps {
  onLogin: (password: string) => void
  initialMasterKey?: string
  isNewUser: boolean
}

export function LoginScreen({ onLogin, initialMasterKey, isNewUser }: LoginScreenProps) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (initialMasterKey) {
      setPassword(initialMasterKey)
    }
  }, [initialMasterKey])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(initialMasterKey || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) {
      setError('Введите мастер-пароль')
      return
    }
    setError('')
    onLogin(password)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-purple-950 to-neutral-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-purple-800/50 shadow-2xl shadow-purple-900/50 bg-neutral-950/80 backdrop-blur">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 size-16 rounded-full bg-purple-900/50 flex items-center justify-center">
            <Lock className="size-8 text-purple-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-purple-100">Facelock</CardTitle>
          <p className="text-purple-400/60 mt-2">
            {isNewUser ? 'Сохраните этот мастер-ключ' : 'Введите мастер-пароль'}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center items-center gap-1 space-y-2">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                placeholder="Мастер-пароль"
                className="bg-purple-950/30 border-purple-800/50 text-purple-100 placeholder:text-purple-600 h-12 text-base w-100"
                readOnly={isNewUser}
                autoFocus
              />
              {isNewUser && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleCopy}
                  className="text-purple-400 hover:text-purple-200 hover:bg-purple-900/30"
                >
                  {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                </Button>
              )}
              {!isNewUser && (
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-purple-400 hover:text-purple-200 hover:bg-purple-900/30"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </Button>
                </div>
              )}
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            {isNewUser && (
              <p className="text-sm text-yellow-400/80 text-center">
                Обязательно сохраните этот ключ. Без него доступ к паролям будет невозможен.
              </p>
            )}
            <Button type="submit" className="w-full h-12 text-base bg-purple-700 hover:bg-purple-600 text-purple-50">
              {isNewUser ? 'Готово' : 'Войти'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
