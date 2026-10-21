import { productosCriticosEjemplo } from '../../data/adminData'
import CriticalProduct from '../../components/CriticalProduct'

function ProductosCriticos() {
  const productosCriticos = productosCriticosEjemplo

  return (
    <>
      <div className="admin-title">
        <h1>Productos críticos</h1>
        <p>
          Selección estática de ejemplo; no se calcula ni actualiza el stock.
        </p>
      </div>

      <div className="admin-toolbar">
        <span>{productosCriticos.length} producto(s) con stock crítico.</span>
      </div>

      {productosCriticos.length > 0 ? (
        <div className="admin-critical-grid">
          {productosCriticos.map((producto) => (
            <CriticalProduct key={producto.id} producto={producto} />
          ))}
        </div>
      ) : (
        <div className="content-card">
          <h2>Sin productos críticos</h2>
          <p>Todos los productos tienen stock suficiente.</p>
        </div>
      )}
    </>
  )
}

export default ProductosCriticos
