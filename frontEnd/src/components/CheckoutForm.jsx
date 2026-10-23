function CheckoutForm({
  datos,
  cambiarDato,
  enviarCompra
}) {
  return (
    <form
      className="content-card form-card"
      onSubmit={enviarCompra}
    >
      <div className="form-grid">

        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>

          <input
            id="nombre"
            name="nombre"
            type="text"
            value={datos.nombre}
            onChange={cambiarDato}
            maxLength="150"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="run">RUN</label>

          <input
            id="run"
            name="run"
            type="text"
            value={datos.run ?? ''}
            onChange={cambiarDato}
            minLength="7"
            maxLength="9"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="correo">Correo</label>

          <input
            id="correo"
            name="correo"
            type="email"
            value={datos.correo}
            onChange={cambiarDato}
            maxLength="100"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="comuna">Comuna</label>

          <input
            id="comuna"
            name="comuna"
            type="text"
            value={datos.comuna}
            onChange={cambiarDato}
            maxLength="100"
            required
          />
        </div>

        <div className="form-group full">
          <label htmlFor="direccion">Dirección</label>

          <input
            id="direccion"
            name="direccion"
            type="text"
            value={datos.direccion}
            onChange={cambiarDato}
            maxLength="300"
            required
          />
        </div>

        <div className="form-group full">
          <label htmlFor="metodoPago">
            Método de pago
          </label>

          <select
            id="metodoPago"
            name="metodoPago"
            value={datos.metodoPago}
            onChange={cambiarDato}
            required
          >
            <option value="">
              Selecciona una opción
            </option>
            <option value="Tarjeta de débito">
              Tarjeta de débito
            </option>
            <option value="Tarjeta de crédito">
              Tarjeta de crédito
            </option>
            <option value="Transferencia">
              Transferencia
            </option>
          </select>
        </div>

        <div className="form-group full">
          <button
            className="btn btn-primary"
            type="submit"
          >
            Confirmar compra
          </button>
        </div>

      </div>
    </form>
  )
}

export default CheckoutForm