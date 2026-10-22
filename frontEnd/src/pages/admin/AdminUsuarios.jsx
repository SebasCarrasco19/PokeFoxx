import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usuariosIniciales } from '../../data/adminData'

function AdminUsuarios() {

  const [usuarios, setUsuarios] = useState(() => {

    const usuariosGuardados = localStorage.getItem('usuarios')

    if (usuariosGuardados) {
      return JSON.parse(usuariosGuardados)
    }

    localStorage.setItem(
      'usuarios',
      JSON.stringify(usuariosIniciales)
    )

    return usuariosIniciales
  })


  function eliminarUsuario(run) {

    const confirmar = window.confirm(
      '¿Seguro que quieres eliminar este usuario?'
    )

    if (!confirmar) {
      return
    }

    const usuariosActualizados = usuarios.filter(
      usuario => usuario.run !== run
    )

    setUsuarios(usuariosActualizados)

    localStorage.setItem(
      'usuarios',
      JSON.stringify(usuariosActualizados)
    )
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
                  {usuario.firstName} {usuario.lastName}
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
                      onClick={() => eliminarUsuario(usuario.run)}
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