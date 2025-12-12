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
            <div className="card" style={{
                textAlign: 'center',
                padding: 'var(--space-xl)',
                color: 'var(--text-secondary)',
            }}>
                <Award size={32} style={{ margin: '0 auto var(--space-sm)' }} />
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

                return (
                    <div
                        key={entry.user_id}
                        className="card"
                        style={{
                            padding: 'var(--space-md)',
                            background: isCurrentUser ? 'var(--primary)15' : 'var(--card-bg)',
                            border: isCurrentUser ? '2px solid var(--primary)' : '1.5px solid var(--border)',
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
                                background: entry.rank <= 3 ? `${getRankColor(entry.rank)}20` : 'var(--border)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}>
                                {rankIcon || (
                                    <span style={{
                                        fontSize: '16px',
                                        fontWeight: '700',
                                        color: 'var(--text-primary)',
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
                                    }}>
                                        {entry.username}
                                    </h3>
                                    {isCurrentUser && (
                                        <span style={{
                                            fontSize: '10px',
                                            fontWeight: '600',
                                            color: 'var(--primary)',
                                            background: 'var(--primary)20',
                                            padding: '2px 6px',
                                            borderRadius: 'var(--radius-sm)',
                                        }}>
                                            YOU
                                        </span>
                                    )}
                                </div>

                                <div style={{
                                    display: 'flex',
                                    gap: 'var(--space-md)',
                                    fontSize: '12px',
                                    color: 'var(--text-secondary)',
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
                                    color: getRankColor(entry.rank),
                                }}>
                                    {entry.reputation_score}
                                </div>
                                <div style={{
                                    fontSize: '10px',
                                    color: 'var(--text-secondary)',
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
                                            background: 'var(--primary)15',
                                            padding: '2px 6px',
                                            borderRadius: 'var(--radius-sm)',
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
