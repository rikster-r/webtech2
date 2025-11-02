/**
 * Enhanced Cart Page JavaScript
 * Demonstrates Arrays, Loops, Objects, Higher-Order Functions, Sound Effects, and Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // Cart management using objects and arrays
  const cartManager = {
    items: [],

    // Object method to calculate subtotal
    getSubtotal() {
      return this.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },

    // Object method to calculate shipping
    getShipping() {
      return this.getSubtotal() > 20000 ? 0 : 1500;
    },

    // Object method to calculate discount
    getDiscount() {
      const subtotal = this.getSubtotal();
      return subtotal > 20000 ? Math.floor(subtotal * 0.1) : 0;
    },

    // Object method to calculate tax
    getTax() {
      return Math.floor((this.getSubtotal() - this.getDiscount()) * 0.12);
    },

    // Object method to get total
    getTotal() {
      return (
        this.getSubtotal() +
        this.getShipping() -
        this.getDiscount() +
        this.getTax()
      );
    },

    // Object method to get total items
    getTotalItems() {
      return this.items.reduce((total, item) => total + item.quantity, 0);
    },
  };

  // Enhanced cart display using arrays and loops
  function updateCartDisplay() {
    const cartContainer = document.querySelector('.col-lg-8 .bg-white');
    if (!cartContainer) return;

    // Clear existing items
    const existingItems = cartContainer.querySelectorAll('.cart-item');
    existingItems.forEach((item) => item.remove());

    // Create new items using forEach (Higher-Order Function)
    cartManager.items.forEach((item, index) => {
      const cartItem = document.createElement('div');
      cartItem.className =
        'cart-item d-flex flex-wrap align-items-center justify-content-between border-bottom py-3';
      cartItem.setAttribute('data-item-id', item.id);

      cartItem.innerHTML = `
        <div class="d-flex align-items-center gap-3">
          <div class="bg-light rounded-3 d-flex align-items-center justify-content-center item-emoji" 
               style="width:80px; height:80px; font-size:24px;">${
                 item.emoji
               }</div>
          <div>
            <div class="fw-semibold">${item.name}</div>
            <small class="">Color: ${item.color}</small>
          </div>
        </div>
        <div class="text-danger fw-semibold fs-6 item-price">${item.price.toLocaleString()} ₸</div>
        <div class="input-group w-auto">
          <button class="btn btn-outline-secondary quantity-decrease" data-item-id="${
            item.id
          }">−</button>
          <input type="number" class="form-control text-center quantity-input" 
                 value="${
                   item.quantity
                 }" min="1" max="10" style="width:60px;" data-item-id="${
        item.id
      }">
          <button class="btn btn-outline-secondary quantity-increase" data-item-id="${
            item.id
          }">+</button>
        </div>
        <button class="btn btn-link text-danger fs-5 remove-item" data-item-id="${
          item.id
        }">×</button>
      `;

      cartContainer.appendChild(cartItem);

      // Add animation to new items
      cartItem.style.opacity = '0';
      cartItem.style.transform = 'translateX(-20px)';
      cartItem.style.transition = 'all 0.3s ease';

      setTimeout(() => {
        cartItem.style.opacity = '1';
        cartItem.style.transform = 'translateX(0)';
      }, index * 100);
    });
  }

  // Update order summary using object methods
  function updateOrderSummary() {
    const summaryContainer = document.querySelector('.col-lg-4 .bg-white');
    if (!summaryContainer) return;

    const subtotal = cartManager.getSubtotal();
    const shipping = cartManager.getShipping();
    const discount = cartManager.getDiscount();
    const tax = cartManager.getTax();
    const total = cartManager.getTotal();
    const totalItems = cartManager.getTotalItems();

    // Update subtotal
    const subtotalElement = summaryContainer.querySelector(
      '.d-flex.justify-content-between.border-bottom.py-2'
    );
    if (subtotalElement) {
      subtotalElement.innerHTML = `
        <span class="">Subtotal (${totalItems} items)</span>
        <span class="fw-semibold">${subtotal.toLocaleString()} ₸</span>
      `;
    }

    // Update shipping
    const shippingElements = summaryContainer.querySelectorAll(
      '.d-flex.justify-content-between.border-bottom.py-2'
    );
    if (shippingElements[1]) {
      shippingElements[1].innerHTML = `
        <span class="">Shipping</span>
        <span class="fw-semibold">${
          shipping === 0 ? 'Free' : shipping.toLocaleString() + ' ₸'
        }</span>
      `;
    }

    // Update discount
    if (shippingElements[2]) {
      shippingElements[2].innerHTML = `
        <span class="">Discount</span>
        <span class="text-success fw-semibold">${
          discount > 0 ? '-' + discount.toLocaleString() + ' ₸' : '0 ₸'
        }</span>
      `;
    }

    // Update tax
    if (shippingElements[3]) {
      shippingElements[3].innerHTML = `
        <span class="">Tax</span>
        <span class="fw-semibold">${tax.toLocaleString()} ₸</span>
      `;
    }

    // Update total
    const totalElements = summaryContainer.querySelectorAll(
      '.d-flex.justify-content-between.pt-3'
    );
    if (totalElements[0]) {
      totalElements[0].innerHTML = `
        <span class="fw-semibold fs-5">Total</span>
        <span class="fw-bold fs-5 text-danger">${total.toLocaleString()} ₸</span>
      `;
    }
  }

  // Enhanced quantity controls with sound and animation
  function setupQuantityControls() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('quantity-increase')) {
        const itemId = parseInt(e.target.getAttribute('data-item-id'));
        const item = cartManager.items.find((i) => i.id === itemId);

        if (item && item.quantity < 10) {
          item.quantity++;
          updateCartDisplay();
          updateOrderSummary();

          if (window.AdvancedFeatures) {
            window.AdvancedFeatures.SoundManager.playSound('add');
            window.AdvancedFeatures.AnimationManager.bounce(e.target, 1.2, 200);
          }
        }
      }

      if (e.target.classList.contains('quantity-decrease')) {
        const itemId = parseInt(e.target.getAttribute('data-item-id'));
        const item = cartManager.items.find((i) => i.id === itemId);

        if (item && item.quantity > 1) {
          item.quantity--;
          updateCartDisplay();
          updateOrderSummary();

          if (window.AdvancedFeatures) {
            window.AdvancedFeatures.SoundManager.playSound('remove');
            window.AdvancedFeatures.AnimationManager.bounce(e.target, 1.2, 200);
          }
        }
      }

      if (e.target.classList.contains('remove-item')) {
        const itemId = parseInt(e.target.getAttribute('data-item-id'));
        const itemIndex = cartManager.items.findIndex((i) => i.id === itemId);

        if (itemIndex > -1) {
          const itemElement = e.target.closest('.cart-item');

          if (window.AdvancedFeatures) {
            window.AdvancedFeatures.SoundManager.playSound('remove');
            window.AdvancedFeatures.AnimationManager.fadeOut(itemElement, 300);
          }

          setTimeout(() => {
            cartManager.items.splice(itemIndex, 1);
            updateCartDisplay();
            updateOrderSummary();
          }, 300);
        }
      }
    });

    // Quantity input change handler
    document.addEventListener('input', (e) => {
      if (e.target.classList.contains('quantity-input')) {
        const itemId = parseInt(e.target.getAttribute('data-item-id'));
        const item = cartManager.items.find((i) => i.id === itemId);
        const newQuantity = parseInt(e.target.value);

        if (item && newQuantity >= 1 && newQuantity <= 10) {
          item.quantity = newQuantity;
          updateOrderSummary();

          if (window.AdvancedFeatures) {
            window.AdvancedFeatures.SoundManager.playSound('click');
          }
        }
      }
    });
  }

  // Enhanced checkout button with animation
  function setupCheckoutButton() {
    const checkoutButton = document.querySelector('a[href="../checkout.html"]');
    if (checkoutButton) {
      checkoutButton.addEventListener('click', (e) => {
        e.preventDefault();

        if (window.AdvancedFeatures) {
          window.AdvancedFeatures.SoundManager.playSound('checkout');
          window.AdvancedFeatures.AnimationManager.bounce(
            checkoutButton,
            1.1,
            300
          );
          window.AdvancedFeatures.showNotification(
            'Redirecting to checkout...',
            'success'
          );
        }

        setTimeout(() => {
          window.location.href = '../checkout.html';
        }, 500);
      });
    }
  }

  // Enhanced remove all button
  function setupRemoveAllButton() {
    const removeButton = document.querySelector('button.btn-danger');
    if (removeButton) {
      removeButton.addEventListener('click', () => {
        if (cartManager.items.length === 0) {
          if (window.AdvancedFeatures) {
            window.AdvancedFeatures.showNotification(
              'Cart is already empty!',
              'warning'
            );
          }
          return;
        }

        if (window.AdvancedFeatures) {
          window.AdvancedFeatures.SoundManager.playSound('remove');
          window.AdvancedFeatures.showNotification(
            'All items removed from cart!',
            'success'
          );
        }

        cartManager.items = [];
        updateCartDisplay();
        updateOrderSummary();
      });
    }
  }

  // Create interactive cart features
  function createInteractiveFeatures() {
    // Add cart progress indicator
    const progressContainer = document.createElement('div');
    progressContainer.className = 'cart-progress mb-4';
    progressContainer.innerHTML = `
      <div class="progress" style="height: 8px;">
        <div class="progress-bar bg-danger" role="progressbar" style="width: 0%" id="cartProgress"></div>
      </div>
      <div class="text-center mt-2">
        <small class="">Free shipping at 20,000 ₸</small>
      </div>
    `;

    const mainContainer = document.querySelector('.container.my-4');
    mainContainer.insertBefore(progressContainer, mainContainer.firstChild);

    // Update progress bar
    function updateProgressBar() {
      const progressBar = document.getElementById('cartProgress');
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

    // Add save for later feature
    const saveForLaterContainer = document.createElement('div');
    saveForLaterContainer.className = 'save-for-later mt-4';
    saveForLaterContainer.innerHTML = `
      <div class="bg-light rounded p-3">
        <h6 class="mb-3">Save for Later</h6>
        <div class="row g-2" id="saveForLaterItems">
          <!-- Items will be added here -->
        </div>
      </div>
    `;

    const cartSection = document.querySelector('.col-lg-8');
    cartSection.appendChild(saveForLaterContainer);

    // Add some sample "save for later" items
    const saveForLaterItems = [
      { name: 'Wireless Earbuds', price: 8500, emoji: '🎧' },
      { name: 'Phone Stand', price: 1200, emoji: '📱' },
    ];

    const saveForLaterContainerElement =
      document.getElementById('saveForLaterItems');
    saveForLaterItems.forEach((item) => {
      const itemElement = document.createElement('div');
      itemElement.className = 'col-md-6';
      itemElement.innerHTML = `
        <div class="d-flex align-items-center justify-content-between p-2 bg-white rounded">
          <div class="d-flex align-items-center gap-2">
            <span style="font-size: 20px;">${item.emoji}</span>
            <div>
              <div class="small fw-semibold">${item.name}</div>
              <div class="small ">${item.price.toLocaleString()} ₸</div>
            </div>
          </div>
          <button class="btn btn-sm btn-outline-primary add-back-btn">Add Back</button>
        </div>
      `;

      saveForLaterContainerElement.appendChild(itemElement);
    });

    // Add back to cart functionality
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('add-back-btn')) {
        const itemElement = e.target.closest('.col-md-6');
        const itemName = itemElement.querySelector('.fw-semibold').textContent;
        const itemPrice = parseInt(
          itemElement
            .querySelector('.')
            .textContent.replace(/[^\d]/g, '')
        );

        // Add back to cart
        const newItem = {
          id: Date.now(),
          name: itemName,
          price: itemPrice,
          quantity: 1,
          emoji: itemElement.querySelector('span').textContent,
          color: 'Default',
        };

        cartManager.items.push(newItem);
        updateCartDisplay();
        updateOrderSummary();
        updateProgressBar();

        if (window.AdvancedFeatures) {
          window.AdvancedFeatures.SoundManager.playSound('add');
          window.AdvancedFeatures.showNotification(
            `${itemName} added back to cart!`,
            'success'
          );
        }

        // Remove from save for later
        itemElement.remove();
      }
    });

    updateProgressBar();
  }

  // Initialize all features
  updateCartDisplay();
  updateOrderSummary();
  setupQuantityControls();
  setupCheckoutButton();
  setupRemoveAllButton();
  createInteractiveFeatures();

  // Add page load animation
  const mainContent = document.querySelector('.container');
  mainContent.style.opacity = '0';
  mainContent.style.transform = 'translateY(20px)';
  mainContent.style.transition = 'all 0.8s ease';

  setTimeout(() => {
    mainContent.style.opacity = '1';
    mainContent.style.transform = 'translateY(0)';
  }, 100);
});
