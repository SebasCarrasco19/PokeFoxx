
import { useEffect, useState } from 'react'
import {
  Link,
  Navigate,
  useNavigate
} from 'react-router-dom'

import { regiones } from '../data/adminData'
import '../css/account.css'

export default function EditarPerfil() {

  const navigate = useNavigate()

  let sesion = null

  try {
    sesion = JSON.parse(
      localStorage.getItem('sesion') || 'null'
    )
  } catch {
    sesion = null
  }

  const token = localStorage.getItem('token')

  const [usuario, setUsuario] = useState(null)

  const [regionSeleccionada, setRegionSeleccionada] =
    useState('')

  const [comunaSeleccionada, setComunaSeleccionada] =
    useState('')

  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)

  const comunas = regiones.find(
    item => item.region === regionSeleccionada
  )?.comunas ?? []

  useEffect(() => {

    if (!sesion || !token) {
      setCargando(false)
      return
    }

    const controlador = new AbortController()

    async function cargarPerfil() {

      try {

        setCargando(true)
        setMensaje('')

        const respuesta = await fetch(
          'http://localhost:8080/api/v1/usuarios/me',
          {
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

          throw new Error(
            'No fue posible cargar tus datos personales.'
          )
        }

        const datos = await respuesta.json()

        if (!controlador.signal.aborted) {

          setUsuario(datos)

          setRegionSeleccionada(
            datos.region ?? ''
          )

          setComunaSeleccionada(
            datos.commune ?? ''
          )

        }

      } catch (error) {

        if (error.name !== 'AbortError') {
          setMensaje(
            error.message ||
            'No fue posible cargar tu perfil.'
          )
        }

      } finally {

        if (!controlador.signal.aborted) {
          setCargando(false)
        }

      }
    }

    cargarPerfil()

    return () => controlador.abort()

  }, [])

  function cambiarRegion(event) {

    setRegionSeleccionada(event.target.value)
    setComunaSeleccionada('')

  }

  async function guardarCambios(event) {

    event.preventDefault()

    if (!usuario || guardando) {
      return
    }

    setMensaje('')

    const formulario = new FormData(event.currentTarget)

    const firstName = String(
      formulario.get('firstName') || ''
    ).trim()

    const lastName = String(
      formulario.get('lastName') || ''
    ).trim()

    const birthDate = String(
      formulario.get('birthDate') || ''
    )

    const address = String(
      formulario.get('address') || ''
    ).trim()

    if (
      !firstName ||
      !lastName ||
      !birthDate ||
      !regionSeleccionada ||
      !comunaSeleccionada ||
      !address
    ) {

      setMensaje(
        'Debes completar todos los campos obligatorios.'
      )

      return
    }

    setGuardando(true)

    try {

      const tokenActual =
        localStorage.getItem('token')

      if (!tokenActual) {
        throw new Error(
          'Debes iniciar sesión nuevamente.'
        )
      }

      const datosActualizados = {
        firstName,
        lastName,
        birthDate,
        region: regionSeleccionada,
        commune: comunaSeleccionada,
        address
      }

      const respuesta = await fetch(
        'http://localhost:8080/api/v1/usuarios/me',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenActual}`
          },
          body: JSON.stringify(datosActualizados)
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
            'No tienes permiso para modificar este perfil.'
          )
        }

        const contenido = await respuesta.text()

        let datosError = null

        try {
          datosError = contenido
            ? JSON.parse(contenido)
            : null
        } catch {
          datosError = null
        }

        throw new Error(
          datosError?.error ||
          datosError?.message ||
          `No fue posible guardar los cambios (HTTP ${respuesta.status}).`
        )
      }

      const actualizado = await respuesta.json()

      const sesionActual = JSON.parse(
        localStorage.getItem('sesion') || 'null'
      )

      if (sesionActual) {

        localStorage.setItem(
          'sesion',
          JSON.stringify({
            ...sesionActual,
            firstName: actualizado.firstName,
            lastName: actualizado.lastName,
            email: actualizado.email,
            run: actualizado.run
          })
        )

      }

      navigate('/perfil')

    } catch (error) {

      setMensaje(
        error.message ||
        'Ocurrió un error al guardar los cambios.'
      )

    } finally {

      setGuardando(false)

    }
  }

  if (!sesion || !token) {
    return <Navigate to="/login" replace />
  }

  if (cargando) {

    return (
      <main>
        <section className="section">
          <div className="container">
            <div className="content-card">
              Cargando datos personales...
            </div>
          </div>
        </section>
      </main>
    )
  }

  if (!usuario) {

    return (
      <main>
        <section className="section">
          <div className="container">

            <div className="content-card">

              <h1>
                No se pudo cargar el perfil
              </h1>

              <p>
                {mensaje || 'Usuario no encontrado.'}
              </p>

              <Link
                className="btn btn-secondary"
                to="/perfil"
              >
                Volver a mi perfil
              </Link>

            </div>

          </div>
        </section>
      </main>
    )
  }

  return (
    <main>

      <section className="page-header">

        <div className="container">

          <span className="eyebrow">
            Cliente
          </span>

          <h1>
            Editar perfil
          </h1>

          <p>
            Actualiza tus datos personales.
            Tu rol continuará siendo Cliente.
          </p>

        </div>

      </section>

      <section className="section">

        <div className="container">

          <section className="content-card edit-profile-card">

            <div className="edit-profile-top-actions">

              <Link
                className="btn btn-secondary btn-sm"
                to="/perfil"
              >
                ← Volver a mi perfil
              </Link>

            </div>

            <div className="account-heading">

              <div>

                <h2>
                  Datos personales
                </h2>

                <p>
                  Modifica la información que necesites.
                </p>

              </div>

            </div>

            <span className="profile-role">
              Perfil: Cliente
            </span>

            {mensaje && (

              <div
                className="form-message error"
                style={{ marginBottom: '20px' }}
              >
                ⚠️ {mensaje}
              </div>

            )}

            <form
              id="profileForm"
              onSubmit={guardarCambios}
            >

              <div className="form-grid">

                <div className="form-group">

                  <label htmlFor="profileRun">
                    RUN
                  </label>

                  <input
                    id="profileRun"
                    name="run"
                    value={usuario.run ?? ''}
                    readOnly
                  />

                </div>

                <div className="form-group">

                  <label htmlFor="profileFirstName">
                    Nombre
                  </label>

                  <input
                    id="profileFirstName"
                    name="firstName"
                    defaultValue={usuario.firstName ?? ''}
                    maxLength={50}
                    required
                  />

                </div>

                <div className="form-group">

                  <label htmlFor="profileLastName">
                    Apellidos
                  </label>

                  <input
                    id="profileLastName"
                    name="lastName"
                    defaultValue={usuario.lastName ?? ''}
                    maxLength={100}
                    required
                  />

                </div>

                <div className="form-group">

                  <label htmlFor="profileEmail">
                    Correo
                  </label>

                  <input
                    id="profileEmail"
                    name="email"
                    type="email"
                    value={usuario.email ?? ''}
                    readOnly
                  />

                  <span className="help-text">
                    El correo no se puede modificar desde el perfil.
                  </span>

                </div>

                <div className="form-group">

                  <label htmlFor="profileBirthDate">
                    Fecha de nacimiento
                  </label>

                  <input
                    id="profileBirthDate"
                    name="birthDate"
                    type="date"
                    defaultValue={usuario.birthDate ?? ''}
                    required
                  />

                </div>

                <div className="form-group">

                  <label htmlFor="profileRegion">
                    Región
                  </label>

                  <select
                    id="profileRegion"
                    name="region"
                    value={regionSeleccionada}
                    onChange={cambiarRegion}
                    required
                  >

                    <option value="">
                      Selecciona una región
                    </option>

                    {regiones.map(item => (

                      <option
                        key={item.region}
                        value={item.region}
                      >
                        {item.region}
                      </option>

                    ))}

                  </select>

                </div>

                <div className="form-group">

                  <label htmlFor="profileCommune">
                    Comuna
                  </label>

                  <select
                    id="profileCommune"
                    name="commune"
                    value={comunaSeleccionada}
                    onChange={event =>
                      setComunaSeleccionada(
                        event.target.value
                      )
                    }
                    disabled={!regionSeleccionada}
                    required
                  >

                    <option value="">
                      Selecciona una comuna
                    </option>

                    {comunas.map(comuna => (

                      <option
                        key={comuna}
                        value={comuna}
                      >
                        {comuna}
                      </option>

                    ))}

                  </select>

                </div>

                <div className="form-group full">

                  <label htmlFor="profileAddress">
                    Dirección
                  </label>

                  <input
                    id="profileAddress"
                    name="address"
                    defaultValue={usuario.address ?? ''}
                    maxLength={300}
                    required
                  />

                </div>

              </div>

              <div className="profile-actions">

                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={guardando}
                >
                  {guardando
                    ? 'Guardando...'
                    : 'Guardar cambios'}
                </button>

                <Link
                  className="btn btn-secondary"
                  to="/perfil"
                >
                  Cancelar
                </Link>

              </div>

            </form>

          </section>

        </div>

      </section>

    </main>
  )
}
