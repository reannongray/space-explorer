// Remove the class instantiation from global scope and simplify
const ParticleSystem = (function() {
    class ParticleSystem {
        constructor() {
            this.particles = [];
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.numberOfParticles = 200;
            this.particleMaxSize = 2;
            this.maxVelocity = 0.5;
            this.colors = ['#ffffff', '#f4f1de', '#81b4ff', '#ff9b85'];
            this.mouseX = 0;
            this.mouseY = 0;
            this.isRunning = true;
            
            this.init();
        }

        init() {
            // Setup canvas
            this.canvas.style.position = 'fixed';
            this.canvas.style.top = '0';
            this.canvas.style.left = '0';
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';
            this.canvas.style.zIndex = '-1';
            document.body.insertBefore(this.canvas, document.body.firstChild);

            // Bind methods
            this.handleResize = this.handleResize.bind(this);
            this.handleMouseMove = this.handleMouseMove.bind(this);
            this.animate = this.animate.bind(this);

            // Add event listeners
            window.addEventListener('resize', this.handleResize);
            window.addEventListener('mousemove', this.handleMouseMove);

            // Initialize
            this.handleResize();
            this.createParticles();
            requestAnimationFrame(this.animate);
        }

        handleResize() {
            const dpr = window.devicePixelRatio || 1;
            this.canvas.width = window.innerWidth * dpr;
            this.canvas.height = window.innerHeight * dpr;
            this.ctx.scale(dpr, dpr);
        }

        handleMouseMove(e) {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        }

        createParticles() {
            this.particles = [];
            for (let i = 0; i < this.numberOfParticles; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    size: Math.random() * this.particleMaxSize,
                    velocityX: (Math.random() - 0.5) * this.maxVelocity,
                    velocityY: (Math.random() - 0.5) * this.maxVelocity,
                    color: this.colors[Math.floor(Math.random() * this.colors.length)],
                    alpha: Math.random(),
                    connection: []
                });
            }
        }

        drawParticles() {
            if (!this.ctx) return;
            
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Draw connections
            this.particles.forEach((particle, index) => {
                particle.connection = [];
                for (let j = index + 1; j < this.particles.length; j++) {
                    const dx = this.particles[j].x - particle.x;
                    const dy = this.particles[j].y - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        particle.connection.push(j);
                        this.ctx.beginPath();
                        this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * (1 - distance / 100)})`;
                        this.ctx.lineWidth = 0.5;
                        this.ctx.moveTo(particle.x, particle.y);
                        this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                        this.ctx.stroke();
                    }
                }
            });

            // Draw particles
            this.particles.forEach(particle => {
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fillStyle = particle.color;
                this.ctx.globalAlpha = particle.alpha;
                this.ctx.fill();

                // Mouse interaction
                const dx = this.mouseX - particle.x;
                const dy = this.mouseY - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 100) {
                    particle.x += dx * 0.02;
                    particle.y += dy * 0.02;
                }

                // Update position
                particle.x += particle.velocityX;
                particle.y += particle.velocityY;

                // Wrap around screen
                if (particle.x < 0) particle.x = this.canvas.width;
                if (particle.x > this.canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = this.canvas.height;
                if (particle.y > this.canvas.height) particle.y = 0;

                // Twinkle effect
                particle.alpha += (Math.random() - 0.5) * 0.01;
                particle.alpha = Math.max(0.1, Math.min(1, particle.alpha));
            });
        }

        animate() {
            if (!this.isRunning) return;
            this.drawParticles();
            requestAnimationFrame(this.animate);
        }

        destroy() {
            this.isRunning = false;
            window.removeEventListener('resize', this.handleResize);
            window.removeEventListener('mousemove', this.handleMouseMove);
            if (this.canvas && this.canvas.parentNode) {
                this.canvas.parentNode.removeChild(this.canvas);
            }
        }
    }

    return ParticleSystem;
})();

// Make available globally
window.ParticleSystem = ParticleSystem;