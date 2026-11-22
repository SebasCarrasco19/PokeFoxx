
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { regiones } from '../../data/adminData'

const API = 'http://localhost:8080/api/v1'

const formularioVacio = {
  id: null,
  run: '',
  firstName: '',
  lastName: '',
  email: '',
  birthDate: '',
  role: '',
  region: '',
  commune: '',
  address: ''
}

function validarRun(run) {

  const limpio = run.trim().toUpperCase()

  if (!/^\d{6,8}[0-9K]$/.test(limpio)) {
    return false
  }

  const cuerpo = limpio.slice(0, -1)
  const dv = limpio.slice(-1)

  let suma = 0
  let multiplicador = 2

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplicador
    multiplicador = multiplicador === 7
      ? 2
      : multiplicador + 1
  }

  const resultado = 11 - (suma % 11)

  const calculado = resultado === 11
    ? '0'
    : resultado === 10
      ? 'K'
      : String(resultado)

  return dv === calculado
}

async function obtenerError(respuesta) {

  const texto = await respuesta.text()
  let datos = null

  try {
    datos = texto ? JSON.parse(texto) : null
  } catch {
    datos = null
  }

  if (respuesta.status === 401) {
    return 'Tu sesión venció. Inicia sesión nuevamente.'
  }

  if (respuesta.status === 403) {
    return 'No tienes permiso para realizar esta operación.'
  }

  return (
    datos?.error ||
    datos?.message ||
    `Error del servidor (HTTP ${respuesta.status}).`
  )
}

