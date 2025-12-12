import random
from datetime import datetime, timedelta
from models import SafetyZone, Incident, SensorData
from database import SessionLocal

# Realistic Lagos neighborhoods with actual safety characteristics
LAGOS_ZONES = [
    # HIGH SAFETY (Island Areas - Upscale)
    {"name": "Ikoyi", "lat": 6.4541, "lng": 3.4316, "radius": 800, "base_score": 82},
    {"name": "Victoria Island", "lat": 6.4281, "lng": 3.4219, "radius": 1000, "base_score": 78},
    {"name": "Banana Island", "lat": 6.4333, "lng": 3.4267, "radius": 500, "base_score": 88},
    {"name": "Lekki Phase 1", "lat": 6.4474, "lng": 3.4746, "radius": 1200, "base_score": 75},
    {"name": "Parkview Estate", "lat": 6.4589, "lng": 3.4234, "radius": 600, "base_score": 85},
    
    # MEDIUM-HIGH SAFETY (Organized Residential)
    {"name": "Ikeja GRA", "lat": 6.5964, "lng": 3.3406, "radius": 900, "base_score": 72},
    {"name": "Maryland", "lat": 6.5795, "lng": 3.3675, "radius": 800, "base_score": 68},
    {"name": "Magodo Estate", "lat": 6.6228, "lng": 3.3789, "radius": 1000, "base_score": 70},
    {"name": "VGC", "lat": 6.4474, "lng": 3.4746, "radius": 800, "base_score": 76},
    {"name": "Lekki Phase 2", "lat": 6.4391, "lng": 3.5053, "radius": 1000, "base_score": 71},
    
    # MEDIUM SAFETY (Mixed Commercial/Residential)
    {"name": "Yaba", "lat": 6.5074, "lng": 3.3721, "radius": 1000, "base_score": 62},
    {"name": "Surulere", "lat": 6.4969, "lng": 3.3561, "radius": 1200, "base_score": 58},
    {"name": "Gbagada", "lat": 6.5589, "lng": 3.3789, "radius": 900, "base_score": 60},
    {"name": "Festac Town", "lat": 6.4656, "lng": 3.2789, "radius": 1100, "base_score": 64},
    {"name": "Ajah", "lat": 6.4674, "lng": 3.5681, "radius": 1000, "base_score": 55},
    
    # MEDIUM-LOW SAFETY (Dense Commercial)
    {"name": "Ikeja", "lat": 6.6018, "lng": 3.3515, "radius": 1000, "base_score": 52},
    {"name": "Ojota", "lat": 6.5892, "lng": 3.3789, "radius": 800, "base_score": 48},
    {"name": "Ketu", "lat": 6.5987, "lng": 3.3896, "radius": 900, "base_score": 50},
    {"name": "Isolo", "lat": 6.5373, "lng": 3.3329, "radius": 1000, "base_score": 54},
    
    # LOW SAFETY (High Traffic/Commercial)
    {"name": "Oshodi", "lat": 6.5451, "lng": 3.3367, "radius": 1200, "base_score": 42},
    {"name": "Mushin", "lat": 6.5320, "lng": 3.3540, "radius": 1100, "base_score": 38},
    {"name": "Agege", "lat": 6.6153, "lng": 3.3198, "radius": 1000, "base_score": 40},
    {"name": "Ebute Metta", "lat": 6.4894, "lng": 3.3781, "radius": 900, "base_score": 45},
    {"name": "Apapa", "lat": 6.4489, "lng": 3.3589, "radius": 1000, "base_score": 44},
    
    # TRANSPORT/MARKET HUBS (Variable Safety)
    {"name": "Computer Village", "lat": 6.6018, "lng": 3.3515, "radius": 400, "base_score": 48},
    {"name": "Balogun Market", "lat": 6.4550, "lng": 3.3897, "radius": 500, "base_score": 35},
    {"name": "Oshodi Market", "lat": 6.5451, "lng": 3.3367, "radius": 600, "base_score": 32},
    {"name": "Mile 12 Market", "lat": 6.5892, "lng": 3.3789, "radius": 500, "base_score": 36},
    {"name": "Alaba International", "lat": 6.4589, "lng": 3.1789, "radius": 700, "base_score": 40},
]

# Realistic incident types with Lagos context
INCIDENT_TYPES = [
    {"type": "traffic_robbery", "severity": "high", "weight": 0.25},
    {"type": "pickpocketing", "severity": "medium", "weight": 0.30},
    {"type": "phone_snatching", "severity": "high", "weight": 0.20},
    {"type": "harassment", "severity": "medium", "weight": 0.15},
    {"type": "accident", "severity": "medium", "weight": 0.10},
]

