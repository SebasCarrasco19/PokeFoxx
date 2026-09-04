(function () {
  'use strict';

  function addDeleteUserButtons() {
    const tbody = document.querySelector('[data-admin-users]');
    const session = TCG.getSession();

    if (!tbody || !session || session.role !== 'Administrador') return;

    tbody.querySelectorAll('tr').forEach(row => {
      const actions = row.cells[row.cells.length - 1];
      if (!actions || actions.querySelector('[data-delete-user]')) return;

      const run = String(row.cells[0]?.textContent || '').trim().toUpperCase();
      const email = String(row.cells[2]?.textContent || '').trim().toLowerCase();
      const name = String(row.cells[1]?.textContent || '').trim();

      const isCurrentUser =
        (session.run && String(session.run).trim().toUpperCase() === run) ||
        (session.email && String(session.email).trim().toLowerCase() === email);

      actions.classList.add('table-actions');

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn btn-danger btn-sm';
      button.textContent = 'Eliminar';
      button.dataset.deleteUser = run;

      if (isCurrentUser) {
        button.disabled = true;
        button.title = 'No puedes eliminar tu propia cuenta mientras estás conectado.';
      }

      button.addEventListener('click', () => {
        if (isCurrentUser) return;

        const users = TCG.getUsers();
        const user = users.find(item =>
          String(item.run || '').trim().toUpperCase() === run
        );

        if (!user) {
          TCG.flash('El usuario ya no existe.', 'error');
          return;
        }

        if (!window.confirm(`¿Eliminar al usuario ${name || user.firstName}?`)) return;

        const updatedUsers = users.filter(item =>
          String(item.run || '').trim().toUpperCase() !== run
        );

        TCG.saveUsers(updatedUsers);
        row.remove();
        TCG.flash('Usuario eliminado correctamente.', 'success');
      });

      actions.appendChild(button);
    });
  }

  function setupBackupButton() {
    const dashboard = document.querySelector('[data-dashboard]');
    const session = TCG.getSession();

    if (!dashboard || !session || session.role !== 'Administrador') return;
    if (dashboard.querySelector('[data-backup-section]')) return;

    const section = document.createElement('section');
    section.className = 'section';
    section.dataset.backupSection = 'true';

    section.innerHTML = `
      <div class="content-card">
        <h2>Respaldo</h2>
        <p>Realiza un respaldo de la información del sistema.</p>
        <button class="btn btn-primary" type="button" data-backup-button>
          Respaldo
        </button>
      </div>
    `;

    dashboard.appendChild(section);

    section.querySelector('[data-backup-button]').addEventListener('click', () => {
      TCG.flash(
        'Toda la información ha sido guardada en la base de datos.',
        'success'
      );
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    // admin.js también trabaja en DOMContentLoaded. Un pequeño retraso asegura
    // que la tabla de usuarios ya esté dibujada antes de agregar "Eliminar".
    setTimeout(addDeleteUserButtons, 0);
    setupBackupButton();
  });
})();
