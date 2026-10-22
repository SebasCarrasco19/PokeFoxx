import { useEffect, useState } from 'react'
import {
  Link,
  NavLink,
  useLocation
} from 'react-router-dom'

function Header() {

  const [menuAbierto, setMenuAbierto] = useState(false)

  const [cantidadCarrito, setCantidadCarrito] =
    useState(0)

  const [sesion, setSesion] =
    useState(null)

  const location = useLocation()


  function cerrarMenu() {

    setMenuAbierto(false)
  }


  function actualizarCarrito() {

    const carrito =
      JSON.parse(localStorage.getItem('carrito')) || []

    const cantidad = carrito.reduce(
      (total, item) =>
        total +
        (item.quantity ?? item.cantidad ?? 1),
      0
    )

    setCantidadCarrito(cantidad)
  }


  function actualizarSesion() {

    const sesionGuardada =
      JSON.parse(localStorage.getItem('sesion'))

    setSesion(sesionGuardada)
  }


  function cerrarSesion() {

    localStorage.removeItem('sesion')

    setSesion(null)

    cerrarMenu()
  }


  useEffect(() => {

    actualizarCarrito()
    actualizarSesion()


    window.addEventListener(
      'carritoActualizado',
      actualizarCarrito
    )


    return () => {

      window.removeEventListener(
        'carritoActualizado',
        actualizarCarrito
      )
    }

  }, [])


  useEffect(() => {

    actualizarSesion()
    actualizarCarrito()

  }, [location.pathname])


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
          onClick={() =>
            setMenuAbierto(!menuAbierto)
          }
        >
          ☰
        </button>


        <nav
          className={`main-nav ${
            menuAbierto ? 'open' : ''
          }`}
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
            to="/ofertas"
            onClick={cerrarMenu}
          >
            Ofertas
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

          {!sesion ? (

            <Link
              className="session-link"
              to="/login"
              onClick={cerrarMenu}
            >
              Iniciar sesión
            </Link>

          ) : (

            <>

              {sesion.role === 'Cliente' ? (

                <Link
                  className="session-link"
                  to="/perfil"
                  onClick={cerrarMenu}
                >
                  Mi perfil
                </Link>

              ) : (

                <Link
                  className="session-link"
                  to="/admin"
                  onClick={cerrarMenu}
                >
                  Administración
                </Link>

              )}


              <Link
                className="session-link"
                to="/"
                onClick={cerrarSesion}
              >
                Cerrar sesión
              </Link>

            </>

          )}


          <Link
            className="cart-link"
            to="/carrito"
            onClick={cerrarMenu}
          >

            🛒 Carrito{' '}

            <span className="cart-count">
              {cantidadCarrito}
            </span>

          </Link>

        </div>

      </div>

    </header>
  )
}

export default Header