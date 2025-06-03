// Enhanced Cursor Trail System
class CursorTrail {
    constructor() {
        this.trails = [];
        this.mouse = { x: 0, y: 0 };
        this.currentSection = 'home';
        this.trailStyle = 'ai'; // 'ai' or 'game'
        this.canvas = this.createTrailCanvas();
        this.ctx = this.canvas.getContext('2d');
        
        this.bindEvents();
        this.animate();
    }

    createTrailCanvas() {
        const canvas = document.createElement('canvas');
        canvas.id = 'cursor-trail-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '999';
        document.body.appendChild(canvas);
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        return canvas;
    }

    bindEvents() {
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.addTrailPoint(e.clientX, e.clientY);
        });

        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });

        // Detect section changes
        window.addEventListener('scroll', () => {
            this.updateCurrentSection();
        });
    }

    updateCurrentSection() {
        const sections = ['home', 'about', 'skills', 'ai-projects', 'game-projects', 'contact'];
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        for (const section of sections) {
            const element = document.getElementById(section);
            if (element) {
                const rect = element.getBoundingClientRect();
                const elementTop = rect.top + window.scrollY;
                const elementBottom = elementTop + rect.height;
                
                if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
                    if (section !== this.currentSection) {
                        this.currentSection = section;
                        this.updateTrailStyle();
                    }
                    break;
                }
            }
        }
    }

    updateTrailStyle() {
        if (this.currentSection === 'ai-projects' || this.currentSection === 'skills') {
            this.trailStyle = 'ai';
        } else if (this.currentSection === 'game-projects') {
            this.trailStyle = 'game';
        } else {
            this.trailStyle = 'default';
        }
    }

    addTrailPoint(x, y) {
        this.trails.push({
            x: x,
            y: y,
            life: 1,
            size: Math.random() * 8 + 4,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2
        });

        if (this.trails.length > 50) {
            this.trails.shift();
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = this.trails.length - 1; i >= 0; i--) {
            const trail = this.trails[i];
            trail.life -= 0.02;
            trail.x += trail.vx * 0.5;
            trail.y += trail.vy * 0.5;
            trail.size *= 0.98;
            
            if (trail.life <= 0) {
                this.trails.splice(i, 1);
                continue;
            }
            
            this.ctx.save();
            this.ctx.globalAlpha = trail.life;
            
            if (this.trailStyle === 'ai') {
                // AI Trail - Circuit-like patterns
                this.ctx.strokeStyle = `rgba(0, 212, 255, ${trail.life})`;
                this.ctx.fillStyle = `rgba(0, 212, 255, ${trail.life * 0.3})`;
                this.ctx.lineWidth = 2;
                
                this.ctx.beginPath();
                this.ctx.arc(trail.x, trail.y, trail.size, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();
                
                // Add connecting lines
                if (i < this.trails.length - 1) {
                    const nextTrail = this.trails[i + 1];
                    this.ctx.beginPath();
                    this.ctx.moveTo(trail.x, trail.y);
                    this.ctx.lineTo(nextTrail.x, nextTrail.y);
                    this.ctx.stroke();
                }
            } else if (this.trailStyle === 'game') {
                // Game Trail - Flame-like effects
                this.ctx.fillStyle = `rgba(255, 107, 107, ${trail.life})`;
                
                this.ctx.beginPath();
                this.ctx.arc(trail.x, trail.y, trail.size, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Add flame particles
                for (let j = 0; j < 3; j++) {
                    const angle = Math.random() * Math.PI * 2;
                    const distance = Math.random() * trail.size * 2;
                    const px = trail.x + Math.cos(angle) * distance;
                    const py = trail.y + Math.sin(angle) * distance;
                    
                    this.ctx.fillStyle = `rgba(255, ${69 + Math.random() * 100}, 69, ${trail.life * 0.5})`;
                    this.ctx.beginPath();
                    this.ctx.arc(px, py, Math.random() * 3 + 1, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            } else {
                // Default Trail - Simple gradient
                const gradient = this.ctx.createRadialGradient(trail.x, trail.y, 0, trail.x, trail.y, trail.size);
                gradient.addColorStop(0, `rgba(255, 255, 255, ${trail.life})`);
                gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
                
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(trail.x, trail.y, trail.size, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            this.ctx.restore();
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// Enhanced Parallax Shapes System
class ParallaxShapes {
    constructor() {
        this.canvas = this.createShapesCanvas();
        this.ctx = this.canvas.getContext('2d');
        this.shapes = [];
        this.mouse = { x: 0, y: 0 };
        this.scrollY = 0;
        
        this.init();
        this.bindEvents();
        this.animate();
    }

    createShapesCanvas() {
        const canvas = document.createElement('canvas');
        canvas.id = 'parallax-shapes-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '1';
        document.body.appendChild(canvas);
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        return canvas;
    }

    init() {
        this.createShapes();
    }    createShapes() {
        this.shapes = [];
        const shapeCount = 15;
        
        for (let i = 0; i < shapeCount; i++) {
            this.shapes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 80 + 40,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.005, // Slower rotation
                opacity: Math.random() * 0.08 + 0.03, // Lower opacity
                type: Math.floor(Math.random() * 4), // 0: circle, 1: triangle, 2: square, 3: hexagon
                parallaxFactor: Math.random() * 0.15 + 0.05, // More free movement
                color: this.getRandomColor(),
                pulsePhase: Math.random() * Math.PI * 2,
                pulseSpeed: Math.random() * 0.008 + 0.003, // Much slower pulsing
                driftX: (Math.random() - 0.5) * 0.2, // Free floating
                driftY: (Math.random() - 0.5) * 0.2
            });
        }
    }

    getRandomColor() {
        const colors = [
            'rgba(0, 212, 255, ',
            'rgba(255, 107, 107, ',
            'rgba(147, 51, 234, ',
            'rgba(34, 197, 94, ',
            'rgba(251, 191, 36, '
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    bindEvents() {
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('scroll', () => {
            this.scrollY = window.scrollY;
        });

        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.createShapes();
        });
    }    drawShape(shape) {
        this.ctx.save();
        
        // Calculate cursor influence (reduced intensity)
        const distance = Math.sqrt(
            Math.pow(this.mouse.x - shape.x, 2) + 
            Math.pow(this.mouse.y - shape.y, 2)
        );
        const influence = Math.max(0, 250 - distance) / 250; // Larger radius, gentler influence
        
        // Apply parallax effect based on cursor position and scroll
        const parallaxX = (this.mouse.x - this.canvas.width / 2) * shape.parallaxFactor;
        const parallaxY = (this.mouse.y - this.canvas.height / 2) * shape.parallaxFactor;
        const scrollParallax = this.scrollY * shape.parallaxFactor * 0.3;
        
        // Add free floating movement
        shape.x += shape.driftX;
        shape.y += shape.driftY;
        
        // Wrap around edges for continuous movement
        if (shape.x < -100) shape.x = this.canvas.width + 100;
        if (shape.x > this.canvas.width + 100) shape.x = -100;
        if (shape.y < -100) shape.y = this.canvas.height + 100;
        if (shape.y > this.canvas.height + 100) shape.y = -100;
        
        const x = shape.x + parallaxX + influence * 10; // Reduced cursor influence
        const y = shape.y + parallaxY + scrollParallax + influence * 10;
        
        // Gentler pulsing effect
        const pulseSize = shape.size + Math.sin(Date.now() * shape.pulseSpeed + shape.pulsePhase) * 5; // Reduced pulse amplitude
        const size = pulseSize + influence * 15; // Reduced cursor size influence
        
        this.ctx.translate(x, y);
        this.ctx.rotate(shape.rotation);
        
        const opacity = shape.opacity + influence * 0.1; // Reduced opacity influence
        this.ctx.fillStyle = shape.color + opacity + ')';
        this.ctx.strokeStyle = shape.color + (opacity * 1.5) + ')';
        this.ctx.lineWidth = 1;
        
        this.ctx.beginPath();
        
        switch (shape.type) {
            case 0: // Circle
                this.ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
                break;
            case 1: // Triangle
                this.ctx.moveTo(0, -size / 2);
                this.ctx.lineTo(-size / 2, size / 2);
                this.ctx.lineTo(size / 2, size / 2);
                this.ctx.closePath();
                break;
            case 2: // Square
                this.ctx.rect(-size / 2, -size / 2, size, size);
                break;
            case 3: // Hexagon
                for (let i = 0; i < 6; i++) {
                    const angle = (i * Math.PI) / 3;
                    const px = Math.cos(angle) * size / 2;
                    const py = Math.sin(angle) * size / 2;
                    if (i === 0) this.ctx.moveTo(px, py);
                    else this.ctx.lineTo(px, py);
                }
                this.ctx.closePath();
                break;
        }
        
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
        
        // Update rotation (slower)
        shape.rotation += shape.rotationSpeed + influence * 0.01;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (const shape of this.shapes) {
            this.drawShape(shape);
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// Enhanced Particle System
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.scrollY = 0;
        this.particleStyle = 'default'; // 'default', 'fire', 'stars'
        
        this.init();
        this.bindEvents();
        this.animate();
    }

    init() {
        this.resize();
        this.createParticles();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                originalOpacity: Math.random() * 0.5 + 0.2,
                hue: Math.random() * 360,
                life: Math.random() * 100 + 100
            });
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('scroll', () => {
            this.scrollY = window.pageYOffset;
            this.updateParticleStyle();
        });
    }

    updateParticleStyle() {
        const sections = ['home', 'about', 'skills', 'projects', 'contact'];
        const currentSection = this.getCurrentSection();
        
        if (currentSection === 'home') {
            this.particleStyle = 'default';
        } else if (currentSection === 'about' || currentSection === 'skills') {
            this.particleStyle = 'stars';
        } else if (currentSection === 'projects' || currentSection === 'contact') {
            this.particleStyle = 'fire';
        }
    }

    getCurrentSection() {
        const sections = document.querySelectorAll('section');
        for (let section of sections) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                return section.id;
            }
        }
        return 'home';
    }

    updateParticles() {
        this.particles.forEach((particle, index) => {
            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = 150;

            if (distance < maxDistance) {
                const force = (maxDistance - distance) / maxDistance;
                particle.vx += (dx / distance) * force * 0.01;
                particle.vy += (dy / distance) * force * 0.01;
                particle.opacity = Math.min(1, particle.originalOpacity + force * 0.5);
            } else {
                particle.opacity = particle.originalOpacity;
            }

            // Style-specific behavior
            switch (this.particleStyle) {
                case 'stars':
                    particle.vy += Math.sin(Date.now() * 0.001 + particle.x * 0.01) * 0.02;
                    particle.vx += Math.cos(Date.now() * 0.001 + particle.y * 0.01) * 0.02;
                    break;
                case 'fire':
                    particle.vy -= 0.1;
                    particle.vx += (Math.random() - 0.5) * 0.1;
                    particle.life -= 1;
                    if (particle.life <= 0) {
                        particle.x = Math.random() * this.canvas.width;
                        particle.y = this.canvas.height + 10;
                        particle.life = Math.random() * 100 + 100;
                    }
                    break;
            }

            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Apply friction
            particle.vx *= 0.99;
            particle.vy *= 0.99;

            // Wrap around screen
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
        });
    }

    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;

            switch (this.particleStyle) {
                case 'default':
                    this.ctx.fillStyle = `hsl(${190 + Math.sin(Date.now() * 0.001) * 30}, 70%, 60%)`;
                    this.ctx.beginPath();
                    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    this.ctx.fill();
                    break;

                case 'stars':
                    this.ctx.fillStyle = `hsl(${particle.hue}, 70%, 80%)`;
                    this.ctx.shadowBlur = 10;
                    this.ctx.shadowColor = `hsl(${particle.hue}, 70%, 80%)`;
                    this.drawStar(particle.x, particle.y, particle.size);
                    break;

                case 'fire':
                    const fireHue = 30 - (particle.life / 200) * 30;
                    this.ctx.fillStyle = `hsl(${fireHue}, 100%, 60%)`;
                    this.ctx.shadowBlur = 15;
                    this.ctx.shadowColor = `hsl(${fireHue}, 100%, 60%)`;
                    this.ctx.beginPath();
                    this.ctx.arc(particle.x, particle.y, particle.size * (particle.life / 200), 0, Math.PI * 2);
                    this.ctx.fill();
                    break;
            }

            this.ctx.restore();
        });

        // Draw connections for default style
        if (this.particleStyle === 'default') {
            this.drawConnections();
        }
    }

    drawStar(x, y, size) {
        const spikes = 5;
        const outerRadius = size;
        const innerRadius = size * 0.5;
        let rot = Math.PI / 2 * 3;
        const step = Math.PI / spikes;

        this.ctx.beginPath();
        this.ctx.moveTo(x, y - outerRadius);

        for (let i = 0; i < spikes; i++) {
            const cx = x + Math.cos(rot) * outerRadius;
            const cy = y + Math.sin(rot) * outerRadius;
            this.ctx.lineTo(cx, cy);
            rot += step;

            const ix = x + Math.cos(rot) * innerRadius;
            const iy = y + Math.sin(rot) * innerRadius;
            this.ctx.lineTo(ix, iy);
            rot += step;
        }

        this.ctx.lineTo(x, y - outerRadius);
        this.ctx.closePath();
        this.ctx.fill();
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    this.ctx.save();
                    this.ctx.globalAlpha = (100 - distance) / 100 * 0.2;
                    this.ctx.strokeStyle = '#00d4ff';
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                    this.ctx.restore();
                }
            }
        }
    }

    animate() {
        this.updateParticles();
        this.drawParticles();
        requestAnimationFrame(() => this.animate());
    }
}

