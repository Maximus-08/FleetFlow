/* ============================================================
   FleetFlow — Login Page
   src/js/login.js
   ============================================================ */

import { AuthAPI } from '../services/api.js';
import { isLoggedIn, setSession } from '../utils/helpers.js';

// Redirect if already logged in
if (isLoggedIn()) window.location.href = '/src/pages/full.html';

const form     = document.getElementById('login-form');
const emailEl  = document.getElementById('login-email');
const passEl   = document.getElementById('login-password');
const btnEl    = document.getElementById('login-btn');
const errorEl  = document.getElementById('login-error');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const { token, user } = await AuthAPI.login({
      email:    emailEl.value.trim(),
      password: passEl.value,
    });
    setSession(token, user);
    window.location.href = '/src/pages/full.html';
  } catch (err) {
    setError(err.message || 'Invalid email or password');
  } finally {
    setLoading(false);
  }
});

function setError(msg) {
  if (errorEl) {
    errorEl.textContent = msg;
    errorEl.style.display = msg ? 'block' : 'none';
  }
}

function setLoading(loading) {
  if (btnEl) {
    btnEl.disabled = loading;
    btnEl.textContent = loading ? 'Signing in…' : 'Sign in';
  }
}