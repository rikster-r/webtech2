document.addEventListener('DOMContentLoaded', async () => {
  const catalogManager = {
    products: [],
    cart: JSON.parse(localStorage.getItem('cart') || '[]'),
    filters: {
      category: 'all',
      priceRange: { min: 0, max: 50000 },
      searchTerm: ''
    },
    
    // Method to load products from external API
    async loadProductsFromAPI() {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const apiData = await response.json();
        
        // Define categories and emojis for mapping
        const categoryMap = {
          "men's clothing": { category: 'fashion', emoji: '👕' },
          "women's clothing": { category: 'fashion', emoji: '👚' },
          "jewelery": { category: 'accessories', emoji: '💍' },
          "electronics": { category: 'electronics', emoji: '📱' }
        };
        
        // Map API data to our required schema
        this.products = apiData.map(item => {
          const mappedCategory = categoryMap[item.category] || { category: 'other', emoji: '🛍️' };
          
          return {
            id: item.id,
            name: item.title.length > 30 ? item.title.substring(0, 30) + '...' : item.title,
            price: Math.round(item.price * 100), // Convert to cents/tenge format
            category: mappedCategory.category,
            emoji: mappedCategory.emoji,
            image: item.image, // Add actual image URL from API
            rating: item.rating.rate,
            inStock: true
          };
        });
        
        console.log('Products loaded from API:', this.products);
        
      } catch (error) {
        console.error('Error loading products from API:', error);
        // Fallback to local products with images
        showNotification('Failed to load products from API. Using local data.', 'error');
        this.products = [
          { 
            id: 1, 
            name: 'Premium Wireless Headphones', 
            price: 13980, 
            category: 'audio', 
            emoji: '🎧', 
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
            rating: 4.8, 
            inStock: true 
          },
          { 
            id: 2, 
            name: 'Premium Smartphone Case', 
            price: 2490, 
            category: 'accessories', 
            emoji: '📱', 
            image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=300&h=300&fit=crop',
            rating: 4.5, 
            inStock: true 
          },
          { 
            id: 3, 
            name: 'Premium Smartwatch Series X', 
            price: 4950, 
            category: 'wearables', 
            emoji: '⌚', 
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
            rating: 4.7, 
            inStock: true 
          },
          { 
            id: 4, 
            name: 'Gaming Mouse Pro', 
            price: 8500, 
            category: 'gaming', 
            emoji: '🖱️', 
            image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop',
            rating: 4.9, 
            inStock: true 
          },
          { 
            id: 5, 
            name: 'Wireless Keyboard', 
            price: 6200, 
            category: 'accessories', 
            emoji: '⌨️', 
            image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&h=300&fit=crop',
            rating: 4.6, 
            inStock: true 
          },
          { 
            id: 6, 
            name: 'Bluetooth Speaker', 
            price: 3200, 
            category: 'audio', 
            emoji: '🔊', 
            image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop',
            rating: 4.4, 
            inStock: true 
          }
        ];
      }
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
        // Check if product already exists in cart
        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
          // Increase quantity if item already exists
          existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
          // Add new item with quantity 1
          const productCopy = {...product};
          productCopy.quantity = 1;
          this.cart.push(productCopy);
        }
        
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartCount();
        return true;
      }
      return false;
    },
    
    updateCartCount() {
      const cartCountEl = document.getElementById('cartCount');
      if (cartCountEl) {
        // Calculate total items including quantities
        const totalItems = this.cart.reduce((total, item) => total + (item.quantity || 1), 0);
        cartCountEl.textContent = totalItems;
      }
    },
    
    // New method to get cart item count for a specific product
    getCartItemQuantity(productId) {
      const item = this.cart.find(item => item.id === productId);
      return item ? (item.quantity || 1) : 0;
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
      const cartQuantity = catalogManager.getCartItemQuantity(product.id);
      const quantityBadge = cartQuantity > 0 ? `<span class="badge bg-success position-absolute top-0 start-0 m-2">${cartQuantity} in cart</span>` : '';
      
      return `
        <div class="col-sm-6 col-md-4 col-lg-3 product-item product-card" data-product-id="${product.id}" data-product-name="${product.name.toLowerCase()}">
          <div class="card text-center p-3 shadow-sm h-100 position-relative" style="cursor: pointer; transition: all 0.3s ease;">
            ${discount}
            ${quantityBadge}
            <div class="product-image-container position-relative" style="height: 200px; overflow: hidden; border-radius: 8px;">
              <img src="${product.image}" 
                   alt="${product.name}" 
                   class="product-image h-100 w-100 object-fit-cover"
                   style="transition: transform 0.3s ease;"
                   onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg'; this.alt='Image not available'">
              <div class="product-emoji position-absolute bottom-2 right-2 bg-light rounded-circle p-1" style="font-size: 1.5rem;">${product.emoji}</div>
            </div>
            <h3 class="h6 mt-3 mb-1 product-name">${product.name}</h3>
            <p class="text-secondary mb-2">${product.price.toLocaleString()} ₸${discountPrice}</p>
            <div class="mb-2">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))} <small class="text-muted">(${product.rating.toFixed(1)})</small></div>
            <div class="btn-group w-100" role="group">
              <button type="button" class="btn btn-outline-primary add-cart-button" data-product-id="${product.id}" style="transition: transform 0.15s ease;">Add to Cart</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
    
    container.innerHTML = html;
    
    // Add image loading handlers
    document.querySelectorAll('.product-image').forEach(img => {
      img.addEventListener('load', function() {
        this.style.opacity = '1';
      });
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.3s ease';
    });
    
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
    
    // Update category filter options based on loaded products
    function updateCategoryFilter() {
      const categories = [...new Set(catalogManager.products.map(p => p.category))];
      categoryFilter.innerHTML = '<option value="all">All Categories</option>' +
        categories.map(cat => `<option value="${cat}">${cat.charAt(0).toUpperCase() + cat.slice(1)}</option>`).join('');
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
    
    // Update category filter after products are loaded
    updateCategoryFilter();
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
        
        const cartQuantity = catalogManager.getCartItemQuantity(id);
        showNotification(`Product added to cart! (${cartQuantity} total)`, 'success');
        
        // Update the product card to show the new quantity
        createProductCards();
        
        const badge = document.getElementById('cartCount');
        if (badge) {
          badge.style.animation = 'none';
          setTimeout(() => badge.style.animation = 'pulse 0.5s', 10);
        }
      }
    }
  });

  // Card hover effects with image zoom
  document.addEventListener('mouseenter', (e) => {
    let card = e.target.closest('.card');
    if (card && !e.target.closest('.btn-group')) {
      card.style.transform = 'translateY(-5px)';
      card.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
      const image = card.querySelector('.product-image');
      if (image) {
        image.style.transform = 'scale(1.05)';
      }
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
      const image = card.querySelector('.product-image');
      if (image) {
        image.style.transform = 'scale(1)';
      }
    }
  }, true);

  // Initialize the application
  async function initializeApp() {
    soundManager.init();
    
    // Show loading state
    const productList = document.getElementById('product-list');
    if (productList) {
      productList.innerHTML = `
        <div class="col-12 text-center py-5">
          <div class="spinner-border text-primary mb-3" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p>Loading products from API...</p>
        </div>
      `;
    }
    
    // Load products from API
    await catalogManager.loadProductsFromAPI();
    
    // Initialize the rest of the application
    catalogManager.updateCartCount();
    createProductCards();
    setupFilters();
    
    showNotification('Products loaded successfully!', 'success');
  }

  // Add CSS for image styling
  const style = document.createElement('style');
  style.textContent = `
    .product-image {
      object-fit: contain;
      border-radius: 8px;
      padding: 10px;
    }
    .product-image-container {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      width: 80%;
      margin: 24px auto 0 auto;
    }
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
  `;
  document.head.appendChild(style);

  // Start the application
  initializeApp();
});