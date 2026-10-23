import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { productosIniciales } from '../data/adminData'

function Home() {

  const productos =
    JSON.parse(localStorage.getItem('productos')) ||
    productosIniciales


  const productosDestacados =
    productos.slice(0, 4)


  const sesion =
    JSON.parse(localStorage.getItem('sesion'))


  return (
    <main>

      <section className="hero">

        <div className="container hero-grid">

          <div>

            <span className="eyebrow">
              Tienda online TCG
            </span>

            <h1>
              Encuentra cartas y accesorios para tu colección.
            </h1>

            <p className="lead">
              Explora productos de Pokémon, One Piece,
              Magic: The Gathering y otros juegos de cartas
              coleccionables.
            </p>


            <div className="hero-actions">

              <Link
                className="btn btn-primary"
                to="/productos"
              >
                Ver productos
              </Link>


              {!sesion ? (

                <Link
                  className="btn btn-secondary"
                  to="/registro"
                >
                  Crear cuenta
                </Link>

              ) : sesion.role === 'Cliente' ? (

                <Link
                  className="btn btn-secondary"
                  to="/perfil"
                >
                  Mi perfil
                </Link>

              ) : (

                <Link
                  className="btn btn-secondary"
                  to="/admin"
                >
                  Administración
                </Link>

              )}

            </div>

          </div>


          <div className="hero-art">

            <img
              src="/assets/img/hero.jpg"
              alt="Productos TCG"
            />

          </div>

        </div>

      </section>


      <section className="section">

        <div className="container">

          <div className="section-header">

            <div>

              <span className="eyebrow">
                Catálogo
              </span>

              <h2>
                Productos destacados
              </h2>

              <p>
                Algunos productos disponibles en PokeFoxx.
              </p>

            </div>


            <Link
              className="btn btn-secondary"
              to="/productos"
            >
              Ver todos
            </Link>

          </div>


          {productosDestacados.length > 0 ? (

            <div className="product-grid">

              {productosDestacados.map(producto => (

                <ProductCard
                  key={producto.id}
                  producto={producto}
                />

              ))}

            </div>

          ) : (

            <div className="content-card empty-state">

              <h2>
                No hay productos disponibles
              </h2>

              <p>
                Todavía no hay productos registrados en la tienda.
              </p>

            </div>

          )}

        </div>

      </section>

    </main>
  )
}

export default Home