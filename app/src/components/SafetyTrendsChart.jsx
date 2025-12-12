import React, { useEffect, useRef } from 'react';

const SafetyTrendsChart = ({ trends, zoneName }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!trends || trends.length === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Group by date and calculate daily averages
        const dailyData = {};
        trends.forEach(point => {
            if (!dailyData[point.date]) {
                dailyData[point.date] = [];
            }
            dailyData[point.date].push(point.safety_score);
        });

        const dates = Object.keys(dailyData).sort();
        const avgScores = dates.map(date => {
            const scores = dailyData[date];
            return scores.reduce((a, b) => a + b, 0) / scores.length;
        });

        // Chart dimensions
        const padding = 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;

        // Find min/max for scaling
        const maxScore = 100;
        const minScore = 0;

        // Draw grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = padding + (chartHeight / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();

            // Y-axis labels
            const score = maxScore - (maxScore - minScore) * (i / 4);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.font = '11px Inter, sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(score.toFixed(0), padding - 8, y + 4);
        }

        // Draw line chart
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        avgScores.forEach((score, index) => {
            const x = padding + (chartWidth / (avgScores.length - 1)) * index;
            const y = padding + chartHeight - ((score - minScore) / (maxScore - minScore)) * chartHeight;

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();

        // Draw data points
        avgScores.forEach((score, index) => {
            const x = padding + (chartWidth / (avgScores.length - 1)) * index;
            const y = padding + chartHeight - ((score - minScore) / (maxScore - minScore)) * chartHeight;

            // Point color based on score
            let color = '#10b981'; // Green
            if (score < 31) color = '#ef4444'; // Red
            else if (score < 71) color = '#f59e0b'; // Yellow

            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();

            // White border
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 2;
            ctx.stroke();
        });

        // Draw X-axis labels (dates)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'center';
        dates.forEach((date, index) => {
            const x = padding + (chartWidth / (dates.length - 1)) * index;
            const shortDate = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            ctx.fillText(shortDate, x, height - padding + 20);
        });

        // Draw color zones in background
        ctx.globalAlpha = 0.1;

        // Red zone (0-30)
        ctx.fillStyle = '#ef4444';
        const redHeight = (30 / maxScore) * chartHeight;
        ctx.fillRect(padding, height - padding - redHeight, chartWidth, redHeight);

        // Yellow zone (31-70)
        ctx.fillStyle = '#f59e0b';
        const yellowHeight = (40 / maxScore) * chartHeight;
        ctx.fillRect(padding, height - padding - redHeight - yellowHeight, chartWidth, yellowHeight);

        // Green zone (71-100)
        ctx.fillStyle = '#10b981';
        const greenHeight = (30 / maxScore) * chartHeight;
        ctx.fillRect(padding, padding, chartWidth, greenHeight);

        ctx.globalAlpha = 1.0;

    }, [trends]);

    if (!trends || trends.length === 0) {
        return (
            <div style={{
                height: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                fontSize: '14px'
            }}>
                No trend data available
            </div>
        );
    }

    return (
        <div style={{ position: 'relative' }}>
            <canvas
                ref={canvasRef}
                width={800}
                height={300}
                style={{
                    width: '100%',
                    height: 'auto',
                    maxWidth: '100%',
                }}
            />
        </div>
    );
};

export default SafetyTrendsChart;
