// ─── Event Handlers ─────────────────────────

import { api } from '../../api/apiClient.js';
import Swal from 'sweetalert2';

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

export async function handleLoginSubmit(e) {
  e.preventDefault();

  const errorEl = document.getElementById('login-error');
  errorEl.style.display = 'none';

  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;

  if (!username || !password) {
    showError(errorEl, 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
    return;
  }

  const btn = document.getElementById('btn-login');
  btn.disabled = true;
  btn.innerHTML = '<i class="bi bi-hourglass-split"></i> กำลังเข้าสู่ระบบ...';

  try {
    const res = await api.auth.login(username, password);
    if (res.data?.user) {
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    await Swal.fire({
      icon: 'success',
      title: 'เข้าสู่หน้าระบบเรียบร้อยแล้ว',
      timer: 1500,
      showConfirmButton: false,
    });
    window.location.hash = '#key';
    window.location.reload();
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'รหัสผ่านไม่ถูกต้อง',
      text: err.message || 'กรุณาตรวจสอบชื่อผู้ใช้และรหัสผ่านอีกครั้ง',
      confirmButtonText: 'ตกลง',
    });
    btn.disabled = false;
    btn.innerHTML = '<i class="bi bi-box-arrow-in-right"></i> เข้าสู่ระบบ';
  }
}
