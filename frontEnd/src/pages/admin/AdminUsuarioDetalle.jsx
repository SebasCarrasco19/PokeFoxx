import { Link, useParams } from 'react-router-dom'
import { usuariosIniciales } from '../../data/adminData'

export default function AdminUsuarioDetalle() {
  const { run } = useParams()
  const usuario = usuariosIniciales.find((item) => item.run === run)
  if (!usuario)
    return (
      <div className="content-card">
        <h1>Usuario no encontrado</h1>
        <Link to="/admin/usuarios">Volver a usuarios</Link>
      </div>
    )
  return (
    <>
      <div className="admin-title">
        <h1>Detalle de usuario</h1>
        <p>Datos de ejemplo, sin autenticación ni permisos reales.</p>
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
          <strong>Dirección:</strong> {usuario.address}, {usuario.commune}
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
          <Link className="btn btn-secondary" to="/admin/usuarios">
            Volver
          </Link>
        </div>
      </section>
    </>
  )
}
