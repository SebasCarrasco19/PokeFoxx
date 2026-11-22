
import { useEffect, useState } from 'react'
import {
  Link,
  useNavigate,
  useParams
} from 'react-router-dom'

export default function AdminCategoriaForm() {

  const { id } = useParams()
  const navigate = useNavigate()
  const editando = Boolean(id)

  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [activo, setActivo] = useState(true)

  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [noEncontrada, setNoEncontrada] = useState(false)

  useEffect(() => {

    const controlador = new AbortController()

    async function cargarCategorias() {

      try {

        setCargando(true)
        setMensaje('')
        setNoEncontrada(false)

        const respuesta = await fetch(
          'http://localhost:8080/api/v1/categorias',
          {
            signal: controlador.signal
          }
        )

        if (!respuesta.ok) {
          throw new Error(
            'No fue posible cargar las categorías.'
          )
        }

        const datos = await respuesta.json()

        if (!Array.isArray(datos)) {
          throw new Error(
            'El servidor devolvió un formato incorrecto.'
          )
        }

        if (controlador.signal.aborted) return

        setCategorias(datos)

        if (editando) {

          const categoria = datos.find(
            item => String(item.id) === String(id)
          )

          if (!categoria) {
            setNoEncontrada(true)
            return
          }

          setNombre(categoria.name ?? '')
          setDescripcion(categoria.description ?? '')
          setActivo(categoria.active ?? true)

        } else {

          setNombre('')
          setDescripcion('')
          setActivo(true)

        }

      } catch (error) {

        if (error.name !== 'AbortError') {
          setMensaje(
            error.message ||
            'Ocurrió un error al cargar las categorías.'
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

  }, [id, editando])

  async function guardarCategoria(event) {

    event.preventDefault()

    if (guardando) return

    setMensaje('')

    const nuevoNombre = nombre.trim()
    const nuevaDescripcion = descripcion.trim()

    if (!nuevoNombre) {
      setMensaje(
        'Debes ingresar un nombre para la categoría.'
      )
      return
    }

    const categoriaExiste = categorias.some(
      categoria =>
        categoria.name?.trim().toLowerCase() ===
          nuevoNombre.toLowerCase() &&
        String(categoria.id) !== String(id)
    )

    if (categoriaExiste) {
      setMensaje(
        'Ya existe una categoría con ese nombre.'
      )
      return
    }

    setGuardando(true)

    try {

      const token = localStorage.getItem('token')

      if (!token) {
        throw new Error(
          'Debes iniciar sesión como Administrador.'
        )
      }

      const url = editando
        ? `http://localhost:8080/api/v1/categorias/${id}`
        : 'http://localhost:8080/api/v1/categorias'

      const respuesta = await fetch(url, {
        method: editando ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: nuevoNombre,
          description: nuevaDescripcion,
          active: activo
        })
      })

      if (!respuesta.ok) {

        if (respuesta.status === 401) {
          throw new Error(
            'Tu sesión venció. Inicia sesión nuevamente.'
          )
        }

        if (respuesta.status === 403) {
          throw new Error(
            'No tienes permiso para modificar categorías.'
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
          `No fue posible guardar la categoría (HTTP ${respuesta.status}).`
        )
      }

      navigate('/admin/categorias')

    } catch (error) {

      setMensaje(
        error.message ||
        'Ocurrió un error al guardar la categoría.'
      )

    } finally {

      setGuardando(false)

    }
  }

  if (cargando) {

    return (
      <div className="content-card">
        Cargando categoría...
      </div>
    )
  }

  if (noEncontrada) {

    return (
      <div className="content-card">

        <h1>
          Categoría no encontrada
        </h1>

        <Link
          className="btn btn-primary"
          to="/admin/categorias"
        >
          Volver a categorías
        </Link>

      </div>
    )
  }

  return (
    <>

      <div className="admin-title">

        <h1>
          {editando
            ? 'Editar categoría'
            : 'Nueva categoría'}
        </h1>

        <p>
          {editando
            ? 'Modifica la información de la categoría.'
            : 'Registra una nueva categoría para los productos.'}
        </p>

      </div>

      <form
        className="content-card admin-form"
        onSubmit={guardarCategoria}
      >

        {mensaje && (

          <div
            className="form-message error"
            style={{
              marginBottom: '20px'
            }}
          >
            ⚠️ {mensaje}
          </div>

        )}

        <div className="form-group">

          <label htmlFor="nombreCategoria">
            Nombre
          </label>

          <input
            id="nombreCategoria"
            name="nombre"
            value={nombre}
            onChange={event =>
              setNombre(event.target.value)
            }
            maxLength={100}
            required
          />

        </div>

        <div className="form-group">

          <label htmlFor="descripcionCategoria">
            Descripción
          </label>

          <textarea
            id="descripcionCategoria"
            name="descripcion"
            value={descripcion}
            onChange={event =>
              setDescripcion(event.target.value)
            }
            rows={3}
          />

        </div>

        <div className="form-group">

          <label htmlFor="activoCategoria">
            Estado
          </label>

          <select
            id="activoCategoria"
            value={activo ? 'true' : 'false'}
            onChange={event =>
              setActivo(event.target.value === 'true')
            }
          >
            <option value="true">
              Activa
            </option>

            <option value="false">
              Inactiva
            </option>
          </select>

        </div>

        <div className="admin-button-row">

          <button
            className="btn btn-primary"
            type="submit"
            disabled={guardando || Boolean(mensaje && categorias.length === 0)}
          >
            {guardando
              ? 'Guardando...'
              : 'Guardar categoría'}
          </button>

          <Link
            className="btn btn-secondary"
            to="/admin/categorias"
          >
            Volver
          </Link>

        </div>

      </form>

    </>
  )
}
