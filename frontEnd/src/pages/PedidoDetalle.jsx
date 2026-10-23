import { Link, Navigate, useParams } from 'react-router-dom'
import { ordenesIniciales } from '../data/adminData'

export default function PedidoDetalle() {

  const { id } = useParams()


  const sesion =
    JSON.parse(localStorage.getItem('sesion'))


  if (!sesion) {

    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }


  const ordenes =
    JSON.parse(localStorage.getItem('ordenes')) ||
    ordenesIniciales


  const pedido = ordenes.find(orden => {

    if (orden.id !== id) {
      return false
    }


    if (orden.customerRun) {

      return orden.customerRun === sesion.run
    }


    return (
      orden.customerEmail?.toLowerCase() ===
      sesion.email.toLowerCase()
    )
  })


  if (!pedido) {

    return (
      <main className="container section">

        <section className="content-card">

          <h1>
            Pedido no encontrado
          </h1>

          <p>
            El pedido no existe o no pertenece a tu cuenta.
          </p>

          <Link
            className="btn btn-secondary"
            to="/perfil"
          >
            Volver a mi perfil
          </Link>

        </section>

      </main>
    )
  }


  return (
    <main className="container section">

      <section className="content-card">

        <span className="eyebrow">
          Mi pedido
        </span>


        <h1>
          Pedido {pedido.id}
        </h1>


        <p>
          <strong>
            Fecha:
          </strong>{' '}

          {pedido.date}
        </p>


        <p>
          <strong>
            Estado:
          </strong>{' '}

          <span className="badge badge-warning">
            {pedido.status}
          </span>

        </p>


        {pedido.address && (

          <p>
            <strong>
              Dirección:
            </strong>{' '}

            {pedido.address}
          </p>

        )}


        {pedido.commune && (

          <p>
            <strong>
              Comuna:
            </strong>{' '}

            {pedido.commune}
          </p>

        )}


        {pedido.paymentMethod && (

          <p>
            <strong>
              Método de pago:
            </strong>{' '}

            {pedido.paymentMethod}
          </p>

        )}


        <hr />


        <h2>
          Productos
        </h2>


        {pedido.items.map((item, index) => (

          <div
            key={`${item.productId}-${index}`}
            style={{
              marginBottom: '16px',
              paddingBottom: '16px',
              borderBottom:
                '1px solid var(--border)'
            }}
          >

            <p>
              <strong>
                {item.name}
              </strong>
            </p>


            <p>
              Cantidad: {item.qty}
            </p>


            <p>
              Precio unitario: $
              {Number(
                item.price
              ).toLocaleString('es-CL')}
            </p>


            <p>
              Subtotal: $
              {Number(
                item.price * item.qty
              ).toLocaleString('es-CL')}
            </p>

          </div>

        ))}


        <p>

          <strong>
            Total: $
            {Number(
              pedido.total
            ).toLocaleString('es-CL')}
          </strong>

        </p>


        <Link
          className="btn btn-secondary"
          to="/perfil"
        >
          Volver a mi perfil
        </Link>

      </section>

    </main>
  )
}