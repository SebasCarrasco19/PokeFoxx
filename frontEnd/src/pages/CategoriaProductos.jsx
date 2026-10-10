import { Link, useParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'

function CategoriaProductos() {

  const { categoria } = useParams()

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
      categorySlug: 'sobres-sellados',
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
      categorySlug: 'cartas-individuales',
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
      categorySlug: 'cartas-individuales',
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
      categorySlug: 'sobres-sellados',
      image: '/assets/img/pikachu.png'
    },
    {
      id: 5,
      name: 'Starter Deck',
      price: 18990,
      originalPrice: 21990,
      onSale: true,
      game: 'One Piece',
      stock: 6,
      category: 'Mazos',
      categorySlug: 'mazos'
    },
    {
      id: 6,
      name: 'Protectores TCG',
      price: 6990,
      originalPrice: 6990,
      onSale: false,
      game: 'Magic',
      stock: 30,
      category: 'Accesorios',
      categorySlug: 'accesorios'
    }
  ]

  const productosCategoria = productos.filter(
    producto => producto.categorySlug === categoria
  )

  const nombreCategoria =
    productosCategoria.length > 0
      ? productosCategoria[0].category
      : 'Categoría'

  return (
    <main>

      <section className="page-header">

        <div className="container">

          <div className="breadcrumb">

            <Link to="/">
              Inicio
            </Link>

            {' / '}

            <Link to="/categorias">
              Categorías
            </Link>

            {' / '}

            {nombreCategoria}

          </div>

          <span className="eyebrow">
            Categoría
          </span>

          <h1>
            {nombreCategoria}
          </h1>

          <p>
            Productos disponibles en esta categoría.
          </p>

        </div>

      </section>


      <section className="section">

        <div className="container">

          {productosCategoria.length > 0 ? (

            <div className="product-grid">

              {productosCategoria.map(producto => (
                <ProductCard
                  key={producto.id}
                  producto={producto}
                />
              ))}

            </div>

          ) : (

            <div className="content-card empty-state">

              <h2>
                No hay productos
              </h2>

              <p>
                No encontramos productos para esta categoría.
              </p>

              <Link
                className="btn btn-primary"
                to="/categorias"
              >
                Volver a categorías
              </Link>

            </div>

          )}

        </div>

      </section>

    </main>
  )
}

export default CategoriaProductos