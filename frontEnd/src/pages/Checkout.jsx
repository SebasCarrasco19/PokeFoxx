import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CheckoutForm from '../components/CheckoutForm'
import {
  productosIniciales,
  ordenesIniciales,
  usuariosIniciales
} from '../data/adminData'

function validarRun(run) {
  const runLimpio = run.trim().toUpperCase()

  if (!/^\d{6,8}[0-9K]$/.test(runLimpio)) {
    return false
  }

  const cuerpo = runLimpio.slice(0, -1)
  const dvIngresado = runLimpio.slice(-1)

  let suma = 0
  let multiplicador = 2

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplicador
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1
  }

  const resultado = 11 - (suma % 11)

  const dvCalculado =
    resultado === 11
      ? '0'
      : resultado === 10
        ? 'K'
        : String(resultado)

  return dvIngresado === dvCalculado
}

function Checkout() {
  const navigate = useNavigate()

  const sesion =
    JSON.parse(localStorage.getItem('sesion'))

  const usuarios =
    JSON.parse(localStorage.getItem('usuarios')) ||
    usuariosIniciales

  const usuario = sesion
    ? usuarios.find(usuario => usuario.run === sesion.run)
    : null

  const [datos, setDatos] = useState({
    nombre: usuario
      ? `${usuario.firstName} ${usuario.lastName}`
      : '',
    run: usuario?.run || '',
    correo: usuario?.email || '',
    direccion: usuario?.address || '',
    comuna: usuario?.commune || '',
    metodoPago: ''
  })

  const [mensaje, setMensaje] = useState('')

  function cambiarDato(event) {
    const { name, value } = event.target

    setDatos({
      ...datos,
      [name]: value
    })

    setMensaje('')
  }

  function obtenerFechaActual() {
    const fecha = new Date()
    const año = fecha.getFullYear()
    const mes = String(fecha.getMonth() + 1).padStart(2, '0')
    const dia = String(fecha.getDate()).padStart(2, '0')

    return `${año}-${mes}-${dia}`
  }

  function enviarCompra(event) {
    event.preventDefault()
    setMensaje('')

    const carrito =
      JSON.parse(localStorage.getItem('carrito')) || []

    if (carrito.length === 0) {
      setMensaje('Tu carrito está vacío.')
      return
    }

    const nombre = datos.nombre.trim()
    const runCompra = datos.run.trim().toUpperCase()
    const correo = datos.correo.trim()
    const direccion = datos.direccion.trim()
    const comuna = datos.comuna.trim()

    if (
      !nombre ||
      !runCompra ||
      !correo ||
      !direccion ||
      !comuna ||
      !datos.metodoPago
    ) {
      setMensaje('Completa todos los datos de la compra.')
      return
    }

    if (!validarRun(runCompra)) {
      setMensaje('El RUN ingresado no es válido.')
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
        cantidad > 0 &&
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

      if (!itemCarrito) {
        return producto
      }

      const cantidad =
        itemCarrito.cantidad ??
        itemCarrito.quantity ??
        1

      return {
        ...producto,
        stock: producto.stock - cantidad
      }
    })

    localStorage.setItem(
      'productos',
      JSON.stringify(productosActualizados)
    )

    const total = carrito.reduce((acumulador, item) => {
      const cantidad =
        item.cantidad ?? item.quantity ?? 1

      return acumulador + Number(item.price) * cantidad
    }, 0)

    const ordenes =
      JSON.parse(localStorage.getItem('ordenes')) ||
      ordenesIniciales

    const nuevaOrden = {
      id: `ORD-${Date.now()}`,

      customer: nombre,
      customerEmail: correo,

      // Mantiene la orden asociada a la cuenta logueada
      customerRun: usuario?.run || null,

      // RUN utilizado específicamente para esta compra
      recipientRun: runCompra,

      address: direccion,
      commune: comuna,
      paymentMethod: datos.metodoPago,
      date: obtenerFechaActual(),
      total,
      status: 'Pendiente',

      items: carrito.map(item => ({
        productId: item.id,
        name: item.name,
        qty: item.cantidad ?? item.quantity ?? 1,
        price: Number(item.price)
      }))
    }

    localStorage.setItem(
      'ordenes',
      JSON.stringify([
        ...ordenes,
        nuevaOrden
      ])
    )

    localStorage.setItem(
      'ultimaOrdenId',
      nuevaOrden.id
    )

    localStorage.removeItem('carrito')

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

          <h1>Finalizar compra</h1>

          <p>
            {usuario
              ? 'Revisa o modifica los datos de esta compra antes de continuar.'
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
                Inicia sesión para cargar automáticamente
                tus datos en el checkout.
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