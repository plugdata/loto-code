// ===== MOCK DATA & API SIMULATION =====

// ข้อมูลผู้ใช้
export const mockUsers = [
  { id: 1, username: 'admin01', displayName: 'ADMIN01', role: 'admin', status: 'online', createdAt: '2025-01-15' },
  { id: 2, username: 'agent01', displayName: 'สมชาย ใจดี', role: 'agent', status: 'online', createdAt: '2025-02-01' },
  { id: 3, username: 'lukmue01', displayName: 'ลูกมือ 01', role: 'member', status: 'online', createdAt: '2025-03-10' },
  { id: 4, username: 'lukmue02', displayName: 'ลูกมือ 02', role: 'member', status: 'offline', createdAt: '2025-03-12' },
  { id: 5, username: 'lukmue03', displayName: 'ลูกมือ 03', role: 'member', status: 'online', createdAt: '2025-04-01' },
];

// ข้อมูลลูกค้า
export const mockCustomers = [
  { id: 0, name: '-- ลูกค้าทั่วไป --' },
  { id: 1, name: 'คุณสมศักดิ์' },
  { id: 2, name: 'คุณวิชัย' },
  { id: 3, name: 'คุณประภา' },
  { id: 4, name: 'คุณมานะ' },
  { id: 5, name: 'คุณจินดา' },
];

// ประเภทหวย 2 ตัว
export const betTypes2Digit = [
  { key: 'Q', code: 'song_kang', label: 'สองตัวล่าง', shortcut: 'Q' },
  { key: 'W', code: 'song_bon', label: 'สองตัวบน', shortcut: 'W' },
  { key: 'E', code: 'song_bon_lang', label: 'สองตัว บน-ล่าง', shortcut: 'E' },
  { key: 'R', code: 'song_kang_x2', label: 'สองตัวล่าง x2', shortcut: 'R' },
  { key: 'T', code: 'song_bon_x2', label: 'สองตัวบน x2', shortcut: 'T' },
  { key: 'Y', code: 'lang_19pratu', label: '2ล่าง 19ประตู', shortcut: 'Y' },
  { key: 'U', code: 'bon_19pratu', label: '2บน 19ประตู', shortcut: 'U' },
  { key: 'I', code: 'wing_bon', label: 'วิ่งบน', shortcut: 'I' },
  { key: 'O', code: 'wing_lang', label: 'วิ่งล่าง', shortcut: 'O' },
  { key: 'X', code: 'bon_lang_x2', label: '2บนล่าง x2', shortcut: 'X' },
  { key: 'B', code: 'ruut_bon', label: 'รูดบน', shortcut: 'B' },
  { key: 'N', code: 'ruut_lang', label: 'รูดล่าง', shortcut: 'N' },
];

// ประเภทหวย 3 ตัว
export const betTypes3Digit = [
  { key: 'A', code: 'ek_3song', label: 'เต็ง (3ตัวตรง)', shortcut: 'A' },
  { key: 'S', code: 'tua_3song', label: 'หัว (3ตัวหน้า)', shortcut: 'S' },
  { key: 'D', code: 'tode_3', label: 'โต๊ดสาม', shortcut: 'D' },
  { key: 'F', code: 'ek_tode_3', label: 'เต็ง-โต๊ด หัว', shortcut: 'F' },
  { key: 'G', code: 'sam_tua_lang', label: 'สามตัวล่าง', shortcut: 'G' },
  { key: 'H', code: 'ek_na_lang', label: 'เต็ง หน้า-ล่าง', shortcut: 'H' },
  { key: 'J', code: 'tode_yai', label: 'โต๊ดใหญ่', shortcut: 'J' },
  { key: 'K', code: 'ek_tode_yai', label: 'เต็ง-โต๊ดใหญ่', shortcut: 'K' },
  { key: 'L', code: 'tode_lek', label: 'โต๊ดเล็ก', shortcut: 'L' },
];

// ตัวพิเศษ
export const specialTypes = [
  { key: 'Z', code: 'ek_tode_3lang', label: 'เต็ง-โต๊ด-3ล่าง', shortcut: 'Z', isSpecial: true },
  { key: 'M', code: 'klap_na_lang', label: 'กลับเลข (6กลับ)', shortcut: 'M', isSpecial: true },
];

// Mock Transactions
export const mockTransactions = [
  { id: 1, time: '00:15:32', type: 'สองตัวบน', number: '45', user: 'ลูกมือ 01', amount: 100, customer: 'ลูกค้าทั่วไป' },
  { id: 2, time: '00:16:10', type: 'สองตัวล่าง', number: '78', user: 'ลูกมือ 01', amount: 50, customer: 'คุณสมศักดิ์' },
  { id: 3, time: '00:17:45', type: 'เต็ง (3ตัวตรง)', number: '123', user: 'ลูกมือ 02', amount: 200, customer: 'ลูกค้าทั่วไป' },
  { id: 4, time: '00:18:20', type: 'สองตัว บน-ล่าง', number: '56', user: 'admin01', amount: 150, customer: 'คุณวิชัย' },
  { id: 5, time: '00:20:00', type: 'โต๊ดสาม', number: '789', user: 'ลูกมือ 03', amount: 80, customer: 'ลูกค้าทั่วไป' },
];

