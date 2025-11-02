document.addEventListener('DOMContentLoaded', () => {
  const faqItems = document.querySelectorAll('.faq-item');

  // Initialize sound system for FAQ interactions
  let audioCtx;
  function playSound(freq = 600, duration = 0.1) {
    try {
      if (!audioCtx)
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'sine';
      o.frequency.value = freq;
      g.gain.value = 0.05;
      o.connect(g);
      g.connect(audioCtx.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(
        0.0001,
        audioCtx.currentTime + duration
      );
      o.stop(audioCtx.currentTime + duration + 0.01);
    } catch (err) {
      console.warn('Audio not supported');
    }
  }

  // Animation helper functions
  function bounceElement(element, scale = 1.05, duration = 200) {
    if (!element) return;

    element.style.transition = `transform ${duration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`;
    element.style.transform = `scale(${scale})`;

    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, duration / 2);
  }

  function slideInElement(element, direction = 'left', duration = 300) {
    if (!element) return;

    const transforms = {
      left: 'translateX(-100%)',
      right: 'translateX(100%)',
      up: 'translateY(-100%)',
      down: 'translateY(100%)',
    };

    element.style.transition = `transform ${duration}ms ease-out`;
    element.style.transform = transforms[direction] || transforms.left;

    requestAnimationFrame(() => {
      element.style.transform = 'translate(0, 0)';
    });
  }

  function pulseElement(element, duration = 1000) {
    if (!element) return;

    const keyframes = [
      { transform: 'scale(1)', opacity: 1 },
      { transform: 'scale(1.02)', opacity: 0.8 },
      { transform: 'scale(1)', opacity: 1 },
    ];

    element.animate(keyframes, {
      duration: duration,
      iterations: 3,
      easing: 'ease-in-out',
    });
  }

  // Enhanced FAQ functionality with animations and sound
  faqItems.forEach((item, index) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const chevron = item.querySelector('.chevron');

    // Hide answers by default with enhanced styling
    answer.style.maxHeight = '0';
    answer.style.overflow = 'hidden';
    answer.style.transition =
      'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, transform 0.3s ease';
    answer.style.opacity = '0';
    answer.style.transform = 'translateY(-10px)';

    question.style.cursor = 'pointer';
    question.style.transition =
      'background-color 0.2s ease, transform 0.2s ease';

    // Add hover effects to questions
    question.addEventListener('mouseenter', () => {
      question.style.backgroundColor = '#f8f9fa';
      question.style.transform = 'translateX(5px)';
      playSound(500, 0.05);
    });

    question.addEventListener('mouseleave', () => {
      question.style.backgroundColor = '';
      question.style.transform = 'translateX(0)';
    });

    // Enhanced click handler with animations and sound
    question.addEventListener('click', () => {
      const isOpen = chevron.classList.contains('rotated');

      // Play click sound
      playSound(isOpen ? 400 : 700, 0.15);

      // Bounce animation for the clicked question
      bounceElement(question, 1.02, 150);

      // Close all other items with smooth animations
      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          const otherAnswer = otherItem.querySelector('.faq-answer');
          const otherChevron = otherItem.querySelector('.chevron');
          const otherQuestion = otherItem.querySelector('.faq-question');

          otherAnswer.style.maxHeight = '0';
          otherAnswer.style.opacity = '0';
          otherAnswer.style.transform = 'translateY(-10px)';
          otherChevron.classList.remove('rotated');
          otherQuestion.style.backgroundColor = '';
          otherQuestion.style.transform = 'translateX(0)';
        }
      });

      // If the clicked one was closed — open it with enhanced animation
      if (!isOpen) {
        // Enhanced opening animation
        answer.style.maxHeight = answer.scrollHeight + 'px';
        answer.style.opacity = '1';
        answer.style.transform = 'translateY(0)';
        chevron.classList.add('rotated');

        // Add subtle pulse animation to the answer
        setTimeout(() => {
          pulseElement(answer, 800);
        }, 200);

        // Enhanced visual feedback
        question.style.backgroundColor = '#e3f2fd';
        setTimeout(() => {
          question.style.backgroundColor = '';
        }, 300);
      } else {
        // Enhanced closing animation
        answer.style.maxHeight = '0';
        answer.style.opacity = '0';
        answer.style.transform = 'translateY(-10px)';
        chevron.classList.remove('rotated');
        question.style.backgroundColor = '';
      }
    });

    // Add staggered entrance animation for FAQ items
    setTimeout(() => {
      slideInElement(item, 'left', 400);
    }, index * 100);
  });
});

$(document).ready(function () {
  const $searchInput = $('#faqSearch');
  const $faqItems = $('.faq-item');

  $searchInput.on('keyup', function () {
    const query = $(this).val().trim();
    let totalMatches = 0;

    // Clear previous highlights
    $faqItems.find('h3, p').each(function () {
      const originalText = $(this).text();
      $(this).html(originalText);
    });

    if (query === '') {
      $('#searchResults').text('');
      $faqItems.show();
      return;
    }

    const regex = new RegExp('(' + query + ')', 'gi');

    $faqItems.each(function () {
      const $item = $(this);
      const $question = $item.find('h3');
      const $answer = $item.find('p');

      let matched = false;

      // Highlight in question
      const qHtml = $question.text().replace(regex, '<mark>$1</mark>');
      if (qHtml !== $question.text()) {
        matched = true;
        $question.html(qHtml);
      }

      // Highlight in answer
      const aHtml = $answer.text().replace(regex, '<mark>$1</mark>');
      if (aHtml !== $answer.text()) {
        matched = true;
        $answer.html(aHtml);
      }d

      // Show/hide depending on match
      if (matched) {
        $item.show();
        totalMatches++;
      } else {
        $item.hide();
      }
    });

    $('#searchResults').text(
      totalMatches > 0
        ? `Found ${totalMatches} result${totalMatches > 1 ? 's' : ''}.`
        : 'No results found.'
    );
  });
});
