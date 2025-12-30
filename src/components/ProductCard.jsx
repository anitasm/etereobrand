import { Link } from 'react-router-dom'

export function ProductCard({ product }) {
  const categoryLabel = product.category
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return (
    <article className="product-card">
      <Link to={`/producto/${product.id}`}>
        <div className="product-media">
          <img src={product.image} alt={product.name} loading="lazy" />
        </div>
        <div className="product-info">
          <p className="eyebrow">Buzo cápsula</p>
          <h3>{product.name}</h3>
          <p className="price">${product.price.toLocaleString('es-AR')}</p>
          <p className="muted category">{categoryLabel}</p>
        </div>
      </Link>
    </article>
  )
}

export default ProductCard