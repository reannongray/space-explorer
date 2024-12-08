window.SpaceExplorer = class SpaceExplorer {
    constructor() {
        this.particleSystem = null;
        this.spaceEvents = null;
        this.planetComparison = null;
        this.eventDisplay = null;
    }

    static async create() {
        const explorer = new SpaceExplorer();
        await explorer.init();
        return explorer;
    }

    async init() {
        try {
            // Initialize core systems
            this.particleSystem = new ParticleSystem();
            this.spaceEvents = new SpaceEvents();
            
            // Initialize Planet Comparison
            const planetContainer = document.querySelector('#planets');
            if (planetContainer) {
                this.planetComparison = new PlanetComparison('planets');
            }
            
            // Initialize Event Display
            const eventContainer = document.querySelector('#space-events-container');
            if (eventContainer) {
                this.eventDisplay = new EventDisplay('space-events-container');
            }

            // Initialize all other features
            await this.initializeAPOD();
            this.initializeCountdown();
            this.initializeNavigation();
            this.initializeScrollEffects();
            this.initializeEventListeners();
            this.animateHeroSection();

        } catch (error) {
            console.error('Error during initialization:', error);
        }
    }

    async initializeAPOD() {
        try {
            const apodData = await NasaService.getAPOD();
            const apodContainer = document.querySelector('.nasa-apod');
            const apodDescription = document.querySelector('.apod-description');

            if (!apodContainer || !apodDescription) {
                console.warn('APOD containers not found');
                return;
            }

            if (apodData.media_type === 'image') {
                apodContainer.style.backgroundImage = `url(${apodData.url})`;
                apodDescription.textContent = apodData.explanation;
            } else {
                apodContainer.innerHTML = '<p>Today\'s APOD is a video. Visit NASA\'s website to view it.</p>';
            }
        } catch (error) {
            console.error('Error loading APOD:', error);
            const apodContainer = document.querySelector('.nasa-apod');
            if (apodContainer) {
                apodContainer.innerHTML = '<p>Loading space imagery...</p>';
            }
        }
    }

    initializeCountdown() {
        const nextEvent = this.spaceEvents.getNextEvent();
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (!heroSubtitle || !nextEvent) return;
        
        const updateCountdown = () => {
            const countdown = this.spaceEvents.calculateCountdown(nextEvent.date);
            heroSubtitle.innerHTML = `Next Space Event: ${nextEvent.name} in ${countdown.days}d ${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`;
        };

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    initializeNavigation() {
        const nav = document.querySelector('.glass-nav');
        if (!nav) return;

        let lastScroll = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            nav.style.transform = `translateX(-50%) translateY(${currentScroll < lastScroll ? '0' : '-100%'})`;
            nav.style.transition = 'transform 0.3s ease-in-out';
            lastScroll = currentScroll;
            this.updateNavigationHighlight();
        });
    }

    initializeScrollEffects() {
        const sections = document.querySelectorAll('section');
        if (!sections.length) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px'
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-visible');
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.style.opacity = '1';
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            section.style.transform = 'translateY(50px)';
            section.style.opacity = '0';
            section.style.transition = 'all 0.8s ease-out';
            sectionObserver.observe(section);
        });
    }

    initializeEventListeners() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        document.querySelectorAll('.cosmic-btn').forEach(button => {
            button.addEventListener('mouseover', this.createButtonHoverEffect);
            button.addEventListener('mouseout', this.removeButtonHoverEffect);
        });
    }

    animateHeroSection() {
        const heroContent = document.querySelector('.hero-content');
        if (!heroContent) return;

        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(20px)';

        setTimeout(() => {
            heroContent.style.transition = 'all 1s ease-out';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }

    updateNavigationHighlight() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 150 && rect.bottom >= 150) {
                const id = section.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }

    createButtonHoverEffect(e) {
        const x = e.pageX - this.offsetLeft;
        const y = e.pageY - this.offsetTop;
        
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 1000);
    }

    removeButtonHoverEffect() {
        const ripples = this.getElementsByClassName('ripple');
        while (ripples.length > 0) {
            ripples[0].remove();
        }
    }
};

// Initialize application
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const app = await SpaceExplorer.create();
        window.spaceExplorer = app;
    } catch (error) {
        console.error('Failed to initialize SpaceExplorer:', error);
    }
});