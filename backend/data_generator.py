import random
from datetime import datetime, timedelta
from models import SafetyZone, Incident, SensorData
from database import SessionLocal

# Realistic Lagos neighborhoods with actual safety characteristics
LAGOS_ZONES = [
    # HIGH SAFETY (Island Areas - Upscale)
    {"name": "Ikoyi", "lat": 6.4541, "lng": 3.4316, "radius": 800, "base_score": 95},
    {"name": "Victoria Island", "lat": 6.4281,
        "lng": 3.4219, "radius": 1000, "base_score": 93},
    {"name": "Banana Island", "lat": 6.4333,
        "lng": 3.4267, "radius": 500, "base_score": 97},
    {"name": "Lekki Phase 1", "lat": 6.4474,
        "lng": 3.4746, "radius": 1200, "base_score": 90},
    {"name": "Parkview Estate", "lat": 6.4589,
        "lng": 3.4234, "radius": 600, "base_score": 94},
    {"name": "Eko Atlantic", "lat": 6.4125,
        "lng": 3.4058, "radius": 800, "base_score": 96},
    {"name": "Oniru", "lat": 6.4392, "lng": 3.4297, "radius": 700, "base_score": 91},
    {"name": "Nicon Town", "lat": 6.4350,
        "lng": 3.5150, "radius": 600, "base_score": 94},
    {"name": "Akoka", "lat": 6.5158, "lng": 3.3898, "radius": 800, "base_score": 90},
    {"name": "University of Lagos", "lat": 6.5170,
        "lng": 3.3950, "radius": 700, "base_score": 92},
    {"name": "1004 Estate", "lat": 6.4300,
        "lng": 3.4150, "radius": 400, "base_score": 93},
    {"name": "Adeola Odeku", "lat": 6.4280,
        "lng": 3.4100, "radius": 500, "base_score": 92},

    # MEDIUM-HIGH SAFETY (Organized Residential)
    {"name": "Ikeja GRA", "lat": 6.5964, "lng": 3.3406,
        "radius": 900, "base_score": 85},
    {"name": "Maryland", "lat": 6.5795, "lng": 3.3675,
        "radius": 800, "base_score": 82},
    {"name": "Magodo Estate", "lat": 6.6228,
        "lng": 3.3789, "radius": 1000, "base_score": 84},
    {"name": "VGC", "lat": 6.4474, "lng": 3.4746, "radius": 800, "base_score": 88},
    {"name": "Lekki Phase 2", "lat": 6.4391,
        "lng": 3.5053, "radius": 1000, "base_score": 83},
    {"name": "Chevron Drive", "lat": 6.4370,
        "lng": 3.5250, "radius": 700, "base_score": 82},
    {"name": "Omole Phase 1", "lat": 6.6350,
        "lng": 3.3600, "radius": 600, "base_score": 85},
    {"name": "Omole Phase 2", "lat": 6.6400,
        "lng": 3.3700, "radius": 600, "base_score": 84},
    {"name": "Alausa", "lat": 6.6152, "lng": 3.3654,
        "radius": 800, "base_score": 86},  # Gov seat

    # MEDIUM-HIGH SAFETY (Mixed Commercial/Residential)
    {"name": "Yaba", "lat": 6.5074, "lng": 3.3721, "radius": 1000, "base_score": 78},
    {"name": "Surulere", "lat": 6.4969, "lng": 3.3561,
        "radius": 1200, "base_score": 76},
    {"name": "Gbagada", "lat": 6.5589, "lng": 3.3789,
        "radius": 900, "base_score": 80},
    {"name": "Festac Town", "lat": 6.4656,
        "lng": 3.2789, "radius": 1100, "base_score": 75},
    {"name": "Ajah", "lat": 6.4674, "lng": 3.5681, "radius": 1000, "base_score": 74},
    {"name": "Ilupeju", "lat": 6.5491, "lng": 3.3619,
        "radius": 900, "base_score": 79},
    {"name": "Anthony Village", "lat": 6.5600,
        "lng": 3.3700, "radius": 700, "base_score": 77},

    # MEDIUM SAFETY (Dense Commercial)
    {"name": "Ikeja", "lat": 6.6018, "lng": 3.3515,
        "radius": 1000, "base_score": 72},
    {"name": "Ojota", "lat": 6.5892, "lng": 3.3789, "radius": 800, "base_score": 70},
    {"name": "Ketu", "lat": 6.5987, "lng": 3.3896, "radius": 900, "base_score": 71},
    {"name": "Isolo", "lat": 6.5373, "lng": 3.3329,
        "radius": 1000, "base_score": 73},
    {"name": "Ogba", "lat": 6.6305, "lng": 3.3401, "radius": 900, "base_score": 75},

    # MEDIUM-LOW SAFETY (High Traffic/Commercial)
    {"name": "Oshodi", "lat": 6.5451, "lng": 3.3367,
        "radius": 1200, "base_score": 68},
    {"name": "Mushin", "lat": 6.5320, "lng": 3.3540,
        "radius": 1100, "base_score": 66},
    {"name": "Agege", "lat": 6.6153, "lng": 3.3198,
        "radius": 1000, "base_score": 69},
    {"name": "Ebute Metta", "lat": 6.4894,
        "lng": 3.3781, "radius": 900, "base_score": 70},
    {"name": "Apapa", "lat": 6.4489, "lng": 3.3589,
        "radius": 1000, "base_score": 69},
    {"name": "Bariga", "lat": 6.5218, "lng": 3.3887,
        "radius": 800, "base_score": 71},
    {"name": "Fadeyi", "lat": 6.5250, "lng": 3.3650,
        "radius": 600, "base_score": 70},

    # TRANSPORT/MARKET HUBS (Variable Safety)
    {"name": "Computer Village", "lat": 6.6018,
        "lng": 3.3515, "radius": 400, "base_score": 72},
    {"name": "Balogun Market", "lat": 6.4550,
        "lng": 3.3897, "radius": 500, "base_score": 68},
    {"name": "Oshodi Market", "lat": 6.5451,
        "lng": 3.3367, "radius": 600, "base_score": 66},
    {"name": "Mile 12 Market", "lat": 6.5892,
        "lng": 3.3789, "radius": 500, "base_score": 69},
    {"name": "Alaba International", "lat": 6.4589,
        "lng": 3.1789, "radius": 700, "base_score": 70},
    {"name": "Idumota", "lat": 6.4563, "lng": 3.3889,
        "radius": 600, "base_score": 68},
]

