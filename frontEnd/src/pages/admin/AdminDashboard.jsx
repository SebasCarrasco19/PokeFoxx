
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function AdminDashboard() {

  const sesion = JSON.parse(
    localStorage.getItem('sesion') || 'null'
  )

  const esAdministrador =
    sesion?.role === 'Administrador'

  const [productos, setProductos] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [ordenes, setOrdenes] = useState([])
  const [productosCriticos, setProductosCriticos] = useState([])

  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {

    const controlador = new AbortController()

    async function cargarDashboard() {

      try {

        setCargando(true)
        setError('')

        const token = localStorage.getItem('token')

        if (!token) {
          throw new Error(
            'Debes iniciar sesión para acceder al panel.'
          )
        }

        const API = 'http://localhost:8080/api/v1'

        async function consultar(ruta) {

          const respuesta = await fetch(
            `${API}${ruta}`,
            {
              signal: controlador.signal,
              headers: {
                Authorization: `Bearer ${token}`
              }
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
                'No tienes permisos para consultar estos datos.'
              )
            }

            throw new Error(
              `No fue posible consultar ${ruta}.`
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

        // Consultas permitidas para Administrador y Vendedor
        const consultas = [
          consultar('/productos'),
          consultar('/ordenes')
        ]

        // Consultas exclusivas del Administrador
        if (esAdministrador) {
          consultas.push(
            consultar('/usuarios'),
            consultar('/productos/stock-critico')
          )
        }

        const resultados = await Promise.all(consultas)

        if (controlador.signal.aborted) return

        setProductos(resultados[0])
        setOrdenes(resultados[1])

        if (esAdministrador) {
          setUsuarios(resultados[2])
          setProductosCriticos(resultados[3])
        } else {
          setUsuarios([])
          setProductosCriticos([])
        }

      } catch (error) {

        if (error.name !== 'AbortError') {
          setError(
            error.message ||
            'No fue posible cargar el panel.'
          )
        }

      } finally {

        if (!controlador.signal.aborted) {
          setCargando(false)
        }

      }
    }

    cargarDashboard()

    return () => controlador.abort()

  }, [esAdministrador])

  const totalVentas = ordenes.reduce(
    (total, orden) =>
      total + Number(orden.total ?? 0),
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

      {cargando && (

        <div className="content-card">
          <p>Cargando estadísticas...</p>
        </div>

      )}

      {error && (

        <div className="form-message error">
          ⚠️ {error}
        </div>

      )}

      {!cargando && !error && (

        <>

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

            {esAdministrador && (

              <article className="stat-card">
                <span>Ventas</span>
                <strong>
                  ${totalVentas.toLocaleString('es-CL')}
                </strong>
              </article>

            )}

          </div>

          <section className="admin-section-grid">

            {esAdministrador && (

              <article className="content-card">

                <span className="eyebrow">
                  Inventario
                </span>

                <h2>Stock crítico</h2>

                <p>
                  Hay{' '}
                  <strong>
                    {productosCriticos.length}
                  </strong>{' '}
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

            )}

            <article className="content-card">

              <span className="eyebrow">
                Órdenes
              </span>

              <h2>Resumen de órdenes</h2>

              <p>
                Se han registrado{' '}
                <strong>{ordenes.length}</strong>{' '}
                orden(es).

                {esAdministrador && (
                  <>
                    {' '}Total acumulado:{' '}
                    <strong>
                      ${totalVentas.toLocaleString('es-CL')}
                    </strong>.
                  </>
                )}
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

      )}

    </>
  )
}

export default AdminDashboard
