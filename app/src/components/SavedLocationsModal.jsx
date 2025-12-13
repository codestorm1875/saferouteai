import React, { useState, useEffect } from 'react';
import { X, MapPin, Shield, AlertTriangle, Navigation } from 'lucide-react';
import { getSavedLocations } from '../utils/storage';
import { safetyAPI } from '../services/api';

const SavedLocationsModal = ({ onClose, onNavigate }) => {
    const [savedLocations, setSavedLocations] = useState([]);
    const [locationSafety, setLocationSafety] = useState({});
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        loadLocations();
    }, []);

    const loadLocations = async () => {
        const locations = getSavedLocations();
        setSavedLocations(locations);

        // Fetch safety status for each location
        for (const location of locations) {
            try {
                const safety = await safetyAPI.getSafetyScore(location.lat, location.lng);
                setLocationSafety(prev => ({
                    ...prev,
                    [location.id]: safety
                }));
            } catch (error) {
                console.error(`Error fetching safety for ${location.name}:`, error);
            }
        }
    };

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const getSafetyStatus = (score) => {
        if (!score) return { label: 'Loading...', color: '#94a3b8', icon: Shield };
        if (score >= 75) return { label: 'Safe', color: '#10b981', icon: Shield };
        if (score >= 50) return { label: 'Caution', color: '#f59e0b', icon: AlertTriangle };
        return { label: 'Unsafe', color: '#ef4444', icon: AlertTriangle };
    };

    const getTypeIcon = (type) => {
        const icons = {
            home: '🏠',
            work: '💼',
            gym: '💪',
            other: '📍'
        };
        return icons[type] || '📍';
    };

    const handleLocationClick = (location) => {
        if (onNavigate) {
            onNavigate(location);
        }
        handleClose();
    };

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={handleClose}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(8px)',
                    zIndex: 9998,
                    opacity: isVisible ? 1 : 0,
                    transition: 'opacity 0.3s ease'
                }}
            />

            {/* Modal */}
            <div
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) scale(${isVisible ? 1 : 0.9})`,
                    zIndex: 9999,
                    width: '90%',
                    maxWidth: '400px',
                    maxHeight: '80vh',
                    opacity: isVisible ? 1 : 0,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            >
                <div
                    className="glass-panel"
                    style={{
                        background: 'rgba(15, 23, 42, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        borderRadius: '24px',
                        padding: '24px',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(139, 92, 246, 0.2)',
                        display: 'flex',
                        flexDirection: 'column',
                        maxHeight: '80vh'
                    }}
                >
                    {/* Header */}
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        marginBottom: '20px',
                        paddingBottom: '16px',
                        borderBottom: '1px solid rgba(139, 92, 246, 0.2)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <MapPin size={28} color="#8b5cf6" style={{ filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.5))' }} />
                            <h2 style={{
                                margin: 0,
                                fontSize: '20px',
                                fontWeight: '800',
                                fontFamily: 'Outfit, sans-serif',
                                color: '#ffffff',
                                letterSpacing: '0.5px'
                            }}>Saved Locations</h2>
                        </div>
                        <button
                            onClick={handleClose}
                            style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: '50%',
                                width: '36px',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                                e.currentTarget.style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        >
                            <X size={20} color="#ef4444" />
                        </button>
                    </div>

                    {/* Locations List */}
                    <div style={{ 
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        paddingRight: '4px'
                    }}>
                        {savedLocations.length === 0 ? (
                            <div style={{
                                textAlign: 'center',
                                padding: '40px 20px',
                                color: 'var(--text-muted)'
                            }}>
                                <MapPin size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                                <p style={{ margin: 0, fontSize: '14px' }}>
                                    No saved locations yet.<br />
                                    Add locations from Settings.
                                </p>
                            </div>
                        ) : (
                            savedLocations.map((location) => {
                                const safety = locationSafety[location.id];
                                const status = getSafetyStatus(safety?.score);
                                const StatusIcon = status.icon;

                                return (
                                    <div
                                        key={location.id}
                                        onClick={() => handleLocationClick(location)}
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.03)',
                                            border: '1px solid rgba(255, 255, 255, 0.08)',
                                            borderRadius: '16px',
                                            padding: '16px',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            position: 'relative'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
                                            e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                                            e.currentTarget.style.transform = 'translateX(4px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                                            e.currentTarget.style.transform = 'translateX(0)';
                                        }}
                                    >
                                        {/* Type Icon */}
                                        <div style={{
                                            position: 'absolute',
                                            top: '12px',
                                            right: '12px',
                                            fontSize: '20px'
                                        }}>
                                            {getTypeIcon(location.type)}
                                        </div>

                                        {/* Location Info */}
                                        <div style={{ marginBottom: '12px' }}>
                                            <div style={{
                                                fontSize: '16px',
                                                fontWeight: '700',
                                                color: '#ffffff',
                                                marginBottom: '4px',
                                                fontFamily: 'Outfit, sans-serif'
                                            }}>
                                                {location.label}
                                            </div>
                                            <div style={{
                                                fontSize: '13px',
                                                color: 'var(--text-muted)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}>
                                                <MapPin size={12} />
                                                {location.name}
                                            </div>
                                        </div>

                                        {/* Safety Status */}
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            paddingTop: '12px',
                                            borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                padding: '6px 12px',
                                                background: `${status.color}15`,
                                                border: `1px solid ${status.color}40`,
                                                borderRadius: '20px'
                                            }}>
                                                <StatusIcon size={14} color={status.color} strokeWidth={2.5} />
                                                <span style={{
                                                    fontSize: '12px',
                                                    fontWeight: '700',
                                                    color: status.color,
                                                    fontFamily: 'Outfit, sans-serif'
                                                }}>
                                                    {status.label}
                                                </span>
                                                {safety?.score && (
                                                    <span style={{
                                                        fontSize: '11px',
                                                        color: status.color,
                                                        opacity: 0.8
                                                    }}>
                                                        ({safety.score.toFixed(0)})
                                                    </span>
                                                )}
                                            </div>

                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                color: '#8b5cf6',
                                                fontSize: '12px',
                                                fontWeight: '600'
                                            }}>
                                                <Navigation size={14} />
                                                Navigate
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SavedLocationsModal;
