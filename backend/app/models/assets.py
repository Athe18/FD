"""
Asset Data Models
=================
Multi-Departmental Railway Assets:
- Engineering (Rails, Sleepers, Turnouts, Ballast, Bridges)
- TRD (Traction Distribution - OHE Masts, Cantilevers, Contact Wire, Isolators)
- S&T (Signals, Point Machines, Track Circuits, Axle Counters, Relays)
- Telecom (OFC, Quad Cable, Radio Towers, Station Intercom)
"""

from sqlalchemy import Column, String, Integer, Float, ForeignKey, DateTime, JSON, Boolean, func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Asset(Base):
    __tablename__ = "assets"

    id = Column(String(64), primary_key=True, index=True)  # e.g., "AST-ENG-RAIL-125.4"
    asset_code = Column(String(64), unique=True, nullable=False, index=True)
    name = Column(String(128), nullable=False)
    department = Column(String(32), nullable=False, index=True)  # "ENGINEERING", "TRD", "SNT", "TELECOM", "BRIDGE"
    asset_type = Column(String(64), nullable=False, index=True)  # "Rail Section", "Turnout Point", "OHE Mast", "Signal Head", etc.
    section_id = Column(String(64), ForeignKey("sections.id"), nullable=False, index=True)
    block_section_id = Column(String(64), ForeignKey("block_sections.id"), nullable=True)
    km_location = Column(Float, nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    track_number = Column(Integer, default=1)
    
    # Asset lifecycle & health
    installation_date = Column(DateTime, nullable=True)
    last_major_overhaul = Column(DateTime, nullable=True)
    asset_criticality = Column(Float, default=0.7)  # 0.0 to 1.0 (Higher = more critical)
    health_score = Column(Float, default=85.0)      # 0 to 100 (Lower = worse condition)
    failure_probability = Column(Float, default=0.15) # ML predicted probability of failure
    risk_category = Column(String(16), default="LOW") # "CRITICAL", "HIGH", "MEDIUM", "LOW"
    status = Column(String(32), default="OPERATIONAL") # "OPERATIONAL", "DEGRADED", "RESTRICTED", "MAINTENANCE_REQUIRED"

    technical_specs = Column(JSON, default=dict)

    # Relationships
    maintenance_tasks = relationship("MaintenanceTask", back_populates="asset", cascade="all, delete-orphan")
    defects = relationship("Defect", back_populates="asset", cascade="all, delete-orphan")
    inspections = relationship("AssetInspection", back_populates="asset", cascade="all, delete-orphan")


class AssetInspection(Base):
    __tablename__ = "asset_inspections"

    id = Column(String(64), primary_key=True, index=True)
    asset_id = Column(String(64), ForeignKey("assets.id"), nullable=False, index=True)
    inspection_date = Column(DateTime, nullable=False)
    inspection_type = Column(String(64), nullable=False)  # "USFD", "OMS Track Recording", "OHE Tower Car", "Foot Plate"
    inspected_by = Column(String(128), nullable=False)
    source_system = Column(String(32), default="TMS")  # "TMS", "TDMS", "SMMS"
    findings_summary = Column(String(512), nullable=False)
    measured_parameters = Column(JSON, default=dict)
    defects_found_count = Column(Integer, default=0)
    urgency_recommendation = Column(String(32), default="ROUTINE")

    asset = relationship("Asset", back_populates="inspections")
