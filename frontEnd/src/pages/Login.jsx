import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usuariosIniciales } from '../data/adminData'

function Login() {

  const navigate = useNavigate()

  const [mensaje, setMensaje] = useState('')


  function manejarSubmit(event) {

    event.preventDefault()

    setMensaje('')


    const formulario =
      new FormData(event.target)


    const email =
      formulario.get('email').trim()

    const password =
      formulario.get('password')


    const usuarios =
      JSON.parse(localStorage.getItem('usuarios')) ||
      usuariosIniciales


    const usuarioEncontrado =
      usuarios.find(
        usuario =>
          usuario.email.toLowerCase() ===
            email.toLowerCase() &&
          usuario.password === password
      )


    if (!usuarioEncontrado) {

      setMensaje(
        'Correo o contraseña incorrectos.'
      )

      return
    }


    const sesion = {

      run:
        usuarioEncontrado.run,

      firstName:
        usuarioEncontrado.firstName,

      lastName:
        usuarioEncontrado.lastName,

      email:
        usuarioEncontrado.email,

      role:
        usuarioEncontrado.role,
    }


    localStorage.setItem(
      'sesion',
      JSON.stringify(sesion)
    )


    if (
      usuarioEncontrado.role === 'Administrador' ||
      usuarioEncontrado.role === 'Vendedor'
    ) {

      navigate('/admin')

    } else {

      navigate('/perfil')
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

            <h1>
              Iniciar sesión
            </h1>

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
              style={{
                marginTop: '18px'
              }}
            >

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


            {mensaje && (

              <div
                className="form-message error"
                style={{
                  marginTop: '18px'
                }}
              >

                ⚠️ {mensaje}

              </div>

            )}


            <button
              className="btn btn-primary"
              type="submit"
              style={{
                marginTop: '20px',
                width: '100%'
              }}
            >
              Iniciar sesión
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