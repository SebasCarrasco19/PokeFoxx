import { useState } from 'react'
import { Link } from 'react-router-dom'
import { productosIniciales } from '../../data/adminData'

function AdminProductos() {

  const [productos] = useState(() => {

    const productosGuardados = localStorage.getItem('productos')

    if (productosGuardados) {
      return JSON.parse(productosGuardados)
    }

    localStorage.setItem(
      'productos',
      JSON.stringify(productosIniciales)
    )

    return productosIniciales
  })

  return (
    <>
      <div className="admin-title">
        <h1>Productos</h1>
        <p>Listado de productos disponibles en la tienda.</p>
      </div>

      <div className="admin-toolbar">
        <span>{productos.length} producto(s) registrados.</span>

        <Link
          className="btn btn-primary"
          to="/admin/productos/nuevo"
        >
          Nuevo producto
        </Link>
      </div>

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

            {productos.map((producto) => (

              <tr key={producto.id}>

                <td>{producto.code}</td>

                <td>{producto.name}</td>

                <td>{producto.category}</td>

                <td>
                  ${Number(producto.price).toLocaleString('es-CL')}
                </td>

                <td>{producto.stock}</td>

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
                      disabled
                      title="Disponible en una próxima etapa"
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