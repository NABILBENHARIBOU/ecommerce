import { Navigate } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'

export default function AdminRoute({ children }) {
  const { isAuthenticated, loading, user } = useAuth()

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

  // Vérifier si l'utilisateur est connecté
  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to login')
    return <Navigate to="/login" replace />
  }

  // Vérifier si l'utilisateur est admin
  // Essayer d'abord idType directement, sinon extraire de typeUtilisateur
  let userType = null
  if (user?.idType) {
    userType = parseInt(user.idType, 10)
  } else if (user?.typeUtilisateur && user.typeUtilisateur.id_type) {
    userType = parseInt(user.typeUtilisateur.id_type, 10)
  }
  
  console.log('AdminRoute check - User:', user, 'idType:', user?.idType, 'Parsed userType:', userType)
  
  if (userType !== 2) {
    console.log('User is not admin (userType=' + userType + '), redirecting to home')
    return <Navigate to="/" replace />
  }

  return children
}
