import { useState } from 'react'
import { Link } from 'react-router-dom'
import { productosIniciales } from '../../data/adminData'

function AdminProductos() {

  const [productos, setProductos] = useState(() => {

    const productosGuardados =
      localStorage.getItem('productos')

    if (productosGuardados) {
      return JSON.parse(productosGuardados)
    }

    localStorage.setItem(
      'productos',
      JSON.stringify(productosIniciales)
    )

    return productosIniciales
  })


  const [productoAEliminar, setProductoAEliminar] =
    useState(null)

  const [mensaje, setMensaje] =
    useState('')


  function solicitarEliminar(producto) {

    setMensaje('')
    setProductoAEliminar(producto)
  }


  function cancelarEliminar() {

    setProductoAEliminar(null)
  }


  function confirmarEliminar() {

    if (!productoAEliminar) {
      return
    }


    const productosActualizados =
      productos.filter(
        producto =>
          producto.id !== productoAEliminar.id
      )


    setProductos(productosActualizados)


    localStorage.setItem(
      'productos',
      JSON.stringify(productosActualizados)
    )


    setMensaje(
      `Producto "${productoAEliminar.name}" eliminado correctamente.`
    )


    setProductoAEliminar(null)
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

        <Link
          className="btn btn-primary"
          to="/admin/productos/nuevo"
        >
          Nuevo producto
        </Link>

      </div>


      {mensaje && (

        <div
          className="form-message success"
          style={{
            marginBottom: '20px'
          }}
        >
          ✅ {mensaje}
        </div>

      )}


      {productoAEliminar && (

        <div
          className="content-card"
          style={{
            marginBottom: '20px'
          }}
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
            >
              Sí, eliminar
            </button>


            <button
              className="btn btn-secondary"
              type="button"
              onClick={cancelarEliminar}
            >
              Cancelar
            </button>

          </div>

        </div>

      )}


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

            {productos.map(producto => (

              <tr key={producto.id}>

                <td>
                  {producto.code}
                </td>

                <td>
                  {producto.name}
                </td>

                <td>
                  {producto.category}
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


                    <button
                      className="btn btn-danger btn-sm"
                      type="button"
                      onClick={() =>
                        solicitarEliminar(producto)
                      }
                    >
                      Eliminar
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </>
  )
}

export default AdminProductos