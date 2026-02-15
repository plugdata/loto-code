// ─── Main Render ────────────────────────────

import { api } from '../../api/apiClient.js';
import { pageTemplate } from './lotterySelectTemplates.js';
import { startCountdownTimer } from './lotterySelectHandlers.js';
import { initCardClickEvents } from './lotterySelectEvents.js';

async function fetchLotteryData() {
  try {
    const [ltRes, settingsRes, roundsRes] = await Promise.all([
      api.lotteryTypes.get(),
      api.settings.get().catch(() => ({ data: {} })),
      api.rounds.getOpen().catch(() => ({ data: [] })),
    ]);
    return {
      lotteryTypes: ltRes.data || [],
      manualMode: settingsRes.data?.manualMode ?? false,
      openRounds: roundsRes.data || [],
    };
  } catch {
    return { lotteryTypes: [], manualMode: false, openRounds: [] };
  }
}

export async function renderLotterySelectPage(container) {
  const { lotteryTypes, manualMode, openRounds } = await fetchLotteryData();

  container.innerHTML = pageTemplate(lotteryTypes, manualMode, openRounds);
  startCountdownTimer(container, manualMode);
  initCardClickEvents(container);
}
