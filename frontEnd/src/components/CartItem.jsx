function CartItem({ item }) {

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
            disabled title="Disponible en una próxima etapa"
          >
            −
          </button>

          <span>
            {item.cantidad}
          </span>

          <button
            className="qty-btn"
            type="button"
            disabled title="Disponible en una próxima etapa"
          >
            +
          </button>

          <button
            className="btn btn-danger btn-sm"
            type="button"
            disabled title="Disponible en una próxima etapa"
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