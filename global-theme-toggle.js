// Global Theme Toggle Script
// This script can be included on any page to add theme toggle functionality

document.addEventListener('DOMContentLoaded', function() {
    // Find theme toggle button (can be anywhere on the page)
    const themeToggleBtn = document.getElementById('global-theme-toggle');
    
    if (!themeToggleBtn) {
        console.log('Theme toggle button not found');
        return;
    }
    
    const icon = themeToggleBtn.querySelector('i');
    
    // Update button state based on current theme
    function updateButtonState() {
        const isDark = document.documentElement.classList.contains('dark-theme') || 
                      document.body.classList.contains('dark-theme');
        
        if (isDark) {
            icon.className = 'fas fa-sun';
            themeToggleBtn.title = 'Switch to Light Mode';
        } else {
            icon.className = 'fas fa-moon';
            themeToggleBtn.title = 'Switch to Dark Mode';
        }
    }
    
    // Initialize button state
    updateButtonState();
    
    // Theme toggle functionality
    themeToggleBtn.addEventListener('click', function() {
        const root = document.documentElement;
        const body = document.body;
        const isDark = root.classList.contains('dark-theme') || body.classList.contains('dark-theme');
        const newTheme = isDark ? 'light' : 'dark';
        
        // Apply theme to both html and body
        if (newTheme === 'dark') {
            root.classList.add('dark-theme');
            if (body) body.classList.add('dark-theme');
        } else {
            root.classList.remove('dark-theme');
            if (body) body.classList.remove('dark-theme');
        }
        
        // Save to localStorage
        localStorage.setItem('theme', newTheme);
        
        // Update button state
        updateButtonState();
        
        // Show notification if available
        if (window.showNotification) {
            window.showNotification(
                `Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 
                'success'
            );
        } else {
            // Fallback notification
            console.log(`Theme switched to ${newTheme} mode`);
        }
    });
});

// Export function for manual theme switching
window.switchTheme = function(theme) {
    const root = document.documentElement;
    const body = document.body;
    
    if (theme === 'dark') {
        root.classList.add('dark-theme');
        if (body) body.classList.add('dark-theme');
    } else {
        root.classList.remove('dark-theme');
        if (body) body.classList.remove('dark-theme');
    }
    
    localStorage.setItem('theme', theme);
    
    // Update all theme toggle buttons on the page
    const themeButtons = document.querySelectorAll('#global-theme-toggle');
    themeButtons.forEach(btn => {
        const icon = btn.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            btn.title = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
        }
    });
};
