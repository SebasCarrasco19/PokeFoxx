
import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'

function Productos() {

  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const [busqueda, setBusqueda] = useState('')
  const [juego, setJuego] = useState('')
  const [soloOfertas, setSoloOfertas] = useState(false)

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
            'El servidor entregó un formato de productos incorrecto.'
          )
        }

        // Adaptar la categoría para ProductCard
        const productosAdaptados = datos.map(producto => ({
          ...producto,
          category:
            producto.categoria?.name ||
            producto.category ||
            'TCG'
        }))

        setProductos(productosAdaptados)

      } catch (error) {

        if (error.name !== 'AbortError') {
          setError(
            error.message ||
            'No fue posible cargar el catálogo.'
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

  const productosFiltrados = productos.filter(producto => {

    const coincideBusqueda =
      (producto.name || '')
        .toLowerCase()
        .includes(busqueda.toLowerCase())

    const coincideJuego =
      juego === '' || producto.game === juego

    const coincideOferta =
      !soloOfertas || producto.onSale

    return (
      coincideBusqueda &&
      coincideJuego &&
      coincideOferta
    )
  })

  return (
    <main>

      <section className="page-header">

        <div className="container">

          <span className="eyebrow">
            Catálogo
          </span>

          <h1>Productos</h1>

          <p>
            Encuentra cartas, sobres, mazos y accesorios para tu colección.
          </p>

        </div>

      </section>

      <section className="section catalog-section">

        <div className="container">

          <div className="catalog-toolbar">

            <div className="form-group catalog-search">

              <label htmlFor="busqueda">
                Buscar producto
              </label>

              <input
                id="busqueda"
                type="text"
                placeholder="Buscar por nombre..."
                value={busqueda}
                onChange={event =>
                  setBusqueda(event.target.value)
                }
              />

            </div>

            <div className="form-group">

              <label htmlFor="juego">
                Juego
              </label>

              <select
                id="juego"
                value={juego}
                onChange={event =>
                  setJuego(event.target.value)
                }
              >

                <option value="">
                  Todos
                </option>

                <option value="Pokémon">
                  Pokémon
                </option>

                <option value="One Piece">
                  One Piece
                </option>

                <option value="Magic: The Gathering">
                  Magic: The Gathering
                </option>

              </select>

            </div>

            <label className="offer-filter">

              <input
                type="checkbox"
                checked={soloOfertas}
                onChange={event =>
                  setSoloOfertas(event.target.checked)
                }
              />

              Solo ofertas

            </label>

          </div>

          {cargando && (
            <div className="catalog-results-row">
              <p>Cargando productos...</p>
            </div>
          )}

          {error && (
            <div className="form-message error">
              ⚠️ {error}
            </div>
          )}

          {!cargando && !error && (
            <>

              <div className="catalog-results-row">

                <p>
                  {productosFiltrados.length} producto(s) encontrado(s)
                </p>

              </div>

              <div className="product-grid">

                {productosFiltrados.map(producto => (
                  <ProductCard
                    key={producto.id}
                    producto={producto}
                  />
                ))}

              </div>

              {productosFiltrados.length === 0 && (
                <p>
                  No se encontraron productos.
                </p>
              )}

            </>
          )}

        </div>

      </section>

    </main>
  )
}

export default Productos
