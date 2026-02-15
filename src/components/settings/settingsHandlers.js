// ─── Event Handlers ─────────────────────────

import { api } from '../../api/apiClient.js';
import { showToast } from '../../js/toast.js';
import Swal from 'sweetalert2';
import { formatThaiDate, lotteryTypeLogModal, renderThaiCalendar, renderRestrictedChips } from './settingsTemplates.js';

export async function handleRoundDateChange(e) {
  const thaiDisplay = document.getElementById('round-date-thai');
  if (thaiDisplay && e.target.value) {
    thaiDisplay.textContent = formatThaiDate(e.target.value);
  }
}

// ─── Thai Date Picker ─────────────────────────

let _calYear, _calMonth;

function updateCalendar() {
  const dropdown = document.getElementById('thai-date-dropdown');
  if (!dropdown) return;
  dropdown.innerHTML = renderThaiCalendar(_calYear, _calMonth);
  bindCalendarEvents();
}

function bindCalendarEvents() {
  const dropdown = document.getElementById('thai-date-dropdown');
  if (!dropdown) return;

  dropdown.querySelector('.thai-cal-prev')?.addEventListener('click', () => {
    _calMonth--;
    if (_calMonth < 0) { _calMonth = 11; _calYear--; }
    updateCalendar();
  });

  dropdown.querySelector('.thai-cal-next')?.addEventListener('click', () => {
    _calMonth++;
    if (_calMonth > 11) { _calMonth = 0; _calYear++; }
    updateCalendar();
  });

  dropdown.querySelector('.thai-cal-month')?.addEventListener('change', (e) => {
    _calMonth = parseInt(e.target.value);
    updateCalendar();
  });

  dropdown.querySelector('.thai-cal-year')?.addEventListener('change', (e) => {
    _calYear = parseInt(e.target.value);
    updateCalendar();
  });

  dropdown.querySelectorAll('.thai-cal-day').forEach(btn => {
    btn.addEventListener('click', () => {
      const dateStr = btn.dataset.date;
      const hiddenInput = document.getElementById('round-date');
      const thaiDisplay = document.getElementById('round-date-thai');
      if (hiddenInput) hiddenInput.value = dateStr;
      if (thaiDisplay) thaiDisplay.textContent = formatThaiDate(dateStr);
      // Trigger change for round number lookup
      hiddenInput?.dispatchEvent(new Event('change'));
      dropdown.style.display = 'none';
    });
  });
}

export function initThaiDatePicker() {
  const btn = document.getElementById('thai-date-picker-btn');
  const dropdown = document.getElementById('thai-date-dropdown');
  if (!btn || !dropdown) return;

  // Init calendar to current hidden input value
  const currentVal = document.getElementById('round-date')?.value || new Date().toISOString().slice(0, 10);
  const d = new Date(currentVal);
  _calYear = d.getFullYear();
  _calMonth = d.getMonth();

  btn.addEventListener('click', () => {
    const isOpen = dropdown.style.display !== 'none';
    if (isOpen) {
      dropdown.style.display = 'none';
    } else {
      // Re-sync from hidden input
      const val = document.getElementById('round-date')?.value;
      if (val) {
        const dd = new Date(val);
        _calYear = dd.getFullYear();
        _calMonth = dd.getMonth();
      }
      dropdown.innerHTML = renderThaiCalendar(_calYear, _calMonth);
      bindCalendarEvents();
      dropdown.style.display = 'block';
    }
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    const picker = document.getElementById('thai-date-picker');
    if (picker && !picker.contains(e.target)) {
      dropdown.style.display = 'none';
    }
  });
}

