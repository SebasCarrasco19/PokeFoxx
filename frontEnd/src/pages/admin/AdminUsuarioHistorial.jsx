import { Link, useParams } from 'react-router-dom'
import {
  usuariosIniciales,
  ordenesIniciales
} from '../../data/adminData'

export default function AdminUsuarioHistorial() {

  const { run } = useParams()


  const usuarios =
    JSON.parse(localStorage.getItem('usuarios')) ||
    usuariosIniciales


  const usuario = usuarios.find(
    item => item.run === run
  )


  if (!usuario) {

    return (
      <div className="content-card">

        <h1>
          Usuario no encontrado
        </h1>

        <Link
          className="btn btn-primary"
          to="/admin/usuarios"
        >
          Volver a usuarios
        </Link>

      </div>
    )
  }


  const ordenes =
    JSON.parse(localStorage.getItem('ordenes')) ||
    ordenesIniciales


  const historial = ordenes.filter(orden => {

    if (orden.customerRun) {
      return orden.customerRun === usuario.run
    }

    return (
      orden.customerEmail?.toLowerCase() ===
      usuario.email.toLowerCase()
    )
  })


  return (
    <>

      <div className="admin-title">

        <h1>
          Historial de compras
        </h1>

        <p>
          {usuario.firstName} {usuario.lastName} ·{' '}
          {historial.length} compra(s) registrada(s).
        </p>

      </div>


      <section className="content-card">

        {historial.length > 0 ? (

          historial.map(pedido => (

            <article
              key={pedido.id}
              style={{
                marginBottom: '20px',
                paddingBottom: '20px',
                borderBottom: '1px solid var(--border)'
              }}
            >

              <h2>
                {pedido.id}
              </h2>


              <p>
                <strong>Fecha:</strong>{' '}
                {pedido.date}
              </p>


              <p>
                <strong>Estado:</strong>{' '}
                {pedido.status}
              </p>


              <p>
                <strong>Total:</strong>{' '}
                $
                {Number(pedido.total).toLocaleString('es-CL')}
              </p>


              <p>
                <strong>Productos:</strong>{' '}
                {pedido.items?.reduce(
                  (total, item) =>
                    total + (item.qty ?? 1),
                  0
                ) || 0}
              </p>


              <Link
                className="btn btn-secondary btn-sm"
                to={`/admin/ordenes/${pedido.id}`}
              >
                Ver orden
              </Link>

            </article>

          ))

        ) : (

          <p>
            Este usuario todavía no tiene compras registradas.
          </p>

        )}

      </section>


      <div className="admin-button-row">

        <Link
          className="btn btn-secondary"
          to={`/admin/usuarios/${run}`}
        >
          Volver al usuario
        </Link>

      </div>

    </>
  )
}