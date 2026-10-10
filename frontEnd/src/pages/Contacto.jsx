function Contacto() {
  return (
    <main className="container mt-5">
      <h1>Contacto</h1>

      <p>Envíanos tus consultas.</p>

      <form className="mt-4">

        <div className="mb-3">
          <label className="form-label">Nombre</label>

          <input
            type="text"
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Correo</label>

          <input
            type="email"
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Mensaje</label>

          <textarea
            className="form-control"
            rows="5"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
        >
          Enviar
        </button>

      </form>
    </main>
  )
}

export default Contacto