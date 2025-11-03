// ========================================
// UNIFIED CART SYSTEM - Combines sync + enhanced features
// ========================================

class CartSync {
  constructor() {
    this.storageKey = 'egoisty-shopping-cart';
    this.cart = [];
    this.init();
  }

  init() {
    this.loadCart();
    this.updateCartCount();
    this.attachCatalogListeners();
    console.log('✅ CartSync initialized. Current cart:', this.cart);
  }

  loadCart() {
    try {
      const cartData = localStorage.getItem(this.storageKey);
      if (cartData) {
        this.cart = JSON.parse(cartData);
        console.log('📦 Loaded cart:', this.cart);
      }
    } catch (error) {
      console.error('❌ Error loading cart:', error);
      this.cart = [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.cart));
      this.updateCartCount();
      console.log('💾 Cart saved:', this.cart);
    } catch (error) {
      console.error('❌ Error saving cart:', error);
    }
  }

  addToCart(product) {
    console.log('➕ Adding product:', product);
    
    const existingItem = this.cart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        emoji: product.emoji,
        color: product.color || 'Default',
        quantity: 1
      });
    }

    this.saveCart();
    this.showNotification(`${product.name} добавлен в корзину!`, 'success');
  }

  updateQuantity(productId, newQuantity) {
    const item = this.cart.find(item => item.id === productId);
    
    if (item) {
      if (newQuantity <= 0) {
        this.removeFromCart(productId);
      } else if (newQuantity <= 10) {
        item.quantity = newQuantity;
        this.saveCart();
      }
    }
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCart();
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
  }

  getCart() {
    return this.cart;
  }

  getTotalItems() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  getSubtotal() {
    return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getShipping() {
    return this.getSubtotal() > 20000 ? 0 : 1500;
  }

  getDiscount() {
    const subtotal = this.getSubtotal();
    return subtotal > 20000 ? Math.floor(subtotal * 0.1) : 0;
  }

  getTax() {
    return Math.floor((this.getSubtotal() - this.getDiscount()) * 0.12);
  }

  getTotal() {
    return this.getSubtotal() + this.getShipping() - this.getDiscount() + this.getTax();
  }

  updateCartCount() {
    const cartCountElements = document.querySelectorAll('#cartCount');
    const totalItems = this.getTotalItems();
    
    cartCountElements.forEach(element => {
      element.textContent = totalItems;
    });
  }

  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `cart-notification notification-${type}`;
    notification.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
      <span>${message}</span>
    `;
    
    if (!document.getElementById('cart-notification-styles')) {
      const style = document.createElement('style');
      style.id = 'cart-notification-styles';
      style.textContent = `
        .cart-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #28a745;
          color: white;
          padding: 15px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 9999;
          animation: slideIn 0.3s ease;
        }
        
        .notification-warning {
          background: #ffc107;
          color: #000;
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .cart-notification i {
          font-size: 20px;
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideIn 0.3s ease reverse';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Catalog page listeners
  attachCatalogListeners() {
    const addToCartButtons = document.querySelectorAll('.add-cart-button');
    console.log('🔗 Found', addToCartButtons.length, 'add-to-cart buttons');
    
    addToCartButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        
        const productCard = button.closest('.product-item');
        if (!productCard) return;
        
        const productName = productCard.querySelector('h3').textContent.trim();
        const productPriceText = productCard.querySelector('.text-secondary').textContent;
        const productPrice = parseInt(productPriceText.replace(/[^\d]/g, ''));
        const productEmoji = productCard.querySelector('.display-3').textContent.trim();
        
        const product = {
          id: productName.toLowerCase().replace(/\s+/g, '-'),
          name: productName,
          price: productPrice,
          emoji: productEmoji,
          color: 'Default'
        };
        
        this.addToCart(product);
      });
    });
  }

  // Cart page rendering
  renderCart() {
    const cartItemsContainer = document.querySelector('.col-lg-8 .bg-white');
    
    if (!cartItemsContainer) {
      console.log('⚠️ Cart container not found');
      return;
    }

    console.log('🎨 Rendering cart with', this.cart.length, 'items');

    // Clear existing header
    const existingHeader = cartItemsContainer.querySelector('.cart-header, h2');
    if (existingHeader) {
      if (existingHeader.classList.contains('cart-header')) {
        existingHeader.remove();
      } else if (existingHeader.parentElement) {
        existingHeader.parentElement.remove();
      }
    }

    // Add header
    const header = document.createElement('div');
    header.className = 'cart-header';
    header.style.cssText = 'padding: 30px 40px; border-bottom: 1px solid #eee;';
    header.innerHTML = '<h2 class="h4 mb-0">Shopping Cart</h2>';
    cartItemsContainer.insertBefore(header, cartItemsContainer.firstChild);

    // Remove old items
    const oldItems = cartItemsContainer.querySelectorAll('.cart-item');
    oldItems.forEach(item => item.remove());

    if (this.cart.length === 0) {
      const emptyCart = document.createElement('div');
      emptyCart.className = 'empty-cart';
      emptyCart.style.cssText = 'padding: 60px 40px; text-align: center;';
      emptyCart.innerHTML = `
        <div style="font-size: 80px; margin-bottom: 20px;">🛒</div>
        <h2 style="font-size: 24px; color: #666; margin-bottom: 10px;">Ваша корзина пуста</h2>
        <p style="color: #999; margin-bottom: 30px;">Добавьте товары из каталога</p>
        <a href="../catalog/catalog.html" class="btn btn-primary">Перейти в каталог</a>
      `;
      cartItemsContainer.appendChild(emptyCart);
      this.updateSummary();
      this.updateProgressBar();
      return;
    }

    this.cart.forEach((item, index) => {
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item d-flex flex-wrap align-items-center justify-content-between border-bottom py-3';
      cartItem.setAttribute('data-item-id', item.id);
      cartItem.style.cssText = 'padding: 30px 40px;';

      cartItem.innerHTML = `
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
        <button class="btn btn-link text-danger fs-5 remove-item p-0" data-item-id="${item.id}" style="width: 30px;">
          <i class="fas fa-trash"></i>
        </button>
      `;

      cartItemsContainer.appendChild(cartItem);

      // Animation
      cartItem.style.opacity = '0';
      cartItem.style.transform = 'translateX(-20px)';
      cartItem.style.transition = 'all 0.3s ease';

      setTimeout(() => {
        cartItem.style.opacity = '1';
        cartItem.style.transform = 'translateX(0)';
      }, index * 50);
    });

    this.attachCartListeners();
    this.updateSummary();
    this.updateProgressBar();
  }

  attachCartListeners() {
    document.querySelectorAll('.quantity-increase').forEach(btn => {
      btn.addEventListener('click', () => {
        const itemId = btn.getAttribute('data-item-id');
        const item = this.cart.find(i => i.id === itemId);
        if (item && item.quantity < 10) {
          this.updateQuantity(itemId, item.quantity + 1);
          this.renderCart();
        }
      });
    });

    document.querySelectorAll('.quantity-decrease').forEach(btn => {
      btn.addEventListener('click', () => {
        const itemId = btn.getAttribute('data-item-id');
        const item = this.cart.find(i => i.id === itemId);
        if (item && item.quantity > 1) {
          this.updateQuantity(itemId, item.quantity - 1);
          this.renderCart();
        }
      });
    });

    document.querySelectorAll('.quantity-input').forEach(input => {
      input.addEventListener('change', () => {
        const itemId = input.getAttribute('data-item-id');
        const newQuantity = parseInt(input.value) || 1;
        this.updateQuantity(itemId, newQuantity);
        this.renderCart();
      });
    });

    document.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const itemId = btn.getAttribute('data-item-id');
        this.removeFromCart(itemId);
        this.renderCart();
        this.showNotification('Товар удалён из корзины', 'warning');
      });
    });
  }

  updateSummary() {
    const summaryContainer = document.querySelector('.col-lg-4 .bg-white');
    if (!summaryContainer) return;

    const totalItems = this.getTotalItems();
    const subtotal = this.getSubtotal();
    const shipping = this.getShipping();
    const discount = this.getDiscount();
    const tax = this.getTax();
    const total = this.getTotal();

    summaryContainer.innerHTML = `
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
        <span class="text-success fw-semibold">${discount > 0 ? '-' + discount.toLocaleString() + ' ₸' : '0 ₸'}</span>
      </div>
      <div class="d-flex justify-content-between border-bottom py-2">
        <span>Tax</span>
        <span class="fw-semibold">${tax.toLocaleString()} ₸</span>
      </div>
      <div class="d-flex justify-content-between pt-3">
        <span class="fw-semibold fs-5">Total</span>
        <span class="fw-bold fs-5 text-danger">${total.toLocaleString()} ₸</span>
      </div>
      <div class="btn-group w-100 mt-4" role="group">
        <a href="../checkout.html" class="btn btn-primary py-3 px-4">Checkout</a>
        <button type="button" class="btn btn-danger py-3 px-4" id="clear-cart-btn">Clear Cart</button>
      </div>
    `;

    document.getElementById('clear-cart-btn')?.addEventListener('click', () => {
      if (this.cart.length === 0) {
        this.showNotification('Корзина уже пуста!', 'warning');
        return;
      }
      if (confirm('Вы уверены, что хотите очистить корзину?')) {
        this.clearCart();
        this.renderCart();
        this.showNotification('Корзина очищена!', 'success');
      }
    });
  }

  updateProgressBar() {
    let progressBar = document.getElementById('cartProgress');
    
    if (!progressBar) {
      const mainContainer = document.querySelector('.container.my-4');
      if (!mainContainer) return;

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
      progressBar = document.getElementById('cartProgress');
    }

    const subtotal = this.getSubtotal();
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
}

// Initialize
let cartSync;

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Initializing CartSync...');
  cartSync = new CartSync();
  
  if (window.location.pathname.includes('cart.html')) {
    console.log('📄 On cart page, rendering cart...');
    cartSync.renderCart();
  }
});

window.CartSync = CartSync;
window.cartSync = cartSync;