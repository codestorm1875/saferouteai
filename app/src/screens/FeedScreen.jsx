import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock, MapPin, RefreshCw, Filter, ThumbsUp } from 'lucide-react';
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
        const interval = setInterval(loadIncidents, 5000);
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
            setIncidents(incidents.map(inc => inc.id === incidentId ? updated : inc));
            addUpvotedIncident(incidentId);
            setUpvotedIds([...upvotedIds, incidentId]);
            notificationService.showUpvoteNotification(updated.type);
        } catch (error) {
            console.error('Error upvoting incident:', error);
            if (error.response?.status === 400) {
                addUpvotedIncident(incidentId);
                setUpvotedIds([...upvotedIds, incidentId]);
            }
        }
    };

    const formatTime = (timestamp) => {
        const dateStr = timestamp.endsWith('Z') ? timestamp : `${timestamp}Z`;
        const date = new Date(dateStr);
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

    const getSeverityColor = (severity) => {
        const colors = {
            low: '#10b981',
            medium: '#f59e0b',
            high: '#ef4444',
        };
        return colors[severity] || '#f59e0b';
    };

    const filteredIncidents = showVerifiedOnly
        ? incidents.filter(inc => inc.verified)
        : incidents;

    return (
        <div className="screen">
            <div className="status-bar glass-panel" style={{
                top: '20px',
                height: 'auto',
                padding: '20px 24px',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '8px',
                background: 'rgba(15, 23, 42, 0.6)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '24px', margin: 0, fontFamily: 'Outfit, sans-serif' }}>Live Feed</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: '4px 0 0 0' }}>Real-time community reports</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
                            style={{
                                padding: '10px',
                                borderRadius: '12px',
                                background: showVerifiedOnly ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)',
                                border: showVerifiedOnly ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                                color: showVerifiedOnly ? '#10b981' : 'var(--text-secondary)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            <Filter size={18} />
                            {showVerifiedOnly && <span style={{ fontSize: '12px', fontWeight: '600' }}>Verified</span>}
                        </button>
                        <button
                            onClick={() => loadIncidents(true)}
                            disabled={refreshing}
                            style={{
                                padding: '10px',
                                borderRadius: '12px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <RefreshCw size={18} className={refreshing ? 'rotating' : ''} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="screen-content" style={{ paddingTop: '140px', paddingBottom: '100px' }}>
                {loading ? (
                    <div className="loading">Loading incidents...</div>
                ) : filteredIncidents.length === 0 ? (
                    <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', borderRadius: '24px' }}>
                        <AlertCircle size={48} style={{ color: '#94a3b8', marginBottom: '16px', opacity: 0.5 }} />
                        <p style={{ color: '#94a3b8', marginBottom: '16px' }}>
                            {showVerifiedOnly ? 'No verified incidents found' : 'No incidents reported recently'}
                        </p>
                        {showVerifiedOnly && (
                            <button
                                onClick={() => setShowVerifiedOnly(false)}
                                style={{
                                    background: 'var(--primary)',
                                    color: '#0f172a',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Clear Filter
                            </button>
                        )}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {filteredIncidents.map((incident) => (
                            <div key={incident.id} className="glass-panel" style={{
                                padding: '20px',
                                borderRadius: '24px',
                                borderLeft: `4px solid ${getSeverityColor(incident.severity)}`,
                                background: 'rgba(30, 41, 59, 0.4)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{
                                            width: '44px', height: '44px', borderRadius: '50%',
                                            background: `${getSeverityColor(incident.severity)}15`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            border: `1px solid ${getSeverityColor(incident.severity)}30`
                                        }}>
                                            <AlertCircle size={22} color={getSeverityColor(incident.severity)} />
                                        </div>
                                        <div>
                                            <div style={{
                                                fontSize: '16px',
                                                fontWeight: '700',
                                                textTransform: 'capitalize',
                                                color: 'var(--text-primary)',
                                                fontFamily: 'Outfit, sans-serif',
                                                marginBottom: '2px'
                                            }}>
                                                {incident.type.replace('_', ' ')}
                                            </div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Clock size={12} /> {formatTime(incident.timestamp)}
                                            </div>
                                        </div>
                                    </div>
                                    <span style={{
                                        fontSize: '10px', fontWeight: '700', textTransform: 'uppercase',
                                        padding: '4px 8px', borderRadius: '6px',
                                        background: `${getSeverityColor(incident.severity)}15`,
                                        color: getSeverityColor(incident.severity),
                                        border: `1px solid ${getSeverityColor(incident.severity)}30`
                                    }}>
                                        {incident.severity}
                                    </span>
                                </div>

                                {incident.description && (
                                    <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                                        {incident.description}
                                    </p>
                                )}

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                                        <MapPin size={14} />
                                        {incident.latitude.toFixed(4)}, {incident.longitude.toFixed(4)}
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
