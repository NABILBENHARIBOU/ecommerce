import React, { useState } from 'react';
import { User, Bell, Lock, CreditCard, MapPin, Save, LogOut } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const menuItems = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'security', label: 'Sécurité', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Paiement & Adresses', icon: CreditCard },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar de Navigation */}
        <aside className="w-full md:w-64 space-y-2">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
            <p className="text-sm text-gray-500">Gérez votre compte et vos préférences</p>
          </div>
          
          <nav>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>

          <hr className="my-6 border-gray-200" />
          
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </aside>

        {/* Zone de Contenu Principal */}
        <main className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
          
          {/* Section Profil */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Informations personnelles</h2>
                <p className="text-sm text-gray-500">Mettez à jour vos coordonnées publiques.</p>
              </div>

              <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-2xl font-bold">
                  JD
                </div>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                  Changer la photo
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Prénom</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" defaultValue="Jean" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Nom</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" defaultValue="Dupont" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" defaultValue="jean.dupont@example.com" />
                </div>
              </div>
            </div>
          )}

          {/* Section Sécurité */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Sécurité du compte</h2>
                <p className="text-sm text-gray-500">Modifiez votre mot de passe et activez la double authentification.</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Mot de passe</p>
                    <p className="text-sm text-gray-500">Dernière modification il y a 3 mois</p>
                  </div>
                  <button className="text-blue-600 font-medium hover:underline">Modifier</button>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Authentification à deux facteurs</p>
                    <p className="text-sm text-gray-500">Ajoutez une couche de sécurité supplémentaire</p>
                  </div>
                  <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 cursor-pointer">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bouton de sauvegarde global */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              <Save className="w-4 h-4" />
              Enregistrer les modifications
            </button>
          </div>

        </main>
      </div>
    </div>
  );
};

export default Settings;