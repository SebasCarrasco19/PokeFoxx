import { Link } from 'react-router-dom'

export default function NoEncontrado() {
  return (
    <section className="container section">
      <div className="content-card">
        <h1>Página no encontrada</h1>
        <p>La dirección solicitada no existe.</p>
        <Link className="btn btn-primary" to="/">
          Volver al inicio
        </Link>
      </div>
    </section>
  )
}
