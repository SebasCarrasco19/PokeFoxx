import { useState } from 'react'
import ProductCard from '../components/ProductCard'

function Productos() {

  const productos = [
    {
      id: 1,
      name: 'Ascended Heroes Booster Pack - ME: Ascended Heroes (ASC)',
      price: 7990,
      originalPrice: 9990,
      onSale: true,
      game: 'Pokémon',
      stock: 8,
      category: 'Sobres sellados',
      image: '/assets/img/sobre-pk.png'
    },
    {
      id: 2,
      name: 'Donquixote Doflamingo',
      price: 7500,
      originalPrice: 10000,
      onSale: false,
      game: 'One Piece',
      stock: 5,
      category: 'Cartas individuales',
      image: '/assets/img/doffy.png'
    },
    {
      id: 3,
      name: 'Monkey.D.Luffy (OP05-119)',
      price: 600000,
      originalPrice: 800000,
      onSale: true,
      game: 'One Piece',
      stock: 10,
      category: 'Cartas individuales',
      image: '/assets/img/Monkey.D.Luffy (OP05-119).jpg'
    },
    {
      id: 4,
      name: 'Pikachu - 042/128 - ME: 30th Celebration (30C)',
      price: 4990,
      originalPrice: 4990,
      onSale: false,
      game: 'Pokémon',
      stock: 24,
      category: 'Sobres sellados',
      image: '/assets/img/pikachu.png'
    }
  ]

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