import { Link } from 'react-router-dom'
import { usuariosIniciales } from '../../data/adminData'

export default function AdminPerfil() {

  const sesion =
    JSON.parse(localStorage.getItem('sesion'))


  const usuarios =
    JSON.parse(localStorage.getItem('usuarios')) ||
    usuariosIniciales


  const usuario = usuarios.find(
    item => item.run === sesion?.run
  )


  if (!usuario) {

    return (
      <div className="content-card">

        <h1>
          Usuario no encontrado
        </h1>

        <p>
          No fue posible encontrar los datos de la sesión actual.
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