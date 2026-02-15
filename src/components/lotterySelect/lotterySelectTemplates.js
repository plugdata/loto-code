// ─── Templates ──────────────────────────────

import { getRemaining, formatCountdown } from './lotterySelectHandlers.js';

function formatThaiDateShort(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatTime24h(time) {
  if (!time) return '00:00';
  const [h, m] = time.split(':').map(Number);
  return `${String(h).padStart(2, '0')}:${String(m || 0).padStart(2, '0')}`;
}

export function emptyStateTemplate() {
  return `
    <div style="width: 100%; text-align: center; padding: 60px 20px; color: var(--text-muted);">
      <i class="bi bi-inbox" style="font-size: 3rem; display: block; margin-bottom: 16px; opacity: 0.5;"></i>
      <p style="font-size: 1rem;">ยังไม่มีประเภทหวย</p>
      <p style="font-size: 0.85rem;">กรุณาเพิ่มประเภทหวยในหน้าตั้งค่า</p>
    </div>
  `;
}

export function lotteryCardTemplate(lt, manualMode, round) {
  const hasRound = !!round;
  const remaining = manualMode ? 0 : (lt.isOpen && hasRound ? getRemaining(lt.closeTime) : 0);
  const isExpired = !hasRound || (manualMode ? !lt.isOpen : (!lt.isOpen || remaining <= 0));
  const countdownText = (!manualMode && !isExpired) ? formatCountdown(remaining) : null;

  // Round info line
  const roundDateText = hasRound
    ? `<div class="lottery-type-round-info">
        <i class="bi bi-calendar3"></i> ${formatThaiDateShort(round.roundDate)} | งวดที่ ${round.roundNumber || '-'}
      </div>`
    : `<div class="lottery-type-round-info no-round">
        <i class="bi bi-calendar-x"></i> ยังไม่มีงวดเปิด
      </div>`;

  const countdownContent = isExpired
    ? (!hasRound
      ? '<i class="bi bi-calendar-x-fill"></i> ไม่มีงวด'
      : (manualMode
        ? '<i class="bi bi-hand-index-thumb"></i> ปิดโดย Admin'
        : '<i class="bi bi-lock-fill"></i> หมดเวลา'))
    : (manualMode
      ? '<i class="bi bi-hand-index-thumb"></i> เปิดโดย Admin'
      : `<i class="bi bi-hourglass-split"></i> <span class="countdown-value">${countdownText}</span>`);

  const statusContent = isExpired
    ? (!hasRound
      ? '<i class="bi bi-x-circle-fill"></i> ไม่พร้อม'
      : '<i class="bi bi-x-circle-fill"></i> ปิดรับ')
    : '<i class="bi bi-check-circle-fill"></i> เปิดรับ';

  return `
    <div class="lottery-type-card ${isExpired ? 'disabled' : ''}"
         data-code="${lt.code}" data-close-time="${lt.closeTime}" data-manual="${manualMode}">
      <div class="lottery-type-icon">
        <i class="bi ${lt.icon || 'bi-ticket-perforated'}"></i>
      </div>
      <div class="lottery-type-name">${lt.name}</div>
      ${roundDateText}
      <div class="lottery-type-time">
        <i class="bi bi-clock"></i> ${formatTime24h(lt.openTime)} - ${formatTime24h(lt.closeTime)}
      </div>
      <div class="lottery-countdown ${isExpired ? 'expired' : ''}">
        ${countdownContent}
      </div>
      <div class="lottery-type-status ${isExpired ? 'closed' : 'open'}">
        ${statusContent}
      </div>
    </div>
  `;
}

export function pageTemplate(lotteryTypes, manualMode, openRounds) {
  // Map each lottery type to its open round (if any)
  const roundMap = {};
  (openRounds || []).forEach(r => {
    const ltId = r.lotteryType?.id || r.lotteryTypeId;
    if (ltId && !roundMap[ltId]) roundMap[ltId] = r;
  });

  const gridContent = lotteryTypes.length === 0
    ? emptyStateTemplate()
    : lotteryTypes.map(lt => lotteryCardTemplate(lt, manualMode, roundMap[lt.id] || null)).join('');

  return `
    <div class="lottery-select-wrapper">
      <div class="lottery-select-header">
        <i class="bi bi-ticket-perforated-fill"></i>
        <h2>เลือกประเภทหวย</h2>
        <p>กรุณาเลือกประเภทหวยที่ต้องการคีย์</p>
      </div>
      <div class="lottery-type-grid" id="lottery-type-grid">
        ${gridContent}
      </div>
    </div>
  `;
}
