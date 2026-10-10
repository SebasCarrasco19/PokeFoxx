import { useState } from 'react'
import { Link } from 'react-router-dom'
import CartItem from '../components/CartItem'

function Carrito() {

  const [carrito, setCarrito] = useState([
    {
      id: 1,
      name: 'Ascended Heroes Booster Pack',
      price: 7990,
      stock: 8,
      cantidad: 1,
      category: 'Sobres sellados',
      image: '/assets/img/sobre-pk.png'
    },
    {
      id: 2,
      name: 'Donquixote Doflamingo',
      price: 7500,
      stock: 5,
      cantidad: 1,
      category: 'Cartas individuales',
      image: '/assets/img/doffy.png'
    }
  ])

  function aumentar(id) {
    setCarrito(
      carrito.map(item => {
        if (
          item.id === id &&
          item.cantidad < item.stock
        ) {
          return {
            ...item,
            cantidad: item.cantidad + 1
          }
        }

        return item
      })
    )
  }

  function disminuir(id) {
    setCarrito(
      carrito.map(item => {
        if (item.id === id) {
          return {
            ...item,
            cantidad: Math.max(
              1,
              item.cantidad - 1
            )
          }
        }

        return item
      })
    )
  }

  function eliminar(id) {
    setCarrito(
      carrito.filter(item => item.id !== id)
    )
  }

  function vaciarCarrito() {
    const confirmar = window.confirm(
      '¿Estás seguro de que quieres vaciar todo el carrito?'
    )

    if (confirmar) {
      setCarrito([])
    }
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
                  aumentar={aumentar}
                  disminuir={disminuir}
                  eliminar={eliminar}
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