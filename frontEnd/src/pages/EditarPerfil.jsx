import { Link } from 'react-router-dom'
import '../css/account.css'

export default function EditarPerfil() {
  return (
    <main>
      <section className="page-header">
        <div className="container">
          <span className="eyebrow">Cliente</span>
          <h1>Editar perfil</h1>
          <p>
            Actualiza tus datos personales. Tu rol continuará siendo Cliente.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <section className="content-card edit-profile-card">
            <div className="edit-profile-top-actions">
              <Link className="btn btn-secondary btn-sm" to="/perfil">
                ← Volver a mi perfil
              </Link>
            </div>

            <div className="account-heading">
              <div>
                <h2>Datos personales</h2>
                <p>Vista de demostración. Los cambios no se guardan.</p>
              </div>
            </div>

            <span className="profile-role">Perfil: Cliente</span>

            <form
              id="profileForm"
              onSubmit={(event) => event.preventDefault()}
              noValidate
            >
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="profileRun">RUN</label>
                  <input
                    id="profileRun"
                    name="run"
                    defaultValue="19011022K"
                    minLength="7"
                    maxLength="9"
                  />
                  <span className="error-text" data-field-error></span>
                </div>

                <div className="form-group">
                  <label htmlFor="profileFirstName">Nombre</label>
                  <input
                    id="profileFirstName"
                    name="firstName"
                    defaultValue="Cliente"
                    maxLength="50"
                  />
                  <span className="error-text" data-field-error></span>
                </div>

                <div className="form-group">
                  <label htmlFor="profileLastName">Apellidos</label>
                  <input
                    id="profileLastName"
                    name="lastName"
                    defaultValue="Demo"
                    maxLength="100"
                  />
                  <span className="error-text" data-field-error></span>
                </div>

                <div className="form-group">
                  <label htmlFor="profileEmail">Correo</label>
                  <input
                    id="profileEmail"
                    name="email"
                    defaultValue="cliente@gmail.com"
                    type="email"
                    maxLength="100"
                  />
                  <span className="error-text" data-field-error></span>
                </div>

                <div className="form-group">
                  <label htmlFor="profileBirthDate">Fecha de nacimiento</label>
                  <input id="profileBirthDate" name="birthDate" type="date" />
                  <span className="error-text" data-field-error></span>
                </div>

                <div className="form-group">
                  <label htmlFor="profilePassword">Nueva contraseña</label>
                  <input
                    id="profilePassword"
                    name="password"
                    type="password"
                    minLength="4"
                    maxLength="10"
                    autoComplete="new-password"
                  />
                  <span className="help-text">
                    Déjala vacía si no quieres cambiarla.
                  </span>
                  <span className="error-text" data-field-error></span>
                </div>

                <div className="form-group">
                  <label htmlFor="profileRegion">Región</label>
                  <select
                    id="profileRegion"
                    name="region"
                    defaultValue="Región Metropolitana"
                  >
                    <option>Región Metropolitana</option>
                  </select>
                  <span className="error-text" data-field-error></span>
                </div>

                <div className="form-group">
                  <label htmlFor="profileCommune">Comuna</label>
                  <select
                    id="profileCommune"
                    name="commune"
                    defaultValue="Santiago"
                  >
                    <option>Santiago</option>
                  </select>
                  <span className="error-text" data-field-error></span>
                </div>

                <div className="form-group full">
                  <label htmlFor="profileAddress">Dirección</label>
                  <input
                    id="profileAddress"
                    name="address"
                    defaultValue="Av. Siempre Viva 123"
                    maxLength="300"
                  />
                  <span className="error-text" data-field-error></span>
                </div>
              </div>

              <div className="profile-actions">
                <button className="btn btn-primary" type="button" disabled>
                  Guardar cambios
                </button>
                <Link className="btn btn-secondary" to="/perfil">
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
