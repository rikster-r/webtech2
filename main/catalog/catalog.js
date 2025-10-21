document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('header nav .nav-link');
  if (!navLinks || navLinks.length === 0) return;

  navLinks.forEach((link, index) => {
    link.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const next = navLinks[(index + 1) % navLinks.length];
        next.focus();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = navLinks[(index - 1 + navLinks.length) % navLinks.length];
        prev.focus();
      }
    });
  });
  
  const buyButtons = document.querySelectorAll('.buy-btn');
  const addButtons = document.querySelectorAll('.add-cart-button, .add-cart');

  let audioCtx;
  function clickBeep(freq = 540) {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'square';
      o.frequency.value = freq;
      g.gain.value = 0.05;
      o.connect(g);
      g.connect(audioCtx.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.06);
      o.stop(audioCtx.currentTime + 0.07);
    } catch (err) {}
  }

  function pop(element) {
    if (!element || !element.animate) return;
    element.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(1.06)' },
      { transform: 'scale(1)' }
    ], { duration: 220, easing: 'ease-out' });
  }

  buyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      pop(btn);
      clickBeep(660);
      setTimeout(() => window.location.href = '../cart/cart.html', 260);
    });
  });

  addButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      pop(btn);
      clickBeep(520);
    });
  });
});
