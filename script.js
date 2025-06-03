// Parallax Effect for Landscape
document.addEventListener('DOMContentLoaded', function() {
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    
    // Scroll-based parallax effect for landscape layers
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        
        parallaxLayers.forEach(function(layer) {
            const speed = layer.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            layer.style.transform = `translateY(${yPos}px)`;
        });
    });
    
    // Enhanced particle trail with glowing effects
    function createGlowParticle(x, y) {
        const particle = document.createElement('div');
        const size = Math.random() * 8 + 4; // Random size between 4-12px
        const colors = [
            'rgba(255, 255, 255, 0.9)', 
            'rgba(174, 213, 255, 0.8)', 
            'rgba(255, 234, 167, 0.8)',
            'rgba(116, 185, 255, 0.7)',
            'rgba(162, 155, 254, 0.7)'
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.position = 'fixed';
        particle.style.left = (x - size/2) + 'px';
        particle.style.top = (y - size/2) + 'px';
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.background = color;
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '999';
        particle.style.transition = 'all 2s ease-out';
        particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
        
        document.body.appendChild(particle);
        
        // Animate particle
        setTimeout(() => {
            particle.style.opacity = '0';
            particle.style.transform = `scale(0) translateY(-${Math.random() * 100 + 50}px) rotate(${Math.random() * 360}deg)`;
        }, 10);
        
        // Remove particle
        setTimeout(() => {
            if (document.body.contains(particle)) {
                document.body.removeChild(particle);
            }
        }, 2000);
    }
    
    // Glowing particle trail on mouse move
    document.addEventListener('mousemove', function(e) {
        // Create glowing particles at 25% chance
        if (Math.random() < 0.25) {
            createGlowParticle(e.clientX, e.clientY);
        }
        
        // Create additional trailing particles
        if (Math.random() < 0.15) {
            setTimeout(() => {
                createGlowParticle(
                    e.clientX + (Math.random() - 0.5) * 30, 
                    e.clientY + (Math.random() - 0.5) * 30
                );
            }, 80);
        }
    });
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe sections for scroll animations
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'all 0.8s ease';
        observer.observe(section);
    });
    
    // Typing effect for hero title
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const text = typingText.textContent;
        typingText.textContent = '';
        
        let i = 0;
        const typeWriter = function() {
            if (i < text.length) {
                typingText.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 1500);
    }
    
    // Add scroll-triggered animations for portfolio items
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(50px)';
        item.style.transition = `all 0.6s ease ${index * 0.2}s`;
        observer.observe(item);
    });
    
    // Add scroll-triggered animations for skill items
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `all 0.5s ease ${index * 0.1}s`;
        observer.observe(item);
    });
    
    // Add scroll-triggered animations for contact items
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `all 0.5s ease ${index * 0.2}s`;
        observer.observe(item);
    });
    
    // Add particle effect on mouse move
    let particles = [];
    const maxParticles = 20;
    
    function createParticle(x, y) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = 'rgba(255, 255, 255, 0.6)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '999';
        particle.style.transition = 'all 1s ease-out';
        
        document.body.appendChild(particle);
        
        // Animate particle
        setTimeout(() => {
            particle.style.opacity = '0';
            particle.style.transform = 'scale(0)';
        }, 10);
        
        // Remove particle
        setTimeout(() => {
            document.body.removeChild(particle);
        }, 1000);
    }
    
    // Add particles on mouse move in hero section
    const heroSection = document.querySelector('.parallax-container');
    if (heroSection) {
        heroSection.addEventListener('mousemove', function(e) {
            if (Math.random() < 0.1) { // 10% chance to create particle
                createParticle(e.clientX, e.clientY);
            }
        });
    }
});

// Add mobile menu styles
const style = document.createElement('style');
style.textContent = `
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            left: -100%;
            top: 70px;
            flex-direction: column;
            background-color: rgba(255, 255, 255, 0.98);
            width: 100%;
            text-align: center;
            transition: 0.3s;
            box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);
            backdrop-filter: blur(10px);
            padding: 2rem 0;
        }
        
        .nav-menu.active {
            left: 0;
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(1) {
            transform: translateY(8px) rotate(45deg);
        }
        
        .hamburger.active span:nth-child(3) {
            transform: translateY(-8px) rotate(-45deg);
        }
    }
`;
document.head.appendChild(style);
