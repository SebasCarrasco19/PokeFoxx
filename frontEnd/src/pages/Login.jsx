
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {

  const navigate = useNavigate()

  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  async function manejarSubmit(event) {

    event.preventDefault()

    setMensaje('')
    setCargando(true)

    const formulario = new FormData(event.target)

    const email = formulario.get('email').trim()
    const password = formulario.get('password')

    try {

      // Iniciar sesión en el backend
      const respuesta = await fetch(
        'http://localhost:8080/api/v1/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      )

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(
          datos.error ||
          datos.message ||
          'Correo o contraseña incorrectos.'
        )
      }

      if (!datos.token) {
        throw new Error(
          'El servidor no entregó un token JWT.'
        )
      }

      // Obtener el usuario autenticado mediante JWT
      const respuestaUsuario = await fetch(
        'http://localhost:8080/api/v1/usuarios/me',
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${datos.token}`
          }
        }
      )

      if (!respuestaUsuario.ok) {
        throw new Error(
          'No fue posible obtener los datos del usuario.'
        )
      }

      const usuario = await respuestaUsuario.json()

      // Adaptar los roles del backend al frontend
      const roles = {
        ADMINISTRADOR: 'Administrador',
        VENDEDOR: 'Vendedor',
        CLIENTE: 'Cliente'
      }

      const rolBackend = String(
        usuario.role || usuario.rol || ''
      )
        .trim()
        .replace(/^ROLE_/i, '')
        .toUpperCase()

      const rol = roles[rolBackend]
      if (!rol) {
        throw new Error('Rol de usuario no reconocido.')
      }

      // Guardar los datos de la sesión
      const sesion = {
        run: usuario.run,
        firstName: usuario.firstName,
        lastName: usuario.lastName,
        email: usuario.email,
        role: rol
      }

      localStorage.setItem('token', datos.token)

      if (datos.refreshToken) {
        localStorage.setItem(
          'refreshToken',
          datos.refreshToken
        )
      } else {
        localStorage.removeItem('refreshToken')
      }

      localStorage.setItem(
        'sesion',
        JSON.stringify(sesion)
      )

      // Redirigir según el rol
      if (
        rol === 'Administrador' ||
        rol === 'Vendedor'
      ) {
        navigate('/admin')
      } else {
        navigate('/perfil')
      }

    } catch (error) {

      setMensaje(
        error.message ||
        'No fue posible iniciar sesión.'
      )

    } finally {

      setCargando(false)

    }
  }

  return (
    <main>

      <section className="section">

        <div className="container">

          <div className="login-brand">

            <img
              src="/assets/img/logo.svg"
              alt="PokeFoxx"
            />

            <h1>Iniciar sesión</h1>

            <p>
              Ingresa a tu cuenta de PokeFoxx.
            </p>

          </div>

          <form
            className="content-card form-card"
            onSubmit={manejarSubmit}
          >

            <div className="form-group">

              <label htmlFor="email">
                Correo
              </label>

              <input
                id="email"
                name="email"
                type="email"
                maxLength="100"
                placeholder="correo@ejemplo.com"
                required
              />

            </div>

            <div
              className="form-group"
              style={{ marginTop: '18px' }}
            >

              <label htmlFor="password">
                Contraseña
              </label>

              <input
                id="password"
                name="password"
                type="password"
                required
              />

            </div>

            {mensaje && (

              <div
                className="form-message error"
                style={{ marginTop: '18px' }}
              >
                ⚠️ {mensaje}
              </div>

            )}

            <button
              className="btn btn-primary"
              type="submit"
              disabled={cargando}
              style={{
                marginTop: '20px',
                width: '100%'
              }}
            >
              {cargando
                ? 'Iniciando sesión...'
                : 'Iniciar sesión'}
            </button>

            <p
              style={{
                textAlign: 'center',
                marginTop: '18px',
                marginBottom: 0
              }}
            >
              ¿No tienes una cuenta?{' '}

              <Link to="/registro">
                Regístrate aquí
              </Link>
            </p>

          </form>

        </div>

      </section>

    </main>
  )
}

export default Login
