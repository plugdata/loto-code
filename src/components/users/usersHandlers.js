// ─── Event Handlers ─────────────────────────

import { showToast } from '../../js/toast.js';
import { api } from '../../api/apiClient.js';

export function getRoleLabel(role) {
  const labels = { admin: 'ADMIN', agent: 'AGENT', member: 'ลูกมือ' };
  return labels[role] || role;
}

export function isAdmin() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role === 'admin';
  } catch { return false; }
}

export function createModalHandlers(modal) {
  const openModal = () => modal?.classList.add('show');
  const closeModal = () => modal?.classList.remove('show');
  const closeOnBackdrop = (e) => { if (e.target === modal) closeModal(); };
  return { openModal, closeModal, closeOnBackdrop };
}

export async function handleSaveUser(container, modal, renderCallback) {
  const username = document.getElementById('new-username')?.value?.trim();
  const displayName = document.getElementById('new-displayname')?.value?.trim();
  const password = document.getElementById('new-password')?.value;
  const role = document.getElementById('new-role')?.value;

  if (!username || !displayName) {
    showToast('กรุณากรอกข้อมูลให้ครบ', 'error');
    return;
  }

  try {
    await api.users.add({ username, displayName, password: password || username, role });
    modal?.classList.remove('show');
    showToast(`เพิ่มผู้ใช้ "${displayName}" แล้ว`, 'success');
    renderCallback(container);
  } catch (err) {
    showToast(err.message || 'ไม่สามารถเพิ่มผู้ใช้ได้', 'error');
  }
}

export async function handleDeleteUser(id, users, container, renderCallback) {
  const user = users.find(u => u.id === id);
  if (!confirm(`ยืนยันลบผู้ใช้ "${user?.displayName}"?`)) return;

  try {
    await api.users.delete(id);
    showToast('ลบผู้ใช้แล้ว', 'warning');
    renderCallback(container);
  } catch (err) {
    showToast(err.message || 'ไม่สามารถลบผู้ใช้ได้', 'error');
  }
}
