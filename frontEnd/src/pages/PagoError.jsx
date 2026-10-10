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
              No pudimos procesar el pago
            </h1>

            <p>
              Ocurrió un problema durante el proceso de compra.
            </p>

            <p>
              Puedes intentarlo nuevamente.
            </p>

            <div className="hero-actions">

              <Link
                className="btn btn-primary"
                to="/checkout"
              >
                Intentar nuevamente
              </Link>

              <Link
                className="btn btn-secondary"
                to="/carrito"
              >
                Volver al carrito
              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  )
}

export default PagoError