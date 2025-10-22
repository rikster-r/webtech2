/**
 * Enhanced Welcome Page JavaScript
 * Demonstrates Arrays, Loops, Objects, and Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // Arrays and Loops demonstration
  const teamMembers = [
    { name: 'Yerkebulan Zhan',role: 'Januk_tuffHooper', color: '#dc3545' },
    { name: 'Danial Seit', role: 'loh', color: '#28a745' },
    { name: 'Tassimov Arsen',  role: 'Arystan' , color: '#007bff' },
    { name: 'Uzbekbay Abilkaiyr',  role: 'Babuka', color: '#ffc107' }
  ];

  // Create dynamic team display using forEach (Higher-Order Function)
  function createTeamDisplay() {
    const teamContainer = document.createElement('div');
    teamContainer.className = 'team-display mt-4';
    teamContainer.innerHTML = '<h4 class="text-center mb-3">Our Team</h4>';
    
    const teamRow = document.createElement('div');
    teamRow.className = 'row g-3';
    
    // Use forEach to iterate over team members array
    teamMembers.forEach((member, index) => {
      const memberCol = document.createElement('div');
      memberCol.className = 'col-md-3 col-sm-6';
      
      memberCol.innerHTML = `
        <div class="card text-center p-3 team-member-card" style="border-left: 4px solid ${member.color};">
          <div class="member-avatar" style="width: 60px; height: 60px; background: ${member.color}; border-radius: 50%; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
            ${member.name.split(' ').map(n => n[0]).join('')}
          </div>
          <h6 class="mb-1">${member.name}</h6>
          <small class="text-muted">${member.role}</small>
        </div>
      `;
      
      teamRow.appendChild(memberCol);
    });
    
    teamContainer.appendChild(teamRow);
    
    // Insert after the main content
    const mainContent = document.querySelector('.container');
    mainContent.appendChild(teamContainer);
    
    // Animate team cards using staggered animation
    const teamCards = teamContainer.querySelectorAll('.team-member-card');
    teamCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'all 0.5s ease';
      
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }

  // Enhanced button interactions with sound and animation
  function setupEnhancedButtons() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
      // Add click sound and animation
      button.addEventListener('click', (e) => {
        if (window.AdvancedFeatures) {
          window.AdvancedFeatures.SoundManager.playSound('click');
          window.AdvancedFeatures.AnimationManager.bounce(button, 1.1, 300);
        }
      });

      // Add hover effects
      button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-2px)';
        button.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        button.style.transition = 'all 0.3s ease';
        
        if (window.AdvancedFeatures) {
          window.AdvancedFeatures.SoundManager.playSound('hover');
        }
      });

      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = '';
      });
    });
  }

  // Dynamic content generation using arrays
  function createFeatureHighlights() {
    const features = [
      { icon: '🛒', title: 'Easy Shopping', description: 'Browse and buy with ease' },
      { icon: '🚚', title: 'Fast Delivery', description: 'Quick delivery across Kazakhstan' },
      { icon: '💳', title: 'Secure Payment', description: 'Safe and secure payment methods' },
      { icon: '🔄', title: 'Easy Returns', description: '14-day return policy' }
    ];

    const featuresContainer = document.createElement('div');
    featuresContainer.className = 'features-highlight mt-5';
    featuresContainer.innerHTML = '<h4 class="text-center mb-4">Why Choose Egoisty?</h4>';
    
    const featuresRow = document.createElement('div');
    featuresRow.className = 'row g-4';
    
    // Use map to transform data (Higher-Order Function)
    const featureCards = features.map((feature, index) => {
      return `
        <div class="col-md-3 col-sm-6">
          <div class="card text-center p-4 feature-card h-100" style="border: none; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div class="display-4 mb-3">${feature.icon}</div>
            <h5 class="mb-2">${feature.title}</h5>
            <p class="text-muted small">${feature.description}</p>
          </div>
        </div>
      `;
    }).join('');
    
    featuresRow.innerHTML = featureCards;
    featuresContainer.appendChild(featuresRow);
    
    // Insert before footer
    const footer = document.querySelector('footer');
    footer.parentNode.insertBefore(featuresContainer, footer);
    
    // Animate feature cards
    const featureCardsElements = featuresContainer.querySelectorAll('.feature-card');
    featureCardsElements.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'all 0.6s ease';
      
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 500 + (index * 150));
    });
  }

  // Interactive statistics using objects and arrays
  function createInteractiveStats() {
    const stats = {
      products: 150,
      customers: 2500,
      orders: 1800,
      satisfaction: 98
    };

    const statsContainer = document.createElement('div');
    statsContainer.className = 'interactive-stats mt-4 p-4 bg-light rounded';
    statsContainer.innerHTML = `
      <h5 class="text-center mb-4">Our Numbers</h5>
      <div class="row g-3">
        <div class="col-md-3 col-sm-6">
          <div class="stat-item text-center">
            <div class="stat-number" data-target="${stats.products}">0</div>
            <div class="stat-label">Products</div>
          </div>
        </div>
        <div class="col-md-3 col-sm-6">
          <div class="stat-item text-center">
            <div class="stat-number" data-target="${stats.customers}">0</div>
            <div class="stat-label">Happy Customers</div>
          </div>
        </div>
        <div class="col-md-3 col-sm-6">
          <div class="stat-item text-center">
            <div class="stat-number" data-target="${stats.orders}">0</div>
            <div class="stat-label">Orders Delivered</div>
          </div>
        </div>
        <div class="col-md-3 col-sm-6">
          <div class="stat-item text-center">
            <div class="stat-number" data-target="${stats.satisfaction}">0</div>
            <div class="stat-label">% Satisfaction</div>
          </div>
        </div>
      </div>
    `;

    // Insert before footer
    const footer = document.querySelector('footer');
    footer.parentNode.insertBefore(statsContainer, footer);

    // Animate numbers using loops
    const statNumbers = statsContainer.querySelectorAll('.stat-number');
    statNumbers.forEach(statNumber => {
      const target = parseInt(statNumber.getAttribute('data-target'));
      let current = 0;
      const increment = target / 50;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        statNumber.textContent = Math.floor(current);
      }, 30);
    });
  }

  // Initialize all features
  createTeamDisplay();
  setupEnhancedButtons();
  createFeatureHighlights();
  createInteractiveStats();

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
