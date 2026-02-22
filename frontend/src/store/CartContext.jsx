import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth ? useAuth() : { isAuthenticated: false };
  // 1. Initialisation : On essaie de récupérer le panier stocké au chargement
  const [items, setItems] = useState(() => {
    const savedCart = localStorage.getItem('nakadouka_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isSyncing, setIsSyncing] = useState(false);

  // 2. Persistance : Chaque fois que 'items' change, on sauvegarde dans localStorage
  useEffect(() => {
    localStorage.setItem('nakadouka_cart', JSON.stringify(items))
  }, [items])

  // 3. Synchronisation avec le backend après connexion/déconnexion
  useEffect(() => {
    async function fetchAndMergeCart() {
      const token = localStorage.getItem('token');
      if (!token) {
        setItems([]); // Déconnexion : vider le panier local
        return;
      }
      try {
        setIsSyncing(true);
        let panierDTO = null;
        try {
          panierDTO = await api.get('/api/paniers/utilisateur/me/dto');
        } catch (e) {
          if (e.status === 404) {
            panierDTO = null;
          } else {
            throw e;
          }
        }
        // Enrichir chaque item avec les infos produit
        let serverItems = [];
        if (panierDTO && Array.isArray(panierDTO.lignesPanier)) {
          serverItems = await Promise.all(
            panierDTO.lignesPanier.map(async ligne => {
              const produit = await api.get(`/api/produits/${ligne.idProduit}`);
              return {
                idProduit: ligne.idProduit,
                quantity: ligne.quantite,
                name: produit.nom || produit.name || 'Produit',
                price: produit.prix ?? produit.price ?? 0,
                image_url: produit.imageUrl && produit.imageUrl.startsWith('/')
                  ? `http://localhost:8080${produit.imageUrl}`
                  : (produit.imageUrl || produit.image_url || produit.image || '')
              };
            })
          );
        }

        // Fusionner le panier local (avant connexion) avec le panier serveur
        const savedCart = localStorage.getItem('nakadouka_cart');
        let localItems = savedCart ? JSON.parse(savedCart) : [];
        // Si le panier serveur est vide mais le local non, on push le local vers le serveur
        if (serverItems.length === 0 && localItems.length > 0) {
          setItems(localItems);
          // Envoi du panier local au backend (remplace les lignes du panier)
          await api.put('/api/paniers/me', {
            lignesPanier: localItems.map(item => ({
              produit: { idProduit: item.idProduit },
              quantite: item.quantity
            }))
          });
        } else {
          setItems(serverItems);
        }
      } catch (e) {
        setItems([]); // Si erreur (ex: pas de panier), vider le panier local
      } finally {
        setIsSyncing(false);
      }
    }
    fetchAndMergeCart();
  }, [isAuthenticated]);

  // 4. Synchronisation backend à chaque modification (si connecté)
  useEffect(() => {
    async function syncCartToBackend() {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        setIsSyncing(true);
        await api.put('/api/paniers/me/dto', {
          lignesPanier: items.map(item => ({
            idProduit: item.idProduit,
            quantite: item.quantity
          }))
        });
      } catch (e) {
        // Optionnel: afficher une notification d'échec
      } finally {
        setIsSyncing(false);
      }
    }
    if (isAuthenticated) syncCartToBackend();
  }, [items, isAuthenticated]);

  async function addToCart(product) {
    setItems(prev => {
      const existing = prev.find(i => i.idProduit === (product.idProduit ?? product.id));
      if (existing) {
        // Si déjà présent, on incrémente la quantité
        return prev.map(i => i.idProduit === (product.idProduit ?? product.id) ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, {
        idProduit: product.idProduit ?? product.id,
        quantity: 1
      }];
    });
    // Ajout direct côté backend si connecté
    if (isAuthenticated) {
      try {
        await api.post('/api/paniers/me/produits', {
          idProduit: product.idProduit ?? product.id
        });
      } catch (e) {
        // Optionnel: afficher une notification d'échec
      }
    }
  }

  function updateQuantity(id, newQuantity) {
    if (newQuantity < 1) return;
    setItems(prev => prev.map(item =>
      item.idProduit === id ? { ...item, quantity: newQuantity } : item
    ));
    // Synchronisation backend automatique via useEffect
  }

  function removeFromCart(id) {
    setItems(prev => prev.filter(i => i.idProduit !== id));
    // Synchronisation backend automatique via useEffect
  }

  function clearCart() {
    setItems([]);
    // Synchronisation backend automatique via useEffect
  }

  function getTotalPrice() {
    // À adapter si tu veux afficher le prix : il faut récupérer les infos produit (prix) côté affichage
    return 0;
  }

  // Empêcher l'accès au panier si non connecté
  const contextValue = isAuthenticated
    ? { items, addToCart, removeFromCart, clearCart, updateQuantity, getTotalPrice, isSyncing }
    : { items: [], addToCart: () => {}, removeFromCart: () => {}, clearCart: () => {}, updateQuantity: () => {}, getTotalPrice: () => 0, isSyncing: false };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}