import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';
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
            <div className="screen-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                    <BarChart3 size={24} color="var(--primary)" />
                    <h1>Safety Trends</h1>
                </div>
                <p>7-day historical safety data</p>
            </div>

            <div className="screen-content">
                {/* Search Zone */}
                <div className="form-group">
                    <label>Search Location</label>
                    <input
                        type="text"
                        className="input"
                        placeholder="Search for a zone..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div className="loading">Loading trends...</div>
                ) : trendData ? (
                    <>
                        {/* Zone Info */}
                        <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
                            <h3 style={{
                                fontSize: '18px',
                                fontWeight: '600',
                                color: 'var(--text-primary)',
                                marginBottom: 'var(--space-sm)',
                            }}>
                                {trendData.zone_name}
                            </h3>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: getTrendColor(),
                            }}>
                                <TrendIcon size={20} />
                                <span style={{ fontSize: '14px', fontWeight: '600', textTransform: 'capitalize' }}>
                                    {trendData.trend_direction}
                                </span>
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="card" style={{ marginBottom: 'var(--space-lg)', padding: 'var(--space-lg)' }}>
                            <SafetyTrendsChart
                                trends={trendData.trends}
                                zoneName={trendData.zone_name}
                            />
                        </div>

                        {/* Statistics */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: 'var(--space-md)',
                        }}>
                            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-md)' }}>
                                <div style={{
                                    fontSize: '24px',
                                    fontWeight: '700',
                                    color: 'var(--primary)',
                                    marginBottom: '4px',
                                }}>
                                    {trendData.average_score.toFixed(1)}
                                </div>
                                <div style={{
                                    fontSize: '12px',
                                    color: 'var(--text-secondary)',
                                    fontWeight: '600',
                                }}>
                                    Average
                                </div>
                            </div>

                            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-md)' }}>
                                <div style={{
                                    fontSize: '24px',
                                    fontWeight: '700',
                                    color: '#10b981',
                                    marginBottom: '4px',
                                }}>
                                    {trendData.max_score.toFixed(1)}
                                </div>
                                <div style={{
                                    fontSize: '12px',
                                    color: 'var(--text-secondary)',
                                    fontWeight: '600',
                                }}>
                                    Peak
                                </div>
                            </div>

                            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-md)' }}>
                                <div style={{
                                    fontSize: '24px',
                                    fontWeight: '700',
                                    color: '#ef4444',
                                    marginBottom: '4px',
                                }}>
                                    {trendData.min_score.toFixed(1)}
                                </div>
                                <div style={{
                                    fontSize: '12px',
                                    color: 'var(--text-secondary)',
                                    fontWeight: '600',
                                }}>
                                    Lowest
                                </div>
                            </div>
                        </div>

                        {/* Insights */}
                        <div className="card" style={{ marginTop: 'var(--space-lg)' }}>
                            <h3 style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: 'var(--text-primary)',
                                marginBottom: 'var(--space-sm)',
                            }}>
                                📊 Insights
                            </h3>
                            <ul style={{
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
                                lineHeight: '1.6',
                                margin: 0,
                                paddingLeft: '20px',
                            }}>
                                <li>Safety scores vary between day and night</li>
                                <li>Trend is {trendData.trend_direction} over the past week</li>
                                <li>Peak safety hours are typically during daytime</li>
                            </ul>
                        </div>
                    </>
                ) : (
                    <div style={{
                        textAlign: 'center',
                        padding: 'var(--space-xl)',
                        color: 'var(--text-secondary)',
                    }}>
                        Search for a location to view trends
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrendsScreen;
