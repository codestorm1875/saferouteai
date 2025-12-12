import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, MapPin, Plus, Trash2, User, Trophy } from 'lucide-react';
import {
    getSavedLocations,
    addSavedLocation,
    removeSavedLocation,
    getUserPreferences,
    setUserPreferences,
    getProfileStats,
    clearAllData,
    getUserId,
    getUsername,
} from '../utils/storage';
import PreferenceSelector from '../components/PreferenceSelector';
import SavedLocationCard from '../components/SavedLocationCard';
import LocationSearch from '../components/LocationSearch';
import Leaderboard from '../components/Leaderboard';
import { safetyAPI } from '../services/api';

const SettingsScreen = () => {
    const [savedLocations, setSavedLocations] = useState([]);
    const [preferences, setPreferences] = useState({ riskTolerance: 'balanced' });
    const [stats, setStats] = useState({});
    const [showAddLocation, setShowAddLocation] = useState(false);
    const [leaderboardData, setLeaderboardData] = useState(null);
    const [newLocation, setNewLocation] = useState({
        label: '',
        type: 'other',
    });
    const userId = getUserId();
    const username = getUsername();

    useEffect(() => {
        loadData();
        loadLeaderboard();
        // Initialize user profile
        safetyAPI.createOrUpdateProfile(userId, username).catch(console.error);
    }, []);

    const loadData = async () => {
        setSavedLocations(getSavedLocations());
        setPreferences(getUserPreferences());

        // Fetch real stats from backend
        try {
            // First ensure profile exists
            await safetyAPI.createOrUpdateProfile(userId, username);

            // Get my specific profile stats
            const myProfile = await safetyAPI.getUserProfile(userId);

            if (myProfile) {
                setStats({
                    incidentsReported: myProfile.total_reports,
                    routesCalculated: getProfileStats().routesCalculated, // Keep local
                    savedLocationsCount: savedLocations.length
                });
            } else {
                setStats(getProfileStats());
            }
        } catch (error) {
            console.error('Error syncing profile:', error);
            setStats(getProfileStats());
        }
    };

    const loadLeaderboard = async () => {
        try {
            const data = await safetyAPI.getLeaderboard(10);
            setLeaderboardData(data);
        } catch (error) {
            console.error('Error loading leaderboard:', error);
        }
    };

    const handleAddLocation = (location) => {
        if (!newLocation.label) {
            alert('Please enter a label for this location');
            return;
        }

        const saved = addSavedLocation({
            ...newLocation,
            name: location.name,
            lat: location.lat,
            lng: location.lng,
        });

        if (saved) {
            loadData();
            setShowAddLocation(false);
            setNewLocation({ label: '', type: 'other' });
        }
    };

    const handleDeleteLocation = (id) => {
        if (confirm('Remove this saved location?')) {
            removeSavedLocation(id);
            loadData();
        }
    };

    const handlePreferenceChange = (riskTolerance) => {
        setUserPreferences({ riskTolerance });
        setPreferences({ ...preferences, riskTolerance });
    };

    const handleClearData = () => {
        if (confirm('Clear all saved data? This cannot be undone.')) {
            clearAllData();
            loadData();
        }
    };

    return (
        <div className="screen">
            <div className="screen-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                    <SettingsIcon size={24} color="var(--primary)" />
                    <h1>Settings</h1>
                </div>
                <p>Manage your preferences</p>
            </div>

            <div className="screen-content">
                {/* Profile Stats */}
                <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
                        <User size={18} color="var(--primary)" />
                        <h3 style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                            margin: 0,
                        }}>
                            Your Activity
                        </h3>
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 'var(--space-md)',
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                fontSize: '24px',
                                fontWeight: '700',
                                color: 'var(--primary)',
                            }}>
                                {stats.incidentsReported || 0}
                            </div>
                            <div style={{
                                fontSize: '11px',
                                color: 'var(--text-secondary)',
                                marginTop: '4px',
                            }}>
                                Reports
                            </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                fontSize: '24px',
                                fontWeight: '700',
                                color: 'var(--primary)',
                            }}>
                                {stats.routesCalculated || 0}
                            </div>
                            <div style={{
                                fontSize: '11px',
                                color: 'var(--text-secondary)',
                                marginTop: '4px',
                            }}>
                                Routes
                            </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                fontSize: '24px',
                                fontWeight: '700',
                                color: 'var(--primary)',
                            }}>
                                {savedLocations.length}
                            </div>
                            <div style={{
                                fontSize: '11px',
                                color: 'var(--text-secondary)',
                                marginTop: '4px',
                            }}>
                                Saved
                            </div>
                        </div>
                    </div>
                </div>

                {/* Leaderboard */}
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-sm)',
                        marginBottom: 'var(--space-md)',
                    }}>
                        <Trophy size={18} color="var(--primary)" />
                        <h3 style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                            margin: 0,
                        }}>
                            🏆 Top Contributors
                        </h3>
                    </div>
                    {leaderboardData ? (
                        <Leaderboard
                            leaderboard={leaderboardData.leaderboard}
                            currentUserId={userId}
                        />
                    ) : (
                        <div className="loading">Loading leaderboard...</div>
                    )}
                </div>

                {/* Risk Tolerance */}
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                    <h3 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                        marginBottom: 'var(--space-md)',
                    }}>
                        🎯 Risk Tolerance
                    </h3>
                    <PreferenceSelector
                        value={preferences.riskTolerance}
                        onChange={handlePreferenceChange}
                    />
                </div>

                {/* Saved Locations */}
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 'var(--space-md)',
                    }}>
                        <h3 style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                            margin: 0,
                        }}>
                            📍 Saved Locations
                        </h3>
                        <button
                            onClick={() => setShowAddLocation(!showAddLocation)}
                            className="btn btn-secondary"
                            style={{ padding: '8px 16px', fontSize: '13px' }}
                        >
                            <Plus size={16} />
                            Add
                        </button>
                    </div>

                    {showAddLocation && (
                        <div className="card" style={{ marginBottom: 'var(--space-md)' }}>
                            <div className="form-group">
                                <label>Label</label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="e.g., Home, Work, Gym"
                                    value={newLocation.label}
                                    onChange={(e) => setNewLocation({ ...newLocation, label: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Type</label>
                                <select
                                    className="input"
                                    value={newLocation.type}
                                    onChange={(e) => setNewLocation({ ...newLocation, type: e.target.value })}
                                >
                                    <option value="home">Home</option>
                                    <option value="work">Work</option>
                                    <option value="gym">Gym</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Location</label>
                                <LocationSearch
                                    onLocationSelect={handleAddLocation}
                                    placeholder="Search for location..."
                                />
                            </div>
                        </div>
                    )}

                    {savedLocations.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                            {savedLocations.map((location) => (
                                <SavedLocationCard
                                    key={location.id}
                                    location={location}
                                    onDelete={handleDeleteLocation}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="card" style={{
                            textAlign: 'center',
                            padding: 'var(--space-xl)',
                            color: 'var(--text-secondary)',
                        }}>
                            <MapPin size={32} style={{ margin: '0 auto var(--space-sm)' }} />
                            <p style={{ margin: 0, fontSize: '13px' }}>
                                No saved locations yet
                            </p>
                        </div>
                    )}
                </div>

                {/* Clear Data */}
                <button
                    onClick={handleClearData}
                    className="btn"
                    style={{
                        width: '100%',
                        background: 'transparent',
                        border: '1.5px solid #ef4444',
                        color: '#ef4444',
                    }}
                >
                    <Trash2 size={16} />
                    Clear All Data
                </button>
            </div>
        </div>
    );
};

export default SettingsScreen;
