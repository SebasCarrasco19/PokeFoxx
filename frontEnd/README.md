# PokeFoxx — TCG Market

Proyecto académico desarrollado para la asignatura **DSY1104 - Desarrollo Fullstack II**.

PokeFoxx es una tienda online de cartas, accesorios y productos TCG. La versión actual corresponde a la evolución del proyecto original desarrollado en HTML, CSS y JavaScript, migrado posteriormente a **React con Vite** e incorporando nuevas funcionalidades, persistencia mediante `localStorage`, roles de usuario, administración y pruebas unitarias.

---

## Tecnologías utilizadas

- React
- Vite
- React Router
- Bootstrap
- JavaScript
- HTML5
- CSS3
- localStorage
- Vitest
- React Testing Library
- jsdom
- @testing-library/jest-dom
- @testing-library/user-event
- @vitest/coverage-v8

---

## Estructura del repositorio

La implementación actual en React se encuentra principalmente en:

```text
frontEnd/
├── src/
│   ├── components/
│   ├── data/
│   ├── layouts/
│   ├── pages/
│   │   └── admin/
│   ├── test/
│   ├── App.jsx
│   ├── main.jsx
│   └── setupTests.js
├── package.json
└── vite.config.js
```

El repositorio conserva además archivos HTML, CSS y JavaScript correspondientes a etapas anteriores del proyecto.

---

## Instalación y ejecución

Ingresa a la carpeta del frontend:

```bash
cd frontEnd
```

Instala las dependencias:

```bash
npm install
```

Ejecuta el proyecto:

```bash
npm run dev
```

Vite mostrará la dirección local donde se encuentra disponible la aplicación, normalmente:

```text
http://localhost:5173
```

---

# Funcionalidades principales

## Tienda pública

La aplicación cuenta con:

- Página de inicio.
- Listado general de productos.
- Detalle individual de productos.
- Categorías.
- Productos filtrados por categoría.
- Ofertas.
- Carrito de compras.
- Checkout.
- Compra como usuario registrado.
- Compra como invitado.
- Página de pago realizado correctamente.
- Página de error de compra.
- Registro de usuarios.
- Inicio de sesión.
- Perfil del cliente.
- Edición de perfil.
- Historial de pedidos.
- Detalle de pedidos.
- Blog.
- Detalle de publicaciones.
- Nosotros.
- Contacto.
- Página para rutas no encontradas.

---

## Carrito de compras

El carrito permite:

- Agregar productos.
- Aumentar cantidades.
- Disminuir cantidades.
- Eliminar productos.
- Vaciar el carrito.
- Calcular subtotales y total.
- Mantener sus datos mediante `localStorage`.
- Impedir cantidades superiores al stock disponible.
- Impedir agregar productos sin stock.

Cuando una compra se completa correctamente:

- Se genera una orden.
- Se descuenta el stock correspondiente.
- Se vacía el carrito.
- Se almacena el identificador de la última orden creada.

---

## Checkout

El Checkout funciona tanto para usuarios registrados como para invitados.

### Usuario registrado

Cuando existe una sesión activa se precargan:

- Nombre.
- RUN.
- Correo.
- Comuna.
- Dirección.

El cliente puede modificar estos datos exclusivamente para la compra que está realizando.

Los cambios realizados durante el Checkout **no modifican los datos almacenados en su perfil**.

La orden continúa asociada a la cuenta mediante el RUN del cliente y guarda también el RUN utilizado específicamente para la compra.

### Invitado

Cuando no existe sesión:

- Los datos personales aparecen vacíos.
- El usuario debe completar manualmente la información.
- Puede realizar la compra sin crear una cuenta.
- La compra genera una orden normalmente.
- El stock se descuenta.
- La orden no queda asociada al historial de otro cliente.

---

# Administración

El sistema posee un panel administrativo con funcionalidades diferenciadas según el rol.

## Administrador

Tiene acceso a:

- Dashboard.
- Productos.
- Crear productos.
- Editar productos.
- Eliminar productos.
- Productos críticos.
- Órdenes.
- Detalle de órdenes.
- Usuarios.
- Crear usuarios.
- Editar usuarios.
- Categorías.
- Reportes.
- Perfil administrativo.

## Vendedor

Tiene acceso a:

- Dashboard.
- Productos.
- Crear y editar productos.
- Productos críticos.
- Órdenes.
- Detalle de órdenes.
- Perfil.

El Vendedor **no tiene acceso** a:

- Usuarios.
- Categorías.
- Reportes.

Las restricciones no son solamente visuales. Las rutas administrativas también controlan el acceso según el rol.

## Cliente

El Cliente utiliza exclusivamente la tienda pública.

Si intenta acceder directamente al área administrativa, es redirigido a la tienda.

---

# Gestión de productos

La administración de productos incluye operaciones de creación, lectura, edición y eliminación.

Entre sus validaciones se encuentran:

- Código obligatorio.
- Código único.
- Nombre obligatorio.
- Precio obligatorio y no negativo.
- Stock obligatorio.
- Stock no negativo.
- Stock solo con valores enteros.
- Stock crítico opcional.
- Categoría obligatoria.
- Juego obligatorio.

Un producto puede conservar su propio código al ser editado sin ser considerado un duplicado.

---

# Stock crítico

La aplicación detecta productos críticos utilizando las siguientes reglas:

