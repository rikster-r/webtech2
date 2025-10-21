// DOM Manipulation and Styling Features
// This file implements multiple DOM manipulation features as requested

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initThemeToggle();
    initRatingStars();
    initDynamicGreeting();
    initReadMoreButton();
    initImageGallery();
    initRandomContentFetcher();
    
    // Add fade-in animation to all sections
    addFadeInAnimations();
});

// 1. Theme Toggle (now handled by global script)
function initThemeToggle() {
    // Theme toggle is now handled by global-theme-toggle.js
    // This function is kept for compatibility but does nothing
    console.log('Theme toggle handled by global script');
}

// 2. Interactive Rating Stars
function initRatingStars() {
    const stars = document.querySelectorAll('.star');
    const ratingText = document.getElementById('rating-text');
    let currentRating = 0;
    
    stars.forEach((star, index) => {
        // Mouse enter event
        star.addEventListener('mouseenter', function() {
            highlightStars(index + 1);
        });
        
        // Mouse leave event
        star.addEventListener('mouseleave', function() {
            highlightStars(currentRating);
        });
        
        // Click event
        star.addEventListener('click', function() {
            currentRating = index + 1;
            highlightStars(currentRating);
            updateRatingText(currentRating);
            
            // Add animation effect
            star.style.transform = 'scale(1.3)';
            setTimeout(() => {
                star.style.transform = 'scale(1)';
            }, 200);
        });
    });
    
    function highlightStars(rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }
    
    function updateRatingText(rating) {
        const messages = [
            'Thanks for rating!',
            'We appreciate your feedback!',
            'Great! Thanks for the rating!',
            'Excellent! We\'re glad you like us!',
            'Outstanding! Thank you so much!'
        ];
        
        ratingText.textContent = messages[rating - 1];
        ratingText.style.color = '#28a745';
        
        // Reset color after 3 seconds
        setTimeout(() => {
            ratingText.style.color = '';
        }, 3000);
    }
}

// 3. Dynamic Greeting with User Input
function initDynamicGreeting() {
    const nameInput = document.getElementById('name-input');
    const updateBtn = document.getElementById('update-greeting-btn');
    const greetingElement = document.getElementById('dynamic-greeting');
    
    // Load saved name if exists
    const savedName = localStorage.getItem('userName');
    if (savedName) {
        nameInput.value = savedName;
        updateGreeting(savedName);
    }
    
    updateBtn.addEventListener('click', function() {
        const name = nameInput.value.trim();
        if (name) {
            updateGreeting(name);
            localStorage.setItem('userName', name);
            nameInput.value = '';
        } else {
            alert('Please enter your name!');
        }
    });
    
    // Allow Enter key to submit
    nameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            updateBtn.click();
        }
    });
    
    function updateGreeting(name) {
        const greetings = [
            `Hello ${name}! Welcome to Egoisty!`,
            `Hi there ${name}! Great to see you!`,
            `Welcome back ${name}! Ready to shop?`,
            `Hey ${name}! What can we help you find today?`
        ];
        
        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
        
        // Add animation
        greetingElement.style.opacity = '0';
        greetingElement.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            greetingElement.textContent = randomGreeting;
            greetingElement.style.opacity = '1';
            greetingElement.style.transform = 'translateY(0)';
            greetingElement.style.transition = 'all 0.5s ease';
        }, 250);
    }
}

// 4. Read More Button Functionality
function initReadMoreButton() {
    const readMoreBtn = document.getElementById('read-more-btn');
    const additionalContent = document.getElementById('additional-content');
    let isExpanded = false;
    
    readMoreBtn.addEventListener('click', function() {
        if (isExpanded) {
            // Collapse content
            additionalContent.style.display = 'none';
            readMoreBtn.textContent = 'Read More';
            readMoreBtn.classList.remove('btn-secondary');
            readMoreBtn.classList.add('btn-info');
        } else {
            // Expand content
            additionalContent.style.display = 'block';
            readMoreBtn.textContent = 'Read Less';
            readMoreBtn.classList.remove('btn-info');
            readMoreBtn.classList.add('btn-secondary');
            
            // Add slide-in animation
            additionalContent.classList.add('slide-in');
        }
        
        isExpanded = !isExpanded;
    });
}

