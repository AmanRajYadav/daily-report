// magic.js - WebGL effects and magical interactions
const MagicCanvas = {
    canvas: null,
    gl: null,
    shaderProgram: null,
    buffers: {},
    uniforms: {},
    
    config: {
        auroraEnabled: false,
        waveAmplitude: 0.1,
        waveFrequency: 0.5,
        colorShift: 0,
        time: 0
    },
    
    init() {
        this.canvas = document.getElementById('magicCanvas');
        if (!this.canvas) return;
        
        // Try to get WebGL context
        this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
        
        if (!this.gl) {
            console.log('WebGL not supported, falling back to 2D effects');
            this.init2DFallback();
            return;
        }
        
        // Set canvas size
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // Initialize shaders
        this.initShaders();
        
        // Create geometry
        this.createGeometry();
        
        // Start render loop
        this.render();
    },
    
    vertexShaderSource: `
        attribute vec2 a_position;
        varying vec2 v_uv;
        
        void main() {
            v_uv = a_position * 0.5 + 0.5;
            gl_Position = vec4(a_position, 0.0, 1.0);
        }
    `,
    
    fragmentShaderSource: `
        precision mediump float;
        
        uniform float u_time;
        uniform vec2 u_resolution;
        uniform vec2 u_mouse;
        uniform float u_amplitude;
        uniform float u_frequency;
        uniform float u_colorShift;
        uniform float u_aurora;
        
        varying vec2 v_uv;
        
        // Noise function for organic movement
        float noise(vec2 p) {
            return sin(p.x * 10.0) * sin(p.y * 10.0);
        }
        
        // Smooth noise
        float smoothNoise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            
            float a = noise(i);
            float b = noise(i + vec2(1.0, 0.0));
            float c = noise(i + vec2(0.0, 1.0));
            float d = noise(i + vec2(1.0, 1.0));
            
            return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }
        
        // Fractal Brownian Motion
        float fbm(vec2 p) {
            float value = 0.0;
            float amplitude = 0.5;
            
            for (int i = 0; i < 4; i++) {
                value += amplitude * smoothNoise(p);
                p *= 2.0;
                amplitude *= 0.5;
            }
            
            return value;
        }
        
        // Aurora effect
        vec3 aurora(vec2 uv, float time) {
            vec2 p = uv * 2.0 - 1.0;
            p.y *= u_resolution.y / u_resolution.x;
            
            float n1 = fbm(p * 3.0 + time * 0.1);
            float n2 = fbm(p * 5.0 - time * 0.15);
            float n3 = fbm(p * 7.0 + time * 0.2);
            
            vec3 color1 = vec3(0.1, 0.5, 0.9); // Blue
            vec3 color2 = vec3(0.9, 0.1, 0.9); // Purple
            vec3 color3 = vec3(0.1, 0.9, 0.5); // Green
            
            vec3 aurora = color1 * n1 + color2 * n2 + color3 * n3;
            aurora *= 0.5;
            
            return aurora;
        }
        
        void main() {
            vec2 uv = v_uv;
            vec2 mouse = u_mouse / u_resolution;
            
            // Base wave distortion
            float wave = sin(uv.y * u_frequency * 10.0 + u_time) * u_amplitude;
            uv.x += wave * 0.1;
            
            // Distance from mouse
            float dist = distance(uv, mouse);
            float influence = smoothstep(0.5, 0.0, dist);
            
            // Base gradient
            vec3 color = vec3(0.0);
            
            if (u_aurora > 0.5) {
                // Aurora borealis effect
                color = aurora(uv, u_time);
                
                // Add shimmer
                float shimmer = sin(u_time * 10.0 + uv.y * 50.0) * 0.1 + 0.9;
                color *= shimmer;
            } else {
                // Subtle gradient for minimal theme
                color = mix(
                    vec3(0.0, 0.0, 0.0),
                    vec3(0.05, 0.05, 0.1),
                    uv.y + wave
                );
                
                // Mouse influence
                color += vec3(0.1, 0.05, 0.15) * influence * 0.3;
            }
            
            // Subtle vignette
            float vignette = 1.0 - distance(uv, vec2(0.5)) * 0.5;
            color *= vignette;
            
            // Color shift based on time
            color.r += sin(u_time * 0.5 + u_colorShift) * 0.05;
            color.g += sin(u_time * 0.3 + u_colorShift + 2.0) * 0.05;
            color.b += sin(u_time * 0.7 + u_colorShift + 4.0) * 0.05;
            
            gl_FragColor = vec4(color, 0.6);
        }
    `,
    
    initShaders() {
        const gl = this.gl;
        
        // Create vertex shader
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, this.vertexShaderSource);
        gl.compileShader(vertexShader);
        
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            console.error('Vertex shader compilation error:', gl.getShaderInfoLog(vertexShader));
            return;
        }
        
        // Create fragment shader
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, this.fragmentShaderSource);
        gl.compileShader(fragmentShader);
        
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            console.error('Fragment shader compilation error:', gl.getShaderInfoLog(fragmentShader));
            return;
        }
        
        // Create shader program
        this.shaderProgram = gl.createProgram();
        gl.attachShader(this.shaderProgram, vertexShader);
        gl.attachShader(this.shaderProgram, fragmentShader);
        gl.linkProgram(this.shaderProgram);
        
        if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
            console.error('Shader program linking error:', gl.getProgramInfoLog(this.shaderProgram));
            return;
        }
        
        // Get uniform locations
        this.uniforms = {
            time: gl.getUniformLocation(this.shaderProgram, 'u_time'),
            resolution: gl.getUniformLocation(this.shaderProgram, 'u_resolution'),
            mouse: gl.getUniformLocation(this.shaderProgram, 'u_mouse'),
            amplitude: gl.getUniformLocation(this.shaderProgram, 'u_amplitude'),
            frequency: gl.getUniformLocation(this.shaderProgram, 'u_frequency'),
            colorShift: gl.getUniformLocation(this.shaderProgram, 'u_colorShift'),
            aurora: gl.getUniformLocation(this.shaderProgram, 'u_aurora')
        };
        
        // Get attribute location
        this.attributes = {
            position: gl.getAttribLocation(this.shaderProgram, 'a_position')
        };
    },
    
    createGeometry() {
        const gl = this.gl;
        
        // Create a full-screen quad
        const positions = new Float32Array([
            -1, -1,
             1, -1,
            -1,  1,
             1,  1
        ]);
        
        // Create buffer
        this.buffers.position = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    },
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        if (this.gl) {
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        }
    },
    
    render() {
        const gl = this.gl;
        if (!gl) return;
        
        // Clear
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        // Use shader program
        gl.useProgram(this.shaderProgram);
        
        // Update uniforms
        gl.uniform1f(this.uniforms.time, this.config.time);
        gl.uniform2f(this.uniforms.resolution, this.canvas.width, this.canvas.height);
        gl.uniform2f(this.uniforms.mouse, Universe.mouseX || 0, Universe.mouseY || 0);
        gl.uniform1f(this.uniforms.amplitude, this.config.waveAmplitude);
        gl.uniform1f(this.uniforms.frequency, this.config.waveFrequency);
        gl.uniform1f(this.uniforms.colorShift, this.config.colorShift);
        gl.uniform1f(this.uniforms.aurora, this.config.auroraEnabled ? 1.0 : 0.0);
        
        // Bind geometry
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position);
        gl.enableVertexAttribArray(this.attributes.position);
        gl.vertexAttribPointer(this.attributes.position, 2, gl.FLOAT, false, 0, 0);
        
        // Draw
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        
        // Update time
        this.config.time += 0.01;
        
        requestAnimationFrame(() => this.render());
    },
    
    enableAurora() {
        this.config.auroraEnabled = true;
        this.config.waveAmplitude = 0.2;
        this.config.waveFrequency = 1.0;
    },
    
    disableAurora() {
        this.config.auroraEnabled = false;
        this.config.waveAmplitude = 0.1;
        this.config.waveFrequency = 0.5;
    },
    
    init2DFallback() {
        // Fallback for browsers without WebGL
        const ctx = this.canvas.getContext('2d');
        this.ctx2d = ctx;
        
        this.resize();
        this.render2D();
    },
    
    render2D() {
        if (!this.ctx2d) return;
        
        const ctx = this.ctx2d;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Clear
        ctx.clearRect(0, 0, width, height);
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        
        if (this.config.auroraEnabled) {
            // Aurora colors
            gradient.addColorStop(0, 'rgba(138, 43, 226, 0.2)');
            gradient.addColorStop(0.5, 'rgba(30, 144, 255, 0.2)');
            gradient.addColorStop(1, 'rgba(50, 205, 50, 0.2)');
        } else {
            // Subtle gradient
            gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
            gradient.addColorStop(1, 'rgba(0, 0, 20, 0.3)');
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        requestAnimationFrame(() => this.render2D());
    }
};

