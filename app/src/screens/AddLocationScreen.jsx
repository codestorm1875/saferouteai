import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowLeft, Save } from 'lucide-react';
import LocationSearch from '../components/LocationSearch';
import BottomSheetAlert from '../components/BottomSheetAlert';
import { addSavedLocation } from '../utils/storage';

const AddLocationScreen = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        label: '',
        type: 'home',
        location: null
    });
    const [alert, setAlert] = useState(null);

    const handleLocationSelect = (location) => {
        setFormData({ ...formData, location });
    };

    const handleSave = () => {
        if (!formData.label || !formData.location) {
            setAlert({
                type: 'failure',
                title: 'Missing Information',
                message: 'Please fill in all fields before saving.'
            });
            return;
        }

        try {
            const newLocation = {
                label: formData.label,
                type: formData.type,
                name: formData.location.name,
                lat: formData.location.lat,
                lng: formData.location.lng,
                area: formData.location.area
            };

            addSavedLocation(newLocation);

            setAlert({
                type: 'success',
                title: 'Location Saved!',
                message: `${formData.label} has been added to your saved locations.`,
                onClose: () => {
                    navigate('/settings');
                }
            });
        } catch (error) {
            setAlert({
                type: 'failure',
                title: 'Save Failed',
                message: 'Unable to save location. Please try again.'
            });
        }
    };

    const getTypeIcon = (type) => {
        const icons = {
            home: '🏠',
            work: '💼',
            gym: '💪',
            other: '📍'
        };
        return icons[type] || '📍';
    };

    return (
        <div className="screen">
            {/* Header */}
            <div className="status-bar glass-panel" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                padding: '16px 20px'
            }}>
                <button
                    onClick={() => navigate('/settings')}
                    style={{
                        background: 'rgba(139, 92, 246, 0.1)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        borderRadius: '12px',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)';
                        e.currentTarget.style.boxShadow = '0 0 15px rgba(139, 92, 246, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                    <ArrowLeft size={20} color="#8b5cf6" />
                </button>
                <div style={{ flex: 1 }}>
                    <h1 style={{ 
                        fontSize: '24px', 
                        margin: 0,
                        fontFamily: 'Outfit, sans-serif',
                        fontWeight: '800'
                    }}>Add Location</h1>
                    <p style={{ 
                        color: 'var(--text-muted)', 
                        fontSize: '13px', 
                        margin: 0 
                    }}>Save a new place</p>
                </div>
                <MapPin 
                    size={48} 
                    style={{ 
                        color: '#8b5cf6',
                        filter: 'drop-shadow(0 0 12px rgba(139, 92, 246, 0.6))'
                    }} 
                />
            </div>

            <div className="screen-content" style={{ paddingTop: '110px' }}>
                {/* Form Card */}
                <div className="glass-panel" style={{ 
                    padding: '28px',
                    borderRadius: '24px',
                    marginBottom: '24px',
                    border: '1px solid rgba(139, 92, 246, 0.25)',
                    background: 'rgba(139, 92, 246, 0.05)',
                    boxShadow: '0 0 30px rgba(139, 92, 246, 0.15)'
                }}>
                    {/* Label Input */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ 
                            color: '#8b5cf6', 
                            fontSize: '11px', 
                            marginBottom: '8px', 
                            display: 'block',
                            fontWeight: '700',
                            letterSpacing: '0.5px',
                            fontFamily: 'Outfit, sans-serif',
                            textTransform: 'uppercase'
                        }}>Label *</label>
                        <input
                            type="text"
                            className="input-glass"
                            placeholder="e.g., Home, Work, Gym"
                            value={formData.label}
                            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                            style={{ 
                                background: 'rgba(0, 0, 0, 0.4)',
                                border: '1px solid rgba(139, 92, 246, 0.3)',
                                padding: '14px 16px',
                                fontSize: '14px',
                                borderRadius: '12px',
                                color: '#ffffff',
                                fontFamily: 'Inter, sans-serif',
                                transition: 'all 0.3s ease'
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.border = '1px solid rgba(139, 92, 246, 0.6)';
                                e.currentTarget.style.boxShadow = '0 0 15px rgba(139, 92, 246, 0.3)';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.border = '1px solid rgba(139, 92, 246, 0.3)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    {/* Type Selector */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ 
                            color: '#8b5cf6', 
                            fontSize: '11px', 
                            marginBottom: '8px', 
                            display: 'block',
                            fontWeight: '700',
                            letterSpacing: '0.5px',
                            fontFamily: 'Outfit, sans-serif',
                            textTransform: 'uppercase'
                        }}>Type *</label>
                        <select
                            className="input-glass"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            style={{ 
                                background: 'rgba(0, 0, 0, 0.4)',
                                border: '1px solid rgba(139, 92, 246, 0.3)',
                                padding: '14px 16px',
                                fontSize: '14px',
                                borderRadius: '12px',
                                color: '#ffffff',
                                width: '100%',
                                fontFamily: 'Inter, sans-serif',
                                cursor: 'pointer'
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.border = '1px solid rgba(139, 92, 246, 0.6)';
                                e.currentTarget.style.boxShadow = '0 0 15px rgba(139, 92, 246, 0.3)';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.border = '1px solid rgba(139, 92, 246, 0.3)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <option value="home" style={{ background: '#1a1a2e', color: '#ffffff' }}>🏠 Home</option>
                            <option value="work" style={{ background: '#1a1a2e', color: '#ffffff' }}>💼 Work</option>
                            <option value="gym" style={{ background: '#1a1a2e', color: '#ffffff' }}>💪 Gym</option>
                            <option value="other" style={{ background: '#1a1a2e', color: '#ffffff' }}>📍 Other</option>
                        </select>
                    </div>

                    {/* Location Search */}
                    <div>
                        <label style={{ 
                            color: '#8b5cf6', 
                            fontSize: '11px', 
                            marginBottom: '8px', 
                            display: 'block',
                            fontWeight: '700',
                            letterSpacing: '0.5px',
                            fontFamily: 'Outfit, sans-serif',
                            textTransform: 'uppercase'
                        }}>Location *</label>
                        <LocationSearch
                            onLocationSelect={handleLocationSelect}
                            placeholder="Search for location..."
                            inputStyle={{
                                background: 'rgba(0, 0, 0, 0.4)',
                                border: '1px solid rgba(139, 92, 246, 0.3)',
                                padding: '14px 16px 14px 44px',
                                fontSize: '14px',
                                borderRadius: '12px'
                            }}
                        />
                        {formData.location && (
                            <div style={{
                                marginTop: '12px',
                                padding: '12px 16px',
                                background: 'rgba(139, 92, 246, 0.1)',
                                border: '1px solid rgba(139, 92, 246, 0.3)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: '#8b5cf6',
                                fontSize: '13px'
                            }}>
                                <MapPin size={16} />
                                <span>{formData.location.name}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    style={{
                        width: '100%',
                        padding: '20px',
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                        border: '1px solid rgba(139, 92, 246, 0.4)',
                        borderRadius: '18px',
                        color: '#ffffff',
                        fontSize: '16px',
                        fontWeight: '800',
                        fontFamily: 'Outfit, sans-serif',
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        boxShadow: '0 0 25px rgba(139, 92, 246, 0.4)',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 0 35px rgba(139, 92, 246, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 0 25px rgba(139, 92, 246, 0.4)';
                    }}
                >
                    <Save size={20} strokeWidth={2.5} />
                    Save Location
                </button>
            </div>

            {/* Bottom Sheet Alert */}
            {alert && (
                <BottomSheetAlert
                    type={alert.type}
                    title={alert.title}
                    message={alert.message}
                    onClose={() => {
                        if (alert.onClose) {
                            alert.onClose();
                        }
                        setAlert(null);
                    }}
                />
            )}
        </div>
    );
};

export default AddLocationScreen;
