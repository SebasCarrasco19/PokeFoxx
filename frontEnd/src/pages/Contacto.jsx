import { useState } from 'react'

function Contacto() {

  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [mensaje, setMensaje] = useState('')

  function manejarSubmit(event) {
    event.preventDefault()
  }

  return (
    <main>

      <section className="page-header">

        <div className="container">

          <span className="eyebrow">
            Contacto
          </span>

          <h1>
            Contáctanos
          </h1>

          <p>
            ¿Tienes alguna consulta? Envíanos un mensaje
            y estaremos encantados de ayudarte.
          </p>

        </div>

      </section>


      <section className="section">

        <div className="container">

          <form
            className="content-card form-card"
            onSubmit={manejarSubmit}
          >

            <div className="form-grid">

              <div className="form-group">

                <label htmlFor="nombre">
                  Nombre
                </label>

                <input
                  id="nombre"
                  type="text"
                  value={nombre}
                  onChange={event =>
                    setNombre(event.target.value)
                  }
                  maxLength="100"
                />

              </div>


              <div className="form-group">

                <label htmlFor="correo">
                  Correo
                </label>

                <input
                  id="correo"
                  type="email"
                  value={correo}
                  onChange={event =>
                    setCorreo(event.target.value)
                  }
                  maxLength="100"
                />

              </div>


              <div className="form-group full">

                <label htmlFor="mensaje">
                  Mensaje
                </label>

                <textarea
                  id="mensaje"
                  value={mensaje}
                  onChange={event =>
                    setMensaje(event.target.value)
                  }
                  maxLength="500"
                />

              </div>


              <div className="form-group full">

                <button
                  className="btn btn-primary"
                  type="submit"
                >
                  Enviar mensaje
                </button>

              </div>

            </div>

          </form>

        </div>

      </section>

    </main>
  )
}

export default Contacto