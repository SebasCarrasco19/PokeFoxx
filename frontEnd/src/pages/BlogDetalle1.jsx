import { Link } from 'react-router-dom'

function BlogDetalle1() {

  return (
    <main>

      <section className="page-header">

        <div className="blog-detail-container">

          <div className="breadcrumb">

            <Link to="/">
              Inicio
            </Link>

            {' / '}

            <Link to="/blog">
              Blog
            </Link>

            {' / '}

            Cómo cuidar tus cartas

          </div>


          <span className="eyebrow">
            Blog
          </span>


          <h1>
            Cómo cuidar tus cartas
          </h1>


          <p>
            Consejos para mantener tus cartas protegidas
            y en buenas condiciones.
          </p>

        </div>

      </section>


      <section className="section">

        <article className="blog-detail-container article">

          <div className="video-showcase">

            <div className="tiktok-video-grande">

              <iframe
                src="https://www.tiktok.com/player/v1/7674328688728591624"
                title="Video sobre cuidado de cartas"
                allowFullScreen
              />

            </div>

          </div>


          <div className="blog-detail-text">

            <h2>
              Protege tu colección
            </h2>


            <p>
              Una buena protección ayuda a mantener el estado
              de tus cartas y evitar daños por polvo, humedad
              o manipulación constante.
            </p>


            <p>
              Utiliza protectores adecuados y evita dejar las
              cartas expuestas directamente al sol.
            </p>


            <h2>
              Guarda tus cartas correctamente
            </h2>


            <p>
              Puedes utilizar carpetas, cajas o fundas rígidas
              para organizar y proteger las cartas más importantes
              de tu colección.
            </p>

          </div>

        </article>

      </section>

    </main>
  )
}

export default BlogDetalle1