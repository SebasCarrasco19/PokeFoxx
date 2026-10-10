import { Link } from 'react-router-dom'

function Registro() {

  function manejarSubmit(event) {
    event.preventDefault()
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

                <label htmlFor="run">
                  RUN
                </label>

                <input
                  id="run"
                  name="run"
                  type="text"
                  minLength="7"
                  maxLength="9"
                  placeholder="19011022K"
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
                />

              </div>


              <div className="form-group">

                <label htmlFor="region">
                  Región
                </label>

                <select
                  id="region"
                  name="region"
                  defaultValue=""
                >
                  <option value="">
                    Selecciona una región
                  </option>

                  <option value="Región Metropolitana">
                    Región Metropolitana
                  </option>

                  <option value="Región del Biobío">
                    Región del Biobío
                  </option>

                  <option value="Región de Valparaíso">
                    Región de Valparaíso
                  </option>

                </select>

              </div>


              <div className="form-group">

                <label htmlFor="commune">
                  Comuna
                </label>

                <select
                  id="commune"
                  name="commune"
                  defaultValue=""
                >
                  <option value="">
                    Selecciona una comuna
                  </option>

                  <option value="Santiago">
                    Santiago
                  </option>

                  <option value="Maipú">
                    Maipú
                  </option>

                  <option value="Concepción">
                    Concepción
                  </option>

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
                />

              </div>


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