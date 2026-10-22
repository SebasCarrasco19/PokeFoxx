import { Link, useParams } from 'react-router-dom'
import { usuariosIniciales } from '../../data/adminData'

export default function AdminUsuarioDetalle() {

  const { run } = useParams()

  const usuarios =
    JSON.parse(localStorage.getItem('usuarios')) ||
    usuariosIniciales

  const usuario = usuarios.find(
    item => item.run === run
  )


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