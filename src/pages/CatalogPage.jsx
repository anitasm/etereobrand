import { useEffect, useState } from 'react'
import { ProductCard } from '../components/ProductCard'
import { fetchProducts } from '../data/productService'

export function CatalogPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    const loadProducts = async () => {
      try {
        const data = await fetchProducts()
        if (active) setProducts(data)
      } catch (err) {
        console.error('Error al cargar productos', err)
        if (active) setError('No pudimos cargar el catálogo. Probá nuevamente más tarde.')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadProducts()

    return () => {
      active = false
    }
  }, [])

  return (
    <div className="page">
      <section className="section">
        <div className="section-header">
          <p className="eyebrow">Colección</p>
          <h2>Buzos cápsula (Et)éreo</h2>
          <p className="muted">Seleccioná un modelo para ver su ficha y sumarlo a tu carrito.</p>
        </div>
        {loading && <p className="muted">Cargando productos...</p>}
        {error && <p className="muted error">{error}</p>}
        <div className="grid products">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}