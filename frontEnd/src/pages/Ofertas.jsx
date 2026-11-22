
import { useEffect, useState } from 'react'

import ProductCard from '../components/ProductCard'

function Ofertas() {

  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  // Obtener productos reales desde Spring Boot
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
            'No fue posible cargar las ofertas.'
          )
        }

        const datos = await respuesta.json()

        if (!Array.isArray(datos)) {
          throw new Error(
            'El servidor devolvió datos incorrectos.'
          )
        }

        if (!controlador.signal.aborted) {
          setProductos(datos)
        }

      } catch (error) {

        if (error.name !== 'AbortError') {

          setError(
            error.message ||
            'No fue posible consultar las ofertas.'
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

  // Mostrar únicamente productos marcados como oferta
  const productosEnOferta = productos.filter(
    producto => producto.onSale === true
  )

  return (
    <main>

      <section className="page-header">

        <div className="container">

          <span className="eyebrow">
            Promociones
          </span>

          <h1>
            Ofertas
          </h1>

          <p>
            Encuentra productos seleccionados con precios especiales.
          </p>

        </div>

      </section>

      <section className="section">

        <div className="container">

          {/* Cargando ofertas */}

          {cargando && (

            <div className="content-card">

              <p>
                Cargando ofertas disponibles...
              </p>

            </div>

          )}

          {/* Error de conexión */}

          {!cargando && error && (

            <div className="content-card">

              <h2>
                No se pudieron cargar las ofertas
              </h2>

              <p className="form-message error">
                {error}
              </p>

            </div>

          )}

          {/* Productos en oferta */}

          {!cargando &&
            !error &&
            productosEnOferta.length > 0 && (

              <div className="product-grid">

                {productosEnOferta.map(producto => (

                  <ProductCard
                    key={producto.id}
                    producto={producto}
                  />

                ))}

              </div>

            )}

          {/* Sin ofertas disponibles */}

          {!cargando &&
            !error &&
            productosEnOferta.length === 0 && (

              <div className="content-card empty-state">

                <h2>
                  No hay ofertas disponibles
                </h2>

                <p>
                  En este momento no hay productos marcados
                  como oferta.
                </p>

              </div>

            )}

        </div>

      </section>

    </main>
  )
}

export default Ofertas
