import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const BottomSheetAlert = ({ type = 'success', title, message, onClose, duration = 4000 }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger slide-up animation
        setTimeout(() => setIsVisible(true), 10);

        // Auto-close after duration
        if (duration > 0) {
            const timer = setTimeout(() => {
                handleClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            if (onClose) onClose();
        }, 300);
    };

    const config = {
        success: {
            icon: CheckCircle,
            color: '#10b981',
            bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.1) 100%)',
            borderColor: 'rgba(16, 185, 129, 0.4)',
            glowColor: 'rgba(16, 185, 129, 0.3)'
        },
        failure: {
            icon: XCircle,
            color: '#ef4444',
            bgGradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.1) 100%)',
            borderColor: 'rgba(239, 68, 68, 0.4)',
            glowColor: 'rgba(239, 68, 68, 0.3)'
        }
    };

    const style = config[type];
    const Icon = style.icon;

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={handleClose}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 9998,
                    opacity: isVisible ? 1 : 0,
                    transition: 'opacity 0.3s ease'
                }}
            />

            {/* Bottom Sheet */}
            <div
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 9999,
                    transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    padding: '0 20px 20px'
                }}
            >
                <div
                    className="glass-panel"
                    style={{
                        background: style.bgGradient,
                        backdropFilter: 'blur(20px)',
                        border: `1.5px solid ${style.borderColor}`,
                        borderRadius: '28px 28px 0 0',
                        padding: '28px 24px',
                        boxShadow: `0 -10px 40px ${style.glowColor}, 0 -4px 20px rgba(0, 0, 0, 0.3)`,
                        position: 'relative'
                    }}
                >
                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            background: 'rgba(0, 0, 0, 0.3)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)';
                        }}
                    >
                        <X size={18} color="#ffffff" />
                    </button>

                    {/* Content */}
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                        {/* Icon */}
                        <div
                            style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '50%',
                                background: `rgba(${type === 'success' ? '16, 185, 129' : '239, 68, 68'}, 0.2)`,
                                border: `2px solid ${style.borderColor}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                boxShadow: `0 0 20px ${style.glowColor}`
                            }}
                        >
                            <Icon size={32} color={style.color} strokeWidth={2.5} />
                        </div>

                        {/* Text Content */}
                        <div style={{ flex: 1, paddingTop: '4px' }}>
                            <h3
                                style={{
                                    margin: '0 0 8px 0',
                                    fontSize: '20px',
                                    fontWeight: '800',
                                    color: style.color,
                                    fontFamily: 'Outfit, sans-serif',
                                    letterSpacing: '0.3px'
                                }}
                            >
                                {title}
                            </h3>
                            <p
                                style={{
                                    margin: 0,
                                    fontSize: '14px',
                                    color: 'var(--text-secondary)',
                                    lineHeight: '1.5',
                                    fontFamily: 'Inter, sans-serif'
                                }}
                            >
                                {message}
                            </p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    {duration > 0 && (
                        <div
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                background: 'rgba(0, 0, 0, 0.2)',
                                borderRadius: '0 0 28px 28px',
                                overflow: 'hidden'
                            }}
                        >
                            <div
                                style={{
                                    height: '100%',
                                    background: style.color,
                                    animation: `shrink ${duration}ms linear`,
                                    boxShadow: `0 0 10px ${style.color}`
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes shrink {
                    from {
                        width: 100%;
                    }
                    to {
                        width: 0%;
                    }
                }
            `}</style>
        </>
    );
};

export default BottomSheetAlert;
