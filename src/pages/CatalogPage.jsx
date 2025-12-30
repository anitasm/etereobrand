import { useEffect, useState } from 'react'
import { ProductCard } from '../components/ProductCard'
import { fetchProducts } from '../data/productService'

export function CatalogPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState('')

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

  const normalizedFilter = categoryFilter.trim().toLowerCase()
  const filteredProducts = products.filter((product) => {
    if (!normalizedFilter) return true
    return product.category.toLowerCase().includes(normalizedFilter)
  })

  return (
    <div className="page">
      <section className="section">
        <div className="section-header">
          <p className="eyebrow">Colección</p>
          <h2>Buzos cápsula (Et)éreo</h2>
          <p className="muted">Seleccioná un modelo para ver su ficha y sumarlo a tu carrito.</p>
        </div>
        <div className="catalog-filters">
          <label htmlFor="category-filter">Filtrar por categoría</label>
          <input
            id="category-filter"
            type="search"
            placeholder="Hoodies, polerones o limited edition"
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          />
          <div className="filter-hints">
            {['hoodies', 'polerones', 'limited edition'].map((category) => (
              <button
                key={category}
                type="button"
                className={`pill ${normalizedFilter === category ? 'active' : ''}`}
                onClick={() => setCategoryFilter(category)}
              >
                {category}
              </button>
            ))}
            <button
              type="button"
              className={`pill ghost ${normalizedFilter === '' ? 'active' : ''}`}
              onClick={() => setCategoryFilter('')}
            >
              Todas
            </button>
          </div>
        </div>
        {loading && <p className="muted">Cargando productos...</p>}
        {error && <p className="muted error">{error}</p>}
        <div className="grid products">
          {filteredProducts.length === 0 && !loading && !error && (
            <p className="muted">No encontramos productos para esa categoría.</p>
          )}
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}