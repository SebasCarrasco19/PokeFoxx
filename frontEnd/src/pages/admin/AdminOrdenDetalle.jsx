import { Link, useParams } from 'react-router-dom'
import { ordenesIniciales as ordenes } from '../../data/adminData'

function AdminOrdenDetalle() {
  const { id } = useParams()

  const orden = ordenes.find((item) => item.id === id)

  if (!orden) {
    return (
      <div className="content-card">
        <h1>Orden no encontrada</h1>
        <Link className="btn btn-primary" to="/admin/ordenes">
          Volver a órdenes
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="admin-title">
        <h1>Detalle de orden {orden.id}</h1>
        <p>Vista de consulta de los productos incluidos en la orden.</p>
      </div>

      <div className="admin-order-grid">
        <section className="content-card">
          <h2>Datos de la orden</h2>
          <p>
            <strong>Cliente:</strong> {orden.customer}
          </p>
          {orden.customerEmail && (
            <p>
              <strong>Correo:</strong> {orden.customerEmail}
            </p>
          )}
          <p>
            <strong>Fecha:</strong> {orden.date}
          </p>
          <p>
            <strong>Estado:</strong> {orden.status}
          </p>
          <p>
            <strong>Total:</strong> $
            {Number(orden.total).toLocaleString('es-CL')}
          </p>
        </section>

        <section className="content-card">
          <h2>Productos</h2>
          <div className="admin-order-items">
            {orden.items.map((item) => (
              <div
                className="admin-order-item"
                key={`${orden.id}-${item.productId}`}
              >
                <div>
                  <strong>{item.name}</strong>
                  <span>Cantidad: {item.qty}</span>
                </div>
                <span>
                  ${Number(item.price * item.qty).toLocaleString('es-CL')}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="admin-button-row admin-order-back">
        <Link className="btn btn-secondary" to="/admin/ordenes">
          Volver a órdenes
        </Link>
      </div>
    </>
  )
}

export default AdminOrdenDetalle