export async function handleRoundLtChange(e) {
  const ltId = e.target.value;
  const roundNumberInput = document.getElementById('round-number');
  const hint = document.getElementById('round-number-hint');
  if (!ltId || !roundNumberInput) return;

  roundNumberInput.disabled = true;
  roundNumberInput.value = '';
  if (hint) hint.textContent = 'กำลังโหลด...';

  try {
    const res = await api.rounds.getNextNumber(ltId);
    if (res?.success && res.data) {
      roundNumberInput.value = res.data.next;
      if (res.data.hasRounds) {
        roundNumberInput.disabled = false;
        if (hint) hint.textContent = `งวดล่าสุด: ${res.data.next - 1} → ถัดไป: ${res.data.next}`;
      } else {
        roundNumberInput.disabled = false;
        roundNumberInput.value = '';
        roundNumberInput.placeholder = 'ใส่เลขเริ่มต้น';
        roundNumberInput.focus();
        if (hint) hint.textContent = 'ครั้งแรก: กรุณาใส่เลขงวดเริ่มต้น';
      }
    }
  } catch {
    roundNumberInput.disabled = false;
    if (hint) hint.textContent = '';
  }
}

export async function handleCreateRound(container, lotteryTypes, renderCallback) {
  const roundDate = document.getElementById('round-date')?.value;
  const ltSelect = document.getElementById('round-lt-select')?.value;
  const roundNumber = document.getElementById('round-number')?.value;
  const note = document.getElementById('round-note')?.value?.trim() || null;

  if (!roundDate) { showToast('กรุณาเลือกวันที่งวด', 'error'); return; }
  if (!ltSelect) { showToast('กรุณาเลือกประเภทหวย', 'error'); return; }
  if (!roundNumber || parseInt(roundNumber) < 1) {
    showToast('กรุณาใส่เลขงวด', 'error');
    document.getElementById('round-number')?.focus();
    return;
  }

  const ltId = parseInt(ltSelect);
  const lt = lotteryTypes.find(l => l.id === ltId);

  // ตรวจสอบงวดซ้ำ (วันที่ + ประเภทหวย)
  try {
    const existing = await api.rounds.get({ lotteryTypeId: ltId });
    const duplicate = (existing.data || []).find(r => {
      const rDate = new Date(r.roundDate).toISOString().slice(0, 10);
      return rDate === roundDate;
    });

    if (duplicate) {
      Swal.fire({
        icon: 'warning',
        title: 'งวดหวยซ้ำ',
        html: `<b>${lt?.name || 'ประเภทหวย'}</b> วันที่ <b>${formatThaiDate(roundDate)}</b><br>มีงวดที่ ${duplicate.roundNumber} อยู่แล้ว`,
        confirmButtonText: 'ตกลง',
      });
      return;
    }
  } catch {
    // ถ้าเช็คไม่ได้ ให้ลองสร้างต่อ (backend จะ validate อีกชั้น)
  }

  try {
    await api.rounds.add({ roundDate, lotteryTypeId: ltId, roundNumber: parseInt(roundNumber), note });
    Swal.fire({
      icon: 'success',
      title: 'เปิดงวดหวยเรียบร้อย',
      text: `งวดที่ ${roundNumber} ${lt?.name || ''} วันที่ ${formatThaiDate(roundDate)}`,
      timer: 2000,
      showConfirmButton: false,
    });
    renderCallback(container);
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'ไม่สามารถเปิดงวดได้',
      text: err.message || 'เกิดข้อผิดพลาด',
      confirmButtonText: 'ตกลง',
    });
  }
}

export async function handleCloseRound(id, container, renderCallback) {
  const result = await Swal.fire({
    icon: 'warning',
    title: 'ยืนยันปิดงวดนี้?',
    text: 'งวดที่ปิดแล้วจะไม่สามารถเปิดกลับมาใช้งานได้',
    showCancelButton: true,
    confirmButtonText: 'ปิดงวด',
    cancelButtonText: 'ยกเลิก',
    confirmButtonColor: '#d33',
  });
  if (!result.isConfirmed) return;
  try {
    await api.rounds.update(id, { status: 'closed' });
    Swal.fire({ icon: 'success', title: 'ปิดงวดแล้ว', timer: 1500, showConfirmButton: false });
    renderCallback(container);
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: err.message || 'ไม่สามารถปิดงวดได้' });
  }
}

