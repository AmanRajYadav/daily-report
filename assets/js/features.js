// features.js - New features for the Learning Universe
const Features = {
    streak: {
        current: 0,
        lastVisit: null
    },
    
    init() {
        console.log('🌟 Initializing new features...');
        this.initStreakSystem();
        this.initNameAnimation();
        this.initGrassGraphics();
        this.updateHeadingIcons();
        this.removeMainPageIcon();
    },
    
    // Streak System
    initStreakSystem() {
        // Calculate streak using provided logic
        const today = new Date().toDateString();
        const lastVisit = localStorage.getItem('lastVisit');
        let streak = parseInt(localStorage.getItem('streak') || '0');
        
        if (lastVisit !== today) {
            const yesterday = new Date(Date.now() - 86400000).toDateString();
            if (lastVisit === yesterday) {
                streak++;
            } else {
                streak = 1;
            }
            localStorage.setItem('streak', streak);
            localStorage.setItem('lastVisit', today);
        }
        
        this.streak.current = streak;
        this.streak.lastVisit = lastVisit;
        
        // Create streak counter UI
        this.createStreakCounter();
        
        console.log(`🔥 Streak: ${streak} days`);
    },
    
    createStreakCounter() {
        const streakCounter = document.createElement('div');
        streakCounter.className = 'streak-counter';
        streakCounter.innerHTML = `
            <span class="streak-fire">🔥</span>
            <span class="streak-number">${this.streak.current}</span>
        `;
        
        document.body.appendChild(streakCounter);
        
        // Add click animation
        streakCounter.addEventListener('click', () => {
            streakCounter.style.animation = 'none';
            setTimeout(() => {
                streakCounter.style.animation = '';
            }, 10);
        });
        
        console.log('✅ Streak counter created');
    },
    
    // Name Animation
    initNameAnimation() {
        const nameElement = document.querySelector('.student-name');
        if (!nameElement) return;
        
        nameElement.addEventListener('click', () => {
            this.animateName(nameElement);
        });
        
        // Make it obvious it's clickable
        nameElement.style.cursor = 'pointer';
        nameElement.title = 'Click to see magic!';
        
        console.log('✅ Name animation initialized');
    },
    
    animateName(nameElement) {
        // Fall apart animation
        nameElement.classList.add('name-fall-apart');
        
        // Play sound effect
        if (typeof AudioEngine !== 'undefined') {
            AudioEngine.playEffect('firefly-click');
        }
        
        // Reassemble after fall apart completes
        setTimeout(() => {
            nameElement.classList.remove('name-fall-apart');
            nameElement.classList.add('name-reassemble');
            
            // Play reassemble sound
            setTimeout(() => {
                if (typeof AudioEngine !== 'undefined') {
                    AudioEngine.playEffect('fireworks');
                }
            }, 200);
            
            // Clean up animation class
            setTimeout(() => {
                nameElement.classList.remove('name-reassemble');
            }, 800);
        }, 500);
        
        console.log('✨ Name animation triggered');
    },
    
    // Grass Graphics
    initGrassGraphics() {
        const grassContainer = document.createElement('div');
        grassContainer.className = 'grass-container';
        
        const grassSVG = this.createGrassSVG();
        grassContainer.appendChild(grassSVG);
        
        document.body.appendChild(grassContainer);
        
        console.log('✅ Grass graphics added');
    },
    
    createGrassSVG() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 1200 60');
        svg.setAttribute('class', 'grass-svg');
        svg.setAttribute('preserveAspectRatio', 'none');
        
        // Create multiple grass blade paths
        const grassPaths = [];
        const grassColors = ['#4ade80', '#22c55e', '#16a34a', '#15803d'];
        
        // Generate grass blades
        for (let i = 0; i < 1200; i += 8) {
            const height = Math.random() * 30 + 20;
            const bend = (Math.random() - 0.5) * 10;
            const color = grassColors[Math.floor(Math.random() * grassColors.length)];
            
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', `M${i} 60 Q${i + bend} ${60 - height/2} ${i + bend*2} ${60 - height} Q${i + bend} ${60 - height/2} ${i + 2} 60`);
            path.setAttribute('fill', color);
            path.setAttribute('opacity', Math.random() * 0.3 + 0.7);
            
            svg.appendChild(path);
        }
        
        // Add some flowers
        for (let i = 50; i < 1200; i += 100 + Math.random() * 100) {
            const flower = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            flower.setAttribute('cx', i);
            flower.setAttribute('cy', 45 - Math.random() * 10);
            flower.setAttribute('r', 2);
            flower.setAttribute('fill', ['#fbbf24', '#f59e0b', '#ec4899', '#ef4444'][Math.floor(Math.random() * 4)]);
            svg.appendChild(flower);
        }
        
        return svg;
    },
    
    // Update Heading Icons
    updateHeadingIcons() {
        const subjectMappings = {
            'math': '🔢',
            'science': '🔬',
            'english': '📚',
            'social': '🌍',
            'history': '🏛️',
            'art': '🎨',
            'music': '🎵',
            'pe': '⚽',
            'computer': '💻'
        };
        
        // Update section icons in content cards
        document.querySelectorAll('.section-icon svg').forEach(iconSvg => {
            const card = iconSvg.closest('.content-card');
            if (!card) return;
            
            // Look for subject clues in the card
            const subjectBadge = card.querySelector('.subject-badge');
            if (subjectBadge) {
                const subjectText = subjectBadge.textContent.toLowerCase();
                
                for (const [subject, emoji] of Object.entries(subjectMappings)) {
                    if (subjectText.includes(subject)) {
                        const iconContainer = iconSvg.parentElement;
                        iconContainer.innerHTML = `<span style="font-size: 2rem;">${emoji}</span>`;
                        break;
                    }
                }
            }
        });
        
        // Update other common icons
        document.querySelectorAll('.section-icon').forEach(icon => {
            const title = icon.nextElementSibling?.textContent.toLowerCase();
            if (title?.includes('reflection')) {
                icon.innerHTML = '<span style="font-size: 2rem;">💭</span>';
            } else if (title?.includes('mission') || title?.includes('activity')) {
                icon.innerHTML = '<span style="font-size: 2rem;">🎯</span>';
            } else if (title?.includes('parent') || title?.includes('report')) {
                icon.innerHTML = '<span style="font-size: 2rem;">📊</span>';
            }
        });
        
        console.log('✅ Heading icons updated with emojis');
    },
    
    // Remove Main Page Icon
    removeMainPageIcon() {
        // Look for large centered icons that might be the "A" icon
        const possibleIcons = document.querySelectorAll('svg, .icon, [class*="icon"]');
        
        possibleIcons.forEach(icon => {
            // Check if it's a large centered element that could be the main "A" icon
            const style = window.getComputedStyle(icon);
            const parent = icon.parentElement;
            const parentStyle = parent ? window.getComputedStyle(parent) : null;
            
            // Look for characteristics of a main page icon
            if (
                (icon.tagName === 'SVG' || icon.classList.contains('icon')) &&
                (style.width === '150px' || style.height === '150px' ||
                 parentStyle?.textAlign === 'center' && parent?.classList.contains('hero'))
            ) {
                icon.style.display = 'none';
                console.log('✅ Removed main page icon');
            }
        });
        
        // Also check for any elements with "A" as content in hero section
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            const textNodes = this.getTextNodes(heroSection);
            textNodes.forEach(node => {
                if (node.textContent.trim() === 'A' && node.parentElement) {
                    const parent = node.parentElement;
                    const style = window.getComputedStyle(parent);
                    if (parseInt(style.fontSize) > 100) {
                        parent.style.display = 'none';
                        console.log('✅ Removed large "A" text');
                    }
                }
            });
        }
    },
    
    getTextNodes(element) {
        const textNodes = [];
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }
        
        return textNodes;
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Features.init());
} else {
    Features.init();
}