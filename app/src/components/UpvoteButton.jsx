import React, { useState } from 'react';
import { ThumbsUp, CheckCircle } from 'lucide-react';

const UpvoteButton = ({ incident, onUpvote, isUpvoted }) => {
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClick = async () => {
        if (isUpvoted) return;

        setIsAnimating(true);
        await onUpvote(incident.id);
        setTimeout(() => setIsAnimating(false), 600);
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
        }}>
            <button
                onClick={handleClick}
                disabled={isUpvoted}
                style={{
                    background: isUpvoted ? 'var(--primary)20' : 'transparent',
                    border: `1.5px solid ${isUpvoted ? 'var(--primary)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '6px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: isUpvoted ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: isUpvoted ? 'var(--primary)' : 'var(--text-secondary)',
                    transform: isAnimating ? 'scale(1.1)' : 'scale(1)',
                }}
                onMouseEnter={(e) => {
                    if (!isUpvoted) {
                        e.currentTarget.style.borderColor = 'var(--primary)';
                        e.currentTarget.style.color = 'var(--primary)';
                    }
                }}
                onMouseLeave={(e) => {
                    if (!isUpvoted) {
                        e.currentTarget.style.borderColor = 'var(--border)';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                }}
            >
                <ThumbsUp size={14} fill={isUpvoted ? 'currentColor' : 'none'} />
                <span>{incident.upvotes || 0}</span>
            </button>

            {incident.verified && (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 8px',
                        background: '#10b98120',
                        border: '1px solid #10b981',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: '#10b981',
                    }}
                >
                    <CheckCircle size={12} />
                    Verified
                </div>
            )}
        </div>
    );
};

export default UpvoteButton;
