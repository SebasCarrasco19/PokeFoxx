
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function AdminProductoDetalle() {

  const { id } = useParams()

  const sesion = JSON.parse(
    localStorage.getItem('sesion') || 'null'
  )

  const esAdministrador =
    sesion?.role === 'Administrador'

  const [producto, setProducto] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {

    const controlador = new AbortController()

    async function cargarProducto() {

      try {

        setCargando(true)
        setError('')
        setProducto(null)

        const respuesta = await fetch(
          `http://localhost:8080/api/v1/productos/${id}`,
          {
            signal: controlador.signal
          }
        )

        if (!respuesta.ok) {

          if (respuesta.status === 404) {
            throw new Error('Producto no encontrado.')
          }

          throw new Error(
            'No fue posible obtener el producto.'
          )
        }

        const datos = await respuesta.json()

        if (!controlador.signal.aborted) {
          setProducto(datos)
        }

      } catch (error) {

        if (error.name !== 'AbortError') {
          setError(
            error.message ||
            'Ocurrió un error al cargar el producto.'
          )
        }

      } finally {

        if (!controlador.signal.aborted) {
          setCargando(false)
        }

      }
    }

    cargarProducto()

    return () => controlador.abort()

  }, [id])

  if (cargando) {

    return (
      <div className="content-card">
        Cargando producto...
      </div>
    )
  }

  if (error || !producto) {

    return (
      <div className="content-card">

        <h1>
          {error || 'Producto no encontrado.'}
        </h1>

        <Link
          className="btn btn-primary"
          to="/admin/productos"
        >
          Volver a productos
        </Link>

      </div>
    )
  }

  const categoria =
    producto.categoria?.name ??
    producto.categoria?.nombre ??
    (typeof producto.categoria === 'string'
      ? producto.categoria
      : null) ??
    producto.category?.name ??
    producto.category ??
    'Sin categoría'

  return (
    <>

      <div className="admin-title">

        <h1>
          Detalle de producto
        </h1>

        <p>
          Información actual del producto y su inventario.
        </p>

      </div>

      <section className="content-card">

        <h2>
          {producto.name}
        </h2>

        <p>
          {producto.description || 'Sin descripción.'}
        </p>

        <p>
          <strong>Código:</strong>{' '}
          {producto.code}
        </p>

        <p>
          <strong>Categoría:</strong>{' '}
          {categoria}
        </p>

        <p>
          <strong>Juego:</strong>{' '}
          {producto.game}
        </p>

        <p>
          <strong>Precio:</strong>{' '}
          ${Number(producto.price).toLocaleString('es-CL')}
        </p>

        <p>
          <strong>Precio original:</strong>{' '}
          ${Number(
            producto.originalPrice ?? producto.price
          ).toLocaleString('es-CL')}
        </p>

        <p>
          <strong>Stock actual:</strong>{' '}
          {producto.stock}
        </p>

        <p>
          <strong>Stock crítico:</strong>{' '}
          {producto.criticalStock}
        </p>

        <p>
          <strong>Oferta:</strong>{' '}
          {producto.onSale ? 'Sí' : 'No'}
        </p>

        <div className="admin-button-row">

          {esAdministrador && (

            <Link
              className="btn btn-primary"
              to={`/admin/productos/${id}/editar`}
            >
              Editar producto
            </Link>

          )}

          <Link
            className="btn btn-secondary"
            to="/admin/productos"
          >
            Volver
          </Link>

          {esAdministrador && (

            <Link
              className="btn btn-secondary"
              to="/admin/reportes"
            >
              Reportes
            </Link>

          )}

        </div>

      </section>

    </>
  )
}
