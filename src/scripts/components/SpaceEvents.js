window.SpaceEvents = class SpaceEvents {
    constructor() {
        this.events = [
            {
                name: "Total Solar Eclipse",
                date: "2024-04-08",
                description: "Visible across North America",
                type: "eclipse"
            },
            {
                name: "Lyrid Meteor Shower",
                date: "2024-04-22",
                description: "Peak viewing period with up to 20 meteors per hour",
                type: "meteor"
            },
            {
                name: "Perseid Meteor Shower",
                date: "2024-08-12",
                description: "One of the best meteor showers of the year",
                type: "meteor"
            },
            {
                name: "Jupiter Opposition",
                date: "2024-12-07",
                description: "Best time to view Jupiter",
                type: "planet"
            }
        ];
    }

    getNextEvent() {
        const now = new Date();
        return this.events.find(event => new Date(event.date) > now) || this.events[0];
    }

    getAllUpcomingEvents() {
        const now = new Date();
        return this.events.filter(event => new Date(event.date) > now);
    }

    getEventsByType(type) {
        return this.events.filter(event => event.type === type);
    }

    calculateCountdown(eventDate) {
        const now = new Date().getTime();
        const eventTime = new Date(eventDate).getTime();
        const distance = eventTime - now;

        return {
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000)
        };
    }
};