import { productosCriticosEjemplo } from '../../data/adminData'
import { Link } from 'react-router-dom'
import {
  productosIniciales as productos,
  usuariosIniciales as usuarios,
  ordenesIniciales as ordenes,
} from '../../data/adminData'

function AdminDashboard() {
  const productosCriticos = productosCriticosEjemplo

  return (
    <>
      <div className="admin-title">
        <h1>Hola, Administrador</h1>
        <p>Panel principal de administración de PokeFoxx.</p>
      </div>

      <div className="stat-grid">
        <article className="stat-card">
          <span>Productos</span>
          <strong>{productos.length}</strong>
        </article>

        <article className="stat-card">
          <span>Usuarios</span>
          <strong>{usuarios.length}</strong>
        </article>

        <article className="stat-card">
          <span>Órdenes</span>
          <strong>{ordenes.length}</strong>
        </article>
      </div>

      <section className="admin-section-grid">
        <article className="content-card">
          <span className="eyebrow">Inventario</span>
          <h2>Stock crítico</h2>
          <p>
            Hay <strong>{productosCriticos.length}</strong> producto(s) cuyo
            stock es igual o inferior al nivel crítico configurado.
          </p>
          <Link className="btn btn-primary" to="/admin/productos-criticos">
            Ver productos críticos
          </Link>
        </article>

        <article className="content-card">
          <span className="eyebrow">Datos locales</span>
          <h2>Respaldo</h2>
          <p>
            Vista de demostración. Respaldo y persistencia pendientes de
            implementar.
          </p>
          <div className="admin-button-row">
            <button className="btn btn-primary" type="button" disabled>
              Descargar respaldo
            </button>
            <button className="btn btn-secondary" type="button" disabled>
              Restablecer demo
            </button>
          </div>
        </article>
      </section>
    </>
  )
}

export default AdminDashboard
