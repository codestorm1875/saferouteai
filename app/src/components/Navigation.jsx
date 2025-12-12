import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Route, AlertCircle, List, BarChart3, Phone, Settings } from 'lucide-react';

const Navigation = () => {
    const navItems = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/route', icon: Route, label: 'Route' },
        { path: '/report', icon: AlertCircle, label: 'Report' },
        { path: '/feed', icon: List, label: 'Feed' },
        { path: '/trends', icon: BarChart3, label: 'Trends' },
        { path: '/emergency', icon: Phone, label: 'SOS' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <nav className="bottom-nav">
            {navItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    title={item.label}
                >
                    <item.icon size={22} />
                </NavLink>
            ))}
        </nav>
    );
};

export default Navigation;
