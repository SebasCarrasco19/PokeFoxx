import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CheckoutForm from '../components/CheckoutForm'
import {
  productosIniciales,
  ordenesIniciales
} from '../data/adminData'

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


    const carrito =
      JSON.parse(localStorage.getItem('carrito')) || []


    if (carrito.length === 0) {
      alert('El carrito está vacío')
      return
    }


    if (
      !datos.nombre ||
      !datos.correo ||
      !datos.direccion ||
      !datos.comuna ||
      !datos.metodoPago
    ) {
      alert('Completa todos los datos')
      return
    }


    const productos =
      JSON.parse(localStorage.getItem('productos')) ||
      productosIniciales


    const stockSuficiente = carrito.every(item => {

      const producto = productos.find(
        producto => producto.id === item.id
      )

      const cantidad =
        item.cantidad ?? item.quantity ?? 1

      return (
        producto &&
        producto.stock >= cantidad
      )
    })


    if (!stockSuficiente) {
      navigate('/pago-error')
      return
    }


    const productosActualizados = productos.map(producto => {

      const itemCarrito = carrito.find(
        item => item.id === producto.id
      )

      if (itemCarrito) {

        const cantidad =
          itemCarrito.cantidad ??
          itemCarrito.quantity ??
          1

        return {
          ...producto,
          stock: producto.stock - cantidad
        }
      }

      return producto
    })


    localStorage.setItem(
      'productos',
      JSON.stringify(productosActualizados)
    )


    const total = carrito.reduce(
      (acumulador, item) => {

        const cantidad =
          item.cantidad ?? item.quantity ?? 1

        return acumulador +
          item.price * cantidad
      },
      0
    )


    const ordenes =
      JSON.parse(localStorage.getItem('ordenes')) ||
      ordenesIniciales


    const nuevaOrden = {

      id: `ORD-${Date.now()}`,

      customer: datos.nombre,

      customerEmail: datos.correo,

      address: datos.direccion,

      commune: datos.comuna,

      paymentMethod: datos.metodoPago,

      date: new Date()
        .toISOString()
        .split('T')[0],

      total: total,

      status: 'Pendiente',

      items: carrito.map(item => ({
        productId: item.id,
        name: item.name,
        qty: item.cantidad ?? item.quantity ?? 1,
        price: item.price
      }))
    }


    const ordenesActualizadas = [
      ...ordenes,
      nuevaOrden
    ]


    localStorage.setItem(
      'ordenes',
      JSON.stringify(ordenesActualizadas)
    )


    localStorage.setItem(
      'carrito',
      JSON.stringify([])
    )


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


          <div className="hero-actions">

            <Link
              className="btn btn-secondary"
              to="/carrito"
            >
              Volver al carrito
            </Link>

          </div>

        </div>

      </section>

    </main>
  )
}

export default Checkout