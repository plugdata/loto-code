// ===== KEY PAGE - หน้าคีย์หวย (Main Page) =====

// ─── Imports ─────────────────────────────────
import { api } from '../api/apiClient.js';
import { showToast } from '../js/toast.js';
import { navigate } from '../js/router.js';
import { initTimer, stopTimer } from '../js/timer.js';

// ─── State ───────────────────────────────────
let betTypes2Digit = [];
let betTypes3Digit = [];
let specialTypes = [];
let allBetTypes = [];
let currentBetType = null;
let transactions = [];
let customers = [];
let autoReverse = false;
let settings = {};
let currentLotteryType = null;

// ─── Utilities ───────────────────────────────

function reverseNumber(num) {
  return num.split('').reverse().join('');
}

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

function unauthorizedTemplate(message) {
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

function transactionRowsTemplate(txs) {
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

function betTypeButtonsTemplate(types, extraStyle = '') {
  return types.map(bt => `
    <button class="bet-type-btn ${bt.key === currentBetType?.key ? 'active' : ''}"
            data-key="${bt.key}" data-type="${bt.category || '2digit'}"
            ${extraStyle ? `style="${extraStyle}"` : ''}>
      <span class="shortcut">${bt.shortcut}</span>
      ${bt.label}
    </button>
  `).join('');
}

function pageTemplate() {
  return `
    <div class="main-content">
      <!-- LEFT SIDEBAR: 2-DIGITS -->
      <div class="sidebar" id="sidebar-left">
        <div class="lottery-type-badge-sidebar">
          <i class="bi ${currentLotteryType.icon || 'bi-ticket-perforated'}"></i>
          <span>${currentLotteryType.name}</span>
          <button class="btn-change-type" id="btn-change-type" title="เปลี่ยนประเภทหวย">
            <i class="bi bi-arrow-left-right"></i>
          </button>
        </div>
        <div class="sidebar-title">
          <i class="bi bi-grid-3x3-gap-fill"></i> 2-DIGITS
        </div>
        ${betTypes2Digit.map(bt => `
          <button class="bet-type-btn ${bt.key === currentBetType?.key ? 'active' : ''}"
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
            ${customers.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
          </select>
          <button class="btn-toggle-mode ${autoReverse ? 'active' : ''}" id="btn-reverse" title="กลับหน้าหลัง">
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
              <span class="bill-badge total" id="total-bills">${transactions.length} BILLS</span>
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
              ${transactionRowsTemplate(transactions)}
            </tbody>
          </table>
        </div>
      </div>

      <!-- RIGHT SIDEBAR: 3-DIGITS -->
      <div class="sidebar" id="sidebar-right">
        <div class="sidebar-title">
          <i class="bi bi-grid-3x3-gap-fill"></i> 3-DIGITS
        </div>
        ${betTypes3Digit.map(bt => `
          <button class="bet-type-btn ${bt.key === currentBetType?.key ? 'active' : ''}"
                  data-key="${bt.key}" data-type="3digit">
            <span class="shortcut">${bt.shortcut}</span>
            ${bt.label}
          </button>
        `).join('')}
        ${specialTypes.map(bt => `
          <button class="bet-type-btn ${bt.key === currentBetType?.key ? 'active' : ''}"
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

// ─── Feature: Input Field Configuration ──────

function updateInputFields() {
  const bonLabel = document.getElementById('label-bon');
  const todeLabel = document.getElementById('label-tode');
  const langLabel = document.getElementById('label-lang');
  const inputTode = document.getElementById('input-tode');
  const inputLang = document.getElementById('input-lang');
  const inputNumber = document.getElementById('input-number');
  if (!bonLabel || !currentBetType) return;

  const code = currentBetType.code;

  if (code.includes('wing') || code.includes('19pratu') || code.includes('ruut')) {
    bonLabel.textContent = 'เงิน';
    inputTode.parentElement.style.display = 'none';
    inputLang.parentElement.style.display = 'none';
    inputNumber.maxLength = 1;
  } else if (code.includes('3') || code.includes('ek') || code.includes('tode') || code.includes('sam')) {
    bonLabel.textContent = 'บน';
    todeLabel.textContent = 'โต๊ด';
    langLabel.textContent = '3ล่าง';
    inputTode.parentElement.style.display = '';
    inputLang.parentElement.style.display = '';
    inputNumber.maxLength = 3;
  } else {
    bonLabel.textContent = 'บน';
    inputTode.parentElement.style.display = 'none';
    inputLang.parentElement.style.display = 'none';
    inputNumber.maxLength = 2;
  }

  if (code === 'song_bon_lang' || code === 'bon_lang_x2') {
    bonLabel.textContent = 'บน';
    todeLabel.textContent = 'ล่าง';
    inputTode.parentElement.style.display = '';
    inputLang.parentElement.style.display = 'none';
  }
}

function refreshTransactions() {
  const tbody = document.getElementById('tx-tbody');
  const totalBills = document.getElementById('total-bills');
  if (tbody) tbody.innerHTML = transactionRowsTemplate(transactions);
  if (totalBills) totalBills.textContent = `${transactions.length} BILLS`;
}

// ─── Feature: Bet Generation ─────────────────

function generateBets(number, code) {
  const bets = [];

  if (code.includes('19pratu')) {
    const d = number;
    const set = new Set();
    for (let i = 0; i <= 9; i++) {
      set.add(i + d);
      set.add(d + i);
    }
    set.forEach(n => bets.push({ number: n, label: currentBetType.label }));
  } else if (code.includes('ruut_bon')) {
    for (let i = 0; i <= 9; i++) {
      bets.push({ number: i + number, label: currentBetType.label });
    }
  } else if (code.includes('ruut_lang')) {
    for (let i = 0; i <= 9; i++) {
      bets.push({ number: number + i, label: currentBetType.label });
    }
  } else {
    bets.push({ number, label: currentBetType.label });
  }

  if (autoReverse && number.length === 2 && !code.includes('19pratu')) {
    const reversed = reverseNumber(number);
    if (reversed !== number) {
      bets.push({ number: reversed, label: currentBetType.label + ' (กลับ)' });
    }
  }

  return bets;
}

// ─── Feature: Print Bill ─────────────────────

function handlePrint() {
  const customerSelect = document.getElementById('customer-select');
  const customerName = customerSelect?.options[customerSelect.selectedIndex]?.text || 'ลูกค้าทั่วไป';
  const customerInitial = customerName.charAt(0) || 'L';
  const customerTxs = transactions.filter(tx => tx.customer === customerName);

  if (!customerTxs.length) {
    showToast('ไม่มีรายการให้พิมพ์', 'error');
    return;
  }

  const today = new Date().toISOString().split('T')[0];
  const customerBills = JSON.parse(localStorage.getItem(`bills_${today}_${customerName}`) || '[]');
  const billSeq = (customerBills.length + 1).toString().padStart(2, '0');
  const billId = `${billSeq}/${customerInitial}.`;

  customerBills.push({ id: billId, time: new Date().toLocaleTimeString() });
  localStorage.setItem(`bills_${today}_${customerName}`, JSON.stringify(customerBills));

  const dateStr = new Date().toLocaleDateString('th-TH');
  const totalAmount = customerTxs.reduce((sum, t) => sum + t.amount, 0);

  const printContent = `
    <html>
    <head>
      <style>
        body { font-family: 'Inter', sans-serif; padding: 20px; width: 300px; font-size: 14px; }
        .header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 10px; }
        .bill-id { font-size: 18px; font-weight: bold; margin: 10px 0; }
        .row { display: flex; justify-content: space-between; margin-bottom: 5px; }
        .total { border-top: 1px solid #000; margin-top: 10px; padding-top: 10px; font-weight: bold; font-size: 16px; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body onload="window.print(); window.close();">
      <div class="header">
        <div style="font-size: 20px; font-weight: 800;">LOTTO KEY</div>
        <div class="bill-id">บิล: ${billId}</div>
        <div>วันที่: ${dateStr}</div>
        <div>ลูกค้า: ${customerName}</div>
      </div>
      <div>
        ${customerTxs.map(tx => `
          <div class="row">
            <span>${tx.type}: ${tx.number}</span>
            <span>${tx.amount.toLocaleString()} ฿</span>
          </div>
        `).join('')}
      </div>
      <div class="total">
        <div class="row">
          <span>รวมทั้งหมด</span>
          <span>${totalAmount.toLocaleString()} ฿</span>
        </div>
      </div>
      <div class="footer">ขอบคุณที่ใช้บริการ</div>
    </body>
    </html>
  `;

  const win = window.open('', '_blank', 'width=400,height=600');
  win.document.write(printContent);
  win.document.close();
}

// ─── Event Handlers ──────────────────────────

function handleBetTypeSelect(key, container) {
  currentBetType = allBetTypes.find(t => t.key === key) || allBetTypes[0];
  container.querySelectorAll('.bet-type-btn').forEach(b => b.classList.toggle('active', b.dataset.key === key));
  updateInputFields();
  document.getElementById('input-number')?.focus();
}

function handleKeyDown(e) {
  const active = document.activeElement;
  const isInput = active && (active.tagName === 'INPUT' || active.tagName === 'SELECT' || active.tagName === 'TEXTAREA');

  if (isInput) {
    if (e.key === 'Enter' && active.id === 'input-number') {
      e.preventDefault();
      document.getElementById('input-bon')?.focus();
    }
    return;
  }

  const key = e.key.toUpperCase();
  const found = allBetTypes.find(t => t.shortcut === key);
  if (found) {
    currentBetType = found;
    document.querySelectorAll('.bet-type-btn').forEach(b => b.classList.toggle('active', b.dataset.key === key));
    updateInputFields();
    document.getElementById('input-number')?.focus();
    return;
  }

  if (/^[0-9]$/.test(e.key)) {
    const inp = document.getElementById('input-number');
    if (inp) { inp.focus(); inp.value = e.key; }
  }
}

async function handleSubmit() {
  const inputNumber = document.getElementById('input-number');
  const inputBon = document.getElementById('input-bon');
  const inputTode = document.getElementById('input-tode');
  const inputLang = document.getElementById('input-lang');
  const customerSelect = document.getElementById('customer-select');

  const number = inputNumber?.value?.trim();
  const amountBon = parseInt(inputBon?.value) || 0;
  const amountTode = parseInt(inputTode?.value) || 0;
  const amountLang = parseInt(inputLang?.value) || 0;
  const totalAmount = amountBon + amountTode + amountLang;

  if (!number) { showToast('กรุณาใส่เลข', 'error'); inputNumber?.focus(); return; }
  if (!currentBetType) { showToast('กรุณาเลือกประเภทแทง', 'error'); return; }
  if (totalAmount <= 0) { showToast('กรุณาใส่จำนวนเงิน', 'error'); inputBon?.focus(); return; }

  const restrictedCheck = await api.restricted.check(number);
  if (restrictedCheck.restricted) {
    const r = restrictedCheck.data;
    if (r.maxAmount === 0) { showToast(`เลข ${number} ปิดรับแล้ว!`, 'error'); return; }
    if (totalAmount > r.maxAmount) { showToast(`เลข ${number} อั้นที่ ${r.maxAmount} บาท`, 'warning'); }
  }

  const customerOpt = customerSelect?.options[customerSelect.selectedIndex];
  const customerName = customerOpt?.text || 'ลูกค้าทั่วไป';
  const bets = generateBets(number, currentBetType.code);

  for (const bet of bets) {
    await api.transactions.add({
      betTypeCode: currentBetType.code,
      type: bet.label,
      number: bet.number,
      user: 'ADMIN',
      amount: totalAmount,
      customer: customerName,
    });
  }

  const res = await api.transactions.get();
  transactions = (res.data || []).map(mapTransaction);
  refreshTransactions();
  showToast(`บันทึก ${number} = ${totalAmount.toLocaleString()} บาท`, 'success');

  inputNumber.value = '';
  inputBon.value = '';
  inputTode.value = '';
  inputLang.value = '';
  inputNumber.focus();
}

async function handleDeleteTransaction(id) {
  await api.transactions.delete(id);
  const res = await api.transactions.get();
  transactions = (res.data || []).map(mapTransaction);
  refreshTransactions();
  showToast('ลบรายการแล้ว', 'warning');
}

// ─── Event Binding ───────────────────────────

function initKeyPageEvents(container) {
  // Bet type selection
  container.querySelectorAll('.bet-type-btn').forEach(btn => {
    btn.addEventListener('click', () => handleBetTypeSelect(btn.dataset.key, container));
  });

  // Auto reverse toggle
  document.getElementById('btn-reverse')?.addEventListener('click', () => {
    autoReverse = !autoReverse;
    document.getElementById('btn-reverse')?.classList.toggle('active', autoReverse);
    showToast(autoReverse ? 'เปิดกลับหน้าหลัง' : 'ปิดกลับหน้าหลัง', autoReverse ? 'success' : 'warning');
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
  currentLotteryType = lotteryType;

  const { txRes, custRes, settingsRes, btRes } = await fetchKeyPageData();

  if (!txRes || !txRes.success) {
    const message = txRes?.message === 'Unauthorized'
      ? 'เซสชันของคุณหมดอายุหรือยังไม่ได้เข้าสู่ระบบ'
      : 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้';
    container.innerHTML = unauthorizedTemplate(message);
    return;
  }

  // Populate state
  transactions = (txRes.data || []).map(mapTransaction);
  customers = custRes.data || [];
  settings = settingsRes.data || {};
  autoReverse = settings.autoReverse || false;

  betTypes2Digit = btRes.data?.digit2 || [];
  betTypes3Digit = btRes.data?.digit3 || [];
  specialTypes = btRes.data?.special || [];
  allBetTypes = [...betTypes2Digit, ...betTypes3Digit, ...specialTypes];
  currentBetType = currentBetType || allBetTypes.find(t => t.key === 'R') || allBetTypes[0];

  // Render
  container.innerHTML = pageTemplate();
  initKeyPageEvents(container);
  updateInputFields();
  setTimeout(() => document.getElementById('input-number')?.focus(), 100);

  if (currentLotteryType?.closeTime) {
    initTimer(currentLotteryType.closeTime);
  }
}

// ─── Cleanup (Export) ────────────────────────

export function cleanupKeyPage() {
  document.removeEventListener('keydown', handleKeyDown);
  stopTimer();
}
