// ─── Main Render ────────────────────────────

import { api } from '../../api/apiClient.js';
import { accessDeniedTemplate, errorTemplate, pageTemplate } from './usersTemplates.js';
import { isAdmin } from './usersHandlers.js';
import { initUserEvents } from './usersEvents.js';

export async function renderUsersPage(container) {
  if (!isAdmin()) {
    container.innerHTML = accessDeniedTemplate();
    return;
  }

  const res = await api.users.get();

  if (!res || !res.success || !res.data) {
    const message = res?.message === 'Unauthorized'
      ? 'กรุณาเข้าสู่ระบบก่อนใช้งาน'
      : res?.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์';
    container.innerHTML = errorTemplate(message);
    return;
  }

  const users = res.data.map(u => ({
    ...u,
    status: u.status || 'offline',
    displayName: u.displayName || u.username,
  }));

  container.innerHTML = pageTemplate(users);
  initUserEvents(container, users, renderUsersPage);
}
