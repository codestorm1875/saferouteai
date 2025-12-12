import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const safetyAPI = {
    // Get safety heatmap data
    getHeatmap: async () => {
        const response = await api.get('/heatmap');
        return response.data;
    },

    // Predict safety score for a location
    predictSafety: async (data) => {
        const response = await api.post('/predict', data);
        return response.data;
    },

    // Report an incident
    reportIncident: async (incident) => {
        const response = await api.post('/incident', incident);
        return response.data;
    },

    // Get all incidents
    getIncidents: async (limit = 50) => {
        const response = await api.get(`/incidents?limit=${limit}`);
        return response.data;
    },

    // Submit sensor data
    submitSensorData: async (sensorData) => {
        const response = await api.post('/sensor', sensorData);
        return response.data;
    },

    // Calculate safe route
    calculateSafeRoute: async (routeData) => {
        const response = await api.post('/safe-route', routeData);
        return response.data;
    },

    // Get safety trends for a zone
    getTrends: async (zoneId) => {
        const response = await api.get(`/trends/${zoneId}`);
        return response.data;
    },

    // Search zones by name
    searchZones: async (query) => {
        const response = await api.get(`/zone-search?q=${encodeURIComponent(query)}`);
        return response.data;
    },

    // Upvote an incident
    upvoteIncident: async (incidentId, userId) => {
        const response = await api.post(`/incident/${incidentId}/upvote`, { user_id: userId });
        return response.data;
    },

    // Get leaderboard
    getLeaderboard: async (limit = 10) => {
        const response = await api.get(`/leaderboard?limit=${limit}`);
        return response.data;
    },

    // Create or update user profile
    createOrUpdateProfile: async (userId, username) => {
        const response = await api.post('/user/profile', { user_id: userId, username });
        return response.data;
    },

    // Get nearby incidents
    getNearbyIncidents: async (lat, lng, radiusKm = 2.0, limit = 20) => {
        const response = await api.get(`/incidents/nearby?lat=${lat}&lng=${lng}&radius_km=${radiusKm}&limit=${limit}`);
        return response.data;
    },

    // Machine Learning Endpoints
    getDangerZones: async () => {
        const response = await api.get('/ml/danger-zones');
        return response.data;
    },

    getMLInsights: async () => {
        const response = await api.get('/ml/insights');
        return response.data;
    },

    getAnomalies: async () => {
        const response = await api.get('/ml/anomalies');
        return response.data;
    },
};

export default api;
