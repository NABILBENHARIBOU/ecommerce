import { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Charger les données d'authentification au montage
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')

      console.log('=== AuthContext Init ===')
      console.log('storedToken:', storedToken ? 'EXISTS' : 'NOT FOUND')
      console.log('storedUser:', storedUser ? 'EXISTS' : 'NOT FOUND')

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          console.log('✅ User parsed successfully:', parsedUser)
          setUser(parsedUser)
          setIsAuthenticated(true)
          
          if (storedToken) {
            setToken(storedToken)
          }
        } catch (parseError) {
          console.error('❌ Error parsing user from localStorage:', parseError)
          localStorage.removeItem('user')
          localStorage.removeItem('token')
          setUser(null)
          setToken(null)
          setIsAuthenticated(false)
        }
      } else {
        console.log('No user in localStorage')
        setUser(null)
        setToken(null)
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('❌ Unexpected error in AuthContext init:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Surveiller les changements d'authentification
  useEffect(() => {
    console.log('Auth state changed - isAuthenticated:', isAuthenticated, 'user:', user)
  }, [isAuthenticated, user])

  const login = (userData, authToken) => {
    console.log('Login called with:', userData)
    setUser(userData)
    if (authToken) {
      setToken(authToken)
      localStorage.setItem('token', authToken)
    } else {
      setToken(null)
      localStorage.removeItem('token')
    }
    setIsAuthenticated(true)
    localStorage.setItem('user', JSON.stringify(userData))
    console.log('User saved to localStorage:', localStorage.getItem('user'))
  }

  const register = (userData, authToken) => {
    setUser(userData)
    if (authToken) {
      setToken(authToken)
      localStorage.setItem('token', authToken)
    } else {
      setToken(null)
      localStorage.removeItem('token')
    }
    setIsAuthenticated(true)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    setIsAuthenticated(false)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const updateUser = (updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAuthenticated,
      login,
      register,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
