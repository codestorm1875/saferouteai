from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import random
from datetime import datetime

from database import engine, get_db, Base
from models import Incident, SafetyZone, SensorData, UserProfile
from schemas import (
    IncidentCreate, IncidentResponse, IncidentUpvoteRequest,
    SafetyPredictRequest, SafetyPredictResponse,
    SafetyZoneResponse, SensorDataCreate,
    RouteRequest, RouteResponse,
    TrendDataPoint, TrendsResponse, ZoneSearchResponse,
    UserProfileCreate, UserProfileResponse,
    LeaderboardEntry, LeaderboardResponse,
    DangerZonesResponse, TrendPrediction, AnomaliesResponse, MLInsightsResponse
)
from safety_engine import SafetyScoreEngine
from data_generator import generate_all_data
from ml_engine import MLEngine

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize ML Engine
ml_engine = MLEngine()

# API metadata for Swagger documentation
app = FastAPI(
    title="SafeRouteAI API",
    description="""
## 🛡️ SafeRouteAI - Real-time Safety Navigation for Lagos

This API provides real-time safety scoring and navigation services for Lagos, Nigeria.

### Features

* **Safety Scoring**: AI-powered safety score calculation (0-100) based on multiple factors
* **Heatmap Data**: Real-time safety zones across Lagos with color-coded risk levels
* **Incident Reporting**: Community-driven incident reporting system
* **Safe Routing**: Calculate safest routes between two points
* **IoT Integration**: Simulated sensor data for lighting conditions

### Safety Score Factors

The scoring algorithm considers:
- 🚗 **Traffic** (15%): Lower traffic = safer
- 💡 **Lighting** (25%): Better lighting = safer  
- 👥 **Crowd Density** (10%): Moderate crowd is optimal
- 🌤️ **Weather** (15%): Clear weather is safest
- 🚨 **Recent Incidents** (25%): Fewer incidents = safer
- 👮 **Police Proximity** (10%): Closer police = safer

### Risk Levels

- 🟢 **Safe** (71-100): Low risk, recommended
- 🟡 **Moderate** (31-70): Medium risk, use caution
- 🔴 **Unsafe** (0-30): High risk, avoid if possible

---
Built for Lagos Hackathon 2024
    """,
    version="1.0.0",
    contact={
        "name": "SafeRouteAI Team",
        "url": "https://github.com/saferouteai",
    },
    license_info={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT",
    },
    openapi_tags=[
        {
            "name": "Health",
            "description": "API health check and information"
        },
        {
            "name": "Safety Scoring",
            "description": "Calculate safety scores for locations and routes"
        },
        {
            "name": "Heatmap",
            "description": "Get safety zone data for map visualization"
        },
        {
            "name": "Incidents",
            "description": "Report and retrieve safety incidents"
        },
        {
            "name": "IoT Sensors",
            "description": "Submit simulated IoT sensor data"
        },
        {
            "name": "Machine Learning",
            "description": "AI-powered insights and predictions"
        },
    ]
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize data on startup
@app.on_event("startup")
async def startup_event():
    db = next(get_db())
    
    # Check if data already exists
    existing_zones = db.query(SafetyZone).count()
    if existing_zones == 0:
        print("🔄 Generating initial data...")
        db.close()  # Close before generate_all_data creates its own session
        generate_all_data()
    else:
        print(f"✅ Database already has {existing_zones} zones")
        db.close()

@app.get(
    "/",
    tags=["Health"],
    summary="API Information",
    description="Get basic API information and available endpoints"
)
async def root():
    """
    Returns API metadata and list of available endpoints.
    
    This is the root endpoint that provides an overview of the API.
    """
    return {
        "message": "SafeRouteAI API - Real-time Safety Navigation for Lagos",
        "version": "1.0.0",
        "status": "operational",
        "documentation": "/docs",
        "endpoints": {
            "predict": "POST /predict - Calculate safety score",
            "heatmap": "GET /heatmap - Get safety zones",
            "incident": "POST /incident - Report incident",
            "incidents": "GET /incidents - Get incident feed",
            "sensor": "POST /sensor - Submit sensor data",
            "safe_route": "POST /safe-route - Calculate safe route"
        }
    }

@app.post(
    "/predict",
    response_model=SafetyPredictResponse,
    tags=["Safety Scoring"],
    summary="Calculate Safety Score",
    description="Calculate a safety score (0-100) for a specific location based on multiple factors"
)
async def predict_safety(
    request: SafetyPredictRequest,
    db: Session = Depends(get_db)
):
    """
    Calculate safety score for a given location.
    
    The algorithm considers:
    - Traffic levels
    - Lighting conditions
    - Crowd density
    - Weather conditions
    - Recent incidents nearby
    - Distance to nearest police station
    
    Returns a score from 0-100 and risk level classification.
    
    **Example Request:**
    ```json
    {
        "latitude": 6.5244,
        "longitude": 3.3792,
        "traffic": 45.0,
        "lighting": 80.0,
        "crowd": 60.0,
        "weather": "clear",
        "police_distance": 800.0
    }
    ```
    """
    
    # Count nearby incidents
    incidents_count = SafetyScoreEngine.count_nearby_incidents(
        db, request.latitude, request.longitude, radius_km=1.0
    )
    
    # Calculate score
    score, risk_level, factors = SafetyScoreEngine.calculate_score(
        request.traffic,
        request.lighting,
        request.crowd,
        request.weather,
        incidents_count,
        request.police_distance
    )
    
    return SafetyPredictResponse(
        score=score,
        risk_level=risk_level,
        factors=factors
    )

@app.get(
    "/heatmap",
    response_model=List[SafetyZoneResponse],
    tags=["Heatmap"],
    summary="Get Safety Heatmap Data",
    description="Retrieve all safety zones with current scores for map visualization"
)
async def get_heatmap(db: Session = Depends(get_db)):
    """
    Get all safety zones across Lagos for heatmap visualization.
    
    Returns a list of zones with:
    - Geographic coordinates (latitude, longitude)
    - Current safety score (0-100)
    - Zone radius in meters
    - Zone name
    
    **Color Coding:**
    - Green (71-100): Safe zones
    - Yellow (31-70): Moderate risk zones
    - Red (0-30): Unsafe zones
    
    """
    
    zones = db.query(SafetyZone).all()
    return zones

@app.post(
    "/incident",
    response_model=IncidentResponse,
    tags=["Incidents"],
    summary="Report New Incident",
    description="Submit a new safety incident report to help the community stay informed",
    status_code=201
)
async def report_incident(
    incident: IncidentCreate,
    db: Session = Depends(get_db)
):
    """
    Report a new safety incident.
    
    **Incident Types:**
    - robbery
    - accident
    - harassment
    - vandalism
    - suspicious_activity
    - assault
    - theft
    
    **Severity Levels:**
    - low: Minor incident
    - medium: Moderate concern
    - high: Serious incident
    
    **Example Request:**
    ```json
    {
        "type": "robbery",
        "description": "Armed robbery reported near market",
        "latitude": 6.5244,
        "longitude": 3.3792,
        "severity": "high"
    }
    ```
    
    The incident will immediately appear in the feed and affect nearby safety scores.
    """
    
    db_incident = Incident(
        type=incident.type,
        description=incident.description,
        latitude=incident.latitude,
        longitude=incident.longitude,
        severity=incident.severity,
        timestamp=datetime.utcnow()
    )
    
    db.add(db_incident)
    db.commit()
    db.refresh(db_incident)
    
    return db_incident

@app.get(
    "/incidents",
    response_model=List[IncidentResponse],
    tags=["Incidents"],
    summary="Get Incident Feed",
    description="Retrieve recent safety incidents ordered by time"
)
async def get_incidents(
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """
    Get recent safety incidents.
    
    Returns incidents ordered by most recent first.
    
    **Query Parameters:**
    - limit: Maximum number of incidents to return (default: 50)
    
    Use this endpoint to populate the incident feed in real-time.
    """
    
    incidents = db.query(Incident).order_by(
        Incident.timestamp.desc()
    ).limit(limit).all()
    
    return incidents

@app.post(
    "/sensor",
    tags=["IoT Sensors"],
    summary="Submit Sensor Data",
    description="Submit simulated IoT sensor data for lighting conditions"
)
async def submit_sensor_data(
    sensor: SensorDataCreate,
    db: Session = Depends(get_db)
):
    """
    Submit IoT sensor data (simulated).
    
    This endpoint simulates smart city IoT sensors that monitor
    street lighting conditions across Lagos.
    
    **Example Request:**
    ```json
    {
        "sensor_id": "SENSOR_001",
        "latitude": 6.5244,
        "longitude": 3.3792,
        "brightness": 85.5
    }
    ```
    
    **Brightness Scale:**
    - 0-30: Very dark
    - 31-60: Dim
    - 61-100: Well-lit
    """
    
    db_sensor = SensorData(
        sensor_id=sensor.sensor_id,
        latitude=sensor.latitude,
        longitude=sensor.longitude,
        brightness=sensor.brightness,
        timestamp=datetime.utcnow()
    )
    
    db.add(db_sensor)
    db.commit()
    
    return {
        "status": "success",
        "message": f"Sensor data from {sensor.sensor_id} recorded"
    }

@app.post(
    "/safe-route",
    response_model=RouteResponse,
    tags=["Safety Scoring"],
    summary="Calculate Safe Route",
    description="Calculate and compare safe route vs fastest route between two locations"
)
async def calculate_safe_route(
    request: RouteRequest,
    db: Session = Depends(get_db)
):
    """
    Calculate the safest route between two points.
    
    Returns two routes:
    1. **Safe Route**: Optimized for safety (may be longer)
    2. **Fast Route**: Direct route (may pass through risky areas)
    
    Each route includes:
    - Waypoints with coordinates
    - Average safety score
    - Recommendation
    
    **Example Request:**
    ```json
    {
        "start_lat": 6.5244,
        "start_lng": 3.3792,
        "end_lat": 6.4541,
        "end_lng": 3.3947
    }
    ```
    
    **Recommendation Logic:**
    - "safe": Safe route is significantly safer
    - "fast": Fast route is reasonably safe
    - "either": Both routes have similar safety levels
    """
    
    # Get all zones
    zones = db.query(SafetyZone).all()
    
    # Apply risk tolerance to route calculation
    # cautious: prioritize safety (lower traffic, better lighting)
    # balanced: equal weight (default)
    # fast: prioritize speed (accept higher traffic, lower lighting)
    
    risk_tolerance = request.risk_tolerance.lower()
    
    if risk_tolerance == "cautious":
        safe_traffic_range = (20, 40)
        safe_lighting_range = (70, 95)
        safe_police_range = (300, 1000)
        fast_traffic_range = (50, 80)
        fast_lighting_range = (50, 75)
        fast_police_range = (600, 1800)
    elif risk_tolerance == "fast":
        safe_traffic_range = (40, 70)
        safe_lighting_range = (50, 80)
        safe_police_range = (500, 1500)
        fast_traffic_range = (70, 95)
        fast_lighting_range = (30, 60)
        fast_police_range = (1000, 2500)
    else:  # balanced
        safe_traffic_range = (30, 60)
        safe_lighting_range = (60, 90)
        safe_police_range = (500, 1500)
        fast_traffic_range = (60, 90)
        fast_lighting_range = (40, 70)
        fast_police_range = (800, 2000)
    
    # Simple route calculation (for demo purposes)
    # In production, you'd use actual routing algorithms
    
    # Create waypoints along the route
    num_waypoints = 5
    safe_waypoints = []
    fast_waypoints = []
    
    for i in range(num_waypoints + 1):
        t = i / num_waypoints
        lat = request.start_lat + t * (request.end_lat - request.start_lat)
        lng = request.start_lng + t * (request.end_lng - request.start_lng)
        
        # For safe route, slightly deviate to safer areas
        if i > 0 and i < num_waypoints:
            # Find nearest safe zone
            best_zone = max(zones, key=lambda z: z.safety_score)
            # Slight deviation towards safer zone (more in cautious mode)
            deviation = 0.15 if risk_tolerance == "cautious" else 0.1
            lat += (best_zone.latitude - lat) * deviation
            lng += (best_zone.longitude - lng) * deviation
        
        safe_waypoints.append({"lat": lat, "lng": lng})
        
        # Fast route is direct
        fast_lat = request.start_lat + t * (request.end_lat - request.start_lat)
        fast_lng = request.start_lng + t * (request.end_lng - request.start_lng)
        fast_waypoints.append({"lat": fast_lat, "lng": fast_lng})
    
    # Calculate average safety scores for both routes
    safe_scores = []
    fast_scores = []
    
    for waypoint in safe_waypoints:
        incidents = SafetyScoreEngine.count_nearby_incidents(
            db, waypoint["lat"], waypoint["lng"], radius_km=0.5
        )
        score, _, _ = SafetyScoreEngine.calculate_score(
            traffic=random.uniform(*safe_traffic_range),
            lighting=random.uniform(*safe_lighting_range),
            crowd=random.uniform(40, 70),
            weather="clear",
            incidents_nearby=incidents,
            police_distance=random.uniform(*safe_police_range)
        )
        safe_scores.append(score)
    
    for waypoint in fast_waypoints:
        incidents = SafetyScoreEngine.count_nearby_incidents(
            db, waypoint["lat"], waypoint["lng"], radius_km=0.5
        )
        score, _, _ = SafetyScoreEngine.calculate_score(
            traffic=random.uniform(*fast_traffic_range),
            lighting=random.uniform(*fast_lighting_range),
            crowd=random.uniform(50, 80),
            weather="clear",
            incidents_nearby=incidents,
            police_distance=random.uniform(*fast_police_range)
        )
        fast_scores.append(score)
    
    avg_safe_score = sum(safe_scores) / len(safe_scores)
    avg_fast_score = sum(fast_scores) / len(fast_scores)
    
    # Adjust recommendation based on risk tolerance
    if risk_tolerance == "cautious":
        recommendation = "safe" if avg_safe_score > avg_fast_score - 5 else "fast"
    elif risk_tolerance == "fast":
        recommendation = "fast" if avg_fast_score > 40 else "safe"
    else:  # balanced
        recommendation = "safe" if avg_safe_score > avg_fast_score else "fast"
        if abs(avg_safe_score - avg_fast_score) < 10:
            recommendation = "either"
    
    return RouteResponse(
        safe_route=safe_waypoints,
        fast_route=fast_waypoints,
        safe_score=round(avg_safe_score, 2),
        fast_score=round(avg_fast_score, 2),
        recommendation=recommendation
    )

@app.get(
    "/trends/{zone_id}",
    response_model=TrendsResponse,
    tags=["Safety Scoring"],
    summary="Get Safety Trends",
    description="Get 7-day historical safety trends for a specific zone"
)
async def get_zone_trends(
    zone_id: int,
    db: Session = Depends(get_db)
):
    """
    Get historical safety trends for a zone.
    
    Returns 7 days of safety data with:
    - Daily safety scores
    - Time of day variations (day/night)
    - Statistical summary (avg, min, max)
    - Trend direction
    
    **Example Response:**
    ```json
    {
        "zone_id": 1,
        "zone_name": "Lekki Phase 1",
        "trends": [
            {"date": "2025-12-05", "safety_score": 78.5, "time_of_day": "day"},
            {"date": "2025-12-05", "safety_score": 65.2, "time_of_day": "night"}
        ],
        "average_score": 72.3,
        "min_score": 58.1,
        "max_score": 82.4,
        "trend_direction": "improving"
    }
    ```
    """
    from datetime import timedelta
    
    # Get the zone
    zone = db.query(SafetyZone).filter(SafetyZone.id == zone_id).first()
    if not zone:
        raise HTTPException(status_code=404, detail="Zone not found")
    
    # Generate 7 days of historical data
    trends = []
    base_score = zone.safety_score
    
    for i in range(7):
        date = (datetime.utcnow() - timedelta(days=6-i)).strftime("%Y-%m-%d")
        
        # Day score (slightly higher)
        day_variation = random.uniform(-5, 5)
        day_score = max(0, min(100, base_score + day_variation))
        trends.append(TrendDataPoint(
            date=date,
            safety_score=round(day_score, 1),
            time_of_day="day"
        ))
        
        # Night score (slightly lower)
        night_variation = random.uniform(-15, -5)
        night_score = max(0, min(100, base_score + night_variation))
        trends.append(TrendDataPoint(
            date=date,
            safety_score=round(night_score, 1),
            time_of_day="night"
        ))
    
    # Calculate statistics
    all_scores = [t.safety_score for t in trends]
    avg_score = sum(all_scores) / len(all_scores)
    min_score = min(all_scores)
    max_score = max(all_scores)
    
    # Determine trend direction
    first_half_avg = sum(all_scores[:7]) / 7
    second_half_avg = sum(all_scores[7:]) / 7
    
    if second_half_avg > first_half_avg + 3:
        trend_direction = "improving"
    elif second_half_avg < first_half_avg - 3:
        trend_direction = "declining"
    else:
        trend_direction = "stable"
    
    return TrendsResponse(
        zone_id=zone.id,
        zone_name=zone.name,
        trends=trends,
        average_score=round(avg_score, 1),
        min_score=round(min_score, 1),
        max_score=round(max_score, 1),
        trend_direction=trend_direction
    )

@app.get(
    "/zone-search",
    response_model=List[ZoneSearchResponse],
    tags=["Heatmap"],
    summary="Search Safety Zones",
    description="Search for zones by name"
)
async def search_zones(
    q: str,
    db: Session = Depends(get_db)
):
    """
    Search for zones by name.
    
    **Query Parameters:**
    - q: Search query (minimum 2 characters)
    
    Returns matching zones with current safety scores.
    
    **Example:**
    GET /zone-search?q=Lekki
    """
    if len(q) < 2:
        raise HTTPException(status_code=400, detail="Query must be at least 2 characters")
    
    zones = db.query(SafetyZone).filter(
        SafetyZone.name.ilike(f"%{q}%")
    ).limit(10).all()
    
    return zones

@app.post(
    "/incident/{incident_id}/upvote",
    response_model=IncidentResponse,
    tags=["Incidents"],
    summary="Upvote Incident",
    description="Upvote an incident to verify its authenticity"
)
async def upvote_incident(
    incident_id: int,
    upvote_request: IncidentUpvoteRequest,
    db: Session = Depends(get_db)
):
    """
    Upvote an incident.
    
    - Increments upvote count
    - Prevents duplicate upvotes from same user
    - Auto-verifies incident if upvotes >= 3
    
    **Example Request:**
    ```json
    {
        "user_id": "user_12345"
    }
    ```
    """
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    # Check if user already upvoted
    upvoted_by = incident.upvoted_by if incident.upvoted_by else []
    if upvote_request.user_id in upvoted_by:
        raise HTTPException(status_code=400, detail="Already upvoted this incident")
    
    # Add upvote
    upvoted_by.append(upvote_request.user_id)
    incident.upvoted_by = upvoted_by
    incident.upvotes += 1
    
    # Auto-verify if upvotes >= 3
    if incident.upvotes >= 3:
        incident.verified = True
    
    db.commit()
    db.refresh(incident)
    
    return incident

@app.get(
    "/leaderboard",
    response_model=LeaderboardResponse,
    tags=["Community"],
    summary="Get Leaderboard",
    description="Get top contributors ranked by reputation"
)
async def get_leaderboard(
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """
    Get leaderboard of top contributors.
    
    Returns users ranked by reputation score.
    
    **Query Parameters:**
    - limit: Number of users to return (default: 10)
    
    **Reputation Calculation:**
    - 10 points per incident report
    - 5 points per upvote received
    """
    users = db.query(UserProfile).order_by(
        UserProfile.reputation_score.desc()
    ).limit(limit).all()
    
    leaderboard = []
    for rank, user in enumerate(users, start=1):
        leaderboard.append(LeaderboardEntry(
            rank=rank,
            user_id=user.user_id,
            username=user.username,
            total_reports=user.total_reports,
            total_upvotes_received=user.total_upvotes_received,
            reputation_score=user.reputation_score,
            badges=user.badges if user.badges else []
        ))
    
    total_users = db.query(UserProfile).count()
    
    return LeaderboardResponse(
        leaderboard=leaderboard,
        total_users=total_users
    )

@app.post(
    "/user/profile",
    response_model=UserProfileResponse,
    tags=["Community"],
    summary="Create/Update User Profile",
    description="Create or update user profile"
)
async def create_or_update_profile(
    profile: UserProfileCreate,
    db: Session = Depends(get_db)
):
    """
    Create or update user profile.
    
    **Example Request:**
    ```json
    {
        "user_id": "user_12345",
        "username": "SafetyChampion"
    }
    ```
    """
    existing = db.query(UserProfile).filter(
        UserProfile.user_id == profile.user_id
    ).first()
    
    if existing:
        existing.username = profile.username
        db.commit()
        db.refresh(existing)
        return existing
    
    new_profile = UserProfile(
        user_id=profile.user_id,
        username=profile.username,
        total_reports=0,
        total_upvotes_received=0,
        reputation_score=0,
        badges=[]
    )
    
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    
    return new_profile

@app.get(
    "/incidents/nearby",
    response_model=List[IncidentResponse],
    tags=["Incidents"],
    summary="Get Nearby Incidents",
    description="Get incidents near a specific location"
)
async def get_nearby_incidents(
    lat: float,
    lng: float,
    radius_km: float = 2.0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """
    Get incidents near a location.
    
    Returns incidents within specified radius.
    """
    incidents = db.query(Incident).all()
    nearby = []
    
    for incident in incidents:
        dist = SafetyScoreEngine.haversine_distance(
            lat, lng, incident.latitude, incident.longitude
        )
        if dist <= radius_km:
            nearby.append(incident)
            
    # Sort by timestamp (newest first)
    nearby.sort(key=lambda x: x.timestamp, reverse=True)
    
    return nearby[:limit]

@app.get(
    "/ml/danger-zones",
    response_model=DangerZonesResponse,
    tags=["Machine Learning"],
    summary="Get Danger Zones (K-Means)",
    description="Identify high-risk zones using K-Means clustering on incident data"
)
async def get_danger_zones(db: Session = Depends(get_db)):
    """
    Get AI-identified danger zones.
    
    Uses K-Means clustering to group incidents and identify 
    high-density risk areas automatically.
    """
    zones = ml_engine.clusterer.identify_danger_zones(db)
    return DangerZonesResponse(
        danger_zones=zones,
        total_zones=len(zones),
        analysis_period_days=30
    )

@app.get(
    "/ml/trends/{zone_id}",
    response_model=TrendPrediction,
    tags=["Machine Learning"],
    summary="Predict Safety Trend (Linear Regression)",
    description="Predict future safety scores using Linear Regression"
)
async def predict_zone_trend(
    zone_id: int,
    db: Session = Depends(get_db)
):
    """
    Predict safety trend for a specific zone.
    
    Uses Linear Regression on historical data to forecast
    safety scores 7 days into the future.
    """
    zone = db.query(SafetyZone).filter(SafetyZone.id == zone_id).first()
    if not zone:
        raise HTTPException(status_code=404, detail="Zone not found")
        
    prediction = ml_engine.predictor.predict_trend(zone, db)
    return prediction

@app.get(
    "/ml/anomalies",
    response_model=AnomaliesResponse,
    tags=["Machine Learning"],
    summary="Detect Anomalies (Isolation Forest)",
    description="Detect unusual incident patterns using Isolation Forest"
)
async def detect_anomalies(db: Session = Depends(get_db)):
    """
    Detect safety anomalies.
    
    Uses Isolation Forest to identify unusual spikes in incident
    activity that deviate from normal patterns.
    """
    anomalies = ml_engine.detector.detect_anomalies(db)
    return AnomaliesResponse(
        anomalies=anomalies,
        total_anomalies=len(anomalies),
        detection_period_days=7
    )

@app.get(
    "/ml/insights",
    response_model=MLInsightsResponse,
    tags=["Machine Learning"],
    summary="Get All ML Insights",
    description="Get comprehensive AI insights including danger zones, anomalies, and trends"
)
async def get_ml_insights(db: Session = Depends(get_db)):
    """
    Get comprehensive ML insights.
    
    Combines results from:
    - K-Means Clustering (Danger Zones)
    - Isolation Forest (Anomalies)
    - Trend Analysis
    """
    return ml_engine.get_comprehensive_insights(db)
    
    **Query Parameters:**
    - lat: Latitude
    - lng: Longitude
    - radius_km: Search radius in kilometers (default: 2.0)
    - limit: Maximum incidents to return (default: 20)
    
    Returns incidents ordered by most recent first.
    """
    from safety_engine import SafetyScoreEngine
    
    # Get all recent incidents
    all_incidents = db.query(Incident).order_by(
        Incident.timestamp.desc()
    ).limit(100).all()
    
    # Filter by distance
    nearby = []
    for incident in all_incidents:
        distance = SafetyScoreEngine.haversine_distance(
            lat, lng, incident.latitude, incident.longitude
        )
        if distance <= radius_km:
            nearby.append(incident)
            if len(nearby) >= limit:
                break
    
    return nearby

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

