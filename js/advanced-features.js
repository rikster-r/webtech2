/**
 * Advanced JavaScript Features Implementation
 * Demonstrates: Objects & Methods, Arrays & Loops, Higher-Order Functions, Sound Effects, Animations
 * 
 * This module provides comprehensive JavaScript advanced concepts implementation
 * that can be used across the entire project.
 */

// 1. OBJECTS AND METHODS - Comprehensive Data Management System
class ProductManager {
  constructor() {
    this.products = [];
    this.cart = [];
    this.filters = {
      category: 'all',
      priceRange: { min: 0, max: 50000 },
      searchTerm: ''
    };
    this.stats = {
      totalViews: 0,
      totalClicks: 0,
      lastUpdated: new Date()
    };
  }

  // Method to add products using object structure
  addProduct(productData) {
    const product = {
      id: Date.now() + Math.random(),
      name: productData.name,
      price: productData.price,
      category: productData.category,
      emoji: productData.emoji,
      description: productData.description,
      inStock: productData.inStock || true,
      rating: productData.rating || 0,
      views: 0,
      clicks: 0,
      
      // Object method for displaying product info
      getDisplayInfo() {
        return `${this.emoji} ${this.name} - ${this.price.toLocaleString()} ₸`;
      },
      
      // Object method for checking if product matches filter
      matchesFilter(filter) {
        const matchesCategory = filter.category === 'all' || this.category === filter.category;
        const matchesPrice = this.price >= filter.priceRange.min && this.price <= filter.priceRange.max;
        const matchesSearch = this.name.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
                             this.description.toLowerCase().includes(filter.searchTerm.toLowerCase());
        return matchesCategory && matchesPrice && matchesSearch;
      },

      // Object method to increment views
      incrementViews() {
        this.views++;
        this.stats.totalViews++;
      },

      // Object method to increment clicks
      incrementClicks() {
        this.clicks++;
        this.stats.totalClicks++;
      },

      // Object method to get popularity score
      getPopularityScore() {
        return (this.views * 0.3) + (this.clicks * 0.7) + (this.rating * 2);
      }
    };
    
    this.products.push(product);
    return product;
  }

  // Method to get filtered products using higher-order functions
  getFilteredProducts() {
    return this.products.filter(product => product.matchesFilter(this.filters));
  }

