import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Map, ClipboardList, Users, Radio, Siren } from 'lucide-react';

const Navigation = () => {
    const navigate = useNavigate();
    
    const navItems = [
        { path: '/', icon: Map, label: 'Map' },
        { path: '/feed', icon: Radio, label: 'Live Feed' },
        { type: 'sos' },
        { path: '/report', icon: ClipboardList, label: 'Report' },
        { path: '/trends', icon: Users, label: 'Community' },
    ];

    return (
        <nav className="bottom-nav glass-panel" role="navigation" aria-label="Main navigation">
            {navItems.map((item, index) => (
                item.type === 'sos' ? (
                    <button
                        key="sos"
                        className="glass-panel"
                        onClick={() => navigate('/emergency')}
                        style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px solid rgba(239, 68, 68, 0.4)',
                            cursor: 'pointer',
                            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.2) 100%)',
                            boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)',
                            transition: 'all 0.3s ease',
                            animation: 'sosGlow 2s ease-in-out infinite',
                            marginTop: '0px',
                            position: 'relative'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1)';
                            e.currentTarget.style.boxShadow = '0 0 30px rgba(239, 68, 68, 0.8)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.5)';
                        }}
                        title="Emergency SOS"
                        aria-label="Emergency SOS"
                    >
                        <Siren size={28} color="#ef4444" strokeWidth={2.5} />
                    </button>
                ) : (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        title={item.label}
                        aria-label={item.label}
                        role="tab"
                    >
                        <item.icon size={24} aria-hidden="true" />
                        <span className="sr-only">{item.label}</span>
                    </NavLink>
                )
            ))}
        </nav>
    );
};

export default Navigation;
