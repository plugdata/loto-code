// ─── Main Render ────────────────────────────

import { api } from '../../api/apiClient.js';
import { accessDeniedTemplate, errorTemplate, pageTemplate } from './settingsTemplates.js';
import { initSettingsEvents } from './settingsEvents.js';

export async function renderSettingsPage(container) {
  // Admin-only guard
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'admin') {
      container.innerHTML = accessDeniedTemplate();
      return;
    }
  } catch {}

  const [res, ltRes, roundsRes] = await Promise.all([
    api.settings.get(),
    api.lotteryTypes.get().catch(() => ({ data: [] })),
    api.rounds.get().catch(() => ({ data: [] })),
  ]);
  const lotteryTypes = ltRes.data || [];
  const rounds = roundsRes.data || [];

  // Auto-close งวดที่เลยวันที่กำหนดแล้ว
  const today = new Date().toISOString().slice(0, 10);
  const expiredOpen = rounds.filter(r =>
    r.status === 'open' && new Date(r.roundDate).toISOString().slice(0, 10) < today
  );
  if (expiredOpen.length > 0) {
    await Promise.all(
      expiredOpen.map(r => api.rounds.update(r.id, { status: 'closed' }).catch(() => {}))
    );
    // อัปเดตสถานะใน array เดิม
    expiredOpen.forEach(r => { r.status = 'closed'; });
  }

  if (!res || !res.success || !res.data) {
    const message = res?.message === 'Unauthorized'
      ? 'กรุณาเข้าสู่ระบบด้วยสิทธิ์ผู้ดูแลระบบ'
      : res?.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์';
    container.innerHTML = errorTemplate(message);
    return;
  }

  const settings = res.data;

  container.innerHTML = pageTemplate(settings, lotteryTypes, rounds);
  initSettingsEvents(container, settings, lotteryTypes, renderSettingsPage);
}
