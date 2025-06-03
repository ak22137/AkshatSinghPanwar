// Particle System
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

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all controllers
    new ParticleSystem();
    new ParallaxController();
    new NavigationController();
    new AnimationController();
    new FormHandler();

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
