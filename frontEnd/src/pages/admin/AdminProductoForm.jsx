import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  productosIniciales,
  categorias as categoriasIniciales,
  juegos
} from '../../data/adminData'

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
  const navigate = useNavigate()


  const productos =
    JSON.parse(localStorage.getItem('productos')) ||
    productosIniciales


  const categorias =
    JSON.parse(localStorage.getItem('categorias')) ||
    categoriasIniciales


  const productoActual = productos.find(
    producto =>
      Number(producto.id) === Number(id)
  )


  const datos =
    productoActual ?? formularioVacio


  const editando =
    Boolean(id)


  function guardarProducto(event) {

    event.preventDefault()


    const formulario =
      new FormData(event.target)


    const productoGuardado = {

      id: editando
        ? Number(id)
        : Math.max(
            ...productos.map(
              producto => producto.id
            ),
            0
          ) + 1,


      code:
        formulario.get('code'),


      name:
        formulario.get('name'),


      description:
        formulario.get('description'),


      price:
        Number(
          formulario.get('price')
        ),


      originalPrice:
        Number(
          formulario.get('originalPrice')
        ),


      stock:
        Number(
          formulario.get('stock')
        ),


      criticalStock:
        Number(
          formulario.get('criticalStock')
        ),


      category:
        formulario.get('category'),


      game:
        formulario.get('game'),


      image:
        formulario.get('image') ||
        '/assets/img/logo.svg',


      onSale:
        formulario.get('onSale') === 'on'
    }


    let productosActualizados


    if (editando) {

      productosActualizados =
        productos.map(producto => {

          if (
            Number(producto.id) ===
            Number(id)
          ) {

            return productoGuardado
          }

          return producto
        })

    } else {

      productosActualizados = [
        ...productos,
        productoGuardado
      ]
    }


    localStorage.setItem(
      'productos',
      JSON.stringify(productosActualizados)
    )


    navigate('/admin/productos')
  }


  if (
    editando &&
    !productoActual
  ) {

    return (
      <div className="content-card">

        <h1>
          Producto no encontrado
        </h1>

        <Link
          className="btn btn-primary"
          to="/admin/productos"
        >
          Volver a productos
        </Link>

      </div>
    )
  }


  return (
    <>

      <div className="admin-title">

        <h1>
          {editando
            ? 'Editar producto'
            : 'Nuevo producto'}
        </h1>

        <p>
          {editando
            ? 'Modifica los datos del producto.'
            : 'Completa los datos para registrar un nuevo producto.'}
        </p>

      </div>


      <form
        className="content-card admin-form"
        key={id ?? 'nuevo'}
        onSubmit={guardarProducto}
      >

        <div className="form-grid">


          <div className="form-group">

            <label htmlFor="code">
              Código producto
            </label>

            <input
              id="code"
              name="code"
              defaultValue={datos.code}
              minLength="3"
              required
            />

          </div>


          <div className="form-group">

            <label htmlFor="name">
              Nombre
            </label>

            <input
              id="name"
              name="name"
              defaultValue={datos.name}
              maxLength="100"
              required
            />

          </div>


          <div className="form-group full">

            <label htmlFor="description">
              Descripción
            </label>

            <textarea
              id="description"
              name="description"
              defaultValue={datos.description}
              maxLength="500"
            />

          </div>


          <div className="form-group">

            <label htmlFor="price">
              Precio
            </label>

            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="1"
              defaultValue={datos.price}
              required
            />

          </div>


          <div className="form-group">

            <label htmlFor="originalPrice">
              Precio original
            </label>

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

            <label htmlFor="stock">
              Stock
            </label>

            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              step="1"
              defaultValue={datos.stock}
              required
            />

          </div>


          <div className="form-group">

            <label htmlFor="criticalStock">
              Stock crítico
            </label>

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

            <label htmlFor="category">
              Categoría
            </label>

            <select
              id="category"
              name="category"
              defaultValue={datos.category}
              required
            >

              <option value="">
                Selecciona una categoría
              </option>


              {categorias.map(categoria => (

                <option
                  key={categoria}
                  value={categoria}
                >
                  {categoria}
                </option>

              ))}

            </select>

          </div>


          <div className="form-group">

            <label htmlFor="game">
              Juego
            </label>

            <select
              id="game"
              name="game"
              defaultValue={datos.game}
              required
            >

              <option value="">
                Selecciona un juego
              </option>


              {juegos.map(juego => (

                <option
                  key={juego}
                  value={juego}
                >
                  {juego}
                </option>

              ))}

            </select>

          </div>


          <div className="form-group full">

            <label htmlFor="image">
              Imagen
            </label>

            <input
              id="image"
              name="image"
              defaultValue={datos.image}
              placeholder="/assets/img/producto.png"
            />

          </div>


          <div className="form-group full admin-checkbox-row">

            <input
              id="onSale"
              name="onSale"
              type="checkbox"
              defaultChecked={datos.onSale}
            />

            <label htmlFor="onSale">
              Producto en oferta
            </label>

          </div>

        </div>


        <div className="admin-button-row">

          <button
            className="btn btn-primary"
            type="submit"
          >
            Guardar producto
          </button>


          <Link
            className="btn btn-secondary"
            to="/admin/productos"
          >
            Volver
          </Link>

        </div>

      </form>

    </>
  )
}

export default AdminProductoForm