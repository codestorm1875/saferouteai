import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, MapPin, Plus, Trash2, User, Trophy, Shield, Zap, Star, Award, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
import Leaderboard from '../components/Leaderboard';
import { safetyAPI } from '../services/api';

const SettingsScreen = () => {
    const navigate = useNavigate();
    const [savedLocations, setSavedLocations] = useState([]);
    const [preferences, setPreferences] = useState({ riskTolerance: 'balanced' });
    const [stats, setStats] = useState({});
    const [leaderboardData, setLeaderboardData] = useState(null);
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
        <div className="screen" style={{ padding: 0 }}>
            {/* Cyber Grid Background */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'linear-gradient(rgba(30, 41, 59, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(30, 41, 59, 0.1) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                pointerEvents: 'none',
                zIndex: 0
            }} />

            {/* Header with Glow Effect */}
            <div className="status-bar glass-panel" style={{
                top: '20px',
                padding: '20px 24px',
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(24px)',
                boxShadow: '0 0 40px rgba(16, 185, 129, 0.2), 0 8px 32px rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(16, 185, 129, 0.15)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '14px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 25px rgba(16, 185, 129, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
                        border: '1px solid rgba(16, 185, 129, 0.3)'
                    }}>
                        <SettingsIcon size={24} color="#ffffff" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 style={{ 
                            margin: 0, 
                            fontSize: '26px', 
                            fontFamily: 'Outfit, sans-serif', 
                            fontWeight: '800',
                            letterSpacing: '0.5px',
                            background: 'linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>Settings</h1>
                        <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500' }}>
                            Customize your SafeRoute experience
                        </p>
                    </div>
                </div>
            </div>

            <div className="screen-content" style={{ paddingTop: '140px', paddingBottom: '120px', position: 'relative', zIndex: 1 }}>
                {/* Profile Stats with Cyber Design */}
                <div className="glass-panel" style={{
                    marginBottom: '24px',
                    background: 'rgba(15, 23, 42, 0.75)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    boxShadow: '0 0 30px rgba(16, 185, 129, 0.15), 0 8px 32px rgba(0, 0, 0, 0.4)',
                    padding: '24px',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Subtle gradient overlay */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '100%',
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.03) 0%, transparent 50%)',
                        pointerEvents: 'none'
                    }} />
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', position: 'relative' }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.15) 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1.5px solid rgba(16, 185, 129, 0.4)',
                            boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)'
                        }}>
                            <User size={18} color="var(--primary)" strokeWidth={2.5} />
                        </div>
                        <div>
                            <h3 style={{
                                fontSize: '15px',
                                fontWeight: '800',
                                color: 'var(--text-primary)',
                                margin: 0,
                                fontFamily: 'Outfit, sans-serif',
                                letterSpacing: '1px',
                                textTransform: 'uppercase'
                            }}>
                                Your Activity
                            </h3>
                            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500' }}>
                                Keep making Lagos safer
                            </p>
                        </div>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '12px',
                        position: 'relative'
                    }}>
                        <div style={{
                            textAlign: 'center',
                            padding: '20px 14px',
                            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.03) 100%)',
                            borderRadius: '18px',
                            border: '1.5px solid rgba(16, 185, 129, 0.25)',
                            boxShadow: '0 4px 20px rgba(16, 185, 129, 0.1)',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '-50%',
                                right: '-50%',
                                width: '100%',
                                height: '100%',
                                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
                                pointerEvents: 'none'
                            }} />
                            <Shield size={22} style={{ margin: '0 auto 10px', color: 'var(--primary)', filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.5))' }} strokeWidth={2.5} />
                            <div style={{
                                fontSize: '32px',
                                fontWeight: '900',
                                color: 'var(--primary)',
                                textShadow: '0 0 20px rgba(16, 185, 129, 0.7)',
                                fontFamily: 'Outfit, sans-serif',
                                lineHeight: 1,
                                marginBottom: '8px'
                            }}>
                                {stats.incidentsReported || 0}
                            </div>
                            <div style={{
                                fontSize: '9px',
                                color: 'rgba(148, 163, 184, 0.9)',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '0.8px'
                            }}>
                                Reports
                            </div>
                        </div>
                        <div style={{
                            textAlign: 'center',
                            padding: '20px 14px',
                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.03) 100%)',
                            borderRadius: '18px',
                            border: '1.5px solid rgba(59, 130, 246, 0.25)',
                            boxShadow: '0 4px 20px rgba(59, 130, 246, 0.1)',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '-50%',
                                right: '-50%',
                                width: '100%',
                                height: '100%',
                                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                                pointerEvents: 'none'
                            }} />
                            <Zap size={22} style={{ margin: '0 auto 10px', color: '#3b82f6', filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))' }} strokeWidth={2.5} />
                            <div style={{
                                fontSize: '32px',
                                fontWeight: '900',
                                color: '#3b82f6',
                                textShadow: '0 0 20px rgba(59, 130, 246, 0.7)',
                                fontFamily: 'Outfit, sans-serif',
                                lineHeight: 1,
                                marginBottom: '8px'
                            }}>
                                {stats.routesCalculated || 0}
                            </div>
                            <div style={{
                                fontSize: '9px',
                                color: 'rgba(148, 163, 184, 0.9)',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '0.8px'
                            }}>
                                Routes
                            </div>
                        </div>
                        <div style={{
                            textAlign: 'center',
                            padding: '20px 14px',
                            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(245, 158, 11, 0.03) 100%)',
                            borderRadius: '18px',
                            border: '1.5px solid rgba(245, 158, 11, 0.25)',
                            boxShadow: '0 4px 20px rgba(245, 158, 11, 0.1)',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '-50%',
                                right: '-50%',
                                width: '100%',
                                height: '100%',
                                background: 'radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%)',
                                pointerEvents: 'none'
                            }} />
                            <Star size={22} style={{ margin: '0 auto 10px', color: '#f59e0b', filter: 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.5))' }} strokeWidth={2.5} />
                            <div style={{
                                fontSize: '32px',
                                fontWeight: '900',
                                color: '#f59e0b',
                                textShadow: '0 0 20px rgba(245, 158, 11, 0.7)',
                                fontFamily: 'Outfit, sans-serif',
                                lineHeight: 1,
                                marginBottom: '8px'
                            }}>
                                {savedLocations.length}
                            </div>
                            <div style={{
                                fontSize: '9px',
                                color: 'rgba(148, 163, 184, 0.9)',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '0.8px'
                            }}>
                                Saved
                            </div>
                        </div>
                    </div>
                </div>

                {/* Leaderboard */}
                <div style={{ marginBottom: '24px' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '18px',
                    }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(217, 119, 6, 0.15) 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1.5px solid rgba(245, 158, 11, 0.4)',
                            boxShadow: '0 0 15px rgba(245, 158, 11, 0.2)'
                        }}>
                            <Trophy size={18} color="#f59e0b" strokeWidth={2.5} />
                        </div>
                        <h3 style={{
                            fontSize: '15px',
                            fontWeight: '800',
                            color: 'var(--text-primary)',
                            margin: 0,
                            fontFamily: 'Outfit, sans-serif',
                            letterSpacing: '1px',
                            textTransform: 'uppercase'
                        }}>
                            Top Contributors
                        </h3>
                    </div>
                    {leaderboardData ? (
                        <Leaderboard
                            leaderboard={leaderboardData.leaderboard}
                            currentUserId={userId}
                        />
                    ) : (
                        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                            Loading leaderboard...
                        </div>
                    )}
                </div>

                {/* Risk Tolerance */}
                <div style={{ marginBottom: '24px' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '18px',
                    }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(37, 99, 235, 0.15) 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1.5px solid rgba(59, 130, 246, 0.4)',
                            boxShadow: '0 0 15px rgba(59, 130, 246, 0.2)'
                        }}>
                            <Target size={18} color="#3b82f6" strokeWidth={2.5} />
                        </div>
                        <h3 style={{
                            fontSize: '15px',
                            fontWeight: '800',
                            color: 'var(--text-primary)',
                            margin: 0,
                            fontFamily: 'Outfit, sans-serif',
                            letterSpacing: '1px',
                            textTransform: 'uppercase'
                        }}>
                            Risk Tolerance
                        </h3>
                    </div>
                    <PreferenceSelector
                        value={preferences.riskTolerance}
                        onChange={handlePreferenceChange}
                    />
                </div>

                {/* Saved Locations */}
                <div style={{ marginBottom: '24px' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '18px',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(124, 58, 237, 0.15) 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1.5px solid rgba(139, 92, 246, 0.4)',
                                boxShadow: '0 0 15px rgba(139, 92, 246, 0.2)'
                            }}>
                                <MapPin size={18} color="#8b5cf6" strokeWidth={2.5} />
                            </div>
                            <h3 style={{
                                fontSize: '15px',
                                fontWeight: '800',
                                color: 'var(--text-primary)',
                                margin: 0,
                                fontFamily: 'Outfit, sans-serif',
                                letterSpacing: '1px',
                                textTransform: 'uppercase'
                            }}>
                                Saved Locations
                            </h3>
                        </div>
                        <button
                            onClick={() => navigate('/add-location')}
                            style={{
                                padding: '10px 18px',
                                fontSize: '12px',
                                fontWeight: '700',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                cursor: 'pointer',
                                color: '#ffffff',
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                borderRadius: '14px',
                                boxShadow: '0 0 20px rgba(16, 185, 129, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                                transition: 'all 0.3s ease',
                                fontFamily: 'Outfit, sans-serif',
                                letterSpacing: '0.5px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = '0 0 30px rgba(16, 185, 129, 0.6), inset 0 1px 0 rgba(255,255,255,0.2)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <Plus size={16} strokeWidth={2.5} />
                            Add Location
                        </button>
                    </div>

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
                        <div className="glass-panel" style={{
                            textAlign: 'center',
                            padding: 'var(--space-xl)',
                            color: 'var(--text-secondary)',
                        }}>
                            <MapPin size={32} style={{ margin: '0 auto var(--space-sm)', opacity: 0.5 }} />
                            <p style={{ margin: 0, fontSize: '13px' }}>
                                No saved locations yet. Add your frequent destinations above.
                            </p>
                        </div>
                    )}
                </div>

                {/* Clear Data */}
                <button
                    onClick={handleClearData}
                    style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(239, 68, 68, 0.08) 100%)',
                        border: '1.5px solid rgba(239, 68, 68, 0.35)',
                        color: '#ef4444',
                        padding: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        fontWeight: '800',
                        fontSize: '13px',
                        borderRadius: '18px',
                        backdropFilter: 'blur(12px)',
                        transition: 'all 0.3s ease',
                        fontFamily: 'Outfit, sans-serif',
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.12) 100%)';
                        e.currentTarget.style.boxShadow = '0 0 25px rgba(239, 68, 68, 0.4)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(239, 68, 68, 0.08) 100%)';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    <Trash2 size={18} strokeWidth={2.5} />
                    Clear All Data
                </button>
            </div>
        </div>
    );
};

export default SettingsScreen;
