window.ThreePlanetViewer = class ThreePlanetViewer {
    constructor(containerId) {
        if (!THREE) {
            throw new Error('Three.js not loaded');
        }

        // Core Three.js components
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error('Container not found');
        }

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );
        
        // Renderer setup
        const canvas = document.querySelector('#planet-canvas');
        if (!canvas) {
            throw new Error('Canvas not found');
        }

        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        
        // Planet management
        this.planets = new Map();
        this.currentPlanet = null;
        this.scaleFactor = 0.00003;
        
        // Lighting
        this.sunLight = null;
        
        // Controls
        this.controls = null;
        this.planetControls = null;
        
        this.init();
    }

    init() {
        try {
            // Basic setup
            this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            this.renderer.setClearColor(0x000000, 0);
            
            this.camera.position.z = 5;
            
            // Lighting
            const ambientLight = new THREE.AmbientLight(0x404040, 1);
            this.scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position.set(5, 3, 5);
            this.scene.add(directionalLight);
            
            this.sunLight = new THREE.PointLight(0xffffff, 1.5, 100);
            this.scene.add(this.sunLight);
            
            // Controls
            if (typeof THREE.OrbitControls !== 'function') {
                console.error('OrbitControls not loaded properly');
                throw new Error('OrbitControls not available');
            }
            
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.rotateSpeed = 0.5;
            this.controls.enableZoom = true;
            this.controls.minDistance = 2;
            this.controls.maxDistance = 20;
            
            // Event listeners
            this.handleResize = this.onWindowResize.bind(this);
            window.addEventListener('resize', this.handleResize);
            
            // Initialize planets
            this.initializePlanets();

            // Start animation loop
            this.animate();
        } catch (error) {
            console.error('Error in ThreePlanetViewer initialization:', error);
            throw error;
        }
    }

    initializePlanets() {
        if (!window.planetData) {
            console.error('Planet data not found');
            return;
        }

        Object.entries(window.planetData).forEach(([key, data]) => {
            const scaledRadius = data.radius * this.scaleFactor;
            this.createPlanet(
                data.name,
                scaledRadius,
                data.textureUrl,
                data.properties
            );
        });
    }

    createPlanet(name, radius, textureUrl, properties = {}) {
        try {
            const geometry = new THREE.SphereGeometry(radius, 64, 64);
            const textureLoader = new THREE.TextureLoader();
            
            textureLoader.load(
                textureUrl,
                (texture) => {
                    let material;
                    
                    if (name === 'Sun') {
                        material = new THREE.MeshPhongMaterial({
                            map: texture,
                            emissive: 0xffff00,
                            emissiveIntensity: 0.5,
                            shininess: 0
                        });
                    } else {
                        material = new THREE.MeshStandardMaterial({
                            map: texture,
                            metalness: 0.1,
                            roughness: 0.8
                        });
                    }
                    
                    const planet = new THREE.Mesh(geometry, material);
                    planet.userData = { ...properties, name };
                    
                    this.planets.set(name, planet);
                    
                    if (this.planets.size === 1) {
                        this.showPlanet(name);
                    }
                },
                (xhr) => {
                    console.log(`${name} texture: ${(xhr.loaded / xhr.total * 100)}% loaded`);
                },
                (error) => {
                    console.error(`Error loading texture for ${name}:`, error, textureUrl);
                    // Fallback material
                    const material = new THREE.MeshStandardMaterial({
                        color: 0x808080,
                        metalness: 0.1,
                        roughness: 0.8
                    });
                    const planet = new THREE.Mesh(geometry, material);
                    planet.userData = { ...properties, name };
                    this.planets.set(name, planet);
                }
            );
        } catch (error) {
            console.error(`Error creating planet ${name}:`, error);
        }
    }

    showPlanet(name) {
        try {
            const planet = this.planets.get(name);
            if (!planet) {
                console.warn(`Planet ${name} not found`);
                return;
            }
            
            if (this.currentPlanet) {
                this.scene.remove(this.currentPlanet);
            }
            
            this.currentPlanet = planet;
            this.scene.add(planet);
            
            const distance = name === 'Sun' ? 15 : 5;
            this.camera.position.z = distance;
            this.controls.reset();
            
            this.sunLight.intensity = name === 'Sun' ? 0 : 1.5;

            if (typeof this.onPlanetChange === 'function') {
                this.onPlanetChange(planet.userData);
            }
        } catch (error) {
            console.error(`Error showing planet ${name}:`, error);
        }
    }

    onWindowResize() {
        if (!this.container || !this.camera || !this.renderer) return;

        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate() {
        if (!this.renderer || !this.scene || !this.camera) return;

        requestAnimationFrame(() => this.animate());
        
        if (this.currentPlanet) {
            this.currentPlanet.rotation.y += 0.001;
        }
        
        if (this.controls) {
            this.controls.update();
        }
        
        this.renderer.render(this.scene, this.camera);
    }

    destroy() {
        window.removeEventListener('resize', this.handleResize);
        
        if (this.controls) {
            this.controls.dispose();
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }

        this.planets.forEach((planet) => {
            if (planet.geometry) planet.geometry.dispose();
            if (planet.material) {
                if (planet.material.map) planet.material.map.dispose();
                planet.material.dispose();
            }
        });

        this.planets.clear();
        this.currentPlanet = null;
        this.scene = null;
    }
};