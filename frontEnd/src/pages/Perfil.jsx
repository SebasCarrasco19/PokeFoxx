import { Link, Navigate } from 'react-router-dom'
import {
  usuariosIniciales,
  ordenesIniciales
} from '../data/adminData'

function Perfil() {

  const sesion = JSON.parse(
    localStorage.getItem('sesion')
  )


  if (!sesion) {
    return <Navigate to="/login" />
  }


  const usuarios =
    JSON.parse(localStorage.getItem('usuarios')) ||
    usuariosIniciales


  const usuario = usuarios.find(
    item => item.run === sesion.run
  )


  if (!usuario) {
    return (
      <main>

        <section className="section">

          <div className="container">

            <div className="content-card">

              <h1>
                Usuario no encontrado
              </h1>

              <Link
                className="btn btn-primary"
                to="/login"
              >
                Volver al inicio de sesión
              </Link>

            </div>

          </div>

        </section>

      </main>
    )
  }


  const ordenes =
    JSON.parse(localStorage.getItem('ordenes')) ||
    ordenesIniciales


  const pedidos = ordenes.filter(
    orden =>
      orden.customerEmail?.toLowerCase() ===
      usuario.email.toLowerCase()
  )


  return (
    <main>

      <section className="page-header">

        <div className="container">

          <span className="eyebrow">
            Mi cuenta
          </span>

          <h1>
            Perfil
          </h1>

          <p>
            Revisa tus datos personales y tus pedidos.
          </p>

        </div>

      </section>


      <section className="section">

        <div className="container two-col">


          <div className="content-card">

            <h2>
              Datos personales
            </h2>


            <p>
              <strong>Nombre:</strong>{' '}
              {usuario.firstName} {usuario.lastName}
            </p>


            <p>
              <strong>Correo:</strong>{' '}
              {usuario.email}
            </p>


            <p>
              <strong>RUN:</strong>{' '}
              {usuario.run}
            </p>


            <p>
              <strong>Región:</strong>{' '}
              {usuario.region}
            </p>


            <p>
              <strong>Comuna:</strong>{' '}
              {usuario.commune}
            </p>


            <p>
              <strong>Dirección:</strong>{' '}
              {usuario.address}
            </p>


            <Link
              className="btn btn-primary"
              to="/editar-perfil"
            >
              Editar perfil
            </Link>

          </div>


          <div className="content-card">

            <h2>
              Mis pedidos
            </h2>


            {pedidos.length > 0 ? (

              pedidos.map(pedido => (

                <div
                  key={pedido.id}
                  style={{
                    marginBottom: '20px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid var(--border)'
                  }}
                >

                  <p>
                    <strong>
                      {pedido.id}
                    </strong>
                  </p>


                  <p>
                    Fecha: {pedido.date}
                  </p>


                  <p>
                    Total: $
                    {Number(pedido.total).toLocaleString('es-CL')}
                  </p>


                  <p>
                    Estado:{' '}

                    <span className="badge badge-warning">
                      {pedido.status}
                    </span>
                  </p>


                  <Link
                    className="btn btn-secondary btn-sm"
                    to={`/pedido/${pedido.id}`}
                  >
                    Ver detalle
                  </Link>

                </div>

              ))

            ) : (

              <p>
                Todavía no tienes pedidos registrados.
              </p>

            )}

          </div>

        </div>

      </section>

    </main>
  )
}

export default Perfil