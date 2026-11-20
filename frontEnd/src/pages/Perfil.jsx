import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { listarOrdenes, formatoFecha, formatoPesos } from '../services/ordenService'

function Perfil() {
  const [pedidos, setPedidos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  let sesion = null
  try { sesion = JSON.parse(localStorage.getItem('sesion') || 'null') } catch { sesion = null }
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!sesion || !token) return
    let activo = true
    listarOrdenes()
      .then(datos => { if (activo) setPedidos(Array.isArray(datos) ? datos : []) })
      .catch(err => { if (activo) setError(err.message) })
      .finally(() => { if (activo) setCargando(false) })
    return () => { activo = false }
  // La sesión la establece Login; la solicitud se realiza al montar Perfil.
  }, [])

  if (!sesion || !token) return <Navigate to="/login" replace />

  return <main>
    <section className="page-header"><div className="container">
      <span className="eyebrow">Mi cuenta</span><h1>Perfil</h1>
      <p>Revisa tus datos personales y tus pedidos.</p>
    </div></section>
    <section className="section"><div className="container two-col">
      <div className="content-card">
        <h2>Datos personales</h2>
        <p><strong>Nombre:</strong> {[sesion.firstName, sesion.lastName].filter(Boolean).join(' ') || 'No disponible'}</p>
        <p><strong>Correo:</strong> {sesion.email || 'No disponible'}</p>
        <p><strong>RUN:</strong> {sesion.run || 'No disponible'}</p>
        {sesion.region && <p><strong>Región:</strong> {sesion.region}</p>}
        {sesion.commune && <p><strong>Comuna:</strong> {sesion.commune}</p>}
        {sesion.address && <p><strong>Dirección:</strong> {sesion.address}</p>}
        <Link className="btn btn-primary" to="/editar-perfil">Editar perfil</Link>
      </div>
      <div className="content-card">
        <h2>Mis pedidos</h2>
        {cargando && <p>Cargando tus pedidos...</p>}
        {error && <div className="form-message error">{error}</div>}
        {!cargando && !error && pedidos.length === 0 && <p>Todavía no tienes pedidos registrados.</p>}
        {!cargando && !error && pedidos.map(pedido => <div key={pedido.id}
          style={{marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border)'}}>
          <p><strong>Orden {pedido.id}</strong></p>
          <p>Fecha: {formatoFecha(pedido.fecha)}</p>
          <p>Total: {formatoPesos(pedido.total)}</p>
          <p>Estado: <span className="badge badge-warning">{pedido.estado}</span></p>
          <Link className="btn btn-secondary btn-sm" to={`/pedido/${pedido.id}`}>Ver detalle</Link>
        </div>)}
      </div>
    </div></section>
  </main>
}
export default Perfil
