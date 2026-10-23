import { Link } from 'react-router-dom'

function BlogDetalle2() {

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

            Consejos para comenzar tu colección

          </div>


          <span className="eyebrow">
            Blog
          </span>


          <h1>
            Consejos para comenzar tu colección
          </h1>


          <p>
            Algunas recomendaciones para comenzar
            en el mundo de los juegos de cartas coleccionables.
          </p>

        </div>

      </section>


      <section className="section">

        <article className="blog-detail-container article">

          <div className="video-showcase">

            <div className="tiktok-video-grande">

              <iframe
                src="https://www.tiktok.com/player/v1/7413170565210557701"
                title="Video sobre colección TCG"
                allowFullScreen
              />

            </div>

          </div>


          <div className="blog-detail-text">

            <h2>
              Elige un juego que te guste
            </h2>

            <p>
              Antes de comprar productos, revisa qué juego TCG
              te interesa más y qué tipo de cartas quieres
              coleccionar.
            </p>

            <p>
              Puedes comenzar con Pokémon, One Piece,
              Magic: The Gathering u otros juegos.
            </p>


            <h2>
              Organiza tu colección
            </h2>

            <p>
              Separar las cartas por juego, colección o rareza
              facilita mantenerlas ordenadas y saber cuáles
              ya tienes.
            </p>

          </div>

        </article>

      </section>

    </main>
  )
}

export default BlogDetalle2