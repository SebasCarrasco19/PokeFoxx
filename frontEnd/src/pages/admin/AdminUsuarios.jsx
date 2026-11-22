
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function AdminUsuarios() {

  const [usuarios, setUsuarios] = useState([])
  const [usuarioAEliminar, setUsuarioAEliminar] =
    useState(null)

  const [mensaje, setMensaje] = useState('')
  const [tipoMensaje, setTipoMensaje] = useState('')
  const [cargando, setCargando] = useState(true)
  const [eliminando, setEliminando] = useState(false)

  const sesion = JSON.parse(
    localStorage.getItem('sesion') || 'null'
  )

  useEffect(() => {

    const controlador = new AbortController()

    async function cargarUsuarios() {

      try {

        setCargando(true)
        setMensaje('')

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
            `No fue posible obtener los usuarios (HTTP ${respuesta.status}).`
          )
        }

        const datos = await respuesta.json()

        if (!Array.isArray(datos)) {
          throw new Error(
            'El servidor devolvió un formato incorrecto.'
          )
        }

        if (!controlador.signal.aborted) {
          setUsuarios(datos)
        }

      } catch (error) {

        if (error.name !== 'AbortError') {

          setTipoMensaje('error')

          setMensaje(
            error.message ||
            'No fue posible cargar los usuarios.'
          )

        }

      } finally {

        if (!controlador.signal.aborted) {
          setCargando(false)
        }

      }
    }

    cargarUsuarios()

    return () => controlador.abort()

  }, [])

  function solicitarEliminar(usuario) {

    setMensaje('')

    if (
      usuario.run === sesion?.run ||
      usuario.email === sesion?.email
    ) {

      setTipoMensaje('error')

      setMensaje(
        'No puedes eliminar tu propia cuenta mientras tienes la sesión iniciada.'
      )

      return
    }

    setUsuarioAEliminar(usuario)
  }

  function cancelarEliminar() {

    if (eliminando) return

    setUsuarioAEliminar(null)
  }

  async function confirmarEliminar() {

    if (!usuarioAEliminar || eliminando) {
      return
    }

    setMensaje('')
    setEliminando(true)

    try {

      const token = localStorage.getItem('token')

      if (!token) {
        throw new Error(
          'Debes iniciar sesión como Administrador.'
        )
      }

      const respuesta = await fetch(
        `http://localhost:8080/api/v1/usuarios/${usuarioAEliminar.id}`,
        {
          method: 'DELETE',
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
            'No tienes permiso para eliminar usuarios.'
          )
        }

        const contenido = await respuesta.text()

        let datos = null

        try {
          datos = contenido
            ? JSON.parse(contenido)
            : null
        } catch {
          datos = null
        }

        if (respuesta.status === 409) {
          throw new Error(
            datos?.error ||
            'No se puede eliminar este usuario porque tiene datos asociados.'
          )
        }

        throw new Error(
          datos?.error ||
          datos?.message ||
          `No fue posible eliminar el usuario (HTTP ${respuesta.status}).`
        )
      }

      const usuarioEliminado = usuarioAEliminar

      setUsuarios(actuales =>
        actuales.filter(
          usuario =>
            usuario.id !== usuarioEliminado.id
        )
      )

      setTipoMensaje('success')

      setMensaje(
        `Usuario "${usuarioEliminado.firstName} ${usuarioEliminado.lastName}" eliminado correctamente.`
      )

      setUsuarioAEliminar(null)

    } catch (error) {

      setTipoMensaje('error')

      setMensaje(
        error.message ||
        'No fue posible eliminar el usuario.'
      )

    } finally {

      setEliminando(false)

    }
  }

  return (
    <>

      <div className="admin-title">

        <h1>
          Usuarios
        </h1>

        <p>
          Listado de usuarios registrados en el sistema.
        </p>

      </div>

      <div className="admin-toolbar">

        <span>
          {cargando
            ? 'Consultando usuarios...'
            : `${usuarios.length} usuario(s) registrado(s).`}
        </span>

        <Link
          className="btn btn-primary"
          to="/admin/usuarios/nuevo"
        >
          Nuevo usuario
        </Link>

      </div>

      {cargando && (

        <div
          className="content-card"
          style={{ marginBottom: '20px' }}
        >
          Cargando usuarios...
        </div>

      )}

      {mensaje && (

        <div
          className={`form-message ${tipoMensaje}`}
          style={{ marginBottom: '20px' }}
        >
          {tipoMensaje === 'success' ? '✅' : '⚠️'}{' '}
          {mensaje}
        </div>

      )}

      {usuarioAEliminar && (

        <div
          className="content-card"
          style={{ marginBottom: '20px' }}
        >

          <h3>
            ¿Eliminar usuario?
          </h3>

          <p>
            ¿Seguro que quieres eliminar a{' '}

            <strong>
              {usuarioAEliminar.firstName}{' '}
              {usuarioAEliminar.lastName}
            </strong>
            ?
          </p>

          <p>
            Correo: {usuarioAEliminar.email}
          </p>

          <div className="admin-button-row">

            <button
              className="btn btn-danger"
              type="button"
              onClick={confirmarEliminar}
              disabled={eliminando}
            >
              {eliminando
                ? 'Eliminando...'
                : 'Sí, eliminar'}
            </button>

            <button
              className="btn btn-secondary"
              type="button"
              onClick={cancelarEliminar}
              disabled={eliminando}
            >
              Cancelar
            </button>

          </div>

        </div>

      )}

      {!cargando && (

        <div className="table-wrap">

          <table>

            <thead>

              <tr>
                <th>RUN</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Perfil</th>
                <th>Ubicación</th>
                <th>Acciones</th>
              </tr>

            </thead>

            <tbody>

              {usuarios.map(usuario => (

                <tr key={usuario.id}>

                  <td>
                    {usuario.run}
                  </td>

                  <td>
                    {usuario.firstName}{' '}
                    {usuario.lastName}
                  </td>

                  <td>
                    {usuario.email}
                  </td>

                  <td>

                    <span className="role-chip">
                      {usuario.role}
                    </span>

                  </td>

                  <td>
                    {usuario.region || 'Sin región'}
                    {' / '}
                    {usuario.commune || 'Sin comuna'}
                  </td>

                  <td>

                    <div className="table-actions">

                      <Link
                        className="btn btn-secondary btn-sm"
                        to={`/admin/usuarios/${usuario.run}`}
                      >
                        Ver detalle
                      </Link>

                      <button
                        className="btn btn-danger btn-sm"
                        type="button"
                        onClick={() =>
                          solicitarEliminar(usuario)
                        }
                      >
                        Eliminar
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

              {usuarios.length === 0 && !mensaje && (

                <tr>
                  <td colSpan="6">
                    No hay usuarios registrados.
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

      )}

    </>
  )
}

export default AdminUsuarios
