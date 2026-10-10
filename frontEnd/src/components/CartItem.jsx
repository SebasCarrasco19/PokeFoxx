function CartItem({
  item,
  aumentar,
  disminuir,
  eliminar
}) {

  const subtotal = item.price * item.cantidad

  return (
    <article className="cart-item">

      <img
        src={item.image}
        alt={item.name}
      />

      <div>

        <h3>{item.name}</h3>

        <div className="product-meta">
          {item.category}
        </div>

        <strong>
          ${item.price.toLocaleString('es-CL')}
        </strong>

        <div className="cart-controls">

          <button
            className="qty-btn"
            type="button"
            onClick={() => disminuir(item.id)}
          >
            −
          </button>

          <span>
            {item.cantidad}
          </span>

          <button
            className="qty-btn"
            type="button"
            onClick={() => aumentar(item.id)}
          >
            +
          </button>

          <button
            className="btn btn-danger btn-sm"
            type="button"
            onClick={() => eliminar(item.id)}
          >
            Eliminar
          </button>

        </div>

      </div>

      <div>
        <strong>
          ${subtotal.toLocaleString('es-CL')}
        </strong>
      </div>

    </article>
  )
}

export default CartItem