# Realistic incident types with Lagos context
INCIDENT_TYPES = [
    {"type": "traffic_robbery", "severity": "high", "weight": 0.25},
    {"type": "pickpocketing", "severity": "medium", "weight": 0.30},
    {"type": "phone_snatching", "severity": "high", "weight": 0.20},
    {"type": "harassment", "severity": "medium", "weight": 0.15},
    {"type": "accident", "severity": "medium", "weight": 0.10},
    {"type": "police_extortion", "severity": "medium", "weight": 0.15},
    {"type": "cult_clash", "severity": "high", "weight": 0.05},
    {"type": "flooded_road", "severity": "medium", "weight": 0.10},
]

# Specific landmarks for "Hyper-Local" realism
LANDMARKS = {
    "Ikoyi": ["Falomo Bridge", "Bourdillon Road", "Alexander Roundabout", "Golden Gate"],
    "Victoria Island": ["Eko Hotel Roundabout", "1004 Estate Gate", "Ajose Adeogun", "Civic Center"],
    "Lekki Phase 1": ["Admiralty Way Toll Gate", "Freedom Way", "Maroko Police Station", "Filmhouse"],
    "Ikeja": ["Under Bridge", "Shoprite Entrance", "Allen Avenue Roundabout", "Alausa Secretariat"],
    "Yaba": ["Tejuosho Market", "Unilag Main Gate", "Sabo Bus Stop", "Herbert Macaulay Way"],
    "Surulere": ["National Stadium", "Ojuelegba Bridge", "Adeniran Ogunsanya", "Shitta Roundabout"],
    "Oshodi": ["Terminal 1", "Under Bridge", "Charity Bus Stop", "Bolade"],
    "Ojota": ["New Garage", "Chemical Market", "Pedestrian Bridge"],
    "Third Mainland Bridge": ["Adeniji Adele Ramp", "Unilag Waterfront", "Oworo End"],
    "Mushin": ["Idi Oro", "Palm Avenue", "Olosha Bus Stop"],
    "Agege": ["Pen Cinema", "Guinness", "Capitol Road"],
    "Apapa": ["Wharf Road", "Tincan Island", "Liverpool"],
    "Computer Village": ["Otigba Street", "Medical Road", "Slot Head Office"],
    "Balogun Market": ["Mandilas Building", "Broad Street", "Marina Car Park"],
}


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

        final_score = max(
            0, min(100, zone_data["base_score"] + time_modifier + variation))

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

        # Generate timestamp
        # 20% chance of being very recent (0-60 mins ago)
        # 80% chance of being in last 7 days
        if random.random() < 0.2:
            minutes_ago = random.randint(1, 60)
            timestamp = datetime.utcnow() - timedelta(minutes=minutes_ago)
        else:
            hours_ago = random.randint(1, 168)
            timestamp = datetime.utcnow() - timedelta(hours=hours_ago)

        # Add small random offset to coordinates
        lat_offset = random.uniform(-0.005, 0.005)
        lng_offset = random.uniform(-0.005, 0.005)

        # Select a landmark if available for this zone
        landmark_text = ""
        if zone.name in LANDMARKS:
            landmark = random.choice(LANDMARKS[zone.name])
            landmark_text = f" near {landmark}"

        incident = Incident(
            type=incident_type["type"],
            severity=incident_type["severity"],
            latitude=zone.latitude + lat_offset,
            longitude=zone.longitude + lng_offset,
            description=f"{incident_type['type'].replace('_', ' ').title()} reported in {zone.name}{landmark_text}",
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
