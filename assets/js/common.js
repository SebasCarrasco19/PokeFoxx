(function () {
  'use strict';

  window.TCG = window.TCG || {};

  const TCG = window.TCG;

  TCG.read = function (key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      console.warn('No se pudo leer localStorage:', error);
      return fallback;
    }
  };

  TCG.write = function (key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn('No se pudo escribir localStorage:', error);
      return false;
    }
  };

  TCG.ensureSeedData = function () {
    if (!localStorage.getItem(TCG_STORAGE.products)) {
      TCG.write(TCG_STORAGE.products, TCG_SEED_PRODUCTS);
    } else {
      // Si el navegador ya tenía productos de una versión anterior, agregamos
      // solamente los datos nuevos necesarios para filtros y ofertas.
      const savedProducts = TCG.read(TCG_STORAGE.products, []);
      let updated = false;
      const migratedProducts = savedProducts.map(product => {
        const seed = TCG_SEED_PRODUCTS.find(item => Number(item.id) === Number(product.id));
        if (!seed) return product;

        const migrated = { ...product };
        if (!migrated.game) { migrated.game = seed.game; updated = true; }
        if (typeof migrated.onSale !== 'boolean') { migrated.onSale = seed.onSale; updated = true; }
        if (migrated.originalPrice === undefined || migrated.originalPrice === null) {
          migrated.originalPrice = seed.originalPrice;
          updated = true;
        }
        return migrated;
      });
      if (updated) TCG.write(TCG_STORAGE.products, migratedProducts);
    }

    if (!localStorage.getItem(TCG_STORAGE.users)) TCG.write(TCG_STORAGE.users, TCG_SEED_USERS);
    if (!localStorage.getItem(TCG_STORAGE.orders)) TCG.write(TCG_STORAGE.orders, TCG_SEED_ORDERS);
    if (!localStorage.getItem(TCG_STORAGE.cart)) TCG.write(TCG_STORAGE.cart, []);
    if (!localStorage.getItem(TCG_STORAGE.contacts)) TCG.write(TCG_STORAGE.contacts, []);
    if (!localStorage.getItem(TCG_STORAGE.comments)) TCG.write(TCG_STORAGE.comments, []);
  };

  TCG.getProducts = () => TCG.read(TCG_STORAGE.products, TCG_SEED_PRODUCTS);
  TCG.saveProducts = products => TCG.write(TCG_STORAGE.products, products);
  TCG.getUsers = () => TCG.read(TCG_STORAGE.users, TCG_SEED_USERS);
  TCG.saveUsers = users => TCG.write(TCG_STORAGE.users, users);
  TCG.getOrders = () => TCG.read(TCG_STORAGE.orders, TCG_SEED_ORDERS);
  TCG.getCart = () => TCG.read(TCG_STORAGE.cart, []);
  TCG.saveCart = cart => {
    TCG.write(TCG_STORAGE.cart, cart);
    TCG.updateCartCount();
  };
  TCG.getComments = () => TCG.read(TCG_STORAGE.comments, []);
  TCG.saveComments = comments => TCG.write(TCG_STORAGE.comments, comments);
  TCG.getSession = () => TCG.read(TCG_STORAGE.session, null);
  TCG.setSession = user => TCG.write(TCG_STORAGE.session, user);
  TCG.clearSession = () => localStorage.removeItem(TCG_STORAGE.session);

  TCG.currency = function (value) {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(Number(value || 0));
  };

  TCG.allowedEmail = function (email) {
    if (!email) return false;
    const value = email.trim().toLowerCase();
    return /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/.test(value);
  };

  TCG.validateRun = function (run) {
    if (!/^[0-9]{6,8}[0-9Kk]$/.test(run || '')) return false;
    const clean = run.toUpperCase();
    const body = clean.slice(0, -1);
    const dv = clean.slice(-1);
    let sum = 0;
    let multiplier = 2;
    for (let i = body.length - 1; i >= 0; i -= 1) {
      sum += Number(body[i]) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
    const remainder = 11 - (sum % 11);
    const expected = remainder === 11 ? '0' : remainder === 10 ? 'K' : String(remainder);
    return dv === expected;
  };

  TCG.siteRoot = function () {
    return document.body.dataset.root || '.';
  };

  TCG.updateCartCount = function () {
    const cart = TCG.getCart();
    const count = cart.reduce((acc, item) => acc + Number(item.qty || 0), 0);
    document.querySelectorAll('[data-cart-count]').forEach(el => { el.textContent = count; });
  };

  TCG.addToCart = function (productId, qty) {
    const product = TCG.getProducts().find(p => Number(p.id) === Number(productId));
    if (!product) return { ok: false, message: 'El producto no existe.' };
    const requested = Math.max(1, parseInt(qty || 1, 10));
    if (product.stock <= 0) return { ok: false, message: 'El producto no tiene stock.' };

    const cart = TCG.getCart();
    const existing = cart.find(item => Number(item.productId) === Number(productId));
    const currentQty = existing ? Number(existing.qty) : 0;
    const newQty = currentQty + requested;
    if (newQty > product.stock) return { ok: false, message: `Solo hay ${product.stock} unidad(es) disponibles.` };

    if (existing) existing.qty = newQty;
    else cart.push({ productId: Number(productId), qty: requested });
    TCG.saveCart(cart);
    return { ok: true, message: 'Producto añadido al carrito.' };
  };

  TCG.flash = function (message, type) {
    let box = document.querySelector('[data-flash]');
    if (!box) {
      box = document.createElement('div');
      box.dataset.flash = 'true';
      box.style.position = 'fixed';
      box.style.right = '18px';
      box.style.bottom = '18px';
      box.style.zIndex = '100';
      box.style.maxWidth = '340px';
      box.style.padding = '12px 14px';
      box.style.borderRadius = '10px';
      box.style.fontWeight = '700';
      box.style.boxShadow = '0 12px 30px rgba(0,0,0,.18)';
      document.body.appendChild(box);
    }
    box.textContent = message;
    box.style.background = type === 'error' ? '#fee4e2' : '#e7f6ef';
    box.style.color = type === 'error' ? '#b42318' : '#16794e';
    box.hidden = false;
    clearTimeout(TCG._flashTimer);
    TCG._flashTimer = setTimeout(() => { box.hidden = true; }, 2500);
  };

  TCG.currentUserLabel = function () {
    const session = TCG.getSession();
    document.querySelectorAll('[data-session-label]').forEach(el => {
      el.textContent = session ? `${session.firstName} · ${session.role}` : 'Iniciar sesión';
      if (session && el.tagName === 'A') el.href = session.role === 'Cliente' ? `${TCG.siteRoot()}/cuenta.html` : `${TCG.siteRoot()}/admin/index.html`;
    });
  };

  TCG.requireRole = function (roles) {
    const session = TCG.getSession();
    if (!session || !roles.includes(session.role)) {
      window.location.href = `${TCG.siteRoot()}/login.html`;
      return null;
    }
    return session;
  };

  function setupNavigation() {
    const toggle = document.querySelector('[data-nav-toggle]');
    const nav = document.querySelector('[data-main-nav]');
    if (toggle && nav) {
      toggle.addEventListener('click', () => nav.classList.toggle('open'));
    }
  }

  function setupLogout() {
    document.querySelectorAll('[data-logout]').forEach(btn => {
      btn.addEventListener('click', event => {
        event.preventDefault();
        TCG.clearSession();
        window.location.href = `${TCG.siteRoot()}/login.html`;
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    TCG.ensureSeedData();
    TCG.updateCartCount();
    TCG.currentUserLabel();
    setupNavigation();
    setupLogout();
  });
})();
