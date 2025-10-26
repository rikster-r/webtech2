// stats.js - Animated number counter implementation
$(document).ready(function() {
    // Start counting when element comes into view
    const startCounting = (element) => {
        const $counter = $(element);
        const target = parseFloat($counter.data('target'));
        const isDecimal = $counter.data('decimal') === true;
        const duration = 2000; // 2 seconds animation
        const steps = 50; // number of steps in animation
        const stepDuration = duration / steps;
        
        let current = 0;
        const increment = target / steps;
        
        const counter = setInterval(() => {
            current += increment;
            // Don't exceed the target
            if (current > target) {
                current = target;
                clearInterval(counter);
            }
            
            // Format number based on whether it's decimal or not
            const displayValue = isDecimal ? 
                current.toFixed(1) : 
                Math.floor(current).toLocaleString();
            
            $counter.text(displayValue);
            
            if (current >= target) {
                clearInterval(counter);
                // Add plus sign if it's a whole number above 100
                if (!isDecimal && target >= 100) {
                    $counter.text(displayValue + '+');
                }
            }
        }, stepDuration);
    };

    // Use Intersection Observer to start counter when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounting(entry.target);
                // Only run animation once
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    // Observe all counter elements
    $('.counter').each(function() {
        observer.observe(this);
    });
});