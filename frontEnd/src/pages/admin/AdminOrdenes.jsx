import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ordenesIniciales } from '../../data/adminData'

function AdminOrdenes() {

  const [ordenes] = useState(() => {

    const ordenesGuardadas =
      JSON.parse(localStorage.getItem('ordenes'))

    if (ordenesGuardadas) {
      return ordenesGuardadas
    }

    localStorage.setItem(
      'ordenes',
      JSON.stringify(ordenesIniciales)
    )

    return ordenesIniciales
  })


  return (
    <>
      <div className="admin-title">

        <h1>Órdenes</h1>

        <p>
          Consulta de órdenes registradas en la tienda.
        </p>

      </div>


      <div className="table-wrap">

        <table>

          <thead>

            <tr>
              <th>Orden</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>

          </thead>


          <tbody>

            {ordenes.map((orden) => (

              <tr key={orden.id}>

                <td>
                  {orden.id}
                </td>

                <td>
                  {orden.customer}
                </td>

                <td>
                  {orden.date}
                </td>

                <td>
                  ${Number(orden.total).toLocaleString('es-CL')}
                </td>

                <td>
                  <span className="role-chip">
                    {orden.status}
                  </span>
                </td>

                <td>

                  <Link
                    className="btn btn-secondary btn-sm"
                    to={`/admin/ordenes/${encodeURIComponent(orden.id)}`}
                  >
                    Ver detalle
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

export default AdminOrdenes