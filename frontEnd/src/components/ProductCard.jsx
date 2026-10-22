import { useState } from 'react'
import { Link } from 'react-router-dom'

function ProductCard({ producto }) {

  const [mensaje, setMensaje] = useState('')
  const [tipoMensaje, setTipoMensaje] = useState('ok')

  const nombre = producto.nombre ?? producto.name
  const precio = producto.precio ?? producto.price
  const precioOriginal =
    producto.precioOriginal ?? producto.originalPrice

  const categoria =
    producto.categoria ?? producto.category ?? 'TCG'

  const juego =
    producto.juego ?? producto.game ?? 'TCG'

  const oferta =
    producto.oferta ?? producto.onSale ?? false

  const imagen =
    producto.imagen ?? producto.image


  const agregarAlCarrito = () => {

    const carritoGuardado =
      JSON.parse(localStorage.getItem('carrito')) || []

    const productoExistente = carritoGuardado.find(
      item => item.id === producto.id
    )

    if (productoExistente) {

      const cantidadActual =
        productoExistente.quantity ??
        productoExistente.cantidad ??
        1

      if (cantidadActual >= producto.stock) {
        setTipoMensaje('error')
        setMensaje('No hay más stock disponible')
        setTimeout(() => setMensaje(''), 2000)
        return
      }

      productoExistente.quantity = cantidadActual + 1
      productoExistente.cantidad = cantidadActual + 1

    } else {

      if (producto.stock <= 0) {
        setTipoMensaje('error')
        setMensaje('Producto sin stock')
        setTimeout(() => setMensaje(''), 2000)
        return
      }

      carritoGuardado.push({
        ...producto,
        quantity: 1,
        cantidad: 1
      })
    }

    localStorage.setItem(
      'carrito',
      JSON.stringify(carritoGuardado)
    )

    window.dispatchEvent(
      new Event('carritoActualizado')
    )

    setTipoMensaje('ok')
    setMensaje('Producto añadido al carrito')

    setTimeout(() => {
      setMensaje('')
    }, 2000)
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
              ${precioOriginal.toLocaleString('es-CL')}
            </span>
          )}

          <span className="product-price">
            ${precio.toLocaleString('es-CL')}
          </span>

        </div>


        <button
          className="btn btn-primary"
          type="button"
          onClick={agregarAlCarrito}
          disabled={producto.stock === 0}
        >
          Añadir al carrito
        </button>


        {mensaje && (
          <p className={`product-message ${tipoMensaje}`}>
            {tipoMensaje === 'ok' ? '✅' : '⚠️'} {mensaje}
          </p>
        )}

      </div>

    </article>
  )
}

export default ProductCard