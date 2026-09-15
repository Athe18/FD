"""
Planning & Optimization Result Models
=====================================
- Plan Runs & Metadata
- Immutable Plan Versions (v1, v2, v3...)
- 10 Explicit Operational Approval States
- Plan Tasks and Consolidated Assignments
- Detected Operational Conflicts
"""

from sqlalchemy import Column, String, Integer, Float, ForeignKey, DateTime, Boolean, JSON, func
from sqlalchemy.orm import relationship
from app.core.database import Base


class PlanRun(Base):
    """
    Execution run of the Google OR-Tools CP-SAT scheduling engine.
    """
    __tablename__ = "plan_runs"

    id = Column(String(64), primary_key=True, index=True) # e.g., "PLAN-2026-CR-001"
    run_code = Column(String(64), unique=True, nullable=False, index=True)
    section_id = Column(String(64), ForeignKey("sections.id"), nullable=False)
    horizon_start = Column(DateTime, nullable=False)
    horizon_end = Column(DateTime, nullable=False)
    horizon_type = Column(String(16), default="WEEKLY") # "DAILY", "WEEKLY", "MONTHLY"
    
    # Solver execution status & algorithm versions
    solver_status = Column(String(32), default="OPTIMAL") # "OPTIMAL", "FEASIBLE", "INFEASIBLE"
    solve_duration_ms = Column(Integer, default=120)
    optimizer_version = Column(String(32), default="OR-Tools-CP-SAT-9.10")
    algorithm_version = Column(String(32), default="Prabal-Consolidator-v1.0")
    
    # Mathematical Objective Scores
    total_tasks_evaluated = Column(Integer, default=0)
    tasks_scheduled = Column(Integer, default=0)
    tasks_unscheduled = Column(Integer, default=0)
    separate_blocks_saved = Column(Integer, default=0)
    total_block_hours = Column(Float, default=0.0)
    average_block_utilization_pct = Column(Float, default=0.0)
    estimated_train_delay_min = Column(Integer, default=0)
    objective_score = Column(Float, default=0.0)
    
    # Active version pointer
    current_version_number = Column(Integer, default=1)
    
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    versions = relationship("PlanVersion", back_populates="plan_run", cascade="all, delete-orphan")
    plan_tasks = relationship("PlanTask", back_populates="plan_run", cascade="all, delete-orphan")
    conflicts = relationship("PlanConflict", back_populates="plan_run", cascade="all, delete-orphan")


class PlanVersion(Base):
    """
    Immutable Versioned Plan Snapshot supporting 10 Human Approval states.
    """
    __tablename__ = "plan_versions"

    id = Column(String(64), primary_key=True, index=True)
    plan_run_id = Column(String(64), ForeignKey("plan_runs.id"), nullable=False, index=True)
    version_number = Column(Integer, nullable=False) # 1, 2, 3...
    
    # 10 Explicit Operational Approval States:
    # DRAFT -> AI_RECOMMENDED -> PLANNER_REVIEW -> MODIFIED -> PENDING_APPROVAL
    # -> APPROVED -> REJECTED -> ACTIVE -> COMPLETED -> CANCELLED
    status = Column(String(32), default="AI_RECOMMENDED", index=True)
    
    change_summary = Column(String(512), default="Initial optimal CP-SAT consolidation")
    input_snapshot_hash = Column(String(64), nullable=True)
    full_schedule_payload = Column(JSON, default=dict)
    
    # Approvals & User tracking
    created_by = Column(String(128), default="Prabal Optimization Engine")
    reviewed_by = Column(String(128), nullable=True)
    approved_by = Column(String(128), nullable=True)
    approved_at = Column(DateTime, nullable=True)
    rejection_reason = Column(String(512), nullable=True)
    
    created_at = Column(DateTime, server_default=func.now())

    plan_run = relationship("PlanRun", back_populates="versions")


class PlanTask(Base):
    __tablename__ = "plan_tasks"

    id = Column(String(64), primary_key=True, index=True)
    plan_run_id = Column(String(64), ForeignKey("plan_runs.id"), nullable=False, index=True)
    task_id = Column(String(64), ForeignKey("maintenance_tasks.id"), nullable=False, index=True)
    department = Column(String(32), nullable=False)
    block_section_id = Column(String(64), nullable=False)
    
    scheduled_start = Column(DateTime, nullable=True)
    scheduled_end = Column(DateTime, nullable=True)
    is_scheduled = Column(Boolean, default=True)
    is_consolidated = Column(Boolean, default=False)
    assigned_block_code = Column(String(32), nullable=True)
    
    # Unscheduled Task Reason (Mandatory when not scheduled)
    unscheduled_reason = Column(String(64), nullable=True)
    
    # Assigned Resources
    assigned_team_id = Column(String(64), nullable=True)
    assigned_equipment_id = Column(String(64), nullable=True)

    plan_run = relationship("PlanRun", back_populates="plan_tasks")


class PlanConflict(Base):
    __tablename__ = "plan_conflicts"

    id = Column(String(64), primary_key=True, index=True)
    plan_run_id = Column(String(64), ForeignKey("plan_runs.id"), nullable=False, index=True)
    conflict_type = Column(String(64), nullable=False) # "TRAIN_OVERLAP", "RESOURCE_COLLISION", "EQUIPMENT_TRAVEL", "MATERIAL_SHORTAGE", "DEPENDENCY_ORDER"
    severity = Column(String(16), default="HIGH") # "CRITICAL", "HIGH", "MEDIUM", "LOW"
    description = Column(String(512), nullable=False)
    entities_involved = Column(JSON, default=list) # IDs of conflicting trains, tasks, or machines
    suggested_resolution = Column(String(512), nullable=False)
    resolved = Column(Boolean, default=False)

    plan_run = relationship("PlanRun", back_populates="conflicts")
