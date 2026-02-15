// ─── Event Binding ──────────────────────────

import {
  handleRoundDateChange,
  handleRoundLtChange,
  handleCreateRound,
  handleCloseRound,
  handleDeleteRound,
  handleHistoryFilter,
  handleHistoryPrev,
  handleHistoryNext,
  renderHistoryPage,
  handleToggleLottery,
  handleSaveTime,
  handleSaveRates,
  handleSaveLimits,
  handleToggleReverse,
  handleAddRestricted,
  handleAddRestrictedReverse,
  handleRemoveRestrictedById,
  handleRestrictedLtFilter,
  initRestrictedSearch,
  handleRatesLtFilter,
  handleLimitsLtFilter,
  handleToggleManualMode,
  handleToggleLotteryType,
  handleDeleteLotteryType,
  handleAddLotteryType,
  handleSaveLotteryTypeTime,
  handleShowLotteryTypeLogs,
  initThaiDatePicker,
} from './settingsHandlers.js';

export function initSettingsEvents(container, settings, lotteryTypes, renderCallback) {
  // === Round Management Events ===
  initThaiDatePicker();
  document.getElementById('round-date')?.addEventListener('change', handleRoundDateChange);
  document.getElementById('round-lt-select')?.addEventListener('change', handleRoundLtChange);
  document.getElementById('btn-create-round')?.addEventListener('click', () => {
    handleCreateRound(container, lotteryTypes, renderCallback);
  });

  container.querySelectorAll('.round-close').forEach(btn => {
    btn.addEventListener('click', () => handleCloseRound(parseInt(btn.dataset.roundId), container, renderCallback));
  });

  container.querySelectorAll('.round-delete').forEach(btn => {
    btn.addEventListener('click', () => handleDeleteRound(parseInt(btn.dataset.roundId), container, renderCallback));
  });

  // History: ลบงวดที่ปิดแล้ว (พร้อมส่งข้อมูลงวดไป log)
  container.querySelectorAll('.round-delete-history').forEach(btn => {
    const item = btn.closest('.round-item');
    const roundInfo = {
      roundNumber: item?.dataset.roundNumber,
      roundDate: item?.dataset.roundDate,
      ltName: item?.dataset.ltName,
      txCount: item?.dataset.txCount,
    };
    btn.addEventListener('click', () => handleDeleteRound(parseInt(btn.dataset.roundId), container, renderCallback, roundInfo));
  });

  document.getElementById('history-lt-filter')?.addEventListener('change', (e) => handleHistoryFilter(e, container));

  // History pagination
  document.getElementById('history-prev')?.addEventListener('click', () => handleHistoryPrev(container));
  document.getElementById('history-next')?.addEventListener('click', () => handleHistoryNext(container));
  renderHistoryPage(container);

  // === Existing Settings Events ===
  document.getElementById('toggle-lottery')?.addEventListener('change', handleToggleLottery);
  document.getElementById('btn-save-time')?.addEventListener('click', handleSaveTime);
  document.getElementById('btn-save-rates')?.addEventListener('click', () => handleSaveRates(settings));
  document.getElementById('btn-save-limits')?.addEventListener('click', handleSaveLimits);
  document.getElementById('toggle-reverse')?.addEventListener('change', handleToggleReverse);

  // Rates & Limits: lottery type filter
  document.getElementById('rates-lt-filter')?.addEventListener('change', handleRatesLtFilter);
  document.getElementById('limits-lt-filter')?.addEventListener('change', handleLimitsLtFilter);

  document.getElementById('btn-add-restricted')?.addEventListener('click', () => {
    handleAddRestricted(container);
  });
  document.getElementById('btn-add-restricted-reverse')?.addEventListener('click', () => {
    handleAddRestrictedReverse(container);
  });

  // Restricted numbers: lottery type filter + search dropdown
  document.getElementById('restricted-lt-filter')?.addEventListener('change', handleRestrictedLtFilter);
  initRestrictedSearch();

  // Restricted numbers: remove by ID
  container.querySelectorAll('[data-remove-id]').forEach(btn => {
    btn.addEventListener('click', () => handleRemoveRestrictedById(parseInt(btn.dataset.removeId)));
  });

  // Manual mode toggle
  document.getElementById('toggle-manual-mode')?.addEventListener('change', handleToggleManualMode);

  // Lottery type toggle
  container.querySelectorAll('.lt-toggle').forEach(toggle => {
    toggle.addEventListener('change', handleToggleLotteryType);
  });

  // Lottery type delete
  container.querySelectorAll('.lt-delete').forEach(btn => {
    btn.addEventListener('click', () => handleDeleteLotteryType(parseInt(btn.dataset.ltId), container, renderCallback));
  });

  // Add lottery type
  document.getElementById('btn-add-lt')?.addEventListener('click', () => {
    handleAddLotteryType(container, renderCallback);
  });

  // Time 24h input masking (auto-format HH:MM, digits only)
  container.querySelectorAll('.time-24h').forEach(input => {
    input.addEventListener('input', (e) => {
      let v = e.target.value.replace(/[^0-9]/g, '');
      if (v.length >= 3) v = v.slice(0, 2) + ':' + v.slice(2, 4);
      e.target.value = v.slice(0, 5);
    });
    input.addEventListener('blur', (e) => {
      const m = e.target.value.match(/^(\d{1,2}):(\d{2})$/);
      if (m) {
        const hh = Math.min(parseInt(m[1]), 23);
        const mm = Math.min(parseInt(m[2]), 59);
        e.target.value = String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0');
      }
    });
  });

  // Lottery type time edit - show save button on change
  container.querySelectorAll('.lt-open-time, .lt-close-time').forEach(input => {
    input.addEventListener('input', () => {
      const ltId = input.dataset.ltId;
      const item = container.querySelector(`.lottery-type-item[data-id="${ltId}"]`);
      const saveBtn = item?.querySelector('.lt-save-time');
      if (saveBtn) saveBtn.style.display = '';
    });
  });

  // Lottery type time save
  container.querySelectorAll('.lt-save-time').forEach(btn => {
    btn.addEventListener('click', () => {
      handleSaveLotteryTypeTime(parseInt(btn.dataset.ltId), container, renderCallback);
    });
  });

  // Lottery type show logs
  container.querySelectorAll('.lt-show-logs').forEach(btn => {
    btn.addEventListener('click', () => {
      handleShowLotteryTypeLogs(parseInt(btn.dataset.ltId), btn.dataset.ltName);
    });
  });
}
