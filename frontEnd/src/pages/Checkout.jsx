import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CheckoutForm from '../components/CheckoutForm'

import {
  productosIniciales,
  ordenesIniciales,
  usuariosIniciales
} from '../data/adminData'

function Checkout() {

  const navigate = useNavigate()


  const sesion =
    JSON.parse(localStorage.getItem('sesion'))


  const usuarios =
    JSON.parse(localStorage.getItem('usuarios')) ||
    usuariosIniciales


  const usuario = sesion
    ? usuarios.find(
        usuario => usuario.run === sesion.run
      )
    : null


  const [datos, setDatos] = useState({

    nombre: usuario
      ? `${usuario.firstName} ${usuario.lastName}`
      : '',

    correo:
      usuario?.email || '',

    direccion:
      usuario?.address || '',

    comuna:
      usuario?.commune || '',

    metodoPago: ''
  })


  const [mensaje, setMensaje] =
    useState('')


  function cambiarDato(event) {

    const { name, value } =
      event.target


    setDatos({
      ...datos,
      [name]: value
    })


    setMensaje('')
  }


  function obtenerFechaActual() {

    const fecha =
      new Date()


    const año =
      fecha.getFullYear()


    const mes =
      String(
        fecha.getMonth() + 1
      ).padStart(2, '0')


    const dia =
      String(
        fecha.getDate()
      ).padStart(2, '0')


    return `${año}-${mes}-${dia}`
  }


  function enviarCompra(event) {

    event.preventDefault()

    setMensaje('')


    const carrito =
      JSON.parse(
        localStorage.getItem('carrito')
      ) || []


    if (carrito.length === 0) {

      setMensaje(
        'Tu carrito está vacío.'
      )

      return
    }


    if (!datos.metodoPago) {

      setMensaje(
        'Selecciona un método de pago.'
      )

      return
    }


    const nombre =
      datos.nombre.trim()

    const correo =
      datos.correo.trim()

    const direccion =
      datos.direccion.trim()

    const comuna =
      datos.comuna.trim()


    if (
      !usuario &&
      (
        !nombre ||
        !correo ||
        !direccion ||
        !comuna
      )
    ) {

      setMensaje(
        'Completa todos los datos de la compra.'
      )

      return
    }


    const productos =
      JSON.parse(
        localStorage.getItem('productos')
      ) ||
      productosIniciales


    const stockSuficiente =
      carrito.every(item => {

        const producto =
          productos.find(
            producto =>
              producto.id === item.id
          )


        const cantidad =
          item.cantidad ??
          item.quantity ??
          1


        return (
          producto &&
          cantidad > 0 &&
          producto.stock >= cantidad
        )
      })


    if (!stockSuficiente) {

      navigate('/pago-error')

      return
    }


    const productosActualizados =
      productos.map(producto => {

        const itemCarrito =
          carrito.find(
            item =>
              item.id === producto.id
          )


        if (itemCarrito) {

          const cantidad =
            itemCarrito.cantidad ??
            itemCarrito.quantity ??
            1


          return {
            ...producto,
            stock:
              producto.stock - cantidad
          }
        }


        return producto
      })


    localStorage.setItem(
      'productos',
      JSON.stringify(
        productosActualizados
      )
    )


    const total =
      carrito.reduce(
        (acumulador, item) => {

          const cantidad =
            item.cantidad ??
            item.quantity ??
            1


          return (
            acumulador +
            Number(item.price) * cantidad
          )
        },
        0
      )


    const ordenes =
      JSON.parse(
        localStorage.getItem('ordenes')
      ) ||
      ordenesIniciales


    const nuevaOrden = {

      id:
        `ORD-${Date.now()}`,

      customer:
        usuario
          ? `${usuario.firstName} ${usuario.lastName}`
          : nombre,

      customerEmail:
        usuario
          ? usuario.email
          : correo,

      customerRun:
        usuario?.run || null,

      address:
        usuario
          ? usuario.address
          : direccion,

      commune:
        usuario
          ? usuario.commune
          : comuna,

      paymentMethod:
        datos.metodoPago,

      date:
        obtenerFechaActual(),

      total:
        total,

      status:
        'Pendiente',

      items:
        carrito.map(item => ({

          productId:
            item.id,

          name:
            item.name,

          qty:
            item.cantidad ??
            item.quantity ??
            1,

          price:
            Number(item.price)
        }))
    }


    const ordenesActualizadas = [
      ...ordenes,
      nuevaOrden
    ]


    localStorage.setItem(
      'ordenes',
      JSON.stringify(
        ordenesActualizadas
      )
    )


    localStorage.setItem(
      'ultimaOrdenId',
      nuevaOrden.id
    )


    localStorage.removeItem(
      'carrito'
    )


    window.dispatchEvent(
      new Event('carritoActualizado')
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
            {usuario
              ? 'Selecciona un método de pago para completar tu compra.'
              : 'Completa tus datos para continuar con el pedido.'}
          </p>

        </div>

      </section>


      <section className="section">

        <div className="container">


          {!usuario && (

            <div
              className="content-card"
              style={{
                maxWidth: '610px',
                margin: '0 auto 20px'
              }}
            >

              <strong>
                ¿Ya tienes una cuenta?
              </strong>

              <p>
                Inicia sesión para comprar usando
                automáticamente tus datos guardados.
              </p>

              <Link
                className="btn btn-secondary"
                to="/login"
              >
                Iniciar sesión
              </Link>

            </div>

          )}


          {mensaje && (

            <div
              className="form-message error"
              style={{
                maxWidth: '610px',
                margin: '0 auto 20px'
              }}
            >
              ⚠️ {mensaje}
            </div>

          )}


          <CheckoutForm
            datos={datos}
            cambiarDato={cambiarDato}
            enviarCompra={enviarCompra}
            usuario={usuario}
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