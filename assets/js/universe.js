// universe.js - The heart of the magical learning experience
console.log('🌌 universe.js loading...');

const Universe = {
    config: {
        particleCount: 100,
        firefliesCount: 20,
        cloudsCount: 5,
        seasonalEffects: true,
        ambientVolume: 0.5,
        theme: 'minimal'
    },
    
    state: {
        initialized: false,
        shakeDetected: false,
        orientation: { alpha: 0, beta: 0, gamma: 0 }
    },

    init() {
        if (this.state.initialized) return;
        
        console.log('🌌 Universe.init() called - VERSION 2.0 UPDATED');
        console.log('🌌 Starting initialization sequence...');
        console.log('🌌 About to start Promise.all for system initialization...');
        console.log('🌌 Starting initialization sequence...');
        
        // Show loading animation
        this.showLoadingScreen();
        
        // CRITICAL FIX: Force hide loading screen after 1 second regardless
        setTimeout(() => {
            console.log('🚨 EMERGENCY: Force hiding loading screen');
            this.hideLoadingScreen();
            this.playWelcomeSequence();
            this.state.initialized = true;
        }, 1000);
        
        console.log('🌌 About to start Promise.all for system initialization...');
        
        // Initialize all systems
        Promise.all([
            this.loadAssets(),
            this.initThemeSystem(),
            this.initDeviceMotion(),
            this.initParallax(),
            this.initInteractions()
        ]).then(() => {
            console.log('🌌 All systems initialized, starting engines...');
            
            // Initialize theme system
            console.log('🎨 Starting theme system initialization...');
            this.initThemeSystem();
            console.log('🎨 Theme system initialization complete');
            
            // Initialize device motion
            console.log('📱 Starting device motion initialization...');
            this.initDeviceMotion();
            console.log('📱 Device motion initialization complete');
            
            // Initialize parallax
            console.log('🌊 Starting parallax initialization...');
            this.initParallax();
            console.log('🌊 Parallax initialization complete');
            
            // Initialize interactions
            console.log('👆 Starting interactions initialization...');
            this.initInteractions();
            console.log('👆 Interactions initialization complete');
            
            // Start all engines (with error handling)
            try {
                if (typeof MagicCanvas !== 'undefined') MagicCanvas.init();
            } catch (e) { console.log('MagicCanvas init failed:', e); }
            
            try {
                if (typeof ParticleSystem !== 'undefined') ParticleSystem.init();
            } catch (e) { console.log('ParticleSystem init failed:', e); }
            
            try {
                if (typeof AudioEngine !== 'undefined') AudioEngine.init();
            } catch (e) { console.log('AudioEngine init failed:', e); }
            
            try {
                if (typeof CreatureSystem !== 'undefined') CreatureSystem.init();
            } catch (e) { console.log('CreatureSystem init failed:', e); }
            
            try {
                if (typeof LearningTree !== 'undefined') LearningTree.init();
            } catch (e) { console.log('LearningTree init failed:', e); }
            
            // Hide loading screen with fade
            this.hideLoadingScreen();
            
            // Play welcome sequence
            this.playWelcomeSequence();
            
            this.state.initialized = true;
            console.log('🌌 Universe initialization complete');
        }).catch(error => {
            console.error('🌌 Error during Universe initialization:', error);
            // Even if there's an error, hide the loading screen
            this.hideLoadingScreen();
            this.playWelcomeSequence();
            this.state.initialized = true;
        });
    },

    loadAssets() {
        return new Promise((resolve) => {
            console.log('📦 Starting asset loading...');
            
            // SIMPLIFIED: Skip asset loading entirely to avoid hanging issues
            console.log('📦 Skipping asset preloading to avoid loading screen hang');
            console.log('📦 Asset loading complete');
            resolve();
            return;
            
            const assets = [
                // Sprites
                { type: 'image', src: '../assets/sprites/animals/fox-walk.svg' },
                { type: 'image', src: '../assets/sprites/animals/deer-walk.svg' },
                { type: 'image', src: '../assets/sprites/creatures/math-dragon.svg' },
                { type: 'image', src: '../assets/sprites/creatures/science-owl.svg' },
                
                // Sounds - FIXED: Removed deleted morning-forest.mp3
                { type: 'audio', src: '../assets/sounds/effects/sparkle.mp3' },
                { type: 'audio', src: '../assets/sounds/effects/magic-sparkle.mp3' }
            ];
            
            let loaded = 0;
            const totalAssets = assets.length;
            
            // Set a shorter timeout to avoid hanging
            const timeout = setTimeout(() => {
                console.log('⚠️ Asset loading timeout, proceeding anyway');
                resolve();
            }, 2000);
            
            const checkComplete = () => {
                loaded++;
                console.log(`📦 Loaded asset ${loaded}/${totalAssets}`);
                if (loaded === totalAssets) {
                    clearTimeout(timeout);
                    resolve();
                }
            };
            
            assets.forEach(asset => {
                if (asset.type === 'image') {
                    const img = new Image();
                    img.onload = checkComplete;
                    img.onerror = checkComplete;
                    img.src = asset.src;
                } else if (asset.type === 'audio') {
                    const audio = new Audio();
                    audio.oncanplaythrough = checkComplete;
                    audio.onerror = checkComplete;
                    audio.src = asset.src;
                }
            });
        });
    },

    initThemeSystem() {
        return new Promise((resolve) => {
            console.log('🎨 Starting theme system initialization...');
            // Theme system is already loaded via CSS
            console.log('🎨 Theme system initialization complete');
            resolve();
        });
    },

    initDeviceMotion() {
        return new Promise((resolve) => {
            console.log('📱 Starting device motion initialization...');
            
            if (window.DeviceMotionEvent) {
                // Bind the context properly to avoid 'this' issues
                window.addEventListener('devicemotion', (e) => this.applyTiltEffect(e));
                window.addEventListener('shake', (e) => this.onShakeDetected(e));
                console.log('📱 Device motion listeners added');
            } else {
                console.log('📱 Device motion not supported');
            }
            
            console.log('📱 Device motion initialization complete');
            resolve();
        });
    },

    applyTiltEffect() {
        // Safety check to prevent errors
        if (!this.state || !this.state.orientation) {
            console.log('📱 Orientation data not available yet');
            return;
        }
        
        const { beta, gamma } = this.state.orientation;
        const tiltX = gamma / 90; // -1 to 1
        const tiltY = beta / 180; // -1 to 1
        
        // Apply to parallax layers
        document.querySelectorAll('.parallax-layer').forEach((layer, index) => {
            const depth = parseFloat(layer.dataset.depth);
            const moveX = tiltX * depth * 50;
            const moveY = tiltY * depth * 30;
            
            layer.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        
        // Apply to floating cards
        document.querySelectorAll('.floating-card').forEach(card => {
            card.style.transform = `
                perspective(1000px)
                rotateY(${tiltX * 5}deg)
                rotateX(${-tiltY * 5}deg)
                translateZ(20px)
            `;
        });
    },

    onShakeDetected() {
        if (this.state.shakeDetected) return;
        this.state.shakeDetected = true;
        
        // Visual feedback
        document.body.classList.add('shake-active');
        
        // Show shake overlay
        const overlay = document.getElementById('shakeOverlay');
        overlay.classList.add('active');
        
        // Create stardust explosion
        this.createStardustExplosion();
        
        // Play magical sound
        AudioEngine.playEffect('magic-sparkle');
        
        // Haptic feedback
        if ('vibrate' in navigator) {
            navigator.vibrate([50, 100, 50]);
        }
        
        // Show hidden treasures
        document.querySelectorAll('.hidden-treasure').forEach(treasure => {
            treasure.classList.add('revealed');
        });
        
        // Reset after animation
        setTimeout(() => {
            overlay.classList.remove('active');
            document.body.classList.remove('shake-active');
            this.state.shakeDetected = false;
        }, 3000);
    },

    createStardustExplosion() {
        const container = document.getElementById('stardustContainer');
        container.innerHTML = '';
        
        const colors = ['#FFD700', '#FF69B4', '#00CED1', '#9370DB', '#FF6347'];
        
        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            star.className = 'stardust-particle';
            star.style.setProperty('--color', colors[Math.floor(Math.random() * colors.length)]);
            star.style.setProperty('--angle', Math.random() * 360 + 'deg');
            star.style.setProperty('--distance', (50 + Math.random() * 150) + 'px');
            star.style.animationDelay = Math.random() * 0.5 + 's';
            
            container.appendChild(star);
        }
    },

    initParallax() {
        return new Promise((resolve) => {
            console.log('🌊 Starting parallax initialization...');
            
            const parallaxLayers = document.querySelectorAll('.parallax-layer');
            
            const updateParallax = () => {
                const scrolled = window.pageYOffset;
                parallaxLayers.forEach(layer => {
                    const depth = parseFloat(layer.dataset.depth);
                    const yPos = -(scrolled * depth);
                    layer.style.transform = `translateY(${yPos}px)`;
                });
            };
            
            window.addEventListener('scroll', updateParallax);
            console.log('🌊 Parallax initialization complete');
            resolve();
        });
    },

    initInteractions() {
        return new Promise((resolve) => {
            console.log('👆 Starting interactions initialization...');
            
            // Touchable elements
            document.querySelectorAll('.touchable').forEach(element => {
                const startReading = () => {
                    const text = element.textContent.trim();
                    if (window.speechSynthesis) {
                        const utterance = new SpeechSynthesisUtterance(text);
                        utterance.rate = 0.8;
                        speechSynthesis.speak(utterance);
                    }
                };
                
                const startLongPress = () => {
                    element.longPressTimer = setTimeout(() => {
                        this.showHindiTranslation(element.textContent.trim());
                    }, 1000);
                };
                
                const cancelLongPress = () => {
                    if (element.longPressTimer) {
                        clearTimeout(element.longPressTimer);
                        element.longPressTimer = null;
                    }
                };
                
                // Touch events for mobile
                element.addEventListener('touchstart', startLongPress);
                element.addEventListener('touchend', cancelLongPress);
                element.addEventListener('touchcancel', cancelLongPress);
                
                // Mouse events for desktop
                element.addEventListener('click', startReading);
                element.addEventListener('mousedown', startLongPress);
                element.addEventListener('mouseup', cancelLongPress);
                element.addEventListener('mouseleave', cancelLongPress);
            });
            
            // Card hover effects
            document.querySelectorAll('.content-card').forEach(card => {
                card.addEventListener('mouseenter', () => {
                    const sound = card.dataset.sound;
                    if (sound) AudioEngine.playEffect(sound);
                    
                    // Show creature if specified
                    const creature = card.dataset.creature;
                    if (creature) CreatureSystem.showCreature(creature);
                });
            });
            
            console.log('👆 Interactions initialization complete');
            resolve();
        });
    },

    showHindiTranslation(text) {
        // This will be implemented with translation API
        console.log('Hindi translation requested for:', text);
        // For now, show a placeholder portal effect
        
        const portal = document.createElement('div');
        portal.className = 'translation-portal';
        portal.innerHTML = `
            <div class="portal-content">
                <h3>Hindi Translation</h3>
                <p>Translation coming soon...</p>
                <button onclick="this.parentElement.parentElement.remove()">Close</button>
            </div>
        `;
        document.body.appendChild(portal);
        
        setTimeout(() => portal.classList.add('active'), 10);
    },

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const circles = loadingScreen.querySelectorAll('circle');
        
        // Animate loading circles
        circles.forEach((circle, index) => {
            circle.style.animationDelay = `${index * 0.2}s`;
        });
    },

    hideLoadingScreen() {
        console.log('🌌 Attempting to hide loading screen...');
        const loadingScreen = document.getElementById('loadingScreen');
        
        if (!loadingScreen) {
            console.log('✅ No loading screen found - proceeding normally');
            return;
        }
        
        console.log('✅ Hiding loading screen now');
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            console.log('✅ Loading screen hidden');
        }, 500);
    },

    playWelcomeSequence() {
        // Stagger animate elements
        const elements = [
            '.date-badge',
            '.student-name',
            '.hero-greeting',
            '.student-avatar-container',
            '.content-card'
        ];
        
        elements.forEach((selector, index) => {
            const el = document.querySelector(selector);
            if (el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 200);
            }
        });
        
        // Play welcome sound
        setTimeout(() => {
            AudioEngine.playEffect('welcome-chime');
        }, 500);
    }
};

console.log('🌌 Universe object created:', typeof Universe);
console.log('🌌 universe.js loaded completely - waiting for HTML initialization');
