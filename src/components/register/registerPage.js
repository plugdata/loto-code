// ─── Main Render ────────────────────────────

import { registerTemplate } from './registerTemplates.js';
import { initRegisterEvents } from './registerEvents.js';

export function renderRegisterPage(container) {
  container.innerHTML = registerTemplate();
  initRegisterEvents();
}
