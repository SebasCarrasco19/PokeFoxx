import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CheckoutForm from '../components/CheckoutForm'

function Checkout() {

  const navigate = useNavigate()

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

    navigate('/pago-correcto')

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

          <CheckoutForm
            datos={datos}
            cambiarDato={cambiarDato}
            enviarCompra={enviarCompra}
          />

        </div>

      </section>

    </main>
  )
}

export default Checkout