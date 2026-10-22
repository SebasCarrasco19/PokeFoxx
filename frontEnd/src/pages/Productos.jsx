import { useState } from 'react'
import ProductCard from '../components/ProductCard'
import { productosIniciales } from '../data/adminData'

function Productos() {

  const [productos] = useState(() => {

    const productosGuardados = localStorage.getItem('productos')

    if (productosGuardados) {
      return JSON.parse(productosGuardados)
    }

    localStorage.setItem(
      'productos',
      JSON.stringify(productosIniciales)
    )

    return productosIniciales
  })

  const [busqueda, setBusqueda] = useState('')
  const [juego, setJuego] = useState('')
  const [soloOfertas, setSoloOfertas] = useState(false)

  const productosFiltrados = productos.filter(producto => {

    const coincideBusqueda =
      producto.name
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

        </div>

      </section>

    </main>
  )
}

export default Productos