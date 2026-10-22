import { useState } from 'react'
import { Link } from 'react-router-dom'
import CartItem from '../components/CartItem'

function Carrito() {

  const [carrito, setCarrito] = useState(() => {

    const carritoGuardado =
      JSON.parse(localStorage.getItem('carrito')) || []

    return carritoGuardado.map(item => ({
      ...item,
      cantidad: item.quantity ?? item.cantidad ?? 1
    }))
  })


  const aumentarCantidad = (id) => {

    const carritoActualizado = carrito.map(item => {

      if (item.id === id) {

        if (item.cantidad >= item.stock) {
          alert('No hay más stock disponible')
          return item
        }

        return {
          ...item,
          cantidad: item.cantidad + 1,
          quantity: item.cantidad + 1
        }
      }

      return item
    })

    setCarrito(carritoActualizado)

    localStorage.setItem(
      'carrito',
      JSON.stringify(carritoActualizado)
    )
  }


  const disminuirCantidad = (id) => {

    const carritoActualizado = carrito.map(item => {

      if (item.id === id && item.cantidad > 1) {

        return {
          ...item,
          cantidad: item.cantidad - 1,
          quantity: item.cantidad - 1
        }
      }

      return item
    })

    setCarrito(carritoActualizado)

    localStorage.setItem(
      'carrito',
      JSON.stringify(carritoActualizado)
    )
  }


  const eliminarProducto = (id) => {

    const carritoActualizado = carrito.filter(
      item => item.id !== id
    )

    setCarrito(carritoActualizado)

    localStorage.setItem(
      'carrito',
      JSON.stringify(carritoActualizado)
    )
  }


  const vaciarCarrito = () => {

    setCarrito([])

    localStorage.setItem(
      'carrito',
      JSON.stringify([])
    )
  }


  const total = carrito.reduce(
    (acumulador, item) =>
      acumulador + item.price * item.cantidad,
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

          <h1>
            Carrito
          </h1>

          <p>
            Revisa los productos antes de continuar con la compra.
          </p>

        </div>

      </section>


      <section className="section">

        <div className="container cart-layout">

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
                ${total.toLocaleString('es-CL')}
              </span>

            </div>


            <Link
              className="btn btn-primary cart-pay"
              to="/checkout"
            >
              Continuar compra
            </Link>


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

      </section>

    </main>
  )
}

export default Carrito