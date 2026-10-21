import { Link, useParams } from 'react-router-dom'
import { usuariosIniciales as usuarios } from '../../data/adminData'
import { regiones } from '../../data/adminData'

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
  address: '',
}

function AdminUsuarioForm() {
  const { run } = useParams()

  const usuarioActual = usuarios.find((usuario) => usuario.run === run)
  const datos = usuarioActual ?? formularioVacio
  const editando = Boolean(run)
  const comunas =
    regiones.find((item) => item.region === datos.region)?.comunas ?? []

  if (editando && !usuarioActual) {
    return (
      <div className="content-card">
        <h1>Usuario no encontrado</h1>
        <Link className="btn btn-primary" to="/admin/usuarios">
          Volver a usuarios
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="admin-title">
        <h1>{editando ? 'Editar usuario' : 'Nuevo usuario'}</h1>
        <p>Vista de ejemplo del formulario. Los cambios no se guardan.</p>
      </div>

      <form
        className="content-card admin-form"
        key={run ?? 'nuevo'}
        onSubmit={(event) => event.preventDefault()}
      >
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
            />
          </div>

          <div className="form-group">
            <label htmlFor="firstName">Nombre</label>
            <input
              id="firstName"
              name="firstName"
              defaultValue={datos.firstName}
              maxLength="50"
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Apellidos</label>
            <input
              id="lastName"
              name="lastName"
              defaultValue={datos.lastName}
              maxLength="100"
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
            />
          </div>

          <div className="form-group">
            <label htmlFor="birthDate">Fecha de nacimiento</label>
            <input
              id="birthDate"
              name="birthDate"
              type="date"
              defaultValue={datos.birthDate}
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
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Tipo de usuario</label>
            <select id="role" name="role" defaultValue={datos.role}>
              <option value="">Selecciona un perfil</option>
              <option value="Administrador">Administrador</option>
              <option value="Cliente">Cliente</option>
              <option value="Vendedor">Vendedor</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="region">Región</label>
            <select id="region" name="region" defaultValue={datos.region}>
              <option value="">Selecciona una región</option>
              {regiones.map((item) => (
                <option key={item.region} value={item.region}>
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
              defaultValue={datos.commune}
              disabled={!datos.region}
            >
              <option value="">Selecciona una comuna</option>
              {comunas.map((comuna) => (
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
            />
          </div>
        </div>

        <div className="admin-button-row">
          <button
            className="btn btn-primary"
            type="button"
            disabled
            title="Disponible en una próxima etapa"
          >
            Guardar usuario
          </button>
          <Link className="btn btn-secondary" to="/admin/usuarios">
            Volver
          </Link>
        </div>
      </form>
    </>
  )
}

export default AdminUsuarioForm
