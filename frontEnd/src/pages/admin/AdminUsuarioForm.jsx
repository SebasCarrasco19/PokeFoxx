import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { usuariosIniciales, regiones } from '../../data/adminData'

const formularioVacio = {
  run: '',
  firstName: '',
  lastName: '',
  email: '',
  birthDate: '',
  password: '',
  role: '',
  region: '',
  commune: '',
  address: ''
}

function validarRun(run) {
  const runLimpio = run.trim().toUpperCase()

  if (!/^\d{6,8}[0-9K]$/.test(runLimpio)) {
    return false
  }

  const cuerpo = runLimpio.slice(0, -1)
  const dvIngresado = runLimpio.slice(-1)

  let suma = 0
  let multiplicador = 2

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplicador
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1
  }

  const resultado = 11 - (suma % 11)

  const dvCalculado =
    resultado === 11
      ? '0'
      : resultado === 10
        ? 'K'
        : String(resultado)

  return dvIngresado === dvCalculado
}

function AdminUsuarioForm() {
  const { run } = useParams()
  const navigate = useNavigate()

  const usuarios =
    JSON.parse(localStorage.getItem('usuarios')) ||
    usuariosIniciales

  const usuarioActual = usuarios.find(
    usuario => usuario.run === run
  )

  const datos = usuarioActual ?? formularioVacio
  const editando = Boolean(run)

  const [regionSeleccionada, setRegionSeleccionada] =
    useState(datos.region)

  const [comunaSeleccionada, setComunaSeleccionada] =
    useState(datos.commune)

  const [mensaje, setMensaje] = useState('')

  const comunas =
    regiones.find(
      item => item.region === regionSeleccionada
    )?.comunas ?? []

  function cambiarRegion(event) {
    setRegionSeleccionada(event.target.value)
    setComunaSeleccionada('')
  }

  function guardarUsuario(event) {
    event.preventDefault()
    setMensaje('')

    const formulario = new FormData(event.target)

    const runUsuario = editando
      ? run
      : formulario.get('run').trim().toUpperCase()

    if (!validarRun(runUsuario)) {
      setMensaje('El RUN ingresado no es válido.')
      return
    }

    if (!editando) {
      const runExiste = usuarios.some(
        usuario =>
          usuario.run.toUpperCase() === runUsuario
      )

      if (runExiste) {
        setMensaje('Ya existe un usuario con ese RUN.')
        return
      }
    }

    const correo =
      formulario.get('email').trim()

    const correoExiste = usuarios.some(
      usuario =>
        usuario.email.toLowerCase() === correo.toLowerCase() &&
        usuario.run !== run
    )
    const dominioValido =
      /@(gmail\.com|duoc\.cl|profesor\.duoc\.cl)$/i.test(correo)

    if (!dominioValido) {
      setMensaje(
        'El correo debe ser @gmail.com, @duoc.cl o @profesor.duoc.cl.'
      )
      return
    }
    
    if (correoExiste) {
      setMensaje('Ya existe un usuario con ese correo.')
      return
    }

    const usuarioGuardado = {
      run: runUsuario,
      firstName: formulario.get('firstName').trim(),
      lastName: formulario.get('lastName').trim(),
      email: correo,
      birthDate: formulario.get('birthDate'),
      password: formulario.get('password'),
      role: formulario.get('role'),
      region: regionSeleccionada,
      commune: comunaSeleccionada,
      address: formulario.get('address').trim()
    }

    const usuariosActualizados = editando
      ? usuarios.map(usuario =>
        usuario.run === run
          ? usuarioGuardado
          : usuario
      )
      : [...usuarios, usuarioGuardado]

    localStorage.setItem(
      'usuarios',
      JSON.stringify(usuariosActualizados)
    )

    navigate('/admin/usuarios')
  }

  if (editando && !usuarioActual) {
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
          {editando ? 'Editar usuario' : 'Nuevo usuario'}
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
              minLength="7"
              maxLength="9"
              placeholder="19011022K"
              readOnly={editando}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="firstName">Nombre</label>

            <input
              id="firstName"
              name="firstName"
              defaultValue={datos.firstName}
              maxLength="50"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Apellidos</label>

            <input
              id="lastName"
              name="lastName"
              defaultValue={datos.lastName}
              maxLength="100"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo</label>

            <input
              id="email"
              name="email"
              type="email"
              defaultValue={datos.email}
              maxLength="100"
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
              defaultValue={datos.birthDate}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>

            <input
              id="password"
              name="password"
              type="password"
              defaultValue={datos.password}
              minLength="4"
              maxLength="10"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Tipo de usuario</label>

            <select
              id="role"
              name="role"
              defaultValue={datos.role}
              required
            >
              <option value="">Selecciona un perfil</option>
              <option value="Administrador">Administrador</option>
              <option value="Cliente">Cliente</option>
              <option value="Vendedor">Vendedor</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="region">Región</label>

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
            <label htmlFor="commune">Comuna</label>

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
                <option key={comuna} value={comuna}>
                  {comuna}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group full">
            <label htmlFor="address">Dirección</label>

            <input
              id="address"
              name="address"
              defaultValue={datos.address}
              maxLength="300"
              required
            />
          </div>

        </div>

        <div className="admin-button-row">
          <button
            className="btn btn-primary"
            type="submit"
          >
            Guardar usuario
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

export default AdminUsuarioForm