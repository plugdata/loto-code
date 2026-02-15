// ─── Templates ──────────────────────────────

export function registerTemplate() {
  return `
    <div class="auth-wrapper">
      <div class="auth-card">
        <div class="auth-header">
          <div class="auth-logo">LK</div>
          <h1 class="auth-title">สมัครสมาชิก</h1>
          <p class="auth-subtitle">สร้างบัญชีผู้ใช้ใหม่</p>
        </div>

        <form id="register-form" class="auth-form">
          <div class="auth-form-group">
            <label><i class="bi bi-person-fill"></i> ชื่อผู้ใช้</label>
            <input type="text" id="reg-username" class="auth-input"
                   placeholder="กรอกชื่อผู้ใช้" autocomplete="username" required>
          </div>

          <div class="auth-form-group">
            <label><i class="bi bi-person-vcard-fill"></i> ชื่อที่แสดง</label>
            <input type="text" id="reg-displayname" class="auth-input"
                   placeholder="ชื่อที่ต้องการแสดงในระบบ">
          </div>

          <div class="auth-form-group">
            <label><i class="bi bi-lock-fill"></i> รหัสผ่าน</label>
            <div class="auth-password-wrapper">
              <input type="password" id="reg-password" class="auth-input"
                     placeholder="กรอกรหัสผ่าน (อย่างน้อย 4 ตัว)" autocomplete="new-password"
                     minlength="4" required>
              <button type="button" class="auth-toggle-pw" id="toggle-reg-pw">
                <i class="bi bi-eye"></i>
              </button>
            </div>
          </div>

          <div class="auth-form-group">
            <label><i class="bi bi-lock-fill"></i> ยืนยันรหัสผ่าน</label>
            <div class="auth-password-wrapper">
              <input type="password" id="reg-confirm" class="auth-input"
                     placeholder="กรอกรหัสผ่านอีกครั้ง" autocomplete="new-password"
                     minlength="4" required>
              <button type="button" class="auth-toggle-pw" id="toggle-reg-confirm">
                <i class="bi bi-eye"></i>
              </button>
            </div>
          </div>

          <div class="auth-form-group">
            <label><i class="bi bi-telephone-fill"></i> เบอร์โทร</label>
            <input type="tel" id="reg-phone" class="auth-input"
                   placeholder="เบอร์โทรศัพท์">
          </div>

          <div class="auth-form-group">
            <label><i class="bi bi-chat-dots-fill"></i> LINE ID</label>
            <input type="text" id="reg-lineid" class="auth-input"
                   placeholder="LINE ID">
          </div>

          <div class="auth-form-group">
            <label><i class="bi bi-person-badge-fill"></i> บทบาท</label>
            <select id="reg-role" class="auth-input auth-select">
              <option value="member">ลูกมือ (Member)</option>
              <option value="agent">ตัวแทน (Agent)</option>
              <option value="admin">แอดมิน (Admin)</option>
            </select>
          </div>

          <div id="register-error" class="auth-error" style="display:none;"></div>
          <div id="register-success" class="auth-success" style="display:none;"></div>

          <button type="submit" class="auth-btn auth-btn-register" id="btn-register">
            <i class="bi bi-person-plus-fill"></i> สมัครสมาชิก
          </button>
        </form>

        <div class="auth-footer">
          <span>มีบัญชีแล้ว?</span>
          <a href="#login" class="auth-link">เข้าสู่ระบบ</a>
        </div>
      </div>
    </div>
  `;
}
