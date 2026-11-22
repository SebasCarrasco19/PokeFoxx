
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { juegos } from '../../data/adminData'

const API = 'http://localhost:8080/api/v1'

const formularioVacio = {
  code: '',
  name: '',
  description: '',
  price: '',
  originalPrice: '',
  stock: '',
  criticalStock: '',
  categoriaId: '',
  game: '',
  image: '',
  onSale: false
}

function AdminProductoForm() {

  const { id } = useParams()
  const navigate = useNavigate()
  const editando = Boolean(id)

  const [datos, setDatos] = useState(formularioVacio)
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])

  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [noEncontrado, setNoEncontrado] = useState(false)

  useEffect(() => {

    const controlador = new AbortController()

    async function cargarDatos() {

      try {

        setCargando(true)
        setMensaje('')
        setNoEncontrado(false)
        setDatos(formularioVacio)

        const consultas = [
          fetch(`${API}/productos`, {
            signal: controlador.signal
          }),
          fetch(`${API}/categorias`, {
            signal: controlador.signal
          })
        ]

        if (editando) {
          consultas.push(
            fetch(`${API}/productos/${id}`, {
              signal: controlador.signal
            })
          )
        }

        const respuestas = await Promise.all(consultas)

        if (!respuestas[0].ok || !respuestas[1].ok) {
          throw new Error(
            'No fue posible cargar productos o categorías.'
          )
        }

        if (editando && respuestas[2].status === 404) {
          setNoEncontrado(true)
          return
        }

        if (editando && !respuestas[2].ok) {
          throw new Error(
            'No fue posible cargar el producto.'
          )
        }

        const resultados = await Promise.all(
          respuestas.map(respuesta => respuesta.json())
        )

        if (controlador.signal.aborted) return

        const productosRecibidos = resultados[0]
        const categoriasRecibidas = resultados[1]

        if (
          !Array.isArray(productosRecibidos) ||
          !Array.isArray(categoriasRecibidas)
        ) {
          throw new Error(
            'El servidor devolvió datos incorrectos.'
          )
        }

        setProductos(productosRecibidos)
        setCategorias(categoriasRecibidas)

        if (editando) {

          const producto = resultados[2]

          setDatos({
            code: producto.code ?? '',
            name: producto.name ?? '',
            description: producto.description ?? '',
            price: producto.price ?? '',
            originalPrice: producto.originalPrice ?? '',
            stock: producto.stock ?? '',
            criticalStock: producto.criticalStock ?? '',
            categoriaId:
              String(
                producto.categoria?.id ??
                producto.categoriaId ??
                producto.categoryId ??
                ''
              ),
            game: producto.game ?? '',
            image: producto.image ?? '',
            onSale: Boolean(producto.onSale)
          })

        }

      } catch (error) {

        if (error.name !== 'AbortError') {
          setMensaje(
            error.message ||
            'Ocurrió un error al cargar los datos.'
          )
        }

      } finally {

        if (!controlador.signal.aborted) {
          setCargando(false)
        }

      }
    }

    cargarDatos()

    return () => controlador.abort()

  }, [id, editando])

  function actualizarCampo(event) {

    const { name, value, type, checked } = event.target

    setDatos(actuales => ({
      ...actuales,
      [name]: type === 'checkbox'
        ? checked
        : value
    }))

  }

  async function guardarProducto(event) {

    event.preventDefault()

    if (guardando || cargando) return

    setMensaje('')

    const codigo = datos.code.trim()
    const nombre = datos.name.trim()
    const precio = Number(datos.price)
    const stock = Number(datos.stock)

    const precioOriginal = datos.onSale
      ? Number(datos.originalPrice)
      : precio

    const stockCritico =
      datos.criticalStock === ''
        ? null
        : Number(datos.criticalStock)

    if (!codigo || !nombre) {
      setMensaje(
        'Debes ingresar el código y nombre del producto.'
      )
      return
    }

    const codigoExiste = productos.some(
      producto =>
        producto.code?.trim().toLowerCase() ===
        codigo.toLowerCase() &&
        String(producto.id) !== String(id)
    )

    if (codigoExiste) {
      setMensaje(
        'Ya existe un producto con ese código.'
      )
      return
    }

    if (
      datos.price === '' ||
      !Number.isFinite(precio) ||
      precio < 0
    ) {
      setMensaje(
        'Debes ingresar un precio válido.'
      )
      return
    }

    if (
      datos.stock === '' ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      setMensaje(
        'Debes ingresar un stock válido.'
      )
      return
    }

    if (
      stockCritico !== null &&
      (
        !Number.isInteger(stockCritico) ||
        stockCritico < 0
      )
    ) {
      setMensaje(
        'El stock crítico debe ser un número entero válido.'
      )
      return
    }

    if (datos.onSale) {

      if (
        datos.originalPrice === '' ||
        !Number.isFinite(precioOriginal) ||
        precioOriginal <= precio
      ) {
        setMensaje(
          'Si el producto está en oferta, el precio original debe ser mayor que el precio de venta.'
        )
        return
      }

    }

    const categoria = categorias.find(
      item => String(item.id) === datos.categoriaId
    )

    if (!categoria) {
      setMensaje(
        'Debes seleccionar una categoría válida.'
      )
      return
    }

    if (!editando && categoria.active === false) {
      setMensaje(
        'No puedes crear un producto en una categoría inactiva.'
      )
      return
    }

    if (!datos.game) {
      setMensaje(
        'Debes seleccionar un juego.'
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


      const productoGuardado = {
        code: codigo,
        name: nombre,
        description: datos.description.trim(),
        price: precio,
        originalPrice: precioOriginal,
        stock,
        criticalStock: stockCritico,
        categoria: {
          id: Number(datos.categoriaId)
        },
        game: datos.game,
        image:
          datos.image.trim() ||
          '/assets/img/logo.svg',
        onSale: datos.onSale
      }


      const respuesta = await fetch(
        editando
          ? `${API}/productos/${id}`
          : `${API}/productos`,
        {
          method: editando ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(productoGuardado)
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
            'No tienes permiso para guardar productos.'
          )
        }

        const contenido = await respuesta.text()

        let errorServidor = null

        try {
          errorServidor = contenido
            ? JSON.parse(contenido)
            : null
        } catch {
          errorServidor = null
        }

        throw new Error(
          errorServidor?.message ||
          errorServidor?.error ||
          `No fue posible guardar el producto (HTTP ${respuesta.status}).`
        )
      }

      navigate('/admin/productos')

    } catch (error) {

      setMensaje(
        error.message ||
        'Ocurrió un error al guardar el producto.'
      )

    } finally {

      setGuardando(false)

    }
  }

  if (cargando) {

    return (
      <div className="content-card">
        Cargando formulario...
      </div>
    )
  }

  if (noEncontrado) {

    return (
      <div className="content-card">

        <h1>Producto no encontrado</h1>

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
              value={datos.code}
              onChange={actualizarCampo}
              minLength={3}
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
              value={datos.name}
              onChange={actualizarCampo}
              maxLength={100}
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
              value={datos.description}
              onChange={actualizarCampo}
              maxLength={500}
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
              value={datos.price}
              onChange={actualizarCampo}
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
              value={datos.originalPrice}
              onChange={actualizarCampo}
              disabled={!datos.onSale}
              required={datos.onSale}
              placeholder={
                datos.onSale
                  ? 'Precio antes del descuento'
                  : 'Igual al precio de venta'
              }
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
              value={datos.stock}
              onChange={actualizarCampo}
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
              value={datos.criticalStock}
              onChange={actualizarCampo}
            />

          </div>

          <div className="form-group">

            <label htmlFor="categoriaId">
              Categoría
            </label>

            <select
              id="categoriaId"
              name="categoriaId"
              value={datos.categoriaId}
              onChange={actualizarCampo}
              required
            >

              <option value="">
                Selecciona una categoría
              </option>

              {categorias
                .filter(categoria =>
                  categoria.active !== false ||
                  String(categoria.id) === datos.categoriaId
                )
                .map(categoria => (

                  <option
                    key={categoria.id}
                    value={String(categoria.id)}
                  >
                    {categoria.name}
                    {categoria.active === false
                      ? ' (Inactiva)'
                      : ''}
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
              value={datos.game}
              onChange={actualizarCampo}
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

              {datos.game &&
                !juegos.includes(datos.game) && (
                  <option value={datos.game}>
                    {datos.game}
                  </option>
                )}

            </select>

          </div>

          <div className="form-group full">

            <label htmlFor="image">
              Imagen
            </label>

            <input
              id="image"
              name="image"
              value={datos.image}
              onChange={actualizarCampo}
              placeholder="/assets/img/producto.png"
            />

          </div>

          <div className="form-group full admin-checkbox-row">

            <input
              id="onSale"
              name="onSale"
              type="checkbox"
              checked={datos.onSale}
              onChange={actualizarCampo}
            />

            <label htmlFor="onSale">
              Producto en oferta
            </label>

          </div>

        </div>

        {mensaje && (
          <p className="form-message error">
            ⚠️ {mensaje}
          </p>
        )}

        <div className="admin-button-row">

          <button
            className="btn btn-primary"
            type="submit"
            disabled={guardando}
          >
            {guardando
              ? 'Guardando...'
              : 'Guardar producto'}
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
