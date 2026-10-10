import { Link } from 'react-router-dom'

function Login() {

  function manejarSubmit(event) {
    event.preventDefault()
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
                minLength="4"
                maxLength="10"
              />

            </div>

            <button
              className="btn btn-primary"
              type="submit"
              style={{ marginTop: '20px', width: '100%' }}
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