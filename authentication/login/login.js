

const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const resetBtn = document.getElementById('resetBtn');

let audioCtx;
function playBeep(frequency = 420, duration = 0.06, type = 'sine') {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type;
    o.frequency.value = frequency;
    g.gain.value = 0.06; // low volume
    o.connect(g);
    g.connect(audioCtx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    o.stop(audioCtx.currentTime + duration + 0.02);
  } catch (err) {
  }
}

function validateInputs() {
  const details = {};
  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!username) details.username = 'empty';
  if (password.length < 6) details.password = 'too-short';

  return { valid: Object.keys(details).length === 0, details };
}

function setInvalid(inputEl, message) {
  inputEl.classList.add('is-invalid');
  const feedback = inputEl.parentElement.querySelector('.invalid-feedback');
  if (feedback) feedback.textContent = message;
}

function clearInvalid(inputEl) {
  inputEl.classList.remove('is-invalid');
}

function successAndRedirect() {
  const card = loginForm.closest('.card');
  if (!card) {
    window.location.href = '../../main/welcome/main.html';
    return;
  }

  card.animate([
    { transform: 'scale(1)', offset: 0 },
    { transform: 'scale(1.02)', offset: 0.5 },
    { transform: 'scale(1)', offset: 1 }
  ], { duration: 420, easing: 'ease-in-out' });

  playBeep(660, 0.09, 'sine');

  setTimeout(() => {
    window.location.href = '../../main/welcome/main.html';
  }, 420);
}

loginForm.addEventListener('submit', function (e) {
  e.preventDefault();

  [usernameInput, passwordInput].forEach(clearInvalid);

  const { valid, details } = validateInputs();

  if (!valid) {
    if (details.username) setInvalid(usernameInput, 'Please enter your username.');
    if (details.password) setInvalid(passwordInput, 'Password must be at least 6 characters.');
    playBeep(240, 0.08, 'sawtooth');
    return;
  }

  successAndRedirect();
});

resetBtn.addEventListener('click', () => {
  [usernameInput, passwordInput].forEach(input => {
    input.value = '';
    clearInvalid(input);
  });
  playBeep(480, 0.05, 'triangle');
  usernameInput.focus();
});

[usernameInput, passwordInput].forEach(input => {
  input.addEventListener('input', () => clearInvalid(input));
  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      loginForm.requestSubmit();
    }
  });
});

window.addEventListener('DOMContentLoaded', () => {
  if (usernameInput) usernameInput.focus({ preventScroll: true });
});
