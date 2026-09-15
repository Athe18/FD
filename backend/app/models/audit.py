"""
Audit & Human Approval Decision Models
======================================
Provides complete compliance, explainability, and traceability
for every planning change, controller override, and optimization run.
"""

from sqlalchemy import Column, String, Integer, DateTime, JSON, func
from app.core.database import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(64), primary_key=True, index=True)
    entity_type = Column(String(64), nullable=False, index=True) # "PLAN_VERSION", "BLOCK_REQUEST", "TASK", "SAFETY_RULE"
    entity_id = Column(String(64), nullable=False, index=True)
    action = Column(String(64), nullable=False) # "CREATED", "OPTIMIZED", "STATUS_CHANGE", "OVERRIDE", "APPROVED", "REJECTED"
    
    actor_id = Column(String(64), default="SYSTEM")
    actor_name = Column(String(128), default="Prabal Optimization Engine")
    actor_role = Column(String(64), default="SYSTEM") # "SUPER_ADMIN", "DIVISION_CONTROLLER", "PLANNER", "SYSTEM"
    
    previous_state = Column(JSON, nullable=True)
    new_state = Column(JSON, nullable=True)
    justification = Column(String(1024), nullable=True) # Reason for change or AI explanation
    
    # Model / Algorithm provenance
    algorithm_version = Column(String(64), default="Prabal-Consolidator-v1.0")
    priority_model_version = Column(String(64), default="Formula-6Factor-v1.0")
    
    timestamp = Column(DateTime, server_default=func.now(), index=True)
