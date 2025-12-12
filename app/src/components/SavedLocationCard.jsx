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
            className="card"
            style={{
                padding: 'var(--space-md)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
            }}
            onClick={() => onNavigate && onNavigate(location)}
        >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)' }}>
                <div
                    style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                    }}
                >
                    <IconComponent size={22} color="#0f172a" />
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
                                    color: 'var(--text-secondary)',
                                    transition: 'color 0.2s ease',
                                }}
                                onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                                onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>

                    <p style={{
                        fontSize: '13px',
                        color: 'var(--text-secondary)',
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
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: getScoreColor(safetyScore),
                                    boxShadow: `0 0 8px ${getScoreColor(safetyScore)}40`,
                                }}
                            />
                            <span style={{
                                fontSize: '12px',
                                color: 'var(--text-secondary)',
                                fontWeight: '600',
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
