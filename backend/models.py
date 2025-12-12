from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, JSON
from datetime import datetime
from database import Base

class Incident(Base):
    __tablename__ = "incidents"
    
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    severity = Column(String, default="medium")  # low, medium, high
    upvotes = Column(Integer, default=0)
    verified = Column(Boolean, default=False)
    upvoted_by = Column(JSON, default=list)  # List of user IDs who upvoted

class SafetyZone(Base):
    __tablename__ = "safety_zones"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    radius = Column(Float, default=500.0)  # meters
    safety_score = Column(Float, nullable=False)
    traffic_level = Column(Float, default=50.0)
    lighting_level = Column(Float, default=50.0)
    crowd_density = Column(Float, default=50.0)
    weather_condition = Column(String, default="clear")
    police_distance = Column(Float, default=1000.0)  # meters
    last_updated = Column(DateTime, default=datetime.utcnow)

class SensorData(Base):
    __tablename__ = "sensor_data"
    
    id = Column(Integer, primary_key=True, index=True)
    sensor_id = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    brightness = Column(Float, nullable=False)  # 0-100
    timestamp = Column(DateTime, default=datetime.utcnow)

class UserProfile(Base):
    __tablename__ = "user_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, unique=True, nullable=False, index=True)
    username = Column(String, nullable=False)
    total_reports = Column(Integer, default=0)
    total_upvotes_received = Column(Integer, default=0)
    reputation_score = Column(Integer, default=0)
    badges = Column(JSON, default=list)  # List of badge names
    created_at = Column(DateTime, default=datetime.utcnow)
