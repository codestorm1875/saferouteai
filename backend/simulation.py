"""
Simulation Service for SafeRouteAI

This module provides a background service that simulates a live environment
by automatically generating incidents and updating safety scores.
"""

import asyncio
import random
from datetime import datetime
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Incident, SafetyZone
from safety_engine import SafetyScoreEngine

class SimulationService:
    """Background service for simulating real-time incidents"""
    
    def __init__(self):
        self.running = False
        self.task = None
        self.interval = 10  # Seconds between auto-incidents (Faster for demo)
        
        # Simulation data
        self.incident_types = [
            "traffic_robbery", "pickpocketing", "harassment", 
            "accident", "vandalism", "suspicious_activity"
        ]
        self.severities = ["low", "medium", "high"]
        self.severity_weights = [0.6, 0.3, 0.1]  # Mostly low/medium
    
    def start(self):
        """Start the simulation loop"""
        if not self.running:
            self.running = True
            self.task = asyncio.create_task(self._simulation_loop())
            print("🚀 Simulation Service Started")
    
    def stop(self):
        """Stop the simulation loop"""
        self.running = False
        if self.task:
            self.task.cancel()
            print("🛑 Simulation Service Stopped")
    
    async def _simulation_loop(self):
        """Main loop that generates incidents periodically"""
        while self.running:
            try:
                await asyncio.sleep(self.interval)
                self.trigger_incident()
            except asyncio.CancelledError:
                break
            except Exception as e:
                print(f"Error in simulation loop: {e}")
                await asyncio.sleep(5)  # Retry delay
    
    def trigger_incident(self):
        """Generate a random incident and update safety scores"""
        db = SessionLocal()
        try:
            # 1. Pick a random zone to host the incident
            zones = db.query(SafetyZone).all()
            if not zones:
                return
            
            target_zone = random.choice(zones)
            
            # 2. Generate random coordinates near zone center
            # Add small random offset (approx +/- 500m)
            lat_offset = random.uniform(-0.0045, 0.0045)
            lng_offset = random.uniform(-0.0045, 0.0045)
            
            lat = target_zone.latitude + lat_offset
            lng = target_zone.longitude + lng_offset
            
            # 3. Create incident
            incident_type = random.choice(self.incident_types)
            severity = random.choices(self.severities, weights=self.severity_weights)[0]
            
            description = self._generate_description(incident_type, target_zone.name)
            
            new_incident = Incident(
                type=incident_type,
                description=description,
                latitude=lat,
                longitude=lng,
                severity=severity,
                timestamp=datetime.utcnow(),
                verified=True  # Sim incidents are "verified"
            )
            
            db.add(new_incident)
            db.commit()
            
            # 4. Update zone safety score
            # Decrease score based on severity
            impact = {
                "low": 2.0,
                "medium": 5.0,
                "high": 10.0
            }.get(severity, 2.0)
            
            # Apply impact but keep within 0-100
            new_score = max(0, min(100, target_zone.safety_score - impact))
            target_zone.safety_score = new_score
            target_zone.last_updated = datetime.utcnow()
            
            db.commit()
            
            print(f"⚠️ Simulated {severity} {incident_type} at {target_zone.name}. New Score: {new_score}")
            return new_incident
            
        except Exception as e:
            print(f"Error triggering incident: {e}")
            db.rollback()
        finally:
            db.close()

    def _generate_description(self, type: str, location: str) -> str:
        """Generate a realistic description"""
        templates = {
            "traffic_robbery": [
                f"Robbery reported in traffic near {location}",
                f"Boys harassing drivers at {location}",
                f"Phone snatched from car at {location}"
            ],
            "accident": [
                f"Minor collision at {location}",
                f"Truck breakdown causing traffic at {location}",
                f"Bike accident reported at {location}"
            ],
            "harassment": [
                f"Tout harassment reported at {location}",
                f"Aggressive begging at {location}"
            ],
            "pickpocketing": [
                f"Wallet stolen in crowd at {location}",
                f"Phone theft reported at {location}"
            ]
        }
        
        options = templates.get(type, [f"Incident reported at {location}"])
        return random.choice(options)
