import { Link, NavLink } from 'react-router-dom'

export default function AdminNav() {
  return (
    <aside className="admin-sidebar">
      <Link className="logo admin-logo" to="/admin">
        <img src="/assets/img/logo.svg" alt="PokeFoxx" />
      </Link>

      <nav className="admin-nav" aria-label="Administración">
        <NavLink to="/admin" end>
          Resumen
        </NavLink>
        <NavLink to="/admin/productos" end>
          Productos
        </NavLink>
        <NavLink to="/admin/productos/nuevo">Nuevo producto</NavLink>
        <NavLink to="/admin/productos-criticos">Productos críticos</NavLink>
        <NavLink to="/admin/ordenes">Órdenes</NavLink>
        <NavLink to="/admin/usuarios" end>
          Usuarios
        </NavLink>
        <NavLink to="/admin/usuarios/nuevo">Nuevo usuario</NavLink>

        <NavLink to="/admin/categorias">Categorías</NavLink>
        <NavLink to="/admin/reportes">Reportes</NavLink>
        <NavLink to="/admin/perfil">Perfil</NavLink>
        <div className="admin-nav-sep" />

        <Link to="/">Volver a la tienda</Link>
      </nav>

      <div className="admin-sidebar-bottom">
        <Link className="btn btn-secondary" to="/login">
          Volver a inicio de sesión
        </Link>
      </div>
    </aside>
  )
}
