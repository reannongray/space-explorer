class SpaceEvents {
    constructor() {
        this.events = [
            {
                name: "Perseid Meteor Shower",
                date: "2024-08-12",
                description: "One of the best meteor showers of the year"
            },
            {
                name: "Total Solar Eclipse",
                date: "2024-04-08",
                description: "Visible across North America"
            }
        ];
    }

    getNextEvent() {
        const now = new Date();
        return this.events.find(event => new Date(event.date) > now) || this.events[0];
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
}

export default SpaceEvents;