export async function handleDeleteRound(id, container, renderCallback, roundInfo) {
  const info = roundInfo || {};
  const detailHtml = info.roundNumber
    ? `<div style="text-align:left; font-size:0.85rem; margin-top:8px; padding:10px; background:#f8f9fa; border-radius:8px;">
        <div><b>งวดที่:</b> ${info.roundNumber}</div>
        <div><b>ประเภท:</b> ${info.ltName}</div>
        <div><b>วันที่:</b> ${formatThaiDate(info.roundDate)}</div>
        <div><b>รายการ:</b> ${info.txCount} รายการ</div>
       </div>`
    : '';

  const result = await Swal.fire({
    icon: 'warning',
    title: 'ยืนยันลบงวดนี้?',
    html: `ข้อมูลงวดจะถูกบันทึกใน log ก่อนลบ${detailHtml}`,
    showCancelButton: true,
    confirmButtonText: '<i class="bi bi-trash"></i> ลบงวด',
    cancelButtonText: 'ยกเลิก',
    confirmButtonColor: '#d33',
  });
  if (!result.isConfirmed) return;

  try {
    await api.rounds.delete(id);
    Swal.fire({ icon: 'success', title: 'ลบงวดเรียบร้อย', text: 'ข้อมูลถูกเก็บใน log แล้ว', timer: 2000, showConfirmButton: false });
    renderCallback(container);
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'ไม่สามารถลบได้', text: err.message || 'เกิดข้อผิดพลาด' });
  }
}

// ─── History Pagination ─────────────────────

const HISTORY_PER_PAGE = 5;
let _historyPage = 1;

function getFilteredHistoryItems(container) {
  const filterLtId = document.getElementById('history-lt-filter')?.value || '';
  const items = Array.from(container.querySelectorAll('#history-rounds-list .history-item'));
  return filterLtId ? items.filter(item => item.dataset.ltId === filterLtId) : items;
}

export function renderHistoryPage(container) {
  const items = getFilteredHistoryItems(container);
  const totalPages = Math.max(1, Math.ceil(items.length / HISTORY_PER_PAGE));
  if (_historyPage > totalPages) _historyPage = totalPages;

  const start = (_historyPage - 1) * HISTORY_PER_PAGE;
  const end = start + HISTORY_PER_PAGE;

  // ซ่อนทุก item ก่อน
  container.querySelectorAll('#history-rounds-list .history-item').forEach(item => {
    item.style.display = 'none';
  });
  // แสดงเฉพาะหน้าปัจจุบัน
  items.forEach((item, i) => {
    item.style.display = (i >= start && i < end) ? '' : 'none';
  });

  // อัปเดต pagination controls
  const pageInfo = container.querySelector('#history-page-info');
  const prevBtn = container.querySelector('#history-prev');
  const nextBtn = container.querySelector('#history-next');
  const paginationEl = container.querySelector('#history-pagination');

  if (paginationEl) {
    paginationEl.style.display = items.length > HISTORY_PER_PAGE ? 'flex' : 'none';
  }
  if (pageInfo) pageInfo.textContent = `หน้า ${_historyPage} / ${totalPages}`;
  if (prevBtn) prevBtn.disabled = _historyPage <= 1;
  if (nextBtn) nextBtn.disabled = _historyPage >= totalPages;
}

export function handleHistoryFilter(e, container) {
  _historyPage = 1;
  renderHistoryPage(container);
}

export function handleHistoryPrev(container) {
  if (_historyPage > 1) { _historyPage--; renderHistoryPage(container); }
}

export function handleHistoryNext(container) {
  _historyPage++;
  renderHistoryPage(container);
}

export async function handleToggleLottery(e) {
  const isOpen = e.target.checked;
  await api.settings.update({ isLotteryOpen: isOpen });
  const statusText = document.getElementById('lottery-status-text');
  if (statusText) {
    statusText.textContent = isOpen ? 'เปิดรับ' : 'ปิดรับ';
    statusText.style.color = isOpen ? 'var(--color-success)' : 'var(--color-danger)';
  }
  showToast(isOpen ? 'เปิดรับหวยแล้ว' : 'ปิดรับหวยแล้ว', isOpen ? 'success' : 'warning');
}

