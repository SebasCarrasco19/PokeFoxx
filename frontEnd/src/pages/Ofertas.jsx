import ProductCard from '../components/ProductCard'

function Ofertas() {

  const productos = [
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

  const productosEnOferta = productos.filter(
    producto => producto.onSale
  )

  return (
    <main>

      <section className="page-header">

        <div className="container">

          <span className="eyebrow">
            Promociones
          </span>

          <h1>
            Ofertas
          </h1>

          <p>
            Encuentra productos seleccionados con precios especiales.
          </p>

        </div>

      </section>


      <section className="section">

        <div className="container">

          <div className="product-grid">

            {productosEnOferta.map(producto => (
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

export default Ofertas