// creatures.js - Bringing life to the learning universe
const CreatureSystem = {
    creatures: {
        'math-dragon': {
            name: 'Mathemágica',
            type: 'dragon',
            color: '#FF6B6B',
            size: 80,
            animations: ['idle', 'breathe', 'fly']
        },
        'science-owl': {
            name: 'Professor Hoot',
            type: 'owl',
            color: '#4ECDC4',
            size: 70,
            animations: ['idle', 'blink', 'rotate-head']
        },
        'english-butterfly': {
            name: 'Wordsworth',
            type: 'butterfly',
            color: '#FFD93D',
            size: 60,
            animations: ['idle', 'flutter', 'write']
        },
        'history-lion': {
            name: 'Chronos',
            type: 'lion',
            color: '#F4A460',
            size: 85,
            animations: ['idle', 'roar', 'majestic']
        },
        'art-peacock': {
            name: 'Palette',
            type: 'peacock',
            color: '#9B5DE5',
            size: 90,
            animations: ['idle', 'display', 'paint']
        },
        'star': {
            name: 'Twinkle',
            type: 'star',
            color: '#FFE66D',
            size: 50,
            animations: ['idle', 'pulse', 'shoot']
        }
    },
    
    walkingAnimals: [
        { name: 'fox', speed: 2, size: 50, color: '#FF6B35' },
        { name: 'deer', speed: 1.5, size: 60, color: '#8B4513' },
        { name: 'rabbit', speed: 3, size: 40, color: '#F5DEB3' },
        { name: 'cat', speed: 1.8, size: 45, color: '#2C2C2C' },
        { name: 'dog', speed: 2.2, size: 55, color: '#D2691E' },
        { name: 'bird', speed: 2.5, size: 30, color: '#87CEEB' },
        { name: 'turtle', speed: 0.5, size: 35, color: '#228B22' },
        { name: 'hedgehog', speed: 1, size: 30, color: '#8B4513' }
    ],
    
    activeCreatures: new Map(),
    activeAnimals: [],
    
    init() {
        this.initSubjectCreature();
        this.initWalkingAnimals();
        this.startAnimationLoop();
    },
    
    initSubjectCreature() {
        const subjectTitle = window.STUDENT_DATA?.subject?.toLowerCase() || '';
        let creatureType = 'star'; // default
        
        // Match subject to creature
        if (subjectTitle.includes('math')) creatureType = 'math-dragon';
        else if (subjectTitle.includes('science')) creatureType = 'science-owl';
        else if (subjectTitle.includes('english')) creatureType = 'english-butterfly';
        else if (subjectTitle.includes('history')) creatureType = 'history-lion';
        else if (subjectTitle.includes('art')) creatureType = 'art-peacock';
        
        // Find creature home
        const creatureHome = document.getElementById('creatureHome');
        if (creatureHome) {
            this.createCreature(creatureType, creatureHome);
        }
    },
    
    createCreature(type, container) {
        const creatureData = this.creatures[type];
        if (!creatureData) return;
        
        const creature = document.createElement('div');
        creature.className = 'subject-creature';
        creature.dataset.type = type;
        
        // Create SVG based on creature type
        const svg = this.generateCreatureSVG(creatureData);
        creature.appendChild(svg);
        
        container.appendChild(creature);
        
        // Store creature instance
        this.activeCreatures.set(type, {
            element: creature,
            data: creatureData,
            state: 'idle',
            animationTime: 0
        });
        
        // Start idle animation
        this.animateCreature(type, 'idle');
    },
    
    generateCreatureSVG(creatureData) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.setAttribute('width', creatureData.size);
        svg.setAttribute('height', creatureData.size);
        
        switch (creatureData.type) {
            case 'dragon':
                svg.innerHTML = `
                    <g class="dragon-body">
                        <path d="M50 70 Q30 60 20 40 Q15 20 30 15 Q50 10 70 15 Q85 20 80 40 Q70 60 50 70" 
                              fill="${creatureData.color}" stroke="#333" stroke-width="2"/>
                        <circle cx="35" cy="30" r="5" fill="#FFF" class="eye-left"/>
                        <circle cx="65" cy="30" r="5" fill="#FFF" class="eye-right"/>
                        <circle cx="35" cy="30" r="3" fill="#000" class="pupil-left"/>
                        <circle cx="65" cy="30" r="3" fill="#000" class="pupil-right"/>
                        <path d="M40 45 Q50 50 60 45" stroke="#333" stroke-width="2" fill="none" class="mouth"/>
                        
                        <!-- Wings -->
                        <path d="M20 40 Q10 30 5 40 Q10 50 20 40" fill="${creatureData.color}" 
                              stroke="#333" stroke-width="1" class="wing-left"/>
                        <path d="M80 40 Q90 30 95 40 Q90 50 80 40" fill="${creatureData.color}" 
                              stroke="#333" stroke-width="1" class="wing-right"/>
                        
                        <!-- Geometric patterns -->
                        <g class="math-patterns" opacity="0">
                            <circle cx="50" cy="50" r="3" fill="#FFD700"/>
                            <rect x="45" y="45" width="10" height="10" fill="none" stroke="#FFD700" stroke-width="1" transform="rotate(45 50 50)"/>
                            <path d="M50 40 L55 50 L45 50 Z" fill="#FFD700"/>
                        </g>
                    </g>
                `;
                break;
                
            case 'owl':
                svg.innerHTML = `
                    <g class="owl-body">
                        <ellipse cx="50" cy="60" rx="25" ry="30" fill="${creatureData.color}" stroke="#333" stroke-width="2"/>
                        <circle cx="50" cy="30" r="20" fill="${creatureData.color}" stroke="#333" stroke-width="2" class="head"/>
                        
                        <!-- Eyes -->
                        <circle cx="40" cy="30" r="8" fill="#FFF" stroke="#333" stroke-width="1"/>
                        <circle cx="60" cy="30" r="8" fill="#FFF" stroke="#333" stroke-width="1"/>
                        <circle cx="40" cy="30" r="5" fill="#333" class="pupil-left"/>
                        <circle cx="60" cy="30" r="5" fill="#333" class="pupil-right"/>
                        
                        <!-- Beak -->
                        <path d="M50 35 L45 40 L50 42 L55 40 Z" fill="#FFA500" stroke="#333" stroke-width="1"/>
                        
                        <!-- Wings -->
                        <ellipse cx="30" cy="60" rx="10" ry="20" fill="${creatureData.color}" 
                                 stroke="#333" stroke-width="1" class="wing-left"/>
                        <ellipse cx="70" cy="60" rx="10" ry="20" fill="${creatureData.color}" 
                                 stroke="#333" stroke-width="1" class="wing-right"/>
                        
                        <!-- Constellation eyes -->
                        <g class="constellation-eyes" opacity="0">
                            <circle cx="40" cy="30" r="1" fill="#FFF"/>
                            <circle cx="42" cy="28" r="1" fill="#FFF"/>
                            <circle cx="38" cy="28" r="1" fill="#FFF"/>
                            <circle cx="60" cy="30" r="1" fill="#FFF"/>
                            <circle cx="62" cy="28" r="1" fill="#FFF"/>
                            <circle cx="58" cy="28" r="1" fill="#FFF"/>
                        </g>
                    </g>
                `;
                break;
                
            case 'butterfly':
                svg.innerHTML = `
                    <g class="butterfly-body">
                        <rect x="48" y="30" width="4" height="30" rx="2" fill="#333"/>
                        
                        <!-- Wings -->
                        <path d="M48 40 Q30 30 20 40 Q25 55 48 45" fill="${creatureData.color}" 
                              stroke="#333" stroke-width="1" class="wing-left-top"/>
                        <path d="M48 45 Q35 50 30 60 Q40 65 48 50" fill="${creatureData.color}" 
                              stroke="#333" stroke-width="1" class="wing-left-bottom"/>
                        <path d="M52 40 Q70 30 80 40 Q75 55 52 45" fill="${creatureData.color}" 
                              stroke="#333" stroke-width="1" class="wing-right-top"/>
                        <path d="M52 45 Q65 50 70 60 Q60 65 52 50" fill="${creatureData.color}" 
                              stroke="#333" stroke-width="1" class="wing-right-bottom"/>
                        
                        <!-- Wing patterns -->
                        <circle cx="35" cy="45" r="3" fill="#FFF" opacity="0.8"/>
                        <circle cx="65" cy="45" r="3" fill="#FFF" opacity="0.8"/>
                        
                        <!-- Word trail -->
                        <g class="word-trail" opacity="0">
                            <text x="20" y="70" font-size="8" fill="#666">Once</text>
                            <text x="40" y="75" font-size="8" fill="#666">upon</text>
                            <text x="60" y="70" font-size="8" fill="#666">a</text>
                            <text x="70" y="75" font-size="8" fill="#666">time...</text>
                        </g>
                    </g>
                `;
                break;
                
            case 'star':
                svg.innerHTML = `
                    <g class="star-body">
                        <path d="M50 20 L60 40 L80 40 L65 55 L70 75 L50 65 L30 75 L35 55 L20 40 L40 40 Z" 
                              fill="${creatureData.color}" stroke="#333" stroke-width="2"/>
                        <circle cx="45" cy="45" r="2" fill="#333"/>
                        <circle cx="55" cy="45" r="2" fill="#333"/>
                        <path d="M45 50 Q50 55 55 50" stroke="#333" stroke-width="1.5" fill="none"/>
                        
                        <!-- Sparkles -->
                        <g class="sparkles">
                            <circle cx="30" cy="30" r="1" fill="#FFF" opacity="0">
                                <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite"/>
                            </circle>
                            <circle cx="70" cy="30" r="1" fill="#FFF" opacity="0">
                                <animate attributeName="opacity" values="0;1;0" dur="2s" begin="0.5s" repeatCount="indefinite"/>
                            </circle>
                            <circle cx="30" cy="70" r="1" fill="#FFF" opacity="0">
                                <animate attributeName="opacity" values="0;1;0" dur="2s" begin="1s" repeatCount="indefinite"/>
                            </circle>
                            <circle cx="70" cy="70" r="1" fill="#FFF" opacity="0">
                                <animate attributeName="opacity" values="0;1;0" dur="2s" begin="1.5s" repeatCount="indefinite"/>
                            </circle>
                        </g>
                    </g>
                `;
                break;
        }
        
        return svg;
    },
    
    animateCreature(type, animation) {
        const creature = this.activeCreatures.get(type);
        if (!creature) return;
        
        creature.state = animation;
        const svg = creature.element.querySelector('svg');
        
        switch (animation) {
            case 'idle':
                // Gentle floating animation
                creature.element.style.animation = 'creatureFloat 4s ease-in-out infinite';
                break;
                
            case 'breathe':
                if (type === 'math-dragon') {
                    // Show math patterns
                    const patterns = svg.querySelector('.math-patterns');
                    if (patterns) {
                        patterns.style.transition = 'opacity 0.5s';
                        patterns.style.opacity = '1';
                        
                        // Breathe geometric fire
                        this.createGeometricBreath(creature.element);
                        
                        setTimeout(() => {
                            patterns.style.opacity = '0';
                        }, 2000);
                    }
                }
                break;
                
            case 'blink':
                if (type === 'science-owl') {
                    const leftPupil = svg.querySelector('.pupil-left');
                    const rightPupil = svg.querySelector('.pupil-right');
                    
                    [leftPupil, rightPupil].forEach(pupil => {
                        pupil.style.transition = 'transform 0.1s';
                        pupil.style.transform = 'scaleY(0)';
                        
                        setTimeout(() => {
                            pupil.style.transform = 'scaleY(1)';
                        }, 100);
                    });
                    
                    // Show constellation eyes
                    const constellation = svg.querySelector('.constellation-eyes');
                    if (constellation) {
                        constellation.style.transition = 'opacity 1s';
                        constellation.style.opacity = '1';
                        
                        setTimeout(() => {
                            constellation.style.opacity = '0';
                        }, 2000);
                    }
                }
                break;
                
            case 'flutter':
                if (type === 'english-butterfly') {
                    // Wing flutter animation
                    const wings = svg.querySelectorAll('[class*="wing"]');
                    wings.forEach((wing, index) => {
                        wing.style.transformOrigin = '50% 50%';
                        wing.style.animation = `butterflyWingFlap 0.3s ${index * 0.1}s ease-in-out 5`;
                    });
                    
                    // Show word trail
                    const trail = svg.querySelector('.word-trail');
                    if (trail) {
                        trail.style.transition = 'opacity 1s';
                        trail.style.opacity = '1';
                        
                        setTimeout(() => {
                            trail.style.opacity = '0';
                        }, 3000);
                    }
                }
                break;
        }
    },
    
    createGeometricBreath(dragonElement) {
        const breathContainer = document.createElement('div');
        breathContainer.className = 'geometric-breath';
        breathContainer.style.cssText = `
            position: absolute;
            top: 50%;
            left: 100%;
            width: 200px;
            height: 100px;
            pointer-events: none;
        `;
        
        // Create geometric shapes as breath
        const shapes = ['triangle', 'square', 'circle', 'pentagon'];
        const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#9B5DE5'];
        
        for (let i = 0; i < 10; i++) {
            const shape = document.createElement('div');
            const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            shape.style.cssText = `
                position: absolute;
                width: 20px;
                height: 20px;
                top: ${Math.random() * 100}%;
                left: 0;
                opacity: 0;
                animation: breathParticle 2s ${i * 0.1}s ease-out;
            `;
            
            // Create shape based on type
            if (shapeType === 'triangle') {
                shape.style.width = '0';
                shape.style.height = '0';
                shape.style.borderLeft = '10px solid transparent';
                shape.style.borderRight = '10px solid transparent';
                shape.style.borderBottom = `20px solid ${color}`;
            } else if (shapeType === 'square') {
                shape.style.background = color;
                shape.style.transform = `rotate(${Math.random() * 360}deg)`;
            } else if (shapeType === 'circle') {
                shape.style.background = color;
                shape.style.borderRadius = '50%';
            }
            
            breathContainer.appendChild(shape);
        }
        
        dragonElement.appendChild(breathContainer);
        
        // Remove after animation
        setTimeout(() => {
            breathContainer.remove();
        }, 3000);
    },
    
    initWalkingAnimals() {
        const container = document.getElementById('animalsContainer');
        if (!container) return;
        
        // Start spawning animals
        this.spawnWalkingAnimal();
        
        // Spawn new animal every 15-30 seconds
        setInterval(() => {
            if (this.activeAnimals.length < 3) { // Max 3 animals at once
                this.spawnWalkingAnimal();
            }
        }, 15000 + Math.random() * 15000);
    },
    
    spawnWalkingAnimal() {
        const container = document.getElementById('animalsContainer');
        const animalData = this.walkingAnimals[Math.floor(Math.random() * this.walkingAnimals.length)];
        
        const animal = document.createElement('div');
        animal.className = 'walking-animal';
        animal.style.cssText = `
            position: absolute;
            bottom: 20px;
            right: -${animalData.size + 20}px;
            width: ${animalData.size}px;
            height: ${animalData.size}px;
            z-index: ${Math.floor(Math.random() * 10)};
        `;
        
        // Create animal SVG
        const svg = this.createWalkingAnimalSVG(animalData);
        animal.appendChild(svg);
        
        container.appendChild(animal);
        
        // Store animal instance
        const animalInstance = {
            element: animal,
            data: animalData,
            position: window.innerWidth + animalData.size,
            walkCycle: 0
        };
        
        this.activeAnimals.push(animalInstance);
        
        // Start walking animation
        this.animateWalkingAnimal(animalInstance);
    },
    
    createWalkingAnimalSVG(animalData) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.setAttribute('width', animalData.size);
        svg.setAttribute('height', animalData.size);
        
        switch (animalData.name) {
            case 'fox':
                svg.innerHTML = `
                    <g class="fox-body">
                        <ellipse cx="40" cy="60" rx="25" ry="15" fill="${animalData.color}" stroke="#333" stroke-width="2"/>
                        <circle cx="20" cy="50" r="12" fill="${animalData.color}" stroke="#333" stroke-width="2"/>
                        <path d="M15 45 L10 35 L18 38 Z" fill="${animalData.color}" stroke="#333" stroke-width="1" class="ear-left"/>
                        <path d="M25 45 L30 35 L22 38 Z" fill="${animalData.color}" stroke="#333" stroke-width="1" class="ear-right"/>
                        <circle cx="16" cy="48" r="2" fill="#000"/>
                        <circle cx="24" cy="48" r="2" fill="#000"/>
                        <circle cx="20" cy="54" r="1" fill="#000"/>
                        <path d="M60 65 Q70 60 65 50" fill="${animalData.color}" stroke="#333" stroke-width="2" class="tail"/>
                        
                        <!-- Legs -->
                        <rect x="25" y="65" width="5" height="15" rx="2" fill="${animalData.color}" stroke="#333" stroke-width="1" class="leg-1"/>
                        <rect x="35" y="65" width="5" height="15" rx="2" fill="${animalData.color}" stroke="#333" stroke-width="1" class="leg-2"/>
                        <rect x="45" y="65" width="5" height="15" rx="2" fill="${animalData.color}" stroke="#333" stroke-width="1" class="leg-3"/>
                        <rect x="55" y="65" width="5" height="15" rx="2" fill="${animalData.color}" stroke="#333" stroke-width="1" class="leg-4"/>
                    </g>
                `;
                break;
                
            case 'rabbit':
                svg.innerHTML = `
                    <g class="rabbit-body">
                        <ellipse cx="50" cy="65" rx="20" ry="15" fill="${animalData.color}" stroke="#333" stroke-width="2"/>
                        <circle cx="35" cy="55" r="10" fill="${animalData.color}" stroke="#333" stroke-width="2"/>
                        <ellipse cx="30" cy="40" rx="4" ry="12" fill="${animalData.color}" stroke="#333" stroke-width="1" class="ear-left"/>
                        <ellipse cx="40" cy="40" rx="4" ry="12" fill="${animalData.color}" stroke="#333" stroke-width="1" class="ear-right"/>
                        <circle cx="32" cy="53" r="2" fill="#000"/>
                        <circle cx="38" cy="53" r="2" fill="#000"/>
                        <circle cx="35" cy="58" r="1" fill="#FF69B4"/>
                        <circle cx="65" cy="65" r="5" fill="${animalData.color}" stroke="#333" stroke-width="1" class="tail"/>
                        
                        <!-- Legs -->
                        <ellipse cx="40" cy="75" rx="5" ry="8" fill="${animalData.color}" stroke="#333" stroke-width="1" class="leg-front"/>
                        <ellipse cx="55" cy="75" rx="6" ry="10" fill="${animalData.color}" stroke="#333" stroke-width="1" class="leg-back"/>
                    </g>
                `;
                break;
                
            default:
                // Default simple animal shape
                svg.innerHTML = `
                    <g class="animal-body">
                        <ellipse cx="50" cy="60" rx="25" ry="18" fill="${animalData.color}" stroke="#333" stroke-width="2"/>
                        <circle cx="30" cy="50" r="10" fill="${animalData.color}" stroke="#333" stroke-width="2"/>
                        <circle cx="28" cy="48" r="2" fill="#000"/>
                        <circle cx="35" cy="48" r="2" fill="#000"/>
                        
                        <!-- Legs -->
                        <rect x="35" y="70" width="6" height="12" rx="3" fill="${animalData.color}" stroke="#333" stroke-width="1" class="leg-1"/>
                        <rect x="45" y="70" width="6" height="12" rx="3" fill="${animalData.color}" stroke="#333" stroke-width="1" class="leg-2"/>
                        <rect x="55" y="70" width="6" height="12" rx="3" fill="${animalData.color}" stroke="#333" stroke-width="1" class="leg-3"/>
                        <rect x="65" y="70" width="6" height="12" rx="3" fill="${animalData.color}" stroke="#333" stroke-width="1" class="leg-4"/>
                    </g>
                `;
        }
        
        return svg;
    },
    
    animateWalkingAnimal(animalInstance) {
        const speed = animalInstance.data.speed;
        const legs = animalInstance.element.querySelectorAll('[class*="leg"]');
        
        const walk = () => {
            // Update position
            animalInstance.position -= speed;
            animalInstance.element.style.transform = `translateX(-${window.innerWidth + animalInstance.data.size - animalInstance.position}px)`;
            
            // Animate legs
            animalInstance.walkCycle += 0.1;
            legs.forEach((leg, index) => {
                const offset = index * Math.PI / 2;
                const rotation = Math.sin(animalInstance.walkCycle + offset) * 15;
                leg.style.transformOrigin = '50% 0%';
                leg.style.transform = `rotate(${rotation}deg)`;
            });
            
            // Bob animation
            const bob = Math.sin(animalInstance.walkCycle * 2) * 3;
            animalInstance.element.style.bottom = `${20 + bob}px`;
            
            // Check if animal has left the screen
            if (animalInstance.position < -animalInstance.data.size - 100) {
                // Remove animal
                animalInstance.element.remove();
                const index = this.activeAnimals.indexOf(animalInstance);
                if (index > -1) {
                    this.activeAnimals.splice(index, 1);
                }
            } else {
                requestAnimationFrame(walk);
            }
        };
        
        walk();
    },
    
    showCreature(creatureType) {
        const creature = this.activeCreatures.get(creatureType);
        if (creature) {
            // Trigger special animation
            const animations = this.creatures[creatureType].animations;
            const specialAnimation = animations[Math.floor(Math.random() * (animations.length - 1)) + 1];
            this.animateCreature(creatureType, specialAnimation);
            
            // Return to idle after animation
            setTimeout(() => {
                this.animateCreature(creatureType, 'idle');
            }, 3000);
        }
    },
    
    startAnimationLoop() {
        // Periodic creature animations
        setInterval(() => {
            this.activeCreatures.forEach((creature, type) => {
                if (creature.state === 'idle' && Math.random() > 0.7) {
                    const animations = this.creatures[type].animations;
                    const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
                    this.animateCreature(type, randomAnimation);
                    
                    setTimeout(() => {
                        this.animateCreature(type, 'idle');
                    }, 3000);
                }
            });
        }, 5000);
    }
};

// CSS for creature animations
const creatureStyles = document.createElement('style');
creatureStyles.textContent = `
    @keyframes creatureFloat {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-10px) scale(1.05); }
    }
    
    @keyframes butterflyWingFlap {
        0%, 100% { transform: scaleX(1); }
        50% { transform: scaleX(0.3); }
    }
    
    @keyframes breathParticle {
        0% {
            opacity: 0;
            transform: translateX(0) scale(0);
        }
        50% {
            opacity: 1;
            transform: translateX(100px) scale(1) rotate(180deg);
        }
        100% {
            opacity: 0;
            transform: translateX(200px) scale(0.5) rotate(360deg);
        }
    }
    
    .walking-animal {
        transition: none;
        will-change: transform;
    }
    
    .subject-creature {
        animation: creatureFloat 4s ease-in-out infinite;
    }
`;
document.head.appendChild(creatureStyles);