export async function handleSaveTime() {
  const time = document.getElementById('closing-time')?.value;
  if (time) {
    await api.settings.update({ closingTime: time });
    showToast(`ตั้งเวลาปิดรับ: ${time}`, 'success');
  }
}

// ─── Rates: Lottery Type Filter ──────────────

function populateRateInputs(payRates) {
  const map = {
    'pay-song-bon': payRates.song_bon,
    'pay-song-kang': payRates.song_kang,
    'pay-song-bon-lang': payRates.song_bon_lang,
    'pay-ek-3song': payRates.ek_3song,
    'pay-tua-3song': payRates.tua_3song,
    'pay-sam-tua-lang': payRates.sam_tua_lang,
    'pay-tode3': payRates.tode_3,
    'pay-tode-yai': payRates.tode_yai,
    'pay-tode-lek': payRates.tode_lek,
    'pay-wing-bon': payRates.wing_bon,
    'pay-wing-lang': payRates.wing_lang,
  };
  for (const [id, val] of Object.entries(map)) {
    const el = document.getElementById(id);
    if (el) el.value = val;
  }
}

export async function handleRatesLtFilter() {
  const ltId = document.getElementById('rates-lt-filter')?.value || null;
  try {
    const res = await api.settings.get(ltId || undefined);
    if (res?.success && res.data?.payRates) {
      populateRateInputs(res.data.payRates);
    }
  } catch (err) {
    showToast(err.message || 'เกิดข้อผิดพลาด', 'error');
  }
}

export async function handleSaveRates(settings) {
  const lotteryTypeId = document.getElementById('rates-lt-filter')?.value || null;

  // 2 ตัว
  const songBon = parseInt(document.getElementById('pay-song-bon')?.value) || 95;
  const songKang = parseInt(document.getElementById('pay-song-kang')?.value) || 95;
  const songBonLang = parseInt(document.getElementById('pay-song-bon-lang')?.value) || 95;
  // 3 ตัว
  const ek3song = parseInt(document.getElementById('pay-ek-3song')?.value) || 900;
  const tua3song = parseInt(document.getElementById('pay-tua-3song')?.value) || 900;
  const samTuaLang = parseInt(document.getElementById('pay-sam-tua-lang')?.value) || 900;
  // โต๊ด
  const tode3 = parseInt(document.getElementById('pay-tode3')?.value) || 150;
  const todeYai = parseInt(document.getElementById('pay-tode-yai')?.value) || 450;
  const todeLek = parseInt(document.getElementById('pay-tode-lek')?.value) || 150;
  // วิ่ง
  const wingBon = parseFloat(document.getElementById('pay-wing-bon')?.value) || 3.2;
  const wingLang = parseFloat(document.getElementById('pay-wing-lang')?.value) || 4.2;

  const body = {
    payRates: {
      song_bon: songBon,
      song_kang: songKang,
      song_bon_lang: songBonLang,
      ek_3song: ek3song,
      tua_3song: tua3song,
      sam_tua_lang: samTuaLang,
      tode_3: tode3,
      tode_yai: todeYai,
      tode_lek: todeLek,
      wing_bon: wingBon,
      wing_lang: wingLang,
    },
  };

  if (lotteryTypeId) {
    body.lotteryTypeId = parseInt(lotteryTypeId);
  } else {
    body.payRate2Digit = songBon;
    body.payRate3Digit = ek3song;
  }

  await api.settings.update(body);

  if (!lotteryTypeId) {
    const badge2 = document.getElementById('header-pay-2digit');
    const badge3 = document.getElementById('header-pay-3digit');
    if (badge2) badge2.textContent = `฿${songBon}.00`;
    if (badge3) badge3.textContent = `฿${ek3song}.00`;
  }

  const ltSelect = document.getElementById('rates-lt-filter');
  const ltName = ltSelect?.options[ltSelect.selectedIndex]?.text || '';
  showToast(`บันทึกราคาจ่าย${lotteryTypeId ? ' (' + ltName + ')' : ''}แล้ว`, 'success');
}

