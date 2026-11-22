
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function AdminUsuarioDetalle() {

  const { run } = useParams()

  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {

    const controlador = new AbortController()

    async function cargarUsuario() {

      try {

        setCargando(true)
        setError('')
        setUsuario(null)

        const token = localStorage.getItem('token')

        if (!token) {
          throw new Error(
            'Debes iniciar sesión como Administrador.'
          )
        }

        const respuesta = await fetch(
          'http://localhost:8080/api/v1/usuarios',
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
              'No tienes permiso para consultar usuarios.'
            )
          }

          throw new Error(
            `No fue posible consultar el usuario (HTTP ${respuesta.status}).`
          )
        }

        const usuarios = await respuesta.json()

        if (!Array.isArray(usuarios)) {
          throw new Error(
            'El servidor devolvió un formato incorrecto.'
          )
        }

        const usuarioEncontrado = usuarios.find(
          item => String(item.run) === String(run)
        )

        if (!controlador.signal.aborted) {
          setUsuario(usuarioEncontrado ?? null)
        }

      } catch (error) {

        if (error.name !== 'AbortError') {
          setError(
            error.message ||
            'Ocurrió un error al consultar el usuario.'
          )
        }

      } finally {

        if (!controlador.signal.aborted) {
          setCargando(false)
        }

      }
    }

    cargarUsuario()

    return () => controlador.abort()

  }, [run])

  if (cargando) {

    return (
      <div className="content-card">
        Cargando usuario...
      </div>
    )
  }

  if (error || !usuario) {

    return (
      <div className="content-card">

        <h1>
          {error || 'Usuario no encontrado'}
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
          Detalle de usuario
        </h1>

        <p>
          Información del usuario registrado en el sistema.
        </p>

      </div>

      <section className="content-card">

        <h2>
          {usuario.firstName} {usuario.lastName}
        </h2>

        <p>
          <strong>RUN:</strong> {usuario.run}
        </p>

        <p>
          <strong>Correo:</strong> {usuario.email}
        </p>

        <p>
          <strong>Perfil:</strong> {usuario.role}
        </p>

        <p>
          <strong>Fecha de nacimiento:</strong>{' '}
          {usuario.birthDate || 'No registrada'}
        </p>

        <p>
          <strong>Región:</strong>{' '}
          {usuario.region || 'No registrada'}
        </p>

        <p>
          <strong>Comuna:</strong>{' '}
          {usuario.commune || 'No registrada'}
        </p>

        <p>
          <strong>Dirección:</strong>{' '}
          {usuario.address || 'No registrada'}
        </p>

        <div className="admin-button-row">

          <Link
            className="btn btn-primary"
            to={`/admin/usuarios/${run}/editar`}
          >
            Editar usuario
          </Link>

          <Link
            className="btn btn-secondary"
            to={`/admin/usuarios/${run}/historial`}
          >
            Historial de compras
          </Link>

          <Link
            className="btn btn-secondary"
            to="/admin/usuarios"
          >
            Volver
          </Link>

        </div>

      </section>

    </>
  )
}
