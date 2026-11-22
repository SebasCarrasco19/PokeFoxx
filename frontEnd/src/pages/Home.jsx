
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'

function Home() {

  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {

    const controlador = new AbortController()

    async function cargarProductos() {

      try {

        setCargando(true)
        setError('')

        const respuesta = await fetch(
          'http://localhost:8080/api/v1/productos',
          {
            signal: controlador.signal
          }
        )

        if (!respuesta.ok) {
          throw new Error(
            'No fue posible obtener los productos.'
          )
        }

        const datos = await respuesta.json()

        if (!Array.isArray(datos)) {
          throw new Error(
            'El servidor entregó un formato incorrecto.'
          )
        }

        if (!controlador.signal.aborted) {
          setProductos(datos)
        }

      } catch (error) {

        if (error.name !== 'AbortError') {
          setError(
            error.message ||
            'No fue posible cargar los productos.'
          )
        }

      } finally {

        if (!controlador.signal.aborted) {
          setCargando(false)
        }

      }
    }

    cargarProductos()

    return () => controlador.abort()

  }, [])

  const productosDestacados =
    productos.slice(0, 4)

  const sesion =
    JSON.parse(localStorage.getItem('sesion') || 'null')

  return (
    <main>

      <section className="hero">

        <div className="container hero-grid">

          <div>

            <span className="eyebrow">
              Tienda online TCG
            </span>

            <h1>
              Encuentra cartas y accesorios para tu colección.
            </h1>

            <p className="lead">
              Explora productos de Pokémon, One Piece,
              Magic: The Gathering y otros juegos de cartas
              coleccionables.
            </p>

            <div className="hero-actions">

              <Link
                className="btn btn-primary"
                to="/productos"
              >
                Ver productos
              </Link>

              {!sesion ? (

                <Link
                  className="btn btn-secondary"
                  to="/registro"
                >
                  Crear cuenta
                </Link>

              ) : sesion.role === 'Cliente' ? (

                <Link
                  className="btn btn-secondary"
                  to="/perfil"
                >
                  Mi perfil
                </Link>

              ) : (

                <Link
                  className="btn btn-secondary"
                  to="/admin"
                >
                  Administración
                </Link>

              )}

            </div>

          </div>

          <div className="hero-art">

            <img
              src="/assets/img/hero.jpg"
              alt="Productos TCG"
            />

          </div>

        </div>

      </section>

      <section className="section">

        <div className="container">

          <div className="section-header">

            <div>

              <span className="eyebrow">
                Catálogo
              </span>

              <h2>
                Productos destacados
              </h2>

              <p>
                Algunos productos disponibles en PokeFoxx.
              </p>

            </div>

            <Link
              className="btn btn-secondary"
              to="/productos"
            >
              Ver todos
            </Link>

          </div>

          {cargando ? (

            <div className="content-card empty-state">

              <h2>
                Cargando productos...
              </h2>

            </div>

          ) : error ? (

            <div className="content-card empty-state">

              <h2>
                No fue posible cargar los productos
              </h2>

              <p>{error}</p>

            </div>

          ) : productosDestacados.length > 0 ? (

            <div className="product-grid">

              {productosDestacados.map(producto => (

                <ProductCard
                  key={producto.id}
                  producto={producto}
                />

              ))}

            </div>

          ) : (

            <div className="content-card empty-state">

              <h2>
                No hay productos disponibles
              </h2>

              <p>
                Todavía no hay productos registrados en la tienda.
              </p>

            </div>

          )}

        </div>

      </section>

    </main>
  )
}

export default Home
