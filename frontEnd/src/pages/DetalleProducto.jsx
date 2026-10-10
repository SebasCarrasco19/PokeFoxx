import { Link, useParams } from 'react-router-dom'

function DetalleProducto() {

  const { id } = useParams()

  const productos = [
    {
      id: 1,
      nombre: 'Pikachu',
      precio: 15000,
      stock: 5,
      categoria: 'Pokémon',
      descripcion: 'Carta coleccionable de Pokémon.'
    },
    {
      id: 2,
      nombre: 'Monkey D. Luffy',
      precio: 25000,
      stock: 10,
      categoria: 'One Piece',
      descripcion: 'Carta coleccionable de One Piece.'
    },
    {
      id: 3,
      nombre: 'Starter Deck',
      precio: 18990,
      stock: 6,
      categoria: 'Mazos',
      descripcion: 'Mazo inicial preparado para comenzar a jugar.'
    },
    {
      id: 4,
      nombre: 'Protectores TCG',
      precio: 6990,
      stock: 30,
      categoria: 'Accesorios',
      descripcion: 'Protectores para mantener tus cartas en buen estado.'
    }
  ]

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
            {producto.nombre}
          </div>

        </div>

      </section>


      <section className="section">

        <div className="container">

          <div className="product-detail">

            <div className="product-detail-media">

              <div className="empty-state">
                Imagen del producto
              </div>

            </div>


            <div className="product-detail-info">

              <span className="eyebrow">
                {producto.categoria}
              </span>

              <h1>
                {producto.nombre}
              </h1>

              <p>
                {producto.descripcion}
              </p>

              <div className="price-large">
                ${producto.precio.toLocaleString('es-CL')}
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