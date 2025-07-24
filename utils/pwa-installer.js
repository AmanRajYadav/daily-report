class PWAInstaller {
  constructor() {
    this.deferredPrompt = null;
    this.isInstalled = false;
    this.init();
  }

  init() {
    this.checkInstallation();
    this.setupInstallPrompt();
    this.setupInstallButton();
    this.trackInstallation();
  }

  checkInstallation() {
    // Check if app is already installed
    this.isInstalled = window.navigator.standalone || 
                      window.matchMedia('(display-mode: standalone)').matches;
    
    if (this.isInstalled) {
      console.log('✅ PWA is installed');
      this.hideInstallPrompt();
    }
  }

  setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      
      // Stash the event so it can be triggered later
      this.deferredPrompt = e;
      
      // Show install button after a delay
      setTimeout(() => {
        this.showInstallPrompt();
      }, 10000); // Show after 10 seconds
    });
  }

  setupInstallButton() {
    // Create install button if it doesn't exist
    let installButton = document.getElementById('install-button');
    
    if (!installButton) {
      installButton = document.createElement('button');
      installButton.id = 'install-button';
      installButton.className = 'install-button hidden';
      installButton.innerHTML = '📱 Install Fluence App';
      installButton.addEventListener('click', () => this.installApp());
      
      // Add to a suitable container or body
      const container = document.querySelector('.install-container') || document.body;
      container.appendChild(installButton);
    }
  }

  showInstallPrompt() {
    if (!this.isInstalled && this.deferredPrompt) {
      const installButton = document.getElementById('install-button');
      if (installButton) {
        installButton.classList.remove('hidden');
        
        // Add some attractive styling
        installButton.style.cssText = `
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 25px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          z-index: 1000;
          animation: slideIn 0.5s ease-out;
        `;
      }
    }
  }

  hideInstallPrompt() {
    const installButton = document.getElementById('install-button');
    if (installButton) {
      installButton.classList.add('hidden');
    }
  }

  async installApp() {
    if (!this.deferredPrompt) {
      console.log('Install prompt not available');
      return;
    }

    // Show the install prompt
    this.deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await this.deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('✅ User accepted the install prompt');
      this.trackEvent('pwa_install_accepted');
    } else {
      console.log('❌ User dismissed the install prompt');
      this.trackEvent('pwa_install_dismissed');
    }

    // Clear the deferredPrompt
    this.deferredPrompt = null;
    this.hideInstallPrompt();
  }

  trackInstallation() {
    window.addEventListener('appinstalled', () => {
      console.log('✅ PWA was installed successfully');
      this.isInstalled = true;
      this.hideInstallPrompt();
      this.trackEvent('pwa_installed');
      
      // Show welcome message
      this.showWelcomeMessage();
    });
  }

  showWelcomeMessage() {
    // Create a temporary welcome notification
    const welcome = document.createElement('div');
    welcome.className = 'pwa-welcome';
    welcome.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #10b981;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1001;
        animation: fadeInOut 4s ease-in-out;
      ">
        🎉 Fluence App installed! You can now use it offline.
      </div>
    `;
    
    document.body.appendChild(welcome);
    
    // Remove after animation
    setTimeout(() => {
      if (welcome.parentNode) {
        welcome.parentNode.removeChild(welcome);
      }
    }, 4000);
  }

  trackEvent(eventName, properties = {}) {
    // Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'PWA',
        ...properties
      });
    }
    
    // Console log for development
    console.log(`📊 PWA Event: ${eventName}`, properties);
  }
} 