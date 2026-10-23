import { useState } from 'react'
import { Link } from 'react-router-dom'

function ProductCard({ producto }) {

  const [mensaje, setMensaje] = useState('')
  const [tipoMensaje, setTipoMensaje] = useState('ok')


  const nombre =
    producto.nombre ?? producto.name

  const precio =
    producto.precio ?? producto.price

  const precioOriginal =
    producto.precioOriginal ?? producto.originalPrice

  const categoria =
    producto.categoria ??
    producto.category ??
    'TCG'

  const juego =
    producto.juego ??
    producto.game ??
    'TCG'

  const oferta =
    producto.oferta ??
    producto.onSale ??
    false

  const imagen =
    producto.imagen ??
    producto.image


  function mostrarMensaje(tipo, texto) {

    setTipoMensaje(tipo)
    setMensaje(texto)

    setTimeout(() => {
      setMensaje('')
    }, 2000)
  }


  function agregarAlCarrito() {

    if (producto.stock <= 0) {

      mostrarMensaje(
        'error',
        'Producto sin stock.'
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


      if (cantidadActual >= producto.stock) {

        mostrarMensaje(
          'error',
          'No hay más stock disponible.'
        )

        return
      }


      productoExistente.quantity =
        cantidadActual + 1

      productoExistente.cantidad =
        cantidadActual + 1

    } else {

      carrito.push({
        ...producto,
        quantity: 1,
        cantidad: 1
      })
    }


    localStorage.setItem(
      'carrito',
      JSON.stringify(carrito)
    )


    window.dispatchEvent(
      new Event('carritoActualizado')
    )


    mostrarMensaje(
      'ok',
      'Producto añadido al carrito.'
    )
  }


  return (
    <article className="product-card">

      <Link
        className="image-link"
        to={`/producto/${producto.id}`}
        aria-label={`Ver ${nombre}`}
      >

        {oferta && (

          <span className="offer-badge">
            Oferta
          </span>

        )}


        {imagen && (

          <img
            src={imagen}
            alt={nombre}
          />

        )}

      </Link>


      <div className="product-card-body">

        <div className="product-card-tags">

          <span className="product-game">
            {juego}
          </span>

          <span className="product-meta">
            {categoria}
          </span>

        </div>


        <h3>

          <Link to={`/producto/${producto.id}`}>
            {nombre}
          </Link>

        </h3>


        <div className="product-price-row">

          {oferta && precioOriginal && (

            <span className="product-price-old">
              $
              {Number(
                precioOriginal
              ).toLocaleString('es-CL')}
            </span>

          )}


          <span className="product-price">
            $
            {Number(
              precio
            ).toLocaleString('es-CL')}
          </span>

        </div>


        <button
          className="btn btn-primary"
          type="button"
          onClick={agregarAlCarrito}
          disabled={producto.stock <= 0}
        >
          {producto.stock <= 0
            ? 'Sin stock'
            : 'Añadir al carrito'}
        </button>


        {mensaje && (

          <p
            className={`product-message ${tipoMensaje}`}
          >
            {tipoMensaje === 'ok'
              ? '✅'
              : '⚠️'}{' '}
            {mensaje}
          </p>

        )}

      </div>

    </article>
  )
}

export default ProductCard