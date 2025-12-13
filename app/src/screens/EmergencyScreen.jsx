import React, { useState, useEffect } from 'react';
import { Phone, Flashlight, Share2, AlertOctagon, Shield, MapPin, Bell, Users, Siren } from 'lucide-react';

const EmergencyScreen = () => {
    const [flashlightOn, setFlashlightOn] = useState(false);
    const [sosActive, setSosActive] = useState(false);
    const [countdown, setCountdown] = useState(null);
    const [pulseAnimation, setPulseAnimation] = useState(false);

    useEffect(() => {
        if (sosActive) {
            const interval = setInterval(() => {
                setPulseAnimation(prev => !prev);
            }, 500);
            return () => clearInterval(interval);
        }
    }, [sosActive]);

    const handleSOS = () => {
        if (sosActive) return;
        
        setSosActive(true);
        if (navigator.vibrate) {
            // Continuous vibration pattern for SOS
            navigator.vibrate([200, 100, 200, 100, 200, 300, 500, 100, 500, 100, 500]);
        }
        
        // Simulate emergency broadcast
        setTimeout(() => {
            alert('🚨 SOS ALERT ACTIVATED!\n\n✓ Emergency services notified\n✓ Location shared with emergency contacts\n✓ Broadcasting to nearby SafeRoute users\n✓ Local authorities alerted\n\nStay calm, help is on the way.\nKeep this app open.');
        }, 100);
        
        // Auto-deactivate after 30 seconds
        setTimeout(() => setSosActive(false), 30000);
    };

    const handleCancelSOS = () => {
        setSosActive(false);
        if (navigator.vibrate) navigator.vibrate(0);
        alert('✓ SOS Alert Cancelled');
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
        { name: 'Police Emergency', number: '112', icon: '🚓', color: '#3b82f6', desc: '24/7 Police Hotline' },
        { name: 'Lagos Rapid Response', number: '767', icon: '🚨', color: '#ef4444', desc: 'Quick Response Squad' },
        { name: 'Ambulance Service', number: '112', icon: '🚑', color: '#10b981', desc: 'Medical Emergency' },
        { name: 'Fire Service', number: '112', icon: '🚒', color: '#f59e0b', desc: 'Fire & Rescue' },
        { name: 'LASTMA', number: '0800-2527862', icon: '🚦', color: '#8b5cf6', desc: 'Traffic Emergency' },
    ];

    return (
        <div className="screen" style={{ background: sosActive ? 'rgba(239, 68, 68, 0.05)' : undefined }}>
            {/* Pulsing background when SOS active */}
            {sosActive && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: pulseAnimation ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
                    transition: 'background 0.5s ease',
                    pointerEvents: 'none',
                    zIndex: 0
                }} />
            )}

            <div className="status-bar glass-panel" style={{
                padding: '20px 24px',
                background: sosActive 
                    ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.2) 100%)'
                    : 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.08) 100%)',
                border: sosActive ? '2px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(239, 68, 68, 0.25)',
                boxShadow: sosActive ? '0 0 40px rgba(239, 68, 68, 0.4)' : '0 8px 32px rgba(0, 0, 0, 0.3)',
                height: 'auto'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '14px',
                        background: sosActive 
                            ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                            : 'linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.2) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: sosActive ? '0 0 25px rgba(239, 68, 68, 0.6)' : '0 0 15px rgba(239, 68, 68, 0.3)',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        animation: sosActive ? 'pulse 1s infinite' : 'none'
                    }}>
                        <Siren size={24} color={sosActive ? '#ffffff' : '#ef4444'} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 style={{ 
                            fontSize: '26px', 
                            margin: 0, 
                            color: '#ef4444',
                            fontWeight: '800',
                            fontFamily: 'Outfit, sans-serif',
                            letterSpacing: '0.5px'
                        }}>
                            {sosActive ? 'SOS ACTIVE' : 'Emergency SOS'}
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '2px 0 0 0', fontWeight: '500' }}>
                            {sosActive ? 'Broadcasting your location...' : 'Instant help when you need it most'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="screen-content" style={{ paddingTop: '140px', paddingBottom: '120px', position: 'relative', zIndex: 1 }}>
                {/* SOS Status Banner */}
                {sosActive && (
                    <div className="glass-panel" style={{
                        marginBottom: '24px',
                        padding: '20px',
                        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.1) 100%)',
                        border: '2px solid rgba(239, 68, 68, 0.4)',
                        borderRadius: '18px',
                        boxShadow: '0 0 30px rgba(239, 68, 68, 0.3)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <div style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                background: '#ef4444',
                                boxShadow: '0 0 12px #ef4444',
                                animation: 'pulse 1s infinite'
                            }} />
                            <span style={{ fontSize: '15px', fontWeight: '700', color: '#ef4444' }}>
                                EMERGENCY ALERT BROADCASTING
                            </span>
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginLeft: '24px' }}>
                            ✓ Location shared with authorities<br/>
                            ✓ Nearby users notified<br/>
                            ✓ Emergency contacts alerted
                        </div>
                    </div>
                )}

                {/* Main SOS Button */}
                <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <button
                        onClick={sosActive ? handleCancelSOS : handleSOS}
                        style={{
                            width: '280px',
                            height: '280px',
                            borderRadius: '50%',
                            background: sosActive 
                                ? 'radial-gradient(circle, #dc2626 0%, #991b1b 100%)'
                                : 'radial-gradient(circle, #ef4444 0%, #dc2626 100%)',
                            border: sosActive ? '10px solid rgba(239, 68, 68, 0.5)' : '8px solid rgba(239, 68, 68, 0.3)',
                            boxShadow: sosActive 
                                ? '0 0 80px rgba(239, 68, 68, 0.8), inset 0 0 60px rgba(0, 0, 0, 0.3)'
                                : '0 0 50px rgba(239, 68, 68, 0.5), inset 0 0 40px rgba(0, 0, 0, 0.2)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transform: sosActive ? 'scale(0.95)' : 'scale(1)',
                            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            animation: sosActive ? 'pulse 1s infinite' : 'none',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                        onMouseEnter={(e) => {
                            if (!sosActive) e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                            if (!sosActive) e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        {/* Ripple effect */}
                        {sosActive && (
                            <div style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                background: 'radial-gradient(circle, transparent 40%, rgba(239, 68, 68, 0.3) 100%)',
                                animation: 'ripple 2s infinite'
                            }} />
                        )}
                        
                        <AlertOctagon 
                            size={80} 
                            color="white" 
                            strokeWidth={3}
                            style={{ 
                                marginBottom: '20px',
                                filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))',
                                position: 'relative',
                                zIndex: 1
                            }} 
                        />
                        <span style={{ 
                            fontSize: '42px', 
                            fontWeight: '900', 
                            color: 'white', 
                            letterSpacing: '3px',
                            fontFamily: 'Outfit, sans-serif',
                            textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                            position: 'relative',
                            zIndex: 1
                        }}>
                            {sosActive ? 'CANCEL' : 'SOS'}
                        </span>
                        <span style={{ 
                            fontSize: '13px', 
                            color: 'rgba(255,255,255,0.9)', 
                            marginTop: '12px',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            position: 'relative',
                            zIndex: 1
                        }}>
                            {sosActive ? 'Tap to Stop' : 'Tap for Emergency'}
                        </span>
                    </button>
                </div>

                {/* Quick Actions */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                    <button 
                        className="glass-panel" 
                        onClick={handleShareLocation} 
                        style={{ 
                            padding: '24px 16px', 
                            borderRadius: '20px', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            gap: '12px', 
                            cursor: 'pointer',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            background: 'rgba(59, 130, 246, 0.05)',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                            e.currentTarget.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <MapPin size={32} color="#3b82f6" strokeWidth={2.5} />
                        <span style={{ fontSize: '14px', fontWeight: '700', textAlign: 'center', color: 'white' }}>Share Location</span>
                    </button>
                    <button 
                        className="glass-panel" 
                        onClick={handleFlashlight} 
                        style={{ 
                            padding: '24px 16px', 
                            borderRadius: '20px', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            gap: '12px', 
                            cursor: 'pointer',
                            background: flashlightOn ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.05)',
                            border: flashlightOn ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(245, 158, 11, 0.3)',
                            boxShadow: flashlightOn ? '0 0 20px rgba(245, 158, 11, 0.3)' : 'none',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            if (!flashlightOn) {
                                e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)';
                                e.currentTarget.style.boxShadow = '0 0 20px rgba(245, 158, 11, 0.2)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!flashlightOn) {
                                e.currentTarget.style.background = 'rgba(245, 158, 11, 0.05)';
                                e.currentTarget.style.boxShadow = 'none';
                            }
                        }}
                    >
                        <Flashlight size={32} color="#f59e0b" strokeWidth={2.5} />
                        <span style={{ fontSize: '14px', fontWeight: '700', textAlign: 'center', color: 'white' }}>
                            {flashlightOn ? 'Light ON' : 'Flashlight'}
                        </span>
                    </button>
                </div>

                {/* Emergency Contacts */}
                <div className="glass-panel" style={{ 
                    padding: '24px', 
                    borderRadius: '24px',
                    background: 'rgba(15, 23, 42, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px',
                        marginBottom: '20px'
                    }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.15) 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1.5px solid rgba(16, 185, 129, 0.4)',
                            boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)'
                        }}>
                            <Phone size={18} color="var(--primary)" strokeWidth={2.5} />
                        </div>
                        <h3 style={{ 
                            fontSize: '15px', 
                            fontWeight: '800',
                            margin: 0,
                            fontFamily: 'Outfit, sans-serif',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                            color: 'var(--text-primary)'
                        }}>
                            Emergency Hotlines
                        </h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {emergencyContacts.map((contact, index) => (
                            <a
                                key={index}
                                href={`tel:${contact.number}`}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '18px',
                                    background: 'rgba(255,255,255,0.04)',
                                    borderRadius: '16px',
                                    textDecoration: 'none',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                                    e.currentTarget.style.borderColor = `${contact.color}40`;
                                    e.currentTarget.style.boxShadow = `0 0 20px ${contact.color}20`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                                    <div style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '12px',
                                        background: `${contact.color}15`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '22px',
                                        border: `1px solid ${contact.color}30`
                                    }}>
                                        {contact.icon}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '2px' }}>
                                            {contact.name}
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                            {contact.desc}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ 
                                    fontSize: '16px', 
                                    fontWeight: '800', 
                                    color: contact.color,
                                    fontFamily: 'JetBrains Mono, monospace',
                                    background: `${contact.color}10`,
                                    padding: '6px 12px',
                                    borderRadius: '8px'
                                }}>
                                    {contact.number}
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(0.98); }
                }
                @keyframes ripple {
                    0% { transform: scale(0.8); opacity: 1; }
                    100% { transform: scale(1.4); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default EmergencyScreen;
