"""
Data Provenance & Integration Health Models
===========================================
Tracks synchronization status, freshness, error counts,
and data quality classification across all railway connectors.
"""

from sqlalchemy import Column, String, Integer, Float, DateTime, JSON, func
from app.core.database import Base


class IngestionSyncLog(Base):
    __tablename__ = "ingestion_sync_logs"

    id = Column(String(64), primary_key=True, index=True)
    source_name = Column(String(32), nullable=False, index=True) # "TMS", "TDMS", "SMMS", "COA", "RTIS", "NTES", "FOIS", "WEATHER", "FILE_UPLOAD"
    
    # Source Category: "SIMULATED", "REAL", "EXTERNAL", "MANUAL_UPLOAD"
    source_type = Column(String(32), default="SIMULATED", nullable=False)
    
    # Data Quality Status: "VALID", "WARNING", "STALE", "INVALID", "PARTIAL"
    data_quality = Column(String(16), default="VALID", nullable=False)
    
    sync_status = Column(String(32), default="SUCCESS") # "SUCCESS", "DEGRADED", "FAILED", "RUNNING"
    last_sync_time = Column(DateTime, server_default=func.now(), onupdate=func.now())
    latency_ms = Column(Integer, default=45)
    records_received_count = Column(Integer, default=0)
    error_count = Column(Integer, default=0)
    last_error_message = Column(String(512), nullable=True)
    payload_snapshot = Column(JSON, default=dict)
