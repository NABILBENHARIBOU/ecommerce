const BASE = 'http://localhost:8080';

// Fonction utilitaire pour les en-têtes d'authentification
function getAuthHeader() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  if (token) {
    console.log('[JWT TOKEN]', token);
  } else {
    console.warn('[JWT TOKEN ABSENT]');
  }
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  // Ajouter le header X-User-Type pour les opérations admin
  if (user) {
    try {
      const userData = JSON.parse(user);
      const idType = userData.idType || (userData.typeUtilisateur?.id_type);
      if (idType) {
        headers['X-User-Type'] = String(idType);
      }
    } catch (e) {
      // Ignorer les erreurs de parsing
    }
  }

  return headers;
}

// Fonction de requête générique
async function request(path, { method = 'GET', body, headers = {}, noJson = false } = {}) {
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...headers,
    },
  };

  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(BASE + path, opts);
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      if (data && data.message) msg = data.message;
      else if (typeof data === 'string') msg = data;
    } catch (e) {
      // ignore parse errors
    }
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }

  if (noJson) return res;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// Objet API unifié
const api = {
  // Méthodes de base
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  del: (path) => request(path, { method: 'DELETE' }),

  // Upload d'image (spécial car FormData)
  uploadProductImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    // Correction : utiliser le bon endpoint backend
      const res = await fetch(BASE + '/api/produits/upload', {
      method: 'POST',
      headers: {
        ...getAuthHeader(), // pas de Content-Type, fetch le définit automatiquement
      },
      body: formData,
    });
    if (!res.ok) {
      let msg = `HTTP ${res.status}`;
      try {
        const data = await res.json();
        if (data && data.message) msg = data.message;
        else if (typeof data === 'string') msg = data;
      } catch (e) {}
      throw new Error(msg);
    }
    return await res.json();
  },

  // Auth
  loginUser: (email, password) => api.post('/api/auth/login', { email, password }),

  // Utilisateurs
  registerUser: (user) => api.post('/api/utilisateurs', user),
  getUserByEmail: (email) => api.get(`/api/utilisateurs/email/${encodeURIComponent(email)}`),
  getAllUsers: () => api.get('/api/utilisateurs'),
  deleteUser: (id) => api.del(`/api/utilisateurs/${id}`),
  updateUser: (id, user) => api.put(`/api/utilisateurs/${id}`, user),

  // Contact
  sendContact: (payload) => api.post('/api/contact', payload),

  // Produits
  getAllProducts: () => api.get('/api/produits'),
  getProduct: (id) => api.get(`/api/produits/${id}`),
  createProduct: (product) => api.post('/api/produits', product),
  updateProduct: (id, product) => api.put(`/api/produits/${id}`, product),
  deleteProduct: (id) => api.del(`/api/produits/${id}`),

  // Catégories
  getAllCategories: () => api.get('/api/categories'),
  createCategory: (category) => api.post('/api/categories', category),

  // Commandes
  getAllOrders() { return api.get('/api/commandes'); },
  getOrderById: (id) => api.get(`/api/commandes/${id}`),
  getOrdersByUser: (userId) => api.get(`/api/commandes/utilisateur/${userId}`),
  createOrder: (orderData) => api.post('/api/commandes', orderData),
  updateOrderStatus: (orderId, statusId) => api.put(`/api/commandes/${orderId}/statut/${statusId}`),

  // Paiements
  createPaymentForOrder: (orderId, modePaiementId, paymentData) => api.post(`/api/paiements/commande/${orderId}/mode/${modePaiementId}`, paymentData),
};

export default api;