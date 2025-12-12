import React, { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, Send } from 'lucide-react';
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
                    // Default to Lagos center if location fails
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

            // Show notification
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
        { value: 'robbery', label: 'Robbery' },
        { value: 'accident', label: 'Accident' },
        { value: 'harassment', label: 'Harassment' },
        { value: 'vandalism', label: 'Vandalism' },
        { value: 'suspicious_activity', label: 'Suspicious Activity' },
        { value: 'assault', label: 'Assault' },
        { value: 'theft', label: 'Theft' },
    ];

    return (
        <div className="screen">
            <div className="screen-header">
                <h1>Report Incident</h1>
                <p>Help keep Lagos safe</p>
            </div>

            <div className="screen-content">
                {success && (
                    <div className="card" style={{
                        background: 'rgba(16, 185, 129, 0.2)',
                        borderColor: '#10b981',
                        marginBottom: '20px'
                    }}>
                        <div className="card-body" style={{ color: '#10b981', fontWeight: '600' }}>
                            ✓ Incident reported successfully!
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Incident Type</label>
                        <select
                            className="form-control"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            required
                        >
                            {incidentTypes.map((t) => (
                                <option key={t.value} value={t.value}>
                                    {t.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Severity</label>
                        <select
                            className="form-control"
                            value={severity}
                            onChange={(e) => setSeverity(e.target.value)}
                            required
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Description (Optional)</label>
                        <textarea
                            className="form-control"
                            placeholder="Describe what happened..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            <MapPin size={16} style={{ display: 'inline', marginRight: '6px' }} />
                            Location
                        </label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Latitude"
                                value={latitude}
                                onChange={(e) => setLatitude(e.target.value)}
                                required
                                style={{ flex: 1 }}
                            />
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Longitude"
                                value={longitude}
                                onChange={(e) => setLongitude(e.target.value)}
                                required
                                style={{ flex: 1 }}
                            />
                        </div>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={getCurrentLocation}
                            style={{ marginTop: '8px', width: '100%' }}
                        >
                            <MapPin size={16} />
                            Use Current Location
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ width: '100%' }}
                    >
                        <Send size={20} />
                        {loading ? 'Reporting...' : 'Submit Report'}
                    </button>
                </form>

                <div className="card" style={{ marginTop: '20px' }}>
                    <div className="card-body" style={{ fontSize: '13px' }}>
                        <AlertTriangle size={16} style={{ display: 'inline', marginRight: '6px', color: '#f59e0b' }} />
                        Your report helps the community stay informed about safety conditions in real-time.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportScreen;
