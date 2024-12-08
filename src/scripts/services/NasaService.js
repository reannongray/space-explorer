window.NasaService = class NasaService {
    static API_KEY = 'CVL3wc7WSyQjg1KiLHEVBXKLRuUGbRbzSAFtYZd0';
    static CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    static cache = new Map();

    static async getAPOD() {
        try {
            // Check cache first
            const cachedData = this.getFromCache('apod');
            if (cachedData) return cachedData;

            const response = await fetch(
                `https://api.nasa.gov/planetary/apod?api_key=${this.API_KEY}`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'SpaceExplorer/1.0'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`NASA API Error: ${response.status}`);
            }

            const data = await response.json();
            this.setCache('apod', data);
            return data;

        } catch (error) {
            console.error('APOD fetch error:', error);
            // Return fallback data if available in cache
            const fallbackData = this.getFromCache('apod');
            if (fallbackData) return fallbackData;
            throw error;
        }
    }

    static async searchImage(query, page = 1, limit = 10) {
        try {
            const cacheKey = `search-${query}-${page}`;
            const cachedData = this.getFromCache(cacheKey);
            if (cachedData) return cachedData;

            const response = await fetch(
                `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image&page=${page}&page_size=${limit}`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'SpaceExplorer/1.0'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`NASA Image Search Error: ${response.status}`);
            }

            const data = await response.json();
            this.setCache(cacheKey, data);
            return data.collection?.items || [];

        } catch (error) {
            console.error('Image search error:', error);
            const fallbackData = this.getFromCache(`search-${query}-${page}`);
            if (fallbackData) return fallbackData;
            return [];
        }
    }

    static getFromCache(key) {
        const cached = this.cache.get(key);
        if (!cached) return null;
        
        if (Date.now() - cached.timestamp > this.CACHE_DURATION) {
            this.cache.delete(key);
            return null;
        }
        
        return cached.data;
    }

    static setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }
};