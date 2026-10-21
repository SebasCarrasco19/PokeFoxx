import { Link } from 'react-router-dom'

export default function AdminReportes() {
  return (
    <>
      <div className="admin-title">
        <h1>Reportes</h1>
        <p>
          Resumen estático de demostración. No genera reportes ni exporta datos.
        </p>
      </div>
      <div className="stat-grid">
        <article className="stat-card">
          <span>Productos de ejemplo</span>
          <strong>12</strong>
        </article>
        <article className="stat-card">
          <span>Usuarios de ejemplo</span>
          <strong>3</strong>
        </article>
        <article className="stat-card">
          <span>Órdenes de ejemplo</span>
          <strong>2</strong>
        </article>
      </div>
      <section className="content-card">
        <h2>Inventario</h2>
        <p>Selección de productos críticos de demostración.</p>
        <Link className="btn btn-secondary" to="/admin/productos-criticos">
          Ver productos críticos
        </Link>{' '}
        <button type="button" className="btn btn-primary" disabled>
          Exportar reporte
        </button>
      </section>
    </>
  )
}
