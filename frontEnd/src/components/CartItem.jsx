function CartItem({
  item,
  aumentar,
  disminuir,
  eliminar
}) {

  const precio =
    Number(item.price)

  const subtotal =
    precio * item.cantidad


  return (
    <article className="cart-item">

      <img
        src={item.image}
        alt={item.name}
      />


      <div>

        <h3>
          {item.name}
        </h3>


        <div className="product-meta">
          {item.category}
        </div>


        <strong>
          $
          {precio.toLocaleString('es-CL')}
        </strong>


        <div className="cart-controls">

          <button
            className="qty-btn"
            type="button"
            onClick={() =>
              disminuir(item.id)
            }
            disabled={item.cantidad <= 1}
          >
            −
          </button>


          <span>
            {item.cantidad}
          </span>


          <button
            className="qty-btn"
            type="button"
            onClick={() =>
              aumentar(item.id)
            }
          >
            +
          </button>


          <button
            className="btn btn-danger btn-sm"
            type="button"
            onClick={() =>
              eliminar(item.id)
            }
          >
            Eliminar
          </button>

        </div>

      </div>


      <div>

        <strong>
          $
          {subtotal.toLocaleString('es-CL')}
        </strong>

      </div>

    </article>
  )
}

export default CartItem