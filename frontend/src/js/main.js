/* ============================================================
   FleetFlow — main.js  (NO-SERVER VERSION)
   src/js/main.js

   Works with file:// AND with a dev server.
   Components are inlined here instead of fetched, so no
   CORS/fetch errors when opening HTML files directly.
   ============================================================ */

import { clearUser, getUser, initModalClosers, populateUserUI } from './helpers.js';

/* ── Navbar HTML (mirrors src/components/Navbar.html) ── */
const NAVBAR_HTML = `
<nav class="topbar">
  <a href="dashboard.html" class="logo">
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="9" fill="#7c6ff7"/>
      <path d="M6 20h2.5l1.5-6 3 8 3-12 2.5 10 2-4H26" stroke="white" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    FleetFlow
  </a>
  <div class="topbar-search">
    <span class="search-icon">🔍</span>
    <input type="text" id="globalSearch" placeholder="Search vehicles, trips, drivers…" autocomplete="off">
  </div>
  <div class="topbar-right">
    <button class="icon-btn" id="notifBtn" title="Notifications">
      🔔
      <span class="notif-badge" id="notifDot"></span>
    </button>
    <button class="icon-btn" title="Settings">⚙️</button>
    <div class="user-pill" id="userPill">
      <div class="user-avatar" id="userInitials">?</div>
      <span class="user-name" id="userDisplayName">Loading…</span>
    </div>
  </div>
</nav>`;

/* ── Sidebar HTML (mirrors src/components/Sidebar.html) ── */
const SIDEBAR_HTML = `
<aside class="sidebar" id="sidebar">
  <span class="sidebar-section">Main</span>
  <a href="dashboard.html"   class="nav-item" data-page="dashboard"><span class="nav-icon">📊</span> Dashboard</a>
  <a href="vehicles.html"    class="nav-item" data-page="vehicles"><span class="nav-icon">🚗</span> Vehicles</a>
  <a href="trips.html"       class="nav-item" data-page="trips"><span class="nav-icon">🗺️</span> Trips<span class="nav-badge" id="badge-trips">3</span></a>
  <a href="drivers.html"     class="nav-item" data-page="drivers"><span class="nav-icon">👤</span> Drivers</a>

  <span class="sidebar-section">Operations</span>
  <a href="maintenance.html" class="nav-item" data-page="maintenance"><span class="nav-icon">🔧</span> Maintenance<span class="nav-badge danger" id="badge-maintenance">2</span></a>
  <a href="expenses.html"    class="nav-item" data-page="expenses"><span class="nav-icon">💰</span> Expenses</a>
  <a href="analytics.html"   class="nav-item" data-page="analytics"><span class="nav-icon">📈</span> Analytics</a>

  <span class="sidebar-section">Account</span>
  <button class="nav-item" id="logoutBtn"><span class="nav-icon">🚪</span> Logout</button>
</aside>`;

async function init() {
  /* 1 ── Auth guard */
  if (!getUser()) {
    window.location.href = '../pages/register.html';
    return;
  }

  /* 2 ── Inject components (works with file:// — no fetch needed) */
  const navbarMount  = document.getElementById('navbar-mount');
  const sidebarMount = document.getElementById('sidebar-mount');
  if (navbarMount)  navbarMount.innerHTML  = NAVBAR_HTML;
  if (sidebarMount) sidebarMount.innerHTML = SIDEBAR_HTML;

  /* 3 ── Highlight active nav item based on current filename */
  const currentPage = location.pathname.split('/').pop().replace('.html', '');
  document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    item.classList.toggle('active', item.dataset.page === currentPage);
  });

  /* 4 ── Populate user name in topbar */
  populateUserUI();

  /* 5 ── Logout */
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      clearUser();
      window.location.href = '../pages/register.html';
    });
  }

  /* 6 ── Modal close on backdrop / ESC */
  initModalClosers();

  /* 7 ── Page entry animation */
  const main = document.querySelector('.main');
  if (main) main.classList.add('page-enter');
}

init();