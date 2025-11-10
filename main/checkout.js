// Checkout page functionality
class CheckoutManager {
  constructor() {
    this.cartKey = 'cart';
    this.shippingCost = 1500;
    this.taxRate = 0.1; // 10% tax
    this.discountRate = 0.1; // 10% discount
    this.audioCtx = null;
    this.init();
  }

  init() {
    this.loadCartData();
    this.updateOrderSummary();
    this.setupFormValidation();
    this.setupDeliveryListener();
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

  // Load cart data
  loadCartData() {
    this.cart = this.getCart();
    
    // Redirect to cart if empty
    if (this.cart.length === 0) {
      alert('Your cart is empty. Redirecting to catalog...');
      window.location.href = './catalog/catalog.html';
    }
  }

  // Calculate subtotal
  calculateSubtotal() {
    return this.cart.reduce((sum, item) => {
      const quantity = item.quantity || 1;
      return sum + (item.price * quantity);
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

  // Get shipping cost based on delivery method
  getShippingCost() {
    const deliverySelect = document.getElementById('delivery');
    if (deliverySelect && deliverySelect.value === 'pickup') {
      return 0; // Free for pickup
    }
    return this.shippingCost;
  }

  // Calculate total
  calculateTotal() {
    const subtotal = this.calculateSubtotal();
    const discount = this.calculateDiscount(subtotal);
    const tax = this.calculateTax(subtotal, discount);
    const shipping = this.getShippingCost();
    return subtotal - discount + shipping + tax;
  }

  // Format currency
  formatCurrency(amount) {
    return new Intl.NumberFormat('ru-KZ').format(Math.round(amount)) + ' ₸';
  }

  // Update order summary
  updateOrderSummary() {
    const totalItems = this.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const subtotal = this.calculateSubtotal();
    const discount = this.calculateDiscount(subtotal);
    const tax = this.calculateTax(subtotal, discount);
    const shipping = this.getShippingCost();
    const total = this.calculateTotal();

    const summaryContainer = document.querySelector('.col-lg-4 .card-body');
    if (!summaryContainer) return;

    summaryContainer.innerHTML = `
      <h2 class="h5 fw-semibold mb-3">Order Summary</h2>
      
      <div class="d-flex justify-content-between mb-2">
        <span class="text-muted">Items</span>
        <span>${totalItems}</span>
      </div>
      
      <div class="d-flex justify-content-between mb-2">
        <span class="text-muted">Subtotal</span>
        <span>${this.formatCurrency(subtotal)}</span>
      </div>
      
      <div class="d-flex justify-content-between mb-2">
        <span class="text-muted">Discount (10%)</span>
        <span class="text-success">-${this.formatCurrency(discount)}</span>
      </div>
      
      <div class="d-flex justify-content-between mb-2">
        <span class="text-muted">Tax (10%)</span>
        <span>${this.formatCurrency(tax)}</span>
      </div>
      
      <div class="d-flex justify-content-between mb-3">
        <span class="text-muted">Delivery</span>
        <span id="deliveryCost">${shipping === 0 ? 'Free' : this.formatCurrency(shipping)}</span>
      </div>
      
      <div class="d-flex justify-content-between pt-3 mt-3 border-top fw-semibold fs-5">
        <span>Total</span>
        <span class="text-danger" id="totalAmount">${this.formatCurrency(total)}</span>
      </div>
    `;
  }

  // Setup delivery method listener
  setupDeliveryListener() {
    const deliverySelect = document.getElementById('delivery');
    if (deliverySelect) {
      deliverySelect.addEventListener('change', () => {
        this.updateOrderSummary();
      });
    }
  }

  // Beep sound effect
  beep(freq = 620, dur = 0.07) {
    try {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      const o = this.audioCtx.createOscillator();
      const g = this.audioCtx.createGain();
      o.type = 'sine';
      o.frequency.value = freq;
      g.gain.value = 0.05;
      o.connect(g);
      g.connect(this.audioCtx.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + dur);
      o.stop(this.audioCtx.currentTime + dur + 0.02);
    } catch (e) {
      console.error('Audio error:', e);
    }
  }

  // Validate form field
  validateField(field) {
    if (!field) return false;
    
    const value = field.value.trim();
    let isValid = true;

    // Check if empty
    if (!value) {
      isValid = false;
    }

    // Email validation
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailRegex.test(value);
    }

    // Phone validation (basic)
    if (field.type === 'tel' && value) {
      const phoneRegex = /^[\d\s\+\-\(\)]+$/;
      isValid = phoneRegex.test(value) && value.replace(/\D/g, '').length >= 10;
    }

    // Update field styling
    if (isValid) {
      field.classList.remove('is-invalid');
      field.classList.add('is-valid');
    } else {
      field.classList.remove('is-valid');
      field.classList.add('is-invalid');
    }

    return isValid;
  }

  // Setup form validation
  setupFormValidation() {
    const form = document.querySelector('main form');
    const placeBtn = document.querySelector('button[type="submit"]');

    if (!form || !placeBtn) return;

    // Add real-time validation
    const fields = form.querySelectorAll('input, select');
    fields.forEach(field => {
      field.addEventListener('blur', () => {
        if (field.value.trim()) {
          this.validateField(field);
        }
      });

      field.addEventListener('input', () => {
        if (field.classList.contains('is-invalid')) {
          this.validateField(field);
        }
      });
    });

    // Handle form submission
    placeBtn.addEventListener('click', (e) => {
      e.preventDefault();

      // Get all required fields
      const requiredFields = [
        form.querySelector('#firstName'),
        form.querySelector('#lastName'),
        form.querySelector('#email'),
        form.querySelector('#phone'),
        form.querySelector('#address'),
        form.querySelector('#city'),
        form.querySelector('#postal')
      ];

      let allValid = true;

      // Validate all fields
      requiredFields.forEach(field => {
        if (!this.validateField(field)) {
          allValid = false;
        }
      });

      if (!allValid) {
        this.beep(280);
        const card = form.closest('.card');
        if (card && card.animate) {
          card.animate([
            { transform: 'translateX(0)' },
            { transform: 'translateX(-6px)' },
            { transform: 'translateX(6px)' },
            { transform: 'translateX(0)' }
          ], { duration: 380, easing: 'ease-in-out' });
        }

        // Scroll to first invalid field
        const firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) {
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstInvalid.focus();
        }
      } else {
        this.beep(720);
        this.placeOrder(form);
      }
    });
  }

  // Place order
  placeOrder(form) {
    // Collect form data
    const orderData = {
      customer: {
        firstName: form.querySelector('#firstName').value,
        lastName: form.querySelector('#lastName').value,
        email: form.querySelector('#email').value,
        phone: form.querySelector('#phone').value
      },
      address: {
        street: form.querySelector('#address').value,
        city: form.querySelector('#city').value,
        postal: form.querySelector('#postal').value
      },
      delivery: form.querySelector('#delivery').value,
      payment: form.querySelector('#payment').value,
      items: this.cart,
      pricing: {
        subtotal: this.calculateSubtotal(),
        discount: this.calculateDiscount(this.calculateSubtotal()),
        tax: this.calculateTax(this.calculateSubtotal(), this.calculateDiscount(this.calculateSubtotal())),
        shipping: this.getShippingCost(),
        total: this.calculateTotal()
      },
      orderDate: new Date().toISOString()
    };

    // Store order in localStorage
    try {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push(orderData);
      localStorage.setItem('orders', JSON.stringify(orders));

      // Clear cart
      localStorage.removeItem(this.cartKey);

      // Show success message
      alert(`✅ Order placed successfully!\n\nOrder Total: ${this.formatCurrency(orderData.pricing.total)}\n\nThank you for your purchase, ${orderData.customer.firstName}!`);

      // Redirect to home
      window.location.href = './welcome/main.html';
    } catch (error) {
      console.error('Error placing order:', error);
      alert('❌ There was an error placing your order. Please try again.');
    }
  }
}

// Initialize checkout manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new CheckoutManager();
});