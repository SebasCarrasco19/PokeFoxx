import { Navigate, Outlet } from 'react-router-dom'
import AdminNav from '../components/AdminNav'
import AdminHeader from '../components/AdminHeader'

export default function AdminLayout() {

  const sesion =
    JSON.parse(localStorage.getItem('sesion'))


  if (!sesion) {
    return <Navigate to="/login" replace />
  }


  const puedeEntrar =
    sesion.role === 'Administrador' ||
    sesion.role === 'Vendedor'


  if (!puedeEntrar) {
    return <Navigate to="/" replace />
  }


  return (
    <div className="admin-shell">

      <AdminNav />

      <div className="admin-main">

        <AdminHeader />

        <main className="admin-content">

          <Outlet />

        </main>

      </div>

    </div>
  )
}