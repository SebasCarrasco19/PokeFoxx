import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usuariosIniciales } from '../../data/adminData'

function AdminUsuarios() {

  const [usuarios, setUsuarios] = useState(() => {

    const usuariosGuardados =
      localStorage.getItem('usuarios')

    if (usuariosGuardados) {
      return JSON.parse(usuariosGuardados)
    }

    localStorage.setItem(
      'usuarios',
      JSON.stringify(usuariosIniciales)
    )

    return usuariosIniciales
  })


  const [usuarioAEliminar, setUsuarioAEliminar] =
    useState(null)

  const [mensaje, setMensaje] =
    useState('')

  const [tipoMensaje, setTipoMensaje] =
    useState('')


  const sesion =
    JSON.parse(localStorage.getItem('sesion'))


  function solicitarEliminar(usuario) {

    setMensaje('')


    if (usuario.run === sesion?.run) {

      setTipoMensaje('error')

      setMensaje(
        'No puedes eliminar tu propia cuenta mientras tienes la sesión iniciada.'
      )

      return
    }


    setUsuarioAEliminar(usuario)
  }


  function cancelarEliminar() {

    setUsuarioAEliminar(null)
  }


  function confirmarEliminar() {

    if (!usuarioAEliminar) {
      return
    }


    const usuariosActualizados =
      usuarios.filter(
        usuario =>
          usuario.run !== usuarioAEliminar.run
      )


    setUsuarios(usuariosActualizados)


    localStorage.setItem(
      'usuarios',
      JSON.stringify(usuariosActualizados)
    )


    setTipoMensaje('success')

    setMensaje(
      `Usuario "${usuarioAEliminar.firstName} ${usuarioAEliminar.lastName}" eliminado correctamente.`
    )


    setUsuarioAEliminar(null)
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
          {usuarios.length} usuario(s) registrado(s).
        </span>

        <Link
          className="btn btn-primary"
          to="/admin/usuarios/nuevo"
        >
          Nuevo usuario
        </Link>

      </div>


      {mensaje && (

        <div
          className={`form-message ${tipoMensaje}`}
          style={{
            marginBottom: '20px'
          }}
        >
          {tipoMensaje === 'success' ? '✅' : '⚠️'}{' '}
          {mensaje}
        </div>

      )}


      {usuarioAEliminar && (

        <div
          className="content-card"
          style={{
            marginBottom: '20px'
          }}
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
            >
              Sí, eliminar
            </button>


            <button
              className="btn btn-secondary"
              type="button"
              onClick={cancelarEliminar}
            >
              Cancelar
            </button>

          </div>

        </div>

      )}


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

              <tr key={usuario.run}>

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
                  {usuario.region} / {usuario.commune}
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

          </tbody>

        </table>

      </div>

    </>
  )
}

export default AdminUsuarios