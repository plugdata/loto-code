// ─── Templates ──────────────────────────────

export function formatThaiDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' });
}

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
      <div class="settings-card" style="border-top: 4px solid var(--color-danger); text-align: center; padding: 40px;">
        <i class="bi bi-shield-lock" style="font-size: 3rem; color: var(--color-danger); margin-bottom: 20px; display: block;"></i>
        <h2 style="color: var(--color-danger);">ไม่สามารถเข้าถึงการตั้งค่าได้</h2>
        <p style="color: var(--text-muted); margin-bottom: 20px;">${message}</p>
        <button class="btn-add" onclick="window.location.reload()" style="justify-content: center; margin: 0 auto;">
          <i class="bi bi-arrow-clockwise"></i> ลองใหม่อีกครั้ง
        </button>
      </div>
    </div>
  `;
}

function generateTimeOptions() {
  const opts = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      opts.push(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`);
    }
  }
  return opts.map(t => `<option value="${t}">`).join('');
}

export function pageTemplate(settings, lotteryTypes, rounds) {
  const timeDatalist = `<datalist id="time-24h-options">${generateTimeOptions()}</datalist>`;
  return `
    <div class="settings-container">
    ${timeDatalist}
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
                <input type="hidden" id="round-date" value="${new Date().toISOString().slice(0,10)}">
                <div id="thai-date-picker" style="position: relative; display: inline-block;">
                  <button type="button" id="thai-date-picker-btn" class="setting-input" style="width: 190px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 0.85rem; white-space: nowrap; text-align: left;">
                    <i class="bi bi-calendar3" style="color: var(--color-primary);"></i>
                    <span id="round-date-thai">${formatThaiDate(new Date().toISOString().slice(0,10))}</span>
                  </button>
                  <div id="thai-date-dropdown" style="display: none; position: absolute; top: 100%; left: 0; z-index: 100; background: var(--bg-card, #fff); border: 1px solid var(--border-color); border-radius: var(--radius-md, 8px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); padding: 12px; min-width: 280px; margin-top: 4px;">
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
                : rounds.filter(r => r.status !== 'open').map(r => `
                <div class="round-item closed history-item" data-round-id="${r.id}" data-lt-id="${r.lotteryType?.id}"
                     data-round-number="${r.roundNumber || '-'}" data-round-date="${r.roundDate}" data-lt-name="${r.lotteryType?.name || '-'}" data-tx-count="${r._count?.transactions || 0}">
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
                    <button class="btn-action btn-delete round-delete-history" data-round-id="${r.id}" title="ลบงวด">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
            <div id="history-pagination" style="display: flex; justify-content: center; align-items: center; gap: 12px; margin-top: 12px; font-size: 0.8rem;">
              <button class="btn-action" id="history-prev" style="padding: 4px 12px;" disabled>
                <i class="bi bi-chevron-left"></i> ก่อนหน้า
              </button>
              <span id="history-page-info" style="color: var(--text-muted);"></span>
              <button class="btn-action" id="history-next" style="padding: 4px 12px;">
                ถัดไป <i class="bi bi-chevron-right"></i>
              </button>
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
                    <div style="font-size: 0.75rem; color: var(--text-muted); display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                      <span>code: ${lt.code}</span>
                      <span>|</span>
                      <input type="text" class="setting-input lt-open-time time-24h" list="time-24h-options" data-lt-id="${lt.id}" data-orig="${lt.openTime}" value="${lt.openTime}" maxlength="5" placeholder="HH:MM" style="width: 70px; font-size: 0.75rem; padding: 2px 4px; text-align: center;">
                      <span>-</span>
                      <input type="text" class="setting-input lt-close-time time-24h" list="time-24h-options" data-lt-id="${lt.id}" data-orig="${lt.closeTime}" value="${lt.closeTime}" maxlength="5" placeholder="HH:MM" style="width: 70px; font-size: 0.75rem; padding: 2px 4px; text-align: center;">
                      <button class="btn-add lt-save-time" data-lt-id="${lt.id}" style="display: none; padding: 2px 10px; font-size: 0.7rem;">
                        <i class="bi bi-check-lg"></i> บันทึก
                      </button>
                      <button class="btn-action lt-show-logs" data-lt-id="${lt.id}" data-lt-name="${lt.name}" title="ดูประวัติแก้ไข" style="padding: 2px 6px; font-size: 0.7rem;">
                        <i class="bi bi-clock-history"></i>
                      </button>
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
                <input type="text" class="setting-input time-24h" id="lt-add-open" list="time-24h-options" value="06:00" maxlength="5" placeholder="HH:MM" style="width: 80px; text-align: center;">
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label style="font-size: 0.7rem;">ปิด</label>
                <input type="text" class="setting-input time-24h" id="lt-add-close" list="time-24h-options" value="14:30" maxlength="5" placeholder="HH:MM" style="width: 80px; text-align: center;">
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
  

      <!-- สถานะรับหวย (เดิม) -->
   <!--   <div class="settings-card">
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
      </div> -->

     
      <!-- ราคาจ่าย -->
      <div class="settings-card">
        <div class="settings-card-header">
          <h3><i class="bi bi-cash-coin"></i> ราคาจ่าย</h3>
          <select class="setting-input" id="rates-lt-filter" style="width: 160px; font-size: 0.75rem;">
            <option value="">ทุกประเภท (ค่าเริ่มต้น)</option>
            ${lotteryTypes.map(lt => `<option value="${lt.id}">${lt.name}</option>`).join('')}
          </select>
        </div>
        <div class="settings-card-body">
          <!-- 2 ตัว -->
          <div style="font-size: 0.75rem; font-weight: 700; color: var(--color-primary); margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1px solid var(--border-color);">
            <i class="bi bi-2-circle"></i> 2 ตัว
          </div>
          <div class="setting-row">
            <span class="setting-label">2ตัวบน</span>
            <div class="setting-value">
              <input type="number" class="setting-input" id="pay-song-bon" value="${settings.payRates.song_bon}" min="1">
              <span style="color: var(--text-muted);">บาท/1บาท</span>
            </div>
          </div>
          <div class="setting-row">
            <span class="setting-label">2ตัวล่าง</span>
            <div class="setting-value">
              <input type="number" class="setting-input" id="pay-song-kang" value="${settings.payRates.song_kang}" min="1">
              <span style="color: var(--text-muted);">บาท/1บาท</span>
            </div>
          </div>
          <div class="setting-row">
            <span class="setting-label">2ตัว บน-ล่าง</span>
            <div class="setting-value">
              <input type="number" class="setting-input" id="pay-song-bon-lang" value="${settings.payRates.song_bon_lang}" min="1">
              <span style="color: var(--text-muted);">บาท/1บาท</span>
            </div>
          </div>

          <!-- 3 ตัว -->
          <div style="font-size: 0.75rem; font-weight: 700; color: var(--color-primary); margin: 16px 0 8px; padding-bottom: 4px; border-bottom: 1px solid var(--border-color);">
            <i class="bi bi-3-circle"></i> 3 ตัว
          </div>
          <div class="setting-row">
            <span class="setting-label">3ตัวตรง (เต็ง)</span>
            <div class="setting-value">
              <input type="number" class="setting-input" id="pay-ek-3song" value="${settings.payRates.ek_3song}" min="1">
              <span style="color: var(--text-muted);">บาท/1บาท</span>
            </div>
          </div>
          <div class="setting-row">
            <span class="setting-label">3ตัวหน้า</span>
            <div class="setting-value">
              <input type="number" class="setting-input" id="pay-tua-3song" value="${settings.payRates.tua_3song}" min="1">
              <span style="color: var(--text-muted);">บาท/1บาท</span>
            </div>
          </div>
          <div class="setting-row">
            <span class="setting-label">3ตัวล่าง</span>
            <div class="setting-value">
              <input type="number" class="setting-input" id="pay-sam-tua-lang" value="${settings.payRates.sam_tua_lang}" min="1">
              <span style="color: var(--text-muted);">บาท/1บาท</span>
            </div>
          </div>

          <!-- โต๊ด -->
          <div style="font-size: 0.75rem; font-weight: 700; color: var(--color-primary); margin: 16px 0 8px; padding-bottom: 4px; border-bottom: 1px solid var(--border-color);">
            <i class="bi bi-shuffle"></i> โต๊ด
          </div>
          <div class="setting-row">
            <span class="setting-label">โต๊ด 3 ตัว</span>
            <div class="setting-value">
              <input type="number" class="setting-input" id="pay-tode3" value="${settings.payRates.tode_3}" min="1">
              <span style="color: var(--text-muted);">บาท/1บาท</span>
            </div>
          </div>
          <div class="setting-row">
            <span class="setting-label">โต๊ดใหญ่</span>
            <div class="setting-value">
              <input type="number" class="setting-input" id="pay-tode-yai" value="${settings.payRates.tode_yai}" min="1">
              <span style="color: var(--text-muted);">บาท/1บาท</span>
            </div>
          </div>
          <div class="setting-row">
            <span class="setting-label">โต๊ดเล็ก</span>
            <div class="setting-value">
              <input type="number" class="setting-input" id="pay-tode-lek" value="${settings.payRates.tode_lek}" min="1">
              <span style="color: var(--text-muted);">บาท/1บาท</span>
            </div>
          </div>

          <!-- วิ่ง -->
          <div style="font-size: 0.75rem; font-weight: 700; color: var(--color-primary); margin: 16px 0 8px; padding-bottom: 4px; border-bottom: 1px solid var(--border-color);">
            <i class="bi bi-lightning"></i> วิ่ง
          </div>
          <div class="setting-row">
            <span class="setting-label">วิ่งบน</span>
            <div class="setting-value">
              <input type="number" class="setting-input" id="pay-wing-bon" value="${settings.payRates.wing_bon}" min="0.1" step="0.1">
              <span style="color: var(--text-muted);">เท่า</span>
            </div>
          </div>
          <div class="setting-row">
            <span class="setting-label">วิ่งล่าง</span>
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
          <select class="setting-input" id="limits-lt-filter" style="width: 160px; font-size: 0.75rem;">
            <option value="">ทุกประเภท (ค่าเริ่มต้น)</option>
            ${lotteryTypes.map(lt => `<option value="${lt.id}">${lt.name}</option>`).join('')}
          </select>
        </div>
        <div class="settings-card-body">
          <div class="setting-row">
            <span class="setting-label">ขั้นต่ำ</span>
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
          <select class="setting-input" id="restricted-lt-filter" style="width: 160px; font-size: 0.75rem;">
            <option value="" disabled selected>-- เลือกประเภท --</option>
            ${lotteryTypes.map(lt => `<option value="${lt.id}">${lt.name}</option>`).join('')}
          </select>
        </div>
        <div class="settings-card-body">
          <!-- แจ้งเตือนให้เลือกประเภท -->
          <div id="restricted-select-hint" style="text-align: center; padding: 20px; color: var(--text-muted); font-size: 0.85rem;">
            <i class="bi bi-hand-index" style="font-size: 1.3rem; display: block; margin-bottom: 8px; opacity: 0.5;"></i>
            กรุณาเลือกประเภทหวยก่อน
          </div>

          <!-- ส่วนเนื้อหา (ซ่อนจนกว่าจะเลือกประเภท) -->
          <div id="restricted-content" style="display: none;">
            <div id="restricted-count" style="font-size: 0.75rem; color: var(--color-danger); margin-bottom: 8px;">
              0 เลข
            </div>
            <div class="restricted-list" id="restricted-list"></div>

            <div class="add-restricted" style="margin-top: 16px; display: flex; gap: 8px; flex-wrap: wrap; align-items: flex-end;">
              <div class="form-group" style="margin-bottom: 0;">
                <label style="font-size: 0.7rem;">ประเภทเลข</label>
                <select class="setting-input" id="add-restricted-type" style="width: 90px;">
                  <option value="2ตัว">2 ตัว</option>
                  <option value="3ตัว">3 ตัว</option>
                </select>
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label style="font-size: 0.7rem;">เลข</label>
                <div style="position: relative;">
                  <input type="text" class="setting-input" id="add-restricted-search" placeholder="พิมพ์ค้นหา..." autocomplete="off" style="width: 120px;">
                  <div id="restricted-search-dropdown" style="display: none; position: absolute; top: 100%; left: 0; z-index: 100; background: var(--bg-card, #fff); border: 1px solid var(--border-color); border-radius: var(--radius-md, 8px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); max-height: 200px; overflow-y: auto; width: 120px; margin-top: 2px;"></div>
                </div>
                <input type="hidden" id="add-restricted-number">
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label style="font-size: 0.7rem;">สถานะ</label>
                <select class="setting-input" id="add-restricted-status" style="width: 80px;">
                  <option value="open">เปิด</option>
                  <option value="closed">ปิด</option>
                </select>
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label style="font-size: 0.7rem;">ราคาจ่าย (บาท)</label>
                <input type="number" class="setting-input" id="add-restricted-payrate" placeholder="ว่าง=ปกติ" min="0" step="0.1" style="width: 100px;">
              </div>
              <button class="btn-add" id="btn-add-restricted">
                <i class="bi bi-plus-lg"></i> เพิ่ม
              </button>
              <button class="btn-add" id="btn-add-restricted-reverse" style="background: var(--color-accent, #e6a817); padding: 8px 12px;" title="เพิ่มพร้อมกลับเลข">
                <i class="bi bi-arrow-left-right"></i> เพิ่ม+กลับ
              </button>
            </div>
            <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 8px;">
              <i class="bi bi-info-circle"></i> เปิด = จำกัดยอดรับ | ปิด = ไม่รับเลขนี้ | ราคาจ่าย = ราคาจ่ายจริง (เช่น ปกติ 95 เลขอั้นจ่าย 45)
              <br><i class="bi bi-arrow-left-right"></i> เพิ่ม+กลับ = เพิ่มทั้งเลขต้นและเลขกลับ (เช่น 09 → 09 + 90)
            </div>
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
  </div>
     
  `;
}

function renderChip(r) {
  return `
    <div class="restricted-chip">
      <span class="num">${r.number}</span>
      ${r.maxAmount === 0
        ? '<span style="color: var(--color-danger);">ปิดรับ</span>'
        : `<span style="color: var(--color-success);">เปิด</span>`
      }
      ${r.payRate != null
        ? `<span style="color: var(--color-accent, #e6a817); font-weight: 600;">จ่าย ${r.payRate}฿</span>`
        : ''}
      ${r.lotteryTypeName ? `<span style="font-size: 0.6rem; color: var(--color-primary); background: var(--color-primary-subtle, #e8f5e9); padding: 1px 6px; border-radius: 4px;">${r.lotteryTypeName}</span>` : ''}
      <button class="btn-remove" data-remove-id="${r.id}">&times;</button>
    </div>`;
}

export function renderRestrictedChips(list) {
  if (!list || list.length === 0) {
    return '<div style="text-align: center; padding: 16px; color: var(--text-muted); font-size: 0.85rem;"><i class="bi bi-inbox" style="font-size: 1.3rem; display: block; margin-bottom: 6px; opacity: 0.5;"></i>ยังไม่มีเลขอั้น</div>';
  }

  const digit2 = list.filter(r => r.type === '2ตัว');
  const digit3 = list.filter(r => r.type === '3ตัว');

  let html = '';

  if (digit2.length > 0) {
    html += `
      <div style="font-size: 0.75rem; font-weight: 700; color: var(--color-primary); margin-bottom: 6px; padding-bottom: 4px; border-bottom: 1px solid var(--border-color);">
        <i class="bi bi-2-circle"></i> เลข 2 ตัว (${digit2.length})
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px;">
        ${digit2.map(renderChip).join('')}
      </div>`;
  }

  if (digit3.length > 0) {
    html += `
      <div style="font-size: 0.75rem; font-weight: 700; color: var(--color-primary); margin-bottom: 6px; padding-bottom: 4px; border-bottom: 1px solid var(--border-color);">
        <i class="bi bi-3-circle"></i> เลข 3 ตัว (${digit3.length})
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 6px;">
        ${digit3.map(renderChip).join('')}
      </div>`;
  }

  return html;
}

const THAI_MONTHS = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
const THAI_DAYS_SHORT = ['อา','จ','อ','พ','พฤ','ศ','ส'];

export function renderThaiCalendar(year, month) {
  const beYear = year + 543;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

  let html = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
      <button type="button" class="thai-cal-prev" style="background: none; border: none; cursor: pointer; font-size: 1.1rem; padding: 4px 8px; color: var(--color-primary);">
        <i class="bi bi-chevron-left"></i>
      </button>
      <div style="display: flex; gap: 6px; align-items: center;">
        <select class="thai-cal-month" style="border: 1px solid var(--border-color); border-radius: 4px; padding: 2px 4px; font-size: 0.8rem; background: var(--bg-input, #fff);">
          ${THAI_MONTHS.map((m, i) => `<option value="${i}" ${i === month ? 'selected' : ''}>${m}</option>`).join('')}
        </select>
        <select class="thai-cal-year" style="border: 1px solid var(--border-color); border-radius: 4px; padding: 2px 4px; font-size: 0.8rem; background: var(--bg-input, #fff);">
          ${Array.from({length: 5}, (_, i) => beYear - 2 + i).map(y => `<option value="${y - 543}" ${(y - 543) === year ? 'selected' : ''}>${y}</option>`).join('')}
        </select>
      </div>
      <button type="button" class="thai-cal-next" style="background: none; border: none; cursor: pointer; font-size: 1.1rem; padding: 4px 8px; color: var(--color-primary);">
        <i class="bi bi-chevron-right"></i>
      </button>
    </div>
    <table style="width: 100%; border-collapse: collapse; text-align: center; font-size: 0.8rem;">
      <thead>
        <tr>${THAI_DAYS_SHORT.map(d => `<th style="padding: 4px; color: var(--text-muted); font-weight: 600; font-size: 0.7rem;">${d}</th>`).join('')}</tr>
      </thead>
      <tbody>`;

  let dayCount = 1;
  for (let row = 0; row < 6; row++) {
    if (dayCount > daysInMonth) break;
    html += '<tr>';
    for (let col = 0; col < 7; col++) {
      if ((row === 0 && col < firstDay) || dayCount > daysInMonth) {
        html += '<td style="padding: 4px;"></td>';
      } else {
        const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(dayCount).padStart(2,'0')}`;
        const isToday = dateStr === todayStr;
        html += `<td>
          <button type="button" class="thai-cal-day" data-date="${dateStr}"
            style="width: 32px; height: 32px; border: none; border-radius: 50%; cursor: pointer; font-size: 0.8rem;
            background: ${isToday ? 'var(--color-primary)' : 'none'};
            color: ${isToday ? '#fff' : (col === 0 ? 'var(--color-danger)' : 'inherit')};
            font-weight: ${isToday ? '700' : '400'};"
            onmouseover="this.style.background='${isToday ? 'var(--color-primary)' : 'var(--color-primary-subtle, #e8f5e9)'}'"
            onmouseout="this.style.background='${isToday ? 'var(--color-primary)' : 'none'}'"
          >${dayCount}</button>
        </td>`;
        dayCount++;
      }
    }
    html += '</tr>';
  }

  html += '</tbody></table>';
  return html;
}

export function lotteryTypeLogModal(ltName, logs) {
  const fieldLabel = (f) => f === 'openTime' ? 'เวลาเปิด' : 'เวลาปิด';
  return `
    <div class="modal-overlay" id="lt-log-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;">
      <div style="background: var(--bg-card, #fff); border-radius: var(--radius-lg, 12px); padding: 24px; width: 90%; max-width: 480px; max-height: 80vh; overflow-y: auto; box-shadow: 0 8px 32px rgba(0,0,0,0.2);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h3 style="margin: 0; font-size: 1rem; color: var(--color-primary);">
            <i class="bi bi-clock-history"></i> ประวัติแก้ไข: ${ltName}
          </h3>
          <button id="lt-log-modal-close" style="background: none; border: none; font-size: 1.3rem; cursor: pointer; color: var(--text-muted);">&times;</button>
        </div>
        ${logs.length === 0
          ? '<div style="text-align: center; padding: 20px; color: var(--text-muted);">ยังไม่มีประวัติการแก้ไข</div>'
          : `<div style="display: flex; flex-direction: column; gap: 8px;">
              ${logs.map(log => `
                <div style="padding: 10px 12px; background: var(--bg-surface, #f8f9fa); border-radius: var(--radius-md, 8px); font-size: 0.8rem;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                    <span style="font-weight: 600; color: var(--color-primary-dark);">${fieldLabel(log.field)}</span>
                    <span style="font-size: 0.7rem; color: var(--text-muted);">${new Date(log.createdAt).toLocaleString('th-TH')}</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="color: var(--color-danger); text-decoration: line-through;">${log.oldValue}</span>
                    <i class="bi bi-arrow-right" style="font-size: 0.7rem; color: var(--text-muted);"></i>
                    <span style="color: var(--color-success); font-weight: 600;">${log.newValue}</span>
                  </div>
                  <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 2px;">
                    <i class="bi bi-person"></i> ${log.changedByName}
                  </div>
                </div>
              `).join('')}
            </div>`
        }
      </div>
    </div>
  `;
}
