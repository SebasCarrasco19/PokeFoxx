import CriticalProduct from '../../components/CriticalProduct'
import { productosIniciales } from '../../data/adminData'

function ProductosCriticos() {

  const productos =
    JSON.parse(localStorage.getItem('productos')) ||
    productosIniciales

  const productosCriticos = productos.filter(
    producto =>
      producto.stock === 0 ||
      (
        producto.criticalStock !== null &&
        producto.criticalStock !== '' &&
        producto.stock <= producto.criticalStock
      )
  )

  return (
    <>
      <div className="admin-title">

        <h1>
          Productos críticos
        </h1>

        <p>
          Productos cuyo stock actual alcanzó o bajó
          de su nivel crítico.
        </p>

      </div>

      <div className="admin-toolbar">

        <span>
          {productosCriticos.length} producto(s) con stock crítico.
        </span>

      </div>

      {productosCriticos.length > 0 ? (

        <div className="admin-critical-grid">

          {productosCriticos.map(producto => (

            <CriticalProduct
              key={producto.id}
              producto={producto}
            />

          ))}

        </div>

      ) : (

        <div className="content-card">

          <h2>
            Sin productos críticos
          </h2>

          <p>
            Todos los productos tienen stock suficiente.
          </p>

        </div>

      )}

    </>
  )
}

export default ProductosCriticos