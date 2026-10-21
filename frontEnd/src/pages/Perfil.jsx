import { Link } from 'react-router-dom'

function Perfil() {

  const usuario = {
    nombre: 'Cliente Demo',
    correo: 'cliente@gmail.com',
    run: '19011022K',
    region: 'Región Metropolitana',
    comuna: 'Santiago',
    direccion: 'Av. Siempre Viva 123'
  }

  const pedidos = [
    {
      id: 'ORD-001',
      fecha: '10/10/2026',
      total: 15490,
      estado: 'Pendiente'
    },
    {
      id: 'ORD-002',
      fecha: '05/10/2026',
      total: 23990,
      estado: 'Entregado'
    }
  ]

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
              <strong>Nombre:</strong> {usuario.nombre}
            </p>

            <p>
              <strong>Correo:</strong> {usuario.correo}
            </p>

            <p>
              <strong>RUN:</strong> {usuario.run}
            </p>

            <p>
              <strong>Región:</strong> {usuario.region}
            </p>

            <p>
              <strong>Comuna:</strong> {usuario.comuna}
            </p>

            <p>
              <strong>Dirección:</strong> {usuario.direccion}
            </p>

            <Link className="btn btn-primary" to="/editar-perfil">Editar perfil</Link>

          </div>


          <div className="content-card">

            <h2>
              Mis pedidos
            </h2>

            {pedidos.map(pedido => (

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
                  Fecha: {pedido.fecha}
                </p>

                <p>
                  Total: ${pedido.total.toLocaleString('es-CL')}
                </p>

                <p>
                  Estado:{' '}

                  <span className="badge badge-warning">
                    {pedido.estado}
                  </span>
                </p>

                <Link
                  className="btn btn-secondary btn-sm"
                  to={`/pedido/${pedido.id}`}
                >
                  Ver detalle
                </Link>

              </div>

            ))}

          </div>

        </div>

      </section>

    </main>
  )
}

export default Perfil