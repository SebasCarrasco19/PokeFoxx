import { Link, useParams } from 'react-router-dom'
import { productosIniciales } from '../../data/adminData'

export default function AdminProductoDetalle() {

  const { id } = useParams()

  const sesion =
    JSON.parse(localStorage.getItem('sesion'))


  const productos =
    JSON.parse(localStorage.getItem('productos')) ||
    productosIniciales


  const producto = productos.find(
    item => String(item.id) === id
  )


  if (!producto) {

    return (
      <div className="content-card">

        <h1>
          Producto no encontrado
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
          {producto.category}
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
          ${Number(producto.originalPrice || producto.price)
            .toLocaleString('es-CL')}
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

          <Link
            className="btn btn-primary"
            to={`/admin/productos/${id}/editar`}
          >
            Editar producto
          </Link>


          <Link
            className="btn btn-secondary"
            to="/admin/productos"
          >
            Volver
          </Link>


          {sesion?.role === 'Administrador' && (

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