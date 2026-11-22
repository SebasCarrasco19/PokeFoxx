
import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'

import {
  listarOrdenes,
  formatoFecha,
  formatoPesos
} from '../services/ordenService'

function Perfil() {

  let sesion = null

  try {
    sesion = JSON.parse(
      localStorage.getItem('sesion') || 'null'
    )
  } catch {
    sesion = null
  }

  const token = localStorage.getItem('token')

  const [usuario, setUsuario] = useState(null)
  const [pedidos, setPedidos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {

    if (!sesion || !token) {
      setCargando(false)
      return
    }

    let activo = true
    const controlador = new AbortController()

    async function cargarPerfil() {

      try {

        setCargando(true)
        setError('')

        const respuesta = await fetch(
          'http://localhost:8080/api/v1/usuarios/me',
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
              'No tienes permiso para consultar tu perfil.'
            )
          }

          throw new Error(
            'No fue posible obtener tus datos personales.'
          )
        }

        const datosUsuario = await respuesta.json()

        if (!datosUsuario || datosUsuario.id == null) {
          throw new Error(
            'El servidor no devolvió un usuario válido.'
          )
        }

        const ordenes = await listarOrdenes()

        if (!Array.isArray(ordenes)) {
          throw new Error(
            'El servidor devolvió un historial incorrecto.'
          )
        }

        const pedidosUsuario = ordenes.filter(
          orden =>
            String(orden.usuarioId) ===
            String(datosUsuario.id)
        )

        if (activo) {

          setUsuario(datosUsuario)

          setPedidos(
            [...pedidosUsuario].sort(
              (a, b) => Number(b.id) - Number(a.id)
            )
          )

        }

      } catch (error) {

        if (
          activo &&
          error.name !== 'AbortError'
        ) {
          setError(
            error.message ||
            'No fue posible cargar tu perfil.'
          )
        }

      } finally {

        if (activo) {
          setCargando(false)
        }

      }
    }

    cargarPerfil()

    return () => {
      activo = false
      controlador.abort()
    }

  }, [])

  if (!sesion || !token) {
    return <Navigate to="/login" replace />
  }

  return (
    <main>

      <section className="page-header">

        <div className="container">

          <span className="eyebrow">
            Mi cuenta
          </span>

          <h1>
            Perfil
          </h1>

          <p>
            Revisa tus datos personales y tus pedidos.
          </p>

        </div>

      </section>

      <section className="section">

        <div className="container two-col">

          <div className="content-card">

            <h2>
              Datos personales
            </h2>

            {cargando && (
              <p>
                Cargando datos personales...
              </p>
            )}

            {!cargando && error && (
              <div className="form-message error">
                ⚠️ {error}
              </div>
            )}

            {!cargando && usuario && (

              <>

                <p>
                  <strong>Nombre:</strong>{' '}
                  {[usuario.firstName, usuario.lastName]
                    .filter(Boolean)
                    .join(' ') || 'No disponible'}
                </p>

                <p>
                  <strong>Correo:</strong>{' '}
                  {usuario.email || 'No disponible'}
                </p>

                <p>
                  <strong>RUN:</strong>{' '}
                  {usuario.run || 'No disponible'}
                </p>

                {usuario.region && (
                  <p>
                    <strong>Región:</strong>{' '}
                    {usuario.region}
                  </p>
                )}

                {usuario.commune && (
                  <p>
                    <strong>Comuna:</strong>{' '}
                    {usuario.commune}
                  </p>
                )}

                {usuario.address && (
                  <p>
                    <strong>Dirección:</strong>{' '}
                    {usuario.address}
                  </p>
                )}

                <Link
                  className="btn btn-primary"
                  to="/editar-perfil"
                >
                  Editar perfil
                </Link>

              </>

            )}

          </div>

          <div className="content-card">

            <h2>
              Mis pedidos
            </h2>

            {cargando && (
              <p>
                Cargando tus pedidos...
              </p>
            )}

            {!cargando && error && (
              <div className="form-message error">
                ⚠️ No fue posible consultar tus pedidos.
              </div>
            )}

            {!cargando &&
              !error &&
              pedidos.length === 0 && (

                <p>
                  Todavía no tienes pedidos registrados.
                </p>

              )}

            {!cargando &&
              !error &&
              pedidos.map(pedido => (

                <div
                  key={pedido.id}
                  style={{
                    marginBottom: '20px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid var(--border)'
                  }}
                >

                  <p>
                    <strong>
                      Orden {pedido.id}
                    </strong>
                  </p>

                  <p>
                    Fecha: {formatoFecha(pedido.fecha)}
                  </p>

                  <p>
                    Total: {formatoPesos(pedido.total)}
                  </p>

                  <p>
                    Estado:{' '}
                    <span className="badge badge-warning">
                      {pedido.estado}
                    </span>
                  </p>

                  <Link
                    className="btn btn-secondary btn-sm"
                    to={`/pedido/${pedido.id}`}
                  >
                    Ver detalle
                  </Link>

                </div>

              ))}

          </div>

        </div>

      </section>

    </main>
  )
}

export default Perfil
