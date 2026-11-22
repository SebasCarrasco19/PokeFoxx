
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  obtenerOrden,
  formatoPesos
} from '../services/ordenService'

function PagoCorrecto() {

  const [orden, setOrden] = useState(null)
  const [error, setError] = useState('')

  // Obtener el ID de la última orden registrada
  const id = localStorage.getItem('ultimaOrdenId')

  // Obtener la sesión actual
  let sesion = null

  try {

    sesion = JSON.parse(
      localStorage.getItem('sesion') || 'null'
    )

  } catch {

    sesion = null

  }

  // Consultar la orden real desde Spring Boot
  useEffect(() => {

    if (!id || !localStorage.getItem('token')) {
      return
    }

    let activo = true

    obtenerOrden(id)
      .then(datos => {

        if (activo) {
          setOrden(datos)
        }

      })
      .catch(err => {

        if (activo) {
          setError(err.message)
        }

      })

    return () => {
      activo = false
    }

  }, [id])

  // Calcular cantidad total de productos comprados
  const cantidadProductos = (orden?.productos || []).reduce(
    (total, item) =>
      total + Number(item.cantidad || 0),
    0
  )

  return (

    <main>

      <section className="section">

        <div className="container">

          <div className="content-card empty-state">

            <span className="eyebrow">
              Compra
            </span>

            <h1>
              Pedido registrado correctamente
            </h1>

            {/* Información de la última compra */}

            {id ? (

              <>

                <p>
                  Tu pedido fue registrado.
                  Esto no confirma que se haya realizado
                  un cobro real.
                </p>

                <p>
                  <strong>Orden:</strong> {id}
                </p>

                {/* Datos obtenidos desde MySQL */}

                {orden && (

                  <>

                    <p>
                      <strong>Productos:</strong>{' '}
                      {cantidadProductos}
                    </p>

                    <p>
                      <strong>Total:</strong>{' '}
                      {formatoPesos(orden.total)}
                    </p>

                    <p>
                      <strong>Estado:</strong>{' '}

                      <span className="badge badge-warning">
                        {orden.estado}
                      </span>

                    </p>

                  </>

                )}

                {/* Mensaje de error */}

                {error && (
                  <p>
                    {error}
                  </p>
                )}

              </>

            ) : (

              <p>
                No hay una confirmación de pedido reciente.
              </p>

            )}

            {/* Botones de navegación */}

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
