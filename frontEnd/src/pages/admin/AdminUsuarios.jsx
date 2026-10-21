import { Link } from 'react-router-dom'
import { usuariosIniciales as usuarios } from '../../data/adminData'

function AdminUsuarios() {
  return (
    <>
      <div className="admin-title">
        <h1>Usuarios</h1>
        <p>Listado de ejemplo de usuarios del sistema.</p>
      </div>

      <div className="admin-toolbar">
        <span>Roles disponibles: Administrador, Cliente y Vendedor.</span>
        <Link className="btn btn-primary" to="/admin/usuarios/nuevo">
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
            {usuarios.map((usuario) => {
              return (
                <tr key={usuario.run}>
                  <td>{usuario.run}</td>
                  <td>
                    {usuario.firstName} {usuario.lastName}
                  </td>
                  <td>{usuario.email}</td>
                  <td>
                    <span className="role-chip">{usuario.role}</span>
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
                        disabled
                        title="Disponible en una próxima etapa"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default AdminUsuarios
