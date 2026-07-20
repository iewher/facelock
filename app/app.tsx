import { useState, useEffect } from 'react'
import { LoginScreen } from '@/app/components/login-screen'
import { LibraryScreen } from '@/app/components/library-screen'
import './styles/app.css'

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isNewUser, setIsNewUser] = useState(false)
  const [initialMasterKey, setInitialMasterKey] = useState<string>()
  const [userId, setUserId] = useState<string>()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const result = await window.conveyor.app.authCheck()
      if (!result.exists) {
        setIsNewUser(true)
        setInitialMasterKey(result.master_key)
      }
    } catch {
      setIsNewUser(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (masterKey: string) => {
    if (isNewUser) {
      const user = await window.conveyor.app.authCheck()
      if (user.exists) setUserId(String(user.id))
      setIsAuthenticated(true)
      setIsNewUser(false)
      return
    }
    const valid = await window.conveyor.app.authLogin(masterKey)
    if (valid) {
      const user = await window.conveyor.app.authCheck()
      if (user.exists) setUserId(String(user.id))
      setIsAuthenticated(true)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-purple-950 to-neutral-950 flex items-center justify-center">
        <p className="text-purple-400/60">Загрузка...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} initialMasterKey={initialMasterKey} isNewUser={isNewUser} />
  }

  return <LibraryScreen userId={userId || ''} onLogout={handleLogout} />
}
