import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listarOrdenes, formatoFecha, formatoPesos } from '../../services/ordenService'

function AdminOrdenes() {
  const [ordenes, setOrdenes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true
    listarOrdenes()
      .then(datos => { if (activo) setOrdenes(Array.isArray(datos) ? datos : []) })
      .catch(err => { if (activo) setError(err.message) })
      .finally(() => { if (activo) setCargando(false) })
    return () => { activo = false }
  }, [])

  return <>
    <div className="admin-title">
      <h1>Órdenes</h1>
      <p>Consulta de órdenes registradas en la tienda.</p>
    </div>
    {cargando && <p>Cargando órdenes...</p>}
    {error && <div className="form-message error">{error}</div>}
    {!cargando && !error && <div className="table-wrap">
      <table>
        <thead><tr><th>Orden</th><th>Cliente (ID)</th><th>Fecha</th><th>Total</th><th>Estado</th><th>Acción</th></tr></thead>
        <tbody>
          {ordenes.map(orden => <tr key={orden.id}>
            <td>{orden.id}</td>
            <td>{orden.usuarioId ?? 'No disponible'}</td>
            <td>{formatoFecha(orden.fecha)}</td>
            <td>{formatoPesos(orden.total)}</td>
            <td><span className="role-chip">{orden.estado}</span></td>
            <td><Link className="btn btn-secondary btn-sm" to={`/admin/ordenes/${orden.id}`}>Ver detalle</Link></td>
          </tr>)}
          {ordenes.length === 0 && <tr><td colSpan="6">No hay órdenes registradas.</td></tr>}
        </tbody>
      </table>
    </div>}
  </>
}
export default AdminOrdenes
