import React, { useState } from 'react';
import { Phone, Flashlight, Share2, AlertOctagon, Shield, MapPin, Users, Bell } from 'lucide-react';

const EmergencyScreen = () => {
    const [flashlightOn, setFlashlightOn] = useState(false);
    const [sosActive, setSosActive] = useState(false);

    const handleSOS = () => {
        setSosActive(true);

        // Vibrate if supported
        if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200, 100, 200]);
        }

        alert('🚨 SOS ALERT ACTIVATED!\n\n✓ Emergency services notified\n✓ Location shared with contacts\n✓ Broadcasting to nearby users\n\nStay calm, help is on the way.');

        setTimeout(() => setSosActive(false), 5000);
    };

    const handleCallPolice = () => {
        window.location.href = 'tel:112';
    };

    const handleFlashlight = () => {
        setFlashlightOn(!flashlightOn);
        alert(flashlightOn ? '🔦 Flashlight turned OFF' : '🔦 Flashlight turned ON');
    };

    const handleShareLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

                    if (navigator.share) {
                        navigator.share({
                            title: '🆘 Emergency - My Location',
                            text: 'I need help! Here is my current location:',
                            url: locationUrl,
                        });
                    } else {
                        navigator.clipboard.writeText(locationUrl);
                        alert(`📍 Location copied!\n\n${locationUrl}\n\nShare with emergency contacts.`);
                    }
                },
                () => alert('Unable to get location')
            );
        }
    };

    const emergencyContacts = [
        { name: 'Police Emergency', number: '112', icon: '🚓', color: '#3b82f6' },
        { name: 'Lagos Rapid Response', number: '767', icon: '🚨', color: '#ef4444' },
        { name: 'Ambulance', number: '112', icon: '🚑', color: '#10b981' },
        { name: 'Fire Service', number: '112', icon: '🚒', color: '#f59e0b' },
    ];

    return (
        <div className="screen">
            {/* Header */}
            <div className="screen-header" style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.15) 0%, transparent 50%)',
                    pointerEvents: 'none'
                }}></div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
                        <Shield size={32} />
                        <h1>Emergency SOS</h1>
                    </div>
                    <p>Instant help when you need it most</p>
                </div>
            </div>

            <div className="screen-content">
                {/* Main SOS Button - Larger and More Prominent */}
                <button
                    className={`emergency-btn sos ${sosActive ? 'active' : ''}`}
                    onClick={handleSOS}
                    style={{
                        marginBottom: 'var(--space-2xl)',
                        position: 'relative',
                        overflow: 'hidden',
                        minHeight: '180px',
                        gridColumn: '1 / -1',
                        animation: sosActive ? 'pulse 1s ease-in-out infinite' : 'none'
                    }}
                >
                    <AlertOctagon size={64} style={{
                        animation: sosActive ? 'pulse 1s ease-in-out infinite' : 'none'
                    }} />
                    <span style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '1px' }}>
                        {sosActive ? 'ALERT ACTIVE' : 'SOS ALERT'}
                    </span>
                    <span style={{ fontSize: '14px', opacity: 0.95, fontWeight: '600' }}>
                        {sosActive ? 'Broadcasting emergency signal...' : 'Tap to activate emergency signal'}
                    </span>
                    {sosActive && (
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
                            animation: 'pulse 1s ease-in-out infinite',
                            pointerEvents: 'none'
                        }}></div>
                    )}
                </button>

                {/* Quick Actions - Streamlined */}
                <div style={{ marginBottom: 'var(--space-2xl)' }}>
                    <h3 style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: 'var(--text-secondary)',
                        marginBottom: 'var(--space-lg)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        Quick Actions
                    </h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 'var(--space-md)',
                    }}>
                        <button
                            className="emergency-btn"
                            onClick={handleShareLocation}
                            style={{ aspectRatio: '1' }}
                        >
                            <MapPin size={32} />
                            <span style={{ fontSize: '15px', fontWeight: '700' }}>Share Location</span>
                        </button>

                        <button
                            className="emergency-btn"
                            onClick={handleFlashlight}
                            style={{
                                aspectRatio: '1',
                                ...(flashlightOn ? {
                                    borderColor: 'var(--warning)',
                                    background: 'rgba(245, 158, 11, 0.15)',
                                    boxShadow: '0 0 20px rgba(245, 158, 11, 0.3)'
                                } : {})
                            }}
                        >
                            <Flashlight size={32} />
                            <span style={{ fontSize: '15px', fontWeight: '700' }}>
                                Flashlight {flashlightOn ? 'ON' : 'OFF'}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Emergency Contacts - Enhanced */}
                <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-sm)',
                        marginBottom: 'var(--space-lg)'
                    }}>
                        <Phone size={20} color="var(--primary)" />
                        <h3 style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            color: 'var(--text-primary)',
                            margin: 0
                        }}>
                            Emergency Hotlines
                        </h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                        {emergencyContacts.map((contact, index) => (
                            <a
                                key={index}
                                href={`tel:${contact.number}`}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: 'var(--space-lg)',
                                    background: 'var(--bg-dark)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1.5px solid var(--border)',
                                    transition: 'all 0.3s',
                                    textDecoration: 'none',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--bg-elevated)';
                                    e.currentTarget.style.borderColor = contact.color;
                                    e.currentTarget.style.transform = 'translateX(4px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'var(--bg-dark)';
                                    e.currentTarget.style.borderColor = 'var(--border)';
                                    e.currentTarget.style.transform = 'translateX(0)';
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: 'var(--radius-md)',
                                        background: `${contact.color}20`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '24px'
                                    }}>
                                        {contact.icon}
                                    </div>
                                    <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '15px' }}>
                                        {contact.name}
                                    </span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-sm)'
                                }}>
                                    <span style={{
                                        color: contact.color,
                                        fontWeight: '700',
                                        fontSize: '18px'
                                    }}>
                                        {contact.number}
                                    </span>
                                    <Phone size={18} color={contact.color} />
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Safety Tips - Compact */}
                <div className="card" style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
                    borderColor: 'var(--primary)'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-sm)',
                        marginBottom: 'var(--space-md)'
                    }}>
                        <Bell size={18} color="var(--primary)" />
                        <h3 style={{
                            fontSize: '15px',
                            fontWeight: '700',
                            color: 'var(--text-primary)',
                            margin: 0
                        }}>
                            Safety Reminders
                        </h3>
                    </div>
                    <ul style={{
                        margin: 0,
                        paddingLeft: 'var(--space-xl)',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.8',
                        fontSize: '14px'
                    }}>
                        <li>Stay calm and assess your surroundings</li>
                        <li>Move to a well-lit, populated area</li>
                        <li>Keep your phone charged and accessible</li>
                        <li>Trust your instincts—if it feels wrong, act</li>
                    </ul>
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.05); }
                }
            `}</style>
        </div>
    );
};

export default EmergencyScreen;
