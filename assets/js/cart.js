(function () {
  'use strict';

  function renderCart() {
    const itemsTarget = document.querySelector('[data-cart-items]');
    const totalTarget = document.querySelector('[data-cart-total]');

    if (!itemsTarget || !totalTarget) return;

    const products = TCG.getProducts();
    const cart = TCG.getCart();

    // Si el carrito está vacío
    if (!cart.length) {
      itemsTarget.innerHTML = `
        <div class="content-card empty-state">
          <h2>Tu carrito está vacío</h2>
          <p>Añade productos desde el catálogo.</p>
          <a class="btn btn-primary" href="productos.html">
            Ver productos
          </a>
        </div>
      `;

      totalTarget.textContent = TCG.currency(0);
      return;
    }

    let total = 0;

    itemsTarget.innerHTML = cart.map(item => {
      const product = products.find(
        p => Number(p.id) === Number(item.productId)
      );

      if (!product) return '';

      const subtotal = Number(product.price) * Number(item.qty);
      total += subtotal;

      return `
        <article class="cart-item" data-cart-row="${product.id}">

          <img
            src="${product.image}"
            alt="${product.name}"
          >

          <div>

            <h3>${product.name}</h3>

            <div class="product-meta">
              ${product.category}
            </div>

            <strong>
              ${TCG.currency(product.price)}
            </strong>

            <div class="cart-controls">

              <button
                class="qty-btn"
                type="button"
                data-cart-action="minus"
                data-id="${product.id}"
                aria-label="Quitar una unidad">
                −
              </button>

              <span>${item.qty}</span>

              <button
                class="qty-btn"
                type="button"
                data-cart-action="plus"
                data-id="${product.id}"
                aria-label="Añadir una unidad">
                +
              </button>

              <button
                class="btn btn-danger btn-sm"
                type="button"
                data-cart-action="remove"
                data-id="${product.id}">
                Eliminar
              </button>

            </div>

          </div>

          <div>
            <strong>
              ${TCG.currency(subtotal)}
            </strong>
          </div>

        </article>
      `;
    }).join('');

    totalTarget.textContent = TCG.currency(total);
  }


  function updateItem(id, action) {
    const cart = TCG.getCart();
    const products = TCG.getProducts();

    const item = cart.find(
      row => Number(row.productId) === Number(id)
    );

    const product = products.find(
      row => Number(row.id) === Number(id)
    );

    if (!item || !product) return;


    // Aumentar cantidad
    if (action === 'plus') {

      if (item.qty >= product.stock) {
        TCG.flash(
          `No puedes superar el stock disponible (${product.stock}).`,
          'error'
        );

        return;
      }

      item.qty += 1;
    }


    // Disminuir cantidad
    if (action === 'minus') {
      item.qty = Math.max(1, item.qty - 1);
    }


    // Eliminar un producto
    if (action === 'remove') {
      const index = cart.indexOf(item);

      cart.splice(index, 1);
    }


    // Guardar cambios
    TCG.saveCart(cart);

    // Volver a mostrar carrito
    renderCart();
  }


  // Genera el siguiente número de orden disponible: ORD-001, ORD-002, etc.
  function nextOrderId(orders) {
    const largest = orders.reduce((max, order) => {
      const match = String(order.id || '').match(/^ORD-(\d+)$/i);
      return match ? Math.max(max, Number(match[1])) : max;
    }, 0);

    return `ORD-${String(largest + 1).padStart(3, '0')}`;
  }


  // Devuelve la fecha local como YYYY-MM-DD.
  function currentLocalDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  function processCheckout() {
    const session = TCG.getSession();

    // Para generar un pedido necesitamos saber a qué cliente pertenece.
    if (!session || session.role !== 'Cliente') {
      TCG.flash(
        'Debes iniciar sesión como Cliente para completar la compra.',
        'error'
      );
      return;
    }

    const cart = TCG.getCart();

    if (!cart.length) {
      TCG.flash('Tu carrito está vacío.', 'error');
      return;
    }

    const products = TCG.getProducts();
    const orderItems = [];
    let total = 0;

    // Primero validamos TODO el carrito. No descontamos stock todavía.
    for (const item of cart) {
      const product = products.find(
        row => Number(row.id) === Number(item.productId)
      );

      if (!product) {
        TCG.flash(
          'Uno de los productos del carrito ya no existe.',
          'error'
        );
        return;
      }

      const qty = Number(item.qty || 0);

      if (qty < 1) {
        TCG.flash(
          `La cantidad de ${product.name} no es válida.`,
          'error'
        );
        return;
      }

      if (qty > Number(product.stock || 0)) {
        TCG.flash(
          `No hay stock suficiente de ${product.name}. Disponible: ${product.stock}.`,
          'error'
        );
        return;
      }

      orderItems.push({
        productId: Number(product.id),
        name: product.name,
        qty,
        price: Number(product.price)
      });

      total += Number(product.price) * qty;
    }

    // Si todo el carrito es válido, ahora sí descontamos el stock.
    orderItems.forEach(item => {
      const product = products.find(
        row => Number(row.id) === Number(item.productId)
      );

      product.stock = Number(product.stock) - Number(item.qty);
    });

    const orders = TCG.getOrders();
    const customer = `${session.firstName || ''} ${session.lastName || ''}`.trim();

    const newOrder = {
      id: nextOrderId(orders),
      customer: customer || session.firstName || 'Cliente',
      customerEmail: session.email,
      date: currentLocalDate(),
      total,
      status: 'Pendiente',
      items: orderItems
    };

    // Guardamos inventario y pedido en localStorage.
    const productsSaved = TCG.saveProducts(products);
    const ordersSaved = TCG.write(TCG_STORAGE.orders, [...orders, newOrder]);

    if (!productsSaved || !ordersSaved) {
      TCG.flash(
        'No se pudo guardar la compra. Intenta nuevamente.',
        'error'
      );
      return;
    }

    // La compra ya quedó registrada, por lo tanto vaciamos el carrito.
    TCG.saveCart([]);
    renderCart();

    TCG.flash(
      `Tu pedido ${newOrder.id} ha sido correctamente ingresado.`,
      'success'
    );
  }


  document.addEventListener('DOMContentLoaded', function () {

    // Mostrar carrito al entrar a la página
    renderCart();


    // BOTONES +, - Y ELIMINAR
    const target = document.querySelector('[data-cart-items]');

    if (target) {

      target.addEventListener('click', event => {

        const button = event.target.closest('[data-cart-action]');

        if (!button) return;

        updateItem(
          Number(button.dataset.id),
          button.dataset.cartAction
        );

      });

    }


    // BOTÓN PAGAR
    const checkout = document.querySelector('[data-checkout]');

    if (checkout) {

      checkout.addEventListener('click', () => {
        processCheckout();
      });

    }


    // BOTÓN VACIAR CARRITO
    const clearCart = document.querySelector('[data-clear-cart]');

    if (clearCart) {

      clearCart.addEventListener('click', () => {

        const cart = TCG.getCart();


        // Si ya está vacío
        if (!cart.length) {

          TCG.flash(
            'El carrito ya está vacío.',
            'error'
          );

          return;
        }


        // Confirmación antes de borrar
        const confirmar = confirm(
          '¿Estás seguro de que quieres vaciar todo el carrito?'
        );


        // Si presiona cancelar
        if (!confirmar) {
          return;
        }


        // Vaciar carrito
        TCG.saveCart([]);


        // Volver a mostrar carrito vacío
        renderCart();


        // Mensaje
        TCG.flash(
          'Carrito vaciado correctamente.',
          'success'
        );

      });

    }

  });

})();
