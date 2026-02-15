// ─── Main Render ────────────────────────────

import { loginTemplate } from './loginTemplates.js';
import { initLoginEvents } from './loginEvents.js';

export function renderLoginPage(container) {
  container.innerHTML = loginTemplate();
  initLoginEvents();
}
