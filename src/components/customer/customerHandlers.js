// ===== CUSTOMER HANDLERS - ส่วนจัดการ Event Handlers =====

import { showToast } from '../../js/toast.js';
import { api } from '../../api/apiClient.js';

export function createModalHandlers(modal) {
  const openModal = () => modal?.classList.add('show');
  const closeModal = () => modal?.classList.remove('show');
  const closeOnBackdrop = (e) => { if (e.target === modal) closeModal(); };
  return { openModal, closeModal, closeOnBackdrop };
}

export async function handleSaveCustomer(container, modal, renderCallback) {
  const name = document.getElementById('new-customer-name')?.value?.trim();
  if (!name) {
    showToast('กรุณากรอกชื่อลูกค้า', 'error');
    return;
  }
  await api.customers.add({ name });
  modal?.classList.remove('show');
  showToast(`เพิ่มลูกค้า "${name}" แล้ว`, 'success');
  renderCallback(container);
}

export async function handleDeleteCustomer(id, container, renderCallback) {
  await api.customers.delete(id);
  showToast('ลบลูกค้าแล้ว', 'warning');
  renderCallback(container);
}
