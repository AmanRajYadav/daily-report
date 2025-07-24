// audio.js - Immersive audio landscape with natural sounds
const AudioEngine = {
    context: null,
    sources: {
        ambient: null,
        effects: {},
        music: null
    },
    
    sounds: {
        effects: {
            'firefly-click': { file: 'sparkle.mp3', volume: 0.6 },
            'firefly-hover': { file: 'magic-sparkle.mp3', volume: 0.4 },
            'fireworks': { file: 'sparkle.mp3', volume: 0.7 }
        }
    },
    
    state: {
        isPlaying: true,
        volume: 0.5
    },

    init() {
        // Load saved preferences
        const savedVolume = localStorage.getItem('audioVolume');
        if (savedVolume) {
            this.state.volume = parseFloat(savedVolume);
        }
        
        // Initialize audio context on user interaction
        this.initAudioContext();
    },

    initAudioContext() {
        // Create audio context only after user interaction
        const initAudio = () => {
            if (!this.context) {
                console.log('🎵 Initializing audio context...');
                this.context = new (window.AudioContext || window.webkitAudioContext)();
                
                // Preload effect sounds
                this.preloadEffects();
                
                // Remove event listeners after initialization
                document.removeEventListener('click', initAudio);
                document.removeEventListener('touchstart', initAudio);
                document.removeEventListener('keydown', initAudio);
                
                console.log('✅ Audio context initialized successfully');
            }
        };
        
        // Add event listeners for user interaction
        document.addEventListener('click', initAudio);
        document.addEventListener('touchstart', initAudio);
        document.addEventListener('keydown', initAudio);
    },


    preloadEffects() {
        Object.entries(this.sounds.effects).forEach(([key, effect]) => {
            const audio = new Audio(`../assets/sounds/effects/${effect.file}`);
            audio.volume = effect.volume;
            
            // Add error handling for missing effect files
            audio.addEventListener('error', (e) => {
                console.log(`🎵 Effect file not found: ${effect.file}`);
                delete this.sources.effects[key]; // Remove from sources if file is missing
            });
            
            this.sources.effects[key] = audio;
        });
    },

    playEffect(effectName) {
        if (!this.state.isPlaying) return;
        
        const effect = this.sources.effects[effectName];
        if (effect) {
            effect.currentTime = 0;
            effect.volume = this.sounds.effects[effectName].volume * this.state.volume;
            effect.play().catch(() => {});
        }
    }
};
