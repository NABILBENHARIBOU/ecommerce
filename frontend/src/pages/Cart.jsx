import { Link } from 'react-router-dom'
import { useCart } from '../store/CartContext'

export default function Cart() {
  const { items, removeFromCart, clearCart } = useCart()

  const total = items.reduce((s, it) => s + it.quantity * it.price, 0)

  if (!items.length) return (
    <div style={{padding:20}}>
      <h2>Votre panier est vide</h2>
      <Link to="/">Continuer vos achats</Link>
    </div>
  )

  return (
    <div style={{padding:20}}>
      <h2>Panier</h2>
      <ul>
        {items.map(i => (
          <li key={i.id} style={{marginBottom:8}}>
            {i.name} — {i.quantity} × {i.price.toFixed(2)} €
            <button onClick={() => removeFromCart(i.id)} style={{marginLeft:8}}>Retirer</button>
          </li>
        ))}
      </ul>
      <div style={{marginTop:12}}>
        <strong>Total: {total.toFixed(2)} €</strong>
      </div>
      <div style={{marginTop:12}}>
        <Link to="/checkout"><button>Payer</button></Link>
        <button onClick={clearCart} style={{marginLeft:8}}>Vider le panier</button>
      </div>
    </div>
  )
}
