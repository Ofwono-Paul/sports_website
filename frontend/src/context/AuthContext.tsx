import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { User, AuthTokens } from '@/types'
import { authAPI, setAuthToken, clearAuth } from '@/services/endpoints'

interface AuthContextType {
  user: User | null
  profile: any | null
  tokens: AuthTokens | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (tokens: AuthTokens, user: User) => void
  register: (tokens: AuthTokens, user: User) => void
  logout: () => void
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any | null>(null)
  const [tokens, setTokens] = useState<AuthTokens | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const u = localStorage.getItem('user')
    const t = localStorage.getItem('access_token')
    const r = localStorage.getItem('refresh_token')
    if (u && t && r) {
      try {
        setUser(JSON.parse(u))
        setTokens({ access: t, refresh: r })
      } catch {
        clearAuth()
      }
    }
    setIsLoading(false)
  }, [])

  const refreshProfile = useCallback(async () => {
    try {
      const res = await authAPI.profile()
      setProfile(res.data)
    } catch {
      setProfile(null)
    }
  }, [])

  useEffect(() => {
    if (user) refreshProfile()
  }, [user, refreshProfile])

  const login = useCallback((authTokens: AuthTokens, userData: User) => {
    setTokens(authTokens)
    setUser(userData)
    setAuthToken(authTokens.access)
    localStorage.setItem('refresh_token', authTokens.refresh)
    localStorage.setItem('user', JSON.stringify(userData))
    refreshProfile()
  }, [refreshProfile])

  const register = useCallback((authTokens: AuthTokens, userData: User) => {
    login(authTokens, userData)
  }, [login])

  const logout = useCallback(() => {
    const r = localStorage.getItem('refresh_token')
    if (r) {
      authAPI.logout(r).catch(() => {})
    }
    clearAuth()
    setUser(null)
    setProfile(null)
    setTokens(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, profile, tokens, isLoading, isAuthenticated: !!user, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}
