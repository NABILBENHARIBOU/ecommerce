import { ShoppingCart, User, Menu, Search, X, LogOut, ChevronDown, Settings, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { useCart } from '../store/CartContext';

export default function Header() {
  const { items } = useCart();
  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setIsMenuOpen(false);
    }
  };

  // À placer juste avant le "return" de votre composant Header
  const getInitials = () => {
    if (user?.prenom) {
      return user.prenom.substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "??"; // Si aucune info n'est disponible
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* LOGO : Remplacé <a> par <Link> */}
          <Link to="/" className="flex items-center gap-2">
            <ShoppingCart className="w-8 h-8 text-gray-900" />
            <span className="text-2xl font-bold text-gray-900">NAKADouka</span>
          </Link>

          {/* NAVIGATION DESKTOP : Remplacé <a> par <Link> */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Accueil
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Produits
            </Link>
            <Link to="/categories" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Catégories
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {/* BARRE DE RECHERCHE : Nettoyée (doublon supprimé) */}
            <div className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
              <Search className="w-5 h-5 text-gray-600" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearch}
                className="bg-transparent outline-none text-gray-900 placeholder-gray-500 w-48"
              />
            </div>

            {/* PANIER */}
            <Link 
              to="/panier" 
              className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors flex items-center justify-center"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* AUTHENTIFICATION */}
            {loading ? (
              // Pendant le chargement, afficher un placeholder
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
            ) : isAuthenticated ? (
              <div className="flex items-center gap-3 relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-1 5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold shadow-md shrink-0">
                    <span className="text-sm">
                      {getInitials()}
                    </span>
                  </div>

                  <ChevronDown 
                  className={`h-4 w-4 text-gray-600 transition-transform duration-200 ${
                    isProfileOpen ? 'rotate-180' : ''
                  }`} 
                />
                </button>

                {isProfileOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsProfileOpen(false)}
                  ></div>

                  <div className="absolute right-0 top-full mt-3 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20 animate-in fade-in zoom-in duration-100">
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="h-4 w-4 mr-3 text-gray-400" />
                      Mon profil
                    </Link>

                    {user?.idType === 2 || user?.typeUtilisateur?.id_type === 2 ? (
                      <>
                        <hr className="my-1 border-gray-100" />
                        <Link
                          to="/admin/"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4 mr-3" />
                          Panel Admin
                        </Link>
                      </>
                    ) : null}

                    <hr className="my-1 border-gray-100" />

                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Déconnexion
                    </button>
                  </div>
                </>
              )}
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors">
                <User className="w-5 h-5" />
                <span className="hidden lg:inline">Connexion</span>
              </Link>
            )}

            {/* BOUTON MENU MOBILE */}
            <button
              className="md:hidden p-2 text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* MENU MOBILE : Remplacé <a> par <Link> */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-3">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium py-2">
                Accueil
              </Link>
              <Link to="/products" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium py-2">
                Produits
              </Link>
              <Link to="/categories" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium py-2">
                Catégories
              </Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium py-2">
                Contact
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}