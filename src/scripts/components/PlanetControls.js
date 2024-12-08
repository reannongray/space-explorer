window.PlanetControls = class PlanetControls {
    constructor(planetViewer) {
        this.viewer = planetViewer;
        this.container = document.querySelector('.planet-selector');
        this.init();
    }

    init() {
        this.createPlanetButtons();
        this.setupEventListeners();
    }

    createPlanetButtons() {
        const planets = this.viewer.planets;
        const planetIcons = {
            'Sun': 'fa-sun',
            'Mercury': 'fa-circle',
            'Venus': 'fa-circle',
            'Earth': 'fa-earth',
            'Mars': 'fa-circle',
            'Jupiter': 'fa-circle',
            'Saturn': 'fa-circle',
            'Uranus': 'fa-circle',
            'Neptune': 'fa-circle'
        };

        planets.forEach((_, name) => {
            const button = document.createElement('button');
            button.className = 'planet-button glass-button';
            button.dataset.planet = name;
            button.innerHTML = `
                <i class="fas ${planetIcons[name] || 'fa-circle'}"></i>
                <span class="planet-name">${name}</span>
            `;
            this.container.appendChild(button);
        });
    }

    setupEventListeners() {
        this.container.addEventListener('click', (e) => {
            const button = e.target.closest('.planet-button');
            if (button) {
                const planetName = button.dataset.planet;
                this.viewer.showPlanet(planetName);
                this.updateActiveButton(button);
                this.updatePlanetInfo(planetName);
            }
        });
    }

    updateActiveButton(activeButton) {
        const buttons = this.container.querySelectorAll('.planet-button');
        buttons.forEach(button => button.classList.remove('active'));
        activeButton.classList.add('active');
    }

    updatePlanetInfo(planetName) {
        const planet = this.viewer.planets.get(planetName);
        if (!planet) return;

        const infoPanel = document.querySelector('.planet-info-panel');
        const nameElement = infoPanel.querySelector('.planet-name');
        const statsElement = infoPanel.querySelector('.planet-stats');
        const descElement = infoPanel.querySelector('.planet-description');

        nameElement.textContent = planetName;
        statsElement.innerHTML = `
            <p><strong>Diameter:</strong> ${planet.userData.diameter}</p>
            <p><strong>Day Length:</strong> ${planet.userData.dayLength}</p>
            <p><strong>Year Length:</strong> ${planet.userData.yearLength}</p>
            <p><strong>Gravity:</strong> ${planet.userData.gravity}</p>
        `;
        descElement.textContent = planet.userData.description;
    }
};