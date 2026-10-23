import ProductCard from '../components/ProductCard'
import { productosIniciales } from '../data/adminData'

function Ofertas() {

  const productos =
    JSON.parse(localStorage.getItem('productos')) ||
    productosIniciales


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

          {productosEnOferta.length > 0 ? (

            <div className="product-grid">

              {productosEnOferta.map(producto => (

                <ProductCard
                  key={producto.id}
                  producto={producto}
                />

              ))}

            </div>

          ) : (

            <div className="content-card empty-state">

              <h2>
                No hay ofertas disponibles
              </h2>

              <p>
                En este momento no hay productos marcados como oferta.
              </p>

            </div>

          )}

        </div>

      </section>

    </main>
  )
}

export default Ofertas