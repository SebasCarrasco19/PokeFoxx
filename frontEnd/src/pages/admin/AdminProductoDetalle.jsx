import { Link, useParams } from 'react-router-dom'
import { productosIniciales } from '../../data/adminData'

export default function AdminProductoDetalle() {
  const { id } = useParams()
  const producto = productosIniciales.find((item) => String(item.id) === id)
  if (!producto)
    return (
      <div className="content-card">
        <h1>Producto no encontrado</h1>
        <Link to="/admin/productos">Volver a productos</Link>
      </div>
    )
  return (
    <>
      <div className="admin-title">
        <h1>Detalle de producto</h1>
        <p>Datos de ejemplo, sin gestión de inventario.</p>
      </div>
      <section className="content-card">
        <h2>{producto.name}</h2>
        <p>{producto.description}</p>
        <p>
          <strong>Código:</strong> {producto.code}
        </p>
        <p>
          <strong>Categoría:</strong> {producto.category}
        </p>
        <p>
          <strong>Juego:</strong> {producto.game}
        </p>
        <p>
          <strong>Precio:</strong> ${producto.price.toLocaleString('es-CL')}
        </p>
        <p>
          <strong>Stock de ejemplo:</strong> {producto.stock}
        </p>
        <div className="admin-button-row">
          <Link
            className="btn btn-primary"
            to={`/admin/productos/${id}/editar`}
          >
            Editar producto
          </Link>
          <Link className="btn btn-secondary" to="/admin/productos">
            Volver
          </Link>
          <Link className="btn btn-secondary" to="/admin/reportes">
            Reportes
          </Link>
        </div>
      </section>
    </>
  )
}
