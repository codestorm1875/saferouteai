// LocalStorage utilities for SafeRouteAI

const STORAGE_KEYS = {
    SAVED_LOCATIONS: 'saferouteai_saved_locations',
    USER_PREFERENCES: 'saferouteai_user_preferences',
    PROFILE_STATS: 'saferouteai_profile_stats',
};

// Saved Locations Management
export const getSavedLocations = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.SAVED_LOCATIONS);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error getting saved locations:', error);
        return [];
    }
};

export const addSavedLocation = (location) => {
    try {
        const locations = getSavedLocations();
        const newLocation = {
            id: Date.now().toString(),
            ...location,
            createdAt: new Date().toISOString(),
        };
        locations.push(newLocation);
        localStorage.setItem(STORAGE_KEYS.SAVED_LOCATIONS, JSON.stringify(locations));
        return newLocation;
    } catch (error) {
        console.error('Error adding saved location:', error);
        return null;
    }
};

export const removeSavedLocation = (id) => {
    try {
        const locations = getSavedLocations();
        const filtered = locations.filter(loc => loc.id !== id);
        localStorage.setItem(STORAGE_KEYS.SAVED_LOCATIONS, JSON.stringify(filtered));
        return true;
    } catch (error) {
        console.error('Error removing saved location:', error);
        return false;
    }
};

export const updateSavedLocation = (id, updates) => {
    try {
        const locations = getSavedLocations();
        const index = locations.findIndex(loc => loc.id === id);
        if (index !== -1) {
            locations[index] = { ...locations[index], ...updates };
            localStorage.setItem(STORAGE_KEYS.SAVED_LOCATIONS, JSON.stringify(locations));
            return locations[index];
        }
        return null;
    } catch (error) {
        console.error('Error updating saved location:', error);
        return null;
    }
};

// User Preferences Management
export const getUserPreferences = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
        return data ? JSON.parse(data) : {
            riskTolerance: 'balanced', // cautious, balanced, fast
            notifications: true,
            darkMode: true,
        };
    } catch (error) {
        console.error('Error getting user preferences:', error);
        return {
            riskTolerance: 'balanced',
            notifications: true,
            darkMode: true,
        };
    }
};

export const setUserPreferences = (preferences) => {
    try {
        const current = getUserPreferences();
        const updated = { ...current, ...preferences };
        localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updated));
        return updated;
    } catch (error) {
        console.error('Error setting user preferences:', error);
        return null;
    }
};

// Profile Statistics Management
export const getProfileStats = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.PROFILE_STATS);
        return data ? JSON.parse(data) : {
            incidentsReported: 0,
            routesCalculated: 0,
            savedLocationsCount: 0,
            joinedDate: new Date().toISOString(),
        };
    } catch (error) {
        console.error('Error getting profile stats:', error);
        return {
            incidentsReported: 0,
            routesCalculated: 0,
            savedLocationsCount: 0,
            joinedDate: new Date().toISOString(),
        };
    }
};

export const incrementStat = (statName) => {
    try {
        const stats = getProfileStats();
        if (stats.hasOwnProperty(statName)) {
            stats[statName] += 1;
            localStorage.setItem(STORAGE_KEYS.PROFILE_STATS, JSON.stringify(stats));
            return stats;
        }
        return stats;
    } catch (error) {
        console.error('Error incrementing stat:', error);
        return null;
    }
};

export const clearAllData = () => {
    try {
        localStorage.removeItem(STORAGE_KEYS.SAVED_LOCATIONS);
        localStorage.removeItem(STORAGE_KEYS.USER_PREFERENCES);
        localStorage.removeItem(STORAGE_KEYS.PROFILE_STATS);
        return true;
    } catch (error) {
        console.error('Error clearing data:', error);
        return false;
    }
};

// Community Features
export const getUserId = () => {
    try {
        let userId = localStorage.getItem('saferouteai_user_id');
        if (!userId) {
            userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('saferouteai_user_id', userId);
        }
        return userId;
    } catch (error) {
        console.error('Error getting user ID:', error);
        return `user_${Date.now()}`;
    }
};

export const getUsername = () => {
    try {
        return localStorage.getItem('saferouteai_username') || 'SafetyChampion';
    } catch (error) {
        console.error('Error getting username:', error);
        return 'SafetyChampion';
    }
};

export const setUsername = (username) => {
    try {
        localStorage.setItem('saferouteai_username', username);
        return true;
    } catch (error) {
        console.error('Error setting username:', error);
        return false;
    }
};

export const getUpvotedIncidents = () => {
    try {
        const data = localStorage.getItem('saferouteai_upvoted_incidents');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error getting upvoted incidents:', error);
        return [];
    }
};

export const addUpvotedIncident = (incidentId) => {
    try {
        const upvoted = getUpvotedIncidents();
        if (!upvoted.includes(incidentId)) {
            upvoted.push(incidentId);
            localStorage.setItem('saferouteai_upvoted_incidents', JSON.stringify(upvoted));
        }
        return true;
    } catch (error) {
        console.error('Error adding upvoted incident:', error);
        return false;
    }
};