// Parallax Effect
class ParallaxController {
    constructor() {
        this.elements = [];
        this.init();
        this.bindEvents();
    }

    init() {
        // Add parallax elements
        this.elements = [
            { element: document.querySelector('.parallax-bg'), speed: 0.5 },
            { element: document.querySelector('.hero-content'), speed: 0.8 }
        ];
    }

    bindEvents() {
        window.addEventListener('scroll', () => this.updateParallax());
    }

    updateParallax() {
        const scrollY = window.pageYOffset;

        this.elements.forEach(({ element, speed }) => {
            if (element) {
                const yPos = -(scrollY * speed);
                element.style.transform = `translate3d(0, ${yPos}px, 0)`;
            }
        });
    }
}

// Smooth Scrolling and Navigation
class NavigationController {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.sections = document.querySelectorAll('section');
        
        this.init();
        this.bindEvents();
    }

    init() {
        this.updateActiveLink();
    }

    bindEvents() {
        // Hamburger menu
        this.hamburger.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
            this.hamburger.classList.toggle('active');
        });

        // Close menu when clicking links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.navMenu.classList.remove('active');
                this.hamburger.classList.remove('active');
            });
        });

        // Navbar background on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.navbar.style.background = 'rgba(10, 10, 10, 0.98)';
            } else {
                this.navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            }
            this.updateActiveLink();
        });
    }

    updateActiveLink() {
        let current = '';
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
}

