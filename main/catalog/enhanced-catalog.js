document.addEventListener('DOMContentLoaded', () => {
  const catalogManager = {
    products: [
      { id: 1, name: 'Premium Wireless Headphones', price: 13980, category: 'audio', emoji: '🎧', rating: 4.8, inStock: true },
      { id: 2, name: 'Premium Smartphone Case', price: 2490, category: 'accessories', emoji: '📱', rating: 4.5, inStock: true },
      { id: 3, name: 'Premium Smartwatch Series X', price: 4950, category: 'wearables', emoji: '⌚', rating: 4.7, inStock: true },
      { id: 4, name: 'Gaming Mouse Pro', price: 8500, category: 'gaming', emoji: '🖱️', rating: 4.9, inStock: true },
      { id: 5, name: 'Wireless Keyboard', price: 6200, category: 'accessories', emoji: '⌨️', rating: 4.6, inStock: true },
      { id: 6, name: 'Bluetooth Speaker', price: 3200, category: 'audio', emoji: '🔊', rating: 4.4, inStock: true }
    ],
    cart: JSON.parse(localStorage.getItem('cart') || '[]'),
    filters: {
      category: 'all',
      priceRange: { min: 0, max: 50000 },
      searchTerm: ''
    },
    
    getFilteredProducts() {
      return this.products.filter(product => {
        const matchesCategory = this.filters.category === 'all' || product.category === this.filters.category;
        const matchesPrice = product.price >= this.filters.priceRange.min && product.price <= this.filters.priceRange.max;
        const matchesSearch = product.name.toLowerCase().includes(this.filters.searchTerm.toLowerCase());
        return matchesCategory && matchesPrice && matchesSearch;
      });
    },
    
    addToCart(productId) {
      const product = this.products.find(p => p.id === productId);
      if (product && product.inStock) {
        this.cart.push(product);
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartCount();
        return true;
      }
      return false;
    },
    
    updateCartCount() {
      const cartCountEl = document.getElementById('cartCount');
      if (cartCountEl) {
        cartCountEl.textContent = this.cart.length;
      }
    }
  };

  let audioCtx;
  const soundManager = {
    init() {
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (err) {
        console.log('Audio context not available');
      }
    },
    
    playSound(freq = 600, duration = 0.15) {
      if (!audioCtx) return;
      try {
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
        console.log('Sound playback error');
      }
    }
  };

  function showNotification(message, type = 'info') {
    const colors = { success: '#28a745', error: '#dc3545', warning: '#ffc107', info: '#17a2b8' };
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      background-color: ${colors[type]};
      color: white;
      border-radius: 5px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      z-index: 9999;
      animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideIn 0.3s ease reverse';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  let currentSort = 'name';
  function createProductCards() {
    const container = document.getElementById('product-list');
    if (!container) return;
    
    let products = catalogManager.getFilteredProducts();
    
    // Sort products
    products = products.sort((a, b) => {
      if (currentSort === 'price') return a.price - b.price;
      if (currentSort === 'rating') return b.rating - a.rating;
      return a.name.localeCompare(b.name);
    });
    
    if (products.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center py-5">
          <div class="text-muted">
            <i class="fas fa-search fa-3x mb-3"></i>
            <h4>No products found</h4>
            <p>Try adjusting your filters</p>
          </div>
        </div>
      `;
      return;
    }
    
    const html = products.map(product => {
      const discount = product.price > 10000 ? `<span class="badge bg-danger position-absolute top-0 end-0 m-2">-10%</span>` : '';
      const discountPrice = product.price > 10000 ? `<br><small class="text-success">${Math.floor(product.price * 0.9).toLocaleString()} ₸</small>` : '';
      
      return `
        <div class="col-sm-6 col-md-4 col-lg-3 product-item product-card" data-product-id="${product.id}" data-product-name="${product.name.toLowerCase()}">
          <div class="card text-center p-3 shadow-sm h-100 position-relative" style="cursor: pointer; transition: all 0.3s ease;">
            ${discount}
            <div class="display-3 product-emoji" style="transition: transform 0.1s ease;">${product.emoji}</div>
            <h3 class="h6 mt-3 mb-1 product-name">${product.name}</h3>
            <p class="text-secondary mb-2">${product.price.toLocaleString()} ₸${discountPrice}</p>
            <div class="mb-2">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))} <small class="text-muted">(${product.rating})</small></div>
            <div class="btn-group w-100" role="group">
              <button type="button" class="btn btn-primary buy-btn" data-product-id="${product.id}" style="transition: transform 0.15s ease;">Buy</button>
              <button type="button" class="btn btn-outline-primary add-cart-button" data-product-id="${product.id}" style="transition: transform 0.15s ease;">Add to Cart</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
    
    container.innerHTML = html;
    
    // Animate cards
    document.querySelectorAll('.product-card').forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.transition = 'all 0.5s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, i * 50);
    });
  }

  function setupFilters() {
    const searchInput = document.getElementById('product-search');
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const priceDisplay = document.getElementById('priceDisplay');
    const resetBtn = document.getElementById('resetFilters');
    const sortBtn = document.getElementById('sortProducts');
    
    if (!searchInput || !categoryFilter || !priceFilter || !priceDisplay || !resetBtn || !sortBtn) {
      console.error('Filter elements not found');
      return;
    }
    
    // Search filter
    searchInput.addEventListener('input', function() {
      catalogManager.filters.searchTerm = this.value.trim();
      createProductCards();
      soundManager.playSound(500, 0.05);
    });
    
    // Category filter
    categoryFilter.addEventListener('change', function() {
      catalogManager.filters.category = this.value;
      createProductCards();
      soundManager.playSound(600, 0.1);
      showNotification(`Filter: ${this.value === 'all' ? 'All Categories' : this.value}`, 'info');
    });
    
    // Price filter
    priceFilter.addEventListener('input', function() {
      const maxPrice = parseInt(this.value);
      catalogManager.filters.priceRange.max = maxPrice;
      priceDisplay.textContent = `Max: ${maxPrice.toLocaleString()} ₸`;
      createProductCards();
    });
    
    // Reset filters
    resetBtn.addEventListener('click', function() {
      searchInput.value = '';
      categoryFilter.value = 'all';
      priceFilter.value = 50000;
      priceDisplay.textContent = 'Max: 50,000 ₸';
      catalogManager.filters = { category: 'all', priceRange: { min: 0, max: 50000 }, searchTerm: '' };
      currentSort = 'name';
      sortBtn.innerHTML = '<i class="fas fa-sort me-1"></i>Sort';
      createProductCards();
      soundManager.playSound(700, 0.15);
      showNotification('Filters reset!', 'success');
    });
    
    // Sort button
    sortBtn.addEventListener('click', function() {
      const sorts = ['name', 'price', 'rating'];
      const currentIndex = sorts.indexOf(currentSort);
      currentSort = sorts[(currentIndex + 1) % sorts.length];
      const labels = { name: 'Name', price: 'Price', rating: 'Rating' };
      this.innerHTML = `<i class="fas fa-sort me-1"></i>${labels[currentSort]}`;
      createProductCards();
      soundManager.playSound(650, 0.1);
      showNotification(`Sorted by ${labels[currentSort]}`, 'info');
    });
  }

  // Event delegation for buttons
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('buy-btn')) {
      e.preventDefault();
      soundManager.playSound(900, 0.25);
      e.target.style.transform = 'scale(1.2)';
      setTimeout(() => e.target.style.transform = 'scale(1)', 150);
      showNotification('Redirecting to checkout...', 'success');
    }
    
    if (e.target.classList.contains('add-cart-button')) {
      e.preventDefault();
      const id = parseInt(e.target.getAttribute('data-product-id'));
      if (catalogManager.addToCart(id)) {
        soundManager.playSound(700, 0.15);
        e.target.style.transform = 'scale(1.1)';
        setTimeout(() => e.target.style.transform = 'scale(1)', 125);
        showNotification('Product added to cart!', 'success');
        const badge = document.getElementById('cartCount');
        if (badge) {
          badge.style.animation = 'none';
          setTimeout(() => badge.style.animation = 'pulse 0.5s', 10);
        }
      }
    }
  });

  // Theme toggle
  const themeToggle = document.getElementById('global-theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      const icon = themeToggle.querySelector('i');
      if (icon) {
        icon.className = document.body.classList.contains('dark-theme') ? 'fas fa-sun' : 'fas fa-moon';
      }
      soundManager.playSound(500, 0.1);
    });
  }

  // Card hover effects
  document.addEventListener('mouseenter', (e) => {
    let card = e.target.closest('.card');
    if (card && !e.target.closest('.btn-group')) {
      card.style.transform = 'translateY(-5px)';
      card.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
      const emoji = card.querySelector('.product-emoji');
      if (emoji) {
        emoji.style.transform = 'scale(1.1)';
        setTimeout(() => emoji.style.transform = 'scale(1)', 100);
      }
    }
  }, true);

  document.addEventListener('mouseleave', (e) => {
    let card = e.target.closest('.card');
    if (card) {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = '';
    }
  }, true);

  // Initialize
  soundManager.init();
  catalogManager.updateCartCount();
  createProductCards();
  setupFilters();

});