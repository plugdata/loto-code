// ─── Main Render ────────────────────────────

import { api } from '../../api/apiClient.js';
import { showToast } from '../../js/toast.js';
import { navigate } from '../../js/router.js';
import { initTimer, stopTimer } from '../../js/timer.js';
import { state } from './keyState.js';
import { unauthorizedTemplate, pageTemplate } from './keyTemplates.js';
import { mapTransaction, updateInputFields, handleKeyDown } from './keyHandlers.js';
import { initKeyPageEvents } from './keyEvents.js';

// ─── API / Data Fetching ─────────────────────

async function validateLotteryType(typeCode) {
  try {
    const checkRes = await api.lotteryTypes.check(typeCode);
    if (!checkRes.data?.exists) {
      showToast('ไม่พบประเภทหวยนี้', 'error');
      return null;
    }
    if (!checkRes.data?.isOpen) {
      showToast(`${checkRes.data.name || 'หวยนี้'} ปิดรับแล้ว`, 'warning');
      return null;
    }
    return checkRes.data;
  } catch {
    showToast('ไม่สามารถตรวจสอบประเภทหวยได้', 'error');
    return null;
  }
}

async function fetchKeyPageData() {
  const [txRes, custRes, settingsRes, btRes] = await Promise.all([
    api.transactions.get(),
    api.customers.get(),
    api.settings.get(),
    api.betTypes.get(),
  ]);
  return { txRes, custRes, settingsRes, btRes };
}

// ─── Main Render (Export) ────────────────────

export async function renderKeyPage(container, params = {}) {
  const typeCode = params.type;
  if (!typeCode) { navigate('select'); return; }

  const lotteryType = await validateLotteryType(typeCode);
  if (!lotteryType) { navigate('select'); return; }
  state.currentLotteryType = lotteryType;

  const { txRes, custRes, settingsRes, btRes } = await fetchKeyPageData();

  if (!txRes || !txRes.success) {
    const message = txRes?.message === 'Unauthorized'
      ? 'เซสชันของคุณหมดอายุหรือยังไม่ได้เข้าสู่ระบบ'
      : 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้';
    container.innerHTML = unauthorizedTemplate(message);
    return;
  }

  // Populate state
  state.transactions = (txRes.data || []).map(mapTransaction);
  state.customers = custRes.data || [];
  state.settings = settingsRes.data || {};
  state.autoReverse = state.settings.autoReverse || false;

  state.betTypes2Digit = btRes.data?.digit2 || [];
  state.betTypes3Digit = btRes.data?.digit3 || [];
  state.specialTypes = btRes.data?.special || [];
  state.allBetTypes = [...state.betTypes2Digit, ...state.betTypes3Digit, ...state.specialTypes];
  state.currentBetType = state.currentBetType || state.allBetTypes.find(t => t.key === 'R') || state.allBetTypes[0];

  // Render
  container.innerHTML = pageTemplate();
  initKeyPageEvents(container);
  updateInputFields();
  setTimeout(() => document.getElementById('input-number')?.focus(), 100);

  if (state.currentLotteryType?.closeTime) {
    initTimer(state.currentLotteryType.closeTime);
  }
}

// ─── Cleanup (Export) ────────────────────────

export function cleanupKeyPage() {
  document.removeEventListener('keydown', handleKeyDown);
  stopTimer();
}
