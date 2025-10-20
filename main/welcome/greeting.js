document.addEventListener('DOMContentLoaded', () => {
  const heading = document.querySelector('h1');

  const now = new Date();
  const hour = now.getHours();

  let greeting = '';

  if (hour >= 5 && hour < 12) {
    greeting = 'Good morning';
  } else if (hour >= 12 && hour < 18) {
    greeting = 'Good afternoon';
  } else {
    greeting = 'Good evening';
  }

  heading.textContent = `${greeting}, welcome to Egoisty shop!`;
});
