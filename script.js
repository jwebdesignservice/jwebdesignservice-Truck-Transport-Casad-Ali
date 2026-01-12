/**
 * Eastside Transport Consultancy
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initScrollHeader();
    initScrollAnimations();
    initFAQ();
    initContactForm();
    initSmoothScroll();
    initReviewsSlider();
});

/**
 * Navigation Toggle (Mobile)
 */
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    
    if (!navToggle || !navMenu) return;
    
    // Toggle mobile menu
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Update active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveLink() {
        const scrollY = window.scrollY;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
            
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();
}

/**
 * Header Scroll Effect
 */
function initScrollHeader() {
    const header = document.getElementById('header');
    if (!header) return;
    
    let lastScroll = 0;
    
    function handleScroll() {
        const currentScroll = window.scrollY;
        
        // Add scrolled class for background
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
}

/**
 * Scroll Animations (Intersection Observer)
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    if (!animatedElements.length) return;
    
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, parseInt(delay));
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * FAQ Accordion
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq__item');
    
    if (!faqItems.length) return;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq__question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active', !isActive);
            question.setAttribute('aria-expanded', !isActive);
        });
        
        // Keyboard navigation
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
    });
}

/**
 * Contact Form Handler
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const successMessage = document.getElementById('form-success');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Basic validation
        if (!data.firstName || !data.lastName || !data.email || !data.service || !data.message) {
            showFormError('Please fill in all required fields.');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showFormError('Please enter a valid email address.');
            return;
        }
        
        // Check consent
        if (!data.consent) {
            showFormError('Please accept the privacy policy to continue.');
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        try {
            await simulateFormSubmission(data);
            
            // Show success message
            form.classList.add('submitted');
            successMessage.classList.add('show');
            
            // Reset form
            form.reset();
            
            // Track form submission (if analytics is set up)
            if (typeof gtag === 'function') {
                gtag('event', 'form_submission', {
                    'event_category': 'Contact',
                    'event_label': data.service
                });
            }
            
        } catch (error) {
            showFormError('Something went wrong. Please try again or contact us directly.');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
    
    // Reset form when clicking outside success message
    document.addEventListener('click', (e) => {
        if (form.classList.contains('submitted') && !form.contains(e.target)) {
            resetForm();
        }
    });
    
    function showFormError(message) {
        // Create or update error element
        let errorEl = form.querySelector('.form__error');
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.className = 'form__error';
            errorEl.style.cssText = `
                background: #fee2e2;
                color: #dc2626;
                padding: 1rem;
                border-radius: 8px;
                margin-bottom: 1rem;
                font-size: 0.9375rem;
            `;
            form.insertBefore(errorEl, form.firstChild);
        }
        errorEl.textContent = message;
        
        // Remove error after 5 seconds
        setTimeout(() => {
            errorEl.remove();
        }, 5000);
    }
    
    function resetForm() {
        form.classList.remove('submitted');
        successMessage.classList.remove('show');
    }
    
    function simulateFormSubmission(data) {
        return new Promise((resolve) => {
            // Simulate network delay
            setTimeout(() => {
                console.log('Form submitted:', data);
                resolve();
            }, 1500);
        });
    }
}

/**
 * Reviews Slider
 */
function initReviewsSlider() {
    const track = document.getElementById('reviews-track');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    const dotsContainer = document.getElementById('slider-dots');
    
    if (!track || !prevBtn || !nextBtn) return;
    
    const cards = Array.from(track.querySelectorAll('.review-card'));
    let currentIndex = 0;
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    
    // Get card width based on screen size
    function getCardWidth() {
        const screenWidth = window.innerWidth;
        if (screenWidth <= 480) {
            return 260 + 24; // Small mobile: card width + gap
        } else if (screenWidth <= 768) {
            return 280 + 24; // Mobile: card width + gap
        } else if (screenWidth <= 1024) {
            return 350 + 24; // Tablet: card width + gap
        } else {
            return 380 + 24; // Desktop: card width + gap
        }
    }
    
    // Calculate how many cards to show
    function getVisibleCards() {
        const screenWidth = window.innerWidth;
        if (screenWidth <= 768) {
            return 1; // Mobile: scroll one card at a time
        } else if (screenWidth <= 1024) {
            return 1; // Tablet: scroll one card at a time
        } else {
            return 2; // Desktop: scroll two cards at a time
        }
    }
    
    function getTotalSlides() {
        return cards.length;
    }
    
    // Create dots (one per card for mobile/tablet, one per scroll position for desktop)
    function createDots() {
        dotsContainer.innerHTML = '';
        const totalSlides = getTotalSlides();
        const visibleCards = getVisibleCards();
        
        // On desktop (scrolling 2 at a time), create dots for each scroll position
        const numDots = visibleCards === 2 ? Math.ceil(totalSlides / 2) : totalSlides;
        
        for (let i = 0; i < numDots; i++) {
            const dot = document.createElement('button');
            dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            // For desktop, multiply by visibleCards to jump to correct position
            const slideIndex = visibleCards === 2 ? i * 2 : i;
            dot.addEventListener('click', () => goToSlide(slideIndex));
            dotsContainer.appendChild(dot);
        }
    }
    
    function updateSlider(smooth = true) {
        const cardWidth = getCardWidth();
        const offset = currentIndex * cardWidth;
        
        track.style.transition = smooth ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
        track.style.transform = `translateX(-${offset}px)`;
        
        // Update dots
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        const visibleCards = getVisibleCards();
        
        dots.forEach((dot, i) => {
            // For desktop (scrolling 2 at a time), activate dot based on position / 2
            const activeDotIndex = visibleCards === 2 ? Math.floor(currentIndex / 2) : currentIndex;
            dot.classList.toggle('active', i === activeDotIndex);
        });
        
        // Update button states
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === cards.length - 1;
    }
    
    function goToSlide(index) {
        const totalSlides = getTotalSlides();
        currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
        updateSlider();
    }
    
    function nextSlide() {
        const visibleCards = getVisibleCards();
        const maxIndex = cards.length - 1;
        
        if (currentIndex < maxIndex) {
            currentIndex = Math.min(currentIndex + visibleCards, maxIndex);
            updateSlider();
        }
    }
    
    function prevSlide() {
        const visibleCards = getVisibleCards();
        
        if (currentIndex > 0) {
            currentIndex = Math.max(currentIndex - visibleCards, 0);
            updateSlider();
        }
    }
    
    // Button events
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.target.closest('.reviews-slider')) {
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
        }
    });
    
    // Touch/Mouse drag
    track.addEventListener('mousedown', startDrag);
    track.addEventListener('touchstart', startDrag, { passive: true });
    
    track.addEventListener('mousemove', drag);
    track.addEventListener('touchmove', drag, { passive: false });
    
    track.addEventListener('mouseup', endDrag);
    track.addEventListener('mouseleave', endDrag);
    track.addEventListener('touchend', endDrag);
    
    function startDrag(e) {
        isDragging = true;
        startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        prevTranslate = currentIndex * getCardWidth();
        track.style.cursor = 'grabbing';
    }
    
    function drag(e) {
        if (!isDragging) return;
        
        const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        const diff = currentX - startX;
        currentTranslate = prevTranslate - diff;
        
        track.style.transition = 'none';
        track.style.transform = `translateX(-${currentTranslate}px)`;
    }
    
    function endDrag(e) {
        if (!isDragging) return;
        
        isDragging = false;
        track.style.cursor = 'grab';
        
        const currentX = e.type.includes('mouse') ? e.pageX : e.changedTouches[0].clientX;
        const diff = currentX - startX;
        const cardWidth = getCardWidth();
        
        // Determine if we should move to next/prev slide
        if (Math.abs(diff) > cardWidth / 4) {
            if (diff > 0 && currentIndex > 0) {
                prevSlide();
            } else if (diff < 0 && currentIndex < cards.length - 1) {
                nextSlide();
            } else {
                updateSlider();
            }
        } else {
            updateSlider();
        }
    }
    
    // Handle resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            createDots();
            updateSlider(false);
        }, 250);
    });
    
    // Initialize
    createDots();
    updateSlider(false);
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = document.getElementById('header')?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Utility: Throttle function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Utility: Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/**
 * Performance: Lazy load images when they come into view
 */
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if (!lazyImages.length) return;
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

/**
 * Accessibility: Handle reduced motion preferences
 */
function checkReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        // Disable animations
        document.documentElement.style.setProperty('--transition-fast', '0s');
        document.documentElement.style.setProperty('--transition-base', '0s');
        document.documentElement.style.setProperty('--transition-slow', '0s');
        
        // Add class for CSS targeting
        document.body.classList.add('reduced-motion');
    }
}

// Run reduced motion check
checkReducedMotion();

/**
 * Console branding
 */
console.log(
    '%c Eastside Transport Consultancy ',
    'background: #152644; color: #01cbde; padding: 10px 20px; font-size: 14px; font-weight: bold;'
);
console.log(
    '%c Built with care for UK transport operators ',
    'color: #64748b; font-size: 12px;'
);
