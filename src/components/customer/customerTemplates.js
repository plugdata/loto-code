// ===== CUSTOMER TEMPLATES - ส่วนแสดงผล UI =====

export function errorTemplate(message) {
  return `
    <div class="settings-container">
      <div class="settings-card" style="border-top: 4px solid var(--color-error); text-align: center; padding: 40px;">
        <i class="bi bi-shield-lock" style="font-size: 3rem; color: var(--color-error); margin-bottom: 20px; display: block;"></i>
        <h2 style="color: var(--color-error);">ไม่สามารถดึงข้อมูลได้</h2>
        <p style="color: var(--text-muted); margin-bottom: 20px;">${message}</p>
        <button class="btn-add" onclick="window.location.reload()" style="padding: 10px 30px;">
          <i class="bi bi-arrow-clockwise"></i> ลองใหม่อีกครั้ง
        </button>
      </div>
    </div>
  `;
}

function customerTableTemplate(customers) {
  return customers.map((c, i) => `
    <tr>
      <td>${i + 1}</td>
      <td style="font-weight: 600;">${c.name}</td>
      <td>
        ${c.id !== 0
          ? `<button class="btn-action btn-delete" data-delete-customer="${c.id}">
               <i class="bi bi-trash"></i> ลบ
             </button>`
          : '<span style="color: var(--text-muted); font-size: 0.75rem;">ค่าเริ่มต้น</span>'}
      </td>
    </tr>
  `).join('');
}

function addCustomerModalTemplate() {
  return `
    <div class="modal-overlay" id="modal-add-customer">
      <div class="modal-content">
        <div class="modal-header">
          <h3><i class="bi bi-person-plus-fill"></i> เพิ่มลูกค้า</h3>
          <button class="modal-close" id="modal-close-customer">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>ชื่อลูกค้า</label>
            <input type="text" class="form-control" id="new-customer-name" placeholder="ชื่อลูกค้า">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-modal secondary" id="btn-cancel-customer">ยกเลิก</button>
          <button class="btn-modal primary" id="btn-save-customer">
            <i class="bi bi-check-lg"></i> บันทึก
          </button>
        </div>
      </div>
    </div>
  `;
}

export function pageTemplate(customers) {
  return `
    <div class="settings-container">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
        <h2 style="color: #1b5e20; display: flex; align-items: center; gap: 10px;">
          <i class="bi bi-person-lines-fill"></i> จัดการลูกค้า
        </h2>
        <button class="btn-add" id="btn-add-customer" style="padding: 8px 20px;">
          <i class="bi bi-person-plus-fill"></i> เพิ่มลูกค้า
        </button>
      </div>

      <div class="settings-card">
        <div class="settings-card-header">
          <h3><i class="bi bi-table"></i> รายชื่อลูกค้า</h3>
          <span style="font-size: 0.75rem; color: var(--text-muted);">${customers.length} ราย</span>
        </div>
        <div style="overflow-x: auto;">
          <table class="user-table">
            <thead>
              <tr>
                <th>#</th>
                <th>ชื่อลูกค้า</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>${customerTableTemplate(customers)}</tbody>
          </table>
        </div>
      </div>
    </div>
    ${addCustomerModalTemplate()}
  `;
}