// 5. Image Gallery with Thumbnails
function initImageGallery() {
    const mainImage = document.getElementById('main-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(thumb => thumb.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            // Update main image
            const newSrc = this.getAttribute('data-full');
            const newAlt = this.getAttribute('alt');
            
            // Add fade effect
            mainImage.style.opacity = '0';
            
            setTimeout(() => {
                mainImage.src = newSrc;
                mainImage.alt = newAlt;
                mainImage.style.opacity = '1';
                mainImage.style.transition = 'opacity 0.3s ease';
            }, 150);
        });
        
        // Add hover effect
        thumbnail.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        thumbnail.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'scale(1)';
            }
        });
    });
}

// 6. Random Content Fetcher
function initRandomContentFetcher() {
    const fetchBtn = document.getElementById('fetch-random-btn');
    const contentText = document.getElementById('random-content-text');
    
    const funFacts = [
        "Did you know? The first online purchase was made in 1994 - a Sting CD!",
        "Fun fact: E-commerce sales reached $4.2 trillion globally in 2020!",
        "Interesting: The average person spends 2 hours and 24 minutes shopping online per week!",
        "Amazing: The first shopping cart was invented in 1937 by Sylvan Goldman!",
        "Cool fact: Black Friday got its name because it's when retailers' books went from red to black!",
        "Did you know? The most expensive item ever sold online was a yacht for $170 million!",
        "Fun fact: Online shopping carts are abandoned 70% of the time!",
        "Interesting: The first online marketplace was eBay, launched in 1995!",
        "Amazing: Mobile commerce accounts for over 50% of all e-commerce traffic!",
        "Cool fact: The term 'shopping cart' was first used in 1994 by Open Market!"
    ];
    
    fetchBtn.addEventListener('click', function() {
        // Add loading state
        const originalText = fetchBtn.textContent;
        fetchBtn.textContent = 'Loading...';
        fetchBtn.disabled = true;
        
        // Simulate API call delay
        setTimeout(() => {
            const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];
            
            // Add fade effect
            contentText.style.opacity = '0';
            
            setTimeout(() => {
                contentText.textContent = randomFact;
                contentText.style.opacity = '1';
                contentText.style.transition = 'opacity 0.5s ease';
                
                // Reset button
                fetchBtn.textContent = originalText;
                fetchBtn.disabled = false;
            }, 250);
        }, 800);
    });
}

// 7. Additional Utility Functions
function addFadeInAnimations() {
    const sections = document.querySelectorAll('.greeting-section, .rating-section, .read-more-section, .image-gallery-section, .random-content-section');
    
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            section.style.transition = 'all 0.6s ease';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// 8. Dynamic Style Changes Examples
function demonstrateDynamicStyles() {
    // Example: Change button colors dynamically
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
}

// Initialize dynamic styles
// document.addEventListener('DOMContentLoaded', demonstrateDynamicStyles);

// 9. Content Manipulation Examples
function updateElementContent() {
    // Example of updating text content dynamically
    const elements = document.querySelectorAll('h1, h2, h3');
    
    elements.forEach(element => {
        element.addEventListener('click', function() {
            const originalText = this.textContent;
            this.textContent = 'Clicked!';
            this.style.color = '#007bff';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.color = '';
            }, 1000);
        });
    });
}

// Initialize content manipulation
document.addEventListener('DOMContentLoaded', updateElementContent);

// 10. Advanced DOM Manipulation - Create Dynamic Elements
function createDynamicElements() {
    // Create a dynamic notification system
    const notificationContainer = document.createElement('div');
    notificationContainer.id = 'notification-container';
    notificationContainer.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        pointer-events: none;
    `;
    document.body.appendChild(notificationContainer);
    
    // Function to show notifications
    window.showNotification = function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            margin-bottom: 10px;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
            pointer-events: auto;
            cursor: pointer;
        `;
        notification.textContent = message;
        
        notificationContainer.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 100);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
        
        // Click to dismiss
        notification.addEventListener('click', () => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    };
}

// Initialize dynamic elements
document.addEventListener('DOMContentLoaded', createDynamicElements);

// Export functions for potential external use
window.DOMFeatures = {
    showNotification: window.showNotification,
    applyTheme: applyTheme
};
