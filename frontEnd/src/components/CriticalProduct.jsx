function CriticalProduct({ producto }) {
  return (
    <article className="content-card">

      <span className="eyebrow">
        Stock crítico
      </span>

      <h3>
        {producto.name}
      </h3>

      <p>
        <strong>Categoría:</strong> {producto.category}
      </p>

      <p>
        <strong>Stock actual:</strong> {producto.stock}
      </p>

      <p>
        <strong>Stock crítico:</strong> {producto.criticalStock}
      </p>

      <p>
        <strong>Juego:</strong> {producto.game}
      </p>

    </article>
  )
}

export default CriticalProduct