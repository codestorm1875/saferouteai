import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import { Navigation, TrendingUp, Shield, MapPin, Settings, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { safetyAPI } from '../services/api';
import LocationSearch from '../components/LocationSearch';
import { getUserPreferences, incrementStat } from '../utils/storage';
import ShareRouteModal from '../components/ShareRouteModal';
import notificationService from '../services/notificationService';

const LAGOS_CENTER = [6.5244, 3.3792];

const SafeRouteScreen = () => {
    const [startLocation, setStartLocation] = useState(null);
    const [endLocation, setEndLocation] = useState(null);
    const [routeData, setRouteData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [preferences, setPreferences] = useState({ riskTolerance: 'balanced' });
    const [showShareModal, setShowShareModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setPreferences(getUserPreferences());
    }, []);

    const handleStartLocationSelect = (location) => {
        setStartLocation(location);
    };

    const handleEndLocationSelect = (location) => {
        setEndLocation(location);
    };

    const calculateRoute = async () => {
        if (!startLocation || !endLocation) {
            alert('Please select both start and destination locations');
            return;
        }

        setLoading(true);
        try {
            const data = await safetyAPI.calculateSafeRoute({
                start_lat: startLocation.lat,
                start_lng: startLocation.lng,
                end_lat: endLocation.lat,
                end_lng: endLocation.lng,
                risk_tolerance: preferences.riskTolerance,
            });

            // Add location names to route data for sharing
            data.startLocation = startLocation;
            data.endLocation = endLocation;

            setRouteData(data);
            incrementStat('routesCalculated');

            // Show notification
            notificationService.showRouteReady(data.recommendation);
        } catch (error) {
            console.error('Error calculating route:', error);
            alert('Failed to calculate route');
        } finally {
            setLoading(false);
        }
    };

    const swapLocations = () => {
        const temp = startLocation;
        setStartLocation(endLocation);
        setEndLocation(temp);
    };

    return (
        <div className="screen">
            <div className="screen-header">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h1>Safe Route</h1>
                        <p>Compare routes by safety</p>
                    </div>
                    <button
                        onClick={() => navigate('/settings')}
                        style={{
                            background: 'var(--card-bg)',
                            border: '1.5px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            padding: '8px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            color: 'var(--text-secondary)',
                            fontWeight: '600',
                        }}
                    >
                        <Settings size={14} />
                        {preferences.riskTolerance.charAt(0).toUpperCase() + preferences.riskTolerance.slice(1)}
                    </button>
                </div>
            </div>

            <div className="screen-content">
                {/* Start Location */}
                <div className="form-group">
                    <label>
                        <MapPin size={16} style={{ display: 'inline', marginRight: '6px' }} />
                        Start Location
                    </label>
                    <LocationSearch
                        onLocationSelect={handleStartLocationSelect}
                        placeholder="Search start location..."
                        initialValue={startLocation?.name || ''}
                    />
                    {startLocation && (
                        <div style={{
                            marginTop: 'var(--space-sm)',
                            fontSize: '13px',
                            color: 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-sm)'
                        }}>
                            <div style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: 'var(--primary)',
                                boxShadow: '0 0 8px rgba(16, 185, 129, 0.4)'
                            }}></div>
                            {startLocation.name}
                        </div>
                    )}
                </div>

                {/* Swap Button */}
                {startLocation && endLocation && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: 'var(--space-lg)',
                        marginTop: '-var(--space-md)'
                    }}>
                        <button
                            onClick={swapLocations}
                            style={{
                                background: 'var(--bg-card)',
                                border: '1.5px solid var(--border)',
                                borderRadius: 'var(--radius-full)',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                color: 'var(--text-secondary)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'var(--primary)';
                                e.currentTarget.style.color = 'var(--primary)';
                                e.currentTarget.style.transform = 'rotate(180deg)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--border)';
                                e.currentTarget.style.color = 'var(--text-secondary)';
                                e.currentTarget.style.transform = 'rotate(0deg)';
                            }}
                        >
                            ⇅
                        </button>
                    </div>
                )}

                {/* End Location */}
                <div className="form-group">
                    <label>
                        <MapPin size={16} style={{ display: 'inline', marginRight: '6px' }} />
                        Destination
                    </label>
                    <LocationSearch
                        onLocationSelect={handleEndLocationSelect}
                        placeholder="Search destination..."
                        initialValue={endLocation?.name || ''}
                    />
                    {endLocation && (
                        <div style={{
                            marginTop: 'var(--space-sm)',
                            fontSize: '13px',
                            color: 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-sm)'
                        }}>
                            <div style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: 'var(--danger)',
                                boxShadow: '0 0 8px rgba(239, 68, 68, 0.4)'
                            }}></div>
                            {endLocation.name}
                        </div>
                    )}
                </div>

                <button
                    className="btn btn-primary"
                    onClick={calculateRoute}
                    disabled={loading || !startLocation || !endLocation}
                    style={{ width: '100%', marginBottom: 'var(--space-xl)' }}
                >
                    <Navigation size={20} />
                    {loading ? 'Calculating...' : 'Find Safe Route'}
                </button>

                {routeData && (
                    <>
                        <div style={{ marginBottom: 'var(--space-lg)', display: 'flex', gap: 'var(--space-md)' }}>
                            <div className="card" style={{ flex: 1, padding: 'var(--space-lg)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
                                    <Shield size={20} style={{ color: 'var(--primary)' }} />
                                    <strong style={{ color: 'var(--primary)' }}>Safe Route</strong>
                                </div>
                                <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)' }}>
                                    {routeData.safe_score.toFixed(1)}
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 'var(--space-xs)' }}>Safety Score</div>
                            </div>

                            <div className="card" style={{ flex: 1, padding: 'var(--space-lg)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
                                    <TrendingUp size={20} style={{ color: 'var(--warning)' }} />
                                    <strong style={{ color: 'var(--warning)' }}>Fast Route</strong>
                                </div>
                                <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)' }}>
                                    {routeData.fast_score.toFixed(1)}
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 'var(--space-xs)' }}>Safety Score</div>
                            </div>
                        </div>

                        <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
                            <div className="card-body">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: 'var(--radius-md)',
                                        background: routeData.recommendation === 'safe' ? 'var(--primary)' :
                                            routeData.recommendation === 'fast' ? 'var(--warning)' : 'var(--info)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '18px'
                                    }}>
                                        {routeData.recommendation === 'safe' ? '🛡️' :
                                            routeData.recommendation === 'fast' ? '⚡' : '👍'}
                                    </div>
                                    <strong style={{ color: 'var(--text-primary)' }}>Recommendation</strong>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                    {routeData.recommendation === 'safe' && 'Take the safe route for better security. The extra time is worth your safety.'}
                                    {routeData.recommendation === 'fast' && 'Fast route is reasonably safe. You can take either route.'}
                                    {routeData.recommendation === 'either' && 'Both routes have similar safety levels. Choose based on your preference.'}
                                </p>
                            </div>
                        </div>

                        {/* Share Button */}
                        <button
                            className="btn btn-secondary"
                            onClick={() => setShowShareModal(true)}
                            style={{
                                width: '100%',
                                marginBottom: 'var(--space-lg)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 'var(--space-sm)',
                            }}
                        >
                            <Share2 size={18} />
                            Share Route
                        </button>

                        <div style={{
                            height: '350px',
                            borderRadius: 'var(--radius-lg)',
                            overflow: 'hidden',
                            border: '1.5px solid var(--border)',
                            boxShadow: 'var(--shadow-lg)'
                        }}>
                            <MapContainer
                                center={LAGOS_CENTER}
                                zoom={11}
                                style={{ height: '100%', width: '100%' }}
                                zoomControl={false}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Polyline
                                    positions={routeData.safe_route.map(p => [p.lat, p.lng])}
                                    pathOptions={{ color: '#10b981', weight: 5, opacity: 0.8 }}
                                />
                                <Polyline
                                    positions={routeData.fast_route.map(p => [p.lat, p.lng])}
                                    pathOptions={{ color: '#f59e0b', weight: 5, dashArray: '10, 10', opacity: 0.8 }}
                                />
                                <Marker position={[startLocation.lat, startLocation.lng]}>
                                    <Popup>
                                        <div style={{ color: '#0f172a', padding: '4px' }}>
                                            <strong>Start</strong>
                                            <br />
                                            {startLocation.name}
                                        </div>
                                    </Popup>
                                </Marker>
                                <Marker position={[endLocation.lat, endLocation.lng]}>
                                    <Popup>
                                        <div style={{ color: '#0f172a', padding: '4px' }}>
                                            <strong>Destination</strong>
                                            <br />
                                            {endLocation.name}
                                        </div>
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        </div>

                        <div style={{
                            marginTop: 'var(--space-lg)',
                            display: 'flex',
                            gap: 'var(--space-md)',
                            fontSize: '13px',
                            justifyContent: 'center'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '20px', height: '3px', background: '#10b981', borderRadius: '2px' }}></div>
                                <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>Safe Route</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{
                                    width: '20px',
                                    height: '3px',
                                    background: '#f59e0b',
                                    borderRadius: '2px',
                                    backgroundImage: 'repeating-linear-gradient(90deg, #f59e0b, #f59e0b 5px, transparent 5px, transparent 10px)'
                                }}></div>
                                <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>Fast Route</span>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Share Modal */}
            {showShareModal && routeData && (
                <ShareRouteModal
                    routeData={routeData}
                    onClose={() => setShowShareModal(false)}
                />
            )}
        </div>
    );
};

export default SafeRouteScreen;
