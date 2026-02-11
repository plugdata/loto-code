/**
 * @file API Client - Lotto Key System
 * @description เชื่อมต่อกับ Hono Backend API
 * @see {@link http://localhost:3001/api Swagger API Docs}
 * 
 * API Response Format:
 * - Success: { success: true, data: {...} }
 * - Error: { success: false, message: "error message" }
 */

// ===== Configuration =====
const BASE_URL = 'http://localhost:3001/api';

/**
 * Generic request handler
 * @param {string} path - API endpoint path (e.g., '/settings')
 * @param {Object} options - Fetch options
 * @param {string} [options.method='GET'] - HTTP method
 * @param {Object} [options.body] - Request body
 * @param {Object} [options.headers] - Additional headers
 * @returns {Promise<Object>} API response
 */
async function request(path, options = {}) {
  const { method = 'GET', body, headers = {} } = options;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: 'include', // Send cookies for authenticated requests
    ...(body && { body: JSON.stringify(body) }),
  });

  const data = await res.json();

  // Throw error if API indicates failure
  if (!data.success) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
}

// ===== API Methods =====
export const api = {
  /**
   * @namespace api.Settings
   * @description ตั้งค่าระบบ (อัตราจ่าย, เปิด/ปิด)
   * @see {@link http://localhost:3001/api/settings GET /api/settings}
   */
  settings: {
    /** @returns {Promise<{payRate2Digit: number, payRate3Digit: number, isLotteryOpen: boolean, closingTime: string, ...}>} Settings object */
    get: () => request('/settings'),
    /** @param {Object} updates - Settings to update
     * @param {boolean} [updates.isLotteryOpen] - Whether lottery is open
     * @param {string} [updates.closingTime] - Closing time (e.g., '14:30')
     * @param {Object} [updates.payRates] - Pay rates per bet type
     */
    update: (updates) => request('/settings', { method: 'PUT', body: updates }),
  },

  /**
   * @namespace api.Transactions
   * @description รายการแทงหวย
   * @see {@link http://localhost:3001/api/transactions GET /api/transactions}
   */
  transactions: {
    /** @returns {Promise<Array<{id: number, betTypeCode: string, number: string, amount: number, ...}>>} Array of transactions */
    get: () => request('/transactions'),
    /** @param {Object} tx - Transaction data
     * @param {string} tx.betTypeCode - Bet type code (e.g., 'song_bon')
     * @param {string} tx.number - Number to bet on
     * @param {number} tx.amount - Bet amount
     * @param {string} [tx.customer] - Customer name
     */
    add: (tx) => request('/transactions', {
      method: 'POST',
      body: {
        bet_type_code: tx.betTypeCode || tx.type || '',
        bet_type_label: tx.type || '',
        number: tx.number,
        amount: tx.amount,
        customer_id: tx.customerId || null,
        customer_name: tx.customer || 'ลูกค้าทั่วไป',
        user_id: tx.userId || null,
        user_name: tx.user || 'ADMIN',
      },
    }),
    /** @param {number} id - Transaction ID to delete */
    delete: (id) => request(`/transactions/${id}`, { method: 'DELETE' }),
    /** @description Clear all transactions */
    clear: () => request('/transactions', { method: 'DELETE' }),
  },

  /**
   * @namespace api.RestrictedNumbers
   * @description หวยอั้น (restricted numbers)
   * @see {@link http://localhost:3001/api/restricted GET /api/restricted}
   */
  restricted: {
    /** @returns {Promise<Array<{number: string, maxAmount: number, type: string}>>} Array of restricted numbers */
    get: () => request('/restricted'),
    /** @param {Object} num - Restricted number data
     * @param {string} num.number - Number to restrict
     * @param {number} [num.maxAmount] - Maximum bet amount
     * @param {string} [num.type] - Type ('2ตัว' or '3ตัว')
     */
    add: (num) => request('/restricted', { method: 'POST', body: num }),
    /** @param {string} number - Number to remove from restricted list */
    remove: (number) => request(`/restricted/${encodeURIComponent(number)}`, { method: 'DELETE' }),
    /** @param {string} number - Number to check
     * @returns {Promise<{restricted: boolean, data: Object|null}>} Check result
     */
    check: (number) => request(`/restricted/check/${encodeURIComponent(number)}`),
  },

  /**
   * @namespace api.BetTypes
   * @description ประเภทหวย (2ตัว/3ตัว/พิเศษ)
   * @see {@link http://localhost:3001/api/bet-types GET /api/bet-types}
   */
  betTypes: {
    /** @returns {Promise<{digit2: Array, digit3: Array, special: Array}>} Bet types grouped by category */
    get: () => request('/bet-types'),
  },

  /**
   * @namespace api.Summary
   * @description สรุปยอด
   * @see {@link http://localhost:3001/api/summary GET /api/summary}
   */
  summary: {
    /** @returns {Promise<{totalBills: number, totalAmount: number, totalCustomers: number, topNumbers: Array}>} Summary data */
    get: () => request('/summary'),
  },

  /**
   * @namespace api.Customers
   * @description จัดการลูกค้า
   * @see {@link http://localhost:3001/api/customers GET /api/customers}
   */
  customers: {
    /** @returns {Promise<Array<{id: string, name: string, phone: string, status: string, balance: number}>>} Array of customers */
    get: () => request('/customers'),
    /** @param {Object} customer - Customer data
     * @param {string} customer.name - Customer name
     * @param {string} [customer.phone] - Phone number
     * @param {number} [customer.balance] - Initial balance
     * @param {number} [customer.percentage] - Commission percentage
     */
    add: (customer) => request('/customers', { method: 'POST', body: customer }),
    /** @param {string} id - Customer ID to delete */
    delete: (id) => request(`/customers/${id}`, { method: 'DELETE' }),
  },

  /**
   * @namespace api.Users
   * @description จัดการผู้ใช้
   * @see {@link http://localhost:3001/api/users GET /api/users}
   */
  users: {
    /** @returns {Promise<Array<{id: string, username: string, role: string}>>} Array of users */
    get: () => request('/users'),
    /** @param {Object} user - User data
     * @param {string} user.username - Username
     * @param {string} user.password - Password
     * @param {string} [user.role] - Role ('admin', 'agent', 'customer')
     */
    add: (user) => request('/users', { method: 'POST', body: user }),
    /** @param {string} id - User ID to delete */
    delete: (id) => request(`/users/${id}`, { method: 'DELETE' }),
  },

  /**
   * @namespace api.LotteryTypes
   * @description ประเภทหวย (หวยไทย/ลาว/ฮานอย ฯลฯ)
   * @see {@link http://localhost:3001/api/lottery-types GET /api/lottery-types}
   */
  lotteryTypes: {
    get: () => request('/lottery-types'),
    check: (code) => request(`/lottery-types/check/${encodeURIComponent(code)}`),
    add: (data) => request('/lottery-types', { method: 'POST', body: data }),
    update: (id, data) => request(`/lottery-types/${id}`, { method: 'PATCH', body: data }),
    delete: (id) => request(`/lottery-types/${id}`, { method: 'DELETE' }),
  },

  /**
   * @namespace api.Rounds
   * @description จัดการงวดหวย
   * @see {@link http://localhost:3001/api/rounds GET /api/rounds}
   */
  rounds: {
    /** @param {Object} [query] - Query params { lotteryTypeId, status } */
    get: (query = {}) => {
      const params = new URLSearchParams(query).toString();
      return request(`/rounds${params ? '?' + params : ''}`);
    },
    getOpen: () => request('/rounds/open'),
    getNextNumber: (lotteryTypeId) => request(`/rounds/next-number/${lotteryTypeId}`),
    getById: (id) => request(`/rounds/${id}`),
    getReport: (id) => request(`/rounds/${id}/report`),
    add: (data) => request('/rounds', { method: 'POST', body: data }),
    addBulk: (data) => request('/rounds/bulk', { method: 'POST', body: data }),
    update: (id, data) => request(`/rounds/${id}`, { method: 'PATCH', body: data }),
    delete: (id) => request(`/rounds/${id}`, { method: 'DELETE' }),
  },

  /**
   * @namespace api.Auth
   * @description การยืนยันตัวตน
   * @see {@link http://localhost:3001/api/auth/login POST /api/auth/login}
   */
  auth: {
    /** @param {string} username - Username
     * @param {string} password - Password
     * @returns {Promise<{access_token: string}>} Login response with token
     */
    login: (username, password) => request('/auth/login', {
      method: 'POST',
      body: { username, password },
    }),
    /** @param {Object} user - Registration data
     * @param {string} user.username - Username
     * @param {string} user.password - Password
     * @param {string} [user.role] - Role
     */
    register: (user) => request('/auth/register', { method: 'POST', body: user }),
    /** @returns {Promise<Object>} Current user profile */
    profile: () => request('/auth/profile'),
    /** @description Logout current user */
    logout: () => request('/auth/logout', { method: 'POST' }),
  },
};

// Legacy method names for backward compatibility
export const apiLegacy = {
  getSettings: () => api.settings.get(),
  updateSettings: (updates) => api.settings.update(updates),
  getTransactions: () => api.transactions.get(),
  addTransaction: (tx) => api.transactions.add(tx),
  deleteTransaction: (id) => api.transactions.delete(id),
  clearTransactions: () => api.transactions.clear(),
  addRestrictedNumber: (num) => api.restricted.add(num),
  removeRestrictedNumber: (number) => api.restricted.remove(number),
  checkRestricted: (number) => api.restricted.check(number),
  getUsers: () => api.users.get(),
  addUser: (user) => api.users.add(user),
  deleteUser: (id) => api.users.delete(id),
  getCustomers: () => api.customers.get(),
  addCustomer: (customer) => api.customers.add(customer),
  deleteCustomer: (id) => api.customers.delete(id),
  getBetTypes: () => api.betTypes.get(),
  getSummary: () => api.summary.get(),
};
