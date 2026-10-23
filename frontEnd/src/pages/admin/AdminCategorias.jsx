import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  categorias as categoriasIniciales,
  productosIniciales
} from '../../data/adminData'

export default function AdminCategorias() {

  const [categorias, setCategorias] = useState(() => {

    const categoriasGuardadas =
      localStorage.getItem('categorias')

    if (categoriasGuardadas) {
      return JSON.parse(categoriasGuardadas)
    }

    localStorage.setItem(
      'categorias',
      JSON.stringify(categoriasIniciales)
    )

    return categoriasIniciales
  })


  const [mensaje, setMensaje] = useState('')
  const [tipoMensaje, setTipoMensaje] = useState('')
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null)


  function solicitarEliminar(indice) {

    setMensaje('')

    const categoria = categorias[indice]

    const productos =
      JSON.parse(localStorage.getItem('productos')) ||
      productosIniciales


    const categoriaEnUso = productos.some(
      producto => producto.category === categoria
    )


    if (categoriaEnUso) {

      setTipoMensaje('error')

      setMensaje(
        'No puedes eliminar esta categoría porque tiene productos asociados.'
      )

      return
    }


    setCategoriaAEliminar({
      indice,
      nombre: categoria
    })
  }


  function confirmarEliminar() {

    if (!categoriaAEliminar) {
      return
    }


    const categoriasActualizadas =
      categorias.filter(
        (nombre, i) =>
          i !== categoriaAEliminar.indice
      )


    setCategorias(categoriasActualizadas)


    localStorage.setItem(
      'categorias',
      JSON.stringify(categoriasActualizadas)
    )


    setTipoMensaje('success')

    setMensaje(
      `Categoría "${categoriaAEliminar.nombre}" eliminada correctamente.`
    )


    setCategoriaAEliminar(null)
  }


  function cancelarEliminar() {

    setCategoriaAEliminar(null)
  }


  return (
    <>

      <div className="admin-title">

        <h1>
          Categorías
        </h1>

        <p>
          Categorías disponibles para los productos de la tienda.
        </p>

      </div>


      <div className="admin-toolbar">

        <span>
          {categorias.length} categoría(s) registrada(s).
        </span>

        <Link
          className="btn btn-primary"
          to="/admin/categorias/nueva"
        >
          Nueva categoría
        </Link>

      </div>


      {mensaje && (

        <div
          className={`form-message ${tipoMensaje}`}
          style={{
            marginBottom: '20px'
          }}
        >
          {tipoMensaje === 'success' ? '✅' : '⚠️'}{' '}
          {mensaje}
        </div>

      )}


      {categoriaAEliminar && (

        <div
          className="content-card"
          style={{
            marginBottom: '20px'
          }}
        >

          <h3>
            ¿Eliminar categoría?
          </h3>

          <p>
            ¿Seguro que quieres eliminar{' '}
            <strong>
              {categoriaAEliminar.nombre}
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
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>

          </thead>


          <tbody>

            {categorias.map((nombre, i) => (

              <tr key={nombre}>

                <td>
                  {nombre}
                </td>

                <td>

                  <div className="table-actions">

                    <Link
                      className="btn btn-secondary btn-sm"
                      to={`/admin/categorias/${i + 1}/editar`}
                    >
                      Editar
                    </Link>


                    <button
                      className="btn btn-danger btn-sm"
                      type="button"
                      onClick={() =>
                        solicitarEliminar(i)
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