import { Navigate } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'

export default function ClientOrAdminRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  // Vérifier si l'utilisateur est connecté (client ou admin)
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Les clients ET les admins peuvent accéder
  return children
}
