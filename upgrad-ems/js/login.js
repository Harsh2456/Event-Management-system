/**
 * login.js - Admin authentication logic
 * Hard-coded credentials: admin@upgrad.com / 12345
 */

// Hard-coded admin credentials
const ADMIN_EMAIL    = 'admin@upgrad.com';
const ADMIN_PASSWORD = '12345';

const loginForm  = document.getElementById('login-form');
const alertEl    = document.getElementById('login-alert');
const alertMsg   = document.getElementById('login-alert-msg');
const togglePwd  = document.getElementById('toggle-pwd');
const eyeIcon    = document.getElementById('eye-icon');
const pwdInput   = document.getElementById('password');

/**
 * Show an error alert with a given message.
 */
function showLoginError(msg) {
  alertMsg.textContent = msg;
  alertEl.classList.remove('d-none');
}

/**
 * Hide the error alert.
 */
function hideLoginError() {
  alertEl.classList.add('d-none');
}

/**
 * Toggle password visibility.
 */
togglePwd.addEventListener('click', () => {
  const isPassword = pwdInput.type === 'password';
  pwdInput.type = isPassword ? 'text' : 'password';
  eyeIcon.classList.toggle('bi-eye', !isPassword);
  eyeIcon.classList.toggle('bi-eye-slash', isPassword);
});

/**
 * Handle login form submission.
 */
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  hideLoginError();

  // Trigger Bootstrap validation UI
  loginForm.classList.add('was-validated');

  const emailInput = document.getElementById('email');
  const email    = emailInput.value.trim();
  const password = pwdInput.value.trim();

  // HTML5 validation pass-through
  if (!loginForm.checkValidity()) {
    return;
  }

  // Authenticate
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    // Mark session as authenticated
    sessionStorage.setItem('isAdminLoggedIn', 'true');
    sessionStorage.setItem('adminEmail', email);

    // Redirect to events page
    window.location.href = 'events.html';
  } else {
    showLoginError('Invalid email or password. Please try again.');
    loginForm.classList.remove('was-validated');
  }
});

// Auto-clear alert on input change
document.getElementById('email').addEventListener('input', hideLoginError);
pwdInput.addEventListener('input', hideLoginError);
