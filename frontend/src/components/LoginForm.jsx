import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react'
import { useAuth } from '../store/AuthContext'
import api from '../services/api'

export default function LoginForm() {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)

  // login state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // register state
  const [registerNom, setRegisterNom] = useState('')
  const [registerPrenom, setRegisterPrenom] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerTelephone, setRegisterTelephone] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState('')
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [showRegisterPasswordConfirm, setShowRegisterPasswordConfirm] = useState(false)
  const [registerError, setRegisterError] = useState('')
  const [registerLoading, setRegisterLoading] = useState(false)
  const [registerSuccess, setRegisterSuccess] = useState('')

  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Appel du nouvel endpoint d'authentification
      const response = await api.loginUser(email, password)
      const { user, token } = response
      if (!user || !token) throw new Error('Email ou mot de passe incorrect')

      login(user, token)

      // Attendre un instant pour s'assurer que localStorage est bien sauvegardé
      setTimeout(() => {
        let userType = null
        if (user.idType) {
          userType = parseInt(user.idType, 10)
        } else if (user.typeUtilisateur && user.typeUtilisateur.id_type) {
          userType = parseInt(user.typeUtilisateur.id_type, 10)
        }
        if (userType === 2) {
          navigate('/admin/')
        } else {
          navigate('/')
        }
      }, 100)
    } catch (err) {
      setError(err.message || 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setRegisterError('')
    setRegisterSuccess('')
    setRegisterLoading(true)

    if (registerPassword !== registerPasswordConfirm) {
      setRegisterError('Les mots de passe ne correspondent pas')
      setRegisterLoading(false)
      return
    }

    if (registerPassword.length < 6) {
      setRegisterError('Le mot de passe doit contenir au moins 6 caractères')
      setRegisterLoading(false)
      return
    }

    try {
      await api.registerUser({
        nom: registerNom,
        prenom: registerPrenom,
        email: registerEmail,
        telephone: registerTelephone || null,
        motDePasse: registerPassword,
      })

      setRegisterSuccess('Inscription réussie ! Redirection vers la connexion...')
      setTimeout(() => {
        setIsLogin(true)
        setRegisterNom('')
        setRegisterPrenom('')
        setRegisterEmail('')
        setRegisterTelephone('')
        setRegisterPassword('')
        setRegisterPasswordConfirm('')
        setRegisterSuccess('')
      }, 1500)
    } catch (err) {
      setRegisterError(err.message || 'Erreur lors de l\'inscription')
    } finally {
      setRegisterLoading(false)
    }
  }

  const toggleForm = (loginMode) => {
    setIsLogin(loginMode)
    setError('')
    setRegisterError('')
    setRegisterSuccess('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 px-5 py-10 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button className={`flex-1 py-3 font-semibold transition ${isLogin ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-700'}`} onClick={() => toggleForm(true)}>
            Connexion
          </button>
          <button className={`flex-1 py-3 font-semibold transition ${!isLogin ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-700'}`} onClick={() => toggleForm(false)}>
            S'inscrire
          </button>
        </div>

        {isLogin ? (
          <>
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">Connexion</h1>

            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail size={20} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">Mot de passe</label>
                <div className="relative">
                  <Lock size={20} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">S'inscrire</h1>

            {registerError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{registerError}</div>}
            {registerSuccess && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">{registerSuccess}</div>}

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="registerNom" className="block text-sm font-semibold text-gray-700 mb-2">Nom</label>
                  <div className="relative">
                    <User size={20} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      id="registerNom"
                      placeholder="Dupont"
                      value={registerNom}
                      onChange={(e) => setRegisterNom(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="registerPrenom" className="block text-sm font-semibold text-gray-700 mb-2">Prénom</label>
                  <div className="relative">
                    <User size={20} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      id="registerPrenom"
                      placeholder="Jean"
                      value={registerPrenom}
                      onChange={(e) => setRegisterPrenom(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="registerEmail" className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail size={20} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    id="registerEmail"
                    placeholder="votre@email.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="registerTelephone" className="block text-sm font-semibold text-gray-700 mb-2">Téléphone (Optionnel)</label>
                <div className="relative">
                  <Phone size={20} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="tel"
                    id="registerTelephone"
                    placeholder="+33612345678"
                    value={registerTelephone}
                    onChange={(e) => setRegisterTelephone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="registerPassword" className="block text-sm font-semibold text-gray-700 mb-2">Mot de passe</label>
                <div className="relative">
                  <Lock size={20} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type={showRegisterPassword ? 'text' : 'password'}
                    id="registerPassword"
                    placeholder="••••••••"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showRegisterPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="registerPasswordConfirm" className="block text-sm font-semibold text-gray-700 mb-2">Confirmer le mot de passe</label>
                <div className="relative">
                  <Lock size={20} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type={showRegisterPasswordConfirm ? 'text' : 'password'}
                    id="registerPasswordConfirm"
                    placeholder="••••••••"
                    value={registerPasswordConfirm}
                    onChange={(e) => setRegisterPasswordConfirm(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPasswordConfirm(!showRegisterPasswordConfirm)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showRegisterPasswordConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={registerLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {registerLoading ? 'Inscription...' : 'S\'inscrire'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
