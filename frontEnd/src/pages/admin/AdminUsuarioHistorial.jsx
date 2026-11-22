
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  listarOrdenes,
  formatoFecha,
  formatoPesos
} from '../../services/ordenService'

export default function AdminUsuarioHistorial() {

  const { run } = useParams()

  const [usuario, setUsuario] = useState(null)
  const [historial, setHistorial] = useState([])

  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {

    let activo = true

    async function cargarHistorial() {

      try {

        setCargando(true)
        setError('')
        setUsuario(null)
        setHistorial([])

        const token = localStorage.getItem('token')

        if (!token) {
          throw new Error(
            'Debes iniciar sesión como Administrador.'
          )
        }

        const respuestaUsuarios = await fetch(
          'http://localhost:8080/api/v1/usuarios',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        if (!respuestaUsuarios.ok) {

          if (respuestaUsuarios.status === 401) {
            throw new Error(
              'Tu sesión venció. Inicia sesión nuevamente.'
            )
          }

          if (respuestaUsuarios.status === 403) {
            throw new Error(
              'No tienes permiso para consultar usuarios.'
            )
          }

          throw new Error(
            'No fue posible obtener los usuarios.'
          )
        }

        const usuarios = await respuestaUsuarios.json()

        if (!Array.isArray(usuarios)) {
          throw new Error(
            'El servidor devolvió usuarios en un formato incorrecto.'
          )
        }

        const usuarioEncontrado = usuarios.find(
          item => String(item.run) === String(run)
        )

        if (!usuarioEncontrado) {

          if (activo) {
            setUsuario(null)
          }

          return
        }

        const ordenes = await listarOrdenes()

        if (!Array.isArray(ordenes)) {
          throw new Error(
            'El servidor devolvió órdenes en un formato incorrecto.'
          )
        }

        const comprasUsuario = ordenes.filter(
          orden =>
            String(orden.usuarioId) ===
            String(usuarioEncontrado.id)
        )

        if (activo) {

          setUsuario(usuarioEncontrado)

          setHistorial(
            [...comprasUsuario].sort(
              (a, b) => Number(b.id) - Number(a.id)
            )
          )

        }

      } catch (error) {

        if (activo) {
          setError(
            error.message ||
            'No fue posible consultar el historial.'
          )
        }

      } finally {

        if (activo) {
          setCargando(false)
        }

      }
    }

    cargarHistorial()

    return () => {
      activo = false
    }

  }, [run])

  if (cargando) {

    return (
      <div className="content-card">
        Cargando historial de compras...
      </div>
    )
  }

  if (error) {

    return (
      <div className="content-card">

        <h1>
          No se pudo consultar el historial
        </h1>

        <p>
          {error}
        </p>

        <Link
          className="btn btn-primary"
          to="/admin/usuarios"
        >
          Volver a usuarios
        </Link>

      </div>
    )
  }

  if (!usuario) {

    return (
      <div className="content-card">

        <h1>
          Usuario no encontrado
        </h1>

        <Link
          className="btn btn-primary"
          to="/admin/usuarios"
        >
          Volver a usuarios
        </Link>

      </div>
    )
  }

  return (
    <>

      <div className="admin-title">

        <h1>
          Historial de compras
        </h1>

        <p>
          {usuario.firstName} {usuario.lastName} ·{' '}
          {historial.length} compra(s) registrada(s).
        </p>

      </div>

      <section className="content-card">

        {historial.length > 0 ? (

          historial.map(pedido => (

            <article
              key={pedido.id}
              style={{
                marginBottom: '20px',
                paddingBottom: '20px',
                borderBottom: '1px solid var(--border)'
              }}
            >

              <h2>
                Orden #{pedido.id}
              </h2>

              <p>
                <strong>Fecha:</strong>{' '}
                {formatoFecha(pedido.fecha)}
              </p>

              <p>
                <strong>Estado:</strong>{' '}
                {pedido.estado}
              </p>

              <p>
                <strong>Total:</strong>{' '}
                {formatoPesos(pedido.total)}
              </p>

              <Link
                className="btn btn-secondary btn-sm"
                to={`/admin/ordenes/${pedido.id}`}
              >
                Ver orden
              </Link>

            </article>

          ))

        ) : (

          <p>
            Este usuario todavía no tiene compras registradas.
          </p>

        )}

      </section>

      <div className="admin-button-row">

        <Link
          className="btn btn-secondary"
          to={`/admin/usuarios/${run}`}
        >
          Volver al usuario
        </Link>

      </div>

    </>
  )
}
