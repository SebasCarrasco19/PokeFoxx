import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { obtenerOrden, formatoFecha, formatoPesos } from '../services/ordenService'

export default function PedidoDetalle() {
  const { id } = useParams()
  const [pedido, setPedido] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  let sesion = null
  try { sesion = JSON.parse(localStorage.getItem('sesion') || 'null') } catch { sesion = null }
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!sesion || !token) return
    let activo = true
    obtenerOrden(id)
      .then(datos => { if (activo) setPedido(datos) })
      .catch(err => { if (activo) setError(err.message) })
      .finally(() => { if (activo) setCargando(false) })
    return () => { activo = false }
  }, [id])

  if (!sesion || !token) return <Navigate to="/login" replace />
  if (cargando) return <main className="container section"><p>Cargando pedido...</p></main>
  if (error || !pedido) return <main className="container section"><section className="content-card">
    <h1>Pedido no disponible</h1><p>{error || 'No se encontró el pedido.'}</p>
    <Link className="btn btn-secondary" to="/perfil">Volver a mi perfil</Link>
  </section></main>

  return <main className="container section"><section className="content-card">
    <span className="eyebrow">Mi pedido</span><h1>Pedido {pedido.id}</h1>
    <p><strong>Fecha:</strong> {formatoFecha(pedido.fecha)}</p>
    <p><strong>Estado:</strong> <span className="badge badge-warning">{pedido.estado}</span></p>
    <hr/><h2>Productos</h2>
    {(pedido.productos || []).map((item, index) => <div key={`${item.productoId}-${index}`}
      style={{marginBottom:'16px',paddingBottom:'16px',borderBottom:'1px solid var(--border)'}}>
      <p><strong>{item.nombre || `Producto #${item.productoId}`}</strong></p>
      <p>Cantidad: {item.cantidad}</p>
      <p>Precio unitario: {formatoPesos(item.precioUnitario)}</p>
      <p>Subtotal: {formatoPesos(item.subtotal)}</p>
    </div>)}
    <p><strong>Total: {formatoPesos(pedido.total)}</strong></p>
    <Link className="btn btn-secondary" to="/perfil">Volver a mi perfil</Link>
  </section></main>
}
