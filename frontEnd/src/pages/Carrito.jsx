import { useState } from 'react'
import { Link } from 'react-router-dom'
import CartItem from '../components/CartItem'
import { productosIniciales } from '../data/adminData'

function Carrito() {

  const [carrito, setCarrito] = useState(() => {

    const carritoGuardado =
      JSON.parse(localStorage.getItem('carrito')) || []

    return carritoGuardado.map(item => ({
      ...item,
      cantidad:
        item.cantidad ??
        item.quantity ??
        1
    }))
  })


  const [mensaje, setMensaje] =
    useState('')


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


  function aumentarCantidad(id) {

    setMensaje('')


    const productos =
      JSON.parse(localStorage.getItem('productos')) ||
      productosIniciales


    const productoActual =
      productos.find(
        producto => producto.id === id
      )


    const itemCarrito =
      carrito.find(
        item => item.id === id
      )


    if (!productoActual) {

      setMensaje(
        'Este producto ya no está disponible.'
      )

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


    const carritoActualizado =
      carrito.map(item => {

        if (item.id === id) {

          const nuevaCantidad =
            item.cantidad + 1

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


    const carritoActualizado =
      carrito.map(item => {

        if (
          item.id === id &&
          item.cantidad > 1
        ) {

          const nuevaCantidad =
            item.cantidad - 1

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


    const carritoActualizado =
      carrito.filter(
        item => item.id !== id
      )


    guardarCarrito(carritoActualizado)
  }


  function vaciarCarrito() {

    setMensaje('')

    localStorage.removeItem('carrito')

    setCarrito([])

    window.dispatchEvent(
      new Event('carritoActualizado')
    )
  }


  const total =
    carrito.reduce(
      (acumulador, item) =>
        acumulador +
        Number(item.price) * item.cantidad,
      0
    )


  const cantidadTotal =
    carrito.reduce(
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

          <h1>
            Carrito
          </h1>

          <p>
            Revisa los productos antes de continuar con la compra.
          </p>

        </div>

      </section>


      <section className="section">

        <div className="container">


          {mensaje && (

            <div
              className="form-message error"
              style={{
                marginBottom: '20px'
              }}
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

              <h2>
                Resumen
              </h2>


              <div className="summary-line">

                <span>
                  Productos
                </span>

                <span>
                  {cantidadTotal}
                </span>

              </div>


              <div className="summary-line total">

                <span>
                  Total
                </span>

                <span>
                  $
                  {total.toLocaleString('es-CL')}
                </span>

              </div>


              {carrito.length > 0 ? (

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