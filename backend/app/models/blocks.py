"""
Railway Block Management Data Models
====================================
- Departmental Block Requests
- Candidate Planning Windows
- Approved Coordinated Blocks
"""

from sqlalchemy import Column, String, Integer, Float, ForeignKey, DateTime, Boolean, JSON, func
from sqlalchemy.orm import relationship
from app.core.database import Base


class BlockRequest(Base):
    __tablename__ = "block_requests"

    id = Column(String(64), primary_key=True, index=True)
    request_code = Column(String(32), unique=True, nullable=False, index=True)
    department = Column(String(32), nullable=False, index=True) # "ENGINEERING", "TRD", "SNT"
    section_id = Column(String(64), ForeignKey("sections.id"), nullable=False)
    block_section_id = Column(String(64), nullable=True)
    start_km = Column(Float, nullable=False)
    end_km = Column(Float, nullable=False)
    track_number = Column(Integer, default=1)
    
    requested_duration_min = Column(Integer, nullable=False)
    preferred_date = Column(DateTime, nullable=False)
    urgency = Column(String(16), default="NORMAL") # "EMERGENCY", "URGENT", "NORMAL", "PROGRAMMED"
    requires_power_block = Column(Boolean, default=False)
    requires_traffic_block = Column(Boolean, default=True)
    status = Column(String(32), default="PENDING") # "PENDING", "CONSOLIDATED", "SCHEDULED", "REJECTED"
    reason = Column(String(512), nullable=False)


class ApprovedBlock(Base):
    """
    Coordinated Maintenance Block approved by Division Controller.
    Can consolidate multiple departmental tasks.
    """
    __tablename__ = "approved_blocks"

    id = Column(String(64), primary_key=True, index=True)
    block_code = Column(String(32), unique=True, nullable=False, index=True) # e.g., "BLK-20260915-01"
    section_id = Column(String(64), ForeignKey("sections.id"), nullable=False, index=True)
    block_section_id = Column(String(64), ForeignKey("block_sections.id"), nullable=False)
    track_number = Column(Integer, default=1)
    
    scheduled_start = Column(DateTime, nullable=False, index=True)
    scheduled_end = Column(DateTime, nullable=False, index=True)
    duration_minutes = Column(Integer, nullable=False)
    
    # Consolidation metrics
    departments = Column(JSON, default=list) # e.g., ["ENGINEERING", "TRD", "SNT"]
    tasks_count = Column(Integer, default=1)
    block_utilization_pct = Column(Float, default=85.0)
    separate_blocks_avoided = Column(Integer, default=0)
    
    # Operational execution flags
    power_isolation_granted = Column(Boolean, default=False)
    traffic_disconnection_granted = Column(Boolean, default=False)
    status = Column(String(32), default="APPROVED") # "APPROVED", "IN_PROGRESS", "COMPLETED", "CANCELLED"
    approved_by = Column(String(128), default="Division Chief Controller")
    approved_at = Column(DateTime, server_default=func.now())
