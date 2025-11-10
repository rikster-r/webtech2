// Cart management functionality
class CartManager {
  constructor() {
    this.cartKey = 'cart';
    this.shippingCost = 1500;
    this.taxRate = 0.1; // 10% tax
    this.discountRate = 0.1; // 10% discount
    this.init();
  }

  init() {
    this.loadCart();
    this.updateCartCount();
    this.renderCartItems();
    this.setupEventListeners();
  }

  // Get cart items from localStorage
  getCart() {
    try {
      const cart = localStorage.getItem(this.cartKey);
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('Error reading cart:', error);
      return [];
    }
  }

  // Save cart to localStorage
  saveCart(cart) {
    try {
      localStorage.setItem(this.cartKey, JSON.stringify(cart));
      this.updateCartCount();
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }

  // Load and display cart
  loadCart() {
    this.cart = this.getCart();
  }

  // Update cart count badge
  updateCartCount() {
    const cart = this.getCart();
    const totalItems = cart.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0
    );
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
      cartCountElement.textContent = totalItems;
    }
  }

  // Calculate subtotal
  calculateSubtotal() {
    return this.cart.reduce((sum, item) => {
      const quantity = item.quantity || 1;
      return sum + item.price * quantity;
    }, 0);
  }

  // Calculate discount
  calculateDiscount(subtotal) {
    return subtotal * this.discountRate;
  }

  // Calculate tax
  calculateTax(subtotal, discount) {
    return (subtotal - discount) * this.taxRate;
  }

  // Calculate shipping cost
  calculateShipping() {
    return this.cart.length > 0 ? this.shippingCost : 0;
  }

  // Calculate total
  calculateTotal() {
    const subtotal = this.calculateSubtotal();
    const discount = this.calculateDiscount(subtotal);
    const tax = this.calculateTax(subtotal, discount);
    const shipping = this.calculateShipping();
    
    return subtotal - discount + shipping + tax;
  }

  // Format currency
  formatCurrency(amount) {
    return new Intl.NumberFormat('ru-KZ').format(Math.round(amount)) + ' ₸';
  }

  // Render cart items
  renderCartItems() {
    const cartContainer = document.querySelector('.col-lg-8 .bg-white');

    if (!cartContainer) return;

    // Clear existing content but preserve the main structure
    const title = cartContainer.querySelector('h2');
    cartContainer.innerHTML = '';

    // Recreate the title if it exists
    if (title) {
      cartContainer.appendChild(title);
    } else {
      cartContainer.innerHTML = '<h2 class="h4 mb-4">Shopping Cart</h2>';
    }

    if (this.cart.length === 0) {
      cartContainer.innerHTML += `
      <div class="text-center py-5">
        <i class="fas fa-shopping-cart fa-4x text-muted mb-3"></i>
        <h3 class="h5 text-muted">Your cart is empty</h3>
        <p class="text-muted">Add some items to get started!</p>
        <a href="../catalog/catalog.html" class="btn btn-primary mt-3">
          <i class="fas fa-shopping-bag me-2"></i>Continue Shopping
        </a>
      </div>
    `;
      this.updateOrderSummary();
      return;
    }

    // Create a container for cart items to maintain proper styling
    const cartItemsContainer = document.createElement('div');
    cartItemsContainer.className = 'cart-items-container';

    // Render each cart item
    this.cart.forEach((item, index) => {
      const quantity = item.quantity || 1;
      const itemTotal = item.price * quantity;
      
      // Use image if available, otherwise fall back to emoji
      const imageContent = item.image 
        ? `<div class="product-image-container" style="width: 80px; height: 80px; border-radius: 8px; overflow: hidden;">
             <img src="${item.image}" 
                  alt="${item.name}" 
                  class="h-100 w-100 object-fit-cover"
                  style="object-fit: cover;"
                  onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
             <div class="product-emoji-fallback h-100 w-100 d-none justify-content-center align-items-center" style="font-size: 2rem; background: #f8f9fa; display: flex !important;">${item.emoji || '📦'}</div>
           </div>`
        : `<div class="product-emoji" style="font-size: 3rem;">${item.emoji || '📦'}</div>`;

      const itemHTML = `
      <div class="cart-item border-bottom py-3" data-index="${index}">
        <div class="row align-items-center g-3 w-100">
          <div class="col-6 col-md-2 text-center">
            ${imageContent}
          </div>
          <div class="col-6 col-md-3">
            <h5 class="mb-1 h6">${item.name}</h5>
            <small class="text-muted text-capitalize">${item.category || 'Product'}</small><br>
            ${item.inStock
              ? '<span class="badge bg-success mt-1">In Stock</span>'
              : '<span class="badge bg-danger mt-1">Out of Stock</span>'
            }
            ${item.rating
              ? `<div class="text-warning mt-1 small"><i class="fas fa-star"></i> ${item.rating}</div>`
              : ''
            }
          </div>
          <div class="col-6 col-md-2 text-center">
            <small class="text-muted d-block d-md-none">Price</small>
            <div class="fw-semibold">${this.formatCurrency(item.price)}</div>
          </div>
          <div class="col-6 col-md-3">
            <small class="text-muted d-block d-md-none mb-1">Quantity</small>
            <div class="input-group input-group-sm">
              <button class="btn btn-outline-secondary decrease-qty" type="button" data-index="${index}">
                <i class="fas fa-minus"></i>
              </button>
              <input type="number" class="form-control text-center quantity-input" value="${quantity}" min="1" max="99" data-index="${index}" style="max-width: 60px;">
              <button class="btn btn-outline-secondary increase-qty" type="button" data-index="${index}">
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>
          <div class="col-12 col-md-2 text-center text-md-end">
            <small class="text-muted d-block d-md-none">Total</small>
            <div class="fw-bold mb-2">${this.formatCurrency(itemTotal)}</div>
            <button class="btn btn-sm btn-outline-danger remove-item" type="button" data-index="${index}">
              <i class="fas fa-trash"></i> Remove
            </button>
          </div>
        </div>
      </div>
    `;

      cartItemsContainer.innerHTML += itemHTML;
    });

    // Append the cart items container to the main container
    cartContainer.appendChild(cartItemsContainer);

    // Add continue shopping button
    const continueShoppingDiv = document.createElement('div');
    continueShoppingDiv.className = 'text-end mt-3';
    continueShoppingDiv.innerHTML = `
    <a href="../catalog/catalog.html" class="btn btn-outline-primary">
      <i class="fas fa-arrow-left me-2"></i>Continue Shopping
    </a>
  `;
    cartContainer.appendChild(continueShoppingDiv);

    this.updateOrderSummary();
    this.attachItemEventListeners();
    
    // Add CSS for image styling if not already present
    this.addCartStyles();
  }

  // Add CSS styles for cart images
  addCartStyles() {
    if (!document.getElementById('cart-styles')) {
      const style = document.createElement('style');
      style.id = 'cart-styles';
      style.textContent = `
        
      `;
      document.head.appendChild(style);
    }
  }

  // Update order summary
  updateOrderSummary() {
    const subtotal = this.calculateSubtotal();
    const discount = this.calculateDiscount(subtotal);
    const tax = this.calculateTax(subtotal, discount);
    const total = this.calculateTotal();
    const totalItems = this.cart.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0
    );

    // Calculate shipping based on cart items
    const shipping = this.calculateShipping();

    // Update summary values
    const summaryContainer = document.querySelector('.col-lg-4 .bg-white');
    if (!summaryContainer) return;

    summaryContainer.innerHTML = `
      <h3 class="h5 mb-3">Order Summary</h3>

      <div class="d-flex justify-content-between border-bottom py-2">
        <span class="">Subtotal (${totalItems} items)</span>
        <span class="fw-semibold">${this.formatCurrency(subtotal)}</span>
      </div>
      <div class="d-flex justify-content-between border-bottom py-2">
        <span class="">Shipping</span>
        <span class="fw-semibold">${this.formatCurrency(shipping)}</span>
      </div>
      <div class="d-flex justify-content-between border-bottom py-2">
        <span class="">Discount</span>
        <span class="text-success fw-semibold">-${this.formatCurrency(discount)}</span>
      </div>
      <div class="d-flex justify-content-between border-bottom py-2">
        <span class="">Tax</span>
        <span class="fw-semibold">${this.formatCurrency(tax)}</span>
      </div>
      <div class="d-flex justify-content-between pt-3">
        <span class="fw-semibold fs-5">Total</span>
        <span class="fw-bold fs-5 text-danger">${this.formatCurrency(total)}</span>
      </div>

      <div class="btn-group w-100 mt-4" role="group" aria-label="Cart actions">
        ${this.cart.length > 0
          ? `
          <a href="../checkout.html" class="btn btn-primary py-3 px-4">Checkout</a>
          <button type="button" class="btn btn-danger py-3 px-4" id="clearCart">Clear Cart</button>
        `
          : `
          <button type="button" class="btn btn-secondary py-3 px-4" disabled>Checkout</button>
        `
        }
      </div>
    `;

    // Attach clear cart event
    const clearBtn = document.getElementById('clearCart');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clearCart());
    }
  }

  // Attach event listeners to cart items
  attachItemEventListeners() {
    // Remove item buttons
    document.querySelectorAll('.remove-item').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.dataset.index);
        this.removeItem(index);
      });
    });

    // Quantity decrease buttons
    document.querySelectorAll('.decrease-qty').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.dataset.index);
        this.updateQuantity(index, -1);
      });
    });

    // Quantity increase buttons
    document.querySelectorAll('.increase-qty').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.dataset.index);
        this.updateQuantity(index, 1);
      });
    });

    // Quantity input fields
    document.querySelectorAll('.quantity-input').forEach((input) => {
      input.addEventListener('change', (e) => {
        const index = parseInt(e.currentTarget.dataset.index);
        const newQty = parseInt(e.currentTarget.value);
        if (newQty > 0 && newQty <= 99) {
          this.setQuantity(index, newQty);
        } else {
          e.currentTarget.value = this.cart[index].quantity || 1;
        }
      });
      
      // Prevent invalid input
      input.addEventListener('keydown', (e) => {
        if (e.key === '-' || e.key === 'e' || e.key === 'E') {
          e.preventDefault();
        }
      });
    });
  }

  // Update quantity
  updateQuantity(index, change) {
    if (index >= 0 && index < this.cart.length) {
      const item = this.cart[index];
      item.quantity = (item.quantity || 1) + change;

      if (item.quantity < 1) {
        item.quantity = 1;
      } else if (item.quantity > 99) {
        item.quantity = 99;
      }

      this.saveCart(this.cart);
      this.renderCartItems();
    }
  }

  // Set quantity directly
  setQuantity(index, quantity) {
    if (index >= 0 && index < this.cart.length) {
      this.cart[index].quantity = quantity;
      this.saveCart(this.cart);
      this.renderCartItems();
    }
  }

  // Remove item from cart
  removeItem(index) {
    if (index >= 0 && index < this.cart.length) {
      const item = this.cart[index];
      if (confirm(`Remove "${item.name}" from cart?`)) {
        this.cart.splice(index, 1);
        this.saveCart(this.cart);
        this.renderCartItems();
      }
    }
  }

  // Clear entire cart
  clearCart() {
    if (confirm('Are you sure you want to clear your entire cart?')) {
      this.cart = [];
      this.saveCart(this.cart);
      this.renderCartItems();
    }
  }

  // Setup global event listeners
  setupEventListeners() {
    // Listen for storage changes (for multi-tab sync)
    window.addEventListener('storage', (e) => {
      if (e.key === this.cartKey) {
        this.loadCart();
        this.renderCartItems();
      }
    });
  }
}

// Initialize cart manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new CartManager();
});