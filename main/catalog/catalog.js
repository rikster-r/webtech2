document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('header nav .nav-link');
  if (!navLinks || navLinks.length === 0) return;

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
  
  const buyButtons = document.querySelectorAll('.buy-btn');
  const addButtons = document.querySelectorAll('.add-cart-button, .add-cart');

  let audioCtx;
  function clickBeep(freq = 540) {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'square';
      o.frequency.value = freq;
      g.gain.value = 0.05;
      o.connect(g);
      g.connect(audioCtx.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.06);
      o.stop(audioCtx.currentTime + 0.07);
    } catch (err) {}
  }

  function pop(element) {
    if (!element || !element.animate) return;
    element.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(1.06)' },
      { transform: 'scale(1)' }
    ], { duration: 220, easing: 'ease-out' });
  }

  buyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      pop(btn);
      clickBeep(660);
      setTimeout(() => window.location.href = '../cart/cart.html', 260);
    });
  });

  addButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      pop(btn);
      clickBeep(520);
    });
  });

  // Advanced Features Integration
  setupAdvancedFeatures();
});

function setupAdvancedFeatures() {
  // Wait for advanced features to load
  setTimeout(() => {
    if (window.AdvancedFeatures) {
      const { ProductManager, SoundManager, AnimationManager, showNotification } = window.AdvancedFeatures;
      
      // Enhanced product interactions
      const productCards = document.querySelectorAll('.card');
      productCards.forEach((card, index) => {
        // Add unique IDs to products for management
        const productId = `product-${index}`;
        card.setAttribute('data-product-id', productId);
        
        // Enhanced click animations
        card.addEventListener('click', (e) => {
          if (!e.target.closest('.btn-group')) {
            SoundManager.playSound('click');
            AnimationManager.bounce(card, 1.02, 300);
          }
        });
      });

      // Enhanced buy button interactions
      const enhancedBuyButtons = document.querySelectorAll('.buy-btn');
      enhancedBuyButtons.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          SoundManager.playSound('success');
          AnimationManager.bounce(btn, 1.1, 250);
          showNotification('Redirecting to checkout...', 'success');
          setTimeout(() => window.location.href = '../cart/cart.html', 500);
        });
      });

      // Enhanced add to cart interactions
      const enhancedAddButtons = document.querySelectorAll('.add-cart-button, .add-cart');
      enhancedAddButtons.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          SoundManager.playSound('add');
          AnimationManager.bounce(btn, 1.08, 200);
          
          // Simulate adding to cart
          const productName = btn.closest('.card').querySelector('h3').textContent;
          showNotification(`${productName} added to cart!`, 'success');
          
          // Update cart count
          const cartCount = document.getElementById('cartCount');
          if (cartCount) {
            const currentCount = parseInt(cartCount.textContent) || 0;
            cartCount.textContent = currentCount + 1;
            AnimationManager.pulse(cartCount, 1000);
          }
        });
      });

      // Add filter functionality
      addFilterControls();
      
      // Add dynamic product display
      displayDynamicProducts();
    }
  }, 100);
}

function addFilterControls() {
  // Create filter controls
  const filterContainer = document.createElement('div');
  filterContainer.className = 'filter-controls';
  filterContainer.style.cssText = `
    background: #f8f9fa;
    padding: 20px;
    margin: 20px 0;
    border-radius: 8px;
    border: 1px solid #dee2e6;
  `;

  filterContainer.innerHTML = `
    <h5 style="margin-bottom: 15px; color: #dc3545;">Advanced Filters</h5>
    <div class="row g-3">
      <div class="col-md-4">
        <label for="categoryFilter" class="form-label">Category</label>
        <select id="categoryFilter" class="form-select">
          <option value="all">All Categories</option>
          <option value="audio">Audio</option>
          <option value="accessories">Accessories</option>
          <option value="wearables">Wearables</option>
          <option value="gaming">Gaming</option>
        </select>
      </div>
      <div class="col-md-4">
        <label for="priceFilter" class="form-label">Max Price</label>
        <input type="range" id="priceFilter" class="form-range" min="0" max="50000" value="50000">
        <div id="priceDisplay" class="text-muted small">Max: 50,000 ₸</div>
      </div>
      <div class="col-md-4">
        <label for="searchFilter" class="form-label">Search</label>
        <input type="text" id="searchFilter" class="form-control" placeholder="Search products...">
      </div>
    </div>
    <div class="mt-3">
      <button id="resetFilters" class="btn btn-outline-secondary btn-sm">Reset Filters</button>
      <button id="sortProducts" class="btn btn-outline-primary btn-sm ms-2">Sort by Price</button>
    </div>
  `;

  // Insert filter controls after the sidebar
  const sidebar = document.querySelector('aside');
  sidebar.parentNode.insertBefore(filterContainer, sidebar.nextSibling);

  // Add filter functionality
  setupFilterFunctionality();
}

