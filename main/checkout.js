document.addEventListener('DOMContentLoaded', () => {
  const placeBtn = document.querySelector('button[type="submit"]');
  const form = document.querySelector('main form');

  let audioCtx;
  function beep(freq = 620, dur = 0.07) {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'sine';
      o.frequency.value = freq;
      g.gain.value = 0.05;
      o.connect(g);
      g.connect(audioCtx.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
      o.stop(audioCtx.currentTime + dur + 0.02);
    } catch (e) {}
  }

  if (placeBtn && form) {
    placeBtn.addEventListener('click', (e) => {
      const email = form.querySelector('#email');
      const phone = form.querySelector('#phone');
      let ok = true;
      [email, phone].forEach(el => {
        if (!el || !el.value.trim()) {
          ok = false;
          el && el.classList.add('is-invalid');
        } else {
          el && el.classList.remove('is-invalid');
        }
      });

      if (!ok) {
        e.preventDefault();
        beep(280);
        const card = form.closest('.card');
        if (card && card.animate) {
          card.animate([
            { transform: 'translateX(0)' },
            { transform: 'translateX(-6px)' },
            { transform: 'translateX(6px)' },
            { transform: 'translateX(0)' }
          ], { duration: 380, easing: 'ease-in-out' });
        }
      } else {
        beep(720);
      }
    });
  }
});
