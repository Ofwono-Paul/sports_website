import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  if (isLoading) return null

  if (!isAuthenticated) {
    navigate('/login', { replace: true })
    return null
  }

  return <>{children}</>
}
