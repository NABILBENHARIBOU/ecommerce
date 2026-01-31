import { NavLink, Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../store/AuthContext';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ChevronDown,
  Users,
  User,
  LogOut,
  Bell,
  BarChart3,
  Settings,
  Home,
  Layers,
} from 'lucide-react';

export default function AdminHeader() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { logout } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: Package, label: 'Produits', href: '/admin/products' },
    { icon: Layers, label: 'Catégories', href: '/admin/categories' },
    { icon: ShoppingCart, label: 'Commandes', href: '/admin/orders' },
    { icon: Users, label: 'Clients', href: '/admin/users' },
    { icon: BarChart3, label: 'Stats', href: '/admin/stats' },
    { icon: Settings, label: 'Paramètres', href: '/admin/settings' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo et Nav */}
          <div className="flex items-center flex-1">
            <Link to="/admin" className="flex items-center shrink-0">
              <Package className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                NAKADouka 
              </span>
            </Link>

            <nav className="hidden lg:flex ml-10 space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.label}
                    to={item.href}
                    // "end" empêche le Dashboard d'être actif pour toutes les routes commençant par /admin
                    end={item.href === '/admin'}
                    className={({ isActive }) => `
                      flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${isActive 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}
                    `}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
  
            <button className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="h-6 w-6" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold shadow-sm">
                  A
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

                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20 animate-in fade-in zoom-in duration-100">
                    <Link
                      to="/admin/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="h-4 w-4 mr-3 text-gray-400" />
                      Mon profil
                    </Link>
                    
                    <Link
                      to="/admin/settings"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Settings className="h-4 w-4 mr-3 text-gray-400" />
                      Paramètres
                    </Link>

                    <hr className="my-1 border-gray-100" />

                    <Link
                      to="/"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Home className="h-4 w-4 mr-3 text-gray-400" />
                      Accueil client
                    </Link>

                    <hr className="my-1 border-gray-100" />

                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        logout();
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
          </div>
        </div>
      </div>
    </header>
  );
}