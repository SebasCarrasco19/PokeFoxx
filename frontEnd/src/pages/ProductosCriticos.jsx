import CriticalProduct from '../components/CriticalProduct'

function ProductosCriticos() {

  const productos = [
    {
      id: 1,
      name: 'Ascended Heroes Booster Pack',
      game: 'Pokémon',
      stock: 8,
      criticalStock: 2,
      category: 'Sobres sellados'
    },
    {
      id: 2,
      name: 'Donquixote Doflamingo',
      game: 'One Piece',
      stock: 5,
      criticalStock: 2,
      category: 'Cartas individuales'
    },
    {
      id: 3,
      name: 'Monkey.D.Luffy (OP05-119)',
      game: 'One Piece',
      stock: 10,
      criticalStock: 3,
      category: 'Cartas individuales'
    },
    {
      id: 8,
      name: 'Sanji',
      game: 'One Piece',
      stock: 3,
      criticalStock: 1,
      category: 'Cartas individuales'
    },
    {
      id: 9,
      name: 'Captain America Steve Rogers',
      game: 'Magic: The Gathering',
      stock: 1,
      criticalStock: 1,
      category: 'Cartas individuales'
    },
    {
      id: 11,
      name: 'Jace the Mind Sculptor',
      game: 'Magic',
      stock: 1,
      criticalStock: 1,
      category: 'Cartas individuales'
    }
  ]

  const productosCriticos = productos.filter(
    producto =>
      producto.criticalStock !== null &&
      producto.criticalStock !== '' &&
      producto.stock <= producto.criticalStock
  )

  return (
    <main>

      <section className="page-header">

        <div className="container">

          <span className="eyebrow">
            Administración
          </span>

          <h1>
            Productos críticos
          </h1>

          <p>
            Productos cuyo stock actual alcanzó o bajó
            de su nivel crítico.
          </p>

        </div>

      </section>


      <section className="section">

        <div className="container">

          <div className="catalog-results-row">

            <p>
              {productosCriticos.length} producto(s) con stock crítico
            </p>

          </div>


          {productosCriticos.length > 0 ? (

            <div className="three-col">

              {productosCriticos.map(producto => (
                <CriticalProduct
                  key={producto.id}
                  producto={producto}
                />
              ))}

            </div>

          ) : (

            <div className="content-card empty-state">

              <h2>
                Sin productos críticos
              </h2>

              <p>
                Todos los productos tienen stock suficiente.
              </p>

            </div>

          )}

        </div>

      </section>

    </main>
  )
}

export default ProductosCriticos