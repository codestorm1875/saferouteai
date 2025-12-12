// Notification Service for SafeRouteAI
// Handles browser notifications for safety alerts

class NotificationService {
    constructor() {
        this.permission = 'default';
        this.checkPermission();
    }

    checkPermission() {
        if ('Notification' in window) {
            this.permission = Notification.permission;
        }
    }

    async requestPermission() {
        if (!('Notification' in window)) {
            console.warn('This browser does not support notifications');
            return false;
        }

        if (this.permission === 'granted') {
            return true;
        }

        try {
            const permission = await Notification.requestPermission();
            this.permission = permission;
            return permission === 'granted';
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            return false;
        }
    }

    showNotification(title, options = {}) {
        if (this.permission !== 'granted') {
            console.warn('Notification permission not granted');
            return null;
        }

        const defaultOptions = {
            icon: '/logo.png',
            badge: '/logo.png',
            vibrate: [200, 100, 200],
            requireInteraction: false,
            ...options,
        };

        try {
            return new Notification(title, defaultOptions);
        } catch (error) {
            console.error('Error showing notification:', error);
            return null;
        }
    }

    // Safety alert when entering unsafe zone
    showSafetyAlert(zoneName, safetyScore) {
        const severity = safetyScore >= 70 ? 'moderate' : safetyScore >= 40 ? 'high' : 'critical';
        const emoji = safetyScore >= 70 ? '⚠️' : safetyScore >= 40 ? '🚨' : '🔴';

        return this.showNotification(
            `${emoji} Safety Alert`,
            {
                body: `You're near ${zoneName} (Safety: ${safetyScore}/100). Stay alert!`,
                tag: 'safety-alert',
                data: { type: 'safety', zoneName, safetyScore },
            }
        );
    }

    // Incident alert for nearby incidents
    showIncidentAlert(incidentType, distance) {
        return this.showNotification(
            '🚨 Incident Nearby',
            {
                body: `${incidentType} reported ${distance}m away. Stay safe!`,
                tag: 'incident-alert',
                data: { type: 'incident', incidentType, distance },
            }
        );
    }

    // Upvote notification
    showUpvoteNotification(incidentType) {
        return this.showNotification(
            '👍 Incident Upvoted',
            {
                body: `You verified a ${incidentType} report. Thank you for keeping Lagos safe!`,
                tag: 'upvote-success',
                data: { type: 'upvote' },
            }
        );
    }

    // Report submitted notification
    showReportSubmitted() {
        return this.showNotification(
            '✅ Report Submitted',
            {
                body: 'Your incident report helps keep the community safe. Thank you!',
                tag: 'report-success',
                data: { type: 'report' },
            }
        );
    }

    // Route calculated notification
    showRouteReady(recommendation) {
        const emoji = recommendation === 'safe' ? '🛡️' : recommendation === 'fast' ? '⚡' : '👍';
        return this.showNotification(
            `${emoji} Route Ready`,
            {
                body: `We recommend the ${recommendation} route for your journey.`,
                tag: 'route-ready',
                data: { type: 'route', recommendation },
            }
        );
    }
}

// Export singleton instance
const notificationService = new NotificationService();
export default notificationService;
