import math
from typing import List
from models import Incident
from datetime import datetime, timedelta

class SafetyScoreEngine:
    """Rule-based safety scoring engine"""
    
    # Weight factors for different parameters
    WEIGHTS = {
        "traffic": 0.15,
        "lighting": 0.25,
        "crowd": 0.10,
        "weather": 0.15,
        "incidents": 0.25,
        "police": 0.10
    }
    
    @staticmethod
    def calculate_score(
        traffic: float,
        lighting: float,
        crowd: float,
        weather: str,
        incidents_nearby: int,
        police_distance: float
    ) -> tuple[float, str, dict]:
        """
        Calculate safety score from 0-100
        Returns: (score, risk_level, factors_breakdown)
        """
        
        # Traffic score (lower traffic = safer)
        traffic_score = 100 - traffic
        
        # Lighting score (higher lighting = safer)
        lighting_score = lighting
        
        # Crowd score (moderate crowd is safest)
        if crowd < 30:
            crowd_score = 60  # Too empty can be unsafe
        elif crowd < 70:
            crowd_score = 100  # Moderate crowd is safe
        else:
            crowd_score = 70  # Too crowded can be risky
        
        # Weather score
        weather_scores = {
            "clear": 100,
            "cloudy": 85,
            "rainy": 60,
            "stormy": 30,
            "foggy": 40
        }
        weather_score = weather_scores.get(weather.lower(), 70)
        
        # Incident score (more recent incidents = less safe)
        incident_score = max(0, 100 - (incidents_nearby * 15))
        
        # Police proximity score (closer police = safer)
        if police_distance < 500:
            police_score = 100
        elif police_distance < 1000:
            police_score = 80
        elif police_distance < 2000:
            police_score = 60
        else:
            police_score = 40
        
        # Calculate weighted final score
        final_score = (
            traffic_score * SafetyScoreEngine.WEIGHTS["traffic"] +
            lighting_score * SafetyScoreEngine.WEIGHTS["lighting"] +
            crowd_score * SafetyScoreEngine.WEIGHTS["crowd"] +
            weather_score * SafetyScoreEngine.WEIGHTS["weather"] +
            incident_score * SafetyScoreEngine.WEIGHTS["incidents"] +
            police_score * SafetyScoreEngine.WEIGHTS["police"]
        )
        
        # Determine risk level
        if final_score >= 71:
            risk_level = "low"
        elif final_score >= 31:
            risk_level = "medium"
        else:
            risk_level = "high"
        
        factors = {
            "traffic": round(traffic_score, 1),
            "lighting": round(lighting_score, 1),
            "crowd": round(crowd_score, 1),
            "weather": round(weather_score, 1),
            "incidents": round(incident_score, 1),
            "police": round(police_score, 1)
        }
        
        return round(final_score, 2), risk_level, factors
    
    @staticmethod
    def count_nearby_incidents(
        db,
        latitude: float,
        longitude: float,
        radius_km: float = 1.0,
        hours: int = 24
    ) -> int:
        """Count incidents within radius in last N hours"""
        cutoff_time = datetime.utcnow() - timedelta(hours=hours)
        
        incidents = db.query(Incident).filter(
            Incident.timestamp >= cutoff_time
        ).all()
        
        count = 0
        for incident in incidents:
            distance = SafetyScoreEngine.haversine_distance(
                latitude, longitude,
                incident.latitude, incident.longitude
            )
            if distance <= radius_km:
                count += 1
        
        return count
    
    @staticmethod
    def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculate distance between two points in kilometers"""
        R = 6371  # Earth's radius in kilometers
        
        lat1_rad = math.radians(lat1)
        lat2_rad = math.radians(lat2)
        delta_lat = math.radians(lat2 - lat1)
        delta_lon = math.radians(lon2 - lon1)
        
        a = (math.sin(delta_lat / 2) ** 2 +
             math.cos(lat1_rad) * math.cos(lat2_rad) *
             math.sin(delta_lon / 2) ** 2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        
        return R * c
