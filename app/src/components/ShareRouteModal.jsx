import React, { useState } from 'react';
import { X, Copy, Share2, Check } from 'lucide-react';
import { generateShareURL, shareToWhatsApp, copyToClipboard } from '../utils/shareUtils';

const ShareRouteModal = ({ routeData, onClose }) => {
    const [copied, setCopied] = useState(false);
    const shareURL = generateShareURL(routeData);

    const handleCopy = async () => {
        if (!shareURL) return;

        const success = await copyToClipboard(shareURL);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleWhatsAppShare = () => {
        if (!shareURL) return;
        shareToWhatsApp(shareURL, '🛡️ Check out this safe route I found on SafeRouteAI!');
    };

    if (!shareURL) {
        return null;
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 'var(--space-lg)',
        }}>
            <div style={{
                background: 'var(--card-bg)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-xl)',
                maxWidth: '400px',
                width: '100%',
                border: '1.5px solid var(--border)',
                boxShadow: 'var(--shadow-xl)',
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--space-lg)',
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-sm)',
                    }}>
                        <Share2 size={24} color="var(--primary)" />
                        <h2 style={{
                            fontSize: '20px',
                            fontWeight: '700',
                            color: 'var(--text-primary)',
                            margin: 0,
                        }}>
                            Share Route
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            padding: '4px',
                        }}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Route Info */}
                <div className="card" style={{
                    marginBottom: 'var(--space-lg)',
                    padding: 'var(--space-md)',
                }}>
                    <div style={{
                        fontSize: '13px',
                        color: 'var(--text-secondary)',
                        marginBottom: '8px',
                    }}>
                        {routeData.startLocation?.name} → {routeData.endLocation?.name}
                    </div>
                    <div style={{
                        display: 'flex',
                        gap: 'var(--space-md)',
                        fontSize: '12px',
                    }}>
                        <div>
                            <span style={{ color: 'var(--primary)' }}>🛡️ Safe: </span>
                            <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                                {routeData.safe_score?.toFixed(1)}
                            </span>
                        </div>
                        <div>
                            <span style={{ color: 'var(--warning)' }}>⚡ Fast: </span>
                            <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                                {routeData.fast_score?.toFixed(1)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Share URL */}
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                    <label style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: 'var(--text-secondary)',
                        marginBottom: '8px',
                        display: 'block',
                    }}>
                        Share Link
                    </label>
                    <div style={{
                        display: 'flex',
                        gap: 'var(--space-sm)',
                    }}>
                        <input
                            type="text"
                            value={shareURL}
                            readOnly
                            className="input"
                            style={{
                                flex: 1,
                                fontSize: '12px',
                                fontFamily: 'monospace',
                            }}
                        />
                        <button
                            onClick={handleCopy}
                            className="btn btn-secondary"
                            style={{
                                padding: '8px 16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                            }}
                        >
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>

                {/* Share Buttons */}
                <div style={{
                    display: 'flex',
                    gap: 'var(--space-md)',
                }}>
                    <button
                        onClick={handleWhatsAppShare}
                        className="btn btn-primary"
                        style={{
                            flex: 1,
                            background: '#25D366',
                            borderColor: '#25D366',
                        }}
                    >
                        📱 WhatsApp
                    </button>
                    <button
                        onClick={onClose}
                        className="btn btn-secondary"
                        style={{ flex: 1 }}
                    >
                        Close
                    </button>
                </div>

                {/* Info */}
                <div style={{
                    marginTop: 'var(--space-lg)',
                    fontSize: '11px',
                    color: 'var(--text-secondary)',
                    textAlign: 'center',
                }}>
                    Share this route with friends and family to help them stay safe
                </div>
            </div>
        </div>
    );
};

export default ShareRouteModal;
