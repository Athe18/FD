"""
Maintenance & Inventory Data Models
===================================
- Defects (from USFD, OMS, visual inspections)
- Maintenance Tasks (Engineering, TRD, S&T)
- Material Requirements & Stock sufficiency
"""

from sqlalchemy import Column, String, Integer, Float, ForeignKey, DateTime, Boolean, JSON, func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Defect(Base):
    __tablename__ = "defects"

    id = Column(String(64), primary_key=True, index=True)
    defect_code = Column(String(64), unique=True, nullable=False, index=True)
    asset_id = Column(String(64), ForeignKey("assets.id"), nullable=False, index=True)
    source_system = Column(String(32), default="TMS")  # "TMS", "TDMS", "SMMS"
    defect_type = Column(String(64), nullable=False)   # e.g., "IMR Rail Flaw", "OHE Dropper Break", "Point Machine Backlash"
    severity = Column(String(16), nullable=False)       # "CRITICAL", "MAJOR", "MODERATE", "MINOR"
    detected_at = Column(DateTime, nullable=False)
    deadline = Column(DateTime, nullable=True)
    speed_restriction_imposed_kmph = Column(Integer, nullable=True)  # e.g., 30 kmph cautionary order
    status = Column(String(32), default="OPEN")        # "OPEN", "SCHEDULED", "IN_PROGRESS", "RECTIFIED"
    description = Column(String(512), nullable=False)

    asset = relationship("Asset", back_populates="defects")
    maintenance_tasks = relationship("MaintenanceTask", back_populates="defect")


class MaintenanceTask(Base):
    """
    Core Maintenance Task across Engineering, TRD, or S&T.
    """
    __tablename__ = "maintenance_tasks"

    id = Column(String(64), primary_key=True, index=True)  # e.g., "TSK-ENG-001"
    task_code = Column(String(64), unique=True, nullable=False, index=True)
    title = Column(String(256), nullable=False)
    department = Column(String(32), nullable=False, index=True)  # "ENGINEERING", "TRD", "SNT"
    task_type = Column(String(64), nullable=False)  # "CORRECTIVE", "PREVENTIVE", "SAFETY_CRITICAL", "PERIODIC_OVERHAUL"
    asset_id = Column(String(64), ForeignKey("assets.id"), nullable=False, index=True)
    defect_id = Column(String(64), ForeignKey("defects.id"), nullable=True)
    section_id = Column(String(64), ForeignKey("sections.id"), nullable=False, index=True)
    block_section_id = Column(String(64), ForeignKey("block_sections.id"), nullable=True)
    km_location = Column(Float, nullable=False)
    
    # Timing & Requirement specifications
    estimated_duration_min = Column(Integer, nullable=False)  # Task execution time in minutes
    overdue_days = Column(Integer, default=0)
    requires_traffic_block = Column(Boolean, default=True)
    requires_power_block = Column(Boolean, default=False)  # TRD OHE 25kV power cutoff
    requires_speed_restriction = Column(Boolean, default=False)
    
    # Resource & Machine demands
    required_team_type = Column(String(64), nullable=False)  # e.g., "P-Way Gang", "TRD Line Gang", "Signal Relay Team"
    required_team_size = Column(Integer, default=6)
    required_machine_type = Column(String(64), nullable=True)  # e.g., "Tamping Machine (CSM)", "Tower Wagon (RU)", "BCM"
    
    # Calculated Priorities & Risk
    priority_score = Column(Float, default=50.0, index=True) # 0.0 to 100.0 (Calculated by PriorityEngine)
    risk_level = Column(String(16), default="MEDIUM")        # "CRITICAL", "HIGH", "MEDIUM", "LOW"
    priority_rank = Column(Integer, nullable=True)
    
    # Optimization & Scheduling status
    status = Column(String(32), default="PENDING")  # "PENDING", "OPTIMIZED", "APPROVED", "COMPLETED", "DEFERRED"
    assigned_plan_id = Column(String(64), ForeignKey("plan_runs.id"), nullable=True)
    assigned_block_id = Column(String(64), ForeignKey("approved_blocks.id"), nullable=True)
    scheduled_start = Column(DateTime, nullable=True)
    scheduled_end = Column(DateTime, nullable=True)
    is_consolidated = Column(Boolean, default=False)
    consolidation_group_id = Column(String(64), nullable=True)
    
    # Unscheduled explanation
    unscheduled_reason = Column(String(64), nullable=True)  # "NO_FEASIBLE_WINDOW", "TRAIN_CONFLICT", "RESOURCE_UNAVAILABLE", etc.

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    asset = relationship("Asset", back_populates="maintenance_tasks")
    defect = relationship("Defect", back_populates="maintenance_tasks")
    material_requirements = relationship("MaterialRequirement", back_populates="task", cascade="all, delete-orphan")


class InventoryItem(Base):
    __tablename__ = "inventory_items"

    id = Column(String(64), primary_key=True, index=True)
    item_code = Column(String(64), unique=True, nullable=False, index=True)  # e.g., "MAT-SLP-PSC-60KG"
    name = Column(String(128), nullable=False)
    category = Column(String(64), nullable=False)  # "TRACK", "OHE", "SIGNAL", "TELECOM"
    unit = Column(String(16), default="Units")    # "Nos", "Meters", "Tonnes"
    warehouse_code = Column(String(32), nullable=False)  # "KYN-DEPOT", "IGP-DEPOT"
    warehouse_location_km = Column(Float, default=0.0)
    quantity_on_hand = Column(Integer, default=100)
    minimum_threshold = Column(Integer, default=20)


class MaterialRequirement(Base):
    __tablename__ = "material_requirements"

    id = Column(String(64), primary_key=True, index=True)
    task_id = Column(String(64), ForeignKey("maintenance_tasks.id"), nullable=False, index=True)
    item_code = Column(String(64), ForeignKey("inventory_items.item_code"), nullable=False)
    required_quantity = Column(Integer, nullable=False)
    allocated_quantity = Column(Integer, default=0)
    sufficiency_status = Column(String(32), default="READY")  # "READY", "MATERIAL_SHORTAGE", "PROCUREMENT_REQUIRED"

    task = relationship("MaintenanceTask", back_populates="material_requirements")
    inventory_item = relationship("InventoryItem")
