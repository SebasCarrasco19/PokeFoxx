import { Link } from 'react-router-dom'
import { categorias } from '../../data/adminData'

export default function AdminCategorias() {
  return (
    <>
      <div className="admin-title">
        <h1>Categorías</h1>
        <p>Categorías de ejemplo de la tienda.</p>
      </div>
      <div className="admin-toolbar">
        <Link className="btn btn-primary" to="/admin/categorias/nueva">
          Nueva categoría
        </Link>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((nombre, i) => (
              <tr key={nombre}>
                <td>{nombre}</td>
                <td>
                  <Link
                    className="btn btn-secondary btn-sm"
                    to={`/admin/categorias/${i + 1}/editar`}
                  >
                    Editar / ver
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
