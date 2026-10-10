import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'

function Home() {

const productosDestacados = [
  {
    id: 1,
    name: 'Ascended Heroes Booster Pack - ME: Ascended Heroes (ASC)',
    price: 7990,
    originalPrice: 9990,
    onSale: true,
    game: 'Pokémon',
    stock: 8,
    category: 'Sobres sellados',
    image: '/assets/img/sobre-pk.png'
  },
  {
    id: 2,
    name: 'Donquixote Doflamingo',
    price: 7500,
    originalPrice: 10000,
    onSale: false,
    game: 'One Piece',
    stock: 5,
    category: 'Cartas individuales',
    image: '/assets/img/doffy.png'
  },
  {
    id: 3,
    name: 'Monkey.D.Luffy (OP05-119)',
    price: 600000,
    originalPrice: 800000,
    onSale: true,
    game: 'One Piece',
    stock: 10,
    category: 'Cartas individuales',
    image: '/assets/img/Monkey.D.Luffy (OP05-119).jpg'
  },
  {
    id: 4,
    name: 'Pikachu - 042/128 - ME: 30th Celebration (30C)',
    price: 4990,
    originalPrice: 4990,
    onSale: false,
    game: 'Pokémon',
    stock: 24,
    category: 'Sobres sellados',
    image: '/assets/img/pikachu.png'
  }
]

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

              <Link
                className="btn btn-secondary"
                to="/registro"
              >
                Crear cuenta
              </Link>

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


          <div className="product-grid">

            {productosDestacados.map(producto => (
              <ProductCard
                key={producto.id}
                producto={producto}
              />
            ))}

          </div>

        </div>

      </section>

    </main>
  )
}

export default Home