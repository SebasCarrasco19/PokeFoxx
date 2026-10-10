import { Link } from 'react-router-dom'

function ProductCard({ producto }) {

  const nombre = producto.nombre ?? producto.name
  const precio = producto.precio ?? producto.price
  const precioOriginal =
    producto.precioOriginal ?? producto.originalPrice

  const categoria =
    producto.categoria ?? producto.category ?? 'TCG'

  const juego =
    producto.juego ?? producto.game ?? 'TCG'

  const oferta =
    producto.oferta ?? producto.onSale ?? false

  const imagen =
    producto.imagen ?? producto.image

  return (
    <article className="product-card">

      <Link
        className="image-link"
        to={`/producto/${producto.id}`}
        aria-label={`Ver ${nombre}`}
      >

        {oferta && (
          <span className="offer-badge">
            Oferta
          </span>
        )}

        {imagen && (
          <img
            src={imagen}
            alt={nombre}
          />
        )}

      </Link>


      <div className="product-card-body">

        <div className="product-card-tags">

          <span className="product-game">
            {juego}
          </span>

          <span className="product-meta">
            {categoria}
          </span>

        </div>


        <h3>
          <Link to={`/producto/${producto.id}`}>
            {nombre}
          </Link>
        </h3>


        <div className="product-price-row">

          {oferta && precioOriginal && (
            <span className="product-price-old">
              ${precioOriginal.toLocaleString('es-CL')}
            </span>
          )}

          <span className="product-price">
            ${precio.toLocaleString('es-CL')}
          </span>

        </div>


        <button
          className="btn btn-primary"
          type="button"
        >
          Añadir al carrito
        </button>

      </div>

    </article>
  )
}

export default ProductCard