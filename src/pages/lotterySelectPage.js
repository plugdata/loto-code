// ===== LOTTERY SELECT PAGE - เลือกประเภทหวย =====

// ─── Imports ─────────────────────────────────
import { api } from '../api/apiClient.js';
import { navigate } from '../js/router.js';
import { showToast } from '../js/toast.js';

// ─── Utilities ───────────────────────────────

function getRemaining(closeTime) {
  const [h, m] = closeTime.split(':').map(Number);
  const now = new Date();
  const close = new Date();
  close.setHours(h, m, 0, 0);
  const diff = close - now;
  return diff > 0 ? diff : 0;
}

function formatCountdown(ms) {
  if (ms <= 0) return null;
  const totalSec = Math.floor(ms / 1000);
  const hours = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  const pad = n => String(n).padStart(2, '0');
  return `${pad(hours)}:${pad(mins)}:${pad(secs)}`;
}

function markCardClosed(card) {
  if (card.classList.contains('disabled')) return;
  card.classList.add('disabled');

  const statusEl = card.querySelector('.lottery-type-status');
  if (statusEl) {
    statusEl.className = 'lottery-type-status closed';
    statusEl.innerHTML = '<i class="bi bi-x-circle-fill"></i> ปิดรับ';
  }

  const countdownEl = card.querySelector('.lottery-countdown');
  if (countdownEl) {
    countdownEl.innerHTML = '<i class="bi bi-lock-fill"></i> หมดเวลา';
    countdownEl.classList.add('expired');
  }
}

// ─── Templates ───────────────────────────────

function emptyStateTemplate() {
  return `
    <div style="width: 100%; text-align: center; padding: 60px 20px; color: var(--text-muted);">
      <i class="bi bi-inbox" style="font-size: 3rem; display: block; margin-bottom: 16px; opacity: 0.5;"></i>
      <p style="font-size: 1rem;">ยังไม่มีประเภทหวย</p>
      <p style="font-size: 0.85rem;">กรุณาเพิ่มประเภทหวยในหน้าตั้งค่า</p>
    </div>
  `;
}

function lotteryCardTemplate(lt, manualMode) {
  const remaining = manualMode ? 0 : (lt.isOpen ? getRemaining(lt.closeTime) : 0);
  const isExpired = manualMode ? !lt.isOpen : (!lt.isOpen || remaining <= 0);
  const countdownText = (!manualMode && !isExpired) ? formatCountdown(remaining) : null;

  const countdownContent = isExpired
    ? (manualMode
      ? '<i class="bi bi-hand-index-thumb"></i> ปิดโดย Admin'
      : '<i class="bi bi-lock-fill"></i> หมดเวลา')
    : (manualMode
      ? '<i class="bi bi-hand-index-thumb"></i> เปิดโดย Admin'
      : `<i class="bi bi-hourglass-split"></i> <span class="countdown-value">${countdownText}</span>`);

  const statusContent = isExpired
    ? '<i class="bi bi-x-circle-fill"></i> ปิดรับ'
    : '<i class="bi bi-check-circle-fill"></i> เปิดรับ';

  return `
    <div class="lottery-type-card ${isExpired ? 'disabled' : ''}"
         data-code="${lt.code}" data-close-time="${lt.closeTime}" data-manual="${manualMode}">
      <div class="lottery-type-icon">
        <i class="bi ${lt.icon || 'bi-ticket-perforated'}"></i>
      </div>
      <div class="lottery-type-name">${lt.name}</div>
      <div class="lottery-type-time">
        <i class="bi bi-clock"></i> ${lt.openTime} - ${lt.closeTime}
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

function pageTemplate(lotteryTypes, manualMode) {
  const gridContent = lotteryTypes.length === 0
    ? emptyStateTemplate()
    : lotteryTypes.map(lt => lotteryCardTemplate(lt, manualMode)).join('');

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

// ─── API / Data Fetching ─────────────────────

async function fetchLotteryData() {
  try {
    const [ltRes, settingsRes] = await Promise.all([
      api.lotteryTypes.get(),
      api.settings.get().catch(() => ({ data: {} })),
    ]);
    return {
      lotteryTypes: ltRes.data || [],
      manualMode: settingsRes.data?.manualMode ?? false,
    };
  } catch {
    return { lotteryTypes: [], manualMode: false };
  }
}

// ─── Feature: Countdown Timer ────────────────

function startCountdownTimer(container, manualMode) {
  if (manualMode) return;

  const cards = container.querySelectorAll('.lottery-type-card[data-close-time]');
  const intervalId = setInterval(() => {
    if (!container.isConnected) { clearInterval(intervalId); return; }

    cards.forEach(card => {
      if (card.classList.contains('disabled')) return;

      const remaining = getRemaining(card.dataset.closeTime);
      if (remaining <= 0) { markCardClosed(card); return; }

      const valueEl = card.querySelector('.countdown-value');
      if (valueEl) valueEl.textContent = formatCountdown(remaining);

      const countdownEl = card.querySelector('.lottery-countdown');
      if (countdownEl) {
        if (remaining <= 5 * 60 * 1000) countdownEl.classList.add('urgent');
        else if (remaining <= 15 * 60 * 1000) countdownEl.classList.add('warning');
      }
    });
  }, 1000);
}

// ─── Event Binding ───────────────────────────

function initCardClickEvents(container) {
  container.querySelectorAll('.lottery-type-card').forEach(card => {
    card.addEventListener('click', () => {
      if (card.classList.contains('disabled')) {
        showToast('หวยนี้ปิดรับแล้ว', 'warning');
        return;
      }
      navigate(`key?type=${card.dataset.code}`);
    });
  });
}

// ─── Main Render (Export) ────────────────────

export async function renderLotterySelectPage(container) {
  const { lotteryTypes, manualMode } = await fetchLotteryData();

  container.innerHTML = pageTemplate(lotteryTypes, manualMode);
  startCountdownTimer(container, manualMode);
  initCardClickEvents(container);
}
