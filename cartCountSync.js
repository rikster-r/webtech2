document.addEventListener('DOMContentLoaded', function() {
        function updateCartCount() {
          const cartCountElement = document.getElementById('cartCount');
          const cart = JSON.parse(localStorage.getItem('cart') || '[]');
          const totalItems = cart.reduce((total, item) => total + (item.quantity || 0), 0);
          cartCountElement.textContent = totalItems;
        }
        
        updateCartCount();
      });