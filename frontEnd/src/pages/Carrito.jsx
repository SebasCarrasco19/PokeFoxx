import { Link } from 'react-router-dom'
import CartItem from '../components/CartItem'

function Carrito() {

  const carrito = [
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
  ]

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
              disabled title="Disponible en una próxima etapa"
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