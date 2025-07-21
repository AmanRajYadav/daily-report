// universe.js - The heart of the magical learning experience
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
        currentSeason: null,
        timeOfDay: null,
        weatherCondition: null,
        shakeDetected: false,
        orientation: { alpha: 0, beta: 0, gamma: 0 }
    },

    init() {
        if (this.state.initialized) return;
        
        // Show loading animation
        this.showLoadingScreen();
        
        // Initialize all systems
        Promise.all([
            this.loadAssets(),
            this.initThemeSystem(),
            this.initTimeAndSeason(),
            this.initDeviceMotion(),
            this.initParallax(),
            this.initInteractions()
        ]).then(() => {
            // Start all engines
            MagicCanvas.init();
            ParticleSystem.init();
            AudioEngine.init();
            CreatureSystem.init();
            LearningTree.init();
            
            // Hide loading screen with fade
            this.hideLoadingScreen();
            
            // Play welcome sequence
            this.playWelcomeSequence();
            
            this.state.initialized = true;
        });
    },

    loadAssets() {
        return new Promise((resolve) => {
            const assets = [
                // Sprites
                { type: 'image', src: '../assets/sprites/animals/fox-walk.svg' },
                { type: 'image', src: '../assets/sprites/animals/deer-walk.svg' },
                { type: 'image', src: '../assets/sprites/creatures/math-dragon.svg' },
                { type: 'image', src: '../assets/sprites/creatures/science-owl.svg' },
                
                // Sounds
                { type: 'audio', src: '../assets/sounds/ambient/morning-forest.mp3' },
                { type: 'audio', src: '../assets/sounds/effects/sparkle.mp3' }
            ];
            
            let loaded = 0;
            assets.forEach(asset => {
                if (asset.type === 'image') {
                    const img = new Image();
                    img.onload = () => {
                        loaded++;
                        if (loaded === assets.length) resolve();
                    };
                    img.src = asset.src;
                } else if (asset.type === 'audio') {
                    const audio = new Audio();
                    audio.oncanplaythrough = () => {
                        loaded++;
                        if (loaded === assets.length) resolve();
                    };
                    audio.src = asset.src;
                }
            });
        });
    },

    initThemeSystem() {
        const savedTheme = localStorage.getItem('theme') || 'minimal';
        this.setTheme(savedTheme);
        
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.addEventListener('click', () => {
            const newTheme = this.config.theme === 'minimal' ? 'cosmic' : 'minimal';
            this.setTheme(newTheme);
        });
    },

    setTheme(theme) {
        this.config.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        
        // Smooth transition between theme stylesheets
        const themeLink = document.getElementById('theme-stylesheet');
        const newThemeLink = document.createElement('link');
        newThemeLink.rel = 'stylesheet';
        newThemeLink.href = `../assets/css/themes/${theme}.css`;
        newThemeLink.onload = () => {
            themeLink.remove();
            newThemeLink.id = 'theme-stylesheet';
        };
        document.head.appendChild(newThemeLink);
        
        localStorage.setItem('theme', theme);
        
        // Trigger theme change effects
        if (theme === 'cosmic') {
            ParticleSystem.addStars();
            MagicCanvas.enableAurora();
        } else {
            ParticleSystem.removeStars();
            MagicCanvas.disableAurora();
        }
    },

    initTimeAndSeason() {
        const now = new Date();
        const hour = now.getHours();
        const month = now.getMonth();
        
        // Determine time of day
        if (hour >= 5 && hour < 12) {
            this.state.timeOfDay = 'morning';
        } else if (hour >= 12 && hour < 17) {
            this.state.timeOfDay = 'afternoon';
        } else if (hour >= 17 && hour < 20) {
            this.state.timeOfDay = 'evening';
        } else {
            this.state.timeOfDay = 'night';
        }
        
        // Determine season
        if (month >= 2 && month <= 4) {
            this.state.currentSeason = 'spring';
        } else if (month >= 5 && month <= 7) {
            this.state.currentSeason = 'summer';
        } else if (month >= 8 && month <= 10) {
            this.state.currentSeason = 'autumn';
        } else {
            this.state.currentSeason = 'winter';
        }
        
        // Apply time and season classes
        document.body.classList.add(`time-${this.state.timeOfDay}`);
        document.body.classList.add(`season-${this.state.currentSeason}`);
        
        // Start seasonal effects
        this.startSeasonalEffects();
    },

    startSeasonalEffects() {
        const overlay = document.getElementById('seasonalOverlay');
        
        switch (this.state.currentSeason) {
            case 'spring':
                this.createPetals(overlay);
                break;
            case 'summer':
                this.createButterflies(overlay);
                break;
            case 'autumn':
                this.createFallingLeaves(overlay);
                break;
            case 'winter':
                this.createSnowfall(overlay);
                break;
        }
    },

    createPetals(container) {
        for (let i = 0; i < 15; i++) {
            const petal = document.createElement('div');
            petal.className = 'seasonal-element petal';
            petal.style.left = Math.random() * 100 + '%';
            petal.style.animationDelay = Math.random() * 10 + 's';
            petal.style.animationDuration = (15 + Math.random() * 10) + 's';
            
            // Create SVG petal
            petal.innerHTML = `
                <svg viewBox="0 0 40 40" width="40" height="40">
                    <path d="M20 35 Q15 25 20 15 Q25 25 20 35" 
                          fill="rgba(255, 182, 193, 0.8)" 
                          stroke="rgba(255, 105, 180, 0.5)"/>
                </svg>
            `;
            
            container.appendChild(petal);
        }
    },

    createSnowfall(container) {
        for (let i = 0; i < 30; i++) {
            const snowflake = document.createElement('div');
            snowflake.className = 'seasonal-element snowflake';
            snowflake.style.left = Math.random() * 100 + '%';
            snowflake.style.animationDelay = Math.random() * 10 + 's';
            snowflake.style.animationDuration = (5 + Math.random() * 10) + 's';
            snowflake.style.fontSize = (10 + Math.random() * 20) + 'px';
            
            // Create unique snowflake
            snowflake.innerHTML = `
                <svg viewBox="0 0 50 50" width="30" height="30">
                    <g stroke="rgba(255, 255, 255, 0.8)" stroke-width="1" fill="none">
                        <line x1="25" y1="5" x2="25" y2="45"/>
                        <line x1="10" y1="25" x2="40" y2="25"/>
                        <line x1="15" y1="15" x2="35" y2="35"/>
                        <line x1="35" y1="15" x2="15" y2="35"/>
                        <circle cx="25" cy="25" r="3" fill="white"/>
                    </g>
                </svg>
            `;
            
            container.appendChild(snowflake);
        }
    },

    createFallingLeaves(container) {
        const leafColors = ['#D2691E', '#FF8C00', '#B22222', '#FFD700'];
        
        for (let i = 0; i < 12; i++) {
            const leaf = document.createElement('div');
            leaf.className = 'seasonal-element falling-leaf';
            leaf.style.left = Math.random() * 100 + '%';
            leaf.style.animationDelay = Math.random() * 10 + 's';
            leaf.style.animationDuration = (10 + Math.random() * 10) + 's';
            
            const color = leafColors[Math.floor(Math.random() * leafColors.length)];
            
            // Create SVG leaf
            leaf.innerHTML = `
                <svg viewBox="0 0 60 60" width="40" height="40">
                    <path d="M30 10 Q20 20 15 35 Q20 40 30 35 Q40 40 45 35 Q40 20 30 10" 
                          fill="${color}" 
                          stroke="#8B4513" 
                          stroke-width="1"/>
                    <line x1="30" y1="35" x2="30" y2="50" stroke="#8B4513" stroke-width="2"/>
                </svg>
            `;
            
            container.appendChild(leaf);
        }
    },

    createButterflies(container) {
        for (let i = 0; i < 8; i++) {
            const butterfly = document.createElement('div');
            butterfly.className = 'seasonal-element butterfly';
            butterfly.style.left = Math.random() * 100 + '%';
            butterfly.style.top = Math.random() * 100 + '%';
            
            // Create animated butterfly
            butterfly.innerHTML = `
                <svg viewBox="0 0 60 40" width="60" height="40" class="butterfly-svg">
                    <g class="butterfly-wings">
                        <path d="M30 20 Q20 10 10 15 Q15 25 30 20" fill="url(#butterflyGradient1)" class="wing-left"/>
                        <path d="M30 20 Q40 10 50 15 Q45 25 30 20" fill="url(#butterflyGradient2)" class="wing-right"/>
                        <rect x="28" y="15" width="4" height="10" rx="2" fill="#333"/>
                    </g>
                    <defs>
                        <linearGradient id="butterflyGradient1">
                            <stop offset="0%" stop-color="#FF69B4"/>
                            <stop offset="100%" stop-color="#FFB6C1"/>
                        </linearGradient>
                        <linearGradient id="butterflyGradient2">
                            <stop offset="0%" stop-color="#FFB6C1"/>
                            <stop offset="100%" stop-color="#FF69B4"/>
                        </linearGradient>
                    </defs>
                </svg>
            `;
            
            // Random flight pattern
            this.animateButterfly(butterfly);
            container.appendChild(butterfly);
        }
    },

    animateButterfly(butterfly) {
        const duration = 15000 + Math.random() * 10000;
        const startX = parseFloat(butterfly.style.left);
        const startY = parseFloat(butterfly.style.top);
        
        butterfly.animate([
            { transform: `translate(0, 0) rotate(0deg)` },
            { transform: `translate(${Math.random() * 200 - 100}px, ${Math.random() * 100 - 50}px) rotate(10deg)` },
            { transform: `translate(${Math.random() * 200 - 100}px, ${Math.random() * 100 - 50}px) rotate(-10deg)` },
            { transform: `translate(0, 0) rotate(0deg)` }
        ], {
            duration: duration,
            iterations: Infinity,
            easing: 'cubic-bezier(0.45, 0.05, 0.55, 0.95)'
        });
    },

    initDeviceMotion() {
        // Device orientation for tilt effects
        if (window.DeviceOrientationEvent) {
            let lastShakeTime = 0;
            
            window.addEventListener('deviceorientation', (e) => {
                this.state.orientation = {
                    alpha: e.alpha || 0,
                    beta: e.beta || 0,
                    gamma: e.gamma || 0
                };
                
                // Apply tilt to parallax layers
                this.applyTiltEffect();
            });
        }
        
        // Shake detection
        if (window.DeviceMotionEvent) {
            let lastX = 0, lastY = 0, lastZ = 0;
            const shakeThreshold = 15;
            
            window.addEventListener('devicemotion', (e) => {
                const acc = e.accelerationIncludingGravity;
                if (!acc) return;
                
                const deltaX = Math.abs(acc.x - lastX);
                const deltaY = Math.abs(acc.y - lastY);
                const deltaZ = Math.abs(acc.z - lastZ);
                
                if (deltaX + deltaY + deltaZ > shakeThreshold) {
                    const now = Date.now();
                    if (now - lastShakeTime > 1000) {
                        this.onShakeDetected();
                        lastShakeTime = now;
                    }
                }
                
                lastX = acc.x;
                lastY = acc.y;
                lastZ = acc.z;
            });
        }
    },

    applyTiltEffect() {
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
        // Mouse parallax
        let mouseX = 0, mouseY = 0;
        let targetX = 0, targetY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });
        
        const updateParallax = () => {
            targetX += (mouseX - targetX) * 0.1;
            targetY += (mouseY - targetY) * 0.1;
            
            document.querySelectorAll('.parallax-layer').forEach((layer) => {
                const depth = parseFloat(layer.dataset.depth);
                const moveX = targetX * depth * 50;
                const moveY = targetY * depth * 30;
                
                layer.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
            
            requestAnimationFrame(updateParallax);
        };
        
        updateParallax();
    },

    initInteractions() {
        // Touch to read aloud
        document.querySelectorAll('[data-read-aloud="true"]').forEach(element => {
            let isReading = false;
            let longPressTimer;
            
            const startReading = () => {
                if (!isReading) {
                    AudioEngine.speak(element.textContent);
                    element.classList.add('reading');
                    isReading = true;
                } else {
                    AudioEngine.stopSpeaking();
                    element.classList.remove('reading');
                    isReading = false;
                }
            };
            
            const startLongPress = () => {
                longPressTimer = setTimeout(() => {
                    // Show Hindi translation portal
                    this.showHindiTranslation(element.textContent);
                }, 800);
            };
            
            const cancelLongPress = () => {
                clearTimeout(longPressTimer);
            };
            
            // Touch events
            element.addEventListener('touchstart', startLongPress);
            element.addEventListener('touchend', () => {
                cancelLongPress();
                if (!longPressTimer) startReading();
            });
            
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
        const loadingScreen = document.getElementById('loadingScreen');
        
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
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

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Universe.init());
} else {
    Universe.init();
}
