import BlogCard from '../components/BlogCard'

function Blog() {

  const articulos = [
    {
      id: 1,
      titulo: 'Cómo cuidar tus cartas',
      resumen:
        'Consejos básicos para proteger tus cartas y mantenerlas en buen estado.',
      imagen: '/assets/img/blog-1.svg',
      ruta: '/blog/1'
    },
    {
      id: 2,
      titulo: 'Consejos para comenzar tu colección',
      resumen:
        'Recomendaciones para organizar tu colección y elegir tus primeros productos TCG.',
      imagen: '/assets/img/blog-2.svg',
      ruta: '/blog/2'
    }
  ]

  return (
    <main>

      <section className="page-header">

        <div className="container">

          <span className="eyebrow">
            Blog
          </span>

          <h1>
            Noticias y consejos TCG
          </h1>

          <p>
            Revisa consejos para jugadores y coleccionistas de cartas.
          </p>

        </div>

      </section>


      <section className="section">

        <div className="container blog-list">

          {articulos.map(articulo => (
            <BlogCard
              key={articulo.id}
              articulo={articulo}
            />
          ))}

        </div>

      </section>

    </main>
  )
}

export default Blog