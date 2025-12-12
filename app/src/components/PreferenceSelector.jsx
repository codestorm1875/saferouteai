import React from 'react';
import { Shield, Zap, Scale } from 'lucide-react';

const RISK_OPTIONS = [
    {
        value: 'cautious',
        label: 'Cautious',
        icon: Shield,
        description: 'Prioritize safety over speed',
        color: '#10b981',
    },
    {
        value: 'balanced',
        label: 'Balanced',
        icon: Scale,
        description: 'Balance safety and efficiency',
        color: '#f59e0b',
    },
    {
        value: 'fast',
        label: 'Fast',
        icon: Zap,
        description: 'Prioritize speed when safe',
        color: '#3b82f6',
    },
];

const PreferenceSelector = ({ value, onChange }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-md)',
        }}>
            {RISK_OPTIONS.map((option) => {
                const IconComponent = option.icon;
                const isSelected = value === option.value;

                return (
                    <div
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        className="card"
                        style={{
                            padding: 'var(--space-md)',
                            cursor: 'pointer',
                            border: isSelected
                                ? `2px solid ${option.color}`
                                : '2px solid transparent',
                            background: isSelected
                                ? `${option.color}15`
                                : 'var(--card-bg)',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-md)',
                        }}>
                            <div
                                style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: 'var(--radius-md)',
                                    background: isSelected ? option.color : 'var(--border)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                <IconComponent
                                    size={24}
                                    color={isSelected ? '#0f172a' : 'var(--text-secondary)'}
                                />
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginBottom: '4px',
                                }}>
                                    <h3 style={{
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        color: 'var(--text-primary)',
                                        margin: 0,
                                    }}>
                                        {option.label}
                                    </h3>
                                    {isSelected && (
                                        <div
                                            style={{
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '50%',
                                                background: option.color,
                                                boxShadow: `0 0 8px ${option.color}`,
                                            }}
                                        />
                                    )}
                                </div>
                                <p style={{
                                    fontSize: '13px',
                                    color: 'var(--text-secondary)',
                                    margin: 0,
                                }}>
                                    {option.description}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default PreferenceSelector;
