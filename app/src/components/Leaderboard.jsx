import React from 'react';
import { Trophy, Award, Medal } from 'lucide-react';

const Leaderboard = ({ leaderboard, currentUserId }) => {
    const getRankIcon = (rank) => {
        if (rank === 1) return <Trophy size={20} color="#FFD700" />;
        if (rank === 2) return <Medal size={20} color="#C0C0C0" />;
        if (rank === 3) return <Medal size={20} color="#CD7F32" />;
        return null;
    };

    const getRankColor = (rank) => {
        if (rank === 1) return '#FFD700';
        if (rank === 2) return '#C0C0C0';
        if (rank === 3) return '#CD7F32';
        return 'var(--text-secondary)';
    };

    if (!leaderboard || leaderboard.length === 0) {
        return (
            <div className="glass-panel" style={{
                textAlign: 'center',
                padding: 'var(--space-xl)',
                color: 'var(--text-secondary)',
            }}>
                <Award size={32} style={{ margin: '0 auto var(--space-sm)', opacity: 0.5 }} />
                <p style={{ margin: 0, fontSize: '13px' }}>
                    No leaderboard data yet
                </p>
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-sm)',
        }}>
            {leaderboard.map((entry) => {
                const isCurrentUser = entry.user_id === currentUserId;
                const rankIcon = getRankIcon(entry.rank);
                const rankColor = getRankColor(entry.rank);

                return (
                    <div
                        key={entry.user_id}
                        className="glass-panel"
                        style={{
                            padding: 'var(--space-md)',
                            background: isCurrentUser ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-glass)',
                            border: isCurrentUser ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--bg-glass-border)',
                            boxShadow: isCurrentUser ? '0 0 15px rgba(16, 185, 129, 0.1)' : 'none',
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-md)',
                        }}>
                            {/* Rank */}
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: 'var(--radius-md)',
                                background: entry.rank <= 3 ? `${rankColor}20` : 'rgba(255, 255, 255, 0.05)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                border: entry.rank <= 3 ? `1px solid ${rankColor}40` : 'none',
                                boxShadow: entry.rank <= 3 ? `0 0 10px ${rankColor}20` : 'none',
                            }}>
                                {rankIcon || (
                                    <span style={{
                                        fontSize: '16px',
                                        fontWeight: '700',
                                        color: 'var(--text-primary)',
                                        fontFamily: 'Outfit, sans-serif'
                                    }}>
                                        {entry.rank}
                                    </span>
                                )}
                            </div>

                            {/* User Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginBottom: '4px',
                                }}>
                                    <h3 style={{
                                        fontSize: '15px',
                                        fontWeight: '600',
                                        color: 'var(--text-primary)',
                                        margin: 0,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        fontFamily: 'Outfit, sans-serif'
                                    }}>
                                        {entry.username}
                                    </h3>
                                    {isCurrentUser && (
                                        <span style={{
                                            fontSize: '10px',
                                            fontWeight: '600',
                                            color: 'var(--primary)',
                                            background: 'rgba(16, 185, 129, 0.2)',
                                            padding: '2px 6px',
                                            borderRadius: 'var(--radius-sm)',
                                            border: '1px solid rgba(16, 185, 129, 0.3)'
                                        }}>
                                            YOU
                                        </span>
                                    )}
                                </div>

                                <div style={{
                                    display: 'flex',
                                    gap: 'var(--space-md)',
                                    fontSize: '12px',
                                    color: 'var(--text-muted)',
                                }}>
                                    <span>📊 {entry.total_reports} reports</span>
                                    <span>👍 {entry.total_upvotes_received} upvotes</span>
                                </div>
                            </div>

                            {/* Reputation Score */}
                            <div style={{
                                textAlign: 'right',
                                flexShrink: 0,
                            }}>
                                <div style={{
                                    fontSize: '20px',
                                    fontWeight: '700',
                                    color: rankColor,
                                    textShadow: `0 0 10px ${rankColor}40`,
                                    fontFamily: 'Outfit, sans-serif'
                                }}>
                                    {entry.reputation_score}
                                </div>
                                <div style={{
                                    fontSize: '10px',
                                    color: 'var(--text-muted)',
                                    marginTop: '2px',
                                }}>
                                    points
                                </div>
                            </div>
                        </div>

                        {/* Badges */}
                        {entry.badges && entry.badges.length > 0 && (
                            <div style={{
                                marginTop: 'var(--space-sm)',
                                display: 'flex',
                                gap: '4px',
                                flexWrap: 'wrap',
                            }}>
                                {entry.badges.map((badge, index) => (
                                    <span
                                        key={index}
                                        style={{
                                            fontSize: '10px',
                                            fontWeight: '600',
                                            color: 'var(--primary)',
                                            background: 'rgba(16, 185, 129, 0.1)',
                                            padding: '2px 6px',
                                            borderRadius: 'var(--radius-sm)',
                                            border: '1px solid rgba(16, 185, 129, 0.2)'
                                        }}
                                    >
                                        {badge}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default Leaderboard;
