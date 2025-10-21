
const registerForm = document.getElementById('registerForm');
const usernameField = document.getElementById('username');
const emailField = document.getElementById('email');
const passwordField = document.getElementById('password');
const confirmField = document.getElementById('confirmPassword');

const usernameError = document.getElementById('usernameError');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const confirmError = document.getElementById('confirmError');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Simple Web Audio API beep for feedback
let audioCtx;
function playBeep(freq = 440, dur = 0.06, type = 'sine') {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = 0.06;
    o.connect(g);
    g.connect(audioCtx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
    o.stop(audioCtx.currentTime + dur + 0.02);
  } catch (err) {
    // ignore audio errors (autoplay policies)
  }
}

function markInvalid(field, messageEl, msg) {
  if (field) field.classList.add('is-invalid');
  if (messageEl) messageEl.textContent = msg;
  // short 'error' beep
  playBeep(260, 0.08, 'sawtooth');
}

function clearInvalid(field, messageEl) {
  if (field) field.classList.remove('is-invalid');
  if (messageEl) messageEl.textContent = '';
}

registerForm.addEventListener('submit', function (e) {
  e.preventDefault();

  [usernameError, emailError, passwordError, confirmError].forEach(el => el.textContent = '');
  [usernameField, emailField, passwordField, confirmField].forEach(f => f && f.classList.remove('is-invalid'));

  let valid = true;

  if (!usernameField.value.trim()) {
    markInvalid(usernameField, usernameError, 'Username is required');
    valid = false;
  }

  if (!emailField.value.trim()) {
    markInvalid(emailField, emailError, 'Email is required');
    valid = false;
  } else if (!emailPattern.test(emailField.value.trim())) {
    markInvalid(emailField, emailError, 'Invalid email format');
    valid = false;
  }

  if (passwordField.value.length < 6) {
    markInvalid(passwordField, passwordError, 'Password must be at least 6 characters');
    valid = false;
  }

  if (confirmField.value !== passwordField.value) {
    markInvalid(confirmField, confirmError, 'Passwords do not match');
    valid = false;
  }

  if (valid) {
    const card = registerForm.closest('.card');
    if (card && card.animate) {
      card.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(1.03)' },
        { transform: 'scale(1)' }
      ], { duration: 380, easing: 'ease-in-out' });
    }
    playBeep(720, 0.09, 'sine');
    setTimeout(() => {
      alert('Registration successful (demo)');
      registerForm.reset();
      window.location.href = '../login/login.html';
    }, 380);
  }
});

const resetBtn = document.getElementById('resetBtn');
if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    registerForm.reset();
    [usernameError, emailError, passwordError, confirmError].forEach(el => el.textContent = '');
    [usernameField, emailField, passwordField, confirmField].forEach(f => f && f.classList.remove('is-invalid'));
    usernameField.focus();
    playBeep(480, 0.05, 'triangle');
  });
}

[usernameField, emailField, passwordField, confirmField].forEach(f => {
  if (!f) return;
  f.addEventListener('input', () => f.classList.remove('is-invalid'));
});
