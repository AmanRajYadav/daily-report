// tree.js - A living tree that grows with each visit
const LearningTree = {
    canvas: null,
    ctx: null,
    
    config: {
        baseX: 60,
        baseY: 150,
        trunkWidth: 8,
        trunkHeight: 30,
        growthRate: 0.1,
        maxHeight: 120,
        leafSize: 5,
        fruitSize: 8,
        windStrength: 0.02
    },
    
    state: {
        visits: 1,
        growthStage: 'seed',
        height: 0,
        branches: [],
        leaves: [],
        fruits: [],
        flowers: [],
        animals: [],
        time: 0,
        season: 'spring'
    },
    
    stages: {
        seed: { minVisits: 0, name: 'Seed', height: 0 },
        sprout: { minVisits: 1, name: 'Sprout', height: 10 },
        sapling: { minVisits: 3, name: 'Sapling', height: 30 },
        youngTree: { minVisits: 7, name: 'Young Tree', height: 50 },
        tree: { minVisits: 14, name: 'Growing Tree', height: 70 },
        matureTree: { minVisits: 30, name: 'Mature Tree', height: 90 },
        ancientTree: { minVisits: 50, name: 'Ancient Tree', height: 120 }
    },

    init() {
        // Prevent duplicate initialization
        if (this.initialized) {
            console.log('🌳 LearningTree already initialized, skipping');
            return;
        }
        
        console.log('🌳 Initializing LearningTree');
        this.initialized = true;
        
        // If canvas creation fails, abort initialization
        if (this.createCanvas() === false) {
            console.log('🌳 LearningTree initialization aborted - no container');
            return;
        }
        
        this.loadProgress();
        this.determineStage();
        this.generateTree();
        this.animate();
        this.updateDisplay();
    },

    createCanvas() {
        const container = document.getElementById('learningTree');
        if (!container) {
            console.log('❌ LearningTree container not found');
            this.initialized = false; // Reset initialization flag
            return false;
        }
        
        // Check if canvas already exists
        if (container.querySelector('canvas')) {
            console.log('✅ Canvas already exists in container');
            this.canvas = container.querySelector('canvas');
            this.ctx = this.canvas.getContext('2d');
            return true;
        }
        
        console.log('✅ Creating LearningTree canvas');
        this.canvas = document.createElement('canvas');
        this.canvas.width = 120;
        this.canvas.height = 150;
        this.ctx = this.canvas.getContext('2d');
        
        container.appendChild(this.canvas);
    },

    loadProgress() {
        const studentId = window.STUDENT_DATA?.id || 'default';
        const savedVisits = parseInt(localStorage.getItem(`visits_${studentId}`) || '0');
        this.state.visits = savedVisits + 1;
        
        // Save new visit count
        localStorage.setItem(`visits_${studentId}`, this.state.visits);
        
        // Load other saved data
        const savedTree = localStorage.getItem(`tree_${studentId}`);
        if (savedTree) {
            const treeData = JSON.parse(savedTree);
            this.state = { ...this.state, ...treeData, visits: this.state.visits };
        }
    },

    saveProgress() {
        const studentId = window.STUDENT_DATA?.id || 'default';
        const treeData = {
            growthStage: this.state.growthStage,
            height: this.state.height,
            branches: this.state.branches.length,
            leaves: this.state.leaves.length,
            fruits: this.state.fruits.length
        };
        localStorage.setItem(`tree_${studentId}`, JSON.stringify(treeData));
    },

    determineStage() {
        let newStage = 'seed';
        
        for (const [key, stage] of Object.entries(this.stages)) {
            if (this.state.visits >= stage.minVisits) {
                newStage = key;
            }
        }
        
        if (newStage !== this.state.growthStage) {
            this.state.growthStage = newStage;
            this.onStageChange(newStage);
        }
        
        // Update height based on stage
        const targetHeight = this.stages[newStage].height;
        this.state.height = targetHeight;
    },

    onStageChange(newStage) {
        // Celebration for growth
        if (newStage !== 'seed') {
            this.celebrate();
        }
        
        // Update display
        const stageNameEl = document.getElementById('treeStageName');
        if (stageNameEl) {
            stageNameEl.textContent = this.stages[newStage].name;
        }
    },

    celebrate() {
        // Visual celebration
        const particles = [];
        for (let i = 0; i < 20; i++) {
            particles.push({
                x: this.config.baseX + (Math.random() - 0.5) * 60,
                y: this.config.baseY - this.state.height - 20,
                vx: (Math.random() - 0.5) * 2,
                vy: -Math.random() * 3 - 1,
                color: `hsl(${Math.random() * 360}, 70%, 60%)`,
                life: 1
            });
        }
        
        // Animate celebration particles
        const animateParticles = () => {
            particles.forEach((p, index) => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.1;
                p.life -= 0.02;
                
                if (p.life <= 0) {
                    particles.splice(index, 1);
                }
            });
            
            if (particles.length > 0) {
                requestAnimationFrame(animateParticles);
            }
        };
        
        animateParticles();
        
        // Play growth sound
        AudioEngine.playEffect('achievement');
    },

    generateTree() {
        // Clear previous tree
        this.state.branches = [];
        this.state.leaves = [];
        this.state.fruits = [];
        this.state.flowers = [];
        
        if (this.state.height <= 0) return;
        
        // Generate trunk
        const trunk = {
            startX: this.config.baseX,
            startY: this.config.baseY,
            endX: this.config.baseX,
            endY: this.config.baseY - this.state.height,
            width: this.config.trunkWidth,
            level: 0
        };
        
        // Generate branches recursively
        if (this.state.height > 20) {
            this.generateBranches(trunk, 0);
        }
        
        // Add leaves
        if (this.state.height > 30) {
            this.generateLeaves();
        }
        
        // Add flowers (spring)
        if (this.state.height > 40 && this.state.season === 'spring') {
            this.generateFlowers();
        }
        
        // Add fruits (summer/autumn)
        if (this.state.height > 50 && (this.state.season === 'summer' || this.state.season === 'autumn')) {
            this.generateFruits();
        }
        
        // Add animals for mature trees
        if (this.state.height > 70) {
            this.generateAnimals();
        }
        
        this.saveProgress();
    },

    generateBranches(parent, level) {
        if (level > 3 || parent.endY < 20) return;
        
        const branchCount = 2 + Math.floor(Math.random() * 2);
        
        for (let i = 0; i < branchCount; i++) {
            const angle = (Math.random() - 0.5) * Math.PI / 2;
            const length = (parent.width * 5) * (0.7 - level * 0.1);
            
            const branch = {
                startX: parent.endX,
                startY: parent.endY + (Math.random() * 10),
                endX: parent.endX + Math.cos(angle) * length,
                endY: parent.endY - Math.abs(Math.sin(angle)) * length,
                width: parent.width * 0.7,
                level: level + 1,
                angle: angle,
                swayOffset: Math.random() * Math.PI * 2
            };
            
            this.state.branches.push(branch);
            
            // Recursive branching
            if (Math.random() > 0.3) {
                this.generateBranches(branch, level + 1);
            }
        }
    },

    generateLeaves() {
        this.state.branches.forEach(branch => {
            if (branch.level > 1 && Math.random() > 0.3) {
                const leafCount = 3 + Math.floor(Math.random() * 5);
                
                for (let i = 0; i < leafCount; i++) {
                    const t = Math.random();
                    const x = branch.startX + (branch.endX - branch.startX) * t;
                    const y = branch.startY + (branch.endY - branch.startY) * t;
                    
                    this.state.leaves.push({
                        x: x + (Math.random() - 0.5) * 10,
                        y: y + (Math.random() - 0.5) * 10,
                        size: this.config.leafSize + Math.random() * 3,
                        color: this.getLeafColor(),
                        swayOffset: Math.random() * Math.PI * 2,
                        fallTime: this.state.season === 'autumn' ? Math.random() * 1000 : null
                    });
                }
            }
        });
    },

    generateFlowers() {
        this.state.branches.forEach(branch => {
            if (branch.level > 1 && Math.random() > 0.7) {
                this.state.flowers.push({
                    x: branch.endX + (Math.random() - 0.5) * 10,
                    y: branch.endY + (Math.random() - 0.5) * 10,
                    size: 6 + Math.random() * 4,
                    petals: 5 + Math.floor(Math.random() * 3),
                    color: `hsl(${300 + Math.random() * 60}, 70%, 70%)`,
                    swayOffset: Math.random() * Math.PI * 2
                });
            }
        });
    },

    generateFruits() {
        this.state.branches.forEach(branch => {
            if (branch.level > 1 && Math.random() > 0.8) {
                this.state.fruits.push({
                    x: branch.endX,
                    y: branch.endY + 5,
                    size: this.config.fruitSize,
                    color: this.state.season === 'summer' ? '#FF6B6B' : '#FFA500',
                    ripe: Math.random() > 0.5,
                    swayOffset: Math.random() * Math.PI * 2
                });
            }
        });
    },

    generateAnimals() {
        // Birds in branches
        if (Math.random() > 0.5) {
            const branch = this.state.branches[Math.floor(Math.random() * this.state.branches.length)];
            if (branch) {
                this.state.animals.push({
                    type: 'bird',
                    x: branch.endX,
                    y: branch.endY - 5,
                    size: 8,
                    color: '#4ECDC4',
                    animation: 'perched'
                });
            }
        }
        
        // Butterfly near flowers
        if (this.state.flowers.length > 0 && Math.random() > 0.6) {
            const flower = this.state.flowers[Math.floor(Math.random() * this.state.flowers.length)];
            this.state.animals.push({
                type: 'butterfly',
                x: flower.x,
                y: flower.y - 10,
                size: 10,
                targetFlower: flower,
                animation: 'flying'
            });
        }
    },

    getLeafColor() {
        const colors = {
            spring: ['#90EE90', '#98FB98', '#7CFC00'],
            summer: ['#228B22', '#006400', '#2E8B57'],
            autumn: ['#FF8C00', '#FF6347', '#FFD700', '#DC143C'],
            winter: ['#8B7355', '#A0522D']
        };
        
        const seasonColors = colors[this.state.season] || colors.spring;
        return seasonColors[Math.floor(Math.random() * seasonColors.length)];
    },

    animate() {
        // Check if context exists before animating
        if (!this.ctx || !this.canvas) {
            console.log('⚠️ Tree animation skipped - no canvas context');
            return;
        }
        
        this.state.time += 0.02;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw shadow
        this.drawShadow();
        
        // Draw trunk
        this.drawTrunk();
        
        // Draw branches with sway
        this.drawBranches();
        
        // Draw leaves
        this.drawLeaves();
        
        // Draw flowers
        this.drawFlowers();
        
        // Draw fruits
        this.drawFruits();
        
        // Draw animals
        this.drawAnimals();
        
        // Draw growth particles
        if (this.state.growthStage !== 'seed') {
            this.drawGrowthParticles();
        }
        
        requestAnimationFrame(() => this.animate());
    },

    drawShadow() {
        const gradient = this.ctx.createRadialGradient(
            this.config.baseX, this.config.baseY,
            0,
            this.config.baseX, this.config.baseY,
            this.state.height * 0.5
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, this.config.baseY - 5, this.canvas.width, 10);
    },

    drawTrunk() {
        if (this.state.height <= 0) return;
        
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = this.config.trunkWidth;
        this.ctx.lineCap = 'round';
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.config.baseX, this.config.baseY);
        this.ctx.lineTo(this.config.baseX, this.config.baseY - this.state.height);
        this.ctx.stroke();
    },

    drawBranches() {
        this.state.branches.forEach(branch => {
            const sway = Math.sin(this.state.time + branch.swayOffset) * this.config.windStrength * branch.level;
            
            this.ctx.strokeStyle = '#8B4513';
            this.ctx.lineWidth = branch.width;
            this.ctx.lineCap = 'round';
            
            this.ctx.beginPath();
            this.ctx.moveTo(branch.startX, branch.startY);
            this.ctx.lineTo(branch.endX + sway * 10, branch.endY);
            this.ctx.stroke();
        });
    },

    drawLeaves() {
        this.state.leaves.forEach((leaf, index) => {
            const sway = Math.sin(this.state.time * 2 + leaf.swayOffset) * 2;
            
            // Falling leaves in autumn
            if (leaf.fallTime && this.state.time * 100 > leaf.fallTime) {
                leaf.y += 0.5;
                leaf.x += Math.sin(leaf.y * 0.1) * 0.5;
                
                if (leaf.y > this.config.baseY) {
                    this.state.leaves.splice(index, 1);
                    return;
                }
            }
            
            this.ctx.fillStyle = leaf.color;
            this.ctx.beginPath();
            this.ctx.ellipse(
                leaf.x + sway,
                leaf.y,
                leaf.size,
                leaf.size * 0.7,
                Math.sin(this.state.time + leaf.swayOffset) * 0.2,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
        });
    },

    drawFlowers() {
        this.state.flowers.forEach(flower => {
            const sway = Math.sin(this.state.time + flower.swayOffset) * 2;
            
            // Draw petals
            for (let i = 0; i < flower.petals; i++) {
                const angle = (i / flower.petals) * Math.PI * 2;
                const petalX = flower.x + sway + Math.cos(angle) * flower.size * 0.5;
                const petalY = flower.y + Math.sin(angle) * flower.size * 0.5;
                
                this.ctx.fillStyle = flower.color;
                this.ctx.beginPath();
                this.ctx.arc(petalX, petalY, flower.size * 0.4, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            // Draw center
            this.ctx.fillStyle = '#FFD700';
            this.ctx.beginPath();
            this.ctx.arc(flower.x + sway, flower.y, flower.size * 0.3, 0, Math.PI * 2);
            this.ctx.fill();
        });
    },

    drawFruits() {
        this.state.fruits.forEach(fruit => {
            const sway = Math.sin(this.state.time + fruit.swayOffset) * 3;
            
            this.ctx.fillStyle = fruit.color;
            this.ctx.beginPath();
            this.ctx.arc(fruit.x + sway, fruit.y, fruit.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Shine effect
            if (fruit.ripe) {
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                this.ctx.beginPath();
                this.ctx.arc(
                    fruit.x + sway - fruit.size * 0.3,
                    fruit.y - fruit.size * 0.3,
                    fruit.size * 0.3,
                    0,
                    Math.PI * 2
                );
                this.ctx.fill();
            }
        });
    },

    drawAnimals() {
        this.state.animals.forEach(animal => {
            if (animal.type === 'bird') {
                // Simple bird shape
                this.ctx.fillStyle = animal.color;
                this.ctx.beginPath();
                this.ctx.arc(animal.x, animal.y, animal.size * 0.6, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Beak
                this.ctx.fillStyle = '#FFA500';
                this.ctx.beginPath();
                this.ctx.moveTo(animal.x + animal.size * 0.6, animal.y);
                this.ctx.lineTo(animal.x + animal.size, animal.y);
                this.ctx.lineTo(animal.x + animal.size * 0.6, animal.y + 2);
                this.ctx.closePath();
                this.ctx.fill();
                
                // Eye
                this.ctx.fillStyle = '#000';
                this.ctx.beginPath();
                this.ctx.arc(animal.x + 2, animal.y - 2, 1, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Animate chirping
                if (Math.sin(this.state.time * 5) > 0.9) {
                    // Musical note
                    this.ctx.fillStyle = '#4ECDC4';
                    this.ctx.font = '10px sans-serif';
                    this.ctx.fillText('♪', animal.x + 10, animal.y - 5);
                }
            } else if (animal.type === 'butterfly') {
                // Animate flying pattern
                const flyPattern = Math.sin(this.state.time * 3);
                animal.x += Math.cos(this.state.time * 2) * 0.5;
                animal.y += flyPattern * 0.3;
                
                // Draw butterfly
                const wingSpread = Math.abs(Math.sin(this.state.time * 10)) * 0.5 + 0.5;
                
                // Wings
                this.ctx.fillStyle = 'rgba(255, 105, 180, 0.8)';
                this.ctx.beginPath();
                this.ctx.ellipse(animal.x - 5, animal.y, 5 * wingSpread, 3, -0.2, 0, Math.PI * 2);
                this.ctx.ellipse(animal.x + 5, animal.y, 5 * wingSpread, 3, 0.2, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Body
                this.ctx.fillStyle = '#333';
                this.ctx.fillRect(animal.x - 1, animal.y - 3, 2, 6);
            }
        });
    },

    drawGrowthParticles() {
        // Magical sparkles around the tree
        for (let i = 0; i < 3; i++) {
            const particleTime = (this.state.time * 0.5 + i) % 1;
            const y = this.config.baseY - particleTime * this.state.height;
            const x = this.config.baseX + Math.sin(particleTime * Math.PI * 4 + i) * 20;
            const opacity = 1 - particleTime;
            
            this.ctx.fillStyle = `rgba(255, 255, 100, ${opacity * 0.5})`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 2, 0, Math.PI * 2);
            this.ctx.fill();
        }
    },

    updateDisplay() {
        const visitNumberEl = document.getElementById('visitNumber');
        if (visitNumberEl) {
            visitNumberEl.textContent = this.state.visits;
        }
        
        const stageNameEl = document.getElementById('treeStageName');
        if (stageNameEl) {
            stageNameEl.textContent = this.stages[this.state.growthStage].name;
        }
    }
};
