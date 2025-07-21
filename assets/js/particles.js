// particles.js - Beautiful particle effects throughout the universe
const ParticleSystem = {
    particles: [],
    fireflies: [],
    stars: [],
    clouds: [],
    
    config: {
        maxParticles: 150,
        maxFireflies: 20,
        maxStars: 100,
        particleColors: ['#FFD700', '#FF69B4', '#00CED1', '#9370DB', '#FF6347'],
        studentColor: null
    },
    
    init() {
        // Get student color
        this.config.studentColor = getComputedStyle(document.documentElement)
            .getPropertyValue('--student-accent').trim();
        
        // Create containers
        this.createContainers();
        
        // Initialize different particle types
        this.createAmbientParticles();
        this.createFireflies();
        this.createClouds();
        
        // Start animation loop
        this.animate();
        
        // Particle interactions
        this.initInteractions();
    },
    
    createContainers() {
        // Fireflies container
        const firefliesContainer = document.createElement('div');
        firefliesContainer.className = 'fireflies-container';
        firefliesContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 3;
        `;
        document.querySelector('.universe-container').appendChild(firefliesContainer);
        this.firefliesContainer = firefliesContainer;
        
        // Particles container
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        particlesContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 2;
        `;
        document.querySelector('.universe-container').appendChild(particlesContainer);
        this.particlesContainer = particlesContainer;
    },
    
    createAmbientParticles() {
        const heroSection = document.getElementById('heroSection');
        if (!heroSection) return;
        
        const particlesEl = document.getElementById('heroParticles');
        
        for (let i = 0; i < 50; i++) {
            const particle = {
                element: document.createElement('div'),
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                size: Math.random() * 4 + 2,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.3,
                color: this.config.studentColor || this.config.particleColors[Math.floor(Math.random() * this.config.particleColors.length)],
                pulseSpeed: Math.random() * 0.02 + 0.01,
                pulsePhase: Math.random() * Math.PI * 2
            };
            
            particle.element.className = 'ambient-particle';
            particle.element.style.cssText = `
                position: absolute;
                width: ${particle.size}px;
                height: ${particle.size}px;
                background: ${particle.color};
                border-radius: 50%;
                opacity: ${particle.opacity};
                box-shadow: 0 0 ${particle.size * 2}px ${particle.color};
                pointer-events: none;
                will-change: transform, opacity;
            `;
            
            particlesEl.appendChild(particle.element);
            this.particles.push(particle);
        }
    },
    
    createFireflies() {
        for (let i = 0; i < this.config.maxFireflies; i++) {
            this.spawnFirefly();
        }
    },
    
    spawnFirefly() {
        const firefly = {
            element: document.createElement('div'),
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            targetX: Math.random() * window.innerWidth,
            targetY: Math.random() * window.innerHeight,
            size: Math.random() * 4 + 4,
            speed: Math.random() * 0.5 + 0.5,
            glowIntensity: 0,
            glowDirection: 1,
            wanderAngle: Math.random() * Math.PI * 2,
            blinkPattern: this.generateBlinkPattern()
        };
        
        firefly.element.className = 'firefly';
        firefly.element.style.cssText = `
            position: absolute;
            width: ${firefly.size}px;
            height: ${firefly.size}px;
            background: #FFFF99;
            border-radius: 50%;
            opacity: 0;
            box-shadow: 0 0 20px #FFFF00;
            pointer-events: auto;
            cursor: pointer;
            transition: opacity 0.3s ease;
            will-change: transform, opacity;
        `;
        
        // Make fireflies interactive
        firefly.element.addEventListener('mouseenter', () => {
            this.onFireflyHover(firefly);
        });
        
        firefly.element.addEventListener('click', () => {
            this.onFireflyClick(firefly);
        });
        
        this.firefliesContainer.appendChild(firefly.element);
        this.fireflies.push(firefly);
    },
    
    generateBlinkPattern() {
        // Create unique blink patterns for each firefly
        const pattern = [];
        const patternLength = 3 + Math.floor(Math.random() * 4);
        
        for (let i = 0; i < patternLength; i++) {
            pattern.push({
                duration: Math.random() * 1000 + 500,
                intensity: Math.random() * 0.5 + 0.5
            });
        }
        
        return pattern;
    },
    
    createClouds() {
        const cloudsContainer = document.querySelector('.clouds');
        if (!cloudsContainer) return;
        
        for (let i = 0; i < 5; i++) {
            const cloud = {
                element: document.createElement('div'),
                x: Math.random() * window.innerWidth * 1.5 - window.innerWidth * 0.25,
                y: Math.random() * 300,
                scale: Math.random() * 0.5 + 0.5,
                speed: Math.random() * 0.2 + 0.1,
                opacity: Math.random() * 0.3 + 0.1
            };
            
            cloud.element.className = 'cloud';
            cloud.element.innerHTML = this.generateCloudSVG();
            cloud.element.style.cssText = `
                position: absolute;
                width: 200px;
                height: 100px;
                opacity: ${cloud.opacity};
                transform: translate(${cloud.x}px, ${cloud.y}px) scale(${cloud.scale});
                will-change: transform;
            `;
            
            cloudsContainer.appendChild(cloud.element);
            this.clouds.push(cloud);
        }
    },
    
    generateCloudSVG() {
        return `
            <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <filter id="cloudBlur">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="3"/>
                    </filter>
                </defs>
                <g filter="url(#cloudBlur)">
                    <ellipse cx="60" cy="60" rx="40" ry="25" fill="rgba(255, 255, 255, 0.4)"/>
                    <ellipse cx="90" cy="50" rx="50" ry="30" fill="rgba(255, 255, 255, 0.4)"/>
                    <ellipse cx="130" cy="60" rx="35" ry="20" fill="rgba(255, 255, 255, 0.4)"/>
                </g>
            </svg>
        `;
    },
    
    animate() {
        // Update ambient particles
        this.particles.forEach(particle => {
            // Movement
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Wrap around screen
            if (particle.x < -particle.size) particle.x = window.innerWidth + particle.size;
            if (particle.x > window.innerWidth + particle.size) particle.x = -particle.size;
            if (particle.y < -particle.size) particle.y = window.innerHeight + particle.size;
            if (particle.y > window.innerHeight + particle.size) particle.y = -particle.size;
            
            // Pulse effect
            const pulse = Math.sin(Date.now() * particle.pulseSpeed + particle.pulsePhase) * 0.3 + 0.7;
            particle.element.style.opacity = particle.opacity * pulse;
            
            // Apply position
            particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
        });
        
        // Update fireflies
        this.fireflies.forEach((firefly, index) => {
            // Wander movement
            firefly.wanderAngle += (Math.random() - 0.5) * 0.3;
            
            const dx = firefly.targetX - firefly.x;
            const dy = firefly.targetY - firefly.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 50) {
                // Choose new target
                firefly.targetX = Math.random() * window.innerWidth;
                firefly.targetY = Math.random() * window.innerHeight;
            } else {
                // Move towards target with wander
                firefly.x += (dx / distance) * firefly.speed + Math.cos(firefly.wanderAngle) * 0.5;
                firefly.y += (dy / distance) * firefly.speed + Math.sin(firefly.wanderAngle) * 0.5;
            }
            
            // Blink pattern
            const time = Date.now();
            const patternIndex = Math.floor((time / 1000) % firefly.blinkPattern.length);
            const targetIntensity = firefly.blinkPattern[patternIndex].intensity;
            
            firefly.glowIntensity += (targetIntensity - firefly.glowIntensity) * 0.1;
            
            // Apply position and glow
            firefly.element.style.transform = `translate(${firefly.x}px, ${firefly.y}px)`;
            firefly.element.style.opacity = firefly.glowIntensity;
            firefly.element.style.boxShadow = `0 0 ${20 + firefly.glowIntensity * 20}px rgba(255, 255, 0, ${firefly.glowIntensity})`;
        });
        
        // Update clouds
        this.clouds.forEach(cloud => {
            cloud.x += cloud.speed;
            
            // Wrap around
            if (cloud.x > window.innerWidth + 200) {
                cloud.x = -400;
                cloud.y = Math.random() * 300;
            }
            
            cloud.element.style.transform = `translate(${cloud.x}px, ${cloud.y}px) scale(${cloud.scale})`;
        });
        
        requestAnimationFrame(() => this.animate());
    },
    
    onFireflyHover(firefly) {
        // Firefly gets excited
        firefly.speed = 2;
        firefly.glowIntensity = 1;
        
        // Play sound
        AudioEngine.playEffect('sparkle');
        
        // Reset after a moment
        setTimeout(() => {
            firefly.speed = Math.random() * 0.5 + 0.5;
        }, 2000);
    },
    
    onFireflyClick(firefly) {
        // Create sparkle burst
        this.createSparkleBurst(firefly.x, firefly.y);
        
        // Firefly teleports
        firefly.x = Math.random() * window.innerWidth;
        firefly.y = Math.random() * window.innerHeight;
        
        // Play magical sound
        AudioEngine.playEffect('magic-sparkle');
    },
    
    createSparkleBurst(x, y) {
        const burst = document.createElement('div');
        burst.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 100px;
            height: 100px;
            pointer-events: none;
            z-index: 1000;
        `;
        
        for (let i = 0; i < 12; i++) {
            const sparkle = document.createElement('div');
            const angle = (i / 12) * Math.PI * 2;
            const distance = 50 + Math.random() * 50;
            
            sparkle.style.cssText = `
                position: absolute;
                left: 50%;
                top: 50%;
                width: 4px;
                height: 4px;
                background: #FFD700;
                border-radius: 50%;
                box-shadow: 0 0 10px #FFD700;
                animation: sparkleShoot 1s ease-out forwards;
            `;
            
            sparkle.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
            sparkle.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
            
            burst.appendChild(sparkle);
        }
        
        document.body.appendChild(burst);
        
        setTimeout(() => burst.remove(), 1000);
    },
    
    addStars() {
        // For cosmic theme
        if (this.stars.length > 0) return;
        
        const starsContainer = document.createElement('div');
        starsContainer.className = 'stars-container';
        starsContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        
        for (let i = 0; i < this.config.maxStars; i++) {
            const star = document.createElement('div');
            const size = Math.random() * 3 + 1;
            
            star.style.cssText = `
                position: absolute;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                width: ${size}px;
                height: ${size}px;
                background: white;
                border-radius: 50%;
                opacity: ${Math.random() * 0.8 + 0.2};
                animation: twinkle ${Math.random() * 3 + 2}s ease-in-out infinite;
                animation-delay: ${Math.random() * 3}s;
            `;
            
            starsContainer.appendChild(star);
            this.stars.push(star);
        }
        
        document.querySelector('.universe-container').appendChild(starsContainer);
        this.starsContainer = starsContainer;
    },
    
    removeStars() {
        if (this.starsContainer) {
            this.starsContainer.remove();
            this.stars = [];
        }
    },
    
    initInteractions() {
        // Create particles on mouse move
        let lastParticleTime = 0;
        
        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - lastParticleTime > 50) { // Throttle
                this.createMouseParticle(e.clientX, e.clientY);
                lastParticleTime = now;
            }
        });
        
        // Touch interactions
        document.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            this.createMouseParticle(touch.clientX, touch.clientY);
        });
    },
    
    createMouseParticle(x, y) {
        if (this.particles.length > this.config.maxParticles) return;
        
        const particle = {
            element: document.createElement('div'),
            x: x,
            y: y,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 2 - 1,
            opacity: 0.8,
            color: this.config.studentColor || this.config.particleColors[Math.floor(Math.random() * this.config.particleColors.length)],
            lifetime: 1,
            decay: 0.02
        };
        
        particle.element.className = 'mouse-particle';
        particle.element.style.cssText = `
            position: fixed;
            width: ${particle.size}px;
            height: ${particle.size}px;
            background: ${particle.color};
            border-radius: 50%;
            opacity: ${particle.opacity};
            pointer-events: none;
            z-index: 999;
        `;
        
        document.body.appendChild(particle.element);
        
        // Animate and remove
        const animateParticle = () => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.speedY += 0.1; // Gravity
            particle.lifetime -= particle.decay;
            
            if (particle.lifetime <= 0) {
                particle.element.remove();
            } else {
                particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
                particle.element.style.opacity = particle.opacity * particle.lifetime;
                requestAnimationFrame(animateParticle);
            }
        };
        
        animateParticle();
    }
};

// CSS for particle animations
const particleStyles = document.createElement('style');
particleStyles.textContent = `
    @keyframes twinkle {
        0%, 100% { opacity: 0.2; }
        50% { opacity: 1; }
    }
    
    @keyframes sparkleShoot {
        0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0);
            opacity: 0;
        }
    }
    
    .firefly {
        cursor: pointer;
        transition: opacity 0.3s ease;
    }
    
    .firefly:hover {
        filter: brightness(1.5);
    }
`;
document.head.appendChild(particleStyles);
