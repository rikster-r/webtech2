(() => {
  function formatDateTime(date) {
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
    setInterval(update, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDateTime);
  } else {
    initDateTime();
  }
})();
