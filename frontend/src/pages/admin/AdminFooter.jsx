import { Package, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Heart } from 'lucide-react';

const AdminFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <Package className="h-6 w-6 text-emerald-500" />
              <span className="ml-2 text-lg font-bold text-white">ShopAdmin</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Plateforme d'administration e-commerce complète pour gérer votre activité en ligne.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Accès rapide</h3>
            <ul className="space-y-2">
              <li>
                <a href="admin/" className="text-gray-400 hover:text-emerald-500 transition-colors text-sm">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors text-sm">
                  Produits
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors text-sm">
                  Commandes
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors text-sm">
                  Clients
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors text-sm">
                  Statistiques
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <a href="mailto:support@shopadmin.com" className="text-gray-400 hover:text-emerald-500 transition-colors text-sm flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  support@shopadmin.com
                </a>
              </li>
              <li>
                <a href="tel:+33123456789" className="text-gray-400 hover:text-emerald-500 transition-colors text-sm flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  +221 77 556 03 64
                </a>
              </li>
              <li>
                <div className="text-gray-400 text-sm flex items-start">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Dakar, Sénégal</span>
                </div>
              </li>
            </ul>
          </div>

          {/* System Status */}
          <div>
            <h3 className="text-white font-semibold mb-4">Statut du système</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-emerald-500 mr-2"></div>
                <span className="text-gray-400">Tous les services actifs</span>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-emerald-500 mr-2"></div>
                <span className="text-gray-400">Base de données: OK</span>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-emerald-500 mr-2"></div>
                <span className="text-gray-400">API: Opérationnelle</span>
              </div>
              <a href="#" className="inline-block mt-2 text-emerald-500 hover:text-emerald-400 transition-colors text-xs font-medium">
                Voir l'historique →
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0 flex items-center">
            <span>© {currentYear} NAKADouka. Fait avec</span>
            <Heart className="h-3 w-3 mx-1 text-red-500" />
            <span>pour votre commerce</span>
          </div>

          <div className="flex space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-emerald-500 transition-colors">
              Conditions d'utilisation
            </a>
            <a href="#" className="hover:text-emerald-500 transition-colors">
              Politique de confidentialité
            </a>
            <a href="#" className="hover:text-emerald-500 transition-colors">
              Paramètres des cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
