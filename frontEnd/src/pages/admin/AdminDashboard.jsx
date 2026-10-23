import { Link } from 'react-router-dom'
import {
  productosIniciales,
  usuariosIniciales,
  ordenesIniciales
} from '../../data/adminData'

function AdminDashboard() {
  const sesion = JSON.parse(localStorage.getItem('sesion'))

  const productos =
    JSON.parse(localStorage.getItem('productos')) ||
    productosIniciales

  const usuarios =
    JSON.parse(localStorage.getItem('usuarios')) ||
    usuariosIniciales

  const ordenes =
    JSON.parse(localStorage.getItem('ordenes')) ||
    ordenesIniciales

  const esAdministrador =
    sesion?.role === 'Administrador'

  const productosCriticos = productos.filter(
    producto =>
      producto.stock === 0 ||
      (
        producto.criticalStock !== null &&
        producto.criticalStock !== '' &&
        producto.stock <= producto.criticalStock
      )
  )

  const totalVentas = ordenes.reduce(
    (total, orden) => total + Number(orden.total),
    0
  )

  return (
    <>
      <div className="admin-title">
        <h1>
          Hola, {sesion?.firstName || 'Usuario'}
        </h1>

        <p>
          Panel principal de administración de PokeFoxx.
        </p>
      </div>

      <div className="stat-grid">

        <article className="stat-card">
          <span>Productos</span>
          <strong>{productos.length}</strong>
        </article>

        {esAdministrador && (
          <article className="stat-card">
            <span>Usuarios</span>
            <strong>{usuarios.length}</strong>
          </article>
        )}

        <article className="stat-card">
          <span>Órdenes</span>
          <strong>{ordenes.length}</strong>
        </article>

        <article className="stat-card">
          <span>Ventas</span>
          <strong>
            ${totalVentas.toLocaleString('es-CL')}
          </strong>
        </article>

      </div>

      <section className="admin-section-grid">

        <article className="content-card">
          <span className="eyebrow">Inventario</span>

          <h2>Stock crítico</h2>

          <p>
            Hay <strong>{productosCriticos.length}</strong>{' '}
            producto(s) cuyo stock es igual o inferior
            al nivel crítico configurado.
          </p>

          <Link
            className="btn btn-primary"
            to="/admin/productos-criticos"
          >
            Ver productos críticos
          </Link>
        </article>

        <article className="content-card">
          <span className="eyebrow">Ventas</span>

          <h2>Resumen de órdenes</h2>

          <p>
            Se han registrado{' '}
            <strong>{ordenes.length}</strong>{' '}
            orden(es) por un total de{' '}
            <strong>
              ${totalVentas.toLocaleString('es-CL')}
            </strong>.
          </p>

          <Link
            className="btn btn-secondary"
            to="/admin/ordenes"
          >
            Ver órdenes
          </Link>
        </article>

      </section>
    </>
  )
}

export default AdminDashboard