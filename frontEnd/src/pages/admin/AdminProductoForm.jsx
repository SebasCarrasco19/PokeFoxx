import { Link, useParams } from 'react-router-dom'
import { productosIniciales as productos } from '../../data/adminData'
import { categorias, juegos } from '../../data/adminData'

const formularioVacio = {
  code: '',
  name: '',
  description: '',
  price: '',
  originalPrice: '',
  stock: '',
  criticalStock: '',
  category: '',
  game: '',
  image: '',
  onSale: false,
}

function AdminProductoForm() {
  const { id } = useParams()

  const productoActual = productos.find(
    (producto) => Number(producto.id) === Number(id),
  )
  const datos = productoActual ?? formularioVacio
  const editando = Boolean(id)

  if (editando && !productoActual) {
    return (
      <div className="content-card">
        <h1>Producto no encontrado</h1>
        <Link className="btn btn-primary" to="/admin/productos">
          Volver a productos
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="admin-title">
        <h1>{editando ? 'Editar producto' : 'Nuevo producto'}</h1>
        <p>Vista de ejemplo del formulario. Los cambios no se guardan.</p>
      </div>

      <form
        className="content-card admin-form"
        key={id ?? 'nuevo'}
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="code">Código producto</label>
            <input
              id="code"
              name="code"
              defaultValue={datos.code}
              minLength="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input
              id="name"
              name="name"
              defaultValue={datos.name}
              maxLength="100"
            />
          </div>

          <div className="form-group full">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              defaultValue={datos.description}
              maxLength="500"
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Precio</label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="1"
              defaultValue={datos.price}
            />
          </div>

          <div className="form-group">
            <label htmlFor="originalPrice">Precio original</label>
            <input
              id="originalPrice"
              name="originalPrice"
              type="number"
              min="0"
              step="1"
              defaultValue={datos.originalPrice}
            />
          </div>

          <div className="form-group">
            <label htmlFor="stock">Stock</label>
            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              step="1"
              defaultValue={datos.stock}
            />
          </div>

          <div className="form-group">
            <label htmlFor="criticalStock">Stock crítico</label>
            <input
              id="criticalStock"
              name="criticalStock"
              type="number"
              min="0"
              step="1"
              defaultValue={datos.criticalStock}
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Categoría</label>
            <select id="category" name="category" defaultValue={datos.category}>
              <option value="">Selecciona una categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="game">Juego</label>
            <select id="game" name="game" defaultValue={datos.game}>
              <option value="">Selecciona un juego</option>
              {juegos.map((juego) => (
                <option key={juego} value={juego}>
                  {juego}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group full">
            <label htmlFor="image">Imagen</label>
            <input
              id="image"
              name="image"
              defaultValue={datos.image}
              placeholder="/assets/img/producto-booster.svg"
            />
          </div>

          <div className="form-group full admin-checkbox-row">
            <input
              id="onSale"
              name="onSale"
              type="checkbox"
              defaultChecked={datos.onSale}
            />
            <label htmlFor="onSale">Producto en oferta</label>
          </div>
        </div>

        <div className="admin-button-row">
          <button
            className="btn btn-primary"
            type="button"
            disabled
            title="Disponible en una próxima etapa"
          >
            Guardar producto
          </button>
          <Link className="btn btn-secondary" to="/admin/productos">
            Volver
          </Link>
        </div>
      </form>
    </>
  )
}

export default AdminProductoForm
