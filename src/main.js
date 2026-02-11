// ===== LOTTO KEY SYSTEM - MAIN ENTRY =====
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './css/theme.css';

import { registerRoute, initRouter, setAuthenticated } from './js/router.js';
import { renderKeyPage } from './pages/keyPage.js';
import { renderSettingsPage } from './pages/settingsPage.js';
import { renderUsersPage } from './pages/usersPage.js';
import { renderSummaryPage } from './pages/summaryPage.js';
import { renderCustomerPage } from './pages/customerPage.js';
import { renderLoginPage } from './pages/loginPage.js';
import { renderRegisterPage } from './pages/registerPage.js';
import { renderLotterySelectPage } from './pages/lotterySelectPage.js';
import { api } from './api/apiClient.js';

// ===== CHECK AUTH =====
async function checkAuth() {
  try {
    const res = await fetch('http://localhost:3001/api/auth/profile', {
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        localStorage.setItem('user', JSON.stringify(data.data));
        return data.data;
      }
    }
  } catch {}

  const stored = localStorage.getItem('user');
  if (stored) {
    try { return JSON.parse(stored); }
    catch { localStorage.removeItem('user'); }
  }
  return null;
}

// ===== BUILD APP =====
async function initApp() {
  const user = await checkAuth();
  const app = document.getElementById('app');

  // Default settings
  const defaultSettings = {
    payRate2Digit: 95,
    payRate3Digit: 900,
    closingTime: '14:30',
    isLotteryOpen: true,
  };

  let settings = defaultSettings;

  if (user) {
    // Load settings
    try {
      const settingsRes = await api.settings.get();
      if (settingsRes?.data) {
        settings = { ...defaultSettings, ...settingsRes.data };
      }
    } catch {}
  }

  const displayName = user?.displayName || user?.username || 'ADMIN';
  const displayRole = (user?.role || 'admin').toUpperCase();

  app.innerHTML = `
    <!-- APP SHELL (hidden when not authenticated) -->
    <div id="app-shell" style="${user ? '' : 'display:none;'}">
      <!-- TOP HEADER -->
      <div class="top-header">
        <div class="header-left">
          <div class="header-logo">LK</div>
          <div class="pay-badge">
            <div class="label">2-DIGIT PAY</div>
            <div class="amount" id="header-pay-2digit">฿${settings.payRate2Digit}.00</div>
          </div>
          <div class="pay-badge">
            <div class="label">3-DIGIT PAY</div>
            <div class="amount" id="header-pay-3digit">฿${settings.payRate3Digit}.00</div>
          </div>
        </div>
        <div class="header-right">
          <div class="user-info">
            <div class="role">${displayRole}</div>
            <div class="name">${displayName}</div>
          </div>
          <button class="btn-logout" id="btn-logout">
            <i class="bi bi-box-arrow-right"></i> Logout
          </button>
          <div class="countdown-timer" id="countdown-timer">--:--:--</div>
        </div>
      </div>

      <!-- NAV TABS -->
      <div class="nav-tabs-custom">
        <a class="nav-tab active" data-route="select" href="#select">
          <i class="bi bi-ticket-perforated-fill"></i> เลือกหวย
        </a>
        <a class="nav-tab" data-route="customers" href="#customers">
          <i class="bi bi-people"></i> ลูกค้า
        </a>
        ${user?.role === 'admin' ? `
        <a class="nav-tab" data-route="settings" href="#settings">
          <i class="bi bi-sliders"></i> พารามิเตอร์
        </a>` : ''}
        <a class="nav-tab" data-route="summary" href="#summary">
          <i class="bi bi-bar-chart-line"></i> สรุปยอด
        </a>
        ${user?.role === 'admin' ? `
        <a class="nav-tab" data-route="users" href="#users">
          <i class="bi bi-person-gear"></i> จัดการผู้ใช้
        </a>` : ''}
      </div>
    </div>

    <!-- PAGE CONTENT (always visible) -->
    <div id="page-content" style="flex: 1; display: flex; flex-direction: column;"></div>
  `;

  // Logout handler
  document.getElementById('btn-logout')?.addEventListener('click', async () => {
    try {
      await fetch('http://localhost:3001/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {}
    localStorage.removeItem('user');
    window.location.hash = '#login';
    window.location.reload();
  });

  // Set auth state
  setAuthenticated(!!user);

  // Register all routes
  registerRoute('login', renderLoginPage);
  registerRoute('register', renderRegisterPage);
  registerRoute('select', renderLotterySelectPage);
  registerRoute('key', renderKeyPage);
  registerRoute('customers', renderCustomerPage);
  registerRoute('settings', renderSettingsPage);
  registerRoute('summary', renderSummaryPage);
  registerRoute('users', renderUsersPage);

  // Start router (timer จะเริ่มเมื่อเข้าหน้า key ตาม closeTime ของ lottery type)
  initRouter(user ? 'select' : 'login');
}

// ===== BOOT =====
initApp();