// Intersection Observer for Animations
class AnimationController {
    constructor() {
        this.init();
    }

    init() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll('.skill-card, .project-card, .contact-item, .stat');
        animateElements.forEach(el => observer.observe(el));
    }
}

// Form Handler
class FormHandler {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.bindEvents();
    }

    bindEvents() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission
        this.showSuccess();
        this.form.reset();
    }

    showSuccess() {
        const button = this.form.querySelector('button[type="submit"]');
        const originalText = button.textContent;
        
        button.textContent = 'Message Sent!';
        button.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 3000);
    }
}

// Typing Effect
class TypingEffect {
    constructor(element, texts, speed = 100) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        
        if (this.element) {
            this.type();
        }
    }

    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let typeSpeed = this.isDeleting ? this.speed / 2 : this.speed;

        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = 2000; // Pause at end
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            typeSpeed = 500; // Pause before starting new text
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Magnetic Cursor Effect for Interactive Elements
class MagneticCursor {
    constructor() {
        this.magneticElements = document.querySelectorAll('.btn, .nav-link, .skill-card, .project-card');
        this.cursor = document.createElement('div');
        this.cursor.classList.add('custom-cursor');
        document.body.appendChild(this.cursor);
        
        this.init();
        this.bindEvents();
    }

    init() {
        // Add custom cursor styles
        const cursorStyles = `
        .custom-cursor {
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(0, 212, 255, 0.8) 0%, rgba(0, 212, 255, 0.2) 100%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
            mix-blend-mode: difference;
        }
        
        .custom-cursor.magnetic {
            transform: scale(2);
            background: radial-gradient(circle, rgba(255, 107, 107, 0.8) 0%, rgba(255, 107, 107, 0.2) 100%);
        }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = cursorStyles;
        document.head.appendChild(styleSheet);
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = e.clientX - 10 + 'px';
            this.cursor.style.top = e.clientY - 10 + 'px';
        });

        this.magneticElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.cursor.classList.add('magnetic');
            });

            element.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('magnetic');
                element.style.transform = '';
            });

            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });
        });
    }
}

// Enhanced Text Animation Effects
class TextAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.animateCounters();
        this.addGlitchEffect();
    }

    animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        const observerOptions = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.countUp(entry.target);
                }
            });
        }, observerOptions);

        counters.forEach(counter => observer.observe(counter));
    }

    countUp(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            element.textContent = Math.floor(current);
            
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 16);
    }

    addGlitchEffect() {
        const glitchElements = document.querySelectorAll('.hero-title, .section-title');
        
        glitchElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.animation = 'glitch 0.5s ease-in-out';
            });

            element.addEventListener('animationend', () => {
                element.style.animation = '';
            });
        });

        // Add glitch keyframes
        const glitchStyles = `
        @keyframes glitch {
            0% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(-2px, -2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(2px, -2px); }
            100% { transform: translate(0); }
        }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = glitchStyles;
        document.head.appendChild(styleSheet);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all controllers
    new ParticleSystem();
    new ParallaxController();
    new NavigationController();
    new AnimationController();
    new FormHandler();    // Initialize enhanced effects
    new CursorTrail();
    new ParallaxShapes();
    new MagneticCursor();
    new TextAnimations();

    // Add typing effect to subtitle
    const subtitle = document.querySelector('.hero-subtitle');
    if (subtitle) {
        new TypingEffect(subtitle, [
            'Full Stack Developer & Creative Problem Solver',
            'Passionate About Clean Code & User Experience',
            'Building Digital Solutions That Matter'
        ], 80);
    }

    // Add scroll-triggered animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    // Observe sections for fade-in effect
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
});

// Add CSS for animation classes
const animationStyles = `
.animate-in {
    animation: slideInUp 0.8s ease-out forwards;
}

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.nav-link.active {
    color: #00d4ff !important;
}

.nav-link.active::after {
    width: 100% !important;
}
`;

// Inject animation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);
