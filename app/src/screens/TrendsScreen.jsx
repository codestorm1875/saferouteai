import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, BarChart3, Search } from 'lucide-react';
import { safetyAPI } from '../services/api';
import SafetyTrendsChart from '../components/SafetyTrendsChart';

const TrendsScreen = () => {
    const [zones, setZones] = useState([]);
    const [selectedZone, setSelectedZone] = useState(null);
    const [trendData, setTrendData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadZones();
    }, []);

    const loadZones = async () => {
        try {
            const data = await safetyAPI.getHeatmap();
            setZones(data);
            if (data.length > 0 && !selectedZone) {
                loadTrends(data[0].id);
            }
        } catch (error) {
            console.error('Error loading zones:', error);
        }
    };

    const loadTrends = async (zoneId) => {
        setLoading(true);
        try {
            const data = await safetyAPI.getTrends(zoneId);
            setTrendData(data);
            const zone = zones.find(z => z.id === zoneId) || zones[0];
            setSelectedZone(zone);
        } catch (error) {
            console.error('Error loading trends:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.length < 2) return;

        try {
            const results = await safetyAPI.searchZones(query);
            if (results.length > 0) {
                loadTrends(results[0].id);
            }
        } catch (error) {
            console.error('Error searching zones:', error);
        }
    };

    const getTrendIcon = () => {
        if (!trendData) return Minus;
        if (trendData.trend_direction === 'improving') return TrendingUp;
        if (trendData.trend_direction === 'declining') return TrendingDown;
        return Minus;
    };

    const getTrendColor = () => {
        if (!trendData) return 'var(--text-secondary)';
        if (trendData.trend_direction === 'improving') return '#10b981';
        if (trendData.trend_direction === 'declining') return '#ef4444';
        return '#f59e0b';
    };

    const TrendIcon = getTrendIcon();

    return (
        <div className="screen">
            <div className="status-bar glass-panel" style={{ top: '20px', height: 'auto', padding: '16px 24px', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                <h1 style={{ fontSize: '24px', margin: 0 }}>Safety Trends</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>Historical data analysis</p>
            </div>

            <div className="screen-content" style={{ paddingTop: '120px' }}>
                {/* Search Zone */}
                <div className="glass-panel" style={{ padding: '8px 16px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <Search size={20} color="var(--text-muted)" />
                    <input
                        type="text"
                        style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', padding: '8px 0', fontSize: '16px', outline: 'none' }}
                        placeholder="Search for a zone..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div className="loading">Loading trends...</div>
                ) : trendData ? (
                    <div className="animate-fade-in">
                        {/* Zone Info Card */}
                        <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px', marginBottom: '24px', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.6) 100%)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                <div>
                                    <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>{trendData.zone_name}</h2>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: getTrendColor() }}>
                                        <TrendIcon size={16} />
                                        <span style={{ fontSize: '14px', fontWeight: '600', textTransform: 'capitalize' }}>{trendData.trend_direction} Trend</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--primary)' }}>{trendData.average_score.toFixed(0)}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>AVG SCORE</div>
                                </div>
                            </div>

                            <SafetyTrendsChart
                                trends={trendData.trends}
                                zoneName={trendData.zone_name}
                            />
                        </div>

                        {/* Stats Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                            <div className="glass-panel" style={{ padding: '20px', borderRadius: '20px', textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: '800', color: '#10b981', marginBottom: '4px' }}>{trendData.max_score.toFixed(0)}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>PEAK SCORE</div>
                            </div>
                            <div className="glass-panel" style={{ padding: '20px', borderRadius: '20px', textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: '800', color: '#ef4444', marginBottom: '4px' }}>{trendData.min_score.toFixed(0)}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>LOWEST SCORE</div>
                            </div>
                        </div>

                        {/* AI Insights */}
                        <div className="glass-panel" style={{ padding: '20px', borderRadius: '24px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6' }}>
                                <BarChart3 size={18} /> AI Analysis
                            </h3>
                            <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                                <li>Safety scores show a <strong>{trendData.trend_direction}</strong> pattern over the last 7 days.</li>
                                <li>
                                    {trendData.trend_direction === 'improving'
                                        ? "Recent data indicates a positive shift in safety metrics."
                                        : trendData.trend_direction === 'declining'
                                            ? "Increased activity suggests rising risks in this sector."
                                            : "Safety levels have remained consistent with minor fluctuations."}
                                </li>
                                <li>
                                    {trendData.average_score > 70
                                        ? "This zone maintains high safety standards suitable for all-day travel."
                                        : trendData.average_score > 40
                                            ? "Exercise normal caution, especially during late night hours."
                                            : "High alert: Avoid this zone at night if possible."}
                                </li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        Search for a location to view detailed safety trends.
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrendsScreen;
