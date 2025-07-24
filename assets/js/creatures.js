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
        'social-science-dog': {
            name: 'Socrates',
            type: 'dog',
            color: '#D2691E',
            size: 75,
            animations: ['idle', 'wag', 'bark']
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
    
    // GIF animals configuration - 26 animals named a-z with speed control
    gifAnimals: [
        { name: 'a', size: 'large', filename: 'a.gif', speed: 0.5 },
        { name: 'b', size: 'medium', filename: 'b.gif', speed: 0.5 },
        { name: 'c', size: 'small', filename: 'c.gif', speed: 0.5 },
        { name: 'd', size: 'medium', filename: 'd.gif', speed: 0.5 },
        { name: 'e', size: 'large', filename: 'e.gif', speed: 0.5 },
        { name: 'f', size: 'medium', filename: 'f.gif', speed: 0.5 },
        { name: 'g', size: 'small', filename: 'g.gif', speed: 0.5 },
        { name: 'h', size: 'medium', filename: 'h.gif', speed: 0.5 },
        { name: 'i', size: 'small', filename: 'i.gif', speed: 0.5 },
        { name: 'j', size: 'medium', filename: 'j.gif', speed: 0.5 },
        { name: 'k', size: 'large', filename: 'k.gif', speed: 0.5 },
        { name: 'l', size: 'medium', filename: 'l.gif', speed: 0.5 },
        { name: 'm', size: 'large', filename: 'm.gif', speed: 0.5 },
        { name: 'n', size: 'medium', filename: 'n.gif', speed: 0.5 },
        { name: 'o', size: 'small', filename: 'o.gif', speed: 0.5 },
        { name: 'p', size: 'medium', filename: 'p.gif', speed: 0.5 },
        { name: 'q', size: 'large', filename: 'q.gif', speed: 0.5 },
        { name: 'r', size: 'medium', filename: 'r.gif', speed: 0.5 },
        { name: 's', size: 'small', filename: 's.gif', speed: 0.5 },
        { name: 't', size: 'medium', filename: 't.gif', speed: 0.5 },
        { name: 'u', size: 'small', filename: 'u.gif', speed: 0.5 },
        { name: 'v', size: 'medium', filename: 'v.gif', speed: 0.5 },
        { name: 'w', size: 'large', filename: 'w.gif', speed: 0.5 },
        { name: 'x', size: 'medium', filename: 'x.gif', speed: 0.5 },
        { name: 'y', size: 'small', filename: 'y.gif', speed: 0.5 },
        { name: 'z', size: 'medium', filename: 'z.gif', speed: 0.5 }
    ],
    
    activeCreatures: new Map(),
    activeAnimals: [],
    
    // GIF animals state
    gifAnimalState: {
        currentSequence: [],
        sequenceIndex: 0,
        isRunning: false,
        intervalId: null,
        lastScrollY: 0,
        scrollThreshold: 100
    },
    
    init() {
        // Prevent duplicate initialization
        if (this.initialized) {
            console.log('🦊 CreatureSystem already initialized, skipping');
            return;
        }
        
        console.log('🦊 Initializing CreatureSystem');
        this.initialized = true;
        
        this.initSubjectCreature();
        this.initWalkingAnimals();
        this.initGifAnimals();
        this.startAnimationLoop();
    },
    
    initSubjectCreature() {
        const subjectTitle = window.STUDENT_DATA?.subject?.toLowerCase() || '';
        let creatureType = 'star'; // default
        
        console.log(`📚 Subject: "${subjectTitle}"`);
        
        // Match subject to creature
        if (subjectTitle.includes('math')) creatureType = 'math-dragon';
        else if (subjectTitle.includes('science')) creatureType = 'science-owl';
        else if (subjectTitle.includes('english')) creatureType = 'english-butterfly';
        else if (subjectTitle.includes('social')) creatureType = 'social-science-dog';
        else creatureType = 'social-science-dog'; // Default to dog
        
        console.log(`🦊 Selected creature type: ${creatureType}`);
        
        // Find creature home
        const creatureHome = document.getElementById('creatureHome');
        if (creatureHome) {
            console.log('✅ Creature home found, creating creature');
            this.createCreature(creatureType, creatureHome);
        } else {
            console.log('❌ Creature home not found');
        }
    },
    
    createCreature(type, container) {
        // Check if creature already exists
        if (this.activeCreatures.has(type)) {
            console.log(`🦊 Creature ${type} already exists, skipping creation`);
            return;
        }
        
        const creatureData = this.creatures[type];
        if (!creatureData) return;
        
        console.log(`🦊 Creating creature: ${type}`);
        
        const creature = document.createElement('div');
        creature.className = 'subject-creature';
        creature.dataset.type = type;
        creature.dataset.creature = type; // Add this for lazy loader
        
        // Try to load external SVG first, fallback to generated
        this.loadCreatureSprite(type, creature, creatureData);
        
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

    async loadCreatureSprite(type, creature, creatureData) {
        const spriteUrl = `/assets/sprites/creatures/${type}.svg`;
        
        try {
            const response = await fetch(spriteUrl);
            if (response.ok) {
                const svgText = await response.text();
                creature.innerHTML = svgText;
                creature.classList.add('sprite-loaded');
                console.log(`🦊 Loaded creature sprite: ${type}`);
            } else {
                throw new Error(`Sprite not found: ${spriteUrl}`);
            }
        } catch (error) {
            console.log(`Using procedural generation for: ${type}`);
            // Fallback to generated SVG
            const svg = this.generateCreatureSVG(creatureData);
            creature.appendChild(svg);
            creature.classList.add('creature-fallback');
        }
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
                
            case 'dog':
                svg.innerHTML = `
                    <g class="dog-body">
                        <!-- Body -->
                        <ellipse cx="50" cy="65" rx="30" ry="18" fill="${creatureData.color}" stroke="#333" stroke-width="2"/>
                        <!-- Head -->
                        <circle cx="25" cy="50" r="15" fill="${creatureData.color}" stroke="#333" stroke-width="2"/>
                        <!-- Snout -->
                        <ellipse cx="15" cy="55" rx="8" ry="5" fill="${creatureData.color}" stroke="#333" stroke-width="2"/>
                        <!-- Ears -->
                        <ellipse cx="20" cy="40" rx="6" ry="12" fill="${creatureData.color}" stroke="#333" stroke-width="1" class="ear-left"/>
                        <ellipse cx="30" cy="40" rx="6" ry="12" fill="${creatureData.color}" stroke="#333" stroke-width="1" class="ear-right"/>
                        <!-- Eyes -->
                        <circle cx="20" cy="47" r="3" fill="#FFF" stroke="#333" stroke-width="1"/>
                        <circle cx="30" cy="47" r="3" fill="#FFF" stroke="#333" stroke-width="1"/>
                        <circle cx="20" cy="47" r="2" fill="#333" class="pupil-left"/>
                        <circle cx="30" cy="47" r="2" fill="#333" class="pupil-right"/>
                        <!-- Nose -->
                        <circle cx="15" cy="55" r="2" fill="#000"/>
                        <!-- Tail -->
                        <path d="M75 60 Q85 50 80 40 Q75 45 70 50" fill="${creatureData.color}" 
                              stroke="#333" stroke-width="2" class="tail"/>
                        <!-- Legs -->
                        <rect x="30" y="75" width="6" height="12" rx="3" fill="${creatureData.color}" stroke="#333" stroke-width="1" class="leg-1"/>
                        <rect x="40" y="75" width="6" height="12" rx="3" fill="${creatureData.color}" stroke="#333" stroke-width="1" class="leg-2"/>
                        <rect x="55" y="75" width="6" height="12" rx="3" fill="${creatureData.color}" stroke="#333" stroke-width="1" class="leg-3"/>
                        <rect x="65" y="75" width="6" height="12" rx="3" fill="${creatureData.color}" stroke="#333" stroke-width="1" class="leg-4"/>
                        
                        <!-- Social symbols -->
                        <g class="social-symbols" opacity="0">
                            <circle cx="50" cy="50" r="2" fill="#FFD700"/>
                            <text x="55" y="45" font-size="8" fill="#666">👥</text>
                            <text x="45" y="40" font-size="8" fill="#666">🏛️</text>
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
                
            case 'wag':
                if (type === 'social-science-dog') {
                    // Tail wag animation
                    const tail = svg.querySelector('.tail');
                    if (tail) {
                        tail.style.transformOrigin = '75% 60%';
                        tail.style.animation = 'dogTailWag 0.3s ease-in-out 8';
                    }
                    
                    // Show social symbols
                    const symbols = svg.querySelector('.social-symbols');
                    if (symbols) {
                        symbols.style.transition = 'opacity 1s';
                        symbols.style.opacity = '1';
                        
                        setTimeout(() => {
                            symbols.style.opacity = '0';
                        }, 2000);
                    }
                }
                break;
                
            case 'bark':
                if (type === 'social-science-dog') {
                    // Head bob animation
                    const head = svg.querySelector('circle[cx="25"][cy="50"]');
                    if (head) {
                        head.style.animation = 'dogBark 0.2s ease-in-out 6';
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
        if (!container) {
            console.log('❌ Animals container not found');
            return;
        }
        
        console.log('✅ Animals container found, initializing walking animals');
        
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
        
        console.log(`🦊 Spawning walking animal: ${animalData.name}`);
        
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
        
        console.log(`✅ Animal spawned: ${animalData.name}, total active: ${this.activeAnimals.length}`);
        
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
    
    // GIF Animals System
    initGifAnimals() {
        const container = document.getElementById('topAnimalsContainer');
        if (!container) {
            console.log('❌ Top animals container not found, creating it');
            this.createTopAnimalsContainer();
        }
        
        console.log('✅ Initializing GIF animals system');
        
        // Generate initial random sequence
        this.generateRandomSequence();
        
        // Start the animation sequence
        this.startGifAnimalsSequence();
        
        // Set up scroll-triggered animations
        this.initScrollTriggeredAnimals();
    },
    
    createTopAnimalsContainer() {
        const container = document.createElement('div');
        container.id = 'topAnimalsContainer';
        container.className = 'top-animals-container';
        document.body.appendChild(container);
        console.log('✅ Created top animals container');
    },
    
    generateRandomSequence() {
        // Create a shuffled copy of the gifAnimals array
        const shuffled = [...this.gifAnimals];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        this.gifAnimalState.currentSequence = shuffled;
        this.gifAnimalState.sequenceIndex = 0;
        
        console.log('🔀 Generated new random sequence:', shuffled.map(a => a.name));
    },
    
    startGifAnimalsSequence() {
        if (this.gifAnimalState.isRunning) return;
        
        this.gifAnimalState.isRunning = true;
        
        const playNextAnimal = () => {
            if (this.gifAnimalState.sequenceIndex >= this.gifAnimalState.currentSequence.length) {
                // Sequence finished, generate new random sequence
                console.log('🔄 Sequence finished, generating new random sequence');
                this.generateRandomSequence();
            }
            
            const animal = this.gifAnimalState.currentSequence[this.gifAnimalState.sequenceIndex];
            this.spawnGifAnimal(animal);
            
            this.gifAnimalState.sequenceIndex++;
            
            // Schedule next animal after 10 seconds
            this.gifAnimalState.intervalId = setTimeout(playNextAnimal, 10000); // 10 second interval
        };
        
        // Start the sequence
        playNextAnimal();
        
        console.log('🎬 Started GIF animals sequence');
    },
    
    stopGifAnimalsSequence() {
        if (this.gifAnimalState.intervalId) {
            clearTimeout(this.gifAnimalState.intervalId);
            this.gifAnimalState.intervalId = null;
        }
        this.gifAnimalState.isRunning = false;
        console.log('⏹️ Stopped GIF animals sequence');
    },
    
    spawnGifAnimal(animalData, scrollTriggered = false) {
        const container = document.getElementById('topAnimalsContainer');
        if (!container) return;
        
        console.log(`🦁 Spawning GIF animal: ${animalData.name} (speed: ${animalData.speed})`);
        
        const animalElement = document.createElement('div');
        animalElement.className = `gif-animal ${animalData.size}`;
        
        if (scrollTriggered) {
            animalElement.classList.add('scroll-triggered');
        }
        
        // Calculate animation duration based on speed
        const baseDuration = 8; // Base 8 seconds
        const speedMultiplier = animalData.speed || 1.0;
        const animationDuration = baseDuration / speedMultiplier;
        
        // Set custom animation duration using CSS custom property
        animalElement.style.setProperty('--animation-duration', `${animationDuration}s`);
        // Also set directly as fallback
        animalElement.style.animationDuration = `${animationDuration}s`;
        console.log(`🎯 Set animation duration: ${animationDuration}s for ${animalData.name}`);
        
        // Create image element
        const img = document.createElement('img');
        img.src = `../assets/sprites/animals/gifs/${animalData.filename}`;
        img.alt = animalData.name;
        img.draggable = false;
        
        // Handle image load error (fallback to placeholder or skip)
        img.onerror = () => {
            console.log(`⚠️ Could not load GIF: ${animalData.filename}`);
            animalElement.remove();
        };
        
        img.onload = () => {
            console.log(`✅ Loaded GIF: ${animalData.filename}`);
        };
        
        animalElement.appendChild(img);
        container.appendChild(animalElement);
        
        // Trigger animation
        setTimeout(() => {
            animalElement.classList.add('active');
        }, 10);
        
        // Clean up after animation completes (use calculated duration)
        const cleanupTime = (animationDuration * 1000) + 1000; // Add 1 second buffer
        setTimeout(() => {
            animalElement.remove();
        }, cleanupTime);
        
        // Play sound effect if available
        if (typeof AudioEngine !== 'undefined') {
            AudioEngine.playEffect('firefly-hover');
        }
    },
    
    initScrollTriggeredAnimals() {
        let lastScrollY = window.pageYOffset;
        let scrollVelocity = 0;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.pageYOffset;
            scrollVelocity = Math.abs(currentScrollY - lastScrollY);
            
            // Trigger animal on significant scroll
            if (scrollVelocity > this.gifAnimalState.scrollThreshold) {
                this.triggerScrollAnimal(scrollVelocity);
            }
            
            lastScrollY = currentScrollY;
        });
        
        console.log('📜 Initialized scroll-triggered animals');
    },
    
    triggerScrollAnimal(velocity) {
        // Don't trigger too frequently - 10 second cooldown
        const now = Date.now();
        if (now - (this.gifAnimalState.lastScrollTrigger || 0) < 10000) return;
        
        this.gifAnimalState.lastScrollTrigger = now;
        
        // Pick a random animal for scroll trigger
        const randomAnimal = this.gifAnimals[Math.floor(Math.random() * this.gifAnimals.length)];
        
        // Add speed class based on scroll velocity
        const scrollTriggered = velocity > this.gifAnimalState.scrollThreshold * 2;
        
        this.spawnGifAnimal(randomAnimal, scrollTriggered);
        
        console.log(`🏃 Scroll-triggered animal: ${randomAnimal.name} (velocity: ${velocity})`);
    },
    
    // Method to manually add a specific animal (for when you add new GIFs)
    addAnimalToSequence(letter) {
        const animal = this.gifAnimals.find(a => a.name === letter.toLowerCase());
        if (animal) {
            this.spawnGifAnimal(animal);
            console.log(`🎯 Manually spawned animal: ${letter}`);
            return true;
        } else {
            console.log(`❌ Animal not found: ${letter}`);
            return false;
        }
    },
    
    // Method to restart the sequence (useful for testing)
    restartGifSequence() {
        this.stopGifAnimalsSequence();
        this.generateRandomSequence();
        this.startGifAnimalsSequence();
        console.log('🔄 Restarted GIF animals sequence');
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
    
    @keyframes dogTailWag {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(20deg); }
        75% { transform: rotate(-20deg); }
    }
    
    @keyframes dogBark {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-3px); }
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
