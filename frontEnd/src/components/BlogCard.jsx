import { Link } from 'react-router-dom'

function BlogCard({ articulo }) {
  return (
    <article className="blog-card">

      <img
        src={articulo.imagen}
        alt={articulo.titulo}
      />

      <div>

        <span className="eyebrow">
          Blog
        </span>

        <h2>
          {articulo.titulo}
        </h2>

        <p>
          {articulo.resumen}
        </p>

        <Link
          className="btn btn-primary"
          to={articulo.ruta}
        >
          Leer artículo
        </Link>

      </div>

    </article>
  )
}

export default BlogCard