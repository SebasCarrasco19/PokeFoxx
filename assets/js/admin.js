(function () {
  'use strict';

  function adminRootImage(path) {
    if (!path) return '../assets/img/producto-fenix.svg';
    if (/^(https?:|data:|\.\.\/)/.test(path)) return path;
    return `../${path}`;
  }

  function setupAdminAccess() {
    if (document.body.dataset.admin !== 'true') return null;
    const required = document.body.dataset.requiredRole === 'Administrador' ? ['Administrador'] : ['Administrador', 'Vendedor'];
    const session = TCG.requireRole(required);
    if (!session) return null;

    document.querySelectorAll('[data-admin-user]').forEach(el => { el.textContent = `${session.firstName} · ${session.role}`; });
    document.querySelectorAll('[data-admin-only]').forEach(el => { el.hidden = session.role !== 'Administrador'; });
    document.querySelectorAll('[data-vendor-allowed]').forEach(el => { el.hidden = !['Administrador', 'Vendedor'].includes(session.role); });
    return session;
  }

  function fillCategories(select) {
    if (!select) return;
    select.innerHTML = '<option value="">Selecciona una categoría</option>' + TCG_CATEGORIES.map(cat => `<option value="${cat}">${cat}</option>`).join('');
  }

  function fillRegions(form, selectedRegion, selectedCommune) {
    const region = form.elements.region;
    const commune = form.elements.commune;
    if (!region || !commune) return;
    region.innerHTML = '<option value="">Selecciona una región</option>' + TCG_REGIONS.map(item => `<option value="${item.region}">${item.region}</option>`).join('');
    if (selectedRegion) region.value = selectedRegion;

    function updateCommunes(value) {
      const found = TCG_REGIONS.find(item => item.region === region.value);
      commune.innerHTML = '<option value="">Selecciona una comuna</option>' + (found ? found.communes.map(name => `<option value="${name}">${name}</option>`).join('') : '');
      if (value) commune.value = value;
    }
    updateCommunes(selectedCommune);
    region.addEventListener('change', () => updateCommunes(''));
  }

  function setError(input, message) {
    const group = input.closest('.form-group');
    if (!group) return;
    const error = group.querySelector('.error-text');
    input.classList.toggle('field-error', Boolean(message));
    if (error) error.textContent = message || '';
  }

  function showMessage(form, message, type) {
    const box = form.querySelector('.form-message');
    if (!box) return;
    box.className = `form-message ${type}`;
    box.textContent = message;
  }

  function setupDashboard(session) {
    if (!document.querySelector('[data-dashboard]') || !session) return;
    const products = TCG.getProducts();
    const users = TCG.getUsers();
    const orders = TCG.getOrders();
    const critical = products.filter(p => p.criticalStock !== '' && p.criticalStock !== null && Number(p.stock) <= Number(p.criticalStock)).length;
    const values = {
      products: products.length,
      users: users.length,
      orders: orders.length,
      critical
    };
    Object.entries(values).forEach(([key, value]) => {
      document.querySelectorAll(`[data-stat="${key}"]`).forEach(el => { el.textContent = value; });
    });
  }

  function setupProductList(session) {
    const tbody = document.querySelector('[data-admin-products]');
    if (!tbody || !session) return;

    function render() {
      const products = TCG.getProducts();
      tbody.innerHTML = products.map(product => {
        const critical = product.criticalStock !== '' && product.criticalStock !== null && Number(product.stock) <= Number(product.criticalStock);
        return `<tr>
          <td>${product.code}</td>
          <td>${product.name}</td>
          <td>${product.category}</td>
          <td>${TCG.currency(product.price)}</td>
          <td>${product.stock} ${critical ? '<span class="badge badge-warning">Stock crítico</span>' : ''}</td>
          <td class="table-actions">
            <a class="btn btn-secondary btn-sm" href="producto-form.html?id=${product.id}">${session.role === 'Administrador' ? 'Editar / ver' : 'Ver detalle'}</a>
            ${session.role === 'Administrador' ? `<button class="btn btn-danger btn-sm" type="button" data-delete-product="${product.id}">Eliminar</button>` : ''}
          </td>
        </tr>`;
      }).join('');
    }

    tbody.addEventListener('click', event => {
      const button = event.target.closest('[data-delete-product]');
      if (!button || session.role !== 'Administrador') return;
      const id = Number(button.dataset.deleteProduct);
      const product = TCG.getProducts().find(p => Number(p.id) === id);
      if (!product) return;
      if (!window.confirm(`¿Eliminar ${product.name}?`)) return;
      TCG.saveProducts(TCG.getProducts().filter(p => Number(p.id) !== id));
      render();
    });
    render();
  }

  function validateProductForm(form) {
    let valid = true;
    const code = form.elements.code;
    const name = form.elements.name;
    const description = form.elements.description;
    const price = form.elements.price;
    const stock = form.elements.stock;
    const critical = form.elements.criticalStock;
    const category = form.elements.category;

    let msg = !code.value.trim() ? 'Código es requerido.' : code.value.trim().length < 3 ? 'Código debe tener mínimo 3 caracteres.' : '';
    setError(code, msg); valid = valid && !msg;
    msg = !name.value.trim() ? 'Nombre es requerido.' : name.value.length > 100 ? 'Nombre permite máximo 100 caracteres.' : '';
    setError(name, msg); valid = valid && !msg;
    msg = description.value.length > 500 ? 'Descripción permite máximo 500 caracteres.' : '';
    setError(description, msg); valid = valid && !msg;
    msg = price.value === '' ? 'Precio es requerido.' : Number(price.value) < 0 ? 'Precio debe ser 0 o mayor.' : '';
    setError(price, msg); valid = valid && !msg;
    msg = stock.value === '' ? 'Stock es requerido.' : Number(stock.value) < 0 || !Number.isInteger(Number(stock.value)) ? 'Stock debe ser un entero igual o mayor que 0.' : '';
    setError(stock, msg); valid = valid && !msg;
    msg = critical.value !== '' && (Number(critical.value) < 0 || !Number.isInteger(Number(critical.value))) ? 'Stock crítico debe ser un entero igual o mayor que 0.' : '';
    setError(critical, msg); valid = valid && !msg;
    msg = !category.value ? 'Categoría es requerida.' : '';
    setError(category, msg); valid = valid && !msg;
    return valid;
  }

  function setupProductForm(session) {
    const form = document.getElementById('adminProductForm');
    if (!form || !session) return;
    if (session.role !== 'Administrador') {
      form.querySelectorAll('input, textarea, select, button[type="submit"]').forEach(el => { el.disabled = true; });
      const note = document.querySelector('[data-permission-note]');
      if (note) note.textContent = 'Rol Vendedor: puede visualizar productos y detalles, pero no crear ni editar.';
    }

    fillCategories(form.elements.category);
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get('id') || 0);
    const products = TCG.getProducts();
    const product = products.find(p => Number(p.id) === id);
    if (session.role === 'Vendedor' && !product) {
      window.location.href = 'productos.html';
      return;
    }
    const title = document.querySelector('[data-form-title]');
    if (product) {
      if (title) title.textContent = session.role === 'Administrador' ? 'Editar / mostrar producto' : 'Detalle de producto';
      form.elements.code.value = product.code;
      form.elements.name.value = product.name;
      form.elements.description.value = product.description || '';
      form.elements.price.value = product.price;
      form.elements.stock.value = product.stock;
      form.elements.criticalStock.value = product.criticalStock ?? '';
      form.elements.category.value = product.category;
      form.elements.image.value = product.image || '';
      const preview = document.querySelector('[data-product-preview]');
      if (preview) preview.src = adminRootImage(product.image);
    }

    form.querySelectorAll('input, textarea, select').forEach(input => input.addEventListener('blur', () => validateProductForm(form)));
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (session.role !== 'Administrador') return;
      if (!validateProductForm(form)) return showMessage(form, 'Corrige los campos marcados.', 'error');
      const current = TCG.getProducts();
      const code = form.elements.code.value.trim();
      if (current.some(p => p.code.toLowerCase() === code.toLowerCase() && Number(p.id) !== id)) return showMessage(form, 'Ya existe un producto con ese código.', 'error');

      const value = {
        id: product ? product.id : (current.length ? Math.max(...current.map(p => Number(p.id))) + 1 : 1),
        code,
        name: form.elements.name.value.trim(),
        description: form.elements.description.value.trim(),
        price: Number(form.elements.price.value),
        stock: Number(form.elements.stock.value),
        criticalStock: form.elements.criticalStock.value === '' ? '' : Number(form.elements.criticalStock.value),
        category: form.elements.category.value,
        image: form.elements.image.value.trim() || 'assets/img/producto-fenix.svg',
        // Conservamos los datos usados por los filtros/ofertas del catálogo.
        game: product?.game || TCG_GAMES[0],
        onSale: product?.onSale || false,
        originalPrice: product?.originalPrice ?? Number(form.elements.price.value)
      };
      if (product) current[current.findIndex(p => Number(p.id) === id)] = value;
      else current.push(value);
      TCG.saveProducts(current);
      showMessage(form, product ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.', 'success');
      if (!product) setTimeout(() => { window.location.href = 'productos.html'; }, 650);
    });
  }

  function setupUserList(session) {
    const tbody = document.querySelector('[data-admin-users]');
    if (!tbody || !session) return;
    if (session.role !== 'Administrador') return;
    const users = TCG.getUsers();
    tbody.innerHTML = users.map(user => `<tr>
      <td>${user.run}</td><td>${user.firstName} ${user.lastName}</td><td>${user.email}</td><td><span class="role-chip">${user.role}</span></td><td>${user.region} / ${user.commune}</td>
      <td><a class="btn btn-secondary btn-sm" href="usuario-form.html?run=${encodeURIComponent(user.run)}">Editar / ver</a></td>
    </tr>`).join('');
  }

  function validateUserForm(form) {
    let valid = true;
    const rules = [
      ['run', () => !form.elements.run.value.trim() ? 'RUN es requerido.' : (form.elements.run.value.length < 7 || form.elements.run.value.length > 9) ? 'RUN debe tener entre 7 y 9 caracteres.' : !TCG.validateRun(form.elements.run.value.trim()) ? 'RUN no válido, sin puntos ni guion.' : ''],
      ['firstName', () => !form.elements.firstName.value.trim() ? 'Nombre es requerido.' : form.elements.firstName.value.length > 50 ? 'Máximo 50 caracteres.' : ''],
      ['lastName', () => !form.elements.lastName.value.trim() ? 'Apellidos son requeridos.' : form.elements.lastName.value.length > 100 ? 'Máximo 100 caracteres.' : ''],
      ['email', () => !form.elements.email.value.trim() ? 'Correo es requerido.' : form.elements.email.value.length > 100 ? 'Máximo 100 caracteres.' : !TCG.allowedEmail(form.elements.email.value) ? 'Dominio de correo no permitido.' : ''],
      ['password', () => !form.elements.password.value ? 'Contraseña es requerida.' : (form.elements.password.value.length < 4 || form.elements.password.value.length > 10) ? 'Debe tener entre 4 y 10 caracteres.' : ''],
      ['role', () => !form.elements.role.value ? 'Tipo de usuario es requerido.' : ''],
      ['region', () => !form.elements.region.value ? 'Región es requerida.' : ''],
      ['commune', () => !form.elements.commune.value ? 'Comuna es requerida.' : ''],
      ['address', () => !form.elements.address.value.trim() ? 'Dirección es requerida.' : form.elements.address.value.length > 300 ? 'Máximo 300 caracteres.' : '']
    ];
    rules.forEach(([name, fn]) => { const msg = fn(); setError(form.elements[name], msg); valid = valid && !msg; });
    return valid;
  }

  function setupUserForm(session) {
    const form = document.getElementById('adminUserForm');
    if (!form || !session || session.role !== 'Administrador') return;
    const params = new URLSearchParams(window.location.search);
    const runParam = params.get('run');
    const users = TCG.getUsers();
    const user = users.find(u => u.run === runParam);
    fillRegions(form, user?.region, user?.commune);
    const title = document.querySelector('[data-form-title]');
    if (user) {
      if (title) title.textContent = 'Editar / mostrar usuario';
      form.elements.run.value = user.run;
      form.elements.firstName.value = user.firstName;
      form.elements.lastName.value = user.lastName;
      form.elements.email.value = user.email;
      form.elements.birthDate.value = user.birthDate || '';
      form.elements.role.value = user.role;
      form.elements.address.value = user.address;
      form.elements.password.value = user.password;
    }

    form.querySelectorAll('input, select').forEach(input => input.addEventListener('blur', () => validateUserForm(form)));
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!validateUserForm(form)) return showMessage(form, 'Corrige los campos marcados.', 'error');
      const current = TCG.getUsers();
      const run = form.elements.run.value.trim().toUpperCase();
      const email = form.elements.email.value.trim().toLowerCase();
      if (current.some(u => u.run === run && u.run !== runParam)) return showMessage(form, 'Ya existe un usuario con ese RUN.', 'error');
      if (current.some(u => u.email.toLowerCase() === email && u.run !== runParam)) return showMessage(form, 'Ya existe un usuario con ese correo.', 'error');
      const value = { run, firstName: form.elements.firstName.value.trim(), lastName: form.elements.lastName.value.trim(), email, birthDate: form.elements.birthDate.value, role: form.elements.role.value, region: form.elements.region.value, commune: form.elements.commune.value, address: form.elements.address.value.trim(), password: form.elements.password.value };
      if (user) current[current.findIndex(u => u.run === runParam)] = value;
      else current.push(value);
      TCG.saveUsers(current);
      showMessage(form, user ? 'Usuario actualizado correctamente.' : 'Usuario creado correctamente.', 'success');
      if (!user) setTimeout(() => { window.location.href = 'usuarios.html'; }, 650);
    });
  }

  function setupOrders(session) {
    const tbody = document.querySelector('[data-admin-orders]');
    if (!tbody || !session) return;
    tbody.innerHTML = TCG.getOrders().map(order => `<tr><td>${order.id}</td><td>${order.customer}</td><td>${order.date}</td><td>${TCG.currency(order.total)}</td><td>${order.status}</td><td><a class="btn btn-secondary btn-sm" href="orden-detalle.html?id=${encodeURIComponent(order.id)}">Ver detalle</a></td></tr>`).join('');
  }

  function setupOrderDetail(session) {
    const target = document.querySelector('[data-order-detail]');
    if (!target || !session) return;
    const id = new URLSearchParams(window.location.search).get('id') || 'ORD-001';
    const order = TCG.getOrders().find(item => item.id === id);
    if (!order) return target.innerHTML = '<div class="content-card">Orden no encontrada.</div>';
    target.innerHTML = `<div class="content-card"><h2>${order.id}</h2><p><strong>Cliente:</strong> ${order.customer}</p><p><strong>Fecha:</strong> ${order.date}</p><p><strong>Estado:</strong> ${order.status}</p><div class="table-wrap"><table><thead><tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Subtotal</th></tr></thead><tbody>${order.items.map(item => `<tr><td>${item.name}</td><td>${item.qty}</td><td>${TCG.currency(item.price)}</td><td>${TCG.currency(item.qty * item.price)}</td></tr>`).join('')}</tbody></table></div><p class="price-large">Total: ${TCG.currency(order.total)}</p></div>`;
  }

  document.addEventListener('DOMContentLoaded', function () {
    const session = setupAdminAccess();
    setupDashboard(session);
    setupProductList(session);
    setupProductForm(session);
    setupUserList(session);
    setupUserForm(session);
    setupOrders(session);
    setupOrderDetail(session);
  });
})();
