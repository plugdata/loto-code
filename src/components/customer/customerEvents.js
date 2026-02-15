// ===== CUSTOMER EVENTS - ส่วน Event Binding =====

import { createModalHandlers, handleSaveCustomer, handleDeleteCustomer } from './customerHandlers.js';

export function initCustomerEvents(container, renderCallback) {
  const modal = document.getElementById('modal-add-customer');
  const { openModal, closeModal, closeOnBackdrop } = createModalHandlers(modal);

  document.getElementById('btn-add-customer')?.addEventListener('click', openModal);
  document.getElementById('modal-close-customer')?.addEventListener('click', closeModal);
  document.getElementById('btn-cancel-customer')?.addEventListener('click', closeModal);
  modal?.addEventListener('click', closeOnBackdrop);

  document.getElementById('btn-save-customer')?.addEventListener('click', () => {
    handleSaveCustomer(container, modal, renderCallback);
  });

  container.querySelectorAll('[data-delete-customer]').forEach(btn => {
    btn.addEventListener('click', () => {
      handleDeleteCustomer(parseInt(btn.dataset.deleteCustomer), container, renderCallback);
    });
  });
}
