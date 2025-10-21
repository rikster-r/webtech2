/**
 * Enhanced FAQ Page JavaScript
 * Demonstrates Higher-Order Functions, Objects, Arrays, Sound Effects, and Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. OBJECTS AND METHODS - FAQ Management System
  const faqManager = {
    questions: [
      {
        id: 1,
        question: '❓ Как оформить заказ?',
        answer: 'Выберите товар в каталоге, добавьте его в корзину и перейдите к оформлению заказа.',
        category: 'ordering',
        popularity: 0
      },
      {
        id: 2,
        question: '❓ Какие способы оплаты доступны?',
        answer: 'Мы принимаем оплату картами Visa, MasterCard и через Kaspi.',
        category: 'payment',
        popularity: 0
      },
      {
        id: 3,
        question: '❓ Доставка по Казахстану есть?',
        answer: 'Да, доставка осуществляется во все регионы Казахстана.',
        category: 'delivery',
        popularity: 0
      },
      {
        id: 4,
        question: '❓ Могу ли я вернуть товар?',
        answer: 'Да, возврат возможен в течение 14 дней при сохранении товарного вида.',
        category: 'returns',
        popularity: 0
      },
      {
        id: 5,
        question: '❓ Сколько времени занимает доставка?',
        answer: 'Доставка обычно занимает 3-5 рабочих дней в пределах Казахстана.',
        category: 'delivery',
        popularity: 0
      },
      {
        id: 6,
        question: '❓ Есть ли гарантия на товары?',
        answer: 'Да, на все товары предоставляется гарантия от производителя.',
        category: 'warranty',
        popularity: 0
      }
    ],
    
    // Object method to get questions by category
    getQuestionsByCategory(category) {
      return this.questions.filter(q => q.category === category);
    },
    
    // Object method to search questions
    searchQuestions(searchTerm) {
      return this.questions.filter(q => 
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    },
    
    // Object method to increment popularity
    incrementPopularity(questionId) {
      const question = this.questions.find(q => q.id === questionId);
      if (question) {
        question.popularity++;
      }
    },
    
    // Object method to get most popular questions
    getMostPopularQuestions(limit = 3) {
      return this.questions
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, limit);
    }
  };

  // 2. ARRAYS AND LOOPS - Enhanced FAQ display
  function createFAQDisplay() {
    const faqContainer = document.querySelector('.faq-list');
    if (!faqContainer) return;

    // Clear existing content
    faqContainer.innerHTML = '';

    // Use forEach (Higher-Order Function) to create FAQ items
    faqManager.questions.forEach((faqItem, index) => {
      const faqElement = document.createElement('div');
      faqElement.className = 'faq-item';
      faqElement.setAttribute('data-faq-id', faqItem.id);
      
      faqElement.innerHTML = `
        <div class="d-flex justify-content-between align-items-center faq-question p-4">
          <h3 class="fs-5 fw-semibold m-0 text-danger">${faqItem.question}</h3>
          <i class="bi bi-chevron-down chevron"></i>
        </div>
        <div class="faq-answer">
          <p class="mb-0 px-4 pb-4">${faqItem.answer}</p>
        </div>
      `;
      
      faqContainer.appendChild(faqElement);
      
      // Add staggered animation
      faqElement.style.opacity = '0';
      faqElement.style.transform = 'translateX(-20px)';
      faqElement.style.transition = 'all 0.5s ease';
      
      setTimeout(() => {
        faqElement.style.opacity = '1';
        faqElement.style.transform = 'translateX(0)';
      }, index * 100);
    });
  }

  // 3. HIGHER-ORDER FUNCTIONS - Advanced FAQ functionality
  const faqProcessor = {
    // Using map to transform FAQ data
    transformFAQData(questions) {
      return questions.map(q => ({
        ...q,
        displayQuestion: q.question.replace('❓', ''),
        wordCount: q.answer.split(' ').length,
        categoryDisplay: q.category.charAt(0).toUpperCase() + q.category.slice(1)
      }));
    },

    // Using filter to get questions by popularity
    getPopularQuestions(minPopularity = 1) {
      return faqManager.questions.filter(q => q.popularity >= minPopularity);
    },

    // Using reduce to calculate statistics
    getFAQStats() {
      return faqManager.questions.reduce((stats, q) => {
        stats.totalQuestions++;
        stats.totalPopularity += q.popularity;
        stats.averagePopularity = stats.totalPopularity / stats.totalQuestions;
        
        if (!stats.categories[q.category]) {
          stats.categories[q.category] = 0;
        }
        stats.categories[q.category]++;
        
        return stats;
      }, {
        totalQuestions: 0,
        totalPopularity: 0,
        averagePopularity: 0,
        categories: {}
      });
    },

    // Using some to check if any questions match criteria
    hasQuestionsInCategory(category) {
      return faqManager.questions.some(q => q.category === category);
    },

    // Using every to check if all questions have answers
    allQuestionsHaveAnswers() {
      return faqManager.questions.every(q => q.answer && q.answer.length > 0);
    }
  };

  // 4. SOUND EFFECTS - Enhanced audio system
  let audioCtx;
  const soundManager = {
    sounds: {
      click: { frequency: 800, duration: 0.1 },
      open: { frequency: 700, duration: 0.15 },
      close: { frequency: 400, duration: 0.15 },
      hover: { frequency: 500, duration: 0.05 },
      search: { frequency: 600, duration: 0.1 }
    },
    
    init() {
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (err) {
        console.warn('Audio not supported');
      }
    },
    
    playSound(soundType) {
      if (!audioCtx) return;
      
      const sound = this.sounds[soundType] || this.sounds.click;
      
      try {
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.type = 'sine';
        o.frequency.value = sound.frequency;
        g.gain.value = 0.05;
        o.connect(g);
        g.connect(audioCtx.destination);
        o.start();
        g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + sound.duration);
        o.stop(audioCtx.currentTime + sound.duration + 0.01);
      } catch (err) {
        console.warn('Sound playback failed');
      }
    }
  };

  // 5. ANIMATIONS - Enhanced animation system
  const animationManager = {
    // Bounce animation
    bounce(element, scale = 1.05, duration = 200) {
      if (!element) return;
      
      element.style.transition = `transform ${duration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`;
      element.style.transform = `scale(${scale})`;
      
      setTimeout(() => {
        element.style.transform = 'scale(1)';
      }, duration / 2);
    },
    
    // Slide in animation
    slideIn(element, direction = 'left', duration = 400) {
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
    },
    
    // Pulse animation
    pulse(element, duration = 800) {
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
  };

  // Enhanced FAQ interactions
  function setupFAQInteractions() {
    document.addEventListener('click', (e) => {
      const question = e.target.closest('.faq-question');
      if (question) {
        const faqItem = question.closest('.faq-item');
        const answer = faqItem.querySelector('.faq-answer');
        const chevron = faqItem.querySelector('.chevron');
        const faqId = parseInt(faqItem.getAttribute('data-faq-id'));
        
        const isOpen = chevron.classList.contains('rotated');
        
        // Play sound based on action
        soundManager.playSound(isOpen ? 'close' : 'open');
        
        // Bounce animation for the clicked question
        animationManager.bounce(question, 1.02, 150);
        
        // Close all other items
        document.querySelectorAll('.faq-item').forEach(item => {
          if (item !== faqItem) {
            const otherAnswer = item.querySelector('.faq-answer');
            const otherChevron = item.querySelector('.chevron');
            const otherQuestion = item.querySelector('.faq-question');
            
            otherAnswer.style.maxHeight = '0';
            otherAnswer.style.opacity = '0';
            otherAnswer.style.transform = 'translateY(-10px)';
            otherChevron.classList.remove('rotated');
            otherQuestion.style.backgroundColor = '';
            otherQuestion.style.transform = 'translateX(0)';
          }
        });
        
        // Toggle current item
        if (!isOpen) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
          answer.style.opacity = '1';
          answer.style.transform = 'translateY(0)';
          chevron.classList.add('rotated');
          
          // Add pulse animation to the answer
          setTimeout(() => {
            animationManager.pulse(answer, 800);
          }, 200);
          
          // Increment popularity
          faqManager.incrementPopularity(faqId);
          
          // Visual feedback
          question.style.backgroundColor = '#e3f2fd';
          setTimeout(() => {
            question.style.backgroundColor = '';
          }, 300);
        } else {
          answer.style.maxHeight = '0';
          answer.style.opacity = '0';
          answer.style.transform = 'translateY(-10px)';
          chevron.classList.remove('rotated');
          question.style.backgroundColor = '';
        }
      }
    });

    // Hover effects
    document.addEventListener('mouseenter', (e) => {
      const question = e.target.closest('.faq-question');
      if (question) {
        question.style.backgroundColor = '#f8f9fa';
        question.style.transform = 'translateX(5px)';
        question.style.transition = 'background-color 0.2s ease, transform 0.2s ease';
        soundManager.playSound('hover');
      }
    }, true);

    document.addEventListener('mouseleave', (e) => {
      const question = e.target.closest('.faq-question');
      if (question && !question.closest('.faq-item').querySelector('.chevron').classList.contains('rotated')) {
        question.style.backgroundColor = '';
        question.style.transform = 'translateX(0)';
      }
    }, true);
  }

  // Enhanced search functionality using higher-order functions
  function createSearchFunctionality() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container mb-4';
    searchContainer.innerHTML = `
      <div class="bg-light rounded p-3">
        <h5 class="mb-3 text-danger">Search FAQ</h5>
        <input type="text" id="faqSearch" placeholder="Search frequently asked questions..." 
               class="form-control mb-3">
        <div id="searchResults" class="text-muted small"></div>
        <div id="categoryFilters" class="mt-3">
          <h6 class="mb-2">Filter by Category:</h6>
          <div class="btn-group" role="group">
            <button type="button" class="btn btn-outline-primary btn-sm category-filter" data-category="all">All</button>
            <button type="button" class="btn btn-outline-primary btn-sm category-filter" data-category="ordering">Ordering</button>
            <button type="button" class="btn btn-outline-primary btn-sm category-filter" data-category="payment">Payment</button>
            <button type="button" class="btn btn-outline-primary btn-sm category-filter" data-category="delivery">Delivery</button>
            <button type="button" class="btn btn-outline-primary btn-sm category-filter" data-category="returns">Returns</button>
            <button type="button" class="btn btn-outline-primary btn-sm category-filter" data-category="warranty">Warranty</button>
          </div>
        </div>
      </div>
    `;

    const mainContainer = document.querySelector('main');
    mainContainer.insertBefore(searchContainer, mainContainer.querySelector('.faq-list'));

    // Search functionality
    const searchInput = document.getElementById('faqSearch');
    const searchResults = document.getElementById('searchResults');
    
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      
      if (searchTerm) {
        // Use higher-order function filter
        const filteredQuestions = faqManager.searchQuestions(searchTerm);
        
        // Use higher-order function map to transform results
        const resultText = filteredQuestions.map(q => q.question).join(', ');
        
        searchResults.textContent = `${filteredQuestions.length} question(s) found: ${resultText}`;
        
        // Filter display
        document.querySelectorAll('.faq-item').forEach(item => {
          const questionText = item.querySelector('.faq-question h3').textContent.toLowerCase();
          const answerText = item.querySelector('.faq-answer p').textContent.toLowerCase();
          
          if (questionText.includes(searchTerm) || answerText.includes(searchTerm)) {
            item.style.display = 'block';
            item.style.transform = 'scale(1)';
            item.style.opacity = '1';
          } else {
            item.style.transform = 'scale(0.95)';
            item.style.opacity = '0.3';
          }
        });
        
        soundManager.playSound('search');
      } else {
        searchResults.textContent = '';
        document.querySelectorAll('.faq-item').forEach(item => {
          item.style.display = 'block';
          item.style.transform = 'scale(1)';
          item.style.opacity = '1';
        });
      }
    });

    // Category filter functionality
    document.querySelectorAll('.category-filter').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const category = e.target.getAttribute('data-category');
        
        // Remove active class from all buttons
        document.querySelectorAll('.category-filter').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        // Filter questions by category using higher-order function
        const filteredQuestions = category === 'all' 
          ? faqManager.questions 
          : faqManager.getQuestionsByCategory(category);
        
        // Update display
        document.querySelectorAll('.faq-item').forEach(item => {
          const faqId = parseInt(item.getAttribute('data-faq-id'));
          const question = faqManager.questions.find(q => q.id === faqId);
          
          if (filteredQuestions.includes(question)) {
            item.style.display = 'block';
            item.style.transform = 'scale(1)';
            item.style.opacity = '1';
          } else {
            item.style.display = 'none';
          }
        });
        
        soundManager.playSound('click');
        animationManager.bounce(e.target, 1.1, 200);
      });
    });
  }

  // Create FAQ statistics display
  function createFAQStats() {
    const stats = faqProcessor.getFAQStats();
    
    const statsContainer = document.createElement('div');
    statsContainer.className = 'faq-stats mt-4';
    statsContainer.innerHTML = `
      <div class="bg-info bg-opacity-10 rounded p-3">
        <h6 class="text-info mb-3">FAQ Statistics</h6>
        <div class="row g-2">
          <div class="col-md-3 col-sm-6">
            <div class="text-center">
              <div class="h5 text-info">${stats.totalQuestions}</div>
              <small class="text-muted">Total Questions</small>
            </div>
          </div>
          <div class="col-md-3 col-sm-6">
            <div class="text-center">
              <div class="h5 text-info">${Object.keys(stats.categories).length}</div>
              <small class="text-muted">Categories</small>
            </div>
          </div>
          <div class="col-md-3 col-sm-6">
            <div class="text-center">
              <div class="h5 text-info">${stats.totalPopularity}</div>
              <small class="text-muted">Total Views</small>
            </div>
          </div>
          <div class="col-md-3 col-sm-6">
            <div class="text-center">
              <div class="h5 text-info">${stats.averagePopularity.toFixed(1)}</div>
              <small class="text-muted">Avg Views</small>
            </div>
          </div>
        </div>
      </div>
    `;
    
    const mainContainer = document.querySelector('main');
    mainContainer.appendChild(statsContainer);
    
    // Animate stats
    animationManager.slideIn(statsContainer, 'up', 600);
  }

  // Initialize everything
  soundManager.init();
  createFAQDisplay();
  setupFAQInteractions();
  createSearchFunctionality();
  createFAQStats();
  
  // Add page load animation
  const mainContent = document.querySelector('main');
  mainContent.style.opacity = '0';
  mainContent.style.transform = 'translateY(20px)';
  mainContent.style.transition = 'all 0.8s ease';
  
  setTimeout(() => {
    mainContent.style.opacity = '1';
    mainContent.style.transform = 'translateY(0)';
  }, 100);
});
