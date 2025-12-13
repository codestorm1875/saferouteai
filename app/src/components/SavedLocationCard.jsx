import React from 'react';
import { Home, Briefcase, Dumbbell, MapPin, Trash2 } from 'lucide-react';

const LOCATION_ICONS = {
    home: Home,
    work: Briefcase,
    gym: Dumbbell,
    other: MapPin,
};

const SavedLocationCard = ({ location, onNavigate, onDelete, safetyScore }) => {
    const IconComponent = LOCATION_ICONS[location.type] || MapPin;

    const getScoreColor = (score) => {
        if (score >= 71) return '#10b981';
        if (score >= 31) return '#f59e0b';
        return '#ef4444';
    };

    const getScoreLabel = (score) => {
        if (score >= 71) return 'Safe';
        if (score >= 31) return 'Moderate';
        return 'Unsafe';
    };

    return (
        <div
            className="glass-panel"
            style={{
                padding: 'var(--space-md)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
                border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
            onClick={() => onNavigate && onNavigate(location)}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--bg-glass)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
            }}
        >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)' }}>
                <div
                    style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(16, 185, 129, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                    }}
                >
                    <IconComponent size={22} color="#10b981" />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '4px'
                    }}>
                        <h3 style={{
                            fontSize: '15px',
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                            margin: 0,
                            fontFamily: 'Outfit, sans-serif'
                        }}>
                            {location.label}
                        </h3>
                        {onDelete && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(location.id);
                                }}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    padding: '4px',
                                    cursor: 'pointer',
                                    color: 'var(--text-muted)',
                                    transition: 'color 0.2s ease',
                                }}
                                onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                                onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>

                    <p style={{
                        fontSize: '13px',
                        color: 'var(--text-muted)',
                        margin: '0 0 8px 0',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}>
                        {location.name}
                    </p>

                    {safetyScore !== undefined && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div
                                style={{
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    background: getScoreColor(safetyScore),
                                    boxShadow: `0 0 8px ${getScoreColor(safetyScore)}`,
                                }}
                            />
                            <span style={{
                                fontSize: '12px',
                                color: 'var(--text-muted)',
                                fontWeight: '500',
                            }}>
                                {getScoreLabel(safetyScore)} • {safetyScore.toFixed(1)}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SavedLocationCard;
