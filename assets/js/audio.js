// audio.js - Immersive audio landscape with natural sounds
const AudioEngine = {
    context: null,
    sources: {
        ambient: null,
        effects: {},
        music: null
    },
    
    sounds: {
        ambient: {
            'morning-forest': {
                layers: [
                    { file: 'birds-chirping.mp3', volume: 0.6, fadeIn: 2000 },
                    { file: 'gentle-breeze.mp3', volume: 0.3, fadeIn: 3000 },
                    { file: 'distant-stream.mp3', volume: 0.4, fadeIn: 4000 }
                ]
            },
            'afternoon-meadow': {
                layers: [
                    { file: 'bees-buzzing.mp3', volume: 0.3, fadeIn: 2000 },
                    { file: 'grass-rustle.mp3', volume: 0.4, fadeIn: 3000 },
                    { file: 'wind-chimes.mp3', volume: 0.2, fadeIn: 4000 }
                ]
            },
            'evening-garden': {
                layers: [
                    { file: 'crickets.mp3', volume: 0.5, fadeIn: 2000 },
                    { file: 'evening-birds.mp3', volume: 0.3, fadeIn: 3000 },
                    { file: 'bamboo-water.mp3', volume: 0.4, fadeIn: 4000 }
                ]
            },
            'night-sky': {
                layers: [
                    { file: 'night-ambience.mp3', volume: 0.4, fadeIn: 2000 },
                    { file: 'owl-hoots.mp3', volume: 0.2, fadeIn: 5000 },
                    { file: 'fireflies.mp3', volume: 0.3, fadeIn: 3000 }
                ]
            }
        },
        
        effects: {
            'page-turn': { file: 'paper-rustle.mp3', volume: 0.5 },
            'sparkle': { file: 'magic-sparkle.mp3', volume: 0.6 },
            'chime': { file: 'soft-chime.mp3', volume: 0.4 },
            'notification': { file: 'gentle-bell.mp3', volume: 0.5 },
            'welcome-chime': { file: 'welcome-melody.mp3', volume: 0.6 },
            'magic-sparkle': { file: 'stardust.mp3', volume: 0.7 },
            'achievement': { file: 'achievement.mp3', volume: 0.6 },
            'click': { file: 'soft-click.mp3', volume: 0.3 },
            'hover': { file: 'subtle-hover.mp3', volume: 0.2 }
        },
        
        musical: {
            notes: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5']
        }
    },
    
    state: {
        isPlaying: true,
        currentAmbient: null,
        volume: 0.5,
        speechSynth: null,
        isSpeaking: false
    },

    init() {
        // Create audio context
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        
        // Initialize speech synthesis
        this.state.speechSynth = window.speechSynthesis;
        
        // Load saved preferences
        const savedVolume = localStorage.getItem('audioVolume');
        if (savedVolume) {
            this.state.volume = parseFloat(savedVolume);
        }
        
        // Set up volume control
        this.initVolumeControl();
        
        // Start ambient sounds based on time
        this.startAmbientSounds();
        
        // Initialize spatial audio for scroll
        this.initSpatialAudio();
        
        // Preload effect sounds
        this.preloadEffects();
        
        // Set up ambient toggle
        this.initAmbientToggle();
    },

    initVolumeControl() {
        const volumeControl = document.getElementById('volumeControl');
        if (volumeControl) {
            volumeControl.value = this.state.volume * 100;
            
            volumeControl.addEventListener('input', (e) => {
                this.state.volume = e.target.value / 100;
                this.updateVolume();
                localStorage.setItem('audioVolume', this.state.volume);
            });
        }
    },

    updateVolume() {
        // Update all playing sounds
        if (this.sources.ambient) {
            Object.values(this.sources.ambient).forEach(source => {
                if (source.gainNode) {
                    source.gainNode.gain.setTargetAtTime(
                        source.baseVolume * this.state.volume,
                        this.context.currentTime,
                        0.5
                    );
                }
            });
        }
    },

    startAmbientSounds() {
        // Determine which ambient sound to play based on time
        const timeOfDay = Universe.state.timeOfDay || 'morning';
        const ambientKey = `${timeOfDay}-${this.getEnvironment()}`;
        const ambientConfig = this.sounds.ambient[ambientKey] || this.sounds.ambient['morning-forest'];
        
        // Stop current ambient if playing
        if (this.state.currentAmbient) {
            this.stopAmbient();
        }
        
        // Create layered ambient soundscape
        this.sources.ambient = {};
        
        ambientConfig.layers.forEach((layer, index) => {
            this.loadAndPlayAmbient(layer, index);
        });
        
        this.state.currentAmbient = ambientKey;
    },

    loadAndPlayAmbient(layer, index) {
        const audio = new Audio(`../assets/sounds/ambient/${layer.file}`);
        audio.loop = true;
        
        const source = this.context.createMediaElementSource(audio);
        const gainNode = this.context.createGain();
        const pannerNode = this.context.createStereoPanner();
        
        // Create audio graph
        source.connect(gainNode);
        gainNode.connect(pannerNode);
        pannerNode.connect(this.context.destination);
        
        // Set initial volume to 0 for fade in
        gainNode.gain.value = 0;
        
        // Store nodes
        this.sources.ambient[`layer${index}`] = {
            audio,
            source,
            gainNode,
            pannerNode,
            baseVolume: layer.volume
        };
        
        // Start playback
        audio.play().then(() => {
            // Fade in
            gainNode.gain.setTargetAtTime(
                layer.volume * this.state.volume,
                this.context.currentTime,
                layer.fadeIn / 1000
            );
        }).catch(e => {
            console.log('Audio autoplay prevented, will play on user interaction');
        });
        
        // Add subtle panning movement
        this.animatePanning(pannerNode, index);
    },

    animatePanning(pannerNode, index) {
        const time = this.context.currentTime;
        const frequency = 0.1 + (index * 0.05); // Different frequencies for each layer
        
        const animate = () => {
            const pan = Math.sin(this.context.currentTime * frequency) * 0.3;
            pannerNode.pan.setTargetAtTime(pan, this.context.currentTime, 0.5);
            
            if (this.state.isPlaying) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    },

    getEnvironment() {
        // Could be extended to detect actual environment/season
        const season = Universe.state.currentSeason || 'spring';
        
        switch (season) {
            case 'spring': return 'forest';
            case 'summer': return 'meadow';
            case 'autumn': return 'garden';
            case 'winter': return 'sky';
            default: return 'forest';
        }
    },

    stopAmbient() {
        if (this.sources.ambient) {
            Object.values(this.sources.ambient).forEach(source => {
                if (source.audio) {
                    source.gainNode.gain.setTargetAtTime(0, this.context.currentTime, 1);
                    setTimeout(() => {
                        source.audio.pause();
                        source.audio.remove();
                    }, 1000);
                }
            });
            
            this.sources.ambient = null;
        }
    },

    preloadEffects() {
        Object.entries(this.sounds.effects).forEach(([key, effect]) => {
            const audio = new Audio(`../assets/sounds/effects/${effect.file}`);
            audio.volume = effect.volume;
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
        } else {
            // If not preloaded, create synthesized sound
            this.synthesizeEffect(effectName);
        }
    },

    synthesizeEffect(effectName) {
        const osc = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        osc.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        const now = this.context.currentTime;
        
        switch (effectName) {
            case 'click':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, now);
                gainNode.gain.setValueAtTime(0.1 * this.state.volume, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;
                
            case 'hover':
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(1200, now);
                gainNode.gain.setValueAtTime(0.05 * this.state.volume, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
                break;
                
            case 'sparkle':
                // Create sparkle sound with multiple oscillators
                for (let i = 0; i < 3; i++) {
                    const sparkleOsc = this.context.createOscillator();
                    const sparkleGain = this.context.createGain();
                    
                    sparkleOsc.connect(sparkleGain);
                    sparkleGain.connect(this.context.destination);
                    
                    sparkleOsc.type = 'sine';
                    sparkleOsc.frequency.setValueAtTime(2000 + (i * 500), now);
                    sparkleGain.gain.setValueAtTime(0.1 * this.state.volume, now + (i * 0.1));
                    sparkleGain.gain.exponentialRampToValueAtTime(0.01, now + 0.5 + (i * 0.1));
                    
                    sparkleOsc.start(now + (i * 0.1));
                    sparkleOsc.stop(now + 0.5 + (i * 0.1));
                }
                break;
        }
    },

    initSpatialAudio() {
        // Create audio nodes that respond to scroll position
        let lastScrollY = 0;
        
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const scrollProgress = scrollY / maxScroll;
            
            // Adjust ambient layers based on scroll
            if (this.sources.ambient) {
                Object.entries(this.sources.ambient).forEach(([key, source], index) => {
                    if (source.pannerNode) {
                        // Create depth effect with scroll
                        const pan = (scrollProgress - 0.5) * 2 * (index % 2 === 0 ? 1 : -1) * 0.5;
                        source.pannerNode.pan.setTargetAtTime(pan, this.context.currentTime, 0.5);
                    }
                });
            }
            
            // Play subtle scroll sound if scrolling fast
            if (Math.abs(scrollY - lastScrollY) > 50) {
                this.playScrollSound(scrollProgress);
            }
            
            lastScrollY = scrollY;
        });
    },

    playScrollSound(progress) {
        const osc = this.context.createOscillator();
        const gainNode = this.context.createGain();
        const filter = this.context.createBiquadFilter();
        
        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        osc.type = 'sine';
        osc.frequency.value = 200 + (progress * 300);
        
        filter.type = 'lowpass';
        filter.frequency.value = 1000;
        
        gainNode.gain.setValueAtTime(0.02 * this.state.volume, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.1);
        
        osc.start();
        osc.stop(this.context.currentTime + 0.1);
    },

    speak(text, options = {}) {
        if (!this.state.speechSynth) return;
        
        // Stop current speech
        this.stopSpeaking();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Configure voice
        const voices = this.state.speechSynth.getVoices();
        const preferredVoice = voices.find(voice => 
            voice.name.includes('Google') || 
            voice.name.includes('Microsoft') ||
            (voice.lang.includes('en') && voice.name.includes('Female'))
        );
        
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }
        
        // Set properties
        utterance.rate = options.rate || 0.9;
        utterance.pitch = options.pitch || 1.1;
        utterance.volume = this.state.volume;
        
        // Events
        utterance.onstart = () => {
            this.state.isSpeaking = true;
            this.playEffect('chime');
        };
        
        utterance.onend = () => {
            this.state.isSpeaking = false;
        };
        
        // Speak
        this.state.speechSynth.speak(utterance);
    },

    stopSpeaking() {
        if (this.state.speechSynth && this.state.isSpeaking) {
            this.state.speechSynth.cancel();
            this.state.isSpeaking = false;
        }
    },

    initAmbientToggle() {
        const ambientToggle = document.getElementById('ambientToggle');
        if (ambientToggle) {
            ambientToggle.addEventListener('click', () => {
                if (this.state.isPlaying) {
                    this.pause();
                    ambientToggle.classList.remove('active');
                } else {
                    this.resume();
                    ambientToggle.classList.add('active');
                }
            });
        }
    },

    pause() {
        this.state.isPlaying = false;
        
        if (this.sources.ambient) {
            Object.values(this.sources.ambient).forEach(source => {
                if (source.audio) source.audio.pause();
            });
        }
    },

    resume() {
        this.state.isPlaying = true;
        
        if (this.sources.ambient) {
            Object.values(this.sources.ambient).forEach(source => {
                if (source.audio) source.audio.play();
            });
        } else {
            this.startAmbientSounds();
        }
    },

    // Musical note generation for interactions
    playMusicalNote(noteIndex) {
        const frequencies = {
            'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23,
            'G4': 392.00, 'A4': 440.00, 'B4': 493.88, 'C5': 523.25
        };
        
        const note = this.sounds.musical.notes[noteIndex % this.sounds.musical.notes.length];
        const frequency = frequencies[note];
        
        const osc = this.context.createOscillator();
        const gainNode = this.context.createGain();
        const filter = this.context.createBiquadFilter();
        
        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        osc.type = 'sine';
        osc.frequency.value = frequency;
        
        filter.type = 'lowpass';
        filter.frequency.value = frequency * 2;
        filter.Q.value = 10;
        
        const now = this.context.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.2 * this.state.volume, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1);
        
        osc.start(now);
        osc.stop(now + 1);
    }
};
