class FluenceApp {
  constructor() {
    this.lazyLoader = null;
    this.pwaInstaller = null;
    this.performanceMonitor = null;
    this.offlineManager = null;
    this.init();
  }

  async init() {
    console.log('🚀 Initializing Fluence Learning App...');
    
    // Initialize core systems
    this.registerServiceWorker();
    this.initializeSystems();
    this.setupGlobalErrorHandling();
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
    } else {
      this.onDOMReady();
    }
  }

  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js', {
          scope: '/'
        });
        
        console.log('✅ Service Worker registered:', registration.scope);
        
        // Handle updates
        registration.addEventListener('updatefound', () => {
          console.log('🔄 Service Worker update found');
        });
        
      } catch (error) {
        console.error('❌ Service Worker registration failed:', error);
      }
    }
  }

  initializeSystems() {
    // Initialize performance monitoring first
    this.performanceMonitor = new PerformanceMonitor();
    
    // Initialize offline management
    this.offlineManager = new OfflineManager();
    
    // Initialize PWA installer
    this.pwaInstaller = new PWAInstaller();
    
    console.log('✅ Core systems initialized');
  }

  onDOMReady() {
    // Initialize lazy loading after DOM is ready
    this.lazyLoader = new LazyAssetLoader();
    
    // Add CSS animations
    this.addAnimationStyles();
    
    console.log('✅ Fluence App fully initialized');
  }

  addAnimationStyles() {
    const styles = document.createElement('style');
    styles.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      
      @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        20%, 80% { opacity: 1; transform: translateX(-50%) translateY(0); }
      }
      
      .loaded {
        opacity: 1;
        transition: opacity 0.3s ease-in;
      }
      
      .fallback {
        opacity: 0.8;
        filter: grayscale(20%);
      }
      
      .hidden {
        display: none !important;
      }
      
      .sprite-loaded {
        animation: fadeIn 0.5s ease-in;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `;
    
    document.head.appendChild(styles);
  }

  setupGlobalErrorHandling() {
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      
      // Track critical errors
      if (this.performanceMonitor) {
        this.performanceMonitor.trackEvent('global_error', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno
        });
      }
    });

    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      // Track promise rejections
      if (this.performanceMonitor) {
        this.performanceMonitor.trackEvent('unhandled_rejection', {
          reason: event.reason?.toString()
        });
      }
    });
  }
}

// Auto-initialize when script loads
const fluenceApp = new FluenceApp();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    LazyAssetLoader,
    PWAInstaller,
    PerformanceMonitor,
    OfflineManager,
    FluenceApp
  };
} 