// Settings - ตั้งค่าระบบ
export const mockSettings = {
  // ราคาจ่าย
  payRate2Digit: 95,
  payRate3Digit: 900,

  // สถานะเปิด/ปิด
  isLotteryOpen: true,
  closingTime: '14:30',

  // ราคาหวย
  minBet: 1,
  maxBet2Digit: 1000,
  maxBet3Digit: 500,

  // อัตราจ่าย
  payRates: {
    song_bon: 95,
    song_kang: 95,
    song_bon_lang: 95,
    ek_3song: 900,
    tode_3: 150,
    tode_yai: 450,
    tode_lek: 150,
    wing_bon: 3.2,
    wing_lang: 4.2,
  },

  // หวยอั้น
  restrictedNumbers: [
    { number: '89', maxAmount: 200, type: '2ตัว' },
    { number: '56', maxAmount: 150, type: '2ตัว' },
    { number: '123', maxAmount: 100, type: '3ตัว' },
    { number: '77', maxAmount: 0, type: '2ตัว' },  // 0 = ปิดรับ
    { number: '456', maxAmount: 50, type: '3ตัว' },
  ],

  // กลับหน้าหลัง
  autoReverse: false,
};

// ===== MOCK API Functions =====
let transactions = [...mockTransactions];
let transactionIdCounter = transactions.length + 1;
let settings = { ...mockSettings };

// Simulate API delay
const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // === Transactions ===
  async getTransactions() {
    await delay();
    return { success: true, data: [...transactions] };
  },

  async addTransaction(tx) {
    await delay();
    const newTx = {
      id: transactionIdCounter++,
      time: new Date().toLocaleTimeString('th-TH', { hour12: false }),
      ...tx
    };
    transactions.unshift(newTx);
    return { success: true, data: newTx };
  },

  async deleteTransaction(id) {
    await delay();
    const idx = transactions.findIndex(t => t.id === id);
    if (idx === -1) return { success: false, message: 'ไม่พบรายการ' };
    transactions.splice(idx, 1);
    return { success: true };
  },

  async clearTransactions() {
    await delay();
    transactions = [];
    return { success: true };
  },

  // === Settings ===
  async getSettings() {
    await delay();
    return { success: true, data: { ...settings, restrictedNumbers: [...settings.restrictedNumbers] } };
  },

  async updateSettings(updates) {
    await delay();
    settings = { ...settings, ...updates };
    return { success: true, data: settings };
  },

  async addRestrictedNumber(num) {
    await delay();
    settings.restrictedNumbers.push(num);
    return { success: true, data: settings.restrictedNumbers };
  },

  async removeRestrictedNumber(number) {
    await delay();
    settings.restrictedNumbers = settings.restrictedNumbers.filter(n => n.number !== number);
    return { success: true, data: settings.restrictedNumbers };
  },

  // === Users ===
  async getUsers() {
    await delay();
    return { success: true, data: [...mockUsers] };
  },

  async addUser(user) {
    await delay();
    const newUser = {
      id: mockUsers.length + 1,
      status: 'offline',
      createdAt: new Date().toISOString().split('T')[0],
      ...user
    };
    mockUsers.push(newUser);
    return { success: true, data: newUser };
  },

  async deleteUser(id) {
    await delay();
    const idx = mockUsers.findIndex(u => u.id === id);
    if (idx === -1) return { success: false, message: 'ไม่พบผู้ใช้' };
    mockUsers.splice(idx, 1);
    return { success: true };
  },

  // === Customers ===
  async getCustomers() {
    await delay();
    return { success: true, data: [...mockCustomers] };
  },

  // === Check Restricted ===
  async checkRestricted(number) {
    await delay();
    const found = settings.restrictedNumbers.find(r => r.number === number);
    return { success: true, restricted: !!found, data: found || null };
  },

  // === Summary ===
  async getSummary() {
    await delay();
    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
    return {
      success: true,
      data: {
        totalBills: transactions.length,
        totalAmount,
        totalCustomers: new Set(transactions.map(t => t.customer)).size,
        topNumbers: getTopNumbers(transactions),
      }
    };
  },
};

function getTopNumbers(txs) {
  const countMap = {};
  txs.forEach(t => {
    countMap[t.number] = (countMap[t.number] || 0) + t.amount;
  });
  return Object.entries(countMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([number, total]) => ({ number, total }));
}
