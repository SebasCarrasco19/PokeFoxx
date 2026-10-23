import { Link } from 'react-router-dom'

function Footer() {

  const sesion =
    JSON.parse(localStorage.getItem('sesion'))


  return (
    <footer className="site-footer">

      <div className="container">

        <div className="footer-grid">

          <div>

            <h3>
              PokeFoxx
            </h3>

            <p>
              Tu tienda de cartas, accesorios y productos TCG.
            </p>

          </div>


          <div>

            <h3>
              Navegación
            </h3>

            <p>
              <Link to="/">
                Inicio
              </Link>
            </p>

            <p>
              <Link to="/productos">
                Productos
              </Link>
            </p>

            <p>
              <Link to="/categorias">
                Categorías
              </Link>
            </p>

            <p>
              <Link to="/ofertas">
                Ofertas
              </Link>
            </p>

            <p>
              <Link to="/nosotros">
                Nosotros
              </Link>
            </p>

            <p>
              <Link to="/contacto">
                Contacto
              </Link>
            </p>

          </div>


          <div>

            <h3>
              Mi cuenta
            </h3>


            {!sesion ? (
              <>

                <p>
                  <Link to="/login">
                    Iniciar sesión
                  </Link>
                </p>

                <p>
                  <Link to="/registro">
                    Registrarse
                  </Link>
                </p>

              </>
            ) : sesion.role === 'Cliente' ? (

              <p>
                <Link to="/perfil">
                  Mi perfil
                </Link>
              </p>

            ) : (

              <p>
                <Link to="/admin">
                  Administración
                </Link>
              </p>

            )}


            <p>
              <Link to="/carrito">
                Carrito
              </Link>
            </p>

          </div>

        </div>


        <div className="footer-bottom">
          © 2026 PokeFoxx - TCG Market
        </div>

      </div>

    </footer>
  )
}

export default Footer