import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/useCart'
import { registerSale } from '../data/productService'

export function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart()
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [error, setError] = useState(null)

  const handleCheckout = async () => {
    setSaving(true)
    setFeedback(null)
    setError(null)

    try {
      const saleId = await registerSale({ items, totalItems, totalPrice })
      setFeedback(`Venta registrada (#${saleId})`)
      clearCart()
    } catch (err) {
      console.error('Error al registrar la venta', err)
      setError('No pudimos registrar tu compra. Intentá nuevamente.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page">
      <section className="section">
        <div className="section-header">
          <p className="eyebrow">Carrito</p>
          <h2>Resumen de tu selección</h2>
          <p className="muted">Gestioná las cantidades antes de confirmar.</p>
        </div>

        {items.length === 0 ? (
          <div className="empty">
            <p>Tu carrito está vacío.</p>
            <Link className="button primary" to="/catalogo">
              Volver al catálogo
            </Link>
            {feedback && <p className="muted">{feedback}</p>}
          </div>
        ) : (
          <div className="cart-layout">
            <ul className="cart-list">
              {items.map((item) => (
                <li key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} loading="lazy" />
                  <div>
                    <p className="eyebrow">Buzo cápsula</p>
                    <h3>{item.name}</h3>
                    <p className="muted">{item.colors.join(' · ')}</p>
                    <p className="price">${item.price.toLocaleString('es-AR')}</p>
                    <div className="cart-actions">
                      <label>
                        Cantidad
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={item.quantity}
                          onChange={(event) => updateQuantity(item.id, Number(event.target.value))}
                        />
                      </label>
                      <button className="button ghost" onClick={() => removeItem(item.id)}>
                        Quitar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <aside className="cart-summary">
              <h3>Detalle</h3>
              <p>
                {totalItems} {totalItems === 1 ? 'artículo' : 'artículos'}
              </p>
              <p className="price">Total: ${totalPrice.toLocaleString('es-AR')}</p>
              <button className="button primary" onClick={handleCheckout} disabled={saving}>
                {saving ? 'Guardando...' : 'Confirmar y vaciar'}
              </button>
              <Link className="button ghost" to="/catalogo">
                Seguir comprando
              </Link>
              {feedback && <p className="muted">{feedback}</p>}
              {error && <p className="muted error">{error}</p>}
            </aside>
          </div>
        )}
      </section>
    </div>
  )
}