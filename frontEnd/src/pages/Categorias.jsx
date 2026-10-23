import CategoryCard from '../components/CategoryCard'
import { categorias as categoriasIniciales } from '../data/adminData'

function Categorias() {

  const categoriasGuardadas =
    JSON.parse(localStorage.getItem('categorias')) ||
    categoriasIniciales


  const categorias = categoriasGuardadas.map(
    (nombre, index) => {

      const slug = nombre
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')

      return {
        id: index + 1,
        nombre: nombre,
        slug: slug,
        descripcion: `Explora los productos disponibles en ${nombre}.`
      }
    }
  )


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