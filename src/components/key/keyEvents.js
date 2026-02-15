// ─── Event Binding ──────────────────────────

import { navigate } from '../../js/router.js';
import { showToast } from '../../js/toast.js';
import { state } from './keyState.js';
import {
  handleBetTypeSelect,
  handleKeyDown,
  handleSubmit,
  handleDeleteTransaction,
  handlePrint,
} from './keyHandlers.js';

export function initKeyPageEvents(container) {
  // Bet type selection
  container.querySelectorAll('.bet-type-btn').forEach(btn => {
    btn.addEventListener('click', () => handleBetTypeSelect(btn.dataset.key, container));
  });

  // Auto reverse toggle
  document.getElementById('btn-reverse')?.addEventListener('click', () => {
    state.autoReverse = !state.autoReverse;
    document.getElementById('btn-reverse')?.classList.toggle('active', state.autoReverse);
    showToast(state.autoReverse ? 'เปิดกลับหน้าหลัง' : 'ปิดกลับหน้าหลัง', state.autoReverse ? 'success' : 'warning');
  });

  // Submit & print
  document.getElementById('btn-submit')?.addEventListener('click', handleSubmit);
  document.getElementById('btn-print-bill')?.addEventListener('click', handlePrint);

  // Global keyboard shortcuts
  document.addEventListener('keydown', handleKeyDown);

  // Delete transaction (delegated)
  container.querySelector('#tx-tbody')?.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('[data-delete]');
    if (deleteBtn) handleDeleteTransaction(parseInt(deleteBtn.dataset.delete));
  });

  // Number input: auto-advance on full length
  const inputNumber = document.getElementById('input-number');
  inputNumber?.addEventListener('input', (e) => {
    const val = e.target.value.replace(/\D/g, '');
    e.target.value = val;
    if (val.length >= parseInt(e.target.maxLength)) {
      document.getElementById('input-bon')?.focus();
    }
  });

  // Amount inputs: numeric only + Enter to submit
  ['input-bon', 'input-tode', 'input-lang'].forEach(id => {
    const el = document.getElementById(id);
    el?.addEventListener('input', (e) => { e.target.value = e.target.value.replace(/\D/g, ''); });
    el?.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); handleSubmit(); } });
  });

  // Change lottery type
  document.getElementById('btn-change-type')?.addEventListener('click', () => navigate('select'));
}