  // Method to sort products using higher-order functions
  sortProducts(criteria = 'name') {
    return this.products.sort((a, b) => {
      switch (criteria) {
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        case 'popularity':
          return b.getPopularityScore() - a.getPopularityScore();
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }

  // Method to add to cart
  addToCart(productId) {
    const product = this.products.find(p => p.id === productId);
    if (product && product.inStock) {
      this.cart.push(product);
      product.incrementClicks();
      return true;
    }
    return false;
  }

  // Method to get cart total
  getCartTotal() {
    return this.cart.reduce((total, product) => total + product.price, 0);
  }

  // Method to get cart count
  getCartCount() {
    return this.cart.length;
  }

  // Method to clear cart
  clearCart() {
    this.cart = [];
  }

  // Method to remove item from cart
  removeFromCart(productId) {
    const index = this.cart.findIndex(p => p.id === productId);
    if (index > -1) {
      this.cart.splice(index, 1);
      return true;
    }
    return false;
  }
}

// 2. ARRAYS AND LOOPS - Sample product data and management
const sampleProducts = [
  {
    name: 'Premium Wireless Headphones',
    price: 13980,
    category: 'audio',
    emoji: '🎧',
    description: 'High-quality wireless headphones with noise cancellation',
    rating: 4.8
  },
  {
    name: 'Premium Smartphone Case',
    price: 2490,
    category: 'accessories',
    emoji: '📱',
    description: 'Protective case with premium materials',
    rating: 4.5
  },
  {
    name: 'Premium Smartwatch Series X',
    price: 4950,
    category: 'wearables',
    emoji: '⌚',
    description: 'Advanced smartwatch with health monitoring',
    rating: 4.7
  },
  {
    name: 'Gaming Mouse Pro',
    price: 8500,
    category: 'gaming',
    emoji: '🖱️',
    description: 'High-precision gaming mouse with RGB lighting',
    rating: 4.9
  },
  {
    name: 'Wireless Keyboard',
    price: 6200,
    category: 'accessories',
    emoji: '⌨️',
    description: 'Mechanical wireless keyboard with backlight',
    rating: 4.6
  },
  {
    name: 'Bluetooth Speaker',
    price: 3200,
    category: 'audio',
    emoji: '🔊',
    description: 'Portable Bluetooth speaker with deep bass',
    rating: 4.4
  },
  {
    name: 'USB-C Hub',
    price: 1800,
    category: 'accessories',
    emoji: '🔌',
    description: 'Multi-port USB-C hub with HDMI support',
    rating: 4.2
  },
  {
    name: 'Wireless Charger',
    price: 3500,
    category: 'accessories',
    emoji: '🔋',
    description: 'Fast wireless charging pad',
    rating: 4.3
  }
];

// Initialize the product manager
const productManager = new ProductManager();

// Populate products using forEach (Higher-Order Function)
sampleProducts.forEach(productData => {
  productManager.addProduct(productData);
});

// 3. HIGHER-ORDER FUNCTIONS - Advanced data manipulation
const DataProcessor = {
  // Using map to transform product data
  transformProductData(products) {
    return products.map(product => ({
      ...product,
      displayPrice: `${product.price.toLocaleString()} ₸`,
      isExpensive: product.price > 10000,
      discountPrice: product.price > 10000 ? Math.floor(product.price * 0.9) : product.price,
      popularityScore: product.getPopularityScore()
    }));
  },

  // Using filter to get products by category
  getProductsByCategory(category) {
    return productManager.products.filter(product => product.category === category);
  },

  // Using reduce to calculate statistics
  getProductStats() {
    return productManager.products.reduce((stats, product) => {
      stats.totalProducts++;
      stats.totalValue += product.price;
      stats.averagePrice = stats.totalValue / stats.totalProducts;
      
      if (!stats.categories[product.category]) {
        stats.categories[product.category] = 0;
      }
      stats.categories[product.category]++;
      
      if (product.price > stats.highestPrice) {
        stats.highestPrice = product.price;
        stats.mostExpensive = product.name;
      }
      
      if (product.price < stats.lowestPrice) {
        stats.lowestPrice = product.price;
        stats.cheapest = product.name;
      }
      
      return stats;
    }, {
      totalProducts: 0,
      totalValue: 0,
      averagePrice: 0,
      highestPrice: 0,
      lowestPrice: Infinity,
      mostExpensive: '',
      cheapest: '',
      categories: {}
    });
  },

  // Using forEach to process cart items
  processCartItems(callback) {
    productManager.cart.forEach((item, index) => {
      callback(item, index);
    });
  },

  // Using some to check if any products match criteria
  hasProductsInCategory(category) {
    return productManager.products.some(product => product.category === category);
  },

  // Using every to check if all products meet criteria
  allProductsInStock() {
    return productManager.products.every(product => product.inStock);
  },

  // Using find to locate specific product
  findProductByName(name) {
    return productManager.products.find(product => 
      product.name.toLowerCase().includes(name.toLowerCase())
    );
  }
};

// 4. SOUND EFFECTS - Enhanced audio system
class SoundManager {
  constructor() {
    this.audioContext = null;
    this.sounds = {
      click: { frequency: 800, duration: 0.1, type: 'sine' },
      success: { frequency: 600, duration: 0.2, type: 'sine' },
      error: { frequency: 300, duration: 0.3, type: 'sawtooth' },
      add: { frequency: 700, duration: 0.15, type: 'sine' },
      notification: { frequency: 1000, duration: 0.1, type: 'sine' },
      hover: { frequency: 500, duration: 0.05, type: 'sine' },
      remove: { frequency: 400, duration: 0.2, type: 'triangle' },
      checkout: { frequency: 800, duration: 0.3, type: 'sine' }
    };
    this.isEnabled = true;
  }

  init() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported');
    }
  }

  playSound(soundType) {
    if (!this.audioContext || !this.isEnabled) return;

    const sound = this.sounds[soundType] || this.sounds.click;
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.setValueAtTime(sound.frequency, this.audioContext.currentTime);
      oscillator.type = sound.type;
      
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + sound.duration);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + sound.duration);
    } catch (error) {
      console.warn('Sound playback failed:', error);
    }
  }

  toggleSound() {
    this.isEnabled = !this.isEnabled;
    return this.isEnabled;
  }

  // Play notification sound with visual feedback
  playNotificationSound(message, type = 'info') {
    this.playSound('notification');
    this.showNotification(message, type);
  }
}

