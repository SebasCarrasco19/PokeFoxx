import { productosIniciales as productos } from '../data/adminData'
import { Link, useParams } from 'react-router-dom'

function DetalleProducto() {

  const { id } = useParams()


  const producto = productos.find(
    producto => producto.id === Number(id)
  )

  if (!producto) {
    return (
      <main className="container section">

        <div className="content-card empty-state">

          <h2>Producto no encontrado</h2>

          <p>
            El producto solicitado no existe.
          </p>

          <Link
            className="btn btn-primary"
            to="/productos"
          >
            Volver a productos
          </Link>

        </div>

      </main>
    )
  }

  return (
    <main>

      <section className="page-header">

        <div className="container">

          <div className="breadcrumb">
            <Link to="/">Inicio</Link>
            {' / '}
            <Link to="/productos">Productos</Link>
            {' / '}
            {producto.name}
          </div>

        </div>

      </section>


      <section className="section">

        <div className="container">

          <div className="product-detail">

            <div className="product-detail-media">

              <img src={producto.image} alt={producto.name} />

            </div>


            <div className="product-detail-info">

              <span className="eyebrow">
                {producto.category}
              </span>

              <h1>
                {producto.name}
              </h1>

              <p>
                {producto.description}
              </p>

              <div className="price-large">
                ${producto.price.toLocaleString('es-CL')}
              </div>

              <p className="stock">
                Stock disponible: {producto.stock}
              </p>

              <div className="quantity-row">

                <div className="form-group">

                  <label htmlFor="cantidad">
                    Cantidad
                  </label>

                  <input
                    id="cantidad"
                    type="number"
                    min="1"
                    max={producto.stock}
                    defaultValue="1"
                  />

                </div>

              </div>

              <button
                className="btn btn-primary"
                type="button"
              >
                Añadir al carrito
              </button>

            </div>

          </div>

        </div>

      </section>

    </main>
  )
}

export default DetalleProducto