import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  // 1. Initialisation : On essaie de récupérer le panier stocké au chargement
  const [items, setItems] = useState(() => {
    const savedCart = localStorage.getItem('nakadouka_cart')
    return savedCart ? JSON.parse(savedCart) : []
  })

  // 2. Persistance : Chaque fois que 'items' change, on sauvegarde dans localStorage
  useEffect(() => {
    localStorage.setItem('nakadouka_cart', JSON.stringify(items))
  }, [items])

  function addToCart(product) {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id)
      const maxStock = product.stock ?? existing?.stock ?? Infinity
      if (existing) {
        if (existing.quantity >= maxStock) {
          // already at max stock, do nothing
          return prev
        }
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        image_url: product.image_url, 
        quantity: 1,
        stock: Number.isFinite(maxStock) ? maxStock : null
      }]
    })
  }

  function updateQuantity(id, newQuantity) {
    if (newQuantity < 1) return
    setItems(prev => 
      prev.map(item => {
        if (item.id !== id) return item
        const max = item.stock ?? Infinity
        const qty = Math.min(newQuantity, max)
        return { ...item, quantity: qty }
      })
    )
  }

  function removeFromCart(id) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  function clearCart() {
    setItems([])
  }

  function getTotalPrice() {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  return (
    <CartContext.Provider value={{ 
      items, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      updateQuantity, 
      getTotalPrice 
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}