
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CartItem from '../components/CartItem'

function Carrito() {

  const [carrito, setCarrito] = useState(() => {
    try {
      const guardado = JSON.parse(
        localStorage.getItem('carrito') || '[]'
      )

      return Array.isArray(guardado) ? guardado : []
    } catch {
      return []
    }
  })

  const [productos, setProductos] = useState([])
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  function guardarCarrito(carritoActualizado) {

    setCarrito(carritoActualizado)

    localStorage.setItem(
      'carrito',
      JSON.stringify(carritoActualizado)
    )

    window.dispatchEvent(
      new Event('carritoActualizado')
    )
  }

  // Comprobar los productos del carrito con MySQL
  useEffect(() => {

    const controlador = new AbortController()

    async function cargarProductos() {

      try {

        setCargando(true)
        setError('')

        const respuesta = await fetch(
          'http://localhost:8080/api/v1/productos',
          {
            signal: controlador.signal
          }
        )

        if (!respuesta.ok) {
          throw new Error(
            'No fue posible verificar los productos del carrito.'
          )
        }

        const datos = await respuesta.json()

        if (!Array.isArray(datos)) {
          throw new Error(
            'El servidor devolvió productos incorrectos.'
          )
        }

        if (controlador.signal.aborted) return

        setProductos(datos)

        const guardado = JSON.parse(
          localStorage.getItem('carrito') || '[]'
        )

        const carritoAnterior =
          Array.isArray(guardado) ? guardado : []

        let huboCambios = false

        const carritoActualizado = carritoAnterior
          .map(item => {

            // Preferir el código para evitar IDs antiguos
            const productoActual = datos.find(producto => {

              if (item.code && producto.code) {
                return producto.code === item.code
              }

              // Si no hay código, confirmar también el nombre
              return (
                Number(producto.id) === Number(item.id) &&
                (producto.name || producto.nombre) ===
                  (item.name || item.nombre)
              )
            })

            if (!productoActual || productoActual.stock <= 0) {
              huboCambios = true
              return null
            }

            const cantidadAnterior = Number(
              item.cantidad ?? item.quantity ?? 1
            )

            const cantidadSolicitada =
              Number.isInteger(cantidadAnterior) &&
              cantidadAnterior > 0
                ? cantidadAnterior
                : 1

            const cantidad = Math.min(
              cantidadSolicitada,
              productoActual.stock
            )

            if (
              Number(item.id) !== Number(productoActual.id) ||
              cantidad !== cantidadAnterior ||
              Number(item.price) !== Number(productoActual.price)
            ) {
              huboCambios = true
            }

            return {
              ...productoActual,
              category:
                productoActual.categoria?.name ||
                productoActual.category?.name ||
                productoActual.category ||
                'TCG',
              cantidad,
              quantity: cantidad
            }
          })
          .filter(Boolean)

        guardarCarrito(carritoActualizado)

        if (huboCambios) {
          setMensaje(
            'El carrito se actualizó con los productos, precios y stock disponibles.'
          )
        }

      } catch (error) {

        if (error.name !== 'AbortError') {
          setError(
            error.message ||
            'No fue posible conectar con el servidor.'
          )
        }

      } finally {

        if (!controlador.signal.aborted) {
          setCargando(false)
        }

      }
    }

    cargarProductos()

    return () => controlador.abort()

  }, [])

  function aumentarCantidad(id) {

    setMensaje('')

    const productoActual = productos.find(
      producto => producto.id === id
    )

    const itemCarrito = carrito.find(
      item => item.id === id
    )

    if (!productoActual) {
      setMensaje('Este producto ya no está disponible.')
      return
    }

    if (
      itemCarrito &&
      itemCarrito.cantidad >= productoActual.stock
    ) {
      setMensaje(
        'No hay más stock disponible para este producto.'
      )
      return
    }

    const carritoActualizado = carrito.map(item => {

      if (item.id === id) {

        const nuevaCantidad = item.cantidad + 1

        return {
          ...item,
          cantidad: nuevaCantidad,
          quantity: nuevaCantidad,
          stock: productoActual.stock
        }
      }

      return item
    })

    guardarCarrito(carritoActualizado)
  }

  function disminuirCantidad(id) {

    setMensaje('')

    const carritoActualizado = carrito.map(item => {

      if (item.id === id && item.cantidad > 1) {

        const nuevaCantidad = item.cantidad - 1

        return {
          ...item,
          cantidad: nuevaCantidad,
          quantity: nuevaCantidad
        }
      }

      return item
    })

    guardarCarrito(carritoActualizado)
  }

  function eliminarProducto(id) {

    setMensaje('')

    const carritoActualizado = carrito.filter(
      item => item.id !== id
    )

    guardarCarrito(carritoActualizado)
  }

  function vaciarCarrito() {

    setMensaje('')

    guardarCarrito([])
  }

  const total = carrito.reduce(
    (acumulador, item) =>
      acumulador + Number(item.price) * item.cantidad,
    0
  )

  const cantidadTotal = carrito.reduce(
    (acumulador, item) =>
      acumulador + item.cantidad,
    0
  )

  return (
    <main>

      <section className="page-header">

        <div className="container">

          <span className="eyebrow">
            Compra
          </span>

          <h1>Carrito</h1>

          <p>
            Revisa los productos antes de continuar con la compra.
          </p>

        </div>

      </section>

      <section className="section">

        <div className="container">

          {cargando && (
            <div
              className="content-card"
              style={{ marginBottom: '20px' }}
            >
              Verificando productos y stock...
            </div>
          )}

          {error && (
            <div
              className="form-message error"
              style={{ marginBottom: '20px' }}
            >
              ⚠️ {error}
            </div>
          )}

          {mensaje && (
            <div
              className="form-message error"
              style={{ marginBottom: '20px' }}
            >
              ⚠️ {mensaje}
            </div>
          )}

          <div className="cart-layout">

            <div className="cart-items">

              {carrito.length > 0 ? (

                carrito.map(item => (

                  <CartItem
                    key={item.id}
                    item={item}
                    aumentar={aumentarCantidad}
                    disminuir={disminuirCantidad}
                    eliminar={eliminarProducto}
                  />

                ))

              ) : (

                <div className="content-card empty-state">

                  <h2>
                    Tu carrito está vacío
                  </h2>

                  <p>
                    Añade productos desde el catálogo.
                  </p>

                  <Link
                    className="btn btn-primary"
                    to="/productos"
                  >
                    Ver productos
                  </Link>

                </div>

              )}

            </div>

            <aside className="content-card cart-summary">

              <h2>Resumen</h2>

              <div className="summary-line">

                <span>Productos</span>

                <span>{cantidadTotal}</span>

              </div>

              <div className="summary-line total">

                <span>Total</span>

                <span>
                  ${total.toLocaleString('es-CL')}
                </span>

              </div>

              {carrito.length > 0 && !cargando && !error ? (

                <Link
                  className="btn btn-primary cart-pay"
                  to="/checkout"
                >
                  Continuar compra
                </Link>

              ) : (

                <button
                  className="btn btn-primary cart-pay"
                  type="button"
                  disabled
                >
                  Continuar compra
                </button>

              )}

              <button
                className="btn btn-danger cart-pay"
                type="button"
                onClick={vaciarCarrito}
                disabled={carrito.length === 0}
              >
                Vaciar carrito
              </button>

            </aside>

          </div>

        </div>

      </section>

    </main>
  )
}

export default Carrito
