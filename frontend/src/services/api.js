const BASE = 'http://localhost:8080'

function getAuthHeader() {
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user')
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  
  // Ajouter le header X-User-Type pour les opérations admin
  if (user) {
    try {
      const userData = JSON.parse(user)
      const idType = userData.idType || (userData.typeUtilisateur?.id_type)
      if (idType) {
        headers['X-User-Type'] = String(idType)
      }
    } catch (e) {
      // Ignorer les erreurs de parsing
    }
  }
  
  return headers
}

async function request(path, { method = 'GET', body, headers = {}, noJson = false } = {}) {
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...headers,
    },
  }

  if (body) opts.body = JSON.stringify(body)

  const res = await fetch(BASE + path, opts)
  if (!res.ok) {
    // try to get error message from body
    let msg = `HTTP ${res.status}`
    try {
      const data = await res.json()
      if (data && data.message) msg = data.message
      else if (typeof data === 'string') msg = data
    } catch (e) {
      // ignore parse errors
    }
    const err = new Error(msg)
    err.status = res.status
    throw err
  }

  if (noJson) return res
  // handle empty body
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  del: (path) => request(path, { method: 'DELETE' }),

  // higher level helpers
  registerUser: (user) => api.post('/api/utilisateurs', user),
  getUserByEmail: (email) => api.get(`/api/utilisateurs/email/${encodeURIComponent(email)}`),
  sendContact: (payload) => api.post('/api/contact', payload),
}

export default api

// Product-related helpers
api.getAllProducts = () => api.get('/api/produits')
api.getProduct = (id) => api.get(`/api/produits/${id}`)
api.createProduct = (product) => api.post('/api/produits', product)
api.updateProduct = (id, product) => api.put(`/api/produits/${id}`, product)
api.deleteProduct = (id) => api.del(`/api/produits/${id}`)

// Upload image for products (multipart form-data)
api.uploadProductImage = (file) => {
  const form = new FormData()
  form.append('file', file)
  return fetch(BASE + '/api/produits/upload', {
    method: 'POST',
    body: form,
    headers: {
      ...getAuthHeader(),
    },
  }).then(async res => {
    if (!res.ok) {
      const txt = await res.text()
      throw new Error(txt || `HTTP ${res.status}`)
    }
    return res.json()
  })
}

// User management helpers
api.getAllUsers = () => api.get('/api/utilisateurs')
api.getUserById = (id) => api.get(`/api/utilisateurs/${id}`)
api.createUser = (user) => api.post('/api/utilisateurs', user)
api.updateUser = (id, user) => api.put(`/api/utilisateurs/${id}`, user)
api.deleteUser = (id) => api.del(`/api/utilisateurs/${id}`)

// Order management helpers
api.getAllOrders = () => api.get('/api/commandes')
api.getOrderById = (id) => api.get(`/api/commandes/${id}`)
api.getOrdersByUser = (userId) => api.get(`/api/commandes/utilisateur/${userId}`)
api.getOrdersByUserAndStatus = (userId, statusId) => api.get(`/api/commandes/utilisateur/${userId}/statut/${statusId}`)
api.getOrdersByStatus = (statusId) => api.get(`/api/commandes/statut/${statusId}`)
api.createOrder = (order) => api.post('/api/commandes/creer', order)
api.updateOrder = (id, order) => api.put(`/api/commandes/${id}`, order)
api.updateOrderStatus = (id, statusId) => api.put(`/api/commandes/${id}/statut/${statusId}`)
api.deleteOrder = (id) => api.del(`/api/commandes/${id}`)

// Payment helpers
api.getAllPayments = () => api.get('/api/paiements')
api.getPaymentById = (id) => api.get(`/api/paiements/${id}`)
api.getPaymentByOrder = (orderId) => api.get(`/api/paiements/commande/${orderId}`)
api.createPayment = (payment) => api.post('/api/paiements', payment)
api.createPaymentForOrder = (orderId, paymentModeId) => api.post(`/api/paiements/commande/${orderId}/mode/${paymentModeId}`)
api.updatePayment = (id, payment) => api.put(`/api/paiements/${id}`, payment)
api.deletePayment = (id) => api.del(`/api/paiements/${id}`)
// Category management helpers
api.getAllCategories = () => api.get('/api/categories')
api.getCategoryById = (id) => api.get(`/api/categories/${id}`)
api.getCategoryByName = (name) => api.get(`/api/categories/nom/${encodeURIComponent(name)}`)
api.createCategory = (category) => api.post('/api/categories', category)
api.updateCategory = (id, category) => api.put(`/api/categories/${id}`, category)
api.deleteCategory = (id) => api.del(`/api/categories/${id}`)