// ─── Limits: Lottery Type Filter ─────────────

function populateLimitInputs(data) {
  const minEl = document.getElementById('min-bet');
  const max2El = document.getElementById('max-bet-2');
  const max3El = document.getElementById('max-bet-3');
  if (minEl) minEl.value = data.minBet;
  if (max2El) max2El.value = data.maxBet2Digit;
  if (max3El) max3El.value = data.maxBet3Digit;
}

export async function handleLimitsLtFilter() {
  const ltId = document.getElementById('limits-lt-filter')?.value || null;
  try {
    const res = await api.settings.get(ltId || undefined);
    if (res?.success && res.data) {
      populateLimitInputs(res.data);
    }
  } catch (err) {
    showToast(err.message || 'เกิดข้อผิดพลาด', 'error');
  }
}

export async function handleSaveLimits() {
  const lotteryTypeId = document.getElementById('limits-lt-filter')?.value || null;
  const minBet = parseInt(document.getElementById('min-bet')?.value) || 1;
  const maxBet2 = parseInt(document.getElementById('max-bet-2')?.value) || 1000;
  const maxBet3 = parseInt(document.getElementById('max-bet-3')?.value) || 500;

  const body = { minBet, maxBet2Digit: maxBet2, maxBet3Digit: maxBet3 };
  if (lotteryTypeId) body.lotteryTypeId = parseInt(lotteryTypeId);

  await api.settings.update(body);

  const ltSelect = document.getElementById('limits-lt-filter');
  const ltName = ltSelect?.options[ltSelect.selectedIndex]?.text || '';
  Swal.fire({
    icon: 'success',
    title: 'บันทึกข้อมูลเรียบร้อย',
    text: `ขั้นต่ำ-สูงสุด${lotteryTypeId ? ' (' + ltName + ')' : ''} ถูกบันทึกแล้ว`,
    timer: 2000,
    showConfirmButton: false,
  });
}

export async function handleToggleReverse(e) {
  await api.settings.update({ autoReverse: e.target.checked });
  showToast(e.target.checked ? 'เปิดกลับหน้าหลังอัตโนมัติ' : 'ปิดกลับหน้าหลังอัตโนมัติ',
    e.target.checked ? 'success' : 'warning');
}

function getRestrictedFormData() {
  const number = document.getElementById('add-restricted-number')?.value?.trim();
  const status = document.getElementById('add-restricted-status')?.value || 'closed';
  const maxAmount = status === 'closed' ? 0 : 1;
  const payRateVal = document.getElementById('add-restricted-payrate')?.value;
  const payRate = payRateVal !== '' && payRateVal != null ? parseFloat(payRateVal) : null;
  const type = document.getElementById('add-restricted-type')?.value || '2ตัว';
  const lotteryTypeId = document.getElementById('restricted-lt-filter')?.value || null;
  const expectedLen = type === '3ตัว' ? 3 : 2;
  return { number, maxAmount, payRate, type, lotteryTypeId, expectedLen };
}

function clearRestrictedForm() {
  const searchInput = document.getElementById('add-restricted-search');
  const hiddenInput = document.getElementById('add-restricted-number');
  const payRateInput = document.getElementById('add-restricted-payrate');
  if (searchInput) searchInput.value = '';
  if (hiddenInput) hiddenInput.value = '';
  if (payRateInput) payRateInput.value = '';
}

async function addSingleRestricted(number, maxAmount, payRate, type, lotteryTypeId) {
  // เช็คซ้ำ
  try {
    const checkRes = await api.restricted.check(number, lotteryTypeId, type);
    if (checkRes.restricted) return { skipped: true, number };
  } catch { /* ให้ลองเพิ่มต่อ */ }

  await api.restricted.add({ number, maxAmount, payRate, type, lotteryTypeId });
  return { skipped: false, number };
}

