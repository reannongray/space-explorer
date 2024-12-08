window.PlanetComparison = class PlanetComparison {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Container not found:', containerId);
            return;
        }
        this.createLayout();
        this.initializeCharts();
        console.log('PlanetComparison initialized');
    }

    createLayout() {
        const layout = `
            <div class="planet-comparison glass-panel">
                <div class="comparison-controls">
                    <div class="planet-selector"></div>
                </div>
                <div class="comparison-charts">
                    <div class="chart-container">
                        <canvas id="sizeChart"></canvas>
                    </div>
                </div>
                <div class="planet-details glass-panel">
                    <div class="planet-info"></div>
                </div>
            </div>
        `;
        
        this.container.innerHTML = layout;
        this.createPlanetSelectors();
    }

    createPlanetSelectors() {
        const selector = this.container.querySelector('.planet-selector');
        Object.entries(window.planetData).forEach(([key, data]) => {
            const buttonId = `planet-btn-${key}`;
            const button = document.createElement('button');
            button.className = 'planet-button glass-button';
            button.dataset.planet = data.name;
            button.id = buttonId;
            button.setAttribute('aria-label', `Select ${data.name}`);
            button.innerHTML = `
                <i class="fas ${this.getPlanetIcon(data.name)}"></i>
                <span class="planet-name">${data.name}</span>
            `;
            selector.appendChild(button);
        });

        selector.addEventListener('click', (e) => {
            const button = e.target.closest('.planet-button');
            if (button) {
                this.updateCharts(button.dataset.planet);
                this.updateActiveButton(button);
            }
        });
    }

    getPlanetIcon(name) {
        const icons = {
            'Sun': 'fa-sun',
            'Earth': 'fa-earth',
            'Mars': 'fa-globe-americas',
            'Jupiter': 'fa-circle',
            'Saturn': 'fa-circle',
            'Uranus': 'fa-circle',
            'Neptune': 'fa-circle',
            'Mercury': 'fa-circle',
            'Venus': 'fa-circle'
        };
        return icons[name] || 'fa-circle';
    }

    initializeCharts() {
        const ctx = document.getElementById('sizeChart');
        if (!ctx) {
            console.error('Chart canvas not found');
            return;
        }

        const config = {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Planet Size (km)',
                    data: [],
                    backgroundColor: 'rgba(0, 212, 255, 0.3)',
                    borderColor: 'rgba(0, 212, 255, 0.8)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.8)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.8)'
                        }
                    }
                }
            }
        };

        this.sizeChart = new Chart(ctx, config);

        // Initialize with first planet
        const firstPlanet = Object.values(window.planetData)[0];
        if (firstPlanet) {
            this.updateCharts(firstPlanet.name);
            const firstButton = this.container.querySelector('.planet-button');
            if (firstButton) {
                this.updateActiveButton(firstButton);
            }
        }
    }

    updateCharts(planetName) {
        console.log('Updating for planet:', planetName);
        const planet = window.planetData[planetName.toLowerCase()];
        
        if (!planet) {
            console.warn(`No data found for planet: ${planetName}`);
            return;
        }

        // Extract diameter value from the string
        const diameter = parseInt(planet.properties.diameter.replace(/[^0-9]/g, ''));
        
        // Update size chart
        this.sizeChart.data.labels = [planet.name];
        this.sizeChart.data.datasets[0].data = [diameter];
        this.sizeChart.update();

        // Update planet info
        const infoPanel = this.container.querySelector('.planet-info');
        infoPanel.innerHTML = `
            <h3 class="planet-title">${planet.name}</h3>
            <div class="planet-description">
                <p>${planet.properties.description}</p>
            </div>
            <div class="planet-stats">
                <div class="stat">
                    <span class="label">Diameter</span>
                    <span class="value">${planet.properties.diameter}</span>
                </div>
                <div class="stat">
                    <span class="label">Day Length</span>
                    <span class="value">${planet.properties.dayLength}</span>
                </div>
                <div class="stat">
                    <span class="label">Year Length</span>
                    <span class="value">${planet.properties.yearLength}</span>
                </div>
                ${planet.properties.gravity ? `
                <div class="stat">
                    <span class="label">Gravity</span>
                    <span class="value">${planet.properties.gravity}</span>
                </div>
                ` : ''}
            </div>
        `;
    }

    updateActiveButton(activeButton) {
        this.container.querySelectorAll('.planet-button').forEach(button => {
            button.classList.remove('active');
        });
        activeButton.classList.add('active');
    }
};