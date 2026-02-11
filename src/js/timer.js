// ===== COUNTDOWN TIMER =====
// รูปแบบเวลา: "HH:MM" เสมอ (ตรงกับ backend openTime/closeTime และ <input type="time">)
let timerInterval = null;
let targetTime = null;

/**
 * เริ่มนับถอยหลังไปยังเวลาที่กำหนด
 * @param {string} closingTime - เวลาปิด format "HH:MM" (เช่น "14:30")
 */
export function initTimer(closingTime = '14:30') {
  // Normalize: รับได้ทั้ง "14:30" และ "14:30:00"
  const parts = closingTime.split(':').map(Number);
  const hours = parts[0] || 0;
  const minutes = parts[1] || 0;

  const now = new Date();
  targetTime = new Date(now);
  targetTime.setHours(hours, minutes, 0, 0);

  // ถ้าเวลาปิดผ่านไปแล้ววันนี้ → แสดง 00:00:00 (ไม่ข้ามวัน)
  updateDisplay();
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(updateDisplay, 1000);
}

function updateDisplay() {
  const el = document.getElementById('countdown-timer');
  if (!el) return;

  if (!targetTime) {
    el.textContent = '--:--:--';
    el.style.color = '';
    return;
  }

  const now = new Date();
  const diff = targetTime - now;

  if (diff <= 0) {
    el.textContent = '00:00:00';
    el.style.color = '#ef5350';
    return;
  }

  // Warning color เมื่อเหลือน้อยกว่า 15 นาที
  if (diff < 900000) {
    el.style.color = '#ff9800';
  } else {
    el.style.color = '';
  }

  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  el.textContent =
    `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  targetTime = null;
  const el = document.getElementById('countdown-timer');
  if (el) {
    el.textContent = '--:--:--';
    el.style.color = '';
  }
}
