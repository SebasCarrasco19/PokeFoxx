
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CheckoutForm from '../components/CheckoutForm'
import { registrarCompra } from '../services/ordenService'

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
    multiplicador = multiplicador === 7
      ? 2
      : multiplicador + 1
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

  const sesion = JSON.parse(
    localStorage.getItem('sesion') || 'null'
  )

  const [datos, setDatos] = useState({
    nombre: sesion
      ? `${sesion.firstName || ''} ${sesion.lastName || ''}`.trim()
      : '',
    run: sesion?.run || '',
    correo: sesion?.email || '',
    direccion: sesion?.address || '',
    comuna: sesion?.commune || '',
    metodoPago: ''
  })

  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  const [simularPagoRechazado, setSimularPagoRechazado] =
    useState(false)

  function cambiarDato(event) {
    const { name, value } = event.target

    setDatos(anterior => ({
      ...anterior,
      [name]: value
    }))

    setMensaje('')
  }

  function cambiarSimulacionPago(event) {
    setSimularPagoRechazado(event.target.checked)
    setMensaje('')
  }

  async function enviarCompra(event) {
    event.preventDefault()
    setMensaje('')

    if (cargando) return

    // Obtener el carrito de React
    const carrito = JSON.parse(
      localStorage.getItem('carrito') || '[]'
    )

    if (carrito.length === 0) {
      setMensaje('Tu carrito está vacío.')
      return
    }

    // Comprobar datos del formulario
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

    // La compra requiere autenticación JWT
    const token = localStorage.getItem('token')

    if (!sesion || !token) {
      setMensaje(
        'Debes iniciar sesión para realizar la compra.'
      )
      return
    }

    // Mantener la simulación de pago del proyecto
    if (simularPagoRechazado) {
      navigate('/pago-error')
      return
    }

    setCargando(true)

    try {
      // Enviar productos al backend
      const orden = await registrarCompra(carrito)

      if (!orden || !orden.id) {
        throw new Error(
          'No se recibió la confirmación de la compra.'
        )
      }

      // Guardar solo la referencia para la pantalla final
      localStorage.setItem(
        'ultimaOrdenId',
        String(orden.id)
      )

      // Vaciar carrito únicamente después de guardar
      localStorage.removeItem('carrito')

      window.dispatchEvent(
        new Event('carritoActualizado')
      )

      navigate('/pago-correcto')

    } catch (error) {
      setMensaje(
        error.message ||
        'No se pudo registrar la compra.'
      )
    } finally {
      setCargando(false)
    }
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
            {sesion
              ? 'Revisa o modifica los datos de esta compra antes de continuar.'
              : 'Completa tus datos para continuar con el pedido.'}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">

          {!sesion && (
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
            simularPagoRechazado={simularPagoRechazado}
            cambiarSimulacionPago={cambiarSimulacionPago}
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
