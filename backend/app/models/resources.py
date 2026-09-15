"""
Resource & Machine Allocation Models
====================================
- Maintenance Teams / Gangs
- Specialized Track Machines & OHE Tower Wagons
- Travel Matrix and Spatial Transit Constraints
"""

from sqlalchemy import Column, String, Integer, Float, ForeignKey, DateTime, Boolean, JSON, func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Team(Base):
    __tablename__ = "teams"

    id = Column(String(64), primary_key=True, index=True)
    team_code = Column(String(32), unique=True, nullable=False, index=True) # e.g., "GANG-ENG-KYN-01"
    team_name = Column(String(128), nullable=False)
    department = Column(String(32), nullable=False, index=True) # "ENGINEERING", "TRD", "SNT"
    team_type = Column(String(64), nullable=False) # "P-Way Gang", "TRD Line Gang", "Signal Maintenance Gang"
    base_station_code = Column(String(16), nullable=False)
    base_km = Column(Float, nullable=False)
    members_count = Column(Integer, default=8)
    supervisor_name = Column(String(128), default="Senior Section Engineer")
    shift_start_hour = Column(Integer, default=7)  # 07:00
    shift_end_hour = Column(Integer, default=19)   # 19:00 (12-hr window)
    is_available = Column(Boolean, default=True)


class Equipment(Base):
    """
    Heavy Railway Maintenance Machinery.
    e.g., CSM 09-32 Tamping Machine, Ballast Cleaning Machine (BCM),
    Dynamic Track Stabilizer (DTS), TRD 8-Wheeler Tower Car (RU).
    """
    __tablename__ = "equipment"

    id = Column(String(64), primary_key=True, index=True)
    machine_code = Column(String(32), unique=True, nullable=False, index=True) # e.g., "CSM-902", "BCM-104", "TOWER-WAGON-21"
    machine_name = Column(String(128), nullable=False)
    department = Column(String(32), nullable=False)
    machine_type = Column(String(64), nullable=False)
    base_depot = Column(String(32), nullable=False)
    current_km = Column(Float, nullable=False) # Current physical track location
    transit_speed_kmph = Column(Float, default=30.0) # Self-propelled transit speed
    setup_time_min = Column(Integer, default=15) # Machine deployment/tamping setup
    stabling_siding_code = Column(String(32), default="KYN-YARD")
    status = Column(String(32), default="AVAILABLE") # "AVAILABLE", "ASSIGNED", "TRANSIT", "MAINTENANCE"


class EquipmentTravelMatrix(Base):
    """
    Deterministic transit time matrix between sidings and worksites.
    """
    __tablename__ = "equipment_travel_matrix"

    id = Column(String(64), primary_key=True, index=True)
    machine_id = Column(String(64), ForeignKey("equipment.id"), nullable=False)
    from_km = Column(Float, nullable=False)
    to_km = Column(Float, nullable=False)
    calculated_transit_min = Column(Integer, nullable=False)
