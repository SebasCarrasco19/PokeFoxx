import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { productosIniciales } from '../data/adminData'

function DetalleProducto() {

  const { id } = useParams()

  const [cantidad, setCantidad] = useState(1)

  const [mensaje, setMensaje] = useState('')
  const [tipoMensaje, setTipoMensaje] = useState('')


  const [producto] = useState(() => {

    const productosGuardados =
      JSON.parse(localStorage.getItem('productos')) ||
      productosIniciales

    return productosGuardados.find(
      producto => producto.id === Number(id)
    )
  })


  function agregarAlCarrito() {

    setMensaje('')


    if (
      !Number.isInteger(cantidad) ||
      cantidad < 1
    ) {

      setTipoMensaje('error')

      setMensaje(
        'Ingresa una cantidad válida.'
      )

      return
    }


    if (cantidad > producto.stock) {

      setTipoMensaje('error')

      setMensaje(
        'No hay suficiente stock disponible.'
      )

      return
    }


    const carrito =
      JSON.parse(localStorage.getItem('carrito')) || []


    const productoExistente = carrito.find(
      item => item.id === producto.id
    )


    if (productoExistente) {

      const cantidadActual =
        productoExistente.quantity ??
        productoExistente.cantidad ??
        1


      const nuevaCantidad =
        cantidadActual + cantidad


      if (nuevaCantidad > producto.stock) {

        setTipoMensaje('error')

        setMensaje(
          'No puedes agregar más unidades que el stock disponible.'
        )

        return
      }


      productoExistente.quantity =
        nuevaCantidad

      productoExistente.cantidad =
        nuevaCantidad

    } else {

      carrito.push({
        ...producto,
        quantity: cantidad,
        cantidad: cantidad
      })

    }


    localStorage.setItem(
      'carrito',
      JSON.stringify(carrito)
    )


    window.dispatchEvent(
      new Event('carritoActualizado')
    )


    setTipoMensaje('success')

    setMensaje(
      'Producto añadido al carrito correctamente.'
    )
  }


  if (!producto) {

    return (
      <main className="container section">

        <div className="content-card empty-state">

          <h2>
            Producto no encontrado
          </h2>

          <p>
            El producto solicitado no existe.
          </p>

          <Link
            className="btn btn-primary"
            to="/productos"
          >
            Volver a productos
          </Link>

        </div>

      </main>
    )
  }


  return (
    <main>

      <section className="page-header">

        <div className="container">

          <div className="breadcrumb">

            <Link to="/">
              Inicio
            </Link>

            {' / '}

            <Link to="/productos">
              Productos
            </Link>

            {' / '}

            {producto.name}

          </div>

        </div>

      </section>


      <section className="section">

        <div className="container">

          <div className="product-detail">

            <div className="product-detail-media">

              <img
                src={producto.image}
                alt={producto.name}
              />

            </div>


            <div className="product-detail-info">

              <span className="eyebrow">
                {producto.category}
              </span>


              <h1>
                {producto.name}
              </h1>


              <p>
                {producto.description}
              </p>


              <div className="price-large">

                $
                {Number(
                  producto.price
                ).toLocaleString('es-CL')}

              </div>


              <p className="stock">
                Stock disponible: {producto.stock}
              </p>


              {mensaje && (

                <div
                  className={`form-message ${tipoMensaje}`}
                  style={{
                    marginBottom: '20px'
                  }}
                >
                  {tipoMensaje === 'success'
                    ? '✅'
                    : '⚠️'}{' '}
                  {mensaje}
                </div>

              )}


              {producto.stock > 0 && (

                <div className="quantity-row">

                  <div className="form-group">

                    <label htmlFor="cantidad">
                      Cantidad
                    </label>

                    <input
                      id="cantidad"
                      type="number"
                      min="1"
                      max={producto.stock}
                      value={cantidad}
                      onChange={event =>
                        setCantidad(
                          Number(event.target.value)
                        )
                      }
                    />

                  </div>

                </div>

              )}


              <button
                className="btn btn-primary"
                type="button"
                onClick={agregarAlCarrito}
                disabled={producto.stock === 0}
              >
                {producto.stock === 0
                  ? 'Sin stock'
                  : 'Añadir al carrito'}
              </button>

            </div>

          </div>

        </div>

      </section>

    </main>
  )
}

export default DetalleProducto