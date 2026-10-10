import CategoryCard from '../components/CategoryCard'

function Categorias() {

  const categorias = [
    {
      id: 1,
      nombre: 'Sobres sellados',
      slug: 'sobres-sellados',
      descripcion: 'Sobres de Pokémon, One Piece y otros TCG.'
    },
    {
      id: 2,
      nombre: 'Cartas individuales',
      slug: 'cartas-individuales',
      descripcion: 'Cartas individuales para jugadores y coleccionistas.'
    },
    {
      id: 3,
      nombre: 'Mazos',
      slug: 'mazos',
      descripcion: 'Mazos preparados para comenzar a jugar.'
    },
    {
      id: 4,
      nombre: 'Accesorios',
      slug: 'accesorios',
      descripcion: 'Protectores y accesorios para tus cartas.'
    }
  ]

  return (
    <main>

      <section className="page-header">

        <div className="container">

          <span className="eyebrow">
            Catálogo
          </span>

          <h1>
            Categorías
          </h1>

          <p>
            Explora nuestros productos según el tipo que estás buscando.
          </p>

        </div>

      </section>


      <section className="section">

        <div className="container">

          <div className="two-col">

            {categorias.map(categoria => (
              <CategoryCard
                key={categoria.id}
                categoria={categoria}
              />
            ))}

          </div>

        </div>

      </section>

    </main>
  )
}

export default Categorias