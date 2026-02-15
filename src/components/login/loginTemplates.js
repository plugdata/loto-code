// ─── Templates ──────────────────────────────

export function loginTemplate() {
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
