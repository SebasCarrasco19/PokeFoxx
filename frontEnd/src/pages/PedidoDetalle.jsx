
import { useEffect, useState } from 'react'
import {
  Link,
  Navigate,
  useParams
} from 'react-router-dom'

import {
  obtenerOrden,
  formatoFecha,
  formatoPesos
} from '../services/ordenService'

export default function PedidoDetalle() {

  const { id } = useParams()

  const [pedido, setPedido] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  // Obtener sesión actual
  let sesion = null

  try {
    sesion = JSON.parse(
      localStorage.getItem('sesion') || 'null'
    )
  } catch {
    sesion = null
  }

  const token = localStorage.getItem('token')

  // Consultar el pedido desde Spring Boot
  useEffect(() => {

    if (!sesion || !token) {
      return
    }

    let activo = true

    setCargando(true)
    setError('')
    setPedido(null)

    obtenerOrden(id)
      .then(datos => {

        if (activo) {
          setPedido(datos)
        }

      })
      .catch(err => {

        if (activo) {
          setError(err.message)
        }

      })
      .finally(() => {

        if (activo) {
          setCargando(false)
        }

      })

    return () => {
      activo = false
    }

  }, [id])

  // Usuario sin sesión
  if (!sesion || !token) {

    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  // Estado de carga
  if (cargando) {

    return (
      <main className="container section">

        <p>
          Cargando pedido...
        </p>

      </main>
    )
  }

  // Pedido inexistente o sin autorización
  if (error || !pedido) {

    return (
      <main className="container section">

        <section className="content-card">

          <h1>
            Pedido no disponible
          </h1>

          <p>
            {error || 'No se encontró el pedido.'}
          </p>

          <Link
            className="btn btn-secondary"
            to="/perfil"
          >
            Volver a mi perfil
          </Link>

        </section>

      </main>
    )
  }

  // Detalle del pedido
  return (

    <main className="container section">

      <section className="content-card">

        <span className="eyebrow">
          Mi pedido
        </span>

        <h1>
          Pedido {pedido.id}
        </h1>

        {/* Información general */}

        <p>
          <strong>Fecha:</strong>{' '}
          {formatoFecha(pedido.fecha)}
        </p>

        <p>
          <strong>Estado:</strong>{' '}

          <span className="badge badge-warning">
            {pedido.estado}
          </span>
        </p>

        <hr />

        {/* Productos del pedido */}

        <h2>
          Productos
        </h2>

        {(pedido.productos || []).map((item, index) => (

          <div
            key={`${item.productoId}-${index}`}
            style={{
              marginBottom: '16px',
              paddingBottom: '16px',
              borderBottom: '1px solid var(--border)'
            }}
          >

            <p>
              <strong>
                {item.nombre ||
                  `Producto #${item.productoId}`}
              </strong>
            </p>

            <p>
              Cantidad: {item.cantidad}
            </p>

            <p>
              Precio unitario:{' '}
              {formatoPesos(item.precioUnitario)}
            </p>

            <p>
              Subtotal:{' '}
              {formatoPesos(item.subtotal)}
            </p>

          </div>

        ))}

        {/* Total del pedido */}

        <p>
          <strong>
            Total: {formatoPesos(pedido.total)}
          </strong>
        </p>

        {/* Volver al perfil */}

        <Link
          className="btn btn-secondary"
          to="/perfil"
        >
          Volver a mi perfil
        </Link>

      </section>

    </main>
  )
}
