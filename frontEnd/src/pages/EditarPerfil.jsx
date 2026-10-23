import { useState } from 'react'

import {
  Link,
  Navigate,
  useNavigate
} from 'react-router-dom'

import {
  usuariosIniciales,
  ordenesIniciales,
  regiones
} from '../data/adminData'

import '../css/account.css'


export default function EditarPerfil() {

  const navigate = useNavigate()


  const sesion =
    JSON.parse(localStorage.getItem('sesion'))


  if (!sesion) {

    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }


  const usuarios =
    JSON.parse(localStorage.getItem('usuarios')) ||
    usuariosIniciales


  const usuarioActual =
    usuarios.find(
      usuario =>
        usuario.run === sesion.run
    )


  if (!usuarioActual) {

    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }


  const [regionSeleccionada, setRegionSeleccionada] =
    useState(usuarioActual.region)

  const [comunaSeleccionada, setComunaSeleccionada] =
    useState(usuarioActual.commune)

  const [mensaje, setMensaje] =
    useState('')


  const comunas =
    regiones.find(
      item =>
        item.region === regionSeleccionada
    )?.comunas ?? []


  function cambiarRegion(event) {

    setRegionSeleccionada(
      event.target.value
    )

    setComunaSeleccionada('')
  }


  function guardarCambios(event) {

    event.preventDefault()

    setMensaje('')


    const formulario =
      new FormData(event.target)


    const email =
      formulario
        .get('email')
        .trim()


    const correoExiste =
      usuarios.some(
        usuario =>
          usuario.email.toLowerCase() ===
            email.toLowerCase() &&
          usuario.run !== usuarioActual.run
      )


    if (correoExiste) {

      setMensaje(
        'Ya existe otro usuario con ese correo.'
      )

      return
    }


    const nuevaPassword =
      formulario.get('password')


    const usuarioActualizado = {

      ...usuarioActual,


      firstName:
        formulario
          .get('firstName')
          .trim(),


      lastName:
        formulario
          .get('lastName')
          .trim(),


      email: email,


      birthDate:
        formulario.get('birthDate'),


      password:
        nuevaPassword ||
        usuarioActual.password,


      region:
        regionSeleccionada,


      commune:
        comunaSeleccionada,


      address:
        formulario
          .get('address')
          .trim(),


      role: 'Cliente'
    }


    const usuariosActualizados =
      usuarios.map(usuario => {

        if (
          usuario.run ===
          usuarioActual.run
        ) {

          return usuarioActualizado
        }

        return usuario
      })


    localStorage.setItem(
      'usuarios',
      JSON.stringify(
        usuariosActualizados
      )
    )


    const ordenes =
      JSON.parse(
        localStorage.getItem('ordenes')
      ) ||
      ordenesIniciales


    const ordenesActualizadas =
      ordenes.map(orden => {

        const perteneceAlUsuario =
          orden.customerRun ===
            usuarioActual.run ||
          (
            !orden.customerRun &&
            orden.customerEmail
              ?.toLowerCase() ===
              usuarioActual.email
                .toLowerCase()
          )


        if (perteneceAlUsuario) {

          return {

            ...orden,

            customer:
              `${usuarioActualizado.firstName} ${usuarioActualizado.lastName}`,

            customerEmail:
              usuarioActualizado.email,

            customerRun:
              usuarioActualizado.run
          }
        }


        return orden
      })


    localStorage.setItem(
      'ordenes',
      JSON.stringify(
        ordenesActualizadas
      )
    )


    const sesionActualizada = {

      ...sesion,

      firstName:
        usuarioActualizado.firstName,

      lastName:
        usuarioActualizado.lastName,

      email:
        usuarioActualizado.email
    }


    localStorage.setItem(
      'sesion',
      JSON.stringify(
        sesionActualizada
      )
    )


    navigate('/perfil')
  }


  return (
    <main>

      <section className="page-header">

        <div className="container">

          <span className="eyebrow">
            Cliente
          </span>

          <h1>
            Editar perfil
          </h1>

          <p>
            Actualiza tus datos personales.
            Tu rol continuará siendo Cliente.
          </p>

        </div>

      </section>


      <section className="section">

        <div className="container">

          <section className="content-card edit-profile-card">


            <div className="edit-profile-top-actions">

              <Link
                className="btn btn-secondary btn-sm"
                to="/perfil"
              >
                ← Volver a mi perfil
              </Link>

            </div>


            <div className="account-heading">

              <div>

                <h2>
                  Datos personales
                </h2>

                <p>
                  Modifica la información que necesites.
                </p>

              </div>

            </div>


            <span className="profile-role">
              Perfil: Cliente
            </span>


            {mensaje && (

              <div
                className="form-message error"
                style={{
                  marginBottom: '20px'
                }}
              >
                ⚠️ {mensaje}
              </div>

            )}


            <form
              id="profileForm"
              onSubmit={guardarCambios}
            >

              <div className="form-grid">


                <div className="form-group">

                  <label htmlFor="profileRun">
                    RUN
                  </label>

                  <input
                    id="profileRun"
                    name="run"
                    value={usuarioActual.run}
                    readOnly
                  />

                </div>


                <div className="form-group">

                  <label htmlFor="profileFirstName">
                    Nombre
                  </label>

                  <input
                    id="profileFirstName"
                    name="firstName"
                    defaultValue={
                      usuarioActual.firstName
                    }
                    maxLength="50"
                    required
                  />

                </div>


                <div className="form-group">

                  <label htmlFor="profileLastName">
                    Apellidos
                  </label>

                  <input
                    id="profileLastName"
                    name="lastName"
                    defaultValue={
                      usuarioActual.lastName
                    }
                    maxLength="100"
                    required
                  />

                </div>


                <div className="form-group">

                  <label htmlFor="profileEmail">
                    Correo
                  </label>

                  <input
                    id="profileEmail"
                    name="email"
                    defaultValue={
                      usuarioActual.email
                    }
                    type="email"
                    maxLength="100"
                    required
                  />

                </div>


                <div className="form-group">

                  <label htmlFor="profileBirthDate">
                    Fecha de nacimiento
                  </label>

                  <input
                    id="profileBirthDate"
                    name="birthDate"
                    type="date"
                    defaultValue={
                      usuarioActual.birthDate
                    }
                    required
                  />

                </div>


                <div className="form-group">

                  <label htmlFor="profilePassword">
                    Nueva contraseña
                  </label>

                  <input
                    id="profilePassword"
                    name="password"
                    type="password"
                    minLength="4"
                    maxLength="10"
                    autoComplete="new-password"
                  />

                  <span className="help-text">
                    Déjala vacía si no quieres cambiarla.
                  </span>

                </div>


                <div className="form-group">

                  <label htmlFor="profileRegion">
                    Región
                  </label>

                  <select
                    id="profileRegion"
                    name="region"
                    value={regionSeleccionada}
                    onChange={cambiarRegion}
                    required
                  >

                    <option value="">
                      Selecciona una región
                    </option>


                    {regiones.map(item => (

                      <option
                        key={item.region}
                        value={item.region}
                      >
                        {item.region}
                      </option>

                    ))}

                  </select>

                </div>


                <div className="form-group">

                  <label htmlFor="profileCommune">
                    Comuna
                  </label>

                  <select
                    id="profileCommune"
                    name="commune"
                    value={comunaSeleccionada}
                    onChange={event =>
                      setComunaSeleccionada(
                        event.target.value
                      )
                    }
                    disabled={!regionSeleccionada}
                    required
                  >

                    <option value="">
                      Selecciona una comuna
                    </option>


                    {comunas.map(comuna => (

                      <option
                        key={comuna}
                        value={comuna}
                      >
                        {comuna}
                      </option>

                    ))}

                  </select>

                </div>


                <div className="form-group full">

                  <label htmlFor="profileAddress">
                    Dirección
                  </label>

                  <input
                    id="profileAddress"
                    name="address"
                    defaultValue={
                      usuarioActual.address
                    }
                    maxLength="300"
                    required
                  />

                </div>

              </div>


              <div className="profile-actions">

                <button
                  className="btn btn-primary"
                  type="submit"
                >
                  Guardar cambios
                </button>


                <Link
                  className="btn btn-secondary"
                  to="/perfil"
                >
                  Cancelar
                </Link>

              </div>

            </form>

          </section>

        </div>

      </section>

    </main>
  )
}