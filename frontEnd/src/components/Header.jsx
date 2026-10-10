import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

function Header() {

  const [menuAbierto, setMenuAbierto] = useState(false)

  function cerrarMenu() {
    setMenuAbierto(false)
  }

  return (
    <header className="site-header">

      <div className="container header-inner">

        <Link
          className="logo"
          to="/"
          onClick={cerrarMenu}
        >
          <img
            src="/assets/img/logo.svg"
            alt="PokeFoxx"
          />
        </Link>

        <button
          className="nav-toggle"
          type="button"
          aria-label="Abrir menú"
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          ☰
        </button>

        <nav
          className={`main-nav ${menuAbierto ? 'open' : ''}`}
          aria-label="Navegación principal"
        >

          <NavLink
            to="/"
            end
            onClick={cerrarMenu}
          >
            Inicio
          </NavLink>

          <NavLink
            to="/productos"
            onClick={cerrarMenu}
          >
            Productos
          </NavLink>

          <NavLink
            to="/categorias"
            onClick={cerrarMenu}
          >
            Categorías
          </NavLink>
          
          <NavLink
            to="/nosotros"
            onClick={cerrarMenu}
          >
            Nosotros
          </NavLink>

          <NavLink
            to="/blog"
            onClick={cerrarMenu}
          >
            Blog
          </NavLink>

          <NavLink
            to="/contacto"
            onClick={cerrarMenu}
          >
            Contacto
          </NavLink>

        </nav>

        <div className="header-actions">

          <Link
            className="session-link"
            to="/login"
          >
            Iniciar sesión
          </Link>

          <Link
            className="cart-link"
            to="/carrito"
          >
            🛒 Carrito
            {' '}
            <span className="cart-count">
              0
            </span>
          </Link>

        </div>

      </div>

    </header>
  )
}

export default Header