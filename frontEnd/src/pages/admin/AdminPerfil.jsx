
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function AdminPerfil() {

  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {

    const controlador = new AbortController()

    async function cargarPerfil() {

      try {

        setCargando(true)
        setError('')
        setUsuario(null)

        const token = localStorage.getItem('token')

        if (!token) {
          throw new Error(
            'Debes iniciar sesión para consultar tu perfil.'
          )
        }

        const respuesta = await fetch(
          'http://localhost:8080/api/v1/usuarios/me',
          {
            method: 'GET',
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
              'No tienes permiso para consultar este perfil.'
            )
          }

          throw new Error(
            `No fue posible consultar tu perfil (HTTP ${respuesta.status}).`
          )
        }

        const datos = await respuesta.json()

        if (!datos || typeof datos !== 'object') {
          throw new Error(
            'El servidor devolvió información incorrecta.'
          )
        }

        if (!controlador.signal.aborted) {
          setUsuario(datos)
        }

      } catch (error) {

        if (error.name !== 'AbortError') {
          setError(
            error.message ||
            'No fue posible cargar tu perfil.'
          )
        }

      } finally {

        if (!controlador.signal.aborted) {
          setCargando(false)
        }

      }
    }

    cargarPerfil()

    return () => controlador.abort()

  }, [])

  if (cargando) {

    return (
      <div className="content-card">

        <p>
          Cargando perfil...
        </p>

      </div>
    )
  }

  if (error || !usuario) {

    return (
      <div className="content-card">

        <h1>
          No se pudo consultar el perfil
        </h1>

        <p>
          {error || 'Usuario no encontrado.'}
        </p>

        <Link
          className="btn btn-secondary"
          to="/"
        >
          Volver a la tienda
        </Link>

      </div>
    )
  }

  return (
    <>

      <div className="admin-title">

        <h1>
          Mi perfil
        </h1>

        <p>
          Información de la cuenta que inició sesión.
        </p>

      </div>

      <section className="content-card">

        <h2>
          {usuario.firstName} {usuario.lastName}
        </h2>

        <p>
          <strong>RUN:</strong>{' '}
          {usuario.run}
        </p>

        <p>
          <strong>Correo:</strong>{' '}
          {usuario.email}
        </p>

        <p>
          <strong>Perfil:</strong>{' '}
          <span className="role-chip">
            {usuario.role}
          </span>
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

      </section>

    </>
  )
}
