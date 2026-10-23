import { Link, useParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import {
  productosIniciales,
  categorias as categoriasIniciales
} from '../data/adminData'

function CategoriaProductos() {

  const { categoria } = useParams()


  function crearSlug(texto) {

    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
  }


  const productos =
    JSON.parse(localStorage.getItem('productos')) ||
    productosIniciales


  const categorias =
    JSON.parse(localStorage.getItem('categorias')) ||
    categoriasIniciales


  const nombreCategoria =
    categorias.find(
      nombre => crearSlug(nombre) === categoria
    )


  const productosCategoria =
    nombreCategoria
      ? productos.filter(
          producto =>
            producto.category === nombreCategoria
        )
      : []


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

            {nombreCategoria || 'Categoría'}

          </div>


          <span className="eyebrow">
            Categoría
          </span>


          <h1>
            {nombreCategoria || 'Categoría no encontrada'}
          </h1>


          <p>
            {nombreCategoria
              ? 'Productos disponibles en esta categoría.'
              : 'La categoría solicitada no existe.'}
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
                {nombreCategoria
                  ? 'No hay productos'
                  : 'Categoría no encontrada'}
              </h2>


              <p>
                {nombreCategoria
                  ? 'Todavía no hay productos registrados en esta categoría.'
                  : 'La categoría que intentas visitar no existe.'}
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