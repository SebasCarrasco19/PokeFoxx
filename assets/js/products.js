(function () {
  'use strict';

  function productImage(product) {
    return product.image || 'assets/img/producto-fenix.svg';
  }

  function escapeHtml(value) {
    return String(value || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function renderCard(product) {
    const hasOffer = product.onSale && Number(product.originalPrice) > Number(product.price);
    const game = product.game || 'Sin TCG';
    const priceHtml = hasOffer
      ? `<div class="product-price-row"><span class="product-price-old">${TCG.currency(product.originalPrice)}</span><span class="product-price">${TCG.currency(product.price)}</span></div>`
      : `<div class="product-price">${TCG.currency(product.price)}</div>`;

    return `
      <article class="product-card">
        <a class="image-link" href="producto.html?id=${encodeURIComponent(product.id)}" aria-label="Ver ${product.name}">
          <img src="${productImage(product)}" alt="${product.name}">
          ${hasOffer ? '<span class="offer-badge">Oferta</span>' : ''}
        </a>
        <div class="product-card-body">
          <div class="product-card-tags">
            <span class="product-game">${game}</span>
            <span class="product-meta">${product.category}</span>
          </div>
          <h3><a href="producto.html?id=${encodeURIComponent(product.id)}">${product.name}</a></h3>
          ${priceHtml}
          <button class="btn btn-primary" type="button" data-add-product="${product.id}" ${product.stock <= 0 ? 'disabled' : ''}>
            ${product.stock <= 0 ? 'Sin stock' : 'Añadir al carrito'}
          </button>
        </div>
      </article>`;
  }

  function bindAddButtons(scope) {
    scope.querySelectorAll('[data-add-product]').forEach(button => {
      button.addEventListener('click', () => {
        const result = TCG.addToCart(Number(button.dataset.addProduct), 1);
        TCG.flash(result.message, result.ok ? 'success' : 'error');
      });
    });
  }

  function renderProductGrid() {
    document.querySelectorAll('[data-product-grid]').forEach(grid => {
      let products = TCG.getProducts();
      const limit = Number(grid.dataset.limit || 0);

      // Estos controles existen en productos.html. En HOME no existen,
      // por eso allí se siguen mostrando los productos destacados normalmente.
      const searchInput = document.querySelector('[data-product-search]');
      const gameFilter = document.querySelector('[data-game-filter]');
      const offerFilter = document.querySelector('[data-offer-filter]');
      const resultText = document.querySelector('[data-filter-results]');

      function fillGameOptions() {
        if (!gameFilter || gameFilter.dataset.ready === 'true') return;
        const games = [...new Set(products.map(product => product.game).filter(Boolean))];
        gameFilter.innerHTML = '<option value="">Todos los TCG</option>' + games.map(game => `<option value="${game}">${game}</option>`).join('');
        gameFilter.dataset.ready = 'true';
      }

      function applyFilters() {
        let filtered = [...products];
        const search = searchInput ? searchInput.value.trim().toLowerCase() : '';
        const selectedGame = gameFilter ? gameFilter.value : '';
        const onlyOffers = offerFilter ? offerFilter.checked : false;

        if (search) {
          filtered = filtered.filter(product =>
            product.name.toLowerCase().includes(search) ||
            (product.description || '').toLowerCase().includes(search)
          );
        }

        if (selectedGame) {
          filtered = filtered.filter(product => product.game === selectedGame);
        }

        if (onlyOffers) {
          filtered = filtered.filter(product => product.onSale && Number(product.originalPrice) > Number(product.price));
        }

        if (limit > 0) filtered = filtered.slice(0, limit);

        grid.innerHTML = filtered.length
          ? filtered.map(renderCard).join('')
          : '<div class="content-card empty-state catalog-empty"><h2>No encontramos productos</h2><p>Prueba con otra búsqueda o cambia los filtros.</p></div>';

        if (resultText) {
          resultText.textContent = `${filtered.length} producto${filtered.length === 1 ? '' : 's'} encontrado${filtered.length === 1 ? '' : 's'}`;
        }
        bindAddButtons(grid);
      }

      fillGameOptions();
      applyFilters();

      if (searchInput) searchInput.addEventListener('input', applyFilters);
      if (gameFilter) gameFilter.addEventListener('change', applyFilters);
      if (offerFilter) offerFilter.addEventListener('change', applyFilters);
    });
  }

  function copyProductLink(url) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(url);
    }

    return new Promise((resolve, reject) => {
      const input = document.createElement('textarea');
      input.value = url;
      input.setAttribute('readonly', '');
      input.style.position = 'fixed';
      input.style.opacity = '0';
      document.body.appendChild(input);
      input.select();
      try {
        const copied = document.execCommand('copy');
        copied ? resolve() : reject(new Error('No se pudo copiar.'));
      } catch (error) {
        reject(error);
      } finally {
        input.remove();
      }
    });
  }

  function setupShare(product) {
    const shareButton = document.getElementById('detailShare');
    if (!shareButton) return;

    shareButton.addEventListener('click', async () => {
      const shareData = {
        title: `${product.name} | TCG Market`,
        text: `Mira ${product.name} en TCG Market`,
        url: window.location.href
      };

      try {
        if (navigator.share) {
          await navigator.share(shareData);
          return;
        }
        await copyProductLink(shareData.url);
        TCG.flash('Enlace del producto copiado.', 'success');
      } catch (error) {
        // Cancelar el menú nativo de compartir no debe mostrarse como un error.
        if (error && error.name === 'AbortError') return;
        TCG.flash('No se pudo compartir el producto.', 'error');
      }
    });
  }

  function renderComments(product) {
    const target = document.querySelector('[data-product-comments]');
    if (!target) return;

    const session = TCG.getSession();
    const comments = TCG.getComments()
      .filter(comment => Number(comment.productId) === Number(product.id))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const commentsHtml = comments.length
      ? comments.map(comment => {
          const date = new Date(comment.createdAt);
          const dateLabel = Number.isNaN(date.getTime()) ? '' : date.toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' });
          return `
            <article class="product-comment">
              <div class="comment-header">
                <strong>${escapeHtml(comment.userName)}</strong>
                <span>${escapeHtml(dateLabel)}</span>
              </div>
              <p>${escapeHtml(comment.text)}</p>
            </article>`;
        }).join('')
      : '<p class="comments-empty">Todavía no hay comentarios. Sé el primero en opinar sobre este producto.</p>';

    const formHtml = session
      ? `
        <form id="productCommentForm" class="comment-form" novalidate>
          <div class="form-group">
            <label for="productComment">Dejar comentario</label>
            <textarea id="productComment" name="comment" maxlength="500" placeholder="Escribe tu opinión sobre este producto..."></textarea>
            <div class="comment-form-row">
              <span class="help-text">Comentarás como ${escapeHtml(session.firstName)} ${escapeHtml(session.lastName || '')}. Máximo 500 caracteres.</span>
              <span class="comment-counter" data-comment-counter>0/500</span>
            </div>
            <span class="error-text" data-comment-error></span>
          </div>
          <button class="btn btn-primary" type="submit">Publicar comentario</button>
        </form>`
      : `
        <div class="comment-login-notice">
          <p>Debes iniciar sesión para dejar un comentario.</p>
          <a class="btn btn-secondary" href="login.html">Iniciar sesión</a>
        </div>`;

    target.innerHTML = `
      <div class="comments-layout">
        <div>
          <div class="section-header comments-title">
            <div>
              <span class="eyebrow">Comunidad</span>
              <h2>Comentarios</h2>
              <p>${comments.length} comentario${comments.length === 1 ? '' : 's'} sobre ${escapeHtml(product.name)}.</p>
            </div>
          </div>
          <div class="comments-list">${commentsHtml}</div>
        </div>
        <aside class="content-card comments-form-card">${formHtml}</aside>
      </div>`;

    if (!session) return;

    const form = document.getElementById('productCommentForm');
    const textarea = document.getElementById('productComment');
    const error = target.querySelector('[data-comment-error]');
    const counter = target.querySelector('[data-comment-counter]');

    function updateCounter() {
      if (counter) counter.textContent = `${textarea.value.length}/500`;
    }

    textarea.addEventListener('input', () => {
      updateCounter();
      if (textarea.value.trim()) {
        textarea.classList.remove('field-error');
        error.textContent = '';
      }
    });

    form.addEventListener('submit', event => {
      event.preventDefault();
      const text = textarea.value.trim();

      if (!text) {
        textarea.classList.add('field-error');
        error.textContent = 'Debes escribir un comentario antes de publicarlo.';
        return;
      }

      const currentSession = TCG.getSession();
      if (!currentSession) {
        TCG.flash('Tu sesión terminó. Inicia sesión nuevamente para comentar.', 'error');
        renderComments(product);
        return;
      }

      const allComments = TCG.getComments();
      allComments.push({
        id: Date.now(),
        productId: Number(product.id),
        userEmail: currentSession.email,
        userName: `${currentSession.firstName} ${currentSession.lastName || ''}`.trim(),
        text,
        createdAt: new Date().toISOString()
      });
      TCG.saveComments(allComments);
      TCG.flash('Comentario publicado correctamente.', 'success');
      renderComments(product);
    });

    updateCounter();
  }

  function renderDetail() {
    const target = document.querySelector('[data-product-detail]');
    if (!target) return;
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get('id') || 1);
    const products = TCG.getProducts();
    const product = products.find(item => Number(item.id) === id);
    if (!product) {
      target.innerHTML = '<div class="content-card empty-state"><h2>Producto no encontrado</h2><p>El producto solicitado no existe.</p><a class="btn btn-primary" href="productos.html">Volver a productos</a></div>';
      return;
    }

    target.innerHTML = `
      <div class="product-detail">
        <div class="product-detail-media"><img src="${productImage(product)}" alt="${product.name}"></div>
        <div class="product-detail-info">
          <span class="eyebrow">${product.game || 'TCG'} · ${product.category}</span>
          <h1>${product.name}</h1>
          <p>${product.description || 'Sin descripción.'}</p>
          ${product.onSale && Number(product.originalPrice) > Number(product.price) ? `<p class="detail-offer-label">Oferta</p><div class="detail-price-row"><span class="product-price-old">${TCG.currency(product.originalPrice)}</span><div class="price-large">${TCG.currency(product.price)}</div></div>` : `<div class="price-large">${TCG.currency(product.price)}</div>`}
          <p class="stock">Stock disponible: ${product.stock}</p>
          <div class="quantity-row">
            <div class="form-group">
              <label for="detailQty">Cantidad</label>
              <input id="detailQty" type="number" min="1" max="${product.stock}" value="1">
            </div>
            <button class="btn btn-primary" id="detailAdd" type="button" ${product.stock <= 0 ? 'disabled' : ''}>Añadir al carrito</button>
          </div>
          <button class="btn btn-secondary detail-share" id="detailShare" type="button">Compartir producto</button>
          <p class="help-text">El carrito y los comentarios se guardan en localStorage para esta evaluación frontend.</p>
        </div>
      </div>`;

    const add = document.getElementById('detailAdd');
    if (add) {
      add.addEventListener('click', () => {
        const qty = Number(document.getElementById('detailQty').value || 1);
        const result = TCG.addToCart(product.id, qty);
        TCG.flash(result.message, result.ok ? 'success' : 'error');
      });
    }

    setupShare(product);
    renderComments(product);

    const related = document.querySelector('[data-related-products]');
    if (related) {
      const relatedItems = products.filter(p => p.id !== product.id).slice(0, 4);
      related.innerHTML = relatedItems.map(renderCard).join('');
      bindAddButtons(related);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderProductGrid();
    renderDetail();
  });
})();
