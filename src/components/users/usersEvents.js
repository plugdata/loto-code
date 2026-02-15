// ─── Event Binding ──────────────────────────

import { createModalHandlers, handleSaveUser, handleDeleteUser } from './usersHandlers.js';

export function initUserEvents(container, users, renderCallback) {
  const modal = document.getElementById('modal-add-user');
  const { openModal, closeModal, closeOnBackdrop } = createModalHandlers(modal);

  document.getElementById('btn-add-user')?.addEventListener('click', openModal);
  document.getElementById('modal-close')?.addEventListener('click', closeModal);
  document.getElementById('btn-cancel-user')?.addEventListener('click', closeModal);
  modal?.addEventListener('click', closeOnBackdrop);

  document.getElementById('btn-save-user')?.addEventListener('click', () => {
    handleSaveUser(container, modal, renderCallback);
  });

  container.querySelectorAll('[data-delete-user]').forEach(btn => {
    btn.addEventListener('click', () => {
      handleDeleteUser(btn.dataset.deleteUser, users, container, renderCallback);
    });
  });
}
