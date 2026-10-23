import { Link } from 'react-router-dom'
import { ordenesIniciales } from '../data/adminData'

function PagoCorrecto() {

  const ordenes =
    JSON.parse(localStorage.getItem('ordenes')) ||
    ordenesIniciales


  const ultimaOrdenId =
    localStorage.getItem('ultimaOrdenId')


  const ultimaOrden =
    ordenes.find(
      orden => orden.id === ultimaOrdenId
    )


  const cantidadProductos =
    ultimaOrden?.items?.reduce(
      (total, item) =>
        total + (item.qty ?? 1),
      0
    ) || 0


  const sesion =
    JSON.parse(localStorage.getItem('sesion'))


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


            {ultimaOrden ? (
              <>

                <p>
                  Tu compra fue registrada correctamente.
                </p>


                <p>
                  <strong>
                    Orden:
                  </strong>{' '}

                  {ultimaOrden.id}
                </p>


                <p>
                  <strong>
                    Productos:
                  </strong>{' '}

                  {cantidadProductos}
                </p>


                <p>
                  <strong>
                    Total:
                  </strong>{' '}

                  $
                  {Number(
                    ultimaOrden.total
                  ).toLocaleString('es-CL')}
                </p>


                <p>
                  <strong>
                    Estado:
                  </strong>{' '}

                  <span className="badge badge-warning">
                    {ultimaOrden.status}
                  </span>
                </p>

              </>
            ) : (

              <p>
                La compra fue procesada correctamente.
              </p>

            )}


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


              {sesion && (

                <Link
                  className="btn btn-secondary"
                  to="/perfil"
                >
                  Ver mis pedidos
                </Link>

              )}

            </div>

          </div>

        </div>

      </section>

    </main>
  )
}

export default PagoCorrecto