def generate_safety_zones(db):
    """Generate realistic safety zones for Lagos"""
    zones = []
    
    for zone_data in LAGOS_ZONES:
        # Add time-based variation (day vs night)
        current_hour = datetime.now().hour
        time_modifier = 0
        
        if 6 <= current_hour < 18:  # Daytime (6 AM - 6 PM)
            time_modifier = 5  # Safer during day
        elif 18 <= current_hour < 22:  # Evening (6 PM - 10 PM)
            time_modifier = 0  # Neutral
        else:  # Night (10 PM - 6 AM)
            time_modifier = -8  # Less safe at night
        
        # Add random variation for realism
        variation = random.uniform(-3, 3)
        
        final_score = max(0, min(100, zone_data["base_score"] + time_modifier + variation))
        
        zone = SafetyZone(
            name=zone_data["name"],
            latitude=zone_data["lat"],
            longitude=zone_data["lng"],
            radius=zone_data["radius"],
            safety_score=round(final_score, 1)
        )
        zones.append(zone)
    
    db.add_all(zones)
    db.commit()
    print(f"✅ Generated {len(zones)} realistic safety zones")
    return zones

def generate_incidents(db):
    """Generate realistic incidents based on zone characteristics"""
    incidents = []
    zones = db.query(SafetyZone).all()
    
    # Generate 20-30 incidents
    num_incidents = random.randint(20, 30)
    
    for _ in range(num_incidents):
        # Higher chance of incidents in lower-safety zones
        zone_weights = [max(0, 100 - z.safety_score) for z in zones]
        zone = random.choices(zones, weights=zone_weights)[0]
        
        # Select incident type
        incident_type = random.choices(
            INCIDENT_TYPES,
            weights=[i["weight"] for i in INCIDENT_TYPES]
        )[0]
        
        # Generate timestamp (last 7 days, weighted towards recent)
        hours_ago = random.choices(
            range(0, 168),  # 7 days = 168 hours
            weights=[100/(i+1) for i in range(168)]  # Recent incidents more likely
        )[0]
        
        timestamp = datetime.now() - timedelta(hours=hours_ago)
        
        # Add small random offset to coordinates
        lat_offset = random.uniform(-0.005, 0.005)
        lng_offset = random.uniform(-0.005, 0.005)
        
        incident = Incident(
            type=incident_type["type"],
            severity=incident_type["severity"],
            latitude=zone.latitude + lat_offset,
            longitude=zone.longitude + lng_offset,
            description=f"{incident_type['type'].replace('_', ' ').title()} reported in {zone.name}",
            timestamp=timestamp
        )
        incidents.append(incident)
    
    db.add_all(incidents)
    db.commit()
    print(f"✅ Generated {len(incidents)} realistic incidents")
    return incidents

def generate_sensor_data(db):
    """Generate IoT sensor data for lighting conditions"""
    sensors = []
    zones = db.query(SafetyZone).all()
    
    current_hour = datetime.now().hour
    
    for zone in zones[:20]:  # Sensors in 20 zones
        # Realistic brightness based on time and area type
        if 6 <= current_hour < 18:  # Daytime
            brightness = random.randint(80, 100)
        elif 18 <= current_hour < 20:  # Dusk
            brightness = random.randint(50, 70)
        else:  # Night
            # Upscale areas have better lighting
            if zone.safety_score > 70:
                brightness = random.randint(60, 80)
            elif zone.safety_score > 50:
                brightness = random.randint(40, 60)
            else:
                brightness = random.randint(20, 45)
        
        sensor = SensorData(
            sensor_id=f"SENSOR_{zone.name.replace(' ', '_').upper()}",
            latitude=zone.latitude,
            longitude=zone.longitude,
            brightness=brightness,
            timestamp=datetime.now()
        )
        sensors.append(sensor)
    
    db.add_all(sensors)
    db.commit()
    print(f"✅ Generated {len(sensors)} sensor readings")
    return sensors

def generate_all_data():
    """Generate all fake data for the system"""
    db = SessionLocal()
    try:
        # Clear existing data
        db.query(SensorData).delete()
        db.query(Incident).delete()
        db.query(SafetyZone).delete()
        db.commit()
        
        print("🗑️  Cleared existing data")
        print("🔄 Generating realistic Lagos data...")
        
        # Generate new data
        zones = generate_safety_zones(db)
        incidents = generate_incidents(db)
        sensors = generate_sensor_data(db)
        
        print(f"\n✨ Data generation complete!")
        print(f"   📍 {len(zones)} safety zones")
        print(f"   🚨 {len(incidents)} incidents")
        print(f"   💡 {len(sensors)} sensor readings")
        
    finally:
        db.close()

if __name__ == "__main__":
    generate_all_data()
