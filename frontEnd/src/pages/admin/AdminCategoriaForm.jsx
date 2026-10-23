import { useState } from 'react'
import {
  Link,
  useNavigate,
  useParams
} from 'react-router-dom'

import {
  categorias as categoriasIniciales,
  productosIniciales
} from '../../data/adminData'

export default function AdminCategoriaForm() {

  const { id } = useParams()
  const navigate = useNavigate()

  const [mensaje, setMensaje] = useState('')


  const categorias =
    JSON.parse(localStorage.getItem('categorias')) ||
    categoriasIniciales


  const editando = Boolean(id)


  const indice = editando
    ? Number(id) - 1
    : null


  const nombreActual = editando
    ? categorias[indice]
    : ''


  if (
    editando &&
    (
      !/^\d+$/.test(id) ||
      indice < 0 ||
      !nombreActual
    )
  ) {

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


  function guardarCategoria(event) {

    event.preventDefault()

    setMensaje('')


    const formulario =
      new FormData(event.target)


    const nuevoNombre =
      formulario.get('nombre').trim()


    if (!nuevoNombre) {

      setMensaje(
        'Debes ingresar un nombre para la categoría.'
      )

      return
    }


    const categoriaExiste = categorias.some(
      (categoria, i) =>
        categoria.toLowerCase() ===
          nuevoNombre.toLowerCase() &&
        i !== indice
    )


    if (categoriaExiste) {

      setMensaje(
        'Ya existe una categoría con ese nombre.'
      )

      return
    }


    let categoriasActualizadas


    if (editando) {

      categoriasActualizadas =
        categorias.map((categoria, i) => {

          if (i === indice) {
            return nuevoNombre
          }

          return categoria
        })


      const productos =
        JSON.parse(localStorage.getItem('productos')) ||
        productosIniciales


      const productosActualizados =
        productos.map(producto => {

          if (
            producto.category === nombreActual
          ) {

            return {
              ...producto,
              category: nuevoNombre
            }
          }

          return producto
        })


      localStorage.setItem(
        'productos',
        JSON.stringify(productosActualizados)
      )

    } else {

      categoriasActualizadas = [
        ...categorias,
        nuevoNombre
      ]
    }


    localStorage.setItem(
      'categorias',
      JSON.stringify(categoriasActualizadas)
    )


    navigate('/admin/categorias')
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
            ? 'Modifica el nombre de la categoría.'
            : 'Registra una nueva categoría para los productos.'}
        </p>

      </div>


      <form
        key={id ?? 'nueva'}
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
            defaultValue={nombreActual}
            maxLength="100"
            required
          />

        </div>


        <div className="admin-button-row">

          <button
            className="btn btn-primary"
            type="submit"
          >
            Guardar categoría
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