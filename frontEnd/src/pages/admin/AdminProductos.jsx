
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function AdminProductos() {

  const sesion = JSON.parse(
    localStorage.getItem('sesion') || 'null'
  )

  const esAdministrador =
    sesion?.role === 'Administrador'

  const [productos, setProductos] = useState([])
  const [productoAEliminar, setProductoAEliminar] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [tipoMensaje, setTipoMensaje] = useState('success')
  const [cargando, setCargando] = useState(true)
  const [eliminando, setEliminando] = useState(false)

  useEffect(() => {

    const controlador = new AbortController()

    async function cargarProductos() {

      try {

        setCargando(true)

        const respuesta = await fetch(
          'http://localhost:8080/api/v1/productos',
          {
            signal: controlador.signal
          }
        )

        if (!respuesta.ok) {
          throw new Error(
            'No fue posible obtener los productos.'
          )
        }

        const datos = await respuesta.json()

        if (!Array.isArray(datos)) {
          throw new Error(
            'El servidor devolvió un formato incorrecto.'
          )
        }

        if (!controlador.signal.aborted) {
          setProductos(datos)
        }

      } catch (error) {

        if (error.name !== 'AbortError') {
          setTipoMensaje('error')
          setMensaje(
            error.message ||
            'No fue posible cargar los productos.'
          )
        }

      } finally {

        if (!controlador.signal.aborted) {
          setCargando(false)
        }

      }
    }

    cargarProductos()

    return () => controlador.abort()

  }, [])

  function solicitarEliminar(producto) {

    if (!esAdministrador) return

    setMensaje('')
    setProductoAEliminar(producto)
  }

  function cancelarEliminar() {

    if (eliminando) return

    setProductoAEliminar(null)
  }

  async function confirmarEliminar() {

    if (!esAdministrador || !productoAEliminar || eliminando) {
      return
    }

    setMensaje('')
    setEliminando(true)

    try {

      const token = localStorage.getItem('token')

      if (!token) {
        throw new Error(
          'Debes iniciar sesión como Administrador.'
        )
      }

      const respuesta = await fetch(
        `http://localhost:8080/api/v1/productos/${productoAEliminar.id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (!respuesta.ok) {

        if (respuesta.status === 401) {
          throw new Error(
            'Tu sesión venció. Inicia sesión nuevamente.'
          )
        }

        if (respuesta.status === 403) {
          throw new Error(
            'No tienes permiso para eliminar productos.'
          )
        }

        if (respuesta.status === 409) {
          throw new Error(
            'No se puede eliminar este producto porque tiene órdenes asociadas.'
          )
        }

        const contenido = await respuesta.text()

        let datos = null

        try {
          datos = contenido ? JSON.parse(contenido) : null
        } catch {
          datos = null
        }

        throw new Error(
          datos?.error ||
          datos?.message ||
          `No fue posible eliminar el producto (HTTP ${respuesta.status}).`
        )
      }

      setProductos(actuales =>
        actuales.filter(
          producto => producto.id !== productoAEliminar.id
        )
      )

      setTipoMensaje('success')
      setMensaje(
        `Producto "${productoAEliminar.name}" eliminado correctamente.`
      )

      setProductoAEliminar(null)

    } catch (error) {

      setTipoMensaje('error')
      setMensaje(
        error.message ||
        'No fue posible eliminar el producto.'
      )

    } finally {

      setEliminando(false)

    }
  }

  return (
    <>

      <div className="admin-title">

        <h1>
          Productos
        </h1>

        <p>
          Listado de productos disponibles en la tienda.
        </p>

      </div>

      <div className="admin-toolbar">

        <span>
          {productos.length} producto(s) registrados.
        </span>

        {esAdministrador && (
          <Link
            className="btn btn-primary"
            to="/admin/productos/nuevo"
          >
            Nuevo producto
          </Link>
        )}

      </div>

      {cargando && (
        <div
          className="content-card"
          style={{ marginBottom: '20px' }}
        >
          Cargando productos...
        </div>
      )}

      {mensaje && (
        <div
          className={`form-message ${tipoMensaje}`}
          style={{ marginBottom: '20px' }}
        >
          {tipoMensaje === 'success' ? '✅' : '⚠️'}{' '}
          {mensaje}
        </div>
      )}

      {esAdministrador && productoAEliminar && (

        <div
          className="content-card"
          style={{ marginBottom: '20px' }}
        >

          <h3>
            ¿Eliminar producto?
          </h3>

          <p>
            ¿Seguro que quieres eliminar{' '}
            <strong>
              {productoAEliminar.name}
            </strong>
            ?
          </p>

          <div className="admin-button-row">

            <button
              className="btn btn-danger"
              type="button"
              onClick={confirmarEliminar}
              disabled={eliminando}
            >
              {eliminando
                ? 'Eliminando...'
                : 'Sí, eliminar'}
            </button>

            <button
              className="btn btn-secondary"
              type="button"
              onClick={cancelarEliminar}
              disabled={eliminando}
            >
              Cancelar
            </button>

          </div>

        </div>

      )}

      {!cargando && (

        <div className="table-wrap">

          <table>

            <thead>

              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>

            </thead>

            <tbody>

              {productos.map(producto => {

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

                  <tr key={producto.id}>

                    <td>
                      {producto.code}
                    </td>

                    <td>
                      {producto.name}
                    </td>

                    <td>
                      {categoria}
                    </td>

                    <td>
                      ${Number(producto.price).toLocaleString('es-CL')}
                    </td>

                    <td>
                      {producto.stock}
                    </td>

                    <td>

                      <div className="table-actions">

                        <Link
                          className="btn btn-secondary btn-sm"
                          to={`/admin/productos/${producto.id}`}
                        >
                          Ver detalle
                        </Link>

                        {esAdministrador && (

                          <button
                            className="btn btn-danger btn-sm"
                            type="button"
                            onClick={() =>
                              solicitarEliminar(producto)
                            }
                          >
                            Eliminar
                          </button>

                        )}

                      </div>

                    </td>

                  </tr>

                )
              })}

            </tbody>

          </table>

        </div>

      )}

    </>
  )
}

export default AdminProductos
