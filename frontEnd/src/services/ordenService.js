const API_URL = 'http://localhost:8080/api/v1/ordenes'

function headersAutenticados() {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('Debes iniciar sesión para continuar.')
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
}

async function procesarRespuesta(respuesta) {
  const contenido = await respuesta.text()
  let datos
  try { datos = contenido ? JSON.parse(contenido) : null }
  catch { datos = null }
  if (!respuesta.ok) {
    if (respuesta.status === 401) throw new Error('Tu sesión venció. Inicia sesión nuevamente.')
    if (respuesta.status === 403) throw new Error('No tienes permiso para realizar esta operación.')
    throw new Error(datos?.error || `Error HTTP ${respuesta.status}`)
  }
  return datos
}

export async function registrarCompra(carrito) {
  const productos = carrito.map(item => ({
    productId: Number(item.id),
    qty: Number(item.cantidad ?? item.quantity ?? 1)
  }))
  if (productos.length === 0 || productos.some(item =>
    !Number.isSafeInteger(item.productId) || item.productId <= 0 ||
    !Number.isSafeInteger(item.qty) || item.qty <= 0
  )) throw new Error('El carrito contiene productos o cantidades inválidas.')
  return procesarRespuesta(await fetch(API_URL, {
    method: 'POST', headers: headersAutenticados(), body: JSON.stringify({ productos })
  }))
}

export async function listarOrdenes() {
  return procesarRespuesta(await fetch(API_URL, { headers: headersAutenticados() }))
}

export async function obtenerOrden(id) {
  return procesarRespuesta(await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
    headers: headersAutenticados()
  }))
}

export const formatoPesos = valor => '$' + Number(valor ?? 0).toLocaleString('es-CL')
export const formatoFecha = valor => {
  if (!valor) return 'Sin fecha'
  const fecha = new Date(valor)
  return Number.isNaN(fecha.getTime()) ? String(valor) : fecha.toLocaleString('es-CL')
}
