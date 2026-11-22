
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function AdminCategorias() {

  const [categorias, setCategorias] = useState([])
  const [mensaje, setMensaje] = useState('')
  const [tipoMensaje, setTipoMensaje] = useState('')
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [eliminando, setEliminando] = useState(false)

  useEffect(() => {

    const controlador = new AbortController()

    async function cargarCategorias() {

      try {

        setCargando(true)

        const respuesta = await fetch(
          'http://localhost:8080/api/v1/categorias',
          {
            signal: controlador.signal
          }
        )

        if (!respuesta.ok) {
          throw new Error(
            'No fue posible obtener las categorías.'
          )
        }

        const datos = await respuesta.json()

        if (!Array.isArray(datos)) {
          throw new Error(
            'El servidor devolvió un formato incorrecto.'
          )
        }

        if (!controlador.signal.aborted) {
          setCategorias(datos)
        }

      } catch (error) {

        if (error.name !== 'AbortError') {

          setTipoMensaje('error')

          setMensaje(
            error.message ||
            'No fue posible cargar las categorías.'
          )

        }

      } finally {

        if (!controlador.signal.aborted) {
          setCargando(false)
        }

      }
    }

    cargarCategorias()

    return () => controlador.abort()

  }, [])

  function solicitarEliminar(categoria) {

    setMensaje('')
    setCategoriaAEliminar(categoria)
  }

  function cancelarEliminar() {

    if (eliminando) return

    setCategoriaAEliminar(null)
  }

  async function confirmarEliminar() {

    if (!categoriaAEliminar || eliminando) {
      return
    }

    setMensaje('')
    setEliminando(true)

    try {

      const token = localStorage.getItem('token')

      if (!token) {
        throw new Error(
          'Debes iniciar sesión como Administrador.'
        )
      }

      const respuesta = await fetch(
        `http://localhost:8080/api/v1/categorias/${categoriaAEliminar.id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (!respuesta.ok) {

        if (respuesta.status === 401) {
          throw new Error(
            'Tu sesión venció. Inicia sesión nuevamente.'
          )
        }

        if (respuesta.status === 403) {
          throw new Error(
            'No tienes permiso para eliminar categorías.'
          )
        }

        if (respuesta.status === 409) {
          throw new Error(
            'No puedes eliminar esta categoría porque tiene productos asociados.'
          )
        }

        const contenido = await respuesta.text()

        let datos = null

        try {
          datos = contenido
            ? JSON.parse(contenido)
            : null
        } catch {
          datos = null
        }

        throw new Error(
          datos?.message ||
          datos?.error ||
          `No fue posible eliminar la categoría (HTTP ${respuesta.status}).`
        )
      }

      const nombreEliminado = categoriaAEliminar.name

      setCategorias(actuales =>
        actuales.filter(
          categoria =>
            categoria.id !== categoriaAEliminar.id
        )
      )

      setTipoMensaje('success')

      setMensaje(
        `Categoría "${nombreEliminado}" eliminada correctamente.`
      )

      setCategoriaAEliminar(null)

    } catch (error) {

      setTipoMensaje('error')

      setMensaje(
        error.message ||
        'No fue posible eliminar la categoría.'
      )

    } finally {

      setEliminando(false)

    }
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

      {cargando && (

        <div
          className="content-card"
          style={{ marginBottom: '20px' }}
        >
          Cargando categorías...
        </div>

      )}

      {mensaje && (

        <div
          className={`form-message ${tipoMensaje}`}
          style={{ marginBottom: '20px' }}
        >
          {tipoMensaje === 'success' ? '✅' : '⚠️'}{' '}
          {mensaje}
        </div>

      )}

      {categoriaAEliminar && (

        <div
          className="content-card"
          style={{ marginBottom: '20px' }}
        >

          <h3>
            ¿Eliminar categoría?
          </h3>

          <p>
            ¿Seguro que quieres eliminar{' '}
            <strong>
              {categoriaAEliminar.name}
            </strong>
            ?
          </p>

          <div className="admin-button-row">

            <button
              className="btn btn-danger"
              type="button"
              onClick={confirmarEliminar}
              disabled={eliminando}
            >
              {eliminando
                ? 'Eliminando...'
                : 'Sí, eliminar'}
            </button>

            <button
              className="btn btn-secondary"
              type="button"
              onClick={cancelarEliminar}
              disabled={eliminando}
            >
              Cancelar
            </button>

          </div>

        </div>

      )}

      {!cargando && (

        <div className="table-wrap">

          <table>

            <thead>

              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>

            </thead>

            <tbody>

              {categorias.map(categoria => (

                <tr key={categoria.id}>

                  <td>
                    {categoria.name}
                  </td>

                  <td>
                    {categoria.description || 'Sin descripción'}
                  </td>

                  <td>
                    {categoria.active === false
                      ? 'Inactiva'
                      : 'Activa'}
                  </td>

                  <td>

                    <div className="table-actions">

                      <Link
                        className="btn btn-secondary btn-sm"
                        to={`/admin/categorias/${categoria.id}/editar`}
                      >
                        Editar
                      </Link>

                      <button
                        className="btn btn-danger btn-sm"
                        type="button"
                        onClick={() =>
                          solicitarEliminar(categoria)
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

      )}

    </>
  )
}
