
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

  function initBackgroundChanger() {
    const changeButton = document.getElementById("change-bg-btn");
    if (!changeButton) return;
    changeButton.addEventListener("click", () => {
      // Choose cycling; switch to setRandomBackgroundColor() if random preferred
      cycleBackgroundColor();
    });
  }
})();


