import { useState } from 'react'
import { LoginScreen } from '@/app/components/login-screen'
import { LibraryScreen } from '@/app/components/library-screen'
import './styles/app.css'

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLogin = (_password: string) => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />
  }

  return <LibraryScreen onLogout={handleLogout} />
}
