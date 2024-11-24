class PlanetViewer {
    constructor(container) {
        console.log('PlanetViewer initialized');
        this.container = container;
        this.planets = [
            {
                name: "Mercury",
                diameter: 4879,
                distance: 57.9,
                description: "The smallest and innermost planet in the Solar System",
                color: "#A5A5A5",
                funFact: "A year on Mercury is just 88 Earth days long"
            },
            {
                name: "Venus",
                diameter: 12104,
                distance: 108.2,
                description: "Often called Earth's sister planet due to similar size",
                color: "#E6B88A",
                funFact: "Venus spins backwards compared to most planets"
            },
            {
                name: "Earth",
                diameter: 12742,
                distance: 149.6,
                description: "Our home planet and the only known planet with life",
                color: "#4B87DE",
                funFact: "Earth is the only planet not named after a god or goddess"
            },
            {
                name: "Mars",
                diameter: 6779,
                distance: 227.9,
                description: "The Red Planet, named after the Roman god of war",
                color: "#DE4B4B",
                funFact: "Mars has the largest volcano in the solar system"
            }
        ];
        
        this.init();
        this.addInteractivity();
    }

    init() {
        this.createPlanetGrid();
    }

    createPlanetGrid() {
        const gridContainer = document.createElement('div');
        gridContainer.className = 'planet-grid';

        this.planets.forEach(planet => {
            const card = this.createPlanetCard(planet);
            gridContainer.appendChild(card);
        });

        this.container.appendChild(gridContainer);
    }

    createPlanetCard(planet) {
        const card = document.createElement('div');
        card.className = 'planet-card glass-panel';
        
        const planetOrb = document.createElement('div');
        planetOrb.className = 'planet-orb';
        planetOrb.style.backgroundColor = planet.color;

        card.innerHTML = `
            <h3>${planet.name}</h3>
            <div class="planet-stats">
                <span>Diameter: ${planet.diameter} km</span>
                <span>Distance from Sun: ${planet.distance} million km</span>
            </div>
            <p class="planet-description">${planet.description}</p>
            <div class="fun-fact">
                <span>Fun Fact:</span> ${planet.funFact}
            </div>
        `;
        
        card.insertBefore(planetOrb, card.firstChild);
        return card;
    }

    addInteractivity() {
        const cards = this.container.querySelectorAll('.planet-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const orb = card.querySelector('.planet-orb');
                orb.style.transform = 'scale(1.1) rotate(180deg)';
            });
            
            card.addEventListener('mouseleave', () => {
                const orb = card.querySelector('.planet-orb');
                orb.style.transform = 'scale(1) rotate(0)';
            });
        });
    }
}

export default PlanetViewer;
