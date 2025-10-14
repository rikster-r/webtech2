
(() => {
  const backgroundColors = [
    "#ffffff", // white
    "#f8f9fa", // light gray
    "#e3f2fd", // light blue
    "#e8f5e9", // light green
    "#fff3e0", // light orange
    "#f3e5f5"  // light purple
  ];

  let currentColorIndex = 0;

  function cycleBackgroundColor() {
    currentColorIndex = (currentColorIndex + 1) % backgroundColors.length;
    document.body.style.backgroundColor = backgroundColors[currentColorIndex];
  }

  function setRandomBackgroundColor() {
    const randomIndex = Math.floor(Math.random() * backgroundColors.length);
    document.body.style.backgroundColor = backgroundColors[randomIndex];
    currentColorIndex = randomIndex;
  }

  function initBackgroundChanger() {
    const changeButton = document.getElementById("change-bg-btn");
    if (!changeButton) return;
    changeButton.addEventListener("click", () => {
      // Choose cycling; switch to setRandomBackgroundColor() if random preferred
      cycleBackgroundColor();
    });
  }

  // Task 5: Display current date and time
  function formatDateTime(date) {
    // Use locale to ensure cross-browser friendly formatting
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    };
    return date.toLocaleString(undefined, options);
  }

  function initDateTime() {
    const target = document.getElementById("current-datetime");
    if (!target) return;

    const update = () => {
      target.textContent = formatDateTime(new Date());
    };

    update();
    // Update every second
    setInterval(update, 1000);
  }

  // Initialize after DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initBackgroundChanger();
      initDateTime();
    });
  } else {
    initBackgroundChanger();
    initDateTime();
  }
})();


