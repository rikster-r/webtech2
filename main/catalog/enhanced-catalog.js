document.addEventListener('DOMContentLoaded', () => {
  // 1. OBJECTS AND METHODS - Enhanced Product Management
  const catalogManager = {
    products: [
      { id: 1, name: 'Premium Wireless Headphones', price: 13980, category: 'audio', emoji: '🎧', rating: 4.8, inStock: true },
      { id: 2, name: 'Premium Smartphone Case', price: 2490, category: 'accessories', emoji: '📱', rating: 4.5, inStock: true },
      { id: 3, name: 'Premium Smartwatch Series X', price: 4950, category: 'wearables', emoji: '⌚', rating: 4.7, inStock: true },
      { id: 4, name: 'Gaming Mouse Pro', price: 8500, category: 'gaming', emoji: '🖱️', rating: 4.9, inStock: true },
      { id: 5, name: 'Wireless Keyboard', price: 6200, category: 'accessories', emoji: '⌨️', rating: 4.6, inStock: true },
      { id: 6, name: 'Bluetooth Speaker', price: 3200, category: 'audio', emoji: '🔊', rating: 4.4, inStock: true }
    ],
    cart: [],
    filters: { category: 'all', priceRange: { min: 0, max: 50000 }, searchTerm: '' },
    
    // Object method to get filtered products
    getFilteredProducts() {
      return this.products.filter(product => {
        const matchesCategory = this.filters.category === 'all' || product.category === this.filters.category;
        const matchesPrice = product.price >= this.filters.priceRange.min && product.price <= this.filters.priceRange.max;
        const matchesSearch = product.name.toLowerCase().includes(this.filters.searchTerm.toLowerCase());
        return matchesCategory && matchesPrice && matchesSearch;
      });
    },
    
    // Object method to add to cart
    addToCart(productId) {
      const product = this.products.find(p => p.id === productId);
      if (product && product.inStock) {
        this.cart.push(product);
        this.updateCartCount();
        return true;
      }
      return false;
    },
    
    // Object method to get cart count
    getCartCount() {
      return this.cart.length;
    },
    
    // Object method to update cart count display
    updateCartCount() {
      const cartCountElements = document.querySelectorAll('#cartCount');
      cartCountElements.forEach(element => {
        element.textContent = this.getCartCount();
      });
    }
  };

  // 2. ARRAYS AND LOOPS - Enhanced navigation and interactions
  const navLinks = document.querySelectorAll('header nav .nav-link');
  if (navLinks && navLinks.length > 0) {
    // Use forEach (Higher-Order Function) for navigation
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
  }

  // 3. HIGHER-ORDER FUNCTIONS - Enhanced product display using map
  function createProductCards() {
    const productContainer = document.querySelector('.col-md-9 .row');
    if (!productContainer) return;

    // Use map (Higher-Order Function) to transform product data
    const productCards = catalogManager.getFilteredProducts().map((product, index) => {
      const discountBadge = product.price > 10000 ? 
        `<span class="badge bg-danger position-absolute top-0 end-0 m-2">-10%</span>` : '';
      
      return `
        <div class="col-sm-6 col-md-4 col-lg-3 product-card" data-product-id="${product.id}">
          <a href="../headphones.html" class="text-decoration-none text-dark">
            <div class="card text-center p-3 shadow-sm h-100 position-relative">
              ${discountBadge}
              <div class="display-3 product-emoji">${product.emoji}</div>
              <h3 class="h6 mt-3 mb-1">${product.name}</h3>
              <p class="text-secondary mb-2">
                ${product.price.toLocaleString()} ₸
                ${product.price > 10000 ? `<br><small class="text-success">${Math.floor(product.price * 0.9).toLocaleString()} ₸</small>` : ''}
              </p>
              <div class="mb-2">
                ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                <small class="text-muted">(${product.rating})</small>
              </div>
              <div class="btn-group" role="group" aria-label="Product catalog">
                <button type="button" class="btn buy-btn" data-product-id="${product.id}">Buy</button>
                <button type="button" class="btn add-cart-button" data-product-id="${product.id}">Add to Cart</button>
              </div>
            </div>
          </a>
        </div>
      `;
    });

    productContainer.innerHTML = productCards.join('');
    
    // Add staggered animation to product cards
    const cards = productContainer.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'all 0.5s ease';
      
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }

  // 4. SOUND EFFECTS - Enhanced audio system
  let audioCtx;
  const soundManager = {
    sounds: {
      click: { frequency: 800, duration: 0.1 },
      success: { frequency: 600, duration: 0.2 },
      add: { frequency: 700, duration: 0.15 },
      buy: { frequency: 900, duration: 0.25 },
      hover: { frequency: 500, duration: 0.05 }
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
    bounce(element, scale = 1.1, duration = 300) {
      if (!element) return;
      
      element.style.transition = `transform ${duration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`;
      element.style.transform = `scale(${scale})`;
      
      setTimeout(() => {
        element.style.transform = 'scale(1)';
      }, duration / 2);
    },
    
    // Slide in animation
    slideIn(element, direction = 'left', duration = 500) {
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
    pulse(element, duration = 1000) {
      if (!element) return;
      
      const keyframes = [
        { transform: 'scale(1)', opacity: 1 },
        { transform: 'scale(1.05)', opacity: 0.8 },
        { transform: 'scale(1)', opacity: 1 }
      ];
      
      element.animate(keyframes, {
        duration: duration,
        iterations: 3,
        easing: 'ease-in-out'
      });
    },
    
    // Shake animation
    shake(element, intensity = 10, duration = 500) {
      if (!element) return;
      
      const keyframes = [
        { transform: 'translateX(0)' },
        { transform: `translateX(-${intensity}px)` },
        { transform: `translateX(${intensity}px)` },
        { transform: `translateX(-${intensity/2}px)` },
        { transform: `translateX(${intensity/2}px)` },
        { transform: 'translateX(0)' }
      ];
      
      element.animate(keyframes, {
        duration: duration,
        iterations: 1,
        easing: 'ease-in-out'
      });
    }
  };

  // Enhanced button interactions with sound and animation
  function setupEnhancedButtons() {
    // Buy buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('buy-btn')) {
        e.preventDefault();
        const productId = parseInt(e.target.getAttribute('data-product-id'));
        
        soundManager.playSound('buy');
        animationManager.bounce(e.target, 1.2, 300);
        
        // Show notification
        showNotification('Redirecting to checkout...', 'success');
        
        setTimeout(() => {
          window.location.href = '../cart/cart.html';
        }, 500);
      }
      
      if (e.target.classList.contains('add-cart-button')) {
        e.preventDefault();
        const productId = parseInt(e.target.getAttribute('data-product-id'));
        
        if (catalogManager.addToCart(productId)) {
          soundManager.playSound('add');
          animationManager.bounce(e.target, 1.1, 250);
          showNotification('Product added to cart!', 'success');
        } else {
          soundManager.playSound('error');
          animationManager.shake(e.target);
          showNotification('Product not available!', 'error');
        }
      }
    });

    // Hover effects on buttons
    document.addEventListener('mouseenter', (e) => {
      if (e.target.classList.contains('btn')) {
        soundManager.playSound('hover');
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        e.target.style.transition = 'all 0.3s ease';
      }
    }, true);

    document.addEventListener('mouseleave', (e) => {
      if (e.target.classList.contains('btn')) {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '';
      }
    }, true);
  }

  // Enhanced product card interactions
  function setupProductCardInteractions() {
    document.addEventListener('mouseenter', (e) => {
      const card = e.target.closest('.card');
      if (card && !e.target.closest('.btn-group')) {
        card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        
        // Animate emoji
        const emoji = card.querySelector('.product-emoji');
        if (emoji) {
          animationManager.bounce(emoji, 1.1, 200);
        }
      }
    }, true);

    document.addEventListener('mouseleave', (e) => {
      const card = e.target.closest('.card');
      if (card) {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '';
      }
    }, true);
  }

  // Notification system
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 1000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 300px;
      word-wrap: break-word;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;

    const colors = {
      success: '#28a745',
      error: '#dc3545',
      warning: '#ffc107',
      info: '#17a2b8'
    };
    notification.style.backgroundColor = colors[type] || colors.info;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  // Initialize everything
  soundManager.init();
  createProductCards();
  setupEnhancedButtons();
  setupProductCardInteractions();
  
  // Add page load animation
  const mainContent = document.querySelector('.container-fluid');
  mainContent.style.opacity = '0';
  mainContent.style.transform = 'translateY(20px)';
  mainContent.style.transition = 'all 0.8s ease';
  
  setTimeout(() => {
    mainContent.style.opacity = '1';
    mainContent.style.transform = 'translateY(0)';
  }, 100);

  // Advanced Features Integration
  setupAdvancedFeatures();
});
