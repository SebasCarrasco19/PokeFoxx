import { Outlet } from 'react-router-dom'
import AdminNav from '../components/AdminNav'
import AdminHeader from '../components/AdminHeader'

export default function AdminLayout() {
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
