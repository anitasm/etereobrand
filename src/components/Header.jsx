import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/useCart'

const navItems = [
  { to: '/', label: 'Inicio' },
  { to: '/catalogo', label: 'Colección' },
]

function Header() {
  const { totalItems } = useCart()

  return (
    <header className="site-header">
      <div className="brand">
        <Link to="/">(Et)éreo</Link>
      </div>
      <nav aria-label="Principal">
        <ul>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <Link to="/carrito" className="cart-pill" aria-label={`Artículos en carrito: ${totalItems}`}>
        <span className="cart-icon" aria-hidden="true">🛒</span>
        <span className="badge">{totalItems}</span>
      </Link>
    </header>
  )
}

export default Header
