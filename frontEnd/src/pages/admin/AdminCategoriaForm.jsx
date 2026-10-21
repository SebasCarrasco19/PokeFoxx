import { Link, useParams } from 'react-router-dom'
import { categorias } from '../../data/adminData'

export default function AdminCategoriaForm() {
  const { id } = useParams()
  const nombre = categorias[Number(id) - 1]
  if (id && (!/^\d+$/.test(id) || !nombre))
    return (
      <div className="content-card">
        <h1>Categoría no encontrada</h1>
        <Link to="/admin/categorias">Volver a categorías</Link>
      </div>
    )
  return (
    <>
      <div className="admin-title">
        <h1>{id ? 'Editar categoría' : 'Nueva categoría'}</h1>
        <p>Vista estática del formulario. No guarda cambios.</p>
      </div>
      <form
        key={id ?? 'nueva'}
        className="content-card admin-form"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="form-group">
          <label htmlFor="nombreCategoria">Nombre</label>
          <input id="nombreCategoria" defaultValue={nombre ?? ''} />
        </div>
        <div className="admin-button-row">
          <button className="btn btn-primary" type="button" disabled>
            Guardar categoría
          </button>
          <Link className="btn btn-secondary" to="/admin/categorias">
            Volver
          </Link>
        </div>
      </form>
    </>
  )
}
