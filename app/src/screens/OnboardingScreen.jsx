import React, { useState } from 'react';
import { ChevronRight, Shield, MapPin, Users, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OnboardingScreen = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();

    const slides = [
        {
            icon: Shield,
            iconColor: '#ef4444',
            title: 'Stay Safe in Lagos',
            subtitle: 'Real-time safety navigation powered by community',
            description: 'Navigate Lagos with confidence using AI-powered safety scores and community-driven incident reports.',
            gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        },
        {
            icon: MapPin,
            iconColor: '#10b981',
            title: 'Smart Route Planning',
            subtitle: 'Choose safety over speed',
            description: 'Compare safe routes vs fast routes. Get real-time safety scores for every journey across Lagos.',
            gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        },
        {
            icon: Users,
            iconColor: '#3b82f6',
            title: 'Community Powered',
            subtitle: 'Report. Share. Protect.',
            description: 'Join thousands reporting incidents in real-time. Your reports help keep the community safe.',
            gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        },
        {
            icon: Target,
            iconColor: '#f59e0b',
            title: 'UN SDG Aligned',
            subtitle: 'Building Sustainable Cities',
            description: 'Contributing to SDG 11 (Sustainable Cities) and SDG 16 (Peace & Justice) through data-driven safety.',
            gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            isLast: true,
        },
    ];

    const currentSlideData = slides[currentSlide];
    const Icon = currentSlideData.icon;

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            // Save onboarding completion to localStorage
            localStorage.setItem('saferouteai_onboarding_complete', 'true');
            navigate('/');
        }
    };

    const handleSkip = () => {
        localStorage.setItem('saferouteai_onboarding_complete', 'true');
        navigate('/');
    };

    return (
        <div className="screen" style={{
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            background: 'var(--bg-primary)'
        }}>
            {/* Background Gradient */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '40%',
                background: currentSlideData.gradient,
                opacity: 0.1,
                transition: 'all 0.5s ease'
            }} />

            {/* Skip Button */}
            <button
                onClick={handleSkip}
                style={{
                    position: 'absolute',
                    top: 'var(--space-xl)',
                    right: 'var(--space-xl)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    padding: 'var(--space-sm) var(--space-md)',
                    borderRadius: 'var(--radius-md)',
                    transition: 'all 0.2s',
                    zIndex: 10
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bg-card)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-muted)';
                }}
            >
                Skip
            </button>

            {/* Content */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'var(--space-2xl)',
                position: 'relative',
                zIndex: 1
            }}>
                {/* Icon */}
                <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: currentSlideData.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 'var(--space-xl)',
                    boxShadow: `0 20px 60px ${currentSlideData.iconColor}40`,
                    animation: 'slideIn 0.5s ease',
                    transition: 'all 0.5s ease'
                }}>
                    <Icon size={48} color="white" />
                </div>

                {/* Title */}
                <h1 style={{
                    fontSize: '28px',
                    fontWeight: '900',
                    color: 'var(--text-primary)',
                    marginBottom: 'var(--space-sm)',
                    textAlign: 'center',
                    animation: 'slideIn 0.5s ease 0.1s backwards'
                }}>
                    {currentSlideData.title}
                </h1>

                {/* Subtitle */}
                <p style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    color: currentSlideData.iconColor,
                    marginBottom: 'var(--space-md)',
                    textAlign: 'center',
                    animation: 'slideIn 0.5s ease 0.2s backwards'
                }}>
                    {currentSlideData.subtitle}
                </p>

                {/* Description */}
                <p style={{
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    textAlign: 'center',
                    lineHeight: '1.7',
                    maxWidth: '350px',
                    marginBottom: 'var(--space-xl)',
                    animation: 'slideIn 0.5s ease 0.3s backwards'
                }}>
                    {currentSlideData.description}
                </p>

                {/* Progress Dots */}
                <div style={{
                    display: 'flex',
                    gap: 'var(--space-sm)',
                    marginBottom: 'var(--space-2xl)'
                }}>
                    {slides.map((_, index) => (
                        <div
                            key={index}
                            style={{
                                width: currentSlide === index ? '32px' : '8px',
                                height: '8px',
                                borderRadius: '4px',
                                background: currentSlide === index ? currentSlideData.iconColor : 'var(--border)',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}
                            onClick={() => setCurrentSlide(index)}
                        />
                    ))}
                </div>

                {/* Next/Get Started Button */}
                <button
                    onClick={handleNext}
                    style={{
                        background: currentSlideData.gradient,
                        border: 'none',
                        color: 'white',
                        fontSize: '15px',
                        fontWeight: '700',
                        padding: 'var(--space-md) var(--space-2xl)',
                        borderRadius: 'var(--radius-full)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-sm)',
                        boxShadow: `0 10px 30px ${currentSlideData.iconColor}40`,
                        transition: 'all 0.3s ease',
                        animation: 'slideIn 0.5s ease 0.4s backwards'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = `0 15px 40px ${currentSlideData.iconColor}60`;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = `0 10px 30px ${currentSlideData.iconColor}40`;
                    }}
                >
                    {currentSlideData.isLast ? 'Get Started' : 'Next'}
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Animations */}
            <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
    );
};

export default OnboardingScreen;