// Additional magical interactions
const MagicalInteractions = {
    init() {
        this.initScrollMagic();
        this.initCardMagic();
        this.initTouchMagic();
    },
    
    initScrollMagic() {
        let lastScrollY = 0;
        
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;
            const scrollDelta = scrollY - lastScrollY;
            
            // Create scroll particles
            if (Math.abs(scrollDelta) > 10) {
                this.createScrollParticles(scrollDelta);
            }
            
            // Parallax magic - disabled for static cards
            // document.querySelectorAll('.floating-card').forEach((card, index) => {
            //     const speed = 0.5 + (index * 0.1);
            //     const yPos = -(scrollY * speed * 0.1);
            //     card.style.transform = `translateY(${yPos}px)`;
            // });
            
            lastScrollY = scrollY;
        });
    },
    
    createScrollParticles(delta) {
        const particleCount = Math.min(Math.abs(delta) / 10, 5);
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            const x = Math.random() * window.innerWidth;
            const y = delta > 0 ? window.innerHeight - 50 : 50;
            
            particle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 6px;
                height: 6px;
                background: var(--student-accent);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                opacity: 0.8;
            `;
            
            document.body.appendChild(particle);
            
            // Animate
            particle.animate([
                { 
                    transform: 'translate(0, 0) scale(1)',
                    opacity: 0.8
                },
                { 
                    transform: `translate(${(Math.random() - 0.5) * 100}px, ${delta > 0 ? -100 : 100}px) scale(0)`,
                    opacity: 0
                }
            ], {
                duration: 1000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => particle.remove();
        }
    },
    
    initCardMagic() {
        document.querySelectorAll('.content-card').forEach(card => {
            // 3D tilt effect
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                
                const tiltX = (y - 0.5) * 10;
                const tiltY = (x - 0.5) * -10;
                
                card.style.transform = `
                    perspective(1000px)
                    rotateX(${tiltX}deg)
                    rotateY(${tiltY}deg)
                    translateZ(10px)
                `;
                
                // Move background effect
                const bgEffect = card.querySelector('.card-background-effect');
                if (bgEffect) {
                    bgEffect.style.background = `
                        radial-gradient(
                            circle at ${x * 100}% ${y * 100}%,
                            rgba(var(--student-hue), 70%, 60%, 0.1) 0%,
                            transparent 50%
                        )
                    `;
                }
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                const bgEffect = card.querySelector('.card-background-effect');
                if (bgEffect) {
                    bgEffect.style.background = '';
                }
            });
            
            // Click ripple effect
            card.addEventListener('click', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                this.createRipple(card, x, y);
            });
        });
    },
    
    createRipple(container, x, y) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transform: translate(-50%, -50%);
            pointer-events: none;
        `;
        
        container.appendChild(ripple);
        
        ripple.animate([
            { width: '0px', height: '0px', opacity: 1 },
            { width: '300px', height: '300px', opacity: 0 }
        ], {
            duration: 600,
            easing: 'ease-out'
        }).onfinish = () => ripple.remove();
    },
    
    initTouchMagic() {
        // Multi-touch sparkles
        document.addEventListener('touchstart', (e) => {
            Array.from(e.touches).forEach(touch => {
                this.createTouchSparkle(touch.clientX, touch.clientY);
            });
        });
        
        // Pinch to zoom magic
        let lastDistance = 0;
        
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2) {
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                
                const distance = Math.sqrt(
                    Math.pow(touch2.clientX - touch1.clientX, 2) +
                    Math.pow(touch2.clientY - touch1.clientY, 2)
                );
                
                if (lastDistance > 0) {
                    const scale = distance / lastDistance;
                    if (scale > 1.1 || scale < 0.9) {
                        this.onPinch(scale > 1);
                    }
                }
                
                lastDistance = distance;
            }
        });
        
        document.addEventListener('touchend', () => {
            lastDistance = 0;
        });
    },
    
    createTouchSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 40px;
            height: 40px;
            pointer-events: none;
            z-index: 10000;
        `;
        
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 40 40');
        svg.innerHTML = `
            <circle cx="20" cy="20" r="20" fill="none" stroke="var(--student-accent)" stroke-width="2">
                <animate attributeName="r" from="5" to="20" dur="0.5s" />
                <animate attributeName="opacity" from="1" to="0" dur="0.5s" />
            </circle>
            <circle cx="20" cy="20" r="10" fill="var(--student-accent)">
                <animate attributeName="r" from="3" to="10" dur="0.3s" />
                <animate attributeName="opacity" from="0.8" to="0" dur="0.3s" />
            </circle>
        `;
        
        sparkle.appendChild(svg);
        document.body.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 500);
    },
    
    onPinch(zoomIn) {
        // Create zoom effect
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            width: ${zoomIn ? '50px' : '200px'};
            height: ${zoomIn ? '50px' : '200px'};
            border: 3px solid var(--student-accent);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 10000;
        `;
        
        document.body.appendChild(effect);
        
        effect.animate([
            { 
                width: zoomIn ? '50px' : '200px',
                height: zoomIn ? '50px' : '200px',
                opacity: 1
            },
            { 
                width: zoomIn ? '200px' : '50px',
                height: zoomIn ? '200px' : '50px',
                opacity: 0
            }
        ], {
            duration: 500,
            easing: 'ease-out'
        }).onfinish = () => effect.remove();
        
        // Play zoom sound
        AudioEngine.playMusicalNote(zoomIn ? 5 : 2);
    }
};

// Initialize magical interactions when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    MagicalInteractions.init();
});
