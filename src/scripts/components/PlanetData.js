window.planetData = {
    sun: {
        name: 'Sun',
        radius: 109,
        textureUrl: 'http://192.168.1.8:5502/src/assets/textures/sun.jpg',
        properties: {
            diameter: '1.39 million km',
            rotation: '27 Earth days',
            surfaceTemp: '5,500°C',
            type: 'Yellow Dwarf Star',
            description: 'The star at the center of our Solar System.'
        }
    },
    mercury: {
        name: 'Mercury',
        radius: 0.38,
        textureUrl: 'http://192.168.1.8:5502/src/assets/textures/mercury.jpg',
        properties: {
            diameter: '4,879 km',
            dayLength: '176 Earth days',
            yearLength: '88 Earth days',
            gravity: '3.7 m/s²',
            description: 'The smallest and innermost planet in the Solar System.'
        }
    },
    venus: {
        name: 'Venus',
        radius: 0.95,
        textureUrl: 'http://192.168.1.8:5502/src/assets/textures/venus.jpg',
        properties: {
            diameter: '12,104 km',
            dayLength: '243 Earth days',
            yearLength: '225 Earth days',
            gravity: '8.87 m/s²',
            description: 'Often called Earth\'s sister planet due to similar size and mass.'
        }
    },
    earth: {
        name: 'Earth',
        radius: 1,
        textureUrl: 'http://192.168.1.8:5502/src/assets/textures/earth.jpg',
        properties: {
            diameter: '12,742 km',
            dayLength: '24 hours',
            yearLength: '365.25 days',
            gravity: '9.81 m/s²',
            description: 'Our home planet and the only known planet to harbor life.'
        }
    },
    mars: {
        name: 'Mars',
        radius: 0.53,
        textureUrl: 'http://192.168.1.8:5502/src/assets/textures/mars.jpg',
        properties: {
            diameter: '6,779 km',
            dayLength: '24 hours 37 minutes',
            yearLength: '687 Earth days',
            gravity: '3.72 m/s²',
            description: 'The Red Planet, named after the Roman god of war.'
        }
    },
    jupiter: {
        name: 'Jupiter',
        radius: 11.2,
        textureUrl: 'http://192.168.1.8:5502/src/assets/textures/jupiter.jpg',
        properties: {
            diameter: '139,820 km',
            dayLength: '10 hours',
            yearLength: '12 Earth years',
            gravity: '24.79 m/s²',
            description: 'The largest planet in our Solar System.'
        }
    },
    saturn: {
        name: 'Saturn',
        radius: 9.45,
        textureUrl: 'http://192.168.1.8:5502/src/assets/textures/saturn.jpg',
        properties: {
            diameter: '116,460 km',
            dayLength: '10.7 hours',
            yearLength: '29.5 Earth years',
            gravity: '10.44 m/s²',
            description: 'Famous for its spectacular ring system.'
        }
    },
    uranus: {
        name: 'Uranus',
        radius: 4,
        textureUrl: 'http://192.168.1.8:5502/src/assets/textures/uranus.jpg',
        properties: {
            diameter: '50,724 km',
            dayLength: '17 hours',
            yearLength: '84 Earth years',
            gravity: '8.69 m/s²',
            description: 'The coldest of the gas giants, tilted on its side.'
        }
    },
    neptune: {
        name: 'Neptune',
        radius: 3.88,
        textureUrl: 'http://192.168.1.8:5502/src/assets/textures/neptune.jpg',
        properties: {
            diameter: '49,244 km',
            dayLength: '16 hours',
            yearLength: '165 Earth years',
            gravity: '11.15 m/s²',
            description: 'The windiest planet, with speeds up to 2,100 km/h.'
        }
    }
};

// Helper functions
window.getPlanetList = () => Object.keys(window.planetData);
window.getPlanetInfo = (planetName) => window.planetData[planetName];
window.loadPlanetTextures = async () => {
    const textures = {};
    const planets = Object.keys(window.planetData);
    
    for (const planet of planets) {
        textures[planet] = window.planetData[planet].textureUrl;
    }
    
    return textures;
};