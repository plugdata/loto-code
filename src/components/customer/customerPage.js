// ===== CUSTOMER PAGE - จัดการลูกค้า =====

import { api } from '../../api/apiClient.js';
import { errorTemplate, pageTemplate } from './customerTemplates.js';
import { initCustomerEvents } from './customerEvents.js';

// ─── Main Render (Export) ────────────────────

export async function renderCustomerPage(container) {
  const res = await api.customers.get();

  if (!res || !res.success || !res.data) {
    const message = res?.message === 'Unauthorized'
      ? 'กรุณาเข้าสู่ระบบก่อนใช้งาน'
      : res?.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์';
    container.innerHTML = errorTemplate(message);
    return;
  }

  container.innerHTML = pageTemplate(res.data);
  initCustomerEvents(container, renderCustomerPage);
}
