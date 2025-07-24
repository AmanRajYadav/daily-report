class LazyAssetLoader {
  constructor() {
    this.imageObserver = null;
    this.soundQueue = [];
    this.loadedAssets = new Map();
    this.fallbackAssets = new Map();
    this.init();
  }

  init() {
    this.setupImageLazyLoading();
    this.setupSoundPreloading();
    this.setupIntersectionObserver();
    this.setupErrorHandling();
  }

  setupImageLazyLoading() {
    // Intersection Observer for images
    const imageOptions = {
      root: null,
      rootMargin: '50px 0px',
      threshold: 0.01
    };

    this.imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          this.loadImage(img);
          this.imageObserver.unobserve(img);
        }
      });
    }, imageOptions);

    // Observe all images with data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
      this.imageObserver.observe(img);
    });
  }

  async loadImage(img) {
    const src = img.dataset.src;
    const fallback = img.dataset.fallback;
    
    try {
      // Create a new image to test loading
      const testImage = new Image();
      testImage.onload = () => {
        img.src = src;
        img.classList.add('loaded');
        this.loadedAssets.set(src, true);
      };
      testImage.onerror = () => {
        this.handleImageError(img, fallback);
      };
      testImage.src = src;
    } catch (error) {
      this.handleImageError(img, fallback);
    }
  }

  handleImageError(img, fallback) {
    if (fallback) {
      img.src = fallback;
    } else {
      // Generate SVG placeholder
      img.src = this.generatePlaceholderSVG(img.dataset.type || 'general');
    }
    img.classList.add('fallback');
  }

  generatePlaceholderSVG(type) {
    const colors = {
      math: '#9333ea',
      science: '#3b82f6',
      english: '#ec4899',
      history: '#f59e0b',
      general: '#6b7280'
    };

    const emojis = {
      math: '🧮',
      science: '🔬',
      english: '📚',
      history: '🏛️',
      general: '🦊'
    };

    const color = colors[type] || colors.general;
    const emoji = emojis[type] || emojis.general;

    return `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
        <rect width="200" height="200" fill="${color}" rx="15"/>
        <circle cx="100" cy="80" r="25" fill="white" opacity="0.9"/>
        <text x="100" y="90" text-anchor="middle" font-size="24">${emoji}</text>
        <text x="100" y="130" text-anchor="middle" font-family="Arial" font-size="12" fill="white" opacity="0.8">${type.toUpperCase()}</text>
        <text x="100" y="150" text-anchor="middle" font-family="Arial" font-size="10" fill="white" opacity="0.6">Loading...</text>
      </svg>
    `)}`;
  }

  setupSoundPreloading() {
    // Preload critical sounds after page load
    const criticalSounds = [
      '/assets/sounds/effects/correct.mp3',
      '/assets/sounds/effects/incorrect.mp3',
      '/assets/sounds/effects/click.mp3'
    ];

    // Start preloading after 2 seconds to not block initial render
    setTimeout(() => {
      criticalSounds.forEach(soundUrl => {
        this.preloadSound(soundUrl);
      });
    }, 2000);
  }

  async preloadSound(url) {
    try {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.volume = 0.1; // Low volume for preload
      
      await new Promise((resolve, reject) => {
        audio.addEventListener('canplaythrough', resolve);
        audio.addEventListener('error', reject);
        audio.src = url;
      });
      
      this.soundQueue.push({ url, audio });
      console.log(`🔊 Preloaded sound: ${url}`);
    } catch (error) {
      console.log(`❌ Failed to preload sound: ${url}`);
    }
  }

  setupIntersectionObserver() {
    // Observer for sprites and creatures
    const spriteOptions = {
      root: null,
      rootMargin: '100px 0px',
      threshold: 0.1
    };

    const spriteObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const creature = element.dataset.creature;
          
          if (creature) {
            this.loadCreatureSprite(creature);
          }
          
          spriteObserver.unobserve(element);
        }
      });
    }, spriteOptions);

    // Observe all elements with creature data
    document.querySelectorAll('[data-creature]').forEach(el => {
      spriteObserver.observe(el);
    });
  }

  async loadCreatureSprite(creatureName) {
    const spriteUrl = `../assets/sprites/creatures/${creatureName}.svg`;
    
    try {
      const response = await fetch(spriteUrl);
      if (response.ok) {
        const svgText = await response.text();
        this.cacheSprite(creatureName, svgText);
        console.log(`🦊 Loaded creature sprite: ${creatureName}`);
      } else {
        throw new Error(`Sprite not found: ${spriteUrl}`);
      }
    } catch (error) {
      console.log(`Using procedural generation for: ${creatureName}`);
      this.generateCreatureFallback(creatureName);
    }
  }

  cacheSprite(name, svgContent) {
    this.loadedAssets.set(`sprite-${name}`, svgContent);
    
    // Insert into any waiting containers
    document.querySelectorAll(`[data-creature="${name}"]`).forEach(container => {
      if (!container.innerHTML.trim()) {
        container.innerHTML = svgContent;
        container.classList.add('sprite-loaded');
      }
    });
  }

  generateCreatureFallback(creatureName) {
    const fallbackSVG = this.generatePlaceholderSVG(creatureName);
    const container = document.querySelector(`[data-creature="${creatureName}"]`);
    
    if (container) {
      const img = document.createElement('img');
      img.src = fallbackSVG;
      img.alt = `${creatureName} mascot`;
      container.appendChild(img);
      container.classList.add('creature-fallback');
    }
  }

  setupErrorHandling() {
    // Global error handler for failed asset loads
    window.addEventListener('error', (event) => {
      if (event.target.tagName === 'IMG') {
        this.handleImageError(event.target, event.target.dataset.fallback);
      }
    }, true);
  }

  // Public methods for manual loading
  async loadAsset(url, type = 'image') {
    if (this.loadedAssets.has(url)) {
      return this.loadedAssets.get(url);
    }

    try {
      const response = await fetch(url);
      if (response.ok) {
        const content = type === 'text' ? await response.text() : response;
        this.loadedAssets.set(url, content);
        return content;
      }
    } catch (error) {
      console.error(`Failed to load asset: ${url}`, error);
      return this.createFallback(type);
    }
  }

  createFallback(type) {
    switch (type) {
      case 'sprite':
        return this.generatePlaceholderSVG('general');
      case 'sound':
        return null; // Silent fallback
      default:
        return this.generatePlaceholderSVG('general');
    }
  }
} 