// 5. ANIMATIONS - Advanced animation system
class AnimationManager {
  constructor() {
    this.animations = new Map();
    this.isAnimationsEnabled = true;
  }

  // Scale animation with bounce effect
  bounce(element, scale = 1.1, duration = 300) {
    if (!element || !this.isAnimationsEnabled) return;

    element.style.transition = `transform ${duration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`;
    element.style.transform = `scale(${scale})`;
    
    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, duration / 2);
  }

  // Slide in animation
  slideIn(element, direction = 'left', duration = 500) {
    if (!element || !this.isAnimationsEnabled) return;

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
  }

  // Pulse animation
  pulse(element, duration = 1000) {
    if (!element || !this.isAnimationsEnabled) return;

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
  }

  // Rotate animation
  rotate(element, degrees = 360, duration = 1000) {
    if (!element || !this.isAnimationsEnabled) return;

    element.style.transition = `transform ${duration}ms ease-in-out`;
    element.style.transform = `rotate(${degrees}deg)`;
    
    setTimeout(() => {
      element.style.transform = 'rotate(0deg)';
    }, duration);
  }

  // Shake animation
  shake(element, intensity = 10, duration = 500) {
    if (!element || !this.isAnimationsEnabled) return;

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

  // Fade in animation
  fadeIn(element, duration = 500) {
    if (!element || !this.isAnimationsEnabled) return;

    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ease-in`;
    
    requestAnimationFrame(() => {
      element.style.opacity = '1';
    });
  }

  // Fade out animation
  fadeOut(element, duration = 500) {
    if (!element || !this.isAnimationsEnabled) return;

    element.style.transition = `opacity ${duration}ms ease-out`;
    element.style.opacity = '0';
    
    setTimeout(() => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }, duration);
  }

  // Staggered animation for multiple elements
  staggerAnimation(elements, animationType = 'slideIn', delay = 100) {
    if (!elements || !this.isAnimationsEnabled) return;

    elements.forEach((element, index) => {
      setTimeout(() => {
        this[animationType](element);
      }, index * delay);
    });
  }

  toggleAnimations() {
    this.isAnimationsEnabled = !this.isAnimationsEnabled;
    return this.isAnimationsEnabled;
  }
}

// Initialize managers
const soundManager = new SoundManager();
const animationManager = new AnimationManager();

// Utility functions
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Style the notification
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

  // Set background color based on type
  const colors = {
    success: '#28a745',
    error: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8'
  };
  notification.style.backgroundColor = colors[type] || colors.info;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);

  // Remove after delay
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

function updateCartCount() {
  const cartCountElements = document.querySelectorAll('#cartCount');
  cartCountElements.forEach(element => {
    if (element) {
      element.textContent = productManager.getCartCount();
    }
  });
}

// Enhanced interaction setup
function setupEnhancedInteractions() {
  // Enhanced button interactions with sound and animation
  const buttons = document.querySelectorAll('.btn, button');
  buttons.forEach(button => {
    button.addEventListener('click', (e) => {
      soundManager.playSound('click');
      animationManager.bounce(button, 1.05, 200);
    });

    button.addEventListener('mouseenter', () => {
      soundManager.playSound('hover');
    });
  });

  // Add hover effects to product cards
  const productCards = document.querySelectorAll('.card');
  productCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
      card.style.transform = 'translateY(-5px)';
      card.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = '';
    });
  });

  // Add click tracking to product cards
  productCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (!e.target.closest('.btn-group')) {
        const productName = card.querySelector('h3, h4, h5, h6');
        if (productName) {
          const product = DataProcessor.findProductByName(productName.textContent);
          if (product) {
            product.incrementViews();
          }
        }
      }
    });
  });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize sound manager
  soundManager.init();
  
  // Add event listeners for enhanced interactions
  setupEnhancedInteractions();
  
  // Update cart count
  updateCartCount();
});

// Export for use in other modules
window.AdvancedFeatures = {
  ProductManager: productManager,
  SoundManager: soundManager,
  AnimationManager: animationManager,
  DataProcessor: DataProcessor,
  showNotification,
  updateCartCount,
  setupEnhancedInteractions
};
