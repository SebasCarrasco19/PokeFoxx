
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

      // Enviar las credenciales al backend
      const respuesta = await fetch(
        'http://localhost:8080/api/auth/login',
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
          'Correo o contraseña incorrectos.'
        )
      }

      // Comprobar que recibimos el JWT
      if (!datos.token) {
        throw new Error(
          'El servidor no entregó un token JWT.'
        )
      }

      // Obtener los datos del usuario
      const usuario = datos.usuario

      if (!usuario || !usuario.role) {
        throw new Error(
          'El servidor no entregó los datos del usuario.'
        )
      }

      // Adaptar los roles del backend al frontend
      const roles = {
        ROLE_ADMINISTRADOR: 'Administrador',
        ROLE_VENDEDOR: 'Vendedor',
        ROLE_CLIENTE: 'Cliente',
        ADMINISTRADOR: 'Administrador',
        VENDEDOR: 'Vendedor',
        CLIENTE: 'Cliente'
      }

      const rol = roles[usuario.role]

      if (!rol) {
        throw new Error('Rol de usuario no reconocido.')
      }

      // Guardar la sesión
      const sesion = {
        run: usuario.run,
        firstName: usuario.firstName,
        lastName: usuario.lastName,
        email: usuario.email,
        role: rol
      }

      localStorage.setItem('token', datos.token)

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
