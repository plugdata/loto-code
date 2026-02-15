// ─── Event Binding ──────────────────────────

import { navigate } from '../../js/router.js';
import { showToast } from '../../js/toast.js';

export function initCardClickEvents(container) {
  container.querySelectorAll('.lottery-type-card').forEach(card => {
    card.addEventListener('click', () => {
      if (card.classList.contains('disabled')) {
        showToast('หวยนี้ปิดรับแล้ว', 'warning');
        return;
      }
      navigate(`key?type=${card.dataset.code}`);
    });
  });
}
