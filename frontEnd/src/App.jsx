import { Navigate, Outlet, Route, Routes } from 'react-router-dom'

import AdminLayout from './layouts/AdminLayout'
import TiendaLayout from './layouts/TiendaLayout'

import EditarPerfil from './pages/EditarPerfil'
import PedidoDetalle from './pages/PedidoDetalle'
import NoEncontrado from './pages/NoEncontrado'

import AdminCategorias from './pages/admin/AdminCategorias'
import AdminCategoriaForm from './pages/admin/AdminCategoriaForm'
import AdminReportes from './pages/admin/AdminReportes'
import AdminPerfil from './pages/admin/AdminPerfil'
import AdminProductoDetalle from './pages/admin/AdminProductoDetalle'
import AdminUsuarioDetalle from './pages/admin/AdminUsuarioDetalle'
import AdminUsuarioHistorial from './pages/admin/AdminUsuarioHistorial'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminOrdenDetalle from './pages/admin/AdminOrdenDetalle'
import AdminOrdenes from './pages/admin/AdminOrdenes'
import AdminProductoForm from './pages/admin/AdminProductoForm'
import AdminProductos from './pages/admin/AdminProductos'
import AdminUsuarioForm from './pages/admin/AdminUsuarioForm'
import AdminUsuarios from './pages/admin/AdminUsuarios'
import ProductosCriticos from './pages/admin/ProductosCriticos'

import Blog from './pages/Blog'
import BlogDetalle1 from './pages/BlogDetalle1'
import BlogDetalle2 from './pages/BlogDetalle2'
import Carrito from './pages/Carrito'
import CategoriaProductos from './pages/CategoriaProductos'
import Categorias from './pages/Categorias'
import Checkout from './pages/Checkout'
import Contacto from './pages/Contacto'
import DetalleProducto from './pages/DetalleProducto'
import Home from './pages/Home'
import Login from './pages/Login'
import Nosotros from './pages/Nosotros'
import Ofertas from './pages/Ofertas'
import PagoCorrecto from './pages/PagoCorrecto'
import PagoError from './pages/PagoError'
import Perfil from './pages/Perfil'
import Productos from './pages/Productos'
import Registro from './pages/Registro'


function SoloAdministrador() {

  const sesion =
    JSON.parse(localStorage.getItem('sesion'))


  if (sesion?.role !== 'Administrador') {
    return <Navigate to="/admin" replace />
  }


  return <Outlet />
}


function App() {

  return (
    <Routes>

      <Route element={<TiendaLayout />}>

        <Route path="/" element={<Home />} />

        <Route
          path="/productos"
          element={<Productos />}
        />

        <Route
          path="/producto/:id"
          element={<DetalleProducto />}
        />

        <Route
          path="/categorias"
          element={<Categorias />}
        />

        <Route
          path="/categorias/:categoria"
          element={<CategoriaProductos />}
        />

        <Route
          path="/ofertas"
          element={<Ofertas />}
        />

        <Route
          path="/carrito"
          element={<Carrito />}
        />

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
          path="/pago-correcto"
          element={<PagoCorrecto />}
        />

        <Route
          path="/pago-error"
          element={<PagoError />}
        />

        <Route
          path="/registro"
          element={<Registro />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/perfil"
          element={<Perfil />}
        />

        <Route
          path="/editar-perfil"
          element={<EditarPerfil />}
        />

        <Route
          path="/pedido/:id"
          element={<PedidoDetalle />}
        />

        <Route
          path="/nosotros"
          element={<Nosotros />}
        />

        <Route
          path="/contacto"
          element={<Contacto />}
        />

        <Route
          path="/blog"
          element={<Blog />}
        />

        <Route
          path="/blog/1"
          element={<BlogDetalle1 />}
        />

        <Route
          path="/blog/2"
          element={<BlogDetalle2 />}
        />

        <Route
          path="*"
          element={<NoEncontrado />}
        />

      </Route>


      <Route
        path="/admin"
        element={<AdminLayout />}
      >

        <Route
          index
          element={<AdminDashboard />}
        />


        <Route
          path="productos"
          element={<AdminProductos />}
        />

        <Route
          path="productos/nuevo"
          element={<AdminProductoForm />}
        />

        <Route
          path="productos/:id"
          element={<AdminProductoDetalle />}
        />

        <Route
          path="productos/:id/editar"
          element={<AdminProductoForm />}
        />

        <Route
          path="productos-criticos"
          element={<ProductosCriticos />}
        />


        <Route
          path="ordenes"
          element={<AdminOrdenes />}
        />

        <Route
          path="ordenes/:id"
          element={<AdminOrdenDetalle />}
        />


        <Route
          path="perfil"
          element={<AdminPerfil />}
        />


        <Route element={<SoloAdministrador />}>

          <Route
            path="usuarios"
            element={<AdminUsuarios />}
          />

          <Route
            path="usuarios/nuevo"
            element={<AdminUsuarioForm />}
          />

          <Route
            path="usuarios/:run"
            element={<AdminUsuarioDetalle />}
          />

          <Route
            path="usuarios/:run/editar"
            element={<AdminUsuarioForm />}
          />

          <Route
            path="usuarios/:run/historial"
            element={<AdminUsuarioHistorial />}
          />


          <Route
            path="categorias"
            element={<AdminCategorias />}
          />

          <Route
            path="categorias/nueva"
            element={<AdminCategoriaForm />}
          />

          <Route
            path="categorias/:id/editar"
            element={<AdminCategoriaForm />}
          />


          <Route
            path="reportes"
            element={<AdminReportes />}
          />

        </Route>


        <Route
          path="*"
          element={<NoEncontrado />}
        />

      </Route>

    </Routes>
  )
}

export default App