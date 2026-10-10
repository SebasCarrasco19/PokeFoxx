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

          <label htmlFor="nombre">
            Nombre
          </label>

          <input
            id="nombre"
            name="nombre"
            type="text"
            value={datos.nombre}
            onChange={cambiarDato}
            required
          />

        </div>


        <div className="form-group">

          <label htmlFor="correo">
            Correo
          </label>

          <input
            id="correo"
            name="correo"
            type="email"
            value={datos.correo}
            onChange={cambiarDato}
            required
          />

        </div>


        <div className="form-group full">

          <label htmlFor="direccion">
            Dirección
          </label>

          <input
            id="direccion"
            name="direccion"
            type="text"
            value={datos.direccion}
            onChange={cambiarDato}
            required
          />

        </div>


        <div className="form-group">

          <label htmlFor="comuna">
            Comuna
          </label>

          <input
            id="comuna"
            name="comuna"
            type="text"
            value={datos.comuna}
            onChange={cambiarDato}
            required
          />

        </div>


        <div className="form-group">

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

            <option value="debito">
              Tarjeta de débito
            </option>

            <option value="credito">
              Tarjeta de crédito
            </option>

            <option value="transferencia">
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