export async function handleAddRestricted(container) {
  const { number, maxAmount, payRate, type, lotteryTypeId, expectedLen } = getRestrictedFormData();

  if (!lotteryTypeId) { showToast('กรุณาเลือกประเภทหวยก่อน', 'error'); return; }
  if (!number) { showToast('กรุณาเลือกเลข', 'error'); return; }
  if (number.length !== expectedLen) {
    showToast(`กรุณาใส่เลข ${expectedLen} หลัก`, 'error'); return;
  }

  try {
    const result = await addSingleRestricted(number, maxAmount, payRate, type, lotteryTypeId);
    if (result.skipped) {
      Swal.fire({ icon: 'warning', title: 'เลขอั้นซ้ำ', text: `เลข ${number} (${type}) มีอยู่แล้ว`, confirmButtonText: 'ตกลง' });
      return;
    }
    showToast(`เพิ่มเลขอั้น: ${number}`, 'success');
    const res = await api.restricted.get(lotteryTypeId);
    updateRestrictedList(res.data || []);
    clearRestrictedForm();
  } catch (err) {
    showToast(err.message || 'เกิดข้อผิดพลาด', 'error');
  }
}

export async function handleAddRestrictedReverse(container) {
  const { number, maxAmount, payRate, type, lotteryTypeId, expectedLen } = getRestrictedFormData();

  if (!lotteryTypeId) { showToast('กรุณาเลือกประเภทหวยก่อน', 'error'); return; }
  if (!number) { showToast('กรุณาเลือกเลข', 'error'); return; }
  if (number.length !== expectedLen) {
    showToast(`กรุณาใส่เลข ${expectedLen} หลัก`, 'error'); return;
  }

  const reversed = number.split('').reverse().join('');
  const isSame = number === reversed;

  try {
    const added = [];
    const skipped = [];

    const r1 = await addSingleRestricted(number, maxAmount, payRate, type, lotteryTypeId);
    if (r1.skipped) skipped.push(number); else added.push(number);

    if (!isSame) {
      const r2 = await addSingleRestricted(reversed, maxAmount, payRate, type, lotteryTypeId);
      if (r2.skipped) skipped.push(reversed); else added.push(reversed);
    }

    const res = await api.restricted.get(lotteryTypeId);
    updateRestrictedList(res.data || []);
    clearRestrictedForm();

    if (added.length > 0 && skipped.length === 0) {
      showToast(`เพิ่มเลขอั้น: ${added.join(', ')}`, 'success');
    } else if (added.length > 0 && skipped.length > 0) {
      Swal.fire({ icon: 'info', title: 'เพิ่มบางส่วน', html: `เพิ่มแล้ว: <b>${added.join(', ')}</b><br>ซ้ำ: <b>${skipped.join(', ')}</b>`, confirmButtonText: 'ตกลง' });
    } else {
      Swal.fire({ icon: 'warning', title: 'เลขอั้นซ้ำทั้งหมด', text: `${skipped.join(', ')} มีอยู่แล้ว`, confirmButtonText: 'ตกลง' });
    }
  } catch (err) {
    showToast(err.message || 'เกิดข้อผิดพลาด', 'error');
  }
}

// ─── Search Dropdown for Restricted Numbers ──

function generateNumberList(type) {
  const max = type === '3ตัว' ? 999 : 99;
  const pad = type === '3ตัว' ? 3 : 2;
  const list = [];
  for (let i = 0; i <= max; i++) {
    list.push(String(i).padStart(pad, '0'));
  }
  return list;
}

