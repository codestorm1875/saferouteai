from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class IncidentCreate(BaseModel):
    type: str
    description: Optional[str] = None
    latitude: float
    longitude: float
    severity: Optional[str] = "medium"
    user_id: Optional[str] = None

class IncidentResponse(BaseModel):
    id: int
    type: str
    description: Optional[str]
    latitude: float
    longitude: float
    timestamp: datetime
    severity: str
    upvotes: int
    verified: bool
    upvoted_by: List[str]
    
    class Config:
        from_attributes = True

class IncidentUpvoteRequest(BaseModel):
    user_id: str

class SafetyPredictRequest(BaseModel):
    latitude: float
    longitude: float
    traffic: Optional[float] = 50.0
    lighting: Optional[float] = 50.0
    crowd: Optional[float] = 50.0
    weather: Optional[str] = "clear"
    police_distance: Optional[float] = 1000.0

class SafetyPredictResponse(BaseModel):
    score: float
    risk_level: str
    factors: dict

class SafetyZoneResponse(BaseModel):
    id: int
    name: str
    latitude: float
    longitude: float
    radius: float
    safety_score: float
    
    class Config:
        from_attributes = True

class SensorDataCreate(BaseModel):
    sensor_id: str
    latitude: float
    longitude: float
    brightness: float

class RouteRequest(BaseModel):
    start_lat: float
    start_lng: float
    end_lat: float
    end_lng: float
    risk_tolerance: Optional[str] = "balanced"  # cautious, balanced, fast

class RouteResponse(BaseModel):
    safe_route: List[dict]
    fast_route: List[dict]
    safe_score: float
    fast_score: float
    recommendation: str

class TrendDataPoint(BaseModel):
    date: str
    safety_score: float
    time_of_day: str  # day or night

class TrendsResponse(BaseModel):
    zone_id: int
    zone_name: str
    trends: List[TrendDataPoint]
    average_score: float
    min_score: float
    max_score: float
    trend_direction: str  # improving, declining, stable

class ZoneSearchResponse(BaseModel):
    id: int
    name: str
    latitude: float
    longitude: float
    safety_score: float
    
    class Config:
        from_attributes = True

class UserProfileCreate(BaseModel):
    user_id: str
    username: str

class UserProfileResponse(BaseModel):
    id: int
    user_id: str
    username: str
    total_reports: int
    total_upvotes_received: int
    reputation_score: int
    badges: List[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

class LeaderboardEntry(BaseModel):
    rank: int
    user_id: str
    username: str
    total_reports: int
    total_upvotes_received: int
    reputation_score: int
    badges: List[str]

class LeaderboardResponse(BaseModel):
    leaderboard: List[LeaderboardEntry]
    total_users: int

# ML Response Schemas

class DangerZone(BaseModel):
    zone_id: int
    latitude: float
    longitude: float
    incident_count: int
    danger_level: str  # high, medium, low
    radius_km: float

class DangerZonesResponse(BaseModel):
    danger_zones: List[DangerZone]
    total_zones: int
    analysis_period_days: int

class TrendPrediction(BaseModel):
    zone_id: int
    zone_name: str
    current_score: float
    predicted_score: float
    trend_direction: str  # improving, declining, stable
    confidence: float
    days_ahead: int

class Anomaly(BaseModel):
    latitude: float
    longitude: float
    incident_count: int
    anomaly_score: float
    severity: str  # critical, high, medium
    description: str

class AnomaliesResponse(BaseModel):
    anomalies: List[Anomaly]
    total_anomalies: int
    detection_period_days: int

class MLInsightsResponse(BaseModel):
    danger_zones: List[DangerZone]
    anomalies: List[Anomaly]
    overall_trend: str  # safe, moderate, concerning
    total_danger_zones: int
    total_anomalies: int
    ml_enabled: bool
    last_updated: str
