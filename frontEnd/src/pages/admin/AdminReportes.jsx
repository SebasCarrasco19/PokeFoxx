
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  listarOrdenes,
  formatoPesos
} from '../../services/ordenService'

const API = 'http://localhost:8080/api/v1'

export default function AdminReportes() {

  const [productos, setProductos] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [ordenes, setOrdenes] = useState([])
  const [productosCriticos, setProductosCriticos] = useState([])

  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {

    let activo = true
    const controlador = new AbortController()

    async function cargarReportes() {

      try {

        setCargando(true)
        setError('')

        const token = localStorage.getItem('token')

        if (!token) {
          throw new Error(
            'Debes iniciar sesión como Administrador.'
          )
        }

        async function consultar(ruta) {

          const respuesta = await fetch(
            `${API}${ruta}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              },
              signal: controlador.signal
            }
          )

          if (!respuesta.ok) {

            if (respuesta.status === 401) {
              throw new Error(
                'Tu sesión venció. Inicia sesión nuevamente.'
              )
            }

            if (respuesta.status === 403) {
              throw new Error(
                'No tienes permiso para consultar estos reportes.'
              )
            }

            throw new Error(
              `Error al consultar ${ruta} (HTTP ${respuesta.status}).`
            )
          }

          const datos = await respuesta.json()

          if (!Array.isArray(datos)) {
            throw new Error(
              `El servidor devolvió datos incorrectos en ${ruta}.`
            )
          }

          return datos
        }

        const [
          productosObtenidos,
          usuariosObtenidos,
          ordenesObtenidas,
          criticosObtenidos
        ] = await Promise.all([
          consultar('/productos'),
          consultar('/usuarios'),
          listarOrdenes(),
          consultar('/productos/stock-critico')
        ])

        if (!Array.isArray(ordenesObtenidas)) {
          throw new Error(
            'El servidor devolvió un listado de órdenes incorrecto.'
          )
        }

        if (activo) {

          setProductos(productosObtenidos)
          setUsuarios(usuariosObtenidos)
          setOrdenes(ordenesObtenidas)
          setProductosCriticos(criticosObtenidos)

        }

      } catch (error) {

        if (
          activo &&
          error.name !== 'AbortError'
        ) {
          setError(
            error.message ||
            'No fue posible cargar los reportes.'
          )
        }

      } finally {

        if (activo) {
          setCargando(false)
        }

      }
    }

    cargarReportes()

    return () => {
      activo = false
      controlador.abort()
    }

  }, [])

  const totalOrdenes = ordenes.reduce(
    (total, orden) =>
      total + Number(orden.total ?? 0),
    0
  )

  const unidadesEnStock = productos.reduce(
    (total, producto) =>
      total + Number(producto.stock ?? 0),
    0
  )

  const ordenesPendientes = ordenes.filter(
    orden =>
      String(orden.estado ?? '').toUpperCase() ===
      'PENDIENTE'
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

      {cargando && (

        <div className="content-card">

          <p>
            Cargando reportes...
          </p>

        </div>

      )}

      {!cargando && error && (

        <div className="form-message error">

          ⚠️ {error}

        </div>

      )}

      {!cargando && !error && (

        <>

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
                Monto acumulado de órdenes
              </span>

              <strong>
                {formatoPesos(totalOrdenes)}
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
              Órdenes
            </h2>

            <p>
              <strong>Total de órdenes:</strong>{' '}
              {ordenes.length}
            </p>

            <p>
              <strong>Órdenes pendientes:</strong>{' '}
              {ordenesPendientes.length}
            </p>

            <p>
              <strong>Monto acumulado de órdenes:</strong>{' '}
              {formatoPesos(totalOrdenes)}
            </p>

            <p>
              Los montos incluyen órdenes registradas
              que todavía pueden estar pendientes de pago.
            </p>

            <Link
              className="btn btn-secondary"
              to="/admin/ordenes"
            >
              Ver órdenes
            </Link>

          </section>

        </>

      )}

    </>
  )
}
