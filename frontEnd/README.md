# PokeFoxx — etapa de vistas React

Reorganización de PokeFoxx-Chemy-admin.zip. Esta entrega corresponde a estructura y vistas, no a la implementación funcional completa de Evaluación 2.

## Ejecutar

Requiere Node.js compatible con Vite 8 (verificado con Node 26.11.1).

```sh
npm ci
npm run dev
```

Abrir la dirección que muestre Vite. Tienda: `/`. Administración: `/admin`. Perfil de ejemplo: `/perfil`. No hace falta iniciar sesión: todavía no hay autenticación ni control de roles.

```sh
npm run build
npm run preview
```

No abrir index.html con doble clic: la aplicación necesita el servidor de Vite. Un alojamiento futuro debe redirigir las rutas a index.html para permitir recargas directas con BrowserRouter.

## Organización

```text
src/
  App.jsx                 Rutas de tienda y administración
  main.jsx                React, BrowserRouter, Bootstrap y estilos
  layouts/
    TiendaLayout.jsx      Header, Outlet y Footer
    AdminLayout.jsx       AdminNav, AdminHeader y Outlet
  components/             Piezas visuales reutilizables
  pages/                  Vistas de tienda
    admin/                Todas las vistas administrativas
  data/adminData.js       Datos estáticos existentes
  css/                    Estilos de tienda, admin y cuenta
public/assets/img/        Imágenes existentes
 docs/referencias/        Documentos del ZIP original
```

La aplicación está en la raíz, sin una segunda tienda HTML ni scripts antiguos en paralelo. El único index.html es el punto de entrada de React. Se conservaron imágenes, Bootstrap y estilos; el menú admin tiene un ajuste de desplazamiento para alojar las nuevas opciones sin superponerse.

## Cambios

- Separación de tienda y admin mediante layouts con Outlet.
- Páginas admin en src/pages/admin/, imports corregidos y navegación/cabecera extraídas del diseño original.
- Eliminado AdminDataContext.jsx, su proveedor y context/ tras retirar todas sus referencias. Las vistas importan arreglos estáticos directamente.
- Formularios, eliminación, respaldo y exportación como presentación, sin guardar ni modificar registros.
- Productos críticos mediante selección fija de los dos ejemplos existentes, sin cálculo automático de inventario.
- Vistas mínimas del diagrama: categorías y formulario, detalle de producto, detalle de usuario, historial de compras, reportes y perfil del administrador.
- Completadas las vistas de editar perfil y detalle de pedido de tienda; detalle de producto con datos e imágenes existentes.
- Página para rutas inexistentes y mensajes para identificadores no encontrados.

## Alcance actual

La navegación, el menú móvil y los filtros visuales existentes pueden responder. Los formularios permiten escribir como maqueta, pero no guardan. El carrito muestra una selección fija y sus botones de modificación están deshabilitados. Checkout permite visitar los ejemplos de éxito/error sin procesar una compra.

No hay localStorage, CRUD real, cambios de stock, órdenes generadas o sincronizadas, autenticación, roles efectivos, backend ni configuración de tests. Reportes e historiales son ejemplos estáticos. Los datos de tienda y admin no representan una fuente persistida compartida.

Las vistas añadidas siguen el diagrama de Evaluación 2. Sus requisitos funcionales y de tests quedan pendientes de la siguiente etapa por el alcance solicitado. No se utilizó código de luz_de_plata.

## Verificación

- npm ci, npm run build y npm run lint completados.
- Recorrido de enlaces en navegador sin errores de consola ni imágenes rotas.
- Rutas inexistentes y registros no encontrados comprobados.
- Revisión a 390 px de inicio, admin, productos admin y editar perfil sin desbordamiento horizontal.
- Navegación sin escrituras en localStorage.

La comprobación de navegación se hizo fuera del proyecto entregado: no se añadieron archivos ni dependencias de tests.

El ZIP excluye node_modules, dist y archivos temporales. Los documentos originales se conservan como referencia histórica y no describen necesariamente esta etapa.
