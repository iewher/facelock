import { useState } from 'react'
import { ArrowLeft, Eye, EyeOff, Copy, Check } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'

interface PasswordDetailProps {
  id: string
  title: string
  username: string
  password: string
  url: string
  totp: string
  onBack: () => void
}

export function PasswordDetail({ title, username, password, url, totp, onBack }: PasswordDetailProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showTotp, setShowTotp] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="gap-2 text-purple-300 hover:text-purple-100 hover:bg-purple-900/30"
        >
          <ArrowLeft className="size-4" />
          Назад к библиотеке
        </Button>

        <Card className="border-purple-500/30 shadow-lg shadow-purple-500/10">
          <CardHeader>
            <CardTitle className="text-2xl text-purple-100">{title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-300">URL</label>
              <div className="flex gap-2">
                <Input value={url} readOnly className="bg-purple-950/50 border-purple-800 text-purple-200" />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(url, 'url')}
                  className="border-purple-700 hover:bg-purple-800"
                >
                  {copied === 'url' ? <Check className="size-4 text-green-400" /> : <Copy className="size-4" />}
                </Button>
              </div>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-300">Логин</label>
              <div className="flex gap-2">
                <Input value={username} readOnly className="bg-purple-950/50 border-purple-800 text-purple-200" />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(username, 'username')}
                  className="border-purple-700 hover:bg-purple-800"
                >
                  {copied === 'username' ? <Check className="size-4 text-green-400" /> : <Copy className="size-4" />}
                </Button>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-300">Пароль</label>
              <div className="flex gap-2">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  readOnly
                  className="bg-purple-950/50 border-purple-800 text-purple-200"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                  className="border-purple-700 hover:bg-purple-800"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(password, 'password')}
                  className="border-purple-700 hover:bg-purple-800"
                >
                  {copied === 'password' ? <Check className="size-4 text-green-400" /> : <Copy className="size-4" />}
                </Button>
              </div>
            </div>

            {/* TOTP */}
            {totp && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-purple-300">2FA / TOTP</label>
                <div className="flex gap-2">
                  <Input
                    type={showTotp ? 'text' : 'password'}
                    value={totp}
                    readOnly
                    className="bg-purple-950/50 border-purple-800 text-purple-200 font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowTotp(!showTotp)}
                    className="border-purple-700 hover:bg-purple-800"
                  >
                    {showTotp ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(totp, 'totp')}
                    className="border-purple-700 hover:bg-purple-800"
                  >
                    {copied === 'totp' ? <Check className="size-4 text-green-400" /> : <Copy className="size-4" />}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
