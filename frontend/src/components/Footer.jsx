import { ShoppingCart, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart className="w-8 h-8 text-blue-500" />
              <span className="text-xl font-bold">MyShop</span>
            </div>
            <p className="text-gray-400 text-sm">
              Votre destination pour les meilleures offres et produits de qualité.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-gray-400 hover:text-blue-500 transition-colors">
                  Accueil
                </a>
              </li>
              <li>
                <a href="/products" className="text-gray-400 hover:text-blue-500 transition-colors">
                  Produits
                </a>
              </li>
              <li>
                <a href="/categories" className="text-gray-400 hover:text-blue-500 transition-colors">
                  Catégories
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-blue-500 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/faq" className="text-gray-400 hover:text-blue-500 transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/shipping" className="text-gray-400 hover:text-blue-500 transition-colors">
                  Livraison
                </a>
              </li>
              <li>
                <a href="/returns" className="text-gray-400 hover:text-blue-500 transition-colors">
                  Retours
                </a>
              </li>
              <li>
                <a href="/policy" className="text-gray-400 hover:text-blue-500 transition-colors">
                  Politique
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Nous suivre</h3>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
            <div>© {new Date().getFullYear()} MyShop — Tous droits réservés</div>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <a href="/privacy" className="hover:text-blue-500 transition-colors">
                Confidentialité
              </a>
              <a href="/terms" className="hover:text-blue-500 transition-colors">
                Conditions
              </a>
              <a href="/cookies" className="hover:text-blue-500 transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