export default function AdminUsuarioForm() {

  const { run } = useParams()
  const navigate = useNavigate()
  const editando = Boolean(run)

  const sesion = JSON.parse(
    localStorage.getItem('sesion') || 'null'
  )

  const [datos, setDatos] = useState(formularioVacio)
  const [usuarios, setUsuarios] = useState([])

  const [regionSeleccionada, setRegionSeleccionada] =
    useState('')

  const [comunaSeleccionada, setComunaSeleccionada] =
    useState('')

  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [noEncontrado, setNoEncontrado] = useState(false)

  const comunas = regiones.find(
    item => item.region === regionSeleccionada
  )?.comunas ?? []

  const esCuentaPropia = editando && (
    datos.run === sesion?.run ||
    datos.email === sesion?.email
  )

  useEffect(() => {

    const controlador = new AbortController()

    async function cargarUsuarios() {

      try {

        setCargando(true)
        setMensaje('')
        setNoEncontrado(false)
        setDatos(formularioVacio)
        setRegionSeleccionada('')
        setComunaSeleccionada('')

        const token = localStorage.getItem('token')

        if (!token) {
          throw new Error(
            'Debes iniciar sesión como Administrador.'
          )
        }

        const respuesta = await fetch(
          `${API}/usuarios`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
            signal: controlador.signal
          }
        )

        if (!respuesta.ok) {
          throw new Error(
            await obtenerError(respuesta)
          )
        }

        const lista = await respuesta.json()

        if (!Array.isArray(lista)) {
          throw new Error(
            'El servidor devolvió datos incorrectos.'
          )
        }

        if (controlador.signal.aborted) return

        setUsuarios(lista)

        if (editando) {

          const usuario = lista.find(
            item => String(item.run) === String(run)
          )

          if (!usuario) {
            setNoEncontrado(true)
            return
          }

          setDatos(usuario)
          setRegionSeleccionada(usuario.region ?? '')
          setComunaSeleccionada(usuario.commune ?? '')
        }

      } catch (error) {

        if (error.name !== 'AbortError') {
          setMensaje(
            error.message ||
            'No fue posible cargar los usuarios.'
          )
        }

      } finally {

        if (!controlador.signal.aborted) {
          setCargando(false)
        }

      }
    }

    cargarUsuarios()

    return () => controlador.abort()

  }, [run, editando])

  function cambiarRegion(event) {

    setRegionSeleccionada(event.target.value)
    setComunaSeleccionada('')
  }

  async function guardarUsuario(event) {

    event.preventDefault()

    if (guardando || cargando) return

    setMensaje('')

    const formulario = new FormData(event.currentTarget)

    const runUsuario = editando
      ? datos.run
      : String(formulario.get('run') || '')
          .trim()
          .toUpperCase()

    const nombre = String(
      formulario.get('firstName') || ''
    ).trim()

    const apellido = String(
      formulario.get('lastName') || ''
    ).trim()

    const correo = String(
      formulario.get('email') || ''
    ).trim().toLowerCase()

    const fechaNacimiento = String(
      formulario.get('birthDate') || ''
    )

    const password = String(
      formulario.get('password') || ''
    )

    const rol = esCuentaPropia
      ? datos.role
      : String(formulario.get('role') || '')

    const direccion = String(
      formulario.get('address') || ''
    ).trim()

    if (!validarRun(runUsuario)) {
      setMensaje('El RUN ingresado no es válido.')
      return
    }

    if (!nombre || !apellido) {
      setMensaje(
        'Debes completar el nombre y los apellidos.'
      )
      return
    }

    const dominioValido =
      /@(gmail\.com|duoc\.cl|profesor\.duoc\.cl)$/i.test(correo)

    if (!dominioValido) {
      setMensaje(
        'El correo debe ser @gmail.com, @duoc.cl o @profesor.duoc.cl.'
      )
      return
    }

    if (!rol) {
      setMensaje(
        'Debes seleccionar un tipo de usuario.'
      )
      return
    }

    if (
      !fechaNacimiento ||
      !regionSeleccionada ||
      !comunaSeleccionada ||
      !direccion
    ) {
      setMensaje(
        'Debes completar todos los campos obligatorios.'
      )
      return
    }

    if (!editando && password.length < 4) {
      setMensaje(
        'La contraseña debe tener al menos 4 caracteres.'
      )
      return
    }

    const runExiste = usuarios.some(
      usuario =>
        usuario.run?.toUpperCase() === runUsuario &&
        usuario.id !== datos.id
    )

    if (runExiste) {
      setMensaje(
        'Ya existe un usuario con ese RUN.'
      )
      return
    }

    const correoExiste = usuarios.some(
      usuario =>
        usuario.email?.toLowerCase() === correo &&
        usuario.id !== datos.id
    )

    if (correoExiste) {
      setMensaje(
        'Ya existe un usuario con ese correo.'
      )
      return
    }

    const usuarioGuardado = {
      run: runUsuario,
      firstName: nombre,
      lastName: apellido,
      email: correo,
      birthDate: fechaNacimiento,
      region: regionSeleccionada,
      commune: comunaSeleccionada,
      address: direccion
    }

    setGuardando(true)

    try {

      const token = localStorage.getItem('token')

      if (!token) {
        throw new Error(
          'Debes iniciar sesión como Administrador.'
        )
      }

      if (editando) {

        const respuesta = await fetch(
          `${API}/usuarios/${datos.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(usuarioGuardado)
          }
        )

        if (!respuesta.ok) {
          throw new Error(
            await obtenerError(respuesta)
          )
        }

        if (rol !== datos.role) {

          const respuestaRol = await fetch(
            `${API}/usuarios/${datos.id}/rol`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                role: rol
              })
            }
          )

          if (!respuestaRol.ok) {
            throw new Error(
              'Los datos personales se guardaron, pero no se pudo cambiar el rol: ' +
              await obtenerError(respuestaRol)
            )
          }
        }

      } else {

        const respuesta = await fetch(
          `${API}/auth/register`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              ...usuarioGuardado,
              password
            })
          }
        )

        if (!respuesta.ok) {
          throw new Error(
            await obtenerError(respuesta)
          )
        }

        const usuarioCreado = await respuesta.json()

        if (rol !== 'Cliente') {

          const respuestaRol = await fetch(
            `${API}/usuarios/${usuarioCreado.id}/rol`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                role: rol
              })
            }
          )

          if (!respuestaRol.ok) {
            throw new Error(
              'El usuario fue creado como Cliente, pero no se pudo asignar el rol solicitado: ' +
              await obtenerError(respuestaRol)
            )
          }
        }
      }

      navigate('/admin/usuarios')

    } catch (error) {

      setMensaje(
        error.message ||
        'No fue posible guardar el usuario.'
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

        <h1>Usuario no encontrado</h1>

        <Link
          className="btn btn-primary"
          to="/admin/usuarios"
        >
          Volver a usuarios
        </Link>

      </div>
    )
  }

  return (
    <>

      <div className="admin-title">

        <h1>
          {editando
            ? 'Editar usuario'
            : 'Nuevo usuario'}
        </h1>

        <p>
          {editando
            ? 'Modifica los datos del usuario.'
            : 'Completa los datos para registrar un nuevo usuario.'}
        </p>

      </div>

      <form
        className="content-card admin-form"
        key={run ?? 'nuevo'}
        onSubmit={guardarUsuario}
      >

        {mensaje && (

          <div
            className="form-message error"
            style={{ marginBottom: '20px' }}
          >
            ⚠️ {mensaje}
          </div>

        )}

        <div className="form-grid">

          <div className="form-group">

            <label htmlFor="run">RUN</label>

            <input
              id="run"
              name="run"
              defaultValue={datos.run}
              minLength={7}
              maxLength={9}
              placeholder="19011022K"
              readOnly={editando}
              required
            />

          </div>

          <div className="form-group">

            <label htmlFor="firstName">
              Nombre
            </label>

            <input
              id="firstName"
              name="firstName"
              defaultValue={datos.firstName}
              maxLength={50}
              required
            />

          </div>

          <div className="form-group">

            <label htmlFor="lastName">
              Apellidos
            </label>

            <input
              id="lastName"
              name="lastName"
              defaultValue={datos.lastName}
              maxLength={100}
              required
            />

          </div>

          <div className="form-group">

            <label htmlFor="email">
              Correo
            </label>

            <input
              id="email"
              name="email"
              type="email"
              defaultValue={datos.email}
              maxLength={100}
              required
            />

          </div>

          <div className="form-group">

            <label htmlFor="birthDate">
              Fecha de nacimiento
            </label>

            <input
              id="birthDate"
              name="birthDate"
              type="date"
              defaultValue={datos.birthDate ?? ''}
              required
            />

          </div>

          {!editando && (

            <div className="form-group">

              <label htmlFor="password">
                Contraseña
              </label>

              <input
                id="password"
                name="password"
                type="password"
                minLength={4}
                maxLength={10}
                autoComplete="new-password"
                required
              />

            </div>

          )}

          <div className="form-group">

            <label htmlFor="role">
              Tipo de usuario
            </label>

            <select
              id="role"
              name="role"
              defaultValue={datos.role}
              disabled={esCuentaPropia}
              required
            >

              <option value="">
                Selecciona un perfil
              </option>

              <option value="Administrador">
                Administrador
              </option>

              <option value="Cliente">
                Cliente
              </option>

              <option value="Vendedor">
                Vendedor
              </option>

            </select>

            {esCuentaPropia && (
              <small>
                No puedes modificar tu propio rol.
              </small>
            )}

          </div>

          <div className="form-group">

            <label htmlFor="region">
              Región
            </label>

            <select
              id="region"
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

            <label htmlFor="commune">
              Comuna
            </label>

            <select
              id="commune"
              name="commune"
              value={comunaSeleccionada}
              onChange={event =>
                setComunaSeleccionada(event.target.value)
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

            <label htmlFor="address">
              Dirección
            </label>

            <input
              id="address"
              name="address"
              defaultValue={datos.address}
              maxLength={300}
              required
            />

          </div>

        </div>

        <div className="admin-button-row">

          <button
            className="btn btn-primary"
            type="submit"
            disabled={guardando || Boolean(mensaje && usuarios.length === 0)}
          >
            {guardando
              ? 'Guardando...'
              : 'Guardar usuario'}
          </button>

          <Link
            className="btn btn-secondary"
            to="/admin/usuarios"
          >
            Volver
          </Link>

        </div>

      </form>

    </>
  )
}
