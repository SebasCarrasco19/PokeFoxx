import { Link, useParams } from 'react-router-dom'
import { usuariosIniciales } from '../../data/adminData'

// Historial fijo para la maqueta; no se enlaza con compras ni órdenes reales.
const historialEjemplo = {
  222222222: [
    { id: 'ORD-001', fecha: '2026-08-20', total: 17970, estado: 'Pendiente' },
    { id: 'ORD-002', fecha: '2026-08-21', total: 18990, estado: 'Preparando' },
  ],
}

export default function AdminUsuarioHistorial() {
  const { run } = useParams()
  const usuario = usuariosIniciales.find((item) => item.run === run)
  if (!usuario)
    return (
      <div className="content-card">
        <h1>Usuario no encontrado</h1>
        <Link to="/admin/usuarios">Volver a usuarios</Link>
      </div>
    )
  const historial = historialEjemplo[run] ?? []
  return (
    <>
      <div className="admin-title">
        <h1>Historial de compras</h1>
        <p>
          {usuario.firstName} {usuario.lastName} · Datos estáticos de
          demostración.
        </p>
      </div>
      <section className="content-card">
        {historial.length ? (
          historial.map((pedido) => (
            <article key={pedido.id}>
              <h2>{pedido.id}</h2>
              <p>
                {pedido.fecha} · {pedido.estado} · $
                {pedido.total.toLocaleString('es-CL')}
              </p>
              <Link to={`/admin/ordenes/${pedido.id}`}>
                Ver orden de ejemplo
              </Link>
            </article>
          ))
        ) : (
          <p>Sin compras de ejemplo para este usuario.</p>
        )}
      </section>
      <Link className="btn btn-secondary" to={`/admin/usuarios/${run}`}>
        Volver al usuario
      </Link>
    </>
  )
}
