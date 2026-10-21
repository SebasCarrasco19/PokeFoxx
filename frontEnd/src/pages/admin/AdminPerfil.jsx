import { usuariosIniciales } from '../../data/adminData'

export default function AdminPerfil() {
  const usuario = usuariosIniciales[0]
  return (
    <>
      <div className="admin-title">
        <h1>Perfil del administrador</h1>
        <p>Usuario de demostración. No representa una sesión autenticada.</p>
      </div>
      <section className="content-card">
        <h2>
          {usuario.firstName} {usuario.lastName}
        </h2>
        <p>
          <strong>Correo:</strong> {usuario.email}
        </p>
        <p>
          <strong>Perfil:</strong> {usuario.role}
        </p>
        <p>
          <strong>Región:</strong> {usuario.region}
        </p>
        <p>
          <strong>Comuna:</strong> {usuario.commune}
        </p>
        <p>
          <strong>Dirección:</strong> {usuario.address}
        </p>
      </section>
    </>
  )
}
