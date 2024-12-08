window.EventDisplay = class EventDisplay {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.events = new SpaceEvents();
        this.init();
    }

    init() {
        this.createEventCards();
        this.startCountdown();
    }

    createEventCards() {
        const upcomingEvents = this.events.getAllUpcomingEvents();
        const eventHTML = upcomingEvents.map(event => this.createEventCard(event)).join('');
        this.container.innerHTML = eventHTML;
    }

    createEventCard(event) {
        return `
            <div class="event-card glass-panel" data-date="${event.date}">
                <div class="event-type-icon">
                    <i class="fas ${this.getEventIcon(event.type)}"></i>
                </div>
                <h3>${event.name}</h3>
                <p>${event.description}</p>
                <div class="countdown" id="countdown-${event.date}"></div>
            </div>
        `;
    }

    getEventIcon(type) {
        const icons = {
            'eclipse': 'fa-sun',
            'meteor': 'fa-meteor',
            'planet': 'fa-globe'
        };
        return icons[type] || 'fa-star';
    }

    startCountdown() {
        setInterval(() => {
            const events = this.events.getAllUpcomingEvents();
            events.forEach(event => {
                const countdownElement = document.getElementById(`countdown-${event.date}`);
                if (countdownElement) {
                    const countdown = this.events.calculateCountdown(event.date);
                    countdownElement.innerHTML = this.formatCountdown(countdown);
                }
            });
        }, 1000);
    }

    formatCountdown(countdown) {
        return `
            <div class="countdown-timer">
                <span>${countdown.days}d </span>
                <span>${countdown.hours}h </span>
                <span>${countdown.minutes}m </span>
                <span>${countdown.seconds}s</span>
            </div>
        `;
    }
};