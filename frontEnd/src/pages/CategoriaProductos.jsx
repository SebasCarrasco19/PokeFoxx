
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import ProductCard from '../components/ProductCard'

function CategoriaProductos() {

  const { categoria } = useParams()

  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])

  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  // Crear URL amigable para cada categoría
  function crearSlug(texto) {

    return String(texto || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .replace(/\s+/g, '-')

  }

  // Obtener productos y categorías desde Spring Boot
  useEffect(() => {

    const controlador = new AbortController()

    async function cargarDatos() {

      try {

        setCargando(true)
        setError('')

        const [respuestaProductos, respuestaCategorias] =
          await Promise.all([

            fetch(
              'http://localhost:8080/api/v1/productos',
              {
                signal: controlador.signal
              }
            ),

            fetch(
              'http://localhost:8080/api/v1/categorias',
              {
                signal: controlador.signal
              }
            )

          ])

        if (!respuestaProductos.ok) {
          throw new Error(
            'No fue posible cargar los productos.'
          )
        }

        if (!respuestaCategorias.ok) {
          throw new Error(
            'No fue posible cargar las categorías.'
          )
        }

        const datosProductos =
          await respuestaProductos.json()

        const datosCategorias =
          await respuestaCategorias.json()

        if (
          !Array.isArray(datosProductos) ||
          !Array.isArray(datosCategorias)
        ) {

          throw new Error(
            'El servidor devolvió datos incorrectos.'
          )

        }

        if (!controlador.signal.aborted) {

          setProductos(datosProductos)
          setCategorias(datosCategorias)

        }

      } catch (error) {

        if (error.name !== 'AbortError') {

          setError(
            error.message ||
            'No fue posible cargar la categoría.'
          )

        }

      } finally {

        if (!controlador.signal.aborted) {
          setCargando(false)
        }

      }

    }

    cargarDatos()

    return () => controlador.abort()

  }, [])

  // Buscar la categoría real usando el slug de la URL
  const categoriaActual = categorias.find(
    item =>
      item.active === true &&
      crearSlug(item.name) === categoria
  )

  const nombreCategoria =
    categoriaActual?.name || null

  // Filtrar productos por el ID real de la categoría
  const productosCategoria = categoriaActual
    ? productos.filter(
        producto =>
          Number(producto.categoria?.id) ===
          Number(categoriaActual.id)
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

            {cargando
              ? 'Cargando...'
              : nombreCategoria || 'Categoría'}

          </div>

          <span className="eyebrow">
            Categoría
          </span>

          <h1>
            {cargando
              ? 'Cargando categoría...'
              : nombreCategoria || 'Categoría no encontrada'}
          </h1>

          <p>
            {cargando
              ? 'Estamos cargando los productos disponibles.'
              : nombreCategoria
                ? 'Productos disponibles en esta categoría.'
                : error
                  ? 'No fue posible consultar esta categoría.'
                  : 'La categoría solicitada no existe.'}
          </p>

        </div>

      </section>

      <section className="section">

        <div className="container">

          {/* Estado de carga */}

          {cargando && (

            <div className="content-card">

              <p>
                Cargando productos de la categoría...
              </p>

            </div>

          )}

          {/* Error al consultar el backend */}

          {!cargando && error && (

            <div className="content-card">

              <h2>
                No se pudo cargar la categoría
              </h2>

              <p className="form-message error">
                {error}
              </p>

              <Link
                className="btn btn-secondary"
                to="/categorias"
              >
                Volver a categorías
              </Link>

            </div>

          )}

          {/* Productos encontrados */}

          {!cargando &&
            !error &&
            productosCategoria.length > 0 && (

              <div className="product-grid">

                {productosCategoria.map(producto => (

                  <ProductCard
                    key={producto.id}
                    producto={producto}
                  />

                ))}

              </div>

            )}

          {/* Categoría vacía o inexistente */}

          {!cargando &&
            !error &&
            productosCategoria.length === 0 && (

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
