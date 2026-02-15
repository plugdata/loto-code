// ─── Templates ──────────────────────────────

import { state } from './keyState.js';

export function unauthorizedTemplate(message) {
  return `
    <div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: var(--bg-main);">
      <div class="settings-card" style="border-top: 4px solid var(--color-error); text-align: center; padding: 40px; max-width: 400px; width: 90%;">
        <i class="bi bi-shield-lock" style="font-size: 3rem; color: var(--color-error); margin-bottom: 20px; display: block;"></i>
        <h2 style="color: var(--color-error);">กรุณาเข้าสู่ระบบ</h2>
        <p style="color: var(--text-muted); margin-bottom: 20px;">${message}</p>
        <button class="btn-add" onclick="window.location.hash='#login';window.location.reload();" style="justify-content: center; width: 100%;">
          <i class="bi bi-box-arrow-in-right"></i> ไปหน้าเข้าสู่ระบบ
        </button>
      </div>
    </div>
  `;
}

export function transactionRowsTemplate(txs) {
  if (!txs.length) {
    return '<tr><td colspan="6" style="text-align:center; color: var(--text-muted); padding: 30px;">ยังไม่มีรายการ</td></tr>';
  }
  return txs.map(tx => `
    <tr data-id="${tx.id}">
      <td>${tx.time}</td>
      <td>${tx.type}</td>
      <td style="font-weight: 700; color: #1b5e20;">${tx.number}</td>
      <td>${tx.user}</td>
      <td style="color: var(--color-success); font-weight: 600;">${tx.amount.toLocaleString()}</td>
      <td>
        <button class="btn-action btn-delete" data-delete="${tx.id}">
          <i class="bi bi-trash"></i> ลบ
        </button>
      </td>
    </tr>
  `).join('');
}

export function pageTemplate() {
  return `
    <div class="main-content">
      <!-- LEFT SIDEBAR: 2-DIGITS -->
      <div class="sidebar" id="sidebar-left">
        <div class="lottery-type-badge-sidebar">
          <i class="bi ${state.currentLotteryType.icon || 'bi-ticket-perforated'}"></i>
          <span>${state.currentLotteryType.name}</span>
          <button class="btn-change-type" id="btn-change-type" title="เปลี่ยนประเภทหวย">
            <i class="bi bi-arrow-left-right"></i>
          </button>
        </div>
        <div class="sidebar-title">
          <i class="bi bi-grid-3x3-gap-fill"></i> 2-DIGITS
        </div>
        ${state.betTypes2Digit.map(bt => `
          <button class="bet-type-btn ${bt.key === state.currentBetType?.key ? 'active' : ''}"
                  data-key="${bt.key}" data-type="2digit">
            <span class="shortcut">${bt.shortcut}</span>
            ${bt.label}
          </button>
        `).join('')}
      </div>

      <!-- CENTER PANEL -->
      <div class="center-panel">
        <div class="customer-section">
          <label>SELECT CUSTOMER</label>
          <select class="customer-select" id="customer-select">
            ${state.customers.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
          </select>
          <button class="btn-toggle-mode ${state.autoReverse ? 'active' : ''}" id="btn-reverse" title="กลับหน้าหลัง">
            <i class="bi bi-arrow-left-right"></i> กลับหน้าหลัง
          </button>
          <button class="btn-toggle-mode" id="btn-mode-toggle">
            เล็ง-โต๊ด-3ล่าง (z)
          </button>
        </div>

        <div class="input-area">
          <div class="input-row" id="input-row">
            <div class="input-group-custom">
              <label>NUMBER</label>
              <input type="text" class="input-number" id="input-number"
                     maxlength="3" placeholder="00" autocomplete="off" inputmode="numeric">
            </div>
            <div class="input-group-custom">
              <label id="label-bon">บน</label>
              <input type="text" class="input-amount" id="input-bon"
                     placeholder="เงิน" autocomplete="off" inputmode="numeric">
            </div>
            <div class="input-group-custom">
              <label id="label-tode">โต๊ด</label>
              <input type="text" class="input-amount" id="input-tode"
                     placeholder="เงิน" autocomplete="off" inputmode="numeric">
            </div>
            <div class="input-group-custom">
              <label id="label-lang">3ล่าง</label>
              <input type="text" class="input-amount" id="input-lang"
                     placeholder="เงิน" autocomplete="off" inputmode="numeric">
            </div>
          </div>

          <button class="btn-submit" id="btn-submit">
            บันทึกรายการ (ENTER)
          </button>

          <div class="shortcut-hint">
            <span>ระบุจดหมายเลข</span> &nbsp; กดหมเลข > ENTER > กดหเงิน > ENTER
          </div>
        </div>

        <!-- Active Transactions -->
        <div class="transactions-section">
          <div class="transactions-header">
            <h3><i class="bi bi-lightning-fill"></i> ACTIVE TRANSACTIONS</h3>
            <div class="bill-count">
              <span class="bill-badge wiping" id="wiping-badge">WIPING: --</span>
              <span class="bill-badge total" id="total-bills">${state.transactions.length} BILLS</span>
              <button class="btn-print" id="btn-print-bill">
                <i class="bi bi-printer"></i> ปริ้นบิล
              </button>
            </div>
          </div>
          <table class="transactions-table">
            <thead>
              <tr>
                <th>TIME</th>
                <th>TYPE</th>
                <th>NUMBER</th>
                <th>USER</th>
                <th>AMOUNT</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody id="tx-tbody">
              ${transactionRowsTemplate(state.transactions)}
            </tbody>
          </table>
        </div>
      </div>

      <!-- RIGHT SIDEBAR: 3-DIGITS -->
      <div class="sidebar" id="sidebar-right">
        <div class="sidebar-title">
          <i class="bi bi-grid-3x3-gap-fill"></i> 3-DIGITS
        </div>
        ${state.betTypes3Digit.map(bt => `
          <button class="bet-type-btn ${bt.key === state.currentBetType?.key ? 'active' : ''}"
                  data-key="${bt.key}" data-type="3digit">
            <span class="shortcut">${bt.shortcut}</span>
            ${bt.label}
          </button>
        `).join('')}
        ${state.specialTypes.map(bt => `
          <button class="bet-type-btn ${bt.key === state.currentBetType?.key ? 'active' : ''}"
                  data-key="${bt.key}" data-type="special"
                  style="border-top: 1px solid var(--border-color); margin-top: 4px;">
            <span class="shortcut">${bt.shortcut}</span>
            ${bt.label}
          </button>
        `).join('')}
      </div>
    </div>
  `;
}
