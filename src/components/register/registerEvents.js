// ─── Event Binding ──────────────────────────

import { togglePasswordVisibility, handleRegisterSubmit } from './registerHandlers.js';

export function initRegisterEvents() {
  togglePasswordVisibility('toggle-reg-pw', 'reg-password');
  togglePasswordVisibility('toggle-reg-confirm', 'reg-confirm');
  document.getElementById('register-form')?.addEventListener('submit', handleRegisterSubmit);
}
