import { Routes, Route } from 'react-router-dom'

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

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/producto/:id" element={<DetalleProducto />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/categorias/:categoria" element={<CategoriaProductos />} />
      </Routes>

      <Footer />
    </>
  )
}

export default App