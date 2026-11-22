
import { useEffect, useState } from 'react'
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

  let sesion = null

  try {
    sesion = JSON.parse(
      localStorage.getItem('sesion') || 'null'
    )
  } catch {
    sesion = null
  }

  const token = localStorage.getItem('token')

  const [datos, setDatos] = useState({
    nombre: '',
    run: '',
    correo: '',
    direccion: '',
    comuna: '',
    metodoPago: ''
  })

  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)
  const [cargandoPerfil, setCargandoPerfil] = useState(
    Boolean(sesion && token)
  )

  const [simularPagoRechazado, setSimularPagoRechazado] =
    useState(false)

  // Cargar datos reales del Cliente desde MySQL
  useEffect(() => {

    if (!sesion || !token) {
      setCargandoPerfil(false)
      return
    }

    const controlador = new AbortController()

    async function cargarPerfil() {

      try {

        setCargandoPerfil(true)
        setMensaje('')

        const respuesta = await fetch(
          'http://localhost:8080/api/v1/usuarios/me',
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
            signal: controlador.signal
          }
        )

        if (!respuesta.ok) {

          if (respuesta.status === 401) {
            throw new Error(
              'Tu sesión venció. Inicia sesión nuevamente.'
            )
          }

          throw new Error(
            'No fue posible cargar tus datos personales.'
          )
        }

        const usuario = await respuesta.json()

        if (!controlador.signal.aborted) {

          setDatos(anterior => ({
            ...anterior,
            nombre: [
              usuario.firstName,
              usuario.lastName
            ].filter(Boolean).join(' '),
            run: usuario.run || '',
            correo: usuario.email || '',
            direccion: usuario.address || '',
            comuna: usuario.commune || ''
          }))

        }

      } catch (error) {

        if (error.name !== 'AbortError') {
          setMensaje(
            error.message ||
            'No fue posible cargar tus datos.'
          )
        }

      } finally {

        if (!controlador.signal.aborted) {
          setCargandoPerfil(false)
        }

      }

    }

    cargarPerfil()

    return () => controlador.abort()

  }, [])

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

    if (cargando || cargandoPerfil) {
      return
    }

    setMensaje('')

    const tokenActual =
      localStorage.getItem('token')

    if (!sesion || !tokenActual) {

      setMensaje(
        'Debes iniciar sesión para realizar la compra.'
      )

      return
    }

    let carrito = []

    try {

      const almacenado = JSON.parse(
        localStorage.getItem('carrito') || '[]'
      )

      carrito = Array.isArray(almacenado)
        ? almacenado
        : []

    } catch {

      setMensaje(
        'No fue posible leer tu carrito.'
      )

      return
    }

    if (carrito.length === 0) {

      setMensaje(
        'Tu carrito está vacío.'
      )

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

      setMensaje(
        'Completa todos los datos de la compra.'
      )

      return
    }

    if (!validarRun(runCompra)) {

      setMensaje(
        'El RUN ingresado no es válido.'
      )

      return
    }

    // Simular rechazo sin registrar una orden
    if (simularPagoRechazado) {

      navigate('/pago-error')

      return
    }

    setCargando(true)

    try {

      // Registrar compra en Spring Boot
      const orden = await registrarCompra(carrito)

      if (!orden || !orden.id) {

        throw new Error(
          'No se recibió la confirmación de la compra.'
        )
      }

      // Guardar referencia de la orden
      localStorage.setItem(
        'ultimaOrdenId',
        String(orden.id)
      )

      // Limpiar carrito solo cuando la API confirma
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

          <h1>
            Finalizar compra
          </h1>

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

          {cargandoPerfil ? (

            <div
              className="content-card"
              style={{
                maxWidth: '610px',
                margin: '0 auto'
              }}
            >

              <p>
                Cargando tus datos personales...
              </p>

            </div>

          ) : (

            <div
              style={{
                pointerEvents: cargando ? 'none' : 'auto',
                opacity: cargando ? 0.7 : 1
              }}
            >

              <CheckoutForm
                datos={datos}
                cambiarDato={cambiarDato}
                enviarCompra={enviarCompra}
                simularPagoRechazado={simularPagoRechazado}
                cambiarSimulacionPago={cambiarSimulacionPago}
              />

              {cargando && (
                <p style={{ textAlign: 'center' }}>
                  Registrando tu compra...
                </p>
              )}

            </div>

          )}

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
