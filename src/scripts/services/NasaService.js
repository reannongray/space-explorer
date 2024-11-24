const NASA_API_KEY = 'DEMO_KEY'; // We'll use NASA's demo key for now

class NasaService {
    static async getAPOD() {
        const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`);
        return await response.json();
    }
}

export default NasaService;
