// ===== SUMMARY PAGE - สรุปยอด =====

// ─── Imports ─────────────────────────────────
import { api } from '../api/apiClient.js';

// ─── Utilities ───────────────────────────────

function mapTransaction(tx) {
  return {
    id: tx.id,
    time: tx.created_at ? tx.created_at.split(' ')[1] || tx.created_at : '',
    type: tx.bet_type_label || '',
    number: tx.number,
    user: tx.user_name || tx.user || '',
    amount: tx.amount,
    customer: tx.customer_name || tx.customer || '',
  };
}

// ─── Templates ───────────────────────────────

function summaryCardsTemplate(summary) {
  return `
    <div class="summary-grid">
      <div class="summary-card">
        <div class="icon" style="color: var(--color-accent);"><i class="bi bi-receipt"></i></div>
        <div class="value">${summary.totalBills}</div>
        <div class="label">จำนวนบิล</div>
      </div>
      <div class="summary-card">
        <div class="icon" style="color: var(--color-success);"><i class="bi bi-cash-stack"></i></div>
        <div class="value">${(summary.totalAmount || 0).toLocaleString()}</div>
        <div class="label">ยอดรวม (บาท)</div>
      </div>
      <div class="summary-card">
        <div class="icon" style="color: var(--color-info);"><i class="bi bi-person-check"></i></div>
        <div class="value">${summary.totalCustomers}</div>
        <div class="label">จำนวนลูกค้า</div>
      </div>
      <div class="summary-card">
        <div class="icon" style="color: var(--color-warning);"><i class="bi bi-star-fill"></i></div>
        <div class="value">${(summary.topNumbers || []).length}</div>
        <div class="label">เลขยอดนิยม</div>
      </div>
    </div>
  `;
}

function topNumbersTemplate(topNumbers) {
  if (!topNumbers.length) {
    return '<p style="color: var(--text-muted); text-align: center;">ยังไม่มีข้อมูล</p>';
  }
  return `
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 10px;">
      ${topNumbers.map((n, i) => `
        <div style="
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 12px;
          text-align: center;
        ">
          <div style="font-size: 0.65rem; color: var(--text-muted);">#${i + 1}</div>
          <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-accent);">${n.number}</div>
          <div style="font-size: 0.8rem; color: var(--color-success);">${n.total.toLocaleString()} ฿</div>
        </div>
      `).join('')}
    </div>
  `;
}

function transactionsTableTemplate(transactions) {
  const rows = transactions.length
    ? transactions.map((tx, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${tx.time}</td>
          <td>${tx.type}</td>
          <td style="font-weight: 700; color: var(--color-accent);">${tx.number}</td>
          <td>${tx.customer}</td>
          <td>${tx.user}</td>
          <td style="color: var(--color-success); font-weight: 600;">${tx.amount.toLocaleString()}</td>
        </tr>
      `).join('')
    : '<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 30px;">ยังไม่มีรายการ</td></tr>';

  return `
    <table class="user-table">
      <thead>
        <tr>
          <th>#</th>
          <th>เวลา</th>
          <th>ประเภท</th>
          <th>เลข</th>
          <th>ลูกค้า</th>
          <th>ผู้คีย์</th>
          <th>จำนวน</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function pageTemplate(summary, transactions) {
  return `
    <div class="settings-container">
      <h2 style="color: var(--color-accent); margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
        <i class="bi bi-bar-chart-fill"></i> สรุปยอด
      </h2>

      ${summaryCardsTemplate(summary)}

      <div class="settings-card">
        <div class="settings-card-header">
          <h3><i class="bi bi-trophy-fill"></i> เลขยอดนิยม (Top 10)</h3>
        </div>
        <div class="settings-card-body">
          ${topNumbersTemplate(summary.topNumbers || [])}
        </div>
      </div>

      <div class="settings-card">
        <div class="settings-card-header">
          <h3><i class="bi bi-list-ul"></i> รายการทั้งหมด</h3>
          <span style="font-size: 0.75rem; color: var(--text-muted);">${transactions.length} รายการ</span>
        </div>
        <div style="overflow-x: auto;">
          ${transactionsTableTemplate(transactions)}
        </div>
      </div>
    </div>
  `;
}

// ─── API / Data Fetching ─────────────────────

async function fetchSummaryData() {
  const [summaryRes, txRes] = await Promise.all([
    api.summary.get(),
    api.transactions.get(),
  ]);

  const summary = summaryRes.data || { totalBills: 0, totalAmount: 0, totalCustomers: 0, topNumbers: [] };
  const transactions = (txRes.data || []).map(mapTransaction);

  return { summary, transactions };
}

// ─── Main Render (Export) ────────────────────

export async function renderSummaryPage(container) {
  const { summary, transactions } = await fetchSummaryData();
  container.innerHTML = pageTemplate(summary, transactions);
}
