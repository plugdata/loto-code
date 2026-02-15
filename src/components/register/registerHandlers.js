// ─── Event Handlers ─────────────────────────

import { api } from '../../api/apiClient.js';
import { navigate } from '../../js/router.js';

export function togglePasswordVisibility(btnId, inputId) {
  const btn = document.getElementById(btnId);
  const input = document.getElementById(inputId);
  btn?.addEventListener('click', () => {
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    btn.innerHTML = `<i class="bi bi-eye${show ? '-slash' : ''}"></i>`;
  });
}

export function showError(el, message) {
  el.textContent = message;
  el.style.display = 'block';
}

export function getFormValues() {
  return {
    username: document.getElementById('reg-username').value.trim(),
    displayName: document.getElementById('reg-displayname').value.trim(),
    password: document.getElementById('reg-password').value,
    confirmPassword: document.getElementById('reg-confirm').value,
    phone: document.getElementById('reg-phone').value.trim(),
    lineId: document.getElementById('reg-lineid').value.trim(),
    role: document.getElementById('reg-role').value,
  };
}

export function validateForm({ username, password, confirmPassword }) {
  if (!username || !password || !confirmPassword) return 'กรุณากรอกข้อมูลให้ครบทุกช่อง';
  if (password.length < 4) return 'รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร';
  if (password !== confirmPassword) return 'รหัสผ่านไม่ตรงกัน';
  return null;
}

export async function handleRegisterSubmit(e) {
  e.preventDefault();

  const errorEl = document.getElementById('register-error');
  const successEl = document.getElementById('register-success');
  errorEl.style.display = 'none';
  successEl.style.display = 'none';

  const form = getFormValues();
  const validationError = validateForm(form);

  if (validationError) {
    showError(errorEl, validationError);
    return;
  }

  const btn = document.getElementById('btn-register');
  btn.disabled = true;
  btn.innerHTML = '<i class="bi bi-hourglass-split"></i> กำลังสมัคร...';

  try {
    const { confirmPassword, ...payload } = form;
    await api.auth.register(payload);
    successEl.textContent = 'สมัครสมาชิกสำเร็จ! กำลังไปหน้าเข้าสู่ระบบ...';
    successEl.style.display = 'block';
    setTimeout(() => navigate('login'), 1500);
  } catch (err) {
    showError(errorEl, err.message || 'ไม่สามารถสมัครสมาชิกได้');
    btn.disabled = false;
    btn.innerHTML = '<i class="bi bi-person-plus-fill"></i> สมัครสมาชิก';
  }
}
