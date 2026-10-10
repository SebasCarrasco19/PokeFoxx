import { Link } from 'react-router-dom'

function CategoryCard({ categoria }) {
  return (
    <article className="content-card">

      <span className="eyebrow">
        Categoría
      </span>

      <h3>
        {categoria.nombre}
      </h3>

      <p>
        {categoria.descripcion}
      </p>

      <Link
        className="btn btn-primary"
        to={`/categorias/${categoria.slug}`}
      >
        Ver productos
      </Link>

    </article>
  )
}

export default CategoryCard