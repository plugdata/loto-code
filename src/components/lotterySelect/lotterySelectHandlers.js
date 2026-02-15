// ─── Event Handlers ─────────────────────────

export function getRemaining(closeTime) {
  const [h, m] = closeTime.split(':').map(Number);
  const now = new Date();
  const close = new Date();
  close.setHours(h, m, 0, 0);
  const diff = close - now;
  return diff > 0 ? diff : 0;
}

export function formatCountdown(ms) {
  if (ms <= 0) return null;
  const totalSec = Math.floor(ms / 1000);
  const hours = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  const pad = n => String(n).padStart(2, '0');
  return `${pad(hours)}:${pad(mins)}:${pad(secs)}`;
}

export function markCardClosed(card) {
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

export function startCountdownTimer(container, manualMode) {
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
