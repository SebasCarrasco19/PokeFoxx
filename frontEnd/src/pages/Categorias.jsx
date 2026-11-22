
import { useEffect, useState } from 'react'
import CategoryCard from '../components/CategoryCard'

function Categorias() {

  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {

    const controlador = new AbortController()

    async function cargarCategorias() {

      try {

        setCargando(true)
        setError('')

        const respuesta = await fetch(
          'http://localhost:8080/api/v1/categorias',
          {
            signal: controlador.signal
          }
        )

        if (!respuesta.ok) {
          throw new Error(
            'No fue posible obtener las categorías.'
          )
        }

        const datos = await respuesta.json()

        if (!Array.isArray(datos)) {
          throw new Error(
            'El servidor devolvió un formato incorrecto.'
          )
        }

        // Adaptar las categorías para CategoryCard
        const categoriasAdaptadas = datos
          .filter(categoria => categoria.active !== false)
          .map(categoria => {

            const nombre = categoria.name

            const slug = nombre
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/\s+/g, '-')

            return {
              id: categoria.id,
              nombre,
              slug,
              descripcion:
                categoria.description ||
                `Explora los productos disponibles en ${nombre}.`
            }
          })

        if (!controlador.signal.aborted) {
          setCategorias(categoriasAdaptadas)
        }

      } catch (error) {

        if (error.name !== 'AbortError') {
          setError(
            error.message ||
            'No fue posible cargar las categorías.'
          )
        }

      } finally {

        if (!controlador.signal.aborted) {
          setCargando(false)
        }

      }
    }

    cargarCategorias()

    return () => controlador.abort()

  }, [])

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

          {cargando && (
            <div className="content-card empty-state">
              <h2>Cargando categorías...</h2>
            </div>
          )}

          {error && (
            <div className="form-message error">
              ⚠️ {error}
            </div>
          )}

          {!cargando && !error && (

            categorias.length > 0 ? (

              <div className="two-col">

                {categorias.map(categoria => (

                  <CategoryCard
                    key={categoria.id}
                    categoria={categoria}
                  />

                ))}

              </div>

            ) : (

              <div className="content-card empty-state">

                <h2>
                  No hay categorías disponibles
                </h2>

                <p>
                  Todavía no hay categorías activas en la tienda.
                </p>

              </div>

            )

          )}

        </div>

      </section>

    </main>
  )
}

export default Categorias
