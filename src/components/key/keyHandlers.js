// ─── Event Handlers ─────────────────────────

import { api } from '../../api/apiClient.js';
import { showToast } from '../../js/toast.js';
import { state } from './keyState.js';
import { transactionRowsTemplate } from './keyTemplates.js';

// ─── Utilities ───────────────────────────────

export function reverseNumber(num) {
  return num.split('').reverse().join('');
}

export function mapTransaction(tx) {
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

// ─── Feature: Input Field Configuration ──────

export function updateInputFields() {
  const bonLabel = document.getElementById('label-bon');
  const todeLabel = document.getElementById('label-tode');
  const langLabel = document.getElementById('label-lang');
  const inputTode = document.getElementById('input-tode');
  const inputLang = document.getElementById('input-lang');
  const inputNumber = document.getElementById('input-number');
  if (!bonLabel || !state.currentBetType) return;

  const code = state.currentBetType.code;

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

export function refreshTransactions() {
  const tbody = document.getElementById('tx-tbody');
  const totalBills = document.getElementById('total-bills');
  if (tbody) tbody.innerHTML = transactionRowsTemplate(state.transactions);
  if (totalBills) totalBills.textContent = `${state.transactions.length} BILLS`;
}

// ─── Feature: Bet Generation ─────────────────

export function generateBets(number, code) {
  const bets = [];

  if (code.includes('19pratu')) {
    const d = number;
    const set = new Set();
    for (let i = 0; i <= 9; i++) {
      set.add(i + d);
      set.add(d + i);
    }
    set.forEach(n => bets.push({ number: n, label: state.currentBetType.label }));
  } else if (code.includes('ruut_bon')) {
    for (let i = 0; i <= 9; i++) {
      bets.push({ number: i + number, label: state.currentBetType.label });
    }
  } else if (code.includes('ruut_lang')) {
    for (let i = 0; i <= 9; i++) {
      bets.push({ number: number + i, label: state.currentBetType.label });
    }
  } else {
    bets.push({ number, label: state.currentBetType.label });
  }

  if (state.autoReverse && number.length === 2 && !code.includes('19pratu')) {
    const reversed = reverseNumber(number);
    if (reversed !== number) {
      bets.push({ number: reversed, label: state.currentBetType.label + ' (กลับ)' });
    }
  }

  return bets;
}

// ─── Feature: Print Bill ─────────────────────

export function handlePrint() {
  const customerSelect = document.getElementById('customer-select');
  const customerName = customerSelect?.options[customerSelect.selectedIndex]?.text || 'ลูกค้าทั่วไป';
  const customerInitial = customerName.charAt(0) || 'L';
  const customerTxs = state.transactions.filter(tx => tx.customer === customerName);

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

export function handleBetTypeSelect(key, container) {
  state.currentBetType = state.allBetTypes.find(t => t.key === key) || state.allBetTypes[0];
  container.querySelectorAll('.bet-type-btn').forEach(b => b.classList.toggle('active', b.dataset.key === key));
  updateInputFields();
  document.getElementById('input-number')?.focus();
}

export function handleKeyDown(e) {
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
  const found = state.allBetTypes.find(t => t.shortcut === key);
  if (found) {
    state.currentBetType = found;
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

export async function handleSubmit() {
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
  if (!state.currentBetType) { showToast('กรุณาเลือกประเภทแทง', 'error'); return; }
  if (totalAmount <= 0) { showToast('กรุณาใส่จำนวนเงิน', 'error'); inputBon?.focus(); return; }

  const restrictedCheck = await api.restricted.check(number);
  if (restrictedCheck.restricted) {
    const r = restrictedCheck.data;
    if (r.maxAmount === 0) { showToast(`เลข ${number} ปิดรับแล้ว!`, 'error'); return; }
    if (totalAmount > r.maxAmount) { showToast(`เลข ${number} อั้นที่ ${r.maxAmount} บาท`, 'warning'); }
  }

  const customerOpt = customerSelect?.options[customerSelect.selectedIndex];
  const customerName = customerOpt?.text || 'ลูกค้าทั่วไป';
  const bets = generateBets(number, state.currentBetType.code);

  for (const bet of bets) {
    await api.transactions.add({
      betTypeCode: state.currentBetType.code,
      type: bet.label,
      number: bet.number,
      user: 'ADMIN',
      amount: totalAmount,
      customer: customerName,
    });
  }

  const res = await api.transactions.get();
  state.transactions = (res.data || []).map(mapTransaction);
  refreshTransactions();
  showToast(`บันทึก ${number} = ${totalAmount.toLocaleString()} บาท`, 'success');

  inputNumber.value = '';
  inputBon.value = '';
  inputTode.value = '';
  inputLang.value = '';
  inputNumber.focus();
}

export async function handleDeleteTransaction(id) {
  await api.transactions.delete(id);
  const res = await api.transactions.get();
  state.transactions = (res.data || []).map(mapTransaction);
  refreshTransactions();
  showToast('ลบรายการแล้ว', 'warning');
}
