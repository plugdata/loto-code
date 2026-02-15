// ─── Templates ──────────────────────────────

import { getRoleLabel } from './usersHandlers.js';

export function accessDeniedTemplate() {
  return `
    <div class="settings-container">
      <div class="settings-card" style="border-top: 4px solid var(--color-danger); text-align: center; padding: 40px;">
        <i class="bi bi-shield-lock" style="font-size: 3rem; color: var(--color-danger); margin-bottom: 20px; display: block;"></i>
        <h2 style="color: var(--color-danger);">ไม่มีสิทธิ์เข้าถึง</h2>
        <p style="color: var(--text-muted); margin-bottom: 20px;">หน้านี้สำหรับผู้ดูแลระบบ (Admin) เท่านั้น</p>
      </div>
    </div>
  `;
}

export function errorTemplate(message) {
  return `
    <div class="settings-container">
      <div class="settings-card" style="border-top: 4px solid var(--color-error); text-align: center; padding: 40px;">
        <i class="bi bi-shield-lock" style="font-size: 3rem; color: var(--color-error); margin-bottom: 20px; display: block;"></i>
        <h2 style="color: var(--color-error);">ไม่สามารถดึงข้อมูลได้</h2>
        <p style="color: var(--text-muted); margin-bottom: 20px;">${message}</p>
        <button class="btn-add" onclick="window.location.hash='#login';window.location.reload();">
          <i class="bi bi-box-arrow-in-right"></i> ไปหน้าเข้าสู่ระบบ
        </button>
      </div>
    </div>
  `;
}

export function summaryCardsTemplate(users) {
  return `
    <div class="summary-grid" style="grid-template-columns: repeat(3, 1fr); margin-bottom: 24px;">
      <div class="summary-card">
        <div class="icon" style="color: var(--color-accent);"><i class="bi bi-people-fill"></i></div>
        <div class="value">${users.length}</div>
        <div class="label">ผู้ใช้ทั้งหมด</div>
      </div>
      <div class="summary-card">
        <div class="icon" style="color: var(--color-success);"><i class="bi bi-circle-fill"></i></div>
        <div class="value">${users.filter(u => u.status === 'online').length}</div>
        <div class="label">ออนไลน์</div>
      </div>
      <div class="summary-card">
        <div class="icon" style="color: var(--color-info);"><i class="bi bi-person-badge"></i></div>
        <div class="value">${users.filter(u => u.role === 'member').length}</div>
        <div class="label">ลูกมือ</div>
      </div>
    </div>
  `;
}

export function usersTableTemplate(users) {
  return users.map((u, i) => `
    <tr>
      <td>${i + 1}</td>
      <td style="font-weight: 600;">${u.username}</td>
      <td>${u.displayName}</td>
      <td><span class="role-badge ${u.role}">${getRoleLabel(u.role)}</span></td>
      <td>
        <span class="status-dot ${u.status}"></span>
        <span>${u.status === 'online' ? 'ออนไลน์' : 'ออฟไลน์'}</span>
      </td>
      <td style="color: var(--text-muted); font-size: 0.85rem;">
        ${u.createdAt ? new Date(u.createdAt).toLocaleDateString('th-TH') : '-'}
      </td>
      <td>
        ${u.role !== 'admin'
          ? `<button class="btn-action btn-edit" data-edit-user="${u.id}" style="margin-right: 4px;">
               <i class="bi bi-pencil"></i>
             </button>
             <button class="btn-action btn-delete" data-delete-user="${u.id}">
               <i class="bi bi-trash"></i>
             </button>`
          : '<span style="color: var(--text-muted); font-size: 0.75rem;">-</span>'}
      </td>
    </tr>
  `).join('');
}

export function permissionsInfoTemplate() {
  return `
    <div class="settings-card">
      <div class="settings-card-header">
        <h3><i class="bi bi-shield-lock-fill"></i> สิทธิ์ตามบทบาท</h3>
      </div>
      <div class="settings-card-body">
        <div class="setting-row">
          <span class="setting-label">
            <span class="role-badge admin" style="margin-right: 8px;">ADMIN</span> แอดมิน
          </span>
          <span style="font-size: 0.8rem; color: var(--text-muted);">จัดการทุกอย่าง, ตั้งค่า, ดูรายงาน</span>
        </div>
        <div class="setting-row">
          <span class="setting-label">
            <span class="role-badge agent" style="margin-right: 8px;">AGENT</span> ตัวแทน
          </span>
          <span style="font-size: 0.8rem; color: var(--text-muted);">คีย์หวย, ดูสรุป, จัดการลูกค้า</span>
        </div>
        <div class="setting-row">
          <span class="setting-label">
            <span class="role-badge member" style="margin-right: 8px;">ลูกมือ</span> ลูกมือ
          </span>
          <span style="font-size: 0.8rem; color: var(--text-muted);">คีย์หวยอย่างเดียว, ไม่เห็นตั้งค่า</span>
        </div>
      </div>
    </div>
  `;
}

export function addUserModalTemplate() {
  return `
    <div class="modal-overlay" id="modal-add-user">
      <div class="modal-content">
        <div class="modal-header">
          <h3><i class="bi bi-person-plus-fill"></i> เพิ่มลูกมือ</h3>
          <button class="modal-close" id="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>ชื่อผู้ใช้ (Username)</label>
            <input type="text" class="form-control" id="new-username" placeholder="username">
          </div>
          <div class="form-group">
            <label>ชื่อแสดง (Display Name)</label>
            <input type="text" class="form-control" id="new-displayname" placeholder="ชื่อ-นามสกุล">
          </div>
          <div class="form-group">
            <label>รหัสผ่าน</label>
            <input type="password" class="form-control" id="new-password" placeholder="รหัสผ่าน">
          </div>
          <div class="form-group">
            <label>บทบาท</label>
            <select class="form-control" id="new-role">
              <option value="member">ลูกมือ</option>
              <option value="agent">ตัวแทน (Agent)</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-modal secondary" id="btn-cancel-user">ยกเลิก</button>
          <button class="btn-modal primary" id="btn-save-user">
            <i class="bi bi-check-lg"></i> บันทึก
          </button>
        </div>
      </div>
    </div>
  `;
}

export function pageTemplate(users) {
  return `
    <div class="settings-container">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
        <h2 style="color: var(--color-accent); display: flex; align-items: center; gap: 10px;">
          <i class="bi bi-people-fill"></i> จัดการผู้ใช้ (ลูกมือ)
        </h2>
        <button class="btn-add" id="btn-add-user">
          <i class="bi bi-person-plus-fill"></i> เพิ่มลูกมือ
        </button>
      </div>

      ${summaryCardsTemplate(users)}

      <div class="settings-card">
        <div class="settings-card-header">
          <h3><i class="bi bi-table"></i> รายชื่อผู้ใช้</h3>
        </div>
        <div style="overflow-x: auto;">
          <table class="user-table">
            <thead>
              <tr>
                <th>#</th>
                <th>ชื่อผู้ใช้</th>
                <th>ชื่อแสดง</th>
                <th>บทบาท</th>
                <th>สถานะ</th>
                <th>วันที่สร้าง</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>${usersTableTemplate(users)}</tbody>
          </table>
        </div>
      </div>

      ${permissionsInfoTemplate()}
    </div>
    ${addUserModalTemplate()}
  `;
}
