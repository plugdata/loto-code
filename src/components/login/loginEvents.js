// ─── Event Binding ──────────────────────────

import { togglePasswordVisibility, handleLoginSubmit } from './loginHandlers.js';

export function initLoginEvents() {
  togglePasswordVisibility('toggle-password', 'login-password');
  document.getElementById('login-form')?.addEventListener('submit', handleLoginSubmit);
}
