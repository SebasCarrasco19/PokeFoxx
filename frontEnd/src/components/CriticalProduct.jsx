
function CriticalProduct({ producto }) {

  const categoria =
    producto.categoria?.name ??
    producto.categoria?.nombre ??
    (typeof producto.categoria === 'string'
      ? producto.categoria
      : null) ??
    producto.category?.name ??
    producto.category ??
    'Sin categoría'

  return (
    <article className="content-card">

      <span className="eyebrow">
        Stock crítico
      </span>

      <h3>
        {producto.name}
      </h3>

      <p>
        <strong>Categoría:</strong> {categoria}
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