export function initRestrictedSearch() {
  const searchInput = document.getElementById('add-restricted-search');
  const dropdown = document.getElementById('restricted-search-dropdown');
  const hiddenInput = document.getElementById('add-restricted-number');
  const typeSelect = document.getElementById('add-restricted-type');
  if (!searchInput || !dropdown || !hiddenInput) return;

  let currentType = typeSelect?.value || '2ตัว';
  let allNumbers = generateNumberList(currentType);
  searchInput.maxLength = currentType === '3ตัว' ? 3 : 2;

  typeSelect?.addEventListener('change', () => {
    currentType = typeSelect.value;
    allNumbers = generateNumberList(currentType);
    searchInput.maxLength = currentType === '3ตัว' ? 3 : 2;
    searchInput.placeholder = currentType === '3ตัว' ? 'พิมพ์ 3 หลัก...' : 'พิมพ์ 2 หลัก...';
    searchInput.value = '';
    hiddenInput.value = '';
    dropdown.style.display = 'none';
  });

  function renderDropdown(query) {
    const filtered = query
      ? allNumbers.filter(n => n.includes(query))
      : allNumbers.slice(0, 50);

    if (filtered.length === 0) {
      dropdown.innerHTML = '<div style="padding: 8px; text-align: center; color: var(--text-muted); font-size: 0.75rem;">ไม่พบเลข</div>';
    } else {
      dropdown.innerHTML = filtered.slice(0, 50).map(n => `
        <div class="restricted-search-item" data-num="${n}" style="padding: 6px 10px; cursor: pointer; font-size: 0.8rem; font-family: monospace; border-bottom: 1px solid var(--border-color, #eee);"
             onmouseover="this.style.background='var(--color-primary-subtle, #e8f5e9)'"
             onmouseout="this.style.background='none'">${n}</div>
      `).join('');

      dropdown.querySelectorAll('.restricted-search-item').forEach(item => {
        item.addEventListener('click', () => {
          searchInput.value = item.dataset.num;
          hiddenInput.value = item.dataset.num;
          dropdown.style.display = 'none';
        });
      });
    }
    dropdown.style.display = 'block';
  }

  searchInput.addEventListener('focus', () => renderDropdown(searchInput.value.trim()));
  searchInput.addEventListener('input', () => {
    const val = searchInput.value.replace(/[^0-9]/g, '');
    searchInput.value = val;
    hiddenInput.value = val;
    renderDropdown(val);
  });

  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = 'none';
    }
  });
}

export async function handleRemoveRestrictedById(id) {
  try {
    const res = await api.restricted.removeById(id);
    showToast('ลบเลขอั้นแล้ว', 'warning');
    updateRestrictedList(res.data || []);
  } catch (err) {
    showToast(err.message || 'เกิดข้อผิดพลาด', 'error');
  }
}

export async function handleRestrictedLtFilter() {
  const lotteryTypeId = document.getElementById('restricted-lt-filter')?.value || null;
  const hint = document.getElementById('restricted-select-hint');
  const content = document.getElementById('restricted-content');

  if (!lotteryTypeId) {
    if (hint) hint.style.display = '';
    if (content) content.style.display = 'none';
    return;
  }

  if (hint) hint.style.display = 'none';
  if (content) content.style.display = '';

  try {
    const res = await api.restricted.get(lotteryTypeId);
    updateRestrictedList(res.data || []);
  } catch (err) {
    showToast(err.message || 'เกิดข้อผิดพลาด', 'error');
  }
}

function updateRestrictedList(list) {
  const listEl = document.getElementById('restricted-list');
  const countEl = document.getElementById('restricted-count');
  if (listEl) {
    listEl.innerHTML = renderRestrictedChips(list);
    // Re-bind remove buttons
    listEl.querySelectorAll('[data-remove-id]').forEach(btn => {
      btn.addEventListener('click', () => handleRemoveRestrictedById(parseInt(btn.dataset.removeId)));
    });
  }
  if (countEl) countEl.textContent = `${list.length} เลข`;
}

export async function handleToggleManualMode(e) {
  const manualMode = e.target.checked;
  await api.settings.update({ manualMode });
  const txt = document.getElementById('manual-mode-text');
  if (txt) {
    txt.textContent = manualMode ? 'Manual' : 'Auto';
    txt.style.color = manualMode ? 'var(--color-primary)' : 'var(--text-muted)';
  }
  showToast(
    manualMode ? 'เปิดระบบ Manual: เปิด/ปิดหวยเอง' : 'ปิดระบบ Manual: ใช้เวลาอัตโนมัติ',
    manualMode ? 'success' : 'warning'
  );
}

