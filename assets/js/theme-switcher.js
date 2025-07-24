// theme-switcher.js - Theme switching functionality

const ThemeSwitcher = {
    currentTheme: 'minimal',
    
    init() {
        console.log('🎨 Initializing theme switcher...');
        this.loadSavedTheme();
        this.createThemeToggle();
        this.applyTheme(this.currentTheme);
    },
    
    loadSavedTheme() {
        const savedTheme = localStorage.getItem('preferred-theme');
        if (savedTheme && (savedTheme === 'minimal' || savedTheme === 'purple')) {
            this.currentTheme = savedTheme;
        }
    },
    
    createThemeToggle() {
        // Create theme toggle button if it doesn't exist
        if (!document.querySelector('.theme-toggle')) {
            const toggle = document.createElement('button');
            toggle.className = 'theme-toggle';
            toggle.innerHTML = this.currentTheme === 'minimal' ? '🌙' : '✨';
            toggle.title = 'Switch theme';
            toggle.style.cssText = `
                position: fixed;
                top: 20px;
                right: 80px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                border: none;
                background: rgba(255, 255, 255, 0.9);
                backdrop-filter: blur(10px);
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                cursor: pointer;
                z-index: 1000;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
            `;
            
            toggle.addEventListener('click', () => {
                this.toggleTheme();
            });
            
            document.body.appendChild(toggle);
        }
    },
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'minimal' ? 'purple' : 'minimal';
        this.switchTheme(newTheme);
    },
    
    switchTheme(theme) {
        if (theme !== 'minimal' && theme !== 'purple') {
            console.error('Invalid theme:', theme);
            return;
        }
        
        console.log(`🎨 Switching to ${theme} theme...`);
        
        // Update HTML data attribute
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update theme stylesheet
        const themeStylesheet = document.getElementById('theme-stylesheet');
        if (themeStylesheet) {
            themeStylesheet.href = `assets/css/themes/${theme}.css`;
        }
        
        // Update toggle button
        const toggle = document.querySelector('.theme-toggle');
        if (toggle) {
            toggle.innerHTML = theme === 'minimal' ? '🌙' : '✨';
        }
        
        // Save preference
        localStorage.setItem('preferred-theme', theme);
        this.currentTheme = theme;
        
        // Add transition class
        document.body.classList.add('theme-transitioning');
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 300);
        
        console.log(`✅ Switched to ${theme} theme`);
    },
    
    applyTheme(theme) {
        // Set initial theme
        document.documentElement.setAttribute('data-theme', theme);
        
        // Load theme stylesheet
        const themeStylesheet = document.getElementById('theme-stylesheet');
        if (themeStylesheet) {
            themeStylesheet.href = `assets/css/themes/${theme}.css`;
        }
        
        console.log(`✅ Applied ${theme} theme`);
    }
};

// Auto-initialize if script is loaded
if (typeof window !== 'undefined') {
    window.ThemeSwitcher = ThemeSwitcher;
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            ThemeSwitcher.init();
        });
    } else {
        ThemeSwitcher.init();
    }
} 