import { Link } from 'react-router-dom'

function PagoCorrecto() {
  return (
    <main>

      <section className="section">

        <div className="container">

          <div className="content-card empty-state">

            <span className="eyebrow">
              Compra
            </span>

            <h1>
              Pago realizado correctamente
            </h1>

            <p>
              Ejemplo visual de compra exitosa. No se ha realizado ningún pago.
            </p>

            <p>
              Resumen de ejemplo: 2 productos · Total $15.490.
            </p>

            <div className="hero-actions">

              <Link
                className="btn btn-primary"
                to="/"
              >
                Volver al inicio
              </Link>

              <Link
                className="btn btn-secondary"
                to="/productos"
              >
                Seguir comprando
              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  )
}

export default PagoCorrecto