import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import { Navigation, TrendingUp, Shield, MapPin, Settings, Share2, ArrowRightLeft } from 'lucide-react';
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
            {/* Header */}
            <div className="status-bar glass-panel" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '16px 20px',
                gap: '12px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <Navigation 
                        size={48} 
                        style={{ 
                            color: '#10b981',
                            filter: 'drop-shadow(0 0 12px rgba(16, 185, 129, 0.6))'
                        }} 
                    />
                    <div style={{ flex: 1 }}>
                        <h1 style={{ 
                            fontSize: '24px', 
                            margin: 0,
                            fontFamily: 'Outfit, sans-serif',
                            fontWeight: '800',
                            letterSpacing: '0.5px'
                        }}>Safe Route</h1>
                        <p style={{ 
                            color: 'var(--text-muted)', 
                            fontSize: '13px', 
                            margin: 0,
                            fontFamily: 'Inter, sans-serif'
                        }}>AI-Powered Pathfinding</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/settings')}
                    style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '12px',
                        padding: '8px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        color: '#10b981',
                        fontWeight: '700',
                        fontFamily: 'Outfit, sans-serif',
                        boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 25px rgba(16, 185, 129, 0.4)';
                        e.currentTarget.style.background = 'rgba(16, 185, 129, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.2)';
                        e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)';
                    }}
                >
                    <Settings size={16} />
                    {preferences.riskTolerance.charAt(0).toUpperCase() + preferences.riskTolerance.slice(1)}
                </button>
            </div>

            <div className="screen-content" style={{ paddingTop: '100px', marginTop: '12px' }}>
                {/* Route Input Card */}
                <div className="glass-panel" style={{ 
                    padding: '24px', 
                    borderRadius: '24px', 
                    marginBottom: '24px',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    boxShadow: '0 0 30px rgba(16, 185, 129, 0.1)'
                }}>

                    {/* Start */}
                    <div style={{ position: 'relative', marginBottom: '20px' }}>
                        <div style={{ 
                            position: 'absolute', 
                            left: '0', 
                            top: '12px', 
                            width: '14px', 
                            height: '14px', 
                            borderRadius: '50%', 
                            background: '#10b981', 
                            boxShadow: '0 0 16px rgba(16,185,129,0.8)',
                            border: '2px solid rgba(16, 185, 129, 0.3)'
                        }}></div>
                        <div style={{ marginLeft: '28px' }}>
                            <label style={{ 
                                fontSize: '11px', 
                                color: '#10b981', 
                                display: 'block', 
                                marginBottom: '6px',
                                fontWeight: '700',
                                letterSpacing: '0.5px',
                                fontFamily: 'Outfit, sans-serif'
                            }}>START POINT</label>
                            <LocationSearch
                                onLocationSelect={handleStartLocationSelect}
                                placeholder="Current Location"
                                initialValue={startLocation?.name || ''}
                                inputStyle={{ background: 'rgba(0,0,0,0.3)', border: 'none' }}
                            />
                        </div>
                    </div>

                    {/* Connector Line */}
                    <div style={{ 
                        position: 'absolute', 
                        left: '30px', 
                        top: '55px', 
                        width: '3px', 
                        height: '90px', 
                        background: 'linear-gradient(to bottom, rgba(16, 185, 129, 0.8), rgba(239, 68, 68, 0.8))',
                        borderRadius: '2px',
                        boxShadow: '0 0 8px rgba(16, 185, 129, 0.4)'
                    }}></div>

                    {/* Swap Button */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-0px', marginBottom: '-20px', position: 'relative', zIndex: 10, paddingRight: '10px' }}>
                        <button
                            onClick={swapLocations}
                            style={{
                                background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)',
                                width: '36px', height: '36px', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', color: '#94a3b8'
                            }}
                        >
                            <ArrowRightLeft size={16} />
                        </button>
                    </div>

                    {/* End */}
                    <div style={{ position: 'relative', marginTop: '20px' }}>
                        <div style={{ 
                            position: 'absolute', 
                            left: '0', 
                            top: '12px', 
                            width: '14px', 
                            height: '14px', 
                            borderRadius: '50%', 
                            background: '#ef4444', 
                            boxShadow: '0 0 16px rgba(239,68,68,0.8)',
                            border: '2px solid rgba(239, 68, 68, 0.3)'
                        }}></div>
                        <div style={{ marginLeft: '28px' }}>
                            <label style={{ 
                                fontSize: '11px', 
                                color: '#ef4444', 
                                display: 'block', 
                                marginBottom: '6px',
                                fontWeight: '700',
                                letterSpacing: '0.5px',
                                fontFamily: 'Outfit, sans-serif'
                            }}>DESTINATION</label>
                            <LocationSearch
                                onLocationSelect={handleEndLocationSelect}
                                placeholder="Where to?"
                                initialValue={endLocation?.name || ''}
                                inputStyle={{ background: 'rgba(0,0,0,0.3)', border: 'none' }}
                            />
                        </div>
                    </div>
                </div>

                <button
                    className="btn btn-primary"
                    onClick={calculateRoute}
                    disabled={loading || !startLocation || !endLocation}
                    style={{ 
                        width: '100%', 
                        marginBottom: '32px', 
                        height: '64px', 
                        fontSize: '16px',
                        fontWeight: '800',
                        letterSpacing: '1px',
                        fontFamily: 'Outfit, sans-serif',
                        background: loading || !startLocation || !endLocation 
                            ? 'rgba(100, 100, 100, 0.2)'
                            : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        boxShadow: loading || !startLocation || !endLocation
                            ? 'none'
                            : '0 0 30px rgba(16, 185, 129, 0.5)',
                        transition: 'all 0.3s ease'
                    }}
                >
                    {loading ? (
                        <span className="loading-dots">Calculating...</span>
                    ) : (
                        <>
                            <Navigation size={24} />
                            CALCULATE SAFE ROUTE
                        </>
                    )}
                </button>

                {routeData && (
                    <div className="animate-fade-in">
                        {/* Comparison Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                            {/* Safe Route Card */}
                            <div className={`glass-panel ${routeData.recommendation === 'safe' ? 'glow-border-green' : ''}`} style={{ padding: '16px', borderRadius: '20px', position: 'relative', overflow: 'hidden' }}>
                                {routeData.recommendation === 'safe' && <div style={{ position: 'absolute', top: 0, right: 0, background: '#10b981', fontSize: '10px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '0 0 0 10px' }}>RECOMMENDED</div>}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <Shield size={18} color="#10b981" />
                                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#10b981' }}>SAFE</span>
                                </div>
                                <div style={{ fontSize: '32px', fontWeight: '800', color: '#fff' }}>{routeData.safe_score.toFixed(0)}</div>
                                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Safety Score</div>
                            </div>

                            {/* Fast Route Card */}
                            <div className={`glass-panel ${routeData.recommendation === 'fast' ? 'glow-border-amber' : ''}`} style={{ padding: '16px', borderRadius: '20px', position: 'relative', overflow: 'hidden' }}>
                                {routeData.recommendation === 'fast' && <div style={{ position: 'absolute', top: 0, right: 0, background: '#f59e0b', fontSize: '10px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '0 0 0 10px' }}>RECOMMENDED</div>}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <TrendingUp size={18} color="#f59e0b" />
                                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#f59e0b' }}>FAST</span>
                                </div>
                                <div style={{ fontSize: '32px', fontWeight: '800', color: '#fff' }}>{routeData.fast_score.toFixed(0)}</div>
                                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Safety Score</div>
                            </div>
                        </div>

                        {/* Map Preview */}
                        <div style={{
                            height: '300px',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            border: '1px solid rgba(255,255,255,0.1)',
                            marginBottom: '24px',
                            position: 'relative'
                        }}>
                            <MapContainer
                                center={LAGOS_CENTER}
                                zoom={11}
                                style={{ height: '100%', width: '100%' }}
                                zoomControl={false}
                            >
                                <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                                <Polyline
                                    positions={routeData.safe_route.map(p => [p.lat, p.lng])}
                                    pathOptions={{ color: '#10b981', weight: 6, opacity: 0.9 }}
                                />
                                <Polyline
                                    positions={routeData.fast_route.map(p => [p.lat, p.lng])}
                                    pathOptions={{ color: '#f59e0b', weight: 4, dashArray: '10, 10', opacity: 0.6 }}
                                />
                                <Marker position={[startLocation.lat, startLocation.lng]}>
                                    <Popup>Start</Popup>
                                </Marker>
                                <Marker position={[endLocation.lat, endLocation.lng]}>
                                    <Popup>End</Popup>
                                </Marker>
                            </MapContainer>

                            {/* Legend Overlay */}
                            <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', padding: '8px 16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', zIndex: 1000 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div style={{ width: '12px', height: '4px', background: '#10b981', borderRadius: '2px' }}></div>
                                    <span style={{ fontSize: '12px', color: '#fff' }}>Safe</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div style={{ width: '12px', height: '4px', background: '#f59e0b', borderRadius: '2px', borderStyle: 'dashed' }}></div>
                                    <span style={{ fontSize: '12px', color: '#fff' }}>Fast</span>
                                </div>
                            </div>
                        </div>

                        <button
                            className="btn btn-secondary"
                            onClick={() => setShowShareModal(true)}
                            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                            <Share2 size={18} />
                            Share Route with Friends
                        </button>
                    </div>
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
