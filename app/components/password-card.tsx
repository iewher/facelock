import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'

interface PasswordCardProps {
  id: string
  title: string
  username: string
  url: string
  onClick: () => void
}

export function PasswordCard({ title, username, url, onClick }: PasswordCardProps) {
  return (
    <Card
      className="cursor-pointer transition-all hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 active:scale-[0.98]"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-purple-100">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-purple-300/80">
            <span className="text-purple-400/60">👤</span>
            <span className="truncate">{username}</span>
          </div>
          {url && (
            <div className="flex items-center gap-2 text-xs text-purple-400/60">
              <span>🔗</span>
              <span className="truncate">{url}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
