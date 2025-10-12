document.addEventListener('DOMContentLoaded', () => {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const chevron = item.querySelector('.chevron');

    // Hide answers by default
    answer.style.maxHeight = '0';
    answer.style.overflow = 'hidden';
    answer.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';
    answer.style.opacity = '0';

    question.style.cursor = 'pointer';

    // Toggle visibility
    question.addEventListener('click', () => {
      const isOpen = chevron.classList.contains('rotated');

      // Close all other items
      faqItems.forEach((item) => {
        const answer = item.querySelector('.faq-answer');
        const chevron = item.querySelector('.chevron');
        answer.style.maxHeight = '0';
        answer.style.opacity = '0';
        chevron.classList.remove('rotated');
      });

      // If the clicked one was closed — open it
      if (!isOpen) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        answer.style.opacity = '1';
        chevron.classList.add('rotated');
      }
    });
  });
});
