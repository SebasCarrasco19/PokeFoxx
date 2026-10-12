import { Routes, Route } from 'react-router-dom'

import Perfil from './pages/Perfil'
import PagoCorrecto from './pages/PagoCorrecto'
import PagoError from './pages/PagoError'
import Checkout from './pages/Checkout'
import Carrito from './pages/Carrito'
import BlogDetalle1 from './pages/BlogDetalle1'
import BlogDetalle2 from './pages/BlogDetalle2'
import Blog from './pages/Blog'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Productos from './pages/Productos'
import DetalleProducto from './pages/DetalleProducto'
import Registro from './pages/Registro'
import Login from './pages/Login'
import Nosotros from './pages/Nosotros'
import Contacto from './pages/Contacto'
import Categorias from './pages/Categorias'
import CategoriaProductos from './pages/CategoriaProductos'
import Ofertas from './pages/Ofertas'
import ProductosCriticos from './pages/ProductosCriticos'

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/pago-correcto" element={<PagoCorrecto />} />
        <Route path="/pago-error" element={<PagoError />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/blog/1" element={<BlogDetalle1 />} />
        <Route path="/blog/2" element={<BlogDetalle2 />} />
        <Route path="/blog" element={<Blog />}/>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/producto/:id" element={<DetalleProducto />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/categorias/:categoria" element={<CategoriaProductos />} />
        <Route path="/ofertas" element={<Ofertas />} />
        <Route path="/admin/productos-criticos" element={<ProductosCriticos />} />
      </Routes>

      <Footer />
    </>
  )
}

export default App