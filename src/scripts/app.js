// Core imports
import ParticleSystem from './components/ParticleSystem.js';
import SpaceEvents from './components/SpaceEvents.js';
import PlanetViewer from './components/PlanetViewer.js';
import NasaService from './services/NasaService.js';

class SpaceExplorer {
    constructor() {
        this.particleSystem = null;
        this.spaceEvents = null;
        this.planetViewer = null;
    }

    static async create() {
        const explorer = new SpaceExplorer();
        await explorer.init();
        return explorer;
    }

    async init() {
        // Initialize core systems
        this.particleSystem = new ParticleSystem();
        this.spaceEvents = new SpaceEvents();
        
        // Initialize all features
        await this.initializeAPOD();
        this.initializeCountdown();
        this.initializePlanetViewer();
        this.initializeNavigation();
        this.initializeScrollEffects();
        this.initializeEventListeners();
        this.animateHeroSection();
    }

    async initializeAPOD() {
        try {
            const apodData = await NasaService.getAPOD();
            const apodContainer = document.querySelector('.nasa-apod');
            const apodDescription = document.querySelector('.apod-description');

            if (apodData.media_type === 'image') {
                apodContainer.style.backgroundImage = `url(${apodData.url})`;
                apodDescription.textContent = apodData.explanation;
            } else {
                apodContainer.innerHTML = '<p>Today\'s APOD is a video. Visit NASA\'s website to view it.</p>';
            }
        } catch (error) {
            console.error('Error loading APOD:', error);
            const apodContainer = document.querySelector('.nasa-apod');
            apodContainer.innerHTML = '<p>Loading space imagery...</p>';
        }
    }

    initializeCountdown() {
        const nextEvent = this.spaceEvents.getNextEvent();
        const heroSubtitle = document.querySelector('.hero-subtitle');
        
        const updateCountdown = () => {
            const countdown = this.spaceEvents.calculateCountdown(nextEvent.date);
            heroSubtitle.innerHTML = 
                `Next Space Event: ${nextEvent.name} in
                ${countdown.days}d ${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`;
        };

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    initializePlanetViewer() {
        const planetContainer = document.querySelector('.planet-viewer');
        if (planetContainer) {
            console.log('Planet container found');
            this.planetViewer = new PlanetViewer(planetContainer);
        } else {
            console.log('Planet container not found');
        }
    }
    

    initializeNavigation() {
        const nav = document.querySelector('.glass-nav');
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
}

document.addEventListener('DOMContentLoaded', async () => {
    const app = await SpaceExplorer.create();
    window.spaceExplorer = app;
});
