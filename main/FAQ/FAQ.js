document.addEventListener('DOMContentLoaded', () => {
  const faqItems = document.querySelectorAll('.faq-item');

  // Initialize sound system for FAQ interactions
  let audioCtx;
  function playSound(freq = 600, duration = 0.1) {
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
      g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
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
      down: 'translateY(100%)'
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
      { transform: 'scale(1)', opacity: 1 }
    ];

    element.animate(keyframes, {
      duration: duration,
      iterations: 3,
      easing: 'ease-in-out'
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
    answer.style.transition = 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, transform 0.3s ease';
    answer.style.opacity = '0';
    answer.style.transform = 'translateY(-10px)';

    question.style.cursor = 'pointer';
    question.style.transition = 'background-color 0.2s ease, transform 0.2s ease';

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

  // Add search functionality to FAQ
  addFAQSearch();

  // Add keyboard navigation
  addKeyboardNavigation();
});

function addFAQSearch() {
  // Create search input
  const searchContainer = document.createElement('div');
  searchContainer.style.cssText = `
    margin-bottom: 30px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #dee2e6;
  `;

  searchContainer.innerHTML = `
    <h5 style="margin-bottom: 15px; color: #dc3545;">Search FAQ</h5>
    <input type="text" id="faqSearch" placeholder="Search frequently asked questions..." 
           style="width: 100%; padding: 10px; border: 1px solid #ced4da; border-radius: 4px; font-size: 16px;">
    <div id="searchResults" style="margin-top: 10px; font-size: 14px; color: #6c757d;"></div>
  `;

  // Insert search at the top of FAQ section
  const faqSection = document.querySelector('.faq-section') || document.querySelector('main') || document.body;
  faqSection.insertBefore(searchContainer, faqSection.firstChild);

  // Add search functionality
  const searchInput = document.getElementById('faqSearch');
  const searchResults = document.getElementById('searchResults');
  const faqItems = document.querySelectorAll('.faq-item');

  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    let visibleCount = 0;

    faqItems.forEach((item, index) => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      const questionText = question.textContent.toLowerCase();
      const answerText = answer.textContent.toLowerCase();
      
      const matches = questionText.includes(searchTerm) || answerText.includes(searchTerm);
      
      if (matches) {
        item.style.display = 'block';
        item.style.transform = 'scale(1)';
        item.style.opacity = '1';
        item.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        visibleCount++;
      } else {
        item.style.transform = 'scale(0.95)';
        item.style.opacity = '0.3';
        item.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      }
    });

    // Update search results counter
    searchResults.textContent = searchTerm ? 
      `${visibleCount} question(s) found` : 
      `${faqItems.length} total questions`;
  });
}

function addKeyboardNavigation() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Close all FAQ items
      faqItems.forEach((item) => {
        const answer = item.querySelector('.faq-answer');
        const chevron = item.querySelector('.chevron');
        const question = item.querySelector('.faq-question');
        
        answer.style.maxHeight = '0';
        answer.style.opacity = '0';
        answer.style.transform = 'translateY(-10px)';
        chevron.classList.remove('rotated');
        question.style.backgroundColor = '';
        question.style.transform = 'translateX(0)';
      });
    }
  });

  // Add focus management for accessibility
  faqItems.forEach((item, index) => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        question.click();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextItem = faqItems[index + 1];
        if (nextItem) {
          nextItem.querySelector('.faq-question').focus();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevItem = faqItems[index - 1];
        if (prevItem) {
          prevItem.querySelector('.faq-question').focus();
        }
      }
    });
  });
}
