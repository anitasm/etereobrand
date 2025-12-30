import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCart } from '../context/useCart'
import { fetchProductById } from '../data/productService'

export function ProductDetailPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedSize, setSelectedSize] = useState('')

  useEffect(() => {
    let active = true

    const loadProduct = async () => {
      setLoading(true)
      try {
        const data = await fetchProductById(productId)
        if (!active) return

        if (!data) {
          setError('Producto no encontrado')
          setProduct(null)
          return
        }

        setProduct(data)
        setSelectedSize(data.sizes?.[0] || '')
        setError(null)
      } catch (err) {
        console.error('Error al obtener producto', err)
        if (active) setError('No pudimos cargar el producto. Intentalo nuevamente.')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadProduct()

    return () => {
      active = false
    }
  }, [productId])

  const handleAdd = () => {
    if (!product) return

    addItem(product, quantity, { size: selectedSize || product.sizes?.[0] })
    navigate('/carrito')
  }

  if (loading) {
    return (
      <div className="page">
        <section className="section">
          <p className="muted">Cargando producto...</p>
        </section>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="page">
        <section className="section">
          <h2>Producto no encontrado</h2>
          <p className="muted">Volvé al catálogo para elegir otro modelo.</p>
          <button className="button ghost" onClick={() => navigate('/catalogo')}>
            Ir al catálogo
          </button>
        </section>
      </div>
    )
  }

  return (
    <div className="page">
      <section className="product-detail">
        <div className="product-gallery">
          {product.gallery.map((src) => (
            <img key={src} src={src} alt={product.name} loading="lazy" />
          ))}
        </div>
        <div className="product-copy">
          <p className="eyebrow">Buzo cápsula</p>
          <h1>{product.name}</h1>
          <p className="price">${product.price.toLocaleString('es-AR')}</p>
          <p>{product.description}</p>
          <div className="pill-row">
            <div>
              <p className="eyebrow">Seleccioná tu talle</p>
              <div className="pills selectable">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`pill ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                    aria-pressed={selectedSize === size}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="actions">
            <label className="quantity">
              Cantidad
              <input
                type="number"
                min="1"
                max="10"
                value={quantity}
                onChange={(event) => setQuantity(Number(event.target.value))}
              />
            </label>
            <button className="button primary" onClick={handleAdd}>
              Añadir al carrito
            </button>
            <button className="button ghost" onClick={() => navigate('/catalogo')}>
              Volver al catálogo
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}