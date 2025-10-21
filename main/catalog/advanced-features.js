/**
 * Advanced JavaScript Features Demo
 * Demonstrates: Objects & Methods, Arrays & Loops, Higher-Order Functions, Sound Effects, Animations
 */

// 1. OBJECTS AND METHODS - Product Management System
class ProductManager {
  constructor() {
    this.products = [];
    this.cart = [];
    this.filters = {
      category: 'all',
      priceRange: { min: 0, max: 50000 },
      searchTerm: ''
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
      
      // Object method for displaying product info
      getDisplayInfo() {
        return `${this.emoji} ${this.name} - ${this.price} ₸`;
      },
      
      // Object method for checking if product matches filter
      matchesFilter(filter) {
        const matchesCategory = filter.category === 'all' || this.category === filter.category;
        const matchesPrice = this.price >= filter.priceRange.min && this.price <= filter.priceRange.max;
        const matchesSearch = this.name.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
                             this.description.toLowerCase().includes(filter.searchTerm.toLowerCase());
        return matchesCategory && matchesPrice && matchesSearch;
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
      this.playSound('add');
      this.showNotification(`${product.name} added to cart!`, 'success');
      this.updateCartCount();
    }
  }

  // Method to get cart total
  getCartTotal() {
    return this.cart.reduce((total, product) => total + product.price, 0);
  }
}

// Initialize the product manager
const productManager = new ProductManager();

// 2. ARRAYS AND LOOPS - Sample product data
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
  }
];

// Populate products using forEach (Higher-Order Function)
sampleProducts.forEach(productData => {
  productManager.addProduct(productData);
});

// 3. HIGHER-ORDER FUNCTIONS - Data manipulation
const advancedFeatures = {
  // Using map to transform product data
  transformProductData(products) {
    return products.map(product => ({
      ...product,
      displayPrice: `${product.price.toLocaleString()} ₸`,
      isExpensive: product.price > 10000,
      discountPrice: product.price > 10000 ? Math.floor(product.price * 0.9) : product.price
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
      
      return stats;
    }, {
      totalProducts: 0,
      totalValue: 0,
      averagePrice: 0,
      categories: {}
    });
  }
};

// 4. SOUND EFFECTS - Enhanced audio system
class SoundManager {
  constructor() {
    this.audioContext = null;
    this.sounds = {
      click: { frequency: 800, duration: 0.1 },
      success: { frequency: 600, duration: 0.2 },
      error: { frequency: 300, duration: 0.3 },
      add: { frequency: 700, duration: 0.15 },
      notification: { frequency: 1000, duration: 0.1 }
    };
  }

  init() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported');
    }
  }

  playSound(soundType) {
    if (!this.audioContext) return;

    const sound = this.sounds[soundType] || this.sounds.click;
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.setValueAtTime(sound.frequency, this.audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + sound.duration);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + sound.duration);
    } catch (error) {
      console.warn('Sound playback failed:', error);
    }
  }
}

const soundManager = new SoundManager();

// 5. ANIMATIONS - Advanced animation system
class AnimationManager {
  constructor() {
    this.animations = new Map();
  }

  // Scale animation with bounce effect
  bounce(element, scale = 1.1, duration = 300) {
    if (!element) return;

    element.style.transition = `transform ${duration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`;
    element.style.transform = `scale(${scale})`;
    
    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, duration / 2);
  }

  // Slide in animation
  slideIn(element, direction = 'left', duration = 500) {
    if (!element) return;

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
    if (!element) return;

    const keyframes = [
      { transform: 'scale(1)', opacity: 1 },
      { transform: 'scale(1.05)', opacity: 0.8 },
      { transform: 'scale(1)', opacity: 1 }
    ];

    element.animate(keyframes, {
      duration: duration,
      iterations: Infinity,
      easing: 'ease-in-out'
    });
  }

  // Rotate animation
  rotate(element, degrees = 360, duration = 1000) {
    if (!element) return;

    element.style.transition = `transform ${duration}ms ease-in-out`;
    element.style.transform = `rotate(${degrees}deg)`;
    
    setTimeout(() => {
      element.style.transform = 'rotate(0deg)';
    }, duration);
  }

  // Shake animation
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

    element.animate(keyframes, {
      duration: duration,
      iterations: 1,
      easing: 'ease-in-out'
    });
  }
}

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

  // Animate kick
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
  const cartCountElement = document.getElementById('cartCount');
  if (cartCountElement) {
    cartCountElement.textContent = productManager.cart.length;
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize sound manager
  soundManager.init();
  
  // Add event listeners for enhanced interactions
  setupEnhancedInteractions();
  
  // Display initial product stats
  displayProductStats();
});

function setupEnhancedInteractions() {
  // Enhanced button interactions with sound and animation
  const buttons = document.querySelectorAll('.btn, button');
  buttons.forEach(button => {
    button.addEventListener('click', (e) => {
      soundManager.playSound('click');
      animationManager.bounce(button, 1.05, 200);
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
}

function displayProductStats() {
  const stats = advancedFeatures.getProductStats();
  console.log('Product Statistics:', stats);
  
  // You can display these stats on the page if needed
  const statsElement = document.createElement('div');
  statsElement.innerHTML = `
    <div class="stats-container" style="
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: white;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      font-size: 12px;
      z-index: 999;
      max-width: 200px;
    ">
      <h6 style="margin: 0 0 10px 0; color: #dc3545;">Store Stats</h6>
      <p style="margin: 2px 0;">Products: ${stats.totalProducts}</p>
      <p style="margin: 2px 0;">Avg Price: ${Math.round(stats.averagePrice)} ₸</p>
      <p style="margin: 2px 0;">Categories: ${Object.keys(stats.categories).length}</p>
    </div>
  `;
  
  document.body.appendChild(statsElement);
  
  // Add animation to stats panel
  animationManager.slideIn(statsElement, 'left', 600);
}

// Export for use in other modules
window.AdvancedFeatures = {
  ProductManager: productManager,
  SoundManager: soundManager,
  AnimationManager: animationManager,
  showNotification,
  updateCartCount
};
