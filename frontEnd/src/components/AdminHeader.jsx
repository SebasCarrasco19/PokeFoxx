export default function AdminHeader() {

  const sesion =
    JSON.parse(localStorage.getItem('sesion'))


  return (
    <header className="admin-topbar">

      <strong>
        Administración
      </strong>


      <span>
        {sesion
          ? `${sesion.firstName} ${sesion.lastName} · ${sesion.role}`
          : 'Usuario no identificado'}
      </span>

    </header>
  )
}