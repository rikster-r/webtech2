// Global Theme Initializer
// Applies saved theme as early as possible on every page
+(function applySavedThemeEarly() {
  try {
    var saved = null;
    try {
      saved = window.localStorage ? localStorage.getItem('theme') : null;
    } catch (_) {}

    var isDark = saved === 'dark';
    var root = document.documentElement; // <html>

    if (isDark) {
      root.classList.add('dark-theme');
    } else {
      root.classList.remove('dark-theme');
    }

    // When body becomes available, mirror the class for styles targeting body
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        if (isDark) document.body.classList.add('dark-theme');
        else document.body.classList.remove('dark-theme');
      });
    } else if (document.body) {
      if (isDark) document.body.classList.add('dark-theme');
      else document.body.classList.remove('dark-theme');
    }
  } catch (_) {
    // no-op; fail safe if anything goes wrong
  }
})();
