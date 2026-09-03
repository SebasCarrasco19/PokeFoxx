(function () {
  'use strict';

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function getClientSession() {
    return TCG.requireRole(['Cliente']);
  }

  function customerName(user) {
    return `${user.firstName || ''} ${user.lastName || ''}`.trim();
  }

  function belongsToUser(order, user) {
    const email = String(user.email || '').trim().toLowerCase();
    const orderEmail = String(order.customerEmail || '').trim().toLowerCase();
    const name = customerName(user).toLowerCase();
    const orderName = String(order.customer || '').trim().toLowerCase();

    return (email && orderEmail === email) || (name && orderName === name);
  }

  function getUserOrders(user) {
    return TCG.getOrders()
      .filter(order => belongsToUser(order, user))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  function statusClass(status) {
    const value = String(status || '').toLowerCase();
    if (value === 'entregado') return 'badge-success';
    if (value === 'cancelado') return 'badge-danger';
    return 'badge-warning';
  }

  function displayValue(value, fallback = 'No informado') {
    const text = String(value || '').trim();
    return text ? escapeHtml(text) : fallback;
  }

  function renderReadOnlyProfile() {
    const target = document.querySelector('[data-profile-view]');
    if (!target) return;

    const session = getClientSession();
    if (!session) return;

    target.innerHTML = `
      <div class="profile-view-list">
        <div class="profile-view-row">
          <span>RUN</span>
          <strong>${displayValue(session.run)}</strong>
        </div>
        <div class="profile-view-row">
          <span>Nombre</span>
          <strong>${displayValue(session.firstName)}</strong>
        </div>
        <div class="profile-view-row">
          <span>Apellidos</span>
          <strong>${displayValue(session.lastName)}</strong>
        </div>
        <div class="profile-view-row">
          <span>Correo</span>
          <strong>${displayValue(session.email)}</strong>
        </div>
        <div class="profile-view-row">
          <span>Fecha de nacimiento</span>
          <strong>${displayValue(session.birthDate)}</strong>
        </div>
        <div class="profile-view-row">
          <span>Región</span>
          <strong>${displayValue(session.region)}</strong>
        </div>
        <div class="profile-view-row">
          <span>Comuna</span>
          <strong>${displayValue(session.commune)}</strong>
        </div>
        <div class="profile-view-row full">
          <span>Dirección</span>
          <strong>${displayValue(session.address)}</strong>
        </div>
      </div>
      <div class="profile-view-actions">
        <a class="btn btn-primary" href="editar-perfil.html">Editar perfil</a>
      </div>`;
  }

  function fillRegions(form, selectedRegion, selectedCommune) {
    const region = form.elements.region;
    const commune = form.elements.commune;
    if (!region || !commune) return;

    region.innerHTML = '<option value="">Selecciona una región</option>' +
      TCG_REGIONS.map(item =>
        `<option value="${escapeHtml(item.region)}">${escapeHtml(item.region)}</option>`
      ).join('');

    function updateCommunes(communeToSelect) {
      const item = TCG_REGIONS.find(row => row.region === region.value);
      const communes = item ? item.communes : [];

      commune.innerHTML = '<option value="">Selecciona una comuna</option>' +
        communes.map(name =>
          `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`
        ).join('');

      if (communeToSelect && communes.includes(communeToSelect)) {
        commune.value = communeToSelect;
      }
    }

    if (selectedRegion) region.value = selectedRegion;
    updateCommunes(selectedCommune);
    region.addEventListener('change', () => updateCommunes(''));
  }

  function setFieldError(field, message) {
    if (!field) return;

    field.classList.toggle('field-error', Boolean(message));
    const error = field.closest('.form-group')?.querySelector('[data-field-error]');

    if (error) error.textContent = message || '';
  }

  function setupEditProfile() {
    const form = document.getElementById('profileForm');
    if (!form) return;

    const session = getClientSession();
    if (!session) return;

    form.elements.run.value = session.run || '';
    form.elements.firstName.value = session.firstName || '';
    form.elements.lastName.value = session.lastName || '';
    form.elements.email.value = session.email || '';
    form.elements.birthDate.value = session.birthDate || '';
    form.elements.address.value = session.address || '';
    fillRegions(form, session.region, session.commune);

    form.addEventListener('submit', event => {
      event.preventDefault();

      const run = form.elements.run.value.trim().toUpperCase();
      const firstName = form.elements.firstName.value.trim();
      const lastName = form.elements.lastName.value.trim();
      const email = form.elements.email.value.trim().toLowerCase();
      const birthDate = form.elements.birthDate.value;
      const region = form.elements.region.value;
      const commune = form.elements.commune.value;
      const address = form.elements.address.value.trim();
      const password = form.elements.password.value;

      let valid = true;

      const checks = [
        [form.elements.run,
          !run
            ? 'RUN es requerido.'
            : (run.length < 7 || run.length > 9 || !TCG.validateRun(run))
              ? 'RUN no válido. Escríbelo sin puntos ni guion.'
              : ''
        ],
        [form.elements.firstName,
          !firstName
            ? 'Nombre es requerido.'
            : firstName.length > 50
              ? 'Nombre permite máximo 50 caracteres.'
              : ''
        ],
        [form.elements.lastName,
          !lastName
            ? 'Apellidos son requeridos.'
            : lastName.length > 100
              ? 'Apellidos permiten máximo 100 caracteres.'
              : ''
        ],
        [form.elements.email,
          !email
            ? 'Correo es requerido.'
            : email.length > 100
              ? 'Correo permite máximo 100 caracteres.'
              : !TCG.allowedEmail(email)
                ? 'Usa @duoc.cl, @profesor.duoc.cl o @gmail.com.'
                : ''
        ],
        [form.elements.region, !region ? 'Selecciona una región.' : ''],
        [form.elements.commune, !commune ? 'Selecciona una comuna.' : ''],
        [form.elements.address,
          !address
            ? 'Dirección es requerida.'
            : address.length > 300
              ? 'Dirección permite máximo 300 caracteres.'
              : ''
        ],
        [form.elements.password,
          password && (password.length < 4 || password.length > 10)
            ? 'La contraseña debe tener entre 4 y 10 caracteres.'
            : ''
        ]
      ];

      checks.forEach(([field, message]) => {
        setFieldError(field, message);
        if (message) valid = false;
      });

      if (!valid) {
        TCG.flash('Corrige los campos marcados antes de guardar.', 'error');
        return;
      }

      const users = TCG.getUsers();
      const oldEmail = String(session.email || '').toLowerCase();
      const oldRun = String(session.run || '').toUpperCase();

      const index = users.findIndex(user =>
        String(user.email || '').toLowerCase() === oldEmail ||
        String(user.run || '').toUpperCase() === oldRun
      );

      if (index < 0) {
        TCG.flash('No se encontró tu usuario registrado.', 'error');
        return;
      }

      const duplicatedEmail = users.some((user, i) =>
        i !== index && String(user.email || '').toLowerCase() === email
      );

      const duplicatedRun = users.some((user, i) =>
        i !== index && String(user.run || '').toUpperCase() === run
      );

      if (duplicatedEmail) {
        setFieldError(form.elements.email, 'Ya existe otro usuario con ese correo.');
        return;
      }

      if (duplicatedRun) {
        setFieldError(form.elements.run, 'Ya existe otro usuario con ese RUN.');
        return;
      }

      const oldName = customerName(users[index]);

      const updatedUser = {
        ...users[index],
        run,
        firstName,
        lastName,
        email,
        birthDate,
        region,
        commune,
        address,
        role: 'Cliente'
      };

      if (password) updatedUser.password = password;

      users[index] = updatedUser;
      TCG.saveUsers(users);
      TCG.setSession(updatedUser);

      // Mantiene asociados al cliente los pedidos existentes si cambió nombre o correo.
      const orders = TCG.getOrders();
      let ordersChanged = false;

      orders.forEach(order => {
        const matchesOldEmail =
          order.customerEmail &&
          String(order.customerEmail).toLowerCase() === oldEmail;

        const matchesOldName =
          String(order.customer || '').trim().toLowerCase() === oldName.toLowerCase();

        if (matchesOldEmail || matchesOldName) {
          order.customer = customerName(updatedUser);
          order.customerEmail = updatedUser.email;
          ordersChanged = true;
        }
      });

      if (ordersChanged) TCG.write(TCG_STORAGE.orders, orders);

      form.elements.password.value = '';
      TCG.currentUserLabel();
      TCG.flash('Perfil actualizado correctamente.', 'success');

      setTimeout(() => {
        window.location.href = 'cuenta.html';
      }, 650);
    });
  }

  function renderOrders(user) {
    const target = document.querySelector('[data-client-orders]');
    if (!target) return;

    const orders = getUserOrders(user);

    if (!orders.length) {
      target.innerHTML = `
        <div class="content-card empty-state">
          <h3>Aún no tienes pedidos</h3>
          <p>Cuando realices una compra, aparecerá aquí junto a su estado.</p>
          <a class="btn btn-primary" href="productos.html">Ver productos</a>
        </div>`;
      return;
    }

    target.innerHTML = `
      <div class="orders-list">
        ${orders.map(order => `
          <article class="client-order-card">
            <div>
              <span class="eyebrow">${escapeHtml(order.id)}</span>
              <h3>Pedido del ${escapeHtml(order.date)}</h3>
              <p>
                ${order.items.length}
                producto${order.items.length === 1 ? '' : 's'}
                · ${TCG.currency(order.total)}
              </p>
            </div>
            <div class="client-order-actions">
              <span class="badge ${statusClass(order.status)}">
                ${escapeHtml(order.status)}
              </span>
              <a
                class="btn btn-secondary btn-sm"
                href="pedido.html?id=${encodeURIComponent(order.id)}"
              >Ver detalle</a>
            </div>
          </article>
        `).join('')}
      </div>`;
  }

  function setupAccountView() {
    const ordersTarget = document.querySelector('[data-client-orders]');
    const profileTarget = document.querySelector('[data-profile-view]');

    if (!ordersTarget && !profileTarget) return;

    const session = getClientSession();
    if (!session) return;

    renderReadOnlyProfile();
    renderOrders(session);
  }

  function renderOrderDetail() {
    const target = document.querySelector('[data-client-order-detail]');
    if (!target) return;

    const session = getClientSession();
    if (!session) return;

    const id = new URLSearchParams(window.location.search).get('id');
    const order = TCG.getOrders().find(item =>
      item.id === id && belongsToUser(item, session)
    );

    if (!order) {
      target.innerHTML = `
        <div class="content-card empty-state">
          <h2>Pedido no encontrado</h2>
          <p>El pedido no existe o no pertenece a tu cuenta.</p>
          <a class="btn btn-primary" href="cuenta.html">Volver a Mi cuenta</a>
        </div>`;
      return;
    }

    const statuses = ['Pendiente', 'Preparando', 'Despachado', 'En ruta', 'Entregado'];
    let currentIndex = statuses.findIndex(status =>
      status.toLowerCase() === String(order.status || '').toLowerCase()
    );

    if (currentIndex < 0) currentIndex = 0;

    target.innerHTML = `
      <div class="order-detail-grid">
        <section class="content-card">
          <span class="eyebrow">${escapeHtml(order.id)}</span>
          <h1>Detalle del pedido</h1>
          <p>Fecha: <strong>${escapeHtml(order.date)}</strong></p>

          <div class="order-status-header">
            <span>Estado actual</span>
            <span class="badge ${statusClass(order.status)}">
              ${escapeHtml(order.status)}
            </span>
          </div>

          <div class="order-timeline">
            ${statuses.map((status, index) => `
              <div
                class="timeline-step
                  ${index < currentIndex ? 'completed' : ''}
                  ${index === currentIndex ? 'current' : ''}"
              >
                <span class="timeline-dot">
                  ${index < currentIndex ? '✓' : index + 1}
                </span>
                <span>${status}</span>
              </div>
            `).join('')}
          </div>
        </section>

        <section class="content-card">
          <h2>Productos</h2>

          <div class="order-items-list">
            ${order.items.map(item => `
              <div class="order-item-line">
                <div>
                  <strong>${escapeHtml(item.name)}</strong>
                  <span>${item.qty} × ${TCG.currency(item.price)}</span>
                </div>
                <strong>
                  ${TCG.currency(Number(item.qty) * Number(item.price))}
                </strong>
              </div>
            `).join('')}
          </div>

          <div class="summary-line total">
            <span>Total</span>
            <span>${TCG.currency(order.total)}</span>
          </div>

          <a class="btn btn-secondary account-back" href="cuenta.html">
            ← Volver a Mi cuenta
          </a>
        </section>
      </div>`;
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupAccountView();
    setupEditProfile();
    renderOrderDetail();
  });
})();
