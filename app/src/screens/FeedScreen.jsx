import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock, MapPin, RefreshCw, Filter } from 'lucide-react';
import { safetyAPI } from '../services/api';
import UpvoteButton from '../components/UpvoteButton';
import { getUserId, getUpvotedIncidents, addUpvotedIncident } from '../utils/storage';
import notificationService from '../services/notificationService';

const FeedScreen = () => {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
    const [upvotedIds, setUpvotedIds] = useState([]);
    const userId = getUserId();

    useEffect(() => {
        loadIncidents();
        setUpvotedIds(getUpvotedIncidents());
        const interval = setInterval(loadIncidents, 5000); // Refresh every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const loadIncidents = async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true);

        try {
            const data = await safetyAPI.getIncidents(30);
            setIncidents(data);
            setLoading(false);
        } catch (error) {
            console.error('Error loading incidents:', error);
            setLoading(false);
        } finally {
            setRefreshing(false);
        }
    };

    const handleUpvote = async (incidentId) => {
        try {
            const updated = await safetyAPI.upvoteIncident(incidentId, userId);

            // Update local state optimistically
            setIncidents(incidents.map(inc =>
                inc.id === incidentId ? updated : inc
            ));

            // Track upvoted incident
            addUpvotedIncident(incidentId);
            setUpvotedIds([...upvotedIds, incidentId]);

            // Show notification
            notificationService.showUpvoteNotification(updated.type);
        } catch (error) {
            console.error('Error upvoting incident:', error);
            if (error.response?.status === 400) {
                // Already upvoted
                addUpvotedIncident(incidentId);
                setUpvotedIds([...upvotedIds, incidentId]);
            }
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    const getSeverityBadge = (severity) => {
        const classes = {
            low: 'badge-success',
            medium: 'badge-warning',
            high: 'badge-danger',
        };
        return classes[severity] || 'badge-warning';
    };

    const getIncidentIcon = (type) => {
        return <AlertCircle size={20} />;
    };

    const filteredIncidents = showVerifiedOnly
        ? incidents.filter(inc => inc.verified)
        : incidents;

    if (loading) {
        return (
            <div className="screen">
                <div className="screen-header">
                    <h1>Incident Feed</h1>
                    <p>Real-time reports</p>
                </div>
                <div className="loading">Loading incidents...</div>
            </div>
        );
    }

    return (
        <div className="screen">
            <div className="screen-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>Incident Feed</h1>
                        <p>Real-time reports</p>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
                            style={{
                                padding: '8px 12px',
                                background: showVerifiedOnly ? 'var(--primary)20' : 'transparent',
                                borderColor: showVerifiedOnly ? 'var(--primary)' : 'var(--border)',
                            }}
                        >
                            <Filter size={18} />
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => loadIncidents(true)}
                            disabled={refreshing}
                            style={{ padding: '8px 12px' }}
                        >
                            <RefreshCw size={18} className={refreshing ? 'rotating' : ''} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="screen-content">
                {filteredIncidents.length === 0 ? (
                    <div className="card">
                        <div className="card-body" style={{ textAlign: 'center', padding: '40px 20px' }}>
                            <AlertCircle size={48} style={{ color: '#94a3b8', marginBottom: '12px' }} />
                            <p style={{ color: '#94a3b8' }}>
                                {showVerifiedOnly ? 'No verified incidents' : 'No incidents reported yet'}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div>
                        {filteredIncidents.map((incident) => (
                            <div key={incident.id} className="card">
                                <div className="card-header">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {getIncidentIcon(incident.type)}
                                        <span className="card-title" style={{ textTransform: 'capitalize' }}>
                                            {incident.type.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <span className={`badge ${getSeverityBadge(incident.severity)}`}>
                                        {incident.severity}
                                    </span>
                                </div>
                                <div className="card-body">
                                    {incident.description && (
                                        <p style={{ marginBottom: '12px', color: '#f1f5f9' }}>
                                            {incident.description}
                                        </p>
                                    )}
                                    <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#94a3b8', marginBottom: 'var(--space-md)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Clock size={14} />
                                            {formatTime(incident.timestamp)}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <MapPin size={14} />
                                            {incident.latitude.toFixed(4)}, {incident.longitude.toFixed(4)}
                                        </div>
                                    </div>
                                    <UpvoteButton
                                        incident={incident}
                                        onUpvote={handleUpvote}
                                        isUpvoted={upvotedIds.includes(incident.id)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeedScreen;
