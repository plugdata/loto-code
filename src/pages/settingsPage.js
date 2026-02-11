// ===== SETTINGS PAGE - ตั้งค่าระบบ =====
import { api } from '../api/apiClient.js';
import { showToast } from '../js/toast.js';

let settings = {};
let lotteryTypes = [];
let rounds = [];

// แปลงวันที่เป็นภาษาไทย (พ.ศ.)
function formatThaiDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' });
}

export async function renderSettingsPage(container) {
  // Admin-only guard
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'admin') {
      container.innerHTML = `
        <div class="settings-container">
          <div class="settings-card" style="border-top: 4px solid var(--color-danger); text-align: center; padding: 40px;">
            <i class="bi bi-shield-lock" style="font-size: 3rem; color: var(--color-danger); margin-bottom: 20px; display: block;"></i>
            <h2 style="color: var(--color-danger);">ไม่มีสิทธิ์เข้าถึง</h2>
            <p style="color: var(--text-muted); margin-bottom: 20px;">หน้านี้สำหรับผู้ดูแลระบบ (Admin) เท่านั้น</p>
          </div>
        </div>
      `;
      return;
    }
  } catch {}

  const [res, ltRes, roundsRes] = await Promise.all([
    api.settings.get(),
    api.lotteryTypes.get().catch(() => ({ data: [] })),
    api.rounds.get().catch(() => ({ data: [] })),
  ]);
  lotteryTypes = ltRes.data || [];
  rounds = roundsRes.data || [];

  if (!res || !res.success || !res.data) {
    container.innerHTML = `
      <div class="settings-container">
        <div class="settings-card" style="border-top: 4px solid var(--color-danger); text-align: center; padding: 40px;">
          <i class="bi bi-shield-lock" style="font-size: 3rem; color: var(--color-danger); margin-bottom: 20px; display: block;"></i>
          <h2 style="color: var(--color-danger);">ไม่สามารถเข้าถึงการตั้งค่าได้</h2>
          <p style="color: var(--text-muted); margin-bottom: 20px;">
            ${res?.message === 'Unauthorized' ? 'กรุณาเข้าสู่ระบบด้วยสิทธิ์ผู้ดูแลระบบ' : res?.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์'}
          </p>
          <button class="btn-add" onclick="window.location.reload()" style="justify-content: center; margin: 0 auto;">
            <i class="bi bi-arrow-clockwise"></i> ลองใหม่อีกครั้ง
          </button>
        </div>
      </div>
    `;
    return;
  }

  settings = res.data;

  container.innerHTML = `
    <div class="settings-container">
      <h2 style="color: var(--color-accent); margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
        <i class="bi bi-gear-fill"></i> ตั้งค่าระบบ
      </h2>

      <!-- จัดการงวดหวย -->
      <div class="settings-card" style="border-top: 3px solid var(--color-primary);">
        <div class="settings-card-header">
          <h3><i class="bi bi-calendar-event-fill"></i> ประจำงวดที่</h3>
          <span style="font-size: 0.75rem; color: var(--color-primary);">
            ${rounds.filter(r => r.status === 'open').length} งวดเปิดอยู่
          </span>
        </div>
        <div class="settings-card-body">
          <!-- สร้างงวดใหม่ -->
          <div style="padding: 16px; background: var(--color-primary-subtle, #f0f8f4); border-radius: var(--radius-md); margin-bottom: 20px;">
            <h4 style="font-size: 0.9rem; font-weight: 700; color: var(--color-primary-dark); margin-bottom: 12px;">
              <i class="bi bi-plus-circle-fill"></i> เปิดงวดใหม่
            </h4>
            <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: flex-end;">
              <div class="form-group" style="margin-bottom: 0;">
                <label style="font-size: 0.7rem;">วันที่งวด</label>
                <div style="position: relative;">
                  <input type="date" class="setting-input" id="round-date" value="${new Date().toISOString().slice(0,10)}" style="width: 160px; opacity: 0; position: absolute; top: 0; left: 0; width: 100%; height: 100%; cursor: pointer;">
                  <div class="setting-input" id="round-date-thai" style="width: 160px; pointer-events: none; white-space: nowrap; font-size: 0.85rem;">
                    ${formatThaiDate(new Date().toISOString().slice(0,10))}
                  </div>
                </div>
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label style="font-size: 0.7rem;">ประเภทหวย</label>
                <select class="setting-input" id="round-lt-select" style="width: 160px;">
                  <option value="" disabled selected>-- เลือกประเภท --</option>
                  ${lotteryTypes.map(lt => `<option value="${lt.id}">${lt.name}</option>`).join('')}
                </select>
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label style="font-size: 0.7rem;">งวดที่</label>
                <input type="number" class="setting-input" id="round-number" placeholder="เลือกประเภทก่อน" style="width: 100px;" min="1" disabled>
                <div id="round-number-hint" style="font-size: 0.65rem; color: var(--text-muted); margin-top: 2px;"></div>
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label style="font-size: 0.7rem;">หมายเหตุ</label>
                <input type="text" class="setting-input" id="round-note" placeholder="(ไม่จำเป็น)" style="width: 160px;">
              </div>
              <button class="btn-add" id="btn-create-round" style="padding: 8px 20px;">
                <i class="bi bi-plus-lg"></i> เปิดงวด
              </button>
            </div>
          </div>

          <!-- งวดที่เปิดอยู่ -->
          <div style="margin-bottom: 16px;">
            <h4 style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 10px;">
              <i class="bi bi-broadcast"></i> งวดที่เปิดอยู่
            </h4>
            <div id="open-rounds-list">
              ${rounds.filter(r => r.status === 'open').length === 0
                ? '<div style="text-align: center; padding: 20px; color: var(--text-muted); font-size: 0.85rem;"><i class="bi bi-inbox" style="font-size: 1.5rem; display: block; margin-bottom: 8px; opacity: 0.5;"></i>ยังไม่มีงวดที่เปิด</div>'
                : rounds.filter(r => r.status === 'open').map(r => {
                  const ltIsOpen = r.lotteryType?.isOpen ?? true;
                  return `
                <div class="round-item ${ltIsOpen ? 'open' : 'closed'}" data-round-id="${r.id}">
                  <div class="round-item-info">
                    <span class="round-number-badge">งวดที่ ${r.roundNumber || '-'}</span>
                    <div class="round-date-badge${ltIsOpen ? '' : ' closed'}">
                      <i class="bi bi-calendar3"></i>
                      ${formatThaiDate(r.roundDate)}
                    </div>
                    <span class="round-lt-name">
                      <i class="bi ${r.lotteryType?.icon || 'bi-ticket-perforated'}"></i>
                      ${r.lotteryType?.name || '-'}
                    </span>
                    <span class="round-tx-count">${r._count?.transactions || 0} รายการ</span>
                    ${r.note ? `<span style="font-size: 0.7rem; color: var(--text-muted);">${r.note}</span>` : ''}
                  </div>
                  <div class="round-item-actions">
                    <span class="round-status-badge ${ltIsOpen ? 'open' : 'closed'}">
                      ${ltIsOpen
                        ? '<i class="bi bi-broadcast"></i> เปิดรับ'
                        : '<i class="bi bi-x-circle-fill"></i> ปิดรับ'}
                    </span>
                    <button class="btn-action btn-edit round-close" data-round-id="${r.id}" title="ปิดงวด">
                      <i class="bi bi-lock"></i>
                    </button>
                    <button class="btn-action btn-delete round-delete" data-round-id="${r.id}" title="ลบ">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              `}).join('')}
            </div>
          </div>

          <!-- ประวัติงวด (ปิดแล้ว) -->
          <div>
            <h4 style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between;">
              <span><i class="bi bi-clock-history"></i> ประวัติงวดย้อนหลัง</span>
              <select class="setting-input" id="history-lt-filter" style="width: 150px; font-size: 0.75rem;">
                <option value="">ทุกประเภท</option>
                ${lotteryTypes.map(lt => `<option value="${lt.id}">${lt.name}</option>`).join('')}
              </select>
            </h4>
            <div id="history-rounds-list">
              ${rounds.filter(r => r.status !== 'open').length === 0
                ? '<div style="text-align: center; padding: 16px; color: var(--text-muted); font-size: 0.85rem;">ยังไม่มีประวัติงวด</div>'
                : rounds.filter(r => r.status !== 'open').slice(0, 10).map(r => `
                <div class="round-item closed" data-round-id="${r.id}" data-lt-id="${r.lotteryType?.id}">
                  <div class="round-item-info">
                    <span class="round-number-badge" style="opacity: 0.6;">งวดที่ ${r.roundNumber || '-'}</span>
                    <div class="round-date-badge closed">
                      <i class="bi bi-calendar3"></i>
                      ${formatThaiDate(r.roundDate)}
                    </div>
                    <span class="round-lt-name">
                      <i class="bi ${r.lotteryType?.icon || 'bi-ticket-perforated'}"></i>
                      ${r.lotteryType?.name || '-'}
                    </span>
                    <span class="round-tx-count">${r._count?.transactions || 0} รายการ</span>
                  </div>
                  <div class="round-item-actions">
                    <span class="round-status-badge ${r.status}">${r.status === 'closed' ? '<i class="bi bi-lock-fill"></i> ปิด' : '<i class="bi bi-check-circle-fill"></i> เสร็จ'}</span>
                    <button class="btn-action btn-edit round-reopen" data-round-id="${r.id}" title="เปิดงวดอีกครั้ง">
                      <i class="bi bi-unlock"></i>
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- สถานะรับหวย (เดิม) -->
      <div class="settings-card">
        <div class="settings-card-header">
          <h3><i class="bi bi-toggle-on"></i> สถานะรับหวย</h3>
        </div>
        <div class="settings-card-body">
          <div class="setting-row">
            <span class="setting-label">เปิด/ปิด รับหวย (ทั้งระบบ)</span>
            <div class="setting-value">
              <span id="lottery-status-text" style="color: ${settings.isLotteryOpen ? 'var(--color-success)' : 'var(--color-danger)'}; font-weight: 600;">
                ${settings.isLotteryOpen ? 'เปิดรับ' : 'ปิดรับ'}
              </span>
              <label class="toggle-switch">
                <input type="checkbox" id="toggle-lottery" ${settings.isLotteryOpen ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          <div class="setting-row">
            <span class="setting-label">เวลาปิดรับ</span>
            <div class="setting-value">
              <input type="time" class="setting-input" id="closing-time" value="${settings.closingTime}">
              <button class="btn-add" id="btn-save-time">บันทึก</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ราคาจ่าย -->
      <div class="settings-card">
        <div class="settings-card-header">
          <h3><i class="bi bi-cash-coin"></i> ราคาจ่าย</h3>
        </div>
        <div class="settings-card-body">
          <div class="setting-row">
            <span class="setting-label">2 ตัว (จ่าย)</span>
            <div class="setting-value">
              <input type="number" class="setting-input" id="pay-2digit" value="${settings.payRate2Digit}" min="1">
              <span style="color: var(--text-muted);">บาท/1บาท</span>
            </div>
          </div>
          <div class="setting-row">
            <span class="setting-label">3 ตัว (จ่าย)</span>
            <div class="setting-value">
              <input type="number" class="setting-input" id="pay-3digit" value="${settings.payRate3Digit}" min="1">
              <span style="color: var(--text-muted);">บาท/1บาท</span>
            </div>
          </div>
          <div class="setting-row">
            <span class="setting-label">โต๊ด 3 ตัว (จ่าย)</span>
            <div class="setting-value">
              <input type="number" class="setting-input" id="pay-tode3" value="${settings.payRates.tode_3}" min="1">
              <span style="color: var(--text-muted);">บาท/1บาท</span>
            </div>
          </div>
          <div class="setting-row">
            <span class="setting-label">โต๊ดใหญ่ (จ่าย)</span>
            <div class="setting-value">
              <input type="number" class="setting-input" id="pay-tode-yai" value="${settings.payRates.tode_yai}" min="1">
              <span style="color: var(--text-muted);">บาท/1บาท</span>
            </div>
          </div>
          <div class="setting-row">
            <span class="setting-label">วิ่งบน (จ่าย)</span>
            <div class="setting-value">
              <input type="number" class="setting-input" id="pay-wing-bon" value="${settings.payRates.wing_bon}" min="0.1" step="0.1">
              <span style="color: var(--text-muted);">เท่า</span>
            </div>
          </div>
          <div class="setting-row">
            <span class="setting-label">วิ่งล่าง (จ่าย)</span>
            <div class="setting-value">
              <input type="number" class="setting-input" id="pay-wing-lang" value="${settings.payRates.wing_lang}" min="0.1" step="0.1">
              <span style="color: var(--text-muted);">เท่า</span>
            </div>
          </div>
          <div style="text-align: right; margin-top: 16px;">
            <button class="btn-add" id="btn-save-rates" style="padding: 8px 24px;">
              <i class="bi bi-check-lg"></i> บันทึกราคาจ่าย
            </button>
          </div>
        </div>
      </div>

      <!-- ขั้นต่ำ/สูงสุด -->
      <div class="settings-card">
        <div class="settings-card-header">
          <h3><i class="bi bi-sliders"></i> ขั้นต่ำ - สูงสุด</h3>
        </div>
        <div class="settings-card-body">
          <div class="setting-row">
            <span class="setting-label">ขั้นต่ำ (ทุกประเภท)</span>
            <div class="setting-value">
              <input type="number" class="setting-input" id="min-bet" value="${settings.minBet}" min="1">
              <span style="color: var(--text-muted);">บาท</span>
            </div>
          </div>
          <div class="setting-row">
            <span class="setting-label">สูงสุด 2 ตัว</span>
            <div class="setting-value">
              <input type="number" class="setting-input" id="max-bet-2" value="${settings.maxBet2Digit}" min="1">
              <span style="color: var(--text-muted);">บาท</span>
            </div>
          </div>
          <div class="setting-row">
            <span class="setting-label">สูงสุด 3 ตัว</span>
            <div class="setting-value">
              <input type="number" class="setting-input" id="max-bet-3" value="${settings.maxBet3Digit}" min="1">
              <span style="color: var(--text-muted);">บาท</span>
            </div>
          </div>
          <div style="text-align: right; margin-top: 16px;">
            <button class="btn-add" id="btn-save-limits" style="padding: 8px 24px;">
              <i class="bi bi-check-lg"></i> บันทึก
            </button>
          </div>
        </div>
      </div>

      <!-- หวยอั้น -->
      <div class="settings-card">
        <div class="settings-card-header">
          <h3><i class="bi bi-exclamation-triangle-fill"></i> หวยอั้น (เลขจำกัด)</h3>
          <span style="font-size: 0.75rem; color: var(--color-danger);">
            ${settings.restrictedNumbers.length} เลข
          </span>
        </div>
        <div class="settings-card-body">
          <div class="restricted-list" id="restricted-list">
            ${settings.restrictedNumbers.map(r => `
              <div class="restricted-chip">
                <span class="num">${r.number}</span>
                ${r.maxAmount === 0
      ? '<span style="color: var(--color-danger);">ปิดรับ</span>'
      : `<span>สูงสุด ${r.maxAmount}</span>`
    }
                <span style="font-size: 0.65rem; opacity: 0.7;">(${r.type})</span>
                <button class="btn-remove" data-remove="${r.number}">&times;</button>
              </div>
            `).join('')}
          </div>

          <div class="add-restricted" style="margin-top: 16px; display: flex; gap: 8px; flex-wrap: wrap; align-items: flex-end;">
            <div class="form-group" style="margin-bottom: 0;">
              <label style="font-size: 0.7rem;">เลข</label>
              <input type="text" class="setting-input" id="add-restricted-number" maxlength="3" placeholder="xx" style="width: 70px;">
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label style="font-size: 0.7rem;">จำกัด (บาท)</label>
              <input type="number" class="setting-input" id="add-restricted-max" placeholder="0=ปิด" style="width: 90px;">
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label style="font-size: 0.7rem;">ประเภท</label>
              <select class="setting-input" id="add-restricted-type" style="width: 90px;">
                <option value="2ตัว">2ตัว</option>
                <option value="3ตัว">3ตัว</option>
              </select>
            </div>
            <button class="btn-add" id="btn-add-restricted">
              <i class="bi bi-plus-lg"></i> เพิ่ม
            </button>
          </div>
        </div>
      </div>

      <!-- กลับหน้าหลัง -->
      <div class="settings-card">
        <div class="settings-card-header">
          <h3><i class="bi bi-arrow-left-right"></i> กลับหน้าหลัง (Auto Reverse)</h3>
        </div>
        <div class="settings-card-body">
          <div class="setting-row">
            <span class="setting-label">เปิดกลับหน้าหลังอัตโนมัติ (เมื่อคีย์ 2 ตัว จะคีย์กลับให้ด้วย)</span>
            <div class="setting-value">
              <label class="toggle-switch">
                <input type="checkbox" id="toggle-reverse" ${settings.autoReverse ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- จัดการประเภทหวย -->
      <div class="settings-card">
        <div class="settings-card-header">
          <h3><i class="bi bi-ticket-perforated-fill"></i> จัดการประเภทหวย</h3>
          <span style="font-size: 0.75rem; color: var(--color-primary);">
            ${lotteryTypes.length} ประเภท
          </span>
        </div>
        <div class="settings-card-body">
          <!-- Manual Mode Toggle -->
          <div class="setting-row" style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 2px solid var(--border-color);">
            <div>
              <span class="setting-label" style="font-weight: 700; color: var(--color-primary-dark);">
                <i class="bi bi-hand-index-thumb"></i> ระบบ Manual
              </span>
              <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">
                ${settings.manualMode
                  ? 'เปิด: Admin ควบคุมเปิด/ปิดหวยเอง (ไม่ใช้เวลาอัตโนมัติ)'
                  : 'ปิด: ระบบปิดรับอัตโนมัติตามเวลาที่กำหนด'}
              </div>
            </div>
            <div class="setting-value">
              <span id="manual-mode-text" style="color: ${settings.manualMode ? 'var(--color-primary)' : 'var(--text-muted)'}; font-weight: 600; font-size: 0.85rem;">
                ${settings.manualMode ? 'Manual' : 'Auto'}
              </span>
              <label class="toggle-switch">
                <input type="checkbox" id="toggle-manual-mode" ${settings.manualMode ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div class="lottery-type-list" id="lottery-type-list">
            ${lotteryTypes.map(lt => `
              <div class="lottery-type-item" data-id="${lt.id}">
                <div class="lottery-type-item-info">
                  <i class="bi ${lt.icon || 'bi-ticket-perforated'}" style="font-size: 1.2rem; color: var(--color-primary);"></i>
                  <div>
                    <div style="font-weight: 600;">${lt.name}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">
                      code: ${lt.code} | ${lt.openTime} - ${lt.closeTime}
                    </div>
                  </div>
                </div>
                <div class="lottery-type-item-actions">
                  <span class="lt-status-label" style="font-size: 0.75rem; font-weight: 600; color: ${lt.isOpen ? 'var(--color-success)' : 'var(--color-danger)'};">
                    ${lt.isOpen ? 'เปิด' : 'ปิด'}
                  </span>
                  <label class="toggle-switch">
                    <input type="checkbox" class="lt-toggle" data-lt-id="${lt.id}" ${lt.isOpen ? 'checked' : ''}>
                    <span class="toggle-slider"></span>
                  </label>
                  <button class="btn-action btn-delete lt-delete" data-lt-id="${lt.id}">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            `).join('')}
          </div>

          <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border-color);">
            <h4 style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 12px;">
              <i class="bi bi-plus-circle"></i> เพิ่มประเภทหวยใหม่
            </h4>
            <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: flex-end;">
              <div class="form-group" style="margin-bottom: 0;">
                <label style="font-size: 0.7rem;">ชื่อ</label>
                <input type="text" class="setting-input" id="lt-add-name" placeholder="หวยไทย" style="width: 120px;">
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label style="font-size: 0.7rem;">รหัส</label>
                <input type="text" class="setting-input" id="lt-add-code" placeholder="thai" style="width: 90px;">
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label style="font-size: 0.7rem;">เปิด</label>
                <input type="time" class="setting-input" id="lt-add-open" value="06:00" style="width: 100px;">
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label style="font-size: 0.7rem;">ปิด</label>
                <input type="time" class="setting-input" id="lt-add-close" value="14:30" style="width: 100px;">
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label style="font-size: 0.7rem;">ไอคอน</label>
                <input type="text" class="setting-input" id="lt-add-icon" placeholder="bi-flag-fill" style="width: 120px;">
              </div>
              <button class="btn-add" id="btn-add-lt">
                <i class="bi bi-plus-lg"></i> เพิ่ม
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  initSettingsEvents(container);
}

function initSettingsEvents(container) {
  // === Round Management Events ===

  // เมื่อเปลี่ยนวันที่ → แสดงวันที่ไทย
  document.getElementById('round-date')?.addEventListener('change', (e) => {
    const thaiDisplay = document.getElementById('round-date-thai');
    if (thaiDisplay && e.target.value) {
      thaiDisplay.textContent = formatThaiDate(e.target.value);
    }
  });

  // เมื่อเลือกประเภทหวย → ดึงเลขงวดถัดไป
  document.getElementById('round-lt-select')?.addEventListener('change', async (e) => {
    const ltId = e.target.value;
    const roundNumberInput = document.getElementById('round-number');
    const hint = document.getElementById('round-number-hint');
    if (!ltId || !roundNumberInput) return;

    roundNumberInput.disabled = true;
    roundNumberInput.value = '';
    if (hint) hint.textContent = 'กำลังโหลด...';

    try {
      const res = await api.rounds.getNextNumber(ltId);
      if (res?.success && res.data) {
        roundNumberInput.value = res.data.next;
        if (res.data.hasRounds) {
          // มีงวดแล้ว → auto-fill แต่ยังแก้ไขได้
          roundNumberInput.disabled = false;
          if (hint) hint.textContent = `งวดล่าสุด: ${res.data.next - 1} → ถัดไป: ${res.data.next}`;
        } else {
          // ยังไม่มีงวด → ให้พิมพ์เลขเริ่มต้นเอง
          roundNumberInput.disabled = false;
          roundNumberInput.value = '';
          roundNumberInput.placeholder = 'ใส่เลขเริ่มต้น';
          roundNumberInput.focus();
          if (hint) hint.textContent = 'ครั้งแรก: กรุณาใส่เลขงวดเริ่มต้น';
        }
      }
    } catch {
      roundNumberInput.disabled = false;
      if (hint) hint.textContent = '';
    }
  });

  document.getElementById('btn-create-round')?.addEventListener('click', async () => {
    const roundDate = document.getElementById('round-date')?.value;
    const ltSelect = document.getElementById('round-lt-select')?.value;
    const roundNumber = document.getElementById('round-number')?.value;
    const note = document.getElementById('round-note')?.value?.trim() || null;

    if (!roundDate) {
      showToast('กรุณาเลือกวันที่งวด', 'error');
      return;
    }
    if (!ltSelect) {
      showToast('กรุณาเลือกประเภทหวย', 'error');
      return;
    }
    if (!roundNumber || parseInt(roundNumber) < 1) {
      showToast('กรุณาใส่เลขงวด', 'error');
      document.getElementById('round-number')?.focus();
      return;
    }

    try {
      await api.rounds.add({ roundDate, lotteryTypeId: parseInt(ltSelect), roundNumber: parseInt(roundNumber), note });
      const lt = lotteryTypes.find(l => l.id === parseInt(ltSelect));
      showToast(`เปิดงวดที่ ${roundNumber} ${lt?.name || ''} วันที่ ${formatThaiDate(roundDate)}`, 'success');
      renderSettingsPage(container);
    } catch (err) {
      showToast(err.message || 'เกิดข้อผิดพลาด', 'error');
    }
  });

  // ปิดงวด
  container.querySelectorAll('.round-close').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = parseInt(btn.dataset.roundId);
      if (!confirm('ยืนยันปิดงวดนี้?')) return;
      try {
        await api.rounds.update(id, { status: 'closed' });
        showToast('ปิดงวดแล้ว', 'success');
        renderSettingsPage(container);
      } catch (err) {
        showToast(err.message || 'เกิดข้อผิดพลาด', 'error');
      }
    });
  });

  // เปิดงวดอีกครั้ง
  container.querySelectorAll('.round-reopen').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = parseInt(btn.dataset.roundId);
      try {
        await api.rounds.update(id, { status: 'open' });
        showToast('เปิดงวดอีกครั้งแล้ว', 'success');
        renderSettingsPage(container);
      } catch (err) {
        showToast(err.message || 'เกิดข้อผิดพลาด', 'error');
      }
    });
  });

  // ลบงวด
  container.querySelectorAll('.round-delete').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = parseInt(btn.dataset.roundId);
      if (!confirm('ยืนยันลบงวดนี้? (ลบได้เฉพาะงวดที่ไม่มีรายการ)')) return;
      try {
        await api.rounds.delete(id);
        showToast('ลบงวดแล้ว', 'warning');
        renderSettingsPage(container);
      } catch (err) {
        showToast(err.message || 'ไม่สามารถลบได้', 'error');
      }
    });
  });

  // Filter ประวัติตามประเภทหวย
  document.getElementById('history-lt-filter')?.addEventListener('change', (e) => {
    const filterLtId = e.target.value;
    const historyItems = container.querySelectorAll('#history-rounds-list .round-item');
    historyItems.forEach(item => {
      if (!filterLtId || item.dataset.ltId === filterLtId) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  });

  // === Existing Settings Events ===
  document.getElementById('toggle-lottery')?.addEventListener('change', async (e) => {
    const isOpen = e.target.checked;
    await api.settings.update({ isLotteryOpen: isOpen });
    const statusText = document.getElementById('lottery-status-text');
    if (statusText) {
      statusText.textContent = isOpen ? 'เปิดรับ' : 'ปิดรับ';
      statusText.style.color = isOpen ? 'var(--color-success)' : 'var(--color-danger)';
    }
    showToast(isOpen ? 'เปิดรับหวยแล้ว' : 'ปิดรับหวยแล้ว', isOpen ? 'success' : 'warning');
  });

  document.getElementById('btn-save-time')?.addEventListener('click', async () => {
    const time = document.getElementById('closing-time')?.value;
    if (time) {
      await api.settings.update({ closingTime: time });
      showToast(`ตั้งเวลาปิดรับ: ${time}`, 'success');
    }
  });

  document.getElementById('btn-save-rates')?.addEventListener('click', async () => {
    const pay2 = parseInt(document.getElementById('pay-2digit')?.value) || 95;
    const pay3 = parseInt(document.getElementById('pay-3digit')?.value) || 900;
    const tode3 = parseInt(document.getElementById('pay-tode3')?.value) || 150;
    const todeYai = parseInt(document.getElementById('pay-tode-yai')?.value) || 450;
    const wingBon = parseFloat(document.getElementById('pay-wing-bon')?.value) || 3.2;
    const wingLang = parseFloat(document.getElementById('pay-wing-lang')?.value) || 4.2;

    await api.settings.update({
      payRate2Digit: pay2,
      payRate3Digit: pay3,
      payRates: {
        ...settings.payRates,
        song_bon: pay2,
        song_kang: pay2,
        song_bon_lang: pay2,
        ek_3song: pay3,
        tode_3: tode3,
        tode_yai: todeYai,
        wing_bon: wingBon,
        wing_lang: wingLang,
      }
    });

    const badge2 = document.getElementById('header-pay-2digit');
    const badge3 = document.getElementById('header-pay-3digit');
    if (badge2) badge2.textContent = `฿${pay2}.00`;
    if (badge3) badge3.textContent = `฿${pay3}.00`;

    showToast('บันทึกราคาจ่ายแล้ว', 'success');
  });

  document.getElementById('btn-save-limits')?.addEventListener('click', async () => {
    const minBet = parseInt(document.getElementById('min-bet')?.value) || 1;
    const maxBet2 = parseInt(document.getElementById('max-bet-2')?.value) || 1000;
    const maxBet3 = parseInt(document.getElementById('max-bet-3')?.value) || 500;
    await api.settings.update({ minBet, maxBet2Digit: maxBet2, maxBet3Digit: maxBet3 });
    showToast('บันทึกขั้นต่ำ-สูงสุดแล้ว', 'success');
  });

  document.getElementById('toggle-reverse')?.addEventListener('change', async (e) => {
    await api.settings.update({ autoReverse: e.target.checked });
    showToast(e.target.checked ? 'เปิดกลับหน้าหลังอัตโนมัติ' : 'ปิดกลับหน้าหลังอัตโนมัติ',
      e.target.checked ? 'success' : 'warning');
  });

  document.getElementById('btn-add-restricted')?.addEventListener('click', async () => {
    const number = document.getElementById('add-restricted-number')?.value?.trim();
    const maxAmount = parseInt(document.getElementById('add-restricted-max')?.value) || 0;
    const type = document.getElementById('add-restricted-type')?.value || '2ตัว';

    if (!number) {
      showToast('กรุณาใส่เลข', 'error');
      return;
    }

    await api.restricted.add({ number, maxAmount, type });
    showToast(`เพิ่มเลขอั้น: ${number}`, 'success');
    renderSettingsPage(container);
  });

  container.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const number = btn.dataset.remove;
      await api.restricted.remove(number);
      showToast(`ลบเลขอั้น: ${number}`, 'warning');
      renderSettingsPage(container);
    });
  });

  // Manual mode toggle
  document.getElementById('toggle-manual-mode')?.addEventListener('change', async (e) => {
    const manualMode = e.target.checked;
    await api.settings.update({ manualMode });
    const txt = document.getElementById('manual-mode-text');
    if (txt) {
      txt.textContent = manualMode ? 'Manual' : 'Auto';
      txt.style.color = manualMode ? 'var(--color-primary)' : 'var(--text-muted)';
    }
    showToast(
      manualMode ? 'เปิดระบบ Manual: เปิด/ปิดหวยเอง' : 'ปิดระบบ Manual: ใช้เวลาอัตโนมัติ',
      manualMode ? 'success' : 'warning'
    );
  });

  // Lottery type toggle
  container.querySelectorAll('.lt-toggle').forEach(toggle => {
    toggle.addEventListener('change', async (e) => {
      const id = parseInt(e.target.dataset.ltId);
      const isOpen = e.target.checked;
      await api.lotteryTypes.update(id, { isOpen });
      // Update status label next to toggle
      const item = e.target.closest('.lottery-type-item');
      const label = item?.querySelector('.lt-status-label');
      if (label) {
        label.textContent = isOpen ? 'เปิด' : 'ปิด';
        label.style.color = isOpen ? 'var(--color-success)' : 'var(--color-danger)';
      }
      showToast(isOpen ? 'เปิดรับหวยแล้ว' : 'ปิดรับหวยแล้ว', isOpen ? 'success' : 'warning');
    });
  });

  // Lottery type delete
  container.querySelectorAll('.lt-delete').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = parseInt(btn.dataset.ltId);
      if (!confirm('ยืนยันลบประเภทหวยนี้?')) return;
      await api.lotteryTypes.delete(id);
      showToast('ลบประเภทหวยแล้ว', 'warning');
      renderSettingsPage(container);
    });
  });

  // Add lottery type
  document.getElementById('btn-add-lt')?.addEventListener('click', async () => {
    const name = document.getElementById('lt-add-name')?.value?.trim();
    const code = document.getElementById('lt-add-code')?.value?.trim();
    const openTime = document.getElementById('lt-add-open')?.value || '06:00';
    const closeTime = document.getElementById('lt-add-close')?.value || '14:30';
    const icon = document.getElementById('lt-add-icon')?.value?.trim() || null;

    if (!name || !code) {
      showToast('กรุณาใส่ชื่อและรหัส', 'error');
      return;
    }

    try {
      await api.lotteryTypes.add({ name, code, openTime, closeTime, icon });
      showToast(`เพิ่มประเภทหวย: ${name}`, 'success');
      renderSettingsPage(container);
    } catch (err) {
      showToast(err.message || 'เกิดข้อผิดพลาด', 'error');
    }
  });
}
