// ===== LOGIN PAGE =====

// ─── Imports ─────────────────────────────────
import { api } from '../api/apiClient.js';
import { showToast } from '../js/toast.js';

// ─── Templates ───────────────────────────────

function loginTemplate() {
  return `
    <div class="auth-wrapper">
      <div class="auth-card">
        <div class="auth-header">
          <div class="auth-logo">LK</div>
          <h1 class="auth-title">ระบบคีย์หวย</h1>
          <p class="auth-subtitle">Lotto Key System</p>
        </div>

        <form id="login-form" class="auth-form">
          <div class="auth-form-group">
            <label><i class="bi bi-person-fill"></i> ชื่อผู้ใช้</label>
            <input type="text" id="login-username" class="auth-input"
                   placeholder="กรอกชื่อผู้ใช้" autocomplete="username" required>
          </div>

          <div class="auth-form-group">
            <label><i class="bi bi-lock-fill"></i> รหัสผ่าน</label>
            <div class="auth-password-wrapper">
              <input type="password" id="login-password" class="auth-input"
                     placeholder="กรอกรหัสผ่าน" autocomplete="current-password" required>
              <button type="button" class="auth-toggle-pw" id="toggle-password">
                <i class="bi bi-eye"></i>
              </button>
            </div>
          </div>

          <div id="login-error" class="auth-error" style="display:none;"></div>

          <button type="submit" class="auth-btn" id="btn-login">
            <i class="bi bi-box-arrow-in-right"></i> เข้าสู่ระบบ
          </button>
        </form>

        <div class="auth-footer">
          <span>ยังไม่มีบัญชี?</span>
          <a href="#register" class="auth-link">สมัครสมาชิก</a>
        </div>
      </div>
    </div>
  `;
}

// ─── Utilities ───────────────────────────────

function togglePasswordVisibility(btnId, inputId) {
  const btn = document.getElementById(btnId);
  const input = document.getElementById(inputId);
  btn?.addEventListener('click', () => {
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    btn.innerHTML = `<i class="bi bi-eye${show ? '-slash' : ''}"></i>`;
  });
}

function showError(el, message) {
  el.textContent = message;
  el.style.display = 'block';
}

// ─── Event Handlers ──────────────────────────

async function handleLoginSubmit(e) {
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
    window.location.hash = '#key';
    window.location.reload();
  } catch (err) {
    showError(errorEl, err.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    btn.disabled = false;
    btn.innerHTML = '<i class="bi bi-box-arrow-in-right"></i> เข้าสู่ระบบ';
  }
}

// ─── Event Binding ───────────────────────────

function initLoginEvents() {
  togglePasswordVisibility('toggle-password', 'login-password');
  document.getElementById('login-form')?.addEventListener('submit', handleLoginSubmit);
}

// ─── Main Render (Export) ────────────────────

export function renderLoginPage(container) {
  container.innerHTML = loginTemplate();
  initLoginEvents();
}
