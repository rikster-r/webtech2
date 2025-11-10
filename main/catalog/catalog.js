document.addEventListener('DOMContentLoaded', () => {
  // 1. CATALOG MANAGER - Enhanced Product Management
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
    filters: {
      category: 'all',
      priceRange: 'all',
      minRating: 'all',
      searchTerm: ''
    },

    getFilteredProducts() {
      return this.products.filter(product => {
        // Category filter
        const matchesCategory = this.filters.category === 'all' || product.category === this.filters.category;

        // Price filter
        let matchesPrice = true;
        if (this.filters.priceRange !== 'all') {
          const [min, max] = this.filters.priceRange.split('-').map(Number);
          matchesPrice = product.price >= min && product.price <= max;
        }

        // Rating filter
        let matchesRating = true;
        if (this.filters.minRating !== 'all') {
          matchesRating = product.rating >= parseFloat(this.filters.minRating);
        }

        // Search filter
        const matchesSearch = product.name.toLowerCase().includes(this.filters.searchTerm.toLowerCase());

        return matchesCategory && matchesPrice && matchesRating && matchesSearch;
      });
    },

    addToCart(productId) {
      const product = this.products.find(p => p.id === productId);
      if (product && product.inStock) {
        this.cart.push(product);
        this.updateCartCount();
        return true;
      }
      return false;
    },

    getCartCount() {
      return this.cart.length;
    },

    updateCartCount() {
      const cartCountElements = document.querySelectorAll('#cartCount');
      cartCountElements.forEach(element => {
        element.textContent = this.getCartCount();
      });
    }
  };

  // ... (остальной код soundManager, animationManager, showNotification остается таким же)

  // 5. CREATE PRODUCT CARDS
  function createProductCards() {
    const productContainer = document.querySelector('#product-list');
    if (!productContainer) return;

    const productPageMap = {
      1: '../headphones.html',
      2: '../smartphone-case.html',
      3: '../smartwatches.html',
      4: '#',
      5: '#',
      6: '#'
    };

    const filteredProducts = catalogManager.getFilteredProducts();

    if (filteredProducts.length === 0) {
      productContainer.innerHTML = `
        <div class="col-12 text-center py-5">
          <div class="text-muted">
            <i class="fas fa-search fa-3x mb-3"></i>
            <h4>No products found</h4>
            <p>Try adjusting your filters or search terms</p>
          </div>
        </div>
      `;
      return;
    }

    const productCards = filteredProducts.map((product) => {
      const discountBadge = product.price > 10000 ?
        `<span class="badge bg-danger position-absolute top-0 end-0 m-2">-10%</span>` : '';

      const productLink = productPageMap[product.id] || '#';

      return `
        <div class="col-sm-6 col-md-4 col-lg-3 product-item product-card" data-product-id="${product.id}" data-product-name="${product.name.toLowerCase()}" data-category="${product.category}" data-price="${product.price}" data-rating="${product.rating}">
          <a href="${productLink}" class="text-decoration-none text-dark">
            <div class="card text-center p-3 shadow-sm h-100 position-relative">
              ${discountBadge}
              <div class="display-3 product-emoji">${product.emoji}</div>
              <h3 class="h6 mt-3 mb-1 product-name">${product.name}</h3>
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

    // Add staggered animation
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

  // 6. SEARCH AND FILTERS FUNCTIONALITY
  function setupSearchAndFilters() {
    const searchInput = document.getElementById('product-search');
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const ratingFilter = document.getElementById('rating-filter');

    // Function to update filters and refresh products
    function updateFilters() {
      catalogManager.filters.searchTerm = searchInput ? searchInput.value : '';
      catalogManager.filters.category = categoryFilter ? categoryFilter.value : 'all';
      catalogManager.filters.priceRange = priceFilter ? priceFilter.value : 'all';
      catalogManager.filters.minRating = ratingFilter ? ratingFilter.value : 'all';

      createProductCards();
    }

    // Search functionality
    if (searchInput) {
      searchInput.addEventListener('input', updateFilters);

      // Add clear button functionality
      const clearBtn = document.createElement('button');
      clearBtn.innerHTML = '×';
      clearBtn.className = 'btn btn-link position-absolute';
      clearBtn.style.cssText = 'right: 10px; top: 50%; transform: translateY(-50%); display: none; z-index: 10;';

      const searchContainer = searchInput.parentElement;
      searchContainer.style.position = 'relative';
      searchContainer.appendChild(clearBtn);

      searchInput.addEventListener('input', function() {
        clearBtn.style.display = this.value ? 'block' : 'none';
      });

      clearBtn.addEventListener('click', function() {
        searchInput.value = '';
        updateFilters();
        searchInput.focus();
      });
    }

    // Filter functionality
    if (categoryFilter) {
      categoryFilter.addEventListener('change', updateFilters);
    }
    if (priceFilter) {
      priceFilter.addEventListener('change', updateFilters);
    }
    if (ratingFilter) {
      ratingFilter.addEventListener('change', updateFilters);
    }

    // Clear all filters button
    const clearAllBtn = document.createElement('button');
    clearAllBtn.className = 'btn btn-outline-secondary btn-sm mt-2';
    clearAllBtn.textContent = 'Clear All Filters';
    clearAllBtn.addEventListener('click', function() {
      if (searchInput) searchInput.value = '';
      if (categoryFilter) categoryFilter.value = 'all';
      if (priceFilter) priceFilter.value = 'all';
      if (ratingFilter) ratingFilter.value = 'all';
      updateFilters();
    });

    // Add clear button to filters section
    const filtersContainer = document.querySelector('.col-md-6 .row');
    if (filtersContainer) {
      const clearContainer = document.createElement('div');
      clearContainer.className = 'col-12';
      clearContainer.appendChild(clearAllBtn);
      filtersContainer.appendChild(clearContainer);
    }
  }

  // ... (остальной код setupButtons, setupCardInteractions и т.д. остается таким же)

  // INITIALIZE EVERYTHING
  soundManager.init();
  createProductCards();
  setupSearchAndFilters(); // Заменяем setupSearch на setupSearchAndFilters
  setupButtons();
  setupCardInteractions();
  setupNavigation();
  setupPageAnimation();
});