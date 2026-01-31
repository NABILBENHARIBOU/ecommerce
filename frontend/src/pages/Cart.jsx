import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../store/CartContext'
import { useState } from 'react'

export default function Cart() {
  const { items, removeFromCart, clearCart, updateQuantity, getTotalPrice } = useCart()
  const [promo, setPromo] = useState('')
  const [discount, setDiscount] = useState(0)
  const navigate = useNavigate()

  const subtotal = getTotalPrice()
  const shipping = subtotal > 0 ? 10 : 0
  const totalBeforeDiscount = subtotal + shipping
  const total = (totalBeforeDiscount * (1 - discount))

  const placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e2e8f0" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="16" fill="%23999" text-anchor="middle" dy=".3em"%3ENon disponible%3C/text%3E%3C/svg%3E'

  function applyPromo() {
    if (!promo) return
    if (promo.trim().toUpperCase() === 'PROMO10') {
      setDiscount(0.10)
    } else {
      setDiscount(0)
      alert('Code promo invalide')
    }
  }

  if (!items.length) return (
    <div className="min-h-[calc(100vh-200px)] p-6 flex flex-col items-center justify-center">
      <h2 className="text-2xl font-semibold mb-4">Votre panier est vide</h2>
      <Link to="/" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Continuer vos achats</Link>
    </div>
  )

  return (
    <div className="min-h-[calc(100vh-200px)] py-10 px-4 md:px-10 bg-gray-50">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Mon Panier ({items.length} articles)</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            {items.map(item => {
              const image = item.image_url && item.image_url.startsWith('/') ? `http://localhost:8080${item.image_url}` : (item.image_url || placeholder)
              return (
                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <img src={image} alt={item.name} className="w-28 h-20 object-cover rounded-md" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">Prix: {item.price.toFixed(2)} €</p>
                    <div className="mt-2 flex items-center gap-2">
                      <label className="text-sm text-gray-600">Quantité</label>
                      <input
                        type="number"
                        min={1}
                        max={item.stock ?? 999}
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value || 1))}
                        className="w-20 px-2 py-1 border rounded-md"
                      />
                      {item.stock !== null && item.stock !== undefined && (
                        <span className="text-sm text-gray-500">/ {item.stock} en stock</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="text-gray-800 font-semibold">{(item.price * item.quantity).toFixed(2)} €</div>
                    <div className="flex gap-2">
                      <button onClick={() => removeFromCart(item.id)} className="px-3 py-1 bg-red-500 text-white rounded-md">Retirer</button>
                    </div>
                  </div>
                </div>
              )
            })}

            <div className="flex items-center gap-4 mt-4">
              <Link to="/" className="px-4 py-2 bg-gray-100 rounded-md">Continuer les achats</Link>
              <button onClick={() => navigate('/checkout')} className="px-4 py-2 bg-blue-600 text-white rounded-md">Passer à la commande</button>
              <button onClick={clearCart} className="px-4 py-2 bg-red-100 text-red-700 rounded-md">Vider le panier</button>
            </div>
          </div>

          <aside className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-4">Récapitulatif</h3>
            <div className="flex justify-between text-gray-700 mb-2"><span>Sous-total</span><span>{subtotal.toFixed(2)} €</span></div>
            <div className="flex justify-between text-gray-700 mb-2"><span>Frais de port</span><span>{shipping.toFixed(2)} €</span></div>
            {discount > 0 && (
              <div className="flex justify-between text-green-700 mb-2"><span>Remise</span><span>-{Math.round(discount * 100)}%</span></div>
            )}
            <div className="flex justify-between font-bold text-gray-900 text-lg mb-4"><span>Total</span><span>{total.toFixed(2)} €</span></div>

            <div className="mb-3">
              <label className="text-sm text-gray-700">Code promo</label>
              <div className="flex gap-2 mt-1">
                <input value={promo} onChange={(e) => setPromo(e.target.value)} className="flex-1 px-3 py-2 border rounded-md" placeholder="Code promo" />
                <button onClick={applyPromo} className="px-3 py-2 bg-emerald-600 text-white rounded-md">Appliquer</button>
              </div>
            </div>

            <button onClick={() => navigate('/checkout')} className="w-full py-3 bg-blue-600 text-white rounded-md">Valider et payer</button>
          </aside>
        </div>
      </div>
    </div>
  )
}
