import React, { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, Send, Camera, Mic } from 'lucide-react';
import { safetyAPI } from '../services/api';
import { incrementStat, getUserId } from '../utils/storage';
import notificationService from '../services/notificationService';

const ReportScreen = () => {
    const [type, setType] = useState('robbery');
    const [description, setDescription] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [severity, setSeverity] = useState('medium');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        getCurrentLocation();
    }, []);

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude.toFixed(6));
                    setLongitude(position.coords.longitude.toFixed(6));
                },
                () => {
                    setLatitude('6.5244');
                    setLongitude('3.3792');
                }
            );
        } else {
            setLatitude('6.5244');
            setLongitude('3.3792');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);

        try {
            await safetyAPI.reportIncident({
                type,
                description,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                severity,
                user_id: getUserId(),
            });

            setSuccess(true);
            setDescription('');
            incrementStat('incidentsReported');
            notificationService.showReportSubmitted();
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error('Error reporting incident:', error);
            alert('Failed to report incident');
        } finally {
            setLoading(false);
        }
    };

    const incidentTypes = [
        { value: 'robbery', label: 'Robbery', icon: '🔫' },
        { value: 'accident', label: 'Accident', icon: '🚗' },
        { value: 'harassment', label: 'Harassment', icon: '🗣️' },
        { value: 'vandalism', label: 'Vandalism', icon: '🏚️' },
        { value: 'suspicious_activity', label: 'Suspicious', icon: '👀' },
        { value: 'assault', label: 'Assault', icon: '👊' },
        { value: 'theft', label: 'Theft', icon: '💰' },
    ];

    return (
        <div className="screen">
            <div className="status-bar glass-panel" style={{ top: '20px', height: 'auto', padding: '16px 24px', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                <h1 style={{ fontSize: '24px', margin: 0 }}>Report Incident</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>Help keep Lagos safe</p>
            </div>

            <div className="screen-content" style={{ paddingTop: '120px' }}>
                {success && (
                    <div className="glass-panel" style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        borderColor: '#10b981',
                        marginBottom: '24px',
                        padding: '16px',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>✓</div>
                        <div style={{ color: '#10b981', fontWeight: '600' }}>Incident reported successfully!</div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Incident Type Grid */}
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase' }}>INCIDENT TYPE</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
                        {incidentTypes.map((t) => (
                            <div
                                key={t.value}
                                onClick={() => setType(t.value)}
                                className={`glass-panel ${type === t.value ? 'active-type' : ''}`}
                                style={{
                                    padding: '16px',
                                    borderRadius: '16px',
                                    cursor: 'pointer',
                                    border: type === t.value ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.05)',
                                    background: type === t.value ? 'rgba(16, 185, 129, 0.1)' : 'rgba(15, 23, 42, 0.4)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{t.icon}</div>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: type === t.value ? 'var(--primary)' : 'var(--text-secondary)' }}>{t.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Severity Slider */}
                    <div className="glass-panel" style={{ padding: '20px', borderRadius: '20px', marginBottom: '24px' }}>
                        <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '16px', fontWeight: '600', textTransform: 'uppercase' }}>SEVERITY LEVEL</label>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '12px', color: severity === 'low' ? '#10b981' : '#64748b' }}>Low</span>
                            <span style={{ fontSize: '12px', color: severity === 'medium' ? '#f59e0b' : '#64748b' }}>Medium</span>
                            <span style={{ fontSize: '12px', color: severity === 'high' ? '#ef4444' : '#64748b' }}>High</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="3"
                            step="1"
                            value={severity === 'low' ? 1 : severity === 'medium' ? 2 : 3}
                            onChange={(e) => {
                                const val = parseInt(e.target.value);
                                setSeverity(val === 1 ? 'low' : val === 2 ? 'medium' : 'high');
                            }}
                            style={{ width: '100%', accentColor: severity === 'high' ? '#ef4444' : severity === 'medium' ? '#f59e0b' : '#10b981' }}
                        />
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase' }}>DETAILS</label>
                        <textarea
                            className="input-glass"
                            placeholder="Describe what happened..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            style={{ borderRadius: '16px', resize: 'none' }}
                        />
                    </div>

                    {/* Location */}
                    <div className="glass-panel" style={{ padding: '16px', borderRadius: '16px', marginBottom: '32px', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <MapPin size={18} color="#3b82f6" />
                            </div>
                            <div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>LOCATION</div>
                                <div style={{ fontSize: '14px', fontWeight: '600' }}>{latitude}{latitude & longitude ? ',' : ''} {longitude}</div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={getCurrentLocation}
                            style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                        >
                            UPDATE
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-danger"
                        disabled={loading}
                        style={{ width: '100%', height: '56px', fontSize: '18px', borderRadius: '28px' }}
                    >
                        {loading ? 'Sending...' : (
                            <>
                                <Send size={20} />
                                SUBMIT REPORT
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReportScreen;
