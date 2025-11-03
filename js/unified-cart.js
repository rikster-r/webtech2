// ========================================
// UNIFIED CART SYSTEM - Объединяет все функции
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'egoisty-shopping-cart';

  // ============ CATALOG MANAGER ============
  const catalogManager = {
    products: [
      { id: 1, name: 'Premium Wireless Headphones', price: 13980, category: 'audio', emoji: '🎧', rating: 4.8, inStock: true },
      { id: 2, name: 'Premium Smartphone Case', price: 2490, category: 'accessories', emoji: '📱', rating: 4.5, inStock: true },
      { id: 3, name: 'Premium Smartwatch Series X', price: 4950, category: 'wearables', emoji: '⌚', rating: 4.7, inStock: true },
      { id: 4, name: 'Gaming Mouse Pro', price: 8500, category: 'gaming', emoji: '🖱️', rating: 4.9, inStock: true },
      { id: 5, name: 'Wireless Keyboard', price: 6200, category: 'accessories', emoji: '⌨️', rating: 4.6, inStock: true },
      { id: 6, name: 'Bluetooth Speaker', price: 3200, category: 'audio', emoji: '🔊', rating: 4.4, inStock: true }
    ],

    getProductById(id) {
      return this.products.find(p => p.id === id);
    }
  };

  // ============ CART MANAGER ============
  const cartManager = {
    items: [],

    init() {
      this.loadCart();
      this.updateCartCount();
      console.log('✅ Cart initialized:', this.items.length, 'items');
    },

    loadCart() {
      try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
          this.items = JSON.parse(data);
          console.log('📦 Cart loaded:', this.items);
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        this.items = [];
      }
    },

    saveCart() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
        this.updateCartCount();
        console.log('💾 Cart saved:', this.items);
      } catch (error) {
        console.error('Error saving cart:', error);
      }
    },

    addToCart(productId) {
      const product = catalogManager.getProductById(productId);
      if (!product || !product.inStock) {
        showNotification('Product not available!', 'error');
        return false;
      }

      const existingItem = this.items.find(item => item.id === productId);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          emoji: product.emoji,
          color: 'Default',
          quantity: 1
        });
      }

      this.saveCart();
      showNotification(`${product.name} добавлен в корзину!`, 'success');
      return true;
    },

    updateQuantity(itemId, newQuantity) {
      const item = this.items.find(i => i.id === itemId);
      
      if (item) {
        if (newQuantity <= 0) {
          this.removeFromCart(itemId);
        } else if (newQuantity <= 10) {
          item.quantity = newQuantity;
          this.saveCart();
        }
      }
    },

    removeFromCart(itemId) {
      this.items = this.items.filter(i => i.id !== itemId);
      this.saveCart();
    },

    clearCart() {
      this.items = [];
      this.saveCart();
    },

    updateCartCount() {
      const total = this.getTotalItems();
      document.querySelectorAll('#cartCount').forEach(el => {
        el.textContent = total;
      });
    },

    getTotalItems() {
      return this.items.reduce((sum, item) => sum + item.quantity, 0);
    },

    getSubtotal() {
      return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },

    getShipping() {
      return this.getSubtotal() > 20000 ? 0 : 1500;
    },

    getDiscount() {
      const subtotal = this.getSubtotal();
      return subtotal > 20000 ? Math.floor(subtotal * 0.1) : 0;
    },

    getTax() {
      return Math.floor((this.getSubtotal() - this.getDiscount()) * 0.12);
    },

    getTotal() {
      return this.getSubtotal() + this.getShipping() - this.getDiscount() + this.getTax();
    }
  };

  // ============ SOUND MANAGER ============
  let audioCtx;
  const soundManager = {
    init() {
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (err) {
        console.warn('Audio not supported');
      }
    },

    playSound(type) {
      if (!audioCtx) return;

      const frequencies = {
        click: 800,
        success: 600,
        add: 700,
        buy: 900,
        hover: 500,
        remove: 400
      };

      try {
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.type = 'sine';
        o.frequency.value = frequencies[type] || 600;
        g.gain.value = 0.05;
        o.connect(g);
        g.connect(audioCtx.destination);
        o.start();
        g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.15);
        o.stop(audioCtx.currentTime + 0.16);
      } catch (err) {
        console.warn('Sound playback failed');
      }
    }
  };

  // ============ ANIMATION MANAGER ============
  const animationManager = {
    bounce(element, scale = 1.1, duration = 300) {
      if (!element) return;
      element.style.transition = `transform ${duration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`;
      element.style.transform = `scale(${scale})`;
      setTimeout(() => {
        element.style.transform = 'scale(1)';
      }, duration / 2);
    },

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
      element.animate(keyframes, { duration, iterations: 1, easing: 'ease-in-out' });
    }
  };

  // ============ NOTIFICATION SYSTEM ============
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 9999;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 300px;
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

    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // ============ CATALOG PAGE ============
  function initCatalogPage() {
    const productContainer = document.querySelector('#product-list');
    if (!productContainer) return;

    console.log('📄 Initializing catalog page...');

    // Создаём карточки товаров
    const productCards = catalogManager.products.map((product, index) => {
      const discountBadge = product.price > 10000 ? 
        `<span class="badge bg-danger position-absolute top-0 end-0 m-2">-10%</span>` : '';
      
      const productPageMap = {
        1: '../headphones.html',
        2: '../smartphone-case.html',
        3: '../smartwatches.html'
      };

      const productLink = productPageMap[product.id] || '#';

      return `
        <div class="col-sm-6 col-md-4 col-lg-3 product-item product-card" data-product-id="${product.id}">
          <a href="${productLink}" class="text-decoration-none text-dark">
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
              <div class="btn-group" role="group">
                <button type="button" class="btn buy-btn" data-product-id="${product.id}">Buy</button>
                <button type="button" class="btn add-cart-button" data-product-id="${product.id}">Add to Cart</button>
              </div>
            </div>
          </a>
        </div>
      `;
    });

    productContainer.innerHTML = productCards.join('');

    // Анимация появления карточек
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

    // Обработчики кнопок
    setupCatalogButtons();
  }

  function setupCatalogButtons() {
    document.addEventListener('click', (e) => {
      // Add to Cart button
      if (e.target.classList.contains('add-cart-button')) {
        e.preventDefault();
        const productId = parseInt(e.target.dataset.productId);
        
        if (cartManager.addToCart(productId)) {
          soundManager.playSound('add');
          animationManager.bounce(e.target, 1.1, 250);
        } else {
          soundManager.playSound('error');
          animationManager.shake(e.target);
        }
      }

      // Buy button
      if (e.target.classList.contains('buy-btn')) {
        e.preventDefault();
        const productId = parseInt(e.target.dataset.productId);
        
        if (cartManager.addToCart(productId)) {
          soundManager.playSound('buy');
          animationManager.bounce(e.target, 1.2, 300);
          showNotification('Redirecting to cart...', 'success');
          setTimeout(() => {
            window.location.href = '../cart/cart.html';
          }, 500);
        }
      }
    });

    // Hover effects
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

  // ============ CART PAGE ============
  function initCartPage() {
    console.log('📄 Initializing cart page...');
    renderCart();
    setupCartButtons();
    createProgressBar();
  }

  function renderCart() {
    const container = document.querySelector('.col-lg-8 .bg-white');
    if (!container) return;

    container.innerHTML = '';

    // Header
    const header = document.createElement('div');
    header.style.cssText = 'padding: 30px; border-bottom: 1px solid #eee;';
    header.innerHTML = '<h2 class="h4 mb-0">Shopping Cart</h2>';
    container.appendChild(header);

    // Empty cart
    if (cartManager.items.length === 0) {
      const empty = document.createElement('div');
      empty.style.cssText = 'padding: 60px; text-align: center;';
      empty.innerHTML = `
        <div style="font-size: 80px; margin-bottom: 20px;">🛒</div>
        <h3 style="color: #666; margin-bottom: 20px;">Корзина пуста</h3>
        <a href="../catalog/catalog.html" class="btn btn-primary">В каталог</a>
      `;
      container.appendChild(empty);
      updateSummary();
      return;
    }

    // Cart items
    cartManager.items.forEach((item, index) => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'cart-item d-flex flex-wrap align-items-center justify-content-between border-bottom py-3';
      itemDiv.style.cssText = 'padding: 20px 30px;';
      itemDiv.setAttribute('data-item-id', item.id);
      
      itemDiv.innerHTML = `
        <div class="d-flex align-items-center gap-3">
          <div class="bg-light rounded-3 d-flex align-items-center justify-content-center" 
               style="width:80px; height:80px; font-size:40px;">${item.emoji}</div>
          <div>
            <div class="fw-semibold">${item.name}</div>
            <small class="text-muted">Color: ${item.color}</small>
          </div>
        </div>
        <div class="text-danger fw-semibold fs-6">${item.price.toLocaleString()} ₸</div>
        <div class="input-group w-auto" style="max-width: 150px;">
          <button class="btn btn-outline-secondary quantity-decrease" data-item-id="${item.id}">−</button>
          <input type="number" class="form-control text-center quantity-input" 
                 value="${item.quantity}" min="1" max="10" style="width:60px;" data-item-id="${item.id}">
          <button class="btn btn-outline-secondary quantity-increase" data-item-id="${item.id}">+</button>
        </div>
        <button class="btn btn-link text-danger fs-5 remove-item p-0" data-item-id="${item.id}">
          <i class="fas fa-trash"></i>
        </button>
      `;

      container.appendChild(itemDiv);

      // Animation
      itemDiv.style.opacity = '0';
      itemDiv.style.transform = 'translateX(-20px)';
      itemDiv.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        itemDiv.style.opacity = '1';
        itemDiv.style.transform = 'translateX(0)';
      }, index * 50);
    });

    updateSummary();
    updateProgressBar();
  }

  function setupCartButtons() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('quantity-increase')) {
        const itemId = parseInt(e.target.dataset.itemId);
        const item = cartManager.items.find(i => i.id === itemId);
        if (item && item.quantity < 10) {
          cartManager.updateQuantity(itemId, item.quantity + 1);
          renderCart();
          soundManager.playSound('add');
        }
      }

      if (e.target.classList.contains('quantity-decrease')) {
        const itemId = parseInt(e.target.dataset.itemId);
        const item = cartManager.items.find(i => i.id === itemId);
        if (item && item.quantity > 1) {
          cartManager.updateQuantity(itemId, item.quantity - 1);
          renderCart();
          soundManager.playSound('remove');
        }
      }

      if (e.target.classList.contains('remove-item')) {
        const itemId = parseInt(e.target.dataset.itemId);
        cartManager.removeFromCart(itemId);
        renderCart();
        showNotification('Товар удалён', 'warning');
        soundManager.playSound('remove');
      }

      if (e.target.id === 'clear-btn') {
        if (confirm('Очистить корзину?')) {
          cartManager.clearCart();
          renderCart();
          showNotification('Корзина очищена', 'success');
        }
      }
    });

    // Input change
    document.addEventListener('change', (e) => {
      if (e.target.classList.contains('quantity-input')) {
        const itemId = parseInt(e.target.dataset.itemId);
        const newQuantity = parseInt(e.target.value) || 1;
        cartManager.updateQuantity(itemId, newQuantity);
        renderCart();
      }
    });
  }

  function updateSummary() {
    const summary = document.querySelector('.col-lg-4 .bg-white');
    if (!summary) return;

    const totalItems = cartManager.getTotalItems();
    const subtotal = cartManager.getSubtotal();
    const shipping = cartManager.getShipping();
    const discount = cartManager.getDiscount();
    const tax = cartManager.getTax();
    const total = cartManager.getTotal();

    summary.innerHTML = `
      <h3 class="h5 mb-3">Order Summary</h3>
      <div class="d-flex justify-content-between border-bottom py-2">
        <span>Subtotal (${totalItems} items)</span>
        <span class="fw-semibold">${subtotal.toLocaleString()} ₸</span>
      </div>
      <div class="d-flex justify-content-between border-bottom py-2">
        <span>Shipping</span>
        <span class="fw-semibold">${shipping === 0 ? 'Free' : shipping.toLocaleString() + ' ₸'}</span>
      </div>
      <div class="d-flex justify-content-between border-bottom py-2">
        <span>Discount</span>
        <span class="text-success fw-semibold">${discount > 0 ? '-' + discount.toLocaleString() : '0'} ₸</span>
      </div>
      <div class="d-flex justify-content-between border-bottom py-2">
        <span>Tax</span>
        <span class="fw-semibold">${tax.toLocaleString()} ₸</span>
      </div>
      <div class="d-flex justify-content-between pt-3">
        <span class="fw-semibold fs-5">Total</span>
        <span class="fw-bold fs-5 text-danger">${total.toLocaleString()} ₸</span>
      </div>
      <div class="btn-group w-100 mt-4">
        <a href="../checkout.html" class="btn btn-primary py-3">Checkout</a>
        <button class="btn btn-danger py-3" id="clear-btn">Clear</button>
      </div>
    `;
  }

  function createProgressBar() {
    const mainContainer = document.querySelector('.container.my-4');
    if (!mainContainer || document.getElementById('cartProgress')) return;

    const progressContainer = document.createElement('div');
    progressContainer.className = 'cart-progress mb-4';
    progressContainer.innerHTML = `
      <div class="progress" style="height: 8px;">
        <div class="progress-bar bg-danger" role="progressbar" style="width: 0%" id="cartProgress"></div>
      </div>
      <div class="text-center mt-2">
        <small class="text-muted">Free shipping at 20,000 ₸</small>
      </div>
    `;
    mainContainer.insertBefore(progressContainer, mainContainer.firstChild);
    updateProgressBar();
  }

  function updateProgressBar() {
    const progressBar = document.getElementById('cartProgress');
    if (!progressBar) return;

    const subtotal = cartManager.getSubtotal();
    const progress = Math.min((subtotal / 20000) * 100, 100);

    progressBar.style.width = progress + '%';

    if (subtotal >= 20000) {
      progressBar.classList.remove('bg-danger');
      progressBar.classList.add('bg-success');
    } else {
      progressBar.classList.remove('bg-success');
      progressBar.classList.add('bg-danger');
    }
  }

  // ============ INITIALIZATION ============
  soundManager.init();
  cartManager.init();

  if (window.location.href.includes('catalog.html')) {
    initCatalogPage();
  } else if (window.location.href.includes('cart.html')) {
    initCartPage();
  }

  console.log('🚀 Unified cart system initialized!');
});