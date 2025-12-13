import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Circle, Popup, useMap, Marker } from 'react-leaflet';
import { Bell, Shield, AlertTriangle, Layers, Crosshair, Plus, Minus, Siren, Settings, Info } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { safetyAPI } from '../services/api';
import LocationSearch from '../components/LocationSearch';
import SavedLocationsModal from '../components/SavedLocationsModal';
const LAGOS_CENTER = [6.5244, 3.3792];

const userIcon = L.divIcon({
    className: 'user-marker',
    html: '<div class="pulse-ring"></div><div class="user-dot"></div>',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});

const MapController = ({ center, zoomAction, onZoomComplete }) => {
    const map = useMap();

    useEffect(() => {
        if (center) {
            map.flyTo(center, map.getZoom(), { duration: 1.5 });
        }
    }, [center, map]);

    useEffect(() => {
        if (zoomAction === 'in') {
            map.zoomIn();
            onZoomComplete();
        } else if (zoomAction === 'out') {
            map.zoomOut();
            onZoomComplete();
        } else if (zoomAction === 'locate' && center) {
            map.flyTo(center, 16, { duration: 1.5 });
            onZoomComplete();
        }
    }, [zoomAction, center, map, onZoomComplete]);

    return null;
};

const HomeScreen = () => {
    const [zones, setZones] = useState([]);
    const [mapCenter, setMapCenter] = useState(LAGOS_CENTER);
    const [userLocation, setUserLocation] = useState(null);
    const [locationName, setLocationName] = useState('Locating...');
    const [currentStatus, setCurrentStatus] = useState('Safe');
    const [zoomAction, setZoomAction] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [showInsights, setShowInsights] = useState(false);
    const [showLocationsModal, setShowLocationsModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadHeatmap();
        // Poll for updates
        const interval = setInterval(loadHeatmap, 10000);

        // Hardcoded Location: Akoka, Lagos
        const AKOKA_COORDS = [6.5158, 3.3898];
        setUserLocation(AKOKA_COORDS);
        setMapCenter(AKOKA_COORDS);
        setLocationName("Akoka, Lagos");

        return () => clearInterval(interval);
    }, []);

    const loadHeatmap = async () => {
        try {
            const data = await safetyAPI.getHeatmap();
            setZones(data);
        } catch (error) {
            console.error('Error loading heatmap:', error);
        }
    };

    const handleLocationSelect = (location) => {
        setMapCenter([location.lat, location.lng]);
        setZoomAction('locate'); // Trigger zoom in
        setIsSearching(false); // Ensure status card returns after selection
    };

    const getZoneColor = (score) => {
        if (score >= 71) return '#10b981'; // Green
        if (score >= 31) return '#f59e0b'; // Yellow
        return '#ef4444'; // Red
    };

    return (
        <div className="screen" style={{ padding: 0, overflow: 'hidden', height: '100%' }}>

            {/* Full Screen Map Background */}
            <div className="map-wrapper">
                <MapContainer
                    center={LAGOS_CENTER}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                    className="dark-map"
                >
                    {/* Dark Mode Map Tiles */}
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />

                    <MapController
                        center={mapCenter}
                        zoomAction={zoomAction}
                        onZoomComplete={() => setZoomAction(null)}
                    />

                    {/* User Marker */}
                    {userLocation && (
                        <Marker position={userLocation} icon={userIcon}>
                            <Popup className="glass-popup">You are here</Popup>
                        </Marker>
                    )}

                    {/* Heatmap Circles */}
                    {zones.map((zone) => (
                        <Circle
                            key={zone.id}
                            center={[zone.latitude, zone.longitude]}
                            radius={zone.radius}
                            pathOptions={{
                                color: getZoneColor(zone.safety_score),
                                fillColor: getZoneColor(zone.safety_score),
                                fillOpacity: 0.2,
                                weight: 1,
                            }}
                        >
                            <Popup className="glass-popup">
                                <div style={{ color: '#0f172a' }}>
                                    <strong>{zone.name}</strong><br />
                                    Score: {zone.safety_score.toFixed(1)}
                                </div>
                            </Popup>
                        </Circle>
                    ))}
                </MapContainer>
            </div>

            {/* Top UI Layer */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, padding: '20px' }}>

                {/* Search Bar & Buttons */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    <div className="glass-panel" style={{ flex: 1, borderRadius: '30px', padding: '4px 8px' }}>
                        <LocationSearch
                            onLocationSelect={handleLocationSelect}
                            onFocus={() => setIsSearching(true)}
                            onBlur={() => setIsSearching(false)}
                            placeholder="Search Location"
                            style={{ background: 'transparent', border: 'none', color: 'white' }}
                        />
                    </div>
                    <button className="glass-panel"
                        onClick={() => setShowLocationsModal(true)}
                        style={{
                        width: '48px', height: '48px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        cursor: 'pointer',
                        background: 'rgba(139, 92, 246, 0.1)',
                        boxShadow: '0 0 15px rgba(139, 92, 246, 0.2)',
                        transition: 'all 0.3s ease'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 0 25px rgba(139, 92, 246, 0.4)';
                            e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '0 0 15px rgba(139, 92, 246, 0.2)';
                            e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
                        }}
                        title="Saved Locations"
                    >
                        <Info size={20} color="#8b5cf6" strokeWidth={2.5} />
                    </button>
                    <NavLink className="glass-panel"
                        key='/settings'
                        to='/settings'
                        style={{
                        width: '48px', height: '48px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: showInsights ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
                        cursor: 'pointer',
                        background: showInsights ? 'rgba(59, 130, 246, 0.2)' : 'var(--bg-glass)'
                    }}>
                        <Settings size={20} color={showInsights ? '#3b82f6' : '#fff'} />
                    </NavLink>
                    <button className="glass-panel"
                        onClick={() => setShowInsights(!showInsights)}
                        style={{
                        width: '48px', height: '48px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: showInsights ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
                        cursor: 'pointer',
                        background: showInsights ? 'rgba(59, 130, 246, 0.2)' : 'var(--bg-glass)'
                    }}>
                        <Bell size={20} color={showInsights ? '#3b82f6' : '#fff'} />
                        <div style={{
                            position: 'absolute', top: '12px', right: '12px',
                            width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%'
                        }} />
                    </button>
                </div>

                {/* AI Insights Popup */}
                {showInsights && (
                    <div className="glass-panel animate-fade-in" style={{
                        marginTop: '8px',
                        padding: '20px',
                        borderRadius: '24px',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        background: 'rgba(15, 23, 42, 0.8)',
                        backdropFilter: 'blur(16px)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <div style={{
                                width: '24px', height: '24px', borderRadius: '50%',
                                background: 'rgba(59, 130, 246, 0.2)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Shield size={14} color="#3b82f6" />
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#3b82f6', letterSpacing: '1px' }}>AI INSIGHTS</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', borderLeft: '3px solid #10b981' }}>
                                <div style={{ fontSize: '13px', color: '#e2e8f0', marginBottom: '4px' }}>Current Location Safe</div>
                                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Akoka maintains a 85% safety score. No recent incidents reported in your immediate vicinity.</div>
                            </div>

                            <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', borderLeft: '3px solid #f59e0b' }}>
                                <div style={{ fontSize: '13px', color: '#e2e8f0', marginBottom: '4px' }}>Traffic Advisory</div>
                                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Moderate congestion detected on Third Mainland Bridge. Consider alternative routes if heading to Island.</div>
                            </div>

                            <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', borderLeft: '3px solid #3b82f6' }}>
                                <div style={{ fontSize: '13px', color: '#e2e8f0', marginBottom: '4px' }}>Weather Update</div>
                                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Clear skies, 28°C. Good visibility for travel.</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Status Card */}
                {!isSearching && !showInsights && (
                    <div className="glass-panel animate-fade-in" style={{
                        padding: '16px', borderRadius: '24px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '50%',
                                background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)'
                            }}>
                                <Shield size={20} color="#10b981" fill="#10b981" fillOpacity={0.3} />
                            </div>
                            <div>
                                <div style={{ color: '#10b981', fontWeight: '700', fontSize: '14px', letterSpacing: '0.5px' }}>
                                    CURRENT STATUS: {currentStatus.toUpperCase()}
                                </div>
                                <div style={{ color: '#94a3b8', fontSize: '12px', maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {locationName}
                                </div>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>28°C</div>
                            <div style={{ color: '#94a3b8', fontSize: '10px' }}>UPDATED NOW</div>
                        </div>
                    </div>
                )}

            </div>

            {/* Right Side Controls */}
            <div style={{
                position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)',
                zIndex: 20, display: 'flex', flexDirection: 'column', gap: '12px'
            }}>
                <button className="glass-panel" style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                }}>
                    <Layers size={20} color="#94a3b8" />
                </button>
                <button
                    className="glass-panel"
                    onClick={() => {
                        if (userLocation) {
                            setMapCenter(userLocation);
                            setZoomAction('locate');
                        } else {
                            alert('Waiting for location...');
                        }
                    }}
                    style={{
                        width: '44px', height: '44px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                        color: userLocation ? '#3b82f6' : '#94a3b8'
                    }}
                >
                    <Crosshair size={20} />
                </button>
                <div className="glass-panel" style={{ borderRadius: '22px', padding: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <button
                        onClick={() => setZoomAction('in')}
                        style={{ background: 'transparent', border: 'none', padding: '8px', cursor: 'pointer' }}
                    >
                        <Plus size={20} color="#fff" />
                    </button>
                    <button
                        onClick={() => setZoomAction('out')}
                        style={{ background: 'transparent', border: 'none', padding: '8px', cursor: 'pointer' }}
                    >
                        <Minus size={20} color="#fff" />
                    </button>
                </div>
            </div>

            {/* Map Legend */}
            <div className="glass-panel" style={{
                position: 'absolute',
                right: '20px',
                bottom: '180px',
                zIndex: 20,
                padding: '12px',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
            }}>
                <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px' }}>SAFETY LEVELS</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                    <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>Safe</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 8px #f59e0b' }} />
                    <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>Caution</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 8px #ef4444' }} />
                    <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>Danger</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div style={{
                position: 'absolute',
                bottom: '100px',
                left: '20px',
                right: '20px',
                zIndex: 20,
                display: 'flex',
                gap: '12px'
            }}>
                <button
                    className="glass-panel"
                    onClick={() => navigate('/safe-route')}
                    style={{
                        flex: 1,
                        padding: '18px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
                        cursor: 'pointer',
                        fontWeight: '700',
                        fontSize: '14px',
                        color: '#ffffff',
                        letterSpacing: '0.5px',
                        transition: 'all 0.3s ease',
                        fontFamily: 'Outfit, sans-serif'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 30px rgba(16, 185, 129, 0.6)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.4)';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    FIND SAFE ROUTE
                </button>
                <button
                    className="glass-panel"
                    onClick={() => navigate('/report')}
                    style={{
                        flex: 1,
                        padding: '18px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.1) 100%)',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)',
                        cursor: 'pointer',
                        fontWeight: '700',
                        fontSize: '14px',
                        color: '#ef4444',
                        letterSpacing: '0.5px',
                        transition: 'all 0.3s ease',
                        fontFamily: 'Outfit, sans-serif'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 30px rgba(239, 68, 68, 0.5)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.3)';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    REPORT INCIDENT
                </button>
            </div>

            {/* Saved Locations Modal */}
            {showLocationsModal && (
                <SavedLocationsModal
                    onClose={() => setShowLocationsModal(false)}
                    onNavigate={(location) => {
                        setMapCenter([location.lat, location.lng]);
                        setZoomAction('locate');
                    }}
                />
            )}

        </div>
    );
};

export default HomeScreen;
