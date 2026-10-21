import { useState } from 'react'
import { Link } from 'react-router-dom'
import CheckoutForm from '../components/CheckoutForm'

function Checkout() {


  const [datos, setDatos] = useState({
    nombre: '',
    correo: '',
    direccion: '',
    comuna: '',
    metodoPago: ''
  })


  function cambiarDato(event) {

    const { name, value } = event.target

    setDatos({
      ...datos,
      [name]: value
    })

  }


  function enviarCompra(event) {

    event.preventDefault()



  }


  return (
    <main>

      <section className="page-header">

        <div className="container">

          <span className="eyebrow">
            Compra
          </span>

          <h1>
            Finalizar compra
          </h1>

          <p>
            Completa tus datos para continuar con el pedido.
          </p>

        </div>

      </section>


      <section className="section">

        <div className="container">

<p>Vista de demostración. No procesa pagos ni genera órdenes.</p>
          <CheckoutForm
            datos={datos}
            cambiarDato={cambiarDato}
            enviarCompra={enviarCompra}
          />
          <div className="hero-actions"><Link className="btn btn-secondary" to="/pago-correcto">Ver ejemplo de pago correcto</Link><Link className="btn btn-secondary" to="/pago-error">Ver ejemplo de pago con error</Link></div>

        </div>

      </section>

    </main>
  )
}

export default Checkout