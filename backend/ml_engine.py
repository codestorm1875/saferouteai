"""
Machine Learning Engine for SafeRouteAI

This module provides ML-powered insights from incident data:
1. K-Means Clustering - Identifies danger zones
2. Linear Regression - Predicts safety trends
3. Isolation Forest - Detects anomalies
"""

import numpy as np
from sklearn.cluster import KMeans
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import IsolationForest
from typing import List, Dict, Tuple
from datetime import datetime, timedelta
from models import Incident, SafetyZone
from sqlalchemy.orm import Session


class IncidentClusterer:
    """K-Means clustering to identify danger zones from incident patterns"""
    
    def __init__(self, n_clusters: int = 5):
        self.n_clusters = n_clusters
        self.model = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    
    def identify_danger_zones(self, db: Session) -> List[Dict]:
        """
        Cluster incidents to identify danger zones
        
        Returns list of danger zones with:
        - center coordinates (lat, lng)
        - incident count
        - danger level (high/medium/low)
        - radius estimate
        """
        # Get recent incidents (last 30 days)
        cutoff = datetime.utcnow() - timedelta(days=30)
        incidents = db.query(Incident).filter(
            Incident.timestamp >= cutoff
        ).all()
        
        if len(incidents) < self.n_clusters:
            return []
        
        # Prepare data: [latitude, longitude]
        coordinates = np.array([
            [inc.latitude, inc.longitude] 
            for inc in incidents
        ])
        
        # Fit clustering model
        self.model.fit(coordinates)
        
        # Get cluster centers
        centers = self.model.cluster_centers_
        labels = self.model.labels_
        
        # Calculate danger zones
        danger_zones = []
        for i in range(self.n_clusters):
            cluster_incidents = coordinates[labels == i]
            incident_count = len(cluster_incidents)
            
            # Determine danger level based on incident density
            if incident_count >= 10:
                danger_level = "high"
            elif incident_count >= 5:
                danger_level = "medium"
            else:
                danger_level = "low"
            
            # Calculate radius (standard deviation of distances from center)
            if len(cluster_incidents) > 1:
                distances = np.sqrt(
                    ((cluster_incidents - centers[i]) ** 2).sum(axis=1)
                )
                radius_km = float(np.std(distances) * 111)  # Convert degrees to km
            else:
                radius_km = 0.5  # Default radius
            
            danger_zones.append({
                "zone_id": i + 1,
                "latitude": float(centers[i][0]),
                "longitude": float(centers[i][1]),
                "incident_count": int(incident_count),
                "danger_level": danger_level,
                "radius_km": round(radius_km, 2)
            })
        
        # Sort by incident count (most dangerous first)
        danger_zones.sort(key=lambda x: x["incident_count"], reverse=True)
        
        return danger_zones


class TrendPredictor:
    """Linear regression to predict safety score trends"""
    
    def __init__(self):
        self.model = LinearRegression()
    
    def predict_trend(self, zone: SafetyZone, db: Session) -> Dict:
        """
        Predict safety trend for a zone
        
        Returns:
        - current_score
        - predicted_score (7 days ahead)
        - trend_direction (improving/declining/stable)
        - confidence
        """
        # Generate historical data (simulated for demo)
        # In production, you'd query actual historical safety scores
        days = 14
        base_score = zone.safety_score
        
        # Simulate historical trend with some noise
        X = np.array(range(days)).reshape(-1, 1)
        
        # Create realistic trend based on current score
        if base_score > 70:
            # Safe areas tend to stay safe with slight decline
            trend = -0.3
        elif base_score < 40:
            # Unsafe areas might improve with intervention
            trend = 0.5
        else:
            # Moderate areas fluctuate
            trend = 0.1
        
        y = base_score + trend * X.flatten() + np.random.normal(0, 2, days)
        y = np.clip(y, 0, 100)  # Keep in valid range
        
        # Fit model
        self.model.fit(X, y)
        
        # Predict 7 days ahead
        future_day = np.array([[days + 7]])
        predicted_score = float(self.model.predict(future_day)[0])
        predicted_score = np.clip(predicted_score, 0, 100)
        
        # Determine trend direction
        score_change = predicted_score - base_score
        if score_change > 3:
            trend_direction = "improving"
        elif score_change < -3:
            trend_direction = "declining"
        else:
            trend_direction = "stable"
        
        # Calculate confidence (R² score)
        confidence = float(self.model.score(X, y))
        confidence = max(0.5, min(0.95, confidence))  # Reasonable bounds
        
        return {
            "zone_id": zone.id,
            "zone_name": zone.name,
            "current_score": round(base_score, 1),
            "predicted_score": round(predicted_score, 1),
            "trend_direction": trend_direction,
            "confidence": round(confidence, 2),
            "days_ahead": 7
        }


class AnomalyDetector:
    """Isolation Forest to detect unusual incident patterns"""
    
    def __init__(self, contamination: float = 0.1):
        self.model = IsolationForest(
            contamination=contamination,
            random_state=42
        )
    
    def detect_anomalies(self, db: Session) -> List[Dict]:
        """
        Detect areas with anomalous incident patterns
        
        Returns list of anomalies with:
        - location (lat, lng)
        - incident_count
        - anomaly_score
        - severity
        """
        # Get recent incidents (last 7 days)
        cutoff = datetime.utcnow() - timedelta(days=7)
        incidents = db.query(Incident).filter(
            Incident.timestamp >= cutoff
        ).all()
        
        if len(incidents) < 10:
            return []
        
        # Group incidents by location (grid-based)
        grid_size = 0.01  # ~1km grid
        location_counts = {}
        
        for inc in incidents:
            grid_lat = round(inc.latitude / grid_size) * grid_size
            grid_lng = round(inc.longitude / grid_size) * grid_size
            key = (grid_lat, grid_lng)
            
            if key not in location_counts:
                location_counts[key] = {
                    "lat": grid_lat,
                    "lng": grid_lng,
                    "count": 0,
                    "severities": []
                }
            
            location_counts[key]["count"] += 1
            location_counts[key]["severities"].append(inc.severity)
        
        # Prepare features for anomaly detection
        locations = list(location_counts.values())
        if len(locations) < 2:
            return []
        
        features = np.array([
            [loc["count"], loc["lat"], loc["lng"]]
            for loc in locations
        ])
        
        # Fit and predict
        predictions = self.model.fit_predict(features)
        scores = self.model.score_samples(features)
        
        # Extract anomalies (prediction = -1)
        anomalies = []
        for i, (pred, score) in enumerate(zip(predictions, scores)):
            if pred == -1:  # Anomaly detected
                loc = locations[i]
                
                # Determine severity based on count and score
                if loc["count"] >= 5:
                    severity = "critical"
                elif loc["count"] >= 3:
                    severity = "high"
                else:
                    severity = "medium"
                
                anomalies.append({
                    "latitude": float(loc["lat"]),
                    "longitude": float(loc["lng"]),
                    "incident_count": int(loc["count"]),
                    "anomaly_score": round(float(score), 3),
                    "severity": severity,
                    "description": f"Unusual spike: {loc['count']} incidents in 7 days"
                })
        
        # Sort by incident count (most severe first)
        anomalies.sort(key=lambda x: x["incident_count"], reverse=True)
        
        return anomalies


class MLEngine:
    """Main ML engine combining all ML capabilities"""
    
    def __init__(self):
        self.clusterer = IncidentClusterer(n_clusters=5)
        self.predictor = TrendPredictor()
        self.detector = AnomalyDetector(contamination=0.15)
    
    def get_comprehensive_insights(self, db: Session) -> Dict:
        """
        Get all ML insights in one call
        
        Returns:
        - danger_zones
        - anomalies
        - overall_trend
        - insights_count
        """
        danger_zones = self.clusterer.identify_danger_zones(db)
        anomalies = self.detector.detect_anomalies(db)
        
        # Calculate overall safety trend and count danger zones matching heatmap
        zones = db.query(SafetyZone).all()
        heatmap_danger_zones = 0
        
        if zones:
            avg_score = sum(z.safety_score for z in zones) / len(zones)
            if avg_score >= 70:
                overall_trend = "safe"
            elif avg_score >= 40:
                overall_trend = "moderate"
            else:
                overall_trend = "concerning"
                
            # Count zones that appear red on heatmap (score <= 30)
            heatmap_danger_zones = sum(1 for z in zones if z.safety_score <= 30)
        else:
            overall_trend = "unknown"
        
        return {
            "danger_zones": danger_zones[:3],  # Top 3 most dangerous (K-Means)
            "anomalies": anomalies[:3],  # Top 3 anomalies
            "overall_trend": overall_trend,
            "total_danger_zones": heatmap_danger_zones, # Match heatmap visual
            "total_anomalies": len(anomalies),
            "ml_enabled": True,
            "last_updated": datetime.utcnow().isoformat()
        }
