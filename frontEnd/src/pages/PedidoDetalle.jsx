import { Link, useParams } from 'react-router-dom'

const pedidos = [
  {
    id: 'ORD-001',
    fecha: '10/10/2026',
    total: 15490,
    estado: 'Pendiente',
    items: [
      { nombre: 'Ascended Heroes Booster Pack', precio: 7990 },
      { nombre: 'Donquixote Doflamingo', precio: 7500 },
    ],
  },
  {
    id: 'ORD-002',
    fecha: '05/10/2026',
    total: 23990,
    estado: 'Entregado',
    items: [
      { nombre: 'Starter Deck', precio: 18990 },
      { nombre: 'Accesorio de ejemplo', precio: 5000 },
    ],
  },
]

export default function PedidoDetalle() {
  const { id } = useParams()
  const pedido = pedidos.find((item) => item.id === id)
  return (
    <main className="container section">
      <section className="content-card">
        <h1>{pedido ? `Pedido ${pedido.id}` : 'Pedido no encontrado'}</h1>
        {pedido && (
          <>
            <p>Vista estática de ejemplo. No corresponde a una compra real.</p>
            <p>
              {pedido.fecha} · {pedido.estado}
            </p>
            {pedido.items.map((item) => (
              <p key={item.nombre}>
                {item.nombre} · 1 unidad · $
                {item.precio.toLocaleString('es-CL')}
              </p>
            ))}
            <p>
              <strong>Total: ${pedido.total.toLocaleString('es-CL')}</strong>
            </p>
          </>
        )}
        <Link className="btn btn-secondary" to="/perfil">
          Volver a mi perfil
        </Link>
      </section>
    </main>
  )
}