- Si `stock = 0`, el producto siempre se considera crítico.
- Si existe un stock crítico configurado, el producto se considera crítico cuando su stock actual es menor o igual al nivel configurado.
- Si el stock crítico no fue configurado y el producto todavía posee stock, no se considera crítico.

Ejemplos:

```text
stock 0 / crítico vacío → crítico
stock 3 / crítico vacío → no crítico
stock 3 / crítico 5 → crítico
stock 10 / crítico 5 → no crítico
```

---

# Usuarios y registro

El registro público y la administración de usuarios incluyen validaciones para:

- RUN obligatorio.
- Validación real del dígito verificador del RUN chileno.
- RUN no duplicado.
- Correo no duplicado.
- Campos obligatorios.
- Región y comuna relacionadas.
- Cambio de región reinicia la comuna seleccionada.

Los dominios de correo permitidos son:

```text
@gmail.com
@duoc.cl
@profesor.duoc.cl
```

---

# Órdenes

Las compras generan órdenes almacenadas mediante `localStorage`.

Las órdenes contienen información relacionada con:

- Cliente o destinatario.
- Correo.
- Dirección.
- Comuna.
- Método de pago.
- Fecha.
- Productos.
- Cantidades.
- Total.
- Estado.

Las órdenes nuevas se crean actualmente con:

```js
status: 'Pendiente'
```

El sistema permite listar órdenes y consultar sus detalles.

Actualmente **no se implementa modificación manual del estado de las órdenes**, ya que no forma parte de la funcionalidad confirmada para esta etapa.

---

# Seguridad de pedidos

Un cliente solamente puede consultar las órdenes asociadas a su propia cuenta.

Modificar manualmente el identificador de un pedido en la URL no permite visualizar una orden perteneciente a otro cliente.

Las compras realizadas como invitado tampoco aparecen dentro del historial de pedidos de clientes registrados.

---

# Persistencia

La aplicación utiliza `localStorage` para mantener información entre recargas del navegador.

Entre las claves utilizadas se encuentran:

```text
productos
usuarios
categorias
ordenes
carrito
sesion
ultimaOrdenId
```

Se comprobó la persistencia de:

- Sesión.
- Carrito.
- Productos y stock.
- Órdenes.
- Datos modificados del perfil.

---

# Usuarios de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | `admin@duoc.cl` | `Admin123` |
| Vendedor | `vendedor@gmail.com` | `Vend1234` |
| Cliente | `cliente@gmail.com` | `Clie123` |

---

# Pruebas unitarias

La aplicación utiliza **Vitest** junto con **React Testing Library**.

Los tests se encuentran en:

```text
src/test/
```

Actualmente existen:

```text
10 bloques describe
20 casos test
20 tests aprobados
```

Se prueban componentes y páginas mediante diferentes tipos de comprobaciones:

- Renderizado.
- Props.
- Eventos.
- Formularios.
- Estado.
- Comportamiento condicional.
- Roles.
- localStorage.
- Stock.
- Cálculos.
- Inicio de sesión.
- Mocks mediante `vi.fn()`.

Entre los archivos probados se encuentran:

```text
AdminDashboard
AdminHeader
AdminNav
CartItem
CheckoutForm
Contacto
Footer
Login
ProductCard
ProductosCriticos
```

Para ejecutar todos los tests una vez:

```bash
npm run test -- --run
```

Para ejecutarlos en modo observación:

```bash
npm run test
```

---

# Cobertura de testing

La cobertura se genera mediante:

```text
@vitest/coverage-v8
```

Para generar el informe:

```bash
npm run test:coverage
```

Resultado registrado en la revisión actual:

| Métrica | Cobertura |
|---|---:|
| Statements | 88.78% |
| Branches | 71.27% |
| Functions | 89.28% |
| Lines | 88.78% |

Vitest genera además un informe HTML dentro de:

```text
coverage/index.html
```

La carpeta `coverage/` está excluida del repositorio mediante `.gitignore`, ya que puede volver a generarse ejecutando el comando de cobertura.

---

# Scripts disponibles

```bash
npm run dev
npm run build
npm run lint
npm run preview
npm run test
npm run test:coverage
```

---

# Estado actual del proyecto

La revisión funcional de la Fase 2 comprobó, entre otros puntos:

- CRUD de productos.
- CRUD de usuarios.
- CRUD de categorías.
- Registro.
- Login.
- Sesiones y roles.
- Restricción de rutas.
- Perfil y edición de perfil.
- Carrito.
- Control de stock.
- Checkout registrado e invitado.
- Creación de órdenes.
- Descuento de stock.
- Historial de pedidos.
- Protección de pedidos ajenos.
- Productos críticos.
- Ofertas.
- Dashboard.
- Reportes.
- Persistencia mediante `localStorage`.
- Pruebas unitarias.
- Informe de cobertura.

---

# Consideraciones de esta etapa

Este proyecto corresponde actualmente a una implementación frontend académica.

- No existe backend real en esta etapa.
- La persistencia se simula mediante `localStorage`.
- No existe una pasarela de pago real.
- El resultado de compra se simula dentro del flujo frontend.
- Las órdenes se crean inicialmente con estado `Pendiente`.
- Los archivos HTML originales se conservan como referencia de etapas anteriores del desarrollo.

---

## Repositorio

Proyecto PokeFoxx / TCG Market desarrollado para **Desarrollo Fullstack II — DSY1104**.