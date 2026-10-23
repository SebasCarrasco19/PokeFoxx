import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usuariosIniciales, regiones } from '../data/adminData'

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

function Registro() {
  const navigate = useNavigate()

  const [regionSeleccionada, setRegionSeleccionada] = useState('')
  const [comunaSeleccionada, setComunaSeleccionada] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [tipoMensaje, setTipoMensaje] = useState('')

  const comunas =
    regiones.find(
      item => item.region === regionSeleccionada
    )?.comunas ?? []

  function cambiarRegion(event) {
    setRegionSeleccionada(event.target.value)
    setComunaSeleccionada('')
  }

  function manejarSubmit(event) {
    event.preventDefault()
    setMensaje('')

    const formulario = new FormData(event.target)

    const usuarios =
      JSON.parse(localStorage.getItem('usuarios')) ||
      usuariosIniciales

    const run =
      formulario.get('run').trim().toUpperCase()

    const email =
      formulario.get('email').trim()

    if (!validarRun(run)) {
      setTipoMensaje('error')
      setMensaje('El RUN ingresado no es válido.')
      return
    }

    const dominioValido =
      /@(gmail\.com|duoc\.cl|profesor\.duoc\.cl)$/i.test(email)

    if (!dominioValido) {
      setTipoMensaje('error')
      setMensaje(
        'El correo debe ser @gmail.com, @duoc.cl o @profesor.duoc.cl.'
      )
      return
    }

    const runExiste = usuarios.some(
      usuario =>
        usuario.run.toUpperCase() === run
    )

    if (runExiste) {
      setTipoMensaje('error')
      setMensaje('Ya existe una cuenta con ese RUN.')
      return
    }

    const correoExiste = usuarios.some(
      usuario =>
        usuario.email.toLowerCase() ===
        email.toLowerCase()
    )

    if (correoExiste) {
      setTipoMensaje('error')
      setMensaje('Ya existe una cuenta con ese correo.')
      return
    }

    const nuevoUsuario = {
      run,
      firstName: formulario.get('firstName').trim(),
      lastName: formulario.get('lastName').trim(),
      email,
      birthDate: formulario.get('birthDate'),
      password: formulario.get('password'),
      role: 'Cliente',
      region: regionSeleccionada,
      commune: comunaSeleccionada,
      address: formulario.get('address').trim()
    }

    localStorage.setItem(
      'usuarios',
      JSON.stringify([
        ...usuarios,
        nuevoUsuario
      ])
    )

    setTipoMensaje('success')
    setMensaje(
      'Cuenta creada correctamente. Ahora puedes iniciar sesión.'
    )

    setTimeout(() => {
      navigate('/login')
    }, 1500)
  }

  return (
    <main>

      <section className="page-header">
        <div className="container">
          <span className="eyebrow">
            Mi cuenta
          </span>

          <h1>Crear cuenta</h1>

          <p>
            Regístrate como cliente de PokeFoxx.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">

          <form
            className="content-card form-card"
            onSubmit={manejarSubmit}
          >
            <div className="form-grid">

              <div className="form-group">
                <label htmlFor="run">RUN</label>

                <input
                  id="run"
                  name="run"
                  type="text"
                  minLength="7"
                  maxLength="9"
                  placeholder="190110222"
                  required
                />

                <span className="help-text">
                  Sin puntos ni guion.
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="birthDate">
                  Fecha de nacimiento
                </label>

                <input
                  id="birthDate"
                  name="birthDate"
                  type="date"
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
                  type="text"
                  maxLength="50"
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
                  type="text"
                  maxLength="100"
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
                  maxLength="100"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  Contraseña
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  minLength="4"
                  maxLength="10"
                  required
                />
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
                <label htmlFor="address">
                  Dirección
                </label>

                <input
                  id="address"
                  name="address"
                  type="text"
                  maxLength="300"
                  required
                />
              </div>

              {mensaje && (
                <div className="form-group full">
                  <div
                    className={`form-message ${tipoMensaje}`}
                  >
                    {tipoMensaje === 'success'
                      ? '✅'
                      : '⚠️'}{' '}
                    {mensaje}
                  </div>
                </div>
              )}

              <div className="form-group full">
                <button
                  className="btn btn-primary"
                  type="submit"
                >
                  Registrarse
                </button>
              </div>

            </div>

            <p
              style={{
                textAlign: 'center',
                marginTop: '20px',
                marginBottom: 0
              }}
            >
              ¿Ya tienes una cuenta?{' '}

              <Link to="/login">
                Inicia sesión
              </Link>
            </p>

          </form>

        </div>
      </section>

    </main>
  )
}

export default Registro