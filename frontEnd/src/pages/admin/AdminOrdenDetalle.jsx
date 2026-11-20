import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { obtenerOrden, formatoFecha, formatoPesos } from '../../services/ordenService'

function AdminOrdenDetalle() {
  const { id } = useParams()
  const [orden, setOrden] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true
    setCargando(true)
    setError('')
    obtenerOrden(id)
      .then(datos => { if (activo) setOrden(datos) })
      .catch(err => { if (activo) setError(err.message) })
      .finally(() => { if (activo) setCargando(false) })
    return () => { activo = false }
  }, [id])

  if (cargando) return <p>Cargando detalle de la orden...</p>
  if (error || !orden) return <div className="content-card">
    <h1>No se pudo consultar la orden</h1><p>{error || 'Orden no encontrada.'}</p>
    <Link className="btn btn-primary" to="/admin/ordenes">Volver a órdenes</Link>
  </div>

  return <>
    <div className="admin-title"><h1>Detalle de orden {orden.id}</h1>
      <p>Vista de consulta de los productos incluidos en la orden.</p></div>
    <div className="admin-order-grid">
      <section className="content-card">
        <h2>Datos de la orden</h2>
        <p><strong>Cliente (ID):</strong> {orden.usuarioId}</p>
        <p><strong>Fecha:</strong> {formatoFecha(orden.fecha)}</p>
        <p><strong>Estado:</strong> {orden.estado}</p>
        <p><strong>Total:</strong> {formatoPesos(orden.total)}</p>
      </section>
      <section className="content-card">
        <h2>Productos</h2>
        <div className="admin-order-items">
          {(orden.productos || []).map((item, index) => <div className="admin-order-item" key={`${item.productoId}-${index}`}>
            <div><strong>{item.nombre || `Producto #${item.productoId}`}</strong>
              <span>Cantidad: {item.cantidad} · Precio: {formatoPesos(item.precioUnitario)}</span></div>
            <span>{formatoPesos(item.subtotal)}</span>
          </div>)}
          {(!orden.productos || orden.productos.length === 0) && <p>Esta orden no tiene detalles disponibles.</p>}
        </div>
      </section>
    </div>
    <div className="admin-button-row admin-order-back">
      <Link className="btn btn-secondary" to="/admin/ordenes">Volver a órdenes</Link>
    </div>
  </>
}
export default AdminOrdenDetalle
