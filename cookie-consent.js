// Cookie Consent Management
class CookieConsent {
    constructor() {
        this.cookieName = 'eastside_cookie_consent';
        this.cookieExpiry = 365; // days
        this.preferences = {
            necessary: true,
            analytics: false,
            marketing: false
        };
        
        this.init();
    }
    
    init() {
        // Check if user has already made a choice
        const savedPreferences = this.getCookiePreferences();
        
        if (savedPreferences) {
            this.preferences = savedPreferences;
            this.applyPreferences();
        } else {
            // Show banner after a short delay
            setTimeout(() => {
                this.showBanner();
            }, 1000);
        }
        
        this.bindEvents();
    }
    
    bindEvents() {
        // Accept all cookies
        const acceptBtn = document.getElementById('cookie-accept');
        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => this.acceptAll());
        }
        
        // Decline optional cookies
        const declineBtn = document.getElementById('cookie-decline');
        if (declineBtn) {
            declineBtn.addEventListener('click', () => this.declineOptional());
        }
        
        // Open settings modal
        const settingsBtn = document.getElementById('cookie-settings');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.openSettings());
        }
        
        // Settings link in footer
        const settingsLink = document.getElementById('cookie-settings-link');
        if (settingsLink) {
            settingsLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.openSettings();
            });
        }
        
        // Close modal
        const closeBtn = document.getElementById('cookie-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeSettings());
        }
        
        // Save custom preferences
        const saveBtn = document.getElementById('cookie-save-preferences');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveCustomPreferences());
        }
        
        // Accept all from modal
        const acceptAllBtn = document.getElementById('cookie-accept-all-modal');
        if (acceptAllBtn) {
            acceptAllBtn.addEventListener('click', () => {
                this.acceptAll();
                this.closeSettings();
            });
        }
        
        // Close modal when clicking outside
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeSettings();
                }
            });
        }
    }
    
    showBanner() {
        const banner = document.getElementById('cookie-consent');
        if (banner) {
            banner.classList.add('show');
        }
    }
    
    hideBanner() {
        const banner = document.getElementById('cookie-consent');
        if (banner) {
            banner.classList.remove('show');
        }
    }
    
    openSettings() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Update toggle states
            const analyticsToggle = document.getElementById('cookie-analytics');
            const marketingToggle = document.getElementById('cookie-marketing');
            
            if (analyticsToggle) analyticsToggle.checked = this.preferences.analytics;
            if (marketingToggle) marketingToggle.checked = this.preferences.marketing;
        }
    }
    
    closeSettings() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }
    
    acceptAll() {
        this.preferences = {
            necessary: true,
            analytics: true,
            marketing: true
        };
        
        this.savePreferences();
        this.applyPreferences();
        this.hideBanner();
    }
    
    declineOptional() {
        this.preferences = {
            necessary: true,
            analytics: false,
            marketing: false
        };
        
        this.savePreferences();
        this.applyPreferences();
        this.hideBanner();
    }
    
    saveCustomPreferences() {
        const analyticsToggle = document.getElementById('cookie-analytics');
        const marketingToggle = document.getElementById('cookie-marketing');
        
        this.preferences = {
            necessary: true,
            analytics: analyticsToggle ? analyticsToggle.checked : false,
            marketing: marketingToggle ? marketingToggle.checked : false
        };
        
        this.savePreferences();
        this.applyPreferences();
        this.closeSettings();
        this.hideBanner();
    }
    
    savePreferences() {
        const data = JSON.stringify(this.preferences);
        const expires = new Date();
        expires.setDate(expires.getDate() + this.cookieExpiry);
        
        document.cookie = `${this.cookieName}=${data}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    }
    
    getCookiePreferences() {
        const name = this.cookieName + '=';
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieArray = decodedCookie.split(';');
        
        for (let cookie of cookieArray) {
            cookie = cookie.trim();
            if (cookie.indexOf(name) === 0) {
                try {
                    return JSON.parse(cookie.substring(name.length));
                } catch (e) {
                    return null;
                }
            }
        }
        return null;
    }
    
    applyPreferences() {
        // Load Google Analytics if analytics cookies are accepted
        if (this.preferences.analytics) {
            this.loadGoogleAnalytics();
        }
        
        // Load marketing scripts if marketing cookies are accepted
        if (this.preferences.marketing) {
            this.loadMarketingScripts();
        }
        
        console.log('Cookie preferences applied:', this.preferences);
    }
    
    loadGoogleAnalytics() {
        // Check if GA is already loaded
        if (window.gtag) {
            return;
        }
        
        // Replace 'G-XXXXXXXXXX' with your actual Google Analytics Measurement ID
        const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // TODO: Replace with your GA4 Measurement ID
        
        // Load GA script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
        document.head.appendChild(script);
        
        // Initialize GA
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', GA_MEASUREMENT_ID, {
            'anonymize_ip': true,
            'cookie_flags': 'SameSite=Lax;Secure'
        });
        
        window.gtag = gtag;
        
        console.log('Google Analytics loaded');
    }
    
    loadMarketingScripts() {
        // Add any marketing tracking scripts here
        // Example: Facebook Pixel, LinkedIn Insight Tag, etc.
        console.log('Marketing scripts loaded');
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new CookieConsent();
    });
} else {
    new CookieConsent();
}
