(function () {
  'use strict';

  function setError(input, message) {
    const group = input.closest('.form-group');
    if (!group) return;
    const error = group.querySelector('.error-text');
    input.classList.toggle('field-error', Boolean(message));
    if (error) error.textContent = message || '';
  }

  function required(input, label) {
    if (!String(input.value || '').trim()) return `${label} es requerido.`;
    return '';
  }

  function maxLength(input, label, max) {
    if (String(input.value || '').length > max) return `${label} permite máximo ${max} caracteres.`;
    return '';
  }

  function validateEmail(input, isRequired) {
    const value = input.value.trim();
    if (!value) return isRequired ? 'Correo es requerido.' : '';
    if (value.length > 100) return 'Correo permite máximo 100 caracteres.';
    if (!TCG.allowedEmail(value)) return 'Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.';
    return '';
  }

  function validatePassword(input) {
    const value = input.value;
    if (!value) return 'Contraseña es requerida.';
    if (value.length < 4 || value.length > 10) return 'Contraseña debe tener entre 4 y 10 caracteres.';
    return '';
  }

  function showFormMessage(form, message, type) {
    const box = form.querySelector('.form-message');
    if (!box) return;
    box.className = `form-message ${type}`;
    box.textContent = message;
  }

  function fillRegions(form) {
    const region = form.querySelector('[name="region"]');
    const commune = form.querySelector('[name="commune"]');
    if (!region || !commune) return;

    region.innerHTML = '<option value="">Selecciona una región</option>' + TCG_REGIONS.map(item => `<option value="${item.region}">${item.region}</option>`).join('');

    function updateCommunes(selectedCommune) {
      const found = TCG_REGIONS.find(item => item.region === region.value);
      commune.innerHTML = '<option value="">Selecciona una comuna</option>' + (found ? found.communes.map(name => `<option value="${name}">${name}</option>`).join('') : '');
      if (selectedCommune) commune.value = selectedCommune;
    }

    region.addEventListener('change', () => updateCommunes(''));
    updateCommunes('');
  }

  function validateUserForm(form, adminMode) {
    let valid = true;
    const fields = {
      run: form.elements.run,
      firstName: form.elements.firstName,
      lastName: form.elements.lastName,
      email: form.elements.email,
      password: form.elements.password,
      region: form.elements.region,
      commune: form.elements.commune,
      address: form.elements.address
    };

    let msg = required(fields.run, 'RUN');
    if (!msg && (fields.run.value.length < 7 || fields.run.value.length > 9)) msg = 'RUN debe tener entre 7 y 9 caracteres.';
    if (!msg && !TCG.validateRun(fields.run.value)) msg = 'RUN no válido. Escríbelo sin puntos ni guion, por ejemplo 19011022K.';
    setError(fields.run, msg); valid = valid && !msg;

    msg = required(fields.firstName, 'Nombre') || maxLength(fields.firstName, 'Nombre', 50);
    setError(fields.firstName, msg); valid = valid && !msg;

    msg = required(fields.lastName, 'Apellidos') || maxLength(fields.lastName, 'Apellidos', 100);
    setError(fields.lastName, msg); valid = valid && !msg;

    msg = validateEmail(fields.email, true);
    setError(fields.email, msg); valid = valid && !msg;

    if (fields.password) {
      msg = validatePassword(fields.password);
      setError(fields.password, msg); valid = valid && !msg;
    }

    msg = required(fields.region, 'Región'); setError(fields.region, msg); valid = valid && !msg;
    msg = required(fields.commune, 'Comuna'); setError(fields.commune, msg); valid = valid && !msg;
    msg = required(fields.address, 'Dirección') || maxLength(fields.address, 'Dirección', 300);
    setError(fields.address, msg); valid = valid && !msg;

    if (adminMode && form.elements.role) {
      msg = required(form.elements.role, 'Tipo de usuario');
      setError(form.elements.role, msg); valid = valid && !msg;
    }
    return valid;
  }

  function setupRealtime(form, validator) {
    form.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('blur', () => validator(form, true));
      input.addEventListener('input', () => {
        if (input.classList.contains('field-error')) validator(form, true);
      });
    });
  }

  function setupLogin() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    function validate() {
      const emailMessage = validateEmail(form.elements.email, true);
      const passwordMessage = validatePassword(form.elements.password);
      setError(form.elements.email, emailMessage);
      setError(form.elements.password, passwordMessage);
      return !emailMessage && !passwordMessage;
    }
    setupRealtime(form, validate);

    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!validate()) return showFormMessage(form, 'Corrige los campos marcados antes de continuar.', 'error');
      const users = TCG.getUsers();
      const user = users.find(item => item.email.toLowerCase() === form.elements.email.value.trim().toLowerCase() && item.password === form.elements.password.value);
      if (!user) return showFormMessage(form, 'Correo o contraseña no coinciden con un usuario registrado.', 'error');
      TCG.setSession(user);
      showFormMessage(form, `Sesión iniciada como ${user.role}.`, 'success');
      setTimeout(() => {
        window.location.href = user.role === 'Cliente' ? 'index.html' : 'admin/index.html';
      }, 500);
    });
  }

  function setupRegister() {
    const form = document.getElementById('registerForm');
    if (!form) return;
    fillRegions(form);
    setupRealtime(form, () => validateUserForm(form, false));

    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!validateUserForm(form, false)) return showFormMessage(form, 'Corrige los campos marcados antes de registrar.', 'error');
      const users = TCG.getUsers();
      const email = form.elements.email.value.trim().toLowerCase();
      const run = form.elements.run.value.trim().toUpperCase();
      if (users.some(user => user.email.toLowerCase() === email)) return showFormMessage(form, 'Ya existe un usuario con ese correo.', 'error');
      if (users.some(user => user.run.toUpperCase() === run)) return showFormMessage(form, 'Ya existe un usuario con ese RUN.', 'error');

      users.push({
        run,
        firstName: form.elements.firstName.value.trim(),
        lastName: form.elements.lastName.value.trim(),
        email,
        birthDate: form.elements.birthDate.value,
        role: 'Cliente',
        region: form.elements.region.value,
        commune: form.elements.commune.value,
        address: form.elements.address.value.trim(),
        password: form.elements.password.value
      });
      TCG.saveUsers(users);
      form.reset();
      fillRegions(form);
      showFormMessage(form, 'Usuario registrado correctamente. Ya puedes iniciar sesión.', 'success');
    });
  }

  function setupContact() {
  const form = document.getElementById('contactForm');

  if (!form) return;

  function validate() {
    let valid = true;

    let msg =
      required(form.elements.name, 'Nombre') ||
      maxLength(form.elements.name, 'Nombre', 100);

    setError(form.elements.name, msg);
    valid = valid && !msg;


    msg = validateEmail(form.elements.email, false);

    setError(form.elements.email, msg);
    valid = valid && !msg;


    msg =
      required(form.elements.comment, 'Comentario') ||
      maxLength(form.elements.comment, 'Comentario', 500);

    setError(form.elements.comment, msg);
    valid = valid && !msg;


    return valid;
  }


  setupRealtime(form, validate);


  form.addEventListener('submit', async event => {

    // Evita que la página se recargue
    event.preventDefault();


    // VALIDACIONES
    if (!validate()) {

      showFormMessage(
        form,
        'Corrige los campos marcados antes de enviar.',
        'error'
      );

      return;
    }


    const button = form.querySelector(
      'button[type="submit"]'
    );


    // Deshabilitar mientras se envía
    if (button) {
      button.disabled = true;
      button.textContent = 'Enviando...';
    }


    showFormMessage(
      form,
      'Enviando mensaje...',
      'success'
    );


    // Recoger información del formulario
    const formData = new FormData(form);


    try {

      // ENVÍO REAL A FORMSPREE
      const response = await fetch(
        form.action,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        }
      );


      // SI EL CORREO SE ENVIÓ
      if (response.ok) {

        form.reset();

        showFormMessage(
          form,
          'Mensaje enviado correctamente. ¡Gracias por contactarnos!',
          'success'
        );

      } else {

        showFormMessage(
          form,
          'No se pudo enviar el mensaje. Intenta nuevamente.',
          'error'
        );

      }

    } catch (error) {

      console.error(
        'Error al enviar el formulario:',
        error
      );

      showFormMessage(
        form,
        'Ocurrió un error al enviar el mensaje.',
        'error'
      );

    } finally {

      // Volver a habilitar botón
      if (button) {
        button.disabled = false;
        button.textContent = 'Enviar mensaje';
      }

    }

  });
}
})();