function setupFilterFunctionality() {
  const categoryFilter = document.getElementById('categoryFilter');
  const priceFilter = document.getElementById('priceFilter');
  const priceDisplay = document.getElementById('priceDisplay');
  const searchFilter = document.getElementById('searchFilter');
  const resetFilters = document.getElementById('resetFilters');
  const sortProducts = document.getElementById('sortProducts');

  if (categoryFilter) {
    categoryFilter.addEventListener('change', applyFilters);
  }

  if (priceFilter) {
    priceFilter.addEventListener('input', () => {
      const maxPrice = parseInt(priceFilter.value);
      priceDisplay.textContent = `Max: ${maxPrice.toLocaleString()} ₸`;
      applyFilters();
    });
  }

  if (searchFilter) {
    searchFilter.addEventListener('input', applyFilters);
  }

  if (resetFilters) {
    resetFilters.addEventListener('click', () => {
      categoryFilter.value = 'all';
      priceFilter.value = 50000;
      priceDisplay.textContent = 'Max: 50,000 ₸';
      searchFilter.value = '';
      applyFilters();
      window.SoundManager.playSound('success');
    });
  }

  if (sortProducts) {
    sortProducts.addEventListener('click', () => {
      toggleSorting();
    });
  }
}

let currentSortCriteria = 'name';
function toggleSorting() {
  const sortButton = document.getElementById('sortProducts');
  const criteria = ['name', 'price', 'rating'];
  const currentIndex = criteria.indexOf(currentSortCriteria);
  currentSortCriteria = criteria[(currentIndex + 1) % criteria.length];
  
  sortButton.textContent = `Sort by ${currentSortCriteria.charAt(0).toUpperCase() + currentSortCriteria.slice(1)}`;
  applyFilters();
  window.SoundManager.playSound('click');
}

function applyFilters() {
  if (!window.AdvancedFeatures) return;

  const { ProductManager, AnimationManager } = window.AdvancedFeatures;
  
  // Update filters
  ProductManager.filters.category = document.getElementById('categoryFilter').value;
  ProductManager.filters.priceRange.max = parseInt(document.getElementById('priceFilter').value);
  ProductManager.filters.searchTerm = document.getElementById('searchFilter').value;

  // Get filtered and sorted products
  let filteredProducts = ProductManager.getFilteredProducts();
  
  // Sort products
  filteredProducts = filteredProducts.sort((a, b) => {
    switch (currentSortCriteria) {
      case 'price':
        return a.price - b.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  // Update display
  updateProductDisplay(filteredProducts);
}

function updateProductDisplay(products) {
  const productContainer = document.querySelector('.col-md-9 .row');
  if (!productContainer) return;

  // Clear existing products
  productContainer.innerHTML = '';

  // Add filtered products
  products.forEach((product, index) => {
    const productCard = createProductCard(product, index);
    productContainer.appendChild(productCard);
  });

  // Add animation to new cards
  const newCards = productContainer.querySelectorAll('.card');
  newCards.forEach((card, index) => {
    setTimeout(() => {
      AnimationManager.slideIn(card, 'up', 400);
    }, index * 100);
  });
}

function createProductCard(product, index) {
  const col = document.createElement('div');
  col.className = 'col-sm-6 col-md-4 col-lg-3';

  const discountBadge = product.price > 10000 ? 
    `<span class="badge bg-danger position-absolute top-0 end-0 m-2">-10%</span>` : '';

  col.innerHTML = `
    <a href="../headphones.html" class="text-decoration-none text-dark">
      <div class="card text-center p-3 shadow-sm h-100 position-relative">
        ${discountBadge}
        <div class="display-3">${product.emoji}</div>
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
          <button type="button" class="btn buy-btn">Buy</button>
          <a href="../cart/cart.html" class="btn add-cart-button">Add to Cart</a>
        </div>
      </div>
    </a>
  `;

  return col;
}

function displayDynamicProducts() {
  // This function demonstrates dynamic product loading
  setTimeout(() => {
    if (window.AdvancedFeatures) {
      const { showNotification } = window.AdvancedFeatures;
      showNotification('Advanced features loaded! Try the filters and animations.', 'success');
    }
  }, 1000);
}
