# TCG Market — DSY1104 Evaluación Parcial 1

Proyecto frontend desarrollado **solo con HTML, CSS y JavaScript**, siguiendo los requisitos de los anexos de la Evaluación Parcial 1.

## Cómo abrir

1. Descomprime la carpeta completa.
2. Abre `index.html` para visualizar la página principal.
3. Para probar correctamente la persistencia del carrito y la navegación entre páginas con `localStorage`, se recomienda ejecutar la carpeta con **Live Server** de VS Code o cualquier servidor HTTP local.

> El proyecto no usa React, Vite, npm ni frameworks. `index.html` funciona como HTML estático y no depende de compilación.

## Estructura principal

```text
TCGMarket_DSY1104_Evaluacion1/
├── index.html
├── productos.html
├── producto.html
├── carrito.html
├── registro.html
├── login.html
├── nosotros.html
├── blog.html
├── blog-detalle-1.html
├── blog-detalle-2.html
├── contacto.html
├── admin/
│   ├── index.html
│   ├── productos.html
│   ├── producto-form.html
│   ├── usuarios.html
│   ├── usuario-form.html
│   ├── ordenes.html
│   └── orden-detalle.html
├── assets/
│   ├── css/
│   │   ├── styles.css
│   │   └── admin.css
│   ├── js/
│   │   ├── data.js
│   │   ├── common.js
│   │   ├── products.js
│   │   ├── cart.js
│   │   ├── forms.js
│   │   └── admin.js
│   └── img/
└── Planilla_Requerimientos_TCG.xlsx
```

## Vistas implementadas

### Tienda pública

- HOME con logo, menú, carrito, bloque principal, productos destacados y footer.
- Productos listados mediante JavaScript.
- Detalle de producto con opción de añadir al carrito.
- Carrito persistido mediante `localStorage`.
- Registro de usuario.
- Inicio de sesión.
- Nosotros.
- Blog con dos publicaciones y dos vistas de detalle.
- Contacto.

### Administración

- Home con menú vertical visible.
- Listado de productos.
- Nuevo / editar / mostrar producto.
- Listado de usuarios.
- Nuevo / editar / mostrar usuario.
- Listado y detalle de órdenes para los roles que lo permiten.
- Control de acceso por rol en frontend.

## Reglas JavaScript implementadas

### Inicio de sesión

- Correo requerido.
- Máximo 100 caracteres.
- Solo dominios `@duoc.cl`, `@profesor.duoc.cl` y `@gmail.com`.
- Contraseña requerida entre 4 y 10 caracteres.

### Contacto

- Nombre requerido, máximo 100 caracteres.
- Correo de máximo 100 caracteres y dominio permitido cuando se informa.
- Comentario requerido, máximo 500 caracteres.

### Usuario

- RUN requerido, sin puntos ni guion, entre 7 y 9 caracteres y validación de dígito verificador.
- Nombre requerido, máximo 50 caracteres.
- Apellidos requeridos, máximo 100 caracteres.
- Correo requerido, máximo 100 caracteres y dominio permitido.
- Fecha de nacimiento opcional.
- Tipo de usuario en administración: Administrador, Cliente o Vendedor.
- Región y comuna dependientes mediante arreglo JavaScript.
- Dirección requerida, máximo 300 caracteres.
- Se añadió contraseña para hacer posible el inicio de sesión, usando la misma regla de 4 a 10 caracteres.

### Producto

- Código requerido, texto, mínimo 3 caracteres.
- Nombre requerido, máximo 100 caracteres.
- Descripción opcional, máximo 500 caracteres.
- Precio requerido, mínimo 0 y acepta decimales.
- Stock requerido, mínimo 0 y solo enteros.
- Stock crítico opcional, mínimo 0 y solo enteros.
- Categoría requerida mediante `select`.
- Imagen opcional.
- Alerta visual cuando el stock es igual o inferior al stock crítico.

### Carrito

- Añadir productos desde el listado y desde el detalle.
- Si un producto ya existe, aumenta su cantidad.
- La cantidad mínima es 1 y no puede superar el stock disponible.
- Permite aumentar, disminuir y eliminar productos.
- Calcula el total.
- Guarda el carrito en `localStorage`.

## Roles de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | `admin@duoc.cl` | `Admin123` |
| Vendedor | `vendedor@gmail.com` | `Vend1234` |
| Cliente | `cliente@gmail.com` | `Clie123` |

El Administrador tiene acceso total. El Vendedor visualiza productos, detalles y órdenes. El Cliente permanece en la tienda pública.

## Nota sobre regiones y comunas

El anexo indica que las regiones y comunas deben provenir de un **arreglo JavaScript complementario al entregable**, pero ese arreglo no fue incluido entre los archivos entregados en esta conversación. Para que el comportamiento pueda probarse, `assets/js/data.js` contiene un arreglo demostrativo de regiones y comunas. Cuando el docente entregue el arreglo oficial, solo es necesario reemplazar `TCG_REGIONS`.

## GitHub

El código queda preparado para subirse a un repositorio público. La creación del repositorio, los commits con comentarios y la evidencia de colaboración deben realizarse desde las cuentas GitHub del equipo, ya que requieren acceso a sus cuentas.
