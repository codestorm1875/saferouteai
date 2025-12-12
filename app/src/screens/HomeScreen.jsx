import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Popup, useMap } from 'react-leaflet';
import { Plus, Brain, TrendingUp, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { safetyAPI } from '../services/api';
import LocationSearch from '../components/LocationSearch';
import SavedLocationCard from '../components/SavedLocationCard';
import { getSavedLocations } from '../utils/storage';

const LAGOS_CENTER = [6.5244, 3.3792];

const MapUpdater = ({ zones, center }) => {
    const map = useMap();

    useEffect(() => {
        if (zones.length > 0) {
            map.invalidateSize();
        }
    }, [zones, map]);

    useEffect(() => {
        if (center) {
            map.flyTo(center, 14, { duration: 1.5 });
        }
    }, [center, map]);

    return null;
};

const HomeScreen = () => {
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mapCenter, setMapCenter] = useState(LAGOS_CENTER);
    const [savedLocations, setSavedLocations] = useState([]);
    const [mlInsights, setMlInsights] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadHeatmap();
        loadSavedLocations();
        loadMLInsights();
        const interval = setInterval(() => {
            loadHeatmap();
            loadMLInsights();
        }, 10000); // Update every 10 seconds
        return () => clearInterval(interval);
    }, []);

    const loadHeatmap = async () => {
        try {
            const data = await safetyAPI.getHeatmap();
            setZones(data);
            setLoading(false);
        } catch (error) {
            console.error('Error loading heatmap:', error);
            setLoading(false);
        }
    };

    const loadMLInsights = async () => {
        try {
            const data = await safetyAPI.getMLInsights();
            setMlInsights(data);
        } catch (error) {
            console.error('Error loading ML insights:', error);
        }
    };

    const loadSavedLocations = () => {
        setSavedLocations(getSavedLocations());
    };

    const handleLocationSelect = (location) => {
        setMapCenter([location.lat, location.lng]);
    };

    const handleSavedLocationNavigate = (location) => {
        setMapCenter([location.lat, location.lng]);
    };

    const getSafetyScoreForLocation = (lat, lng) => {
        // Find nearest zone
        let nearestZone = null;
        let minDistance = Infinity;

        zones.forEach(zone => {
            const distance = Math.sqrt(
                Math.pow(zone.latitude - lat, 2) + Math.pow(zone.longitude - lng, 2)
            );
            if (distance < minDistance) {
                minDistance = distance;
                nearestZone = zone;
            }
        });

        return nearestZone ? nearestZone.safety_score : 50;
    };

    const getZoneColor = (score) => {
        if (score >= 71) return '#10b981'; // Green
        if (score >= 31) return '#f59e0b'; // Yellow
        return '#ef4444'; // Red
    };

    const getZoneOpacity = (score) => {
        if (score >= 71) return 0.3;
        if (score >= 31) return 0.4;
        return 0.5;
    };

    return (
        <div className="screen">
            <div className="screen-header">
                <h1>SafeRoute AI</h1>
                <p>Real-time safety for Lagos</p>
            </div>

            <div className="screen-content">
                {/* ML Insights Card */}
                {mlInsights && (
                    <div style={{
                        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                        borderRadius: 'var(--radius-md)',
                        padding: 'var(--space-md)',
                        marginBottom: 'var(--space-lg)',
                        border: '1px solid rgba(56, 189, 248, 0.2)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                            <Brain size={18} color="#38bdf8" style={{ marginRight: '8px' }} />
                            <h3 style={{ margin: 0, fontSize: '14px', color: '#e2e8f0' }}>AI Safety Insights</h3>
                            <span className="badge badge-primary" style={{ marginLeft: 'auto', fontSize: '10px' }}>LIVE</span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                            <div style={{ textAlign: 'center', padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f87171' }}>
                                    {mlInsights.total_danger_zones}
                                </div>
                                <div style={{ fontSize: '10px', color: '#94a3b8' }}>Danger Zones</div>
                            </div>

                            <div style={{ textAlign: 'center', padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2px' }}>
                                    <TrendingUp size={16} color={mlInsights.overall_trend === 'safe' ? '#4ade80' : '#facc15'} />
                                </div>
                                <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'capitalize' }}>
                                    {mlInsights.overall_trend} Trend
                                </div>
                            </div>

                            <div style={{ textAlign: 'center', padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2px' }}>
                                    <AlertTriangle size={16} color={mlInsights.total_anomalies > 0 ? '#f87171' : '#94a3b8'} />
                                </div>
                                <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                                    {mlInsights.total_anomalies} Anomalies
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Saved Locations */}
                {savedLocations.length > 0 && (
                    <div style={{ marginBottom: 'var(--space-lg)' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: 'var(--space-sm)',
                        }}>
                            <h3 style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: 'var(--text-primary)',
                                margin: 0,
                            }}>
                                📍 Quick Access
                            </h3>
                            <button
                                onClick={() => navigate('/settings')}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--primary)',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    padding: '4px 8px',
                                }}
                            >
                                <Plus size={14} style={{ marginRight: '4px' }} />
                                Add
                            </button>
                        </div>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: 'var(--space-sm)',
                        }}>
                            {savedLocations.slice(0, 4).map((location) => (
                                <SavedLocationCard
                                    key={location.id}
                                    location={location}
                                    onNavigate={handleSavedLocationNavigate}
                                    safetyScore={getSafetyScoreForLocation(location.lat, location.lng)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
                    <LocationSearch
                        onLocationSelect={handleLocationSelect}
                        placeholder="Search Lagos locations..."
                    />
                </div>

                <div style={{
                    height: 'calc(100vh - 570px)',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    border: '1.5px solid var(--border)',
                    boxShadow: 'var(--shadow-lg)'
                }}>
                    {loading ? (
                        <div className="loading">Loading map...</div>
                    ) : (
                        <MapContainer
                            center={LAGOS_CENTER}
                            zoom={12}
                            style={{ height: '100%', width: '100%' }}
                            zoomControl={false}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; OpenStreetMap contributors'
                            />
                            <MapUpdater zones={zones} center={mapCenter} />
                            {zones.map((zone) => (
                                <Circle
                                    key={zone.id}
                                    center={[zone.latitude, zone.longitude]}
                                    radius={zone.radius}
                                    pathOptions={{
                                        color: getZoneColor(zone.safety_score),
                                        fillColor: getZoneColor(zone.safety_score),
                                        fillOpacity: getZoneOpacity(zone.safety_score),
                                        weight: 2,
                                    }}
                                >
                                    <Popup>
                                        <div style={{ color: '#0f172a', padding: '4px' }}>
                                            <strong style={{ fontSize: '14px' }}>{zone.name}</strong>
                                            <br />
                                            <div style={{ marginTop: '6px', marginBottom: '6px' }}>
                                                Safety Score: <strong style={{ fontSize: '16px' }}>{zone.safety_score.toFixed(1)}</strong>
                                            </div>
                                            <span className={`badge ${zone.safety_score >= 71 ? 'badge-success' :
                                                zone.safety_score >= 31 ? 'badge-warning' :
                                                    'badge-danger'
                                                }`} style={{ fontSize: '10px' }}>
                                                {zone.safety_score >= 71 ? 'Safe' :
                                                    zone.safety_score >= 31 ? 'Moderate' : 'Unsafe'}
                                            </span>
                                        </div>
                                    </Popup>
                                </Circle>
                            ))}
                        </MapContainer>
                    )}
                </div>

                <div style={{
                    marginTop: 'var(--space-lg)',
                    display: 'flex',
                    gap: 'var(--space-md)',
                    fontSize: '12px',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            background: '#10b981',
                            boxShadow: '0 0 8px rgba(16, 185, 129, 0.4)'
                        }}></div>
                        <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>Safe (71-100)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            background: '#f59e0b',
                            boxShadow: '0 0 8px rgba(245, 158, 11, 0.4)'
                        }}></div>
                        <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>Moderate (31-70)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            background: '#ef4444',
                            boxShadow: '0 0 8px rgba(239, 68, 68, 0.4)'
                        }}></div>
                        <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>Unsafe (0-30)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeScreen;
