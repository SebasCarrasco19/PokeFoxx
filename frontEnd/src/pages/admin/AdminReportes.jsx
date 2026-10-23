import { Link } from 'react-router-dom'
import {
  productosIniciales,
  usuariosIniciales,
  ordenesIniciales
} from '../../data/adminData'

export default function AdminReportes() {

  const productos =
    JSON.parse(localStorage.getItem('productos')) ||
    productosIniciales


  const usuarios =
    JSON.parse(localStorage.getItem('usuarios')) ||
    usuariosIniciales


  const ordenes =
    JSON.parse(localStorage.getItem('ordenes')) ||
    ordenesIniciales


  const productosCriticos = productos.filter(
    producto =>
      producto.criticalStock !== null &&
      producto.criticalStock !== '' &&
      producto.stock <= producto.criticalStock
  )


  const totalVentas = ordenes.reduce(
    (total, orden) =>
      total + Number(orden.total),
    0
  )


  const unidadesEnStock = productos.reduce(
    (total, producto) =>
      total + Number(producto.stock),
    0
  )


  return (
    <>

      <div className="admin-title">

        <h1>
          Reportes
        </h1>

        <p>
          Resumen general de la información registrada en la tienda.
        </p>

      </div>


      <div className="stat-grid">

        <article className="stat-card">

          <span>
            Productos
          </span>

          <strong>
            {productos.length}
          </strong>

        </article>


        <article className="stat-card">

          <span>
            Usuarios
          </span>

          <strong>
            {usuarios.length}
          </strong>

        </article>


        <article className="stat-card">

          <span>
            Órdenes
          </span>

          <strong>
            {ordenes.length}
          </strong>

        </article>


        <article className="stat-card">

          <span>
            Ventas acumuladas
          </span>

          <strong>
            ${totalVentas.toLocaleString('es-CL')}
          </strong>

        </article>

      </div>


      <section className="content-card">

        <h2>
          Inventario
        </h2>


        <p>
          <strong>Unidades disponibles:</strong>{' '}
          {unidadesEnStock}
        </p>


        <p>
          <strong>Productos con stock crítico:</strong>{' '}
          {productosCriticos.length}
        </p>


        <Link
          className="btn btn-secondary"
          to="/admin/productos-criticos"
        >
          Ver productos críticos
        </Link>

      </section>


      <section
        className="content-card"
        style={{
          marginTop: '20px'
        }}
      >

        <h2>
          Ventas
        </h2>


        <p>
          <strong>Total de órdenes:</strong>{' '}
          {ordenes.length}
        </p>


        <p>
          <strong>Total vendido:</strong>{' '}
          ${totalVentas.toLocaleString('es-CL')}
        </p>


        <Link
          className="btn btn-secondary"
          to="/admin/ordenes"
        >
          Ver órdenes
        </Link>

      </section>

    </>
  )
}