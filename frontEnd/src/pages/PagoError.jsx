import { Link } from 'react-router-dom'

function PagoError() {
  return (
    <main>

      <section className="section">

        <div className="container">

          <div className="content-card empty-state">

            <span className="eyebrow">
              Compra
            </span>

            <h1>
              No pudimos completar la compra
            </h1>

            <p>
              Uno o más productos de tu carrito ya no tienen
              stock suficiente para completar el pedido.
            </p>

            <p>
              Tu carrito se mantiene guardado para que puedas
              revisarlo e intentarlo nuevamente.
            </p>

            <div className="hero-actions">

              <Link
                className="btn btn-primary"
                to="/carrito"
              >
                Revisar carrito
              </Link>

              <Link
                className="btn btn-secondary"
                to="/productos"
              >
                Ver productos
              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  )
}

export default PagoError