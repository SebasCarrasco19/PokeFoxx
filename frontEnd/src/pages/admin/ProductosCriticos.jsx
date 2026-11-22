
import { useEffect, useState } from 'react'
import CriticalProduct from '../../components/CriticalProduct'

function ProductosCriticos() {

  const [productosCriticos, setProductosCriticos] =
    useState([])

  const [cargando, setCargando] =
    useState(true)

  const [error, setError] =
    useState('')

  useEffect(() => {

    const controlador = new AbortController()

    async function cargarProductosCriticos() {

      try {

        setCargando(true)
        setError('')

        const token = localStorage.getItem('token')

        if (!token) {
          throw new Error(
            'Debes iniciar sesión como Administrador.'
          )
        }

        const respuesta = await fetch(
          'http://localhost:8080/api/v1/productos/stock-critico',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            },
            signal: controlador.signal
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
              'No tienes permiso para consultar el stock crítico.'
            )
          }

          throw new Error(
            `No fue posible obtener los productos críticos (HTTP ${respuesta.status}).`
          )
        }

        const datos = await respuesta.json()

        if (!Array.isArray(datos)) {
          throw new Error(
            'El servidor devolvió un formato incorrecto.'
          )
        }

        if (!controlador.signal.aborted) {
          setProductosCriticos(datos)
        }

      } catch (error) {

        if (error.name !== 'AbortError') {

          setError(
            error.message ||
            'Ocurrió un error al consultar el stock crítico.'
          )

        }

      } finally {

        if (!controlador.signal.aborted) {
          setCargando(false)
        }

      }
    }

    cargarProductosCriticos()

    return () => controlador.abort()

  }, [])

  return (
    <>

      <div className="admin-title">

        <h1>
          Productos críticos
        </h1>

        <p>
          Productos cuyo stock actual alcanzó o bajó
          de su nivel crítico.
        </p>

      </div>

      <div className="admin-toolbar">

        <span>
          {cargando
            ? 'Consultando inventario...'
            : `${productosCriticos.length} producto(s) con stock crítico.`}
        </span>

      </div>

      {cargando && (

        <div className="content-card">

          <p>
            Cargando productos críticos...
          </p>

        </div>

      )}

      {!cargando && error && (

        <div className="form-message error">

          ⚠️ {error}

        </div>

      )}

      {!cargando && !error && (

        productosCriticos.length > 0 ? (

          <div className="admin-critical-grid">

            {productosCriticos.map(producto => (

              <CriticalProduct
                key={producto.id}
                producto={producto}
              />

            ))}

          </div>

        ) : (

          <div className="content-card">

            <h2>
              Sin productos críticos
            </h2>

            <p>
              Todos los productos tienen stock suficiente.
            </p>

          </div>

        )

      )}

    </>
  )
}

export default ProductosCriticos
