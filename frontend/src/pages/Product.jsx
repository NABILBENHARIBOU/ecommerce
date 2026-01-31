import { useParams } from 'react-router-dom'
import products from '../data/products'
import { useCart } from '../store/CartContext'

export default function Product() {
  const { id } = useParams()
  const product = products.find(p => p.id === id)
  const { addToCart } = useCart()

  if (!product) return <div style={{padding:20}}>Produit introuvable</div>

  return (
    <div style={{padding:20}}>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <strong>{product.price.toFixed(2)} €</strong>
      <div style={{marginTop:12}}>
        <button onClick={() => addToCart(product)}>Ajouter au panier</button>
      </div>
    </div>
  )
}