export async function handleToggleLotteryType(e) {
  const id = parseInt(e.target.dataset.ltId);
  const isOpen = e.target.checked;
  await api.lotteryTypes.update(id, { isOpen });
  const item = e.target.closest('.lottery-type-item');
  const label = item?.querySelector('.lt-status-label');
  if (label) {
    label.textContent = isOpen ? 'เปิด' : 'ปิด';
    label.style.color = isOpen ? 'var(--color-success)' : 'var(--color-danger)';
  }
  showToast(isOpen ? 'เปิดรับหวยแล้ว' : 'ปิดรับหวยแล้ว', isOpen ? 'success' : 'warning');
}

export async function handleDeleteLotteryType(id, container, renderCallback) {
  if (!confirm('ยืนยันลบประเภทหวยนี้?')) return;
  await api.lotteryTypes.delete(id);
  showToast('ลบประเภทหวยแล้ว', 'warning');
  renderCallback(container);
}

export async function handleAddLotteryType(container, renderCallback) {
  const name = document.getElementById('lt-add-name')?.value?.trim();
  const code = document.getElementById('lt-add-code')?.value?.trim();
  const openTime = document.getElementById('lt-add-open')?.value || '06:00';
  const closeTime = document.getElementById('lt-add-close')?.value || '14:30';
  const icon = document.getElementById('lt-add-icon')?.value?.trim() || null;

  if (!name || !code) { showToast('กรุณาใส่ชื่อและรหัส', 'error'); return; }

  try {
    await api.lotteryTypes.add({ name, code, openTime, closeTime, icon });
    showToast(`เพิ่มประเภทหวย: ${name}`, 'success');
    renderCallback(container);
  } catch (err) {
    showToast(err.message || 'เกิดข้อผิดพลาด', 'error');
  }
}

export async function handleSaveLotteryTypeTime(ltId, container, renderCallback) {
  const item = container.querySelector(`.lottery-type-item[data-id="${ltId}"]`);
  if (!item) return;

  const openInput = item.querySelector('.lt-open-time');
  const closeInput = item.querySelector('.lt-close-time');
  const openTime = openInput?.value;
  const closeTime = closeInput?.value;

  const updates = {};
  if (openTime && openTime !== openInput.dataset.orig) updates.openTime = openTime;
  if (closeTime && closeTime !== closeInput.dataset.orig) updates.closeTime = closeTime;

  if (Object.keys(updates).length === 0) {
    showToast('ไม่มีการเปลี่ยนแปลง', 'warning');
    return;
  }

  try {
    await api.lotteryTypes.update(ltId, updates);
    // Update orig values
    if (updates.openTime) openInput.dataset.orig = updates.openTime;
    if (updates.closeTime) closeInput.dataset.orig = updates.closeTime;
    // Hide save button
    const saveBtn = item.querySelector('.lt-save-time');
    if (saveBtn) saveBtn.style.display = 'none';
    showToast('บันทึกเวลาเรียบร้อย', 'success');
  } catch (err) {
    showToast(err.message || 'เกิดข้อผิดพลาด', 'error');
  }
}

export async function handleShowLotteryTypeLogs(ltId, ltName) {
  try {
    const res = await api.lotteryTypes.getLogs(ltId);
    const logs = res.data || [];
    // Remove existing modal if any
    document.getElementById('lt-log-modal')?.remove();
    document.body.insertAdjacentHTML('beforeend', lotteryTypeLogModal(ltName, logs));
    // Close modal events
    const modal = document.getElementById('lt-log-modal');
    document.getElementById('lt-log-modal-close')?.addEventListener('click', () => modal?.remove());
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  } catch (err) {
    showToast(err.message || 'ไม่สามารถโหลดประวัติได้', 'error');
  }
}
