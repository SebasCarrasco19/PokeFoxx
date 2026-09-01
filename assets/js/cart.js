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

        TCG.flash(
          'La evaluación solicita implementar el carrito; el pago real queda fuera de esta entrega.',
          'success'
        );

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


        // Actualizar pantalla
        renderCart();


        // Mensaje de confirmación
        TCG.flash(
          'Carrito vaciado correctamente.',
          'success'
        );

      });

    }

  });

})();