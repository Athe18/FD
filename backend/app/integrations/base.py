"""
Integration Base Connector Interface
====================================
Standard adapter interface for all Indian Railways external & simulated systems.

Source Categories:
- SIMULATED: Synthetic simulator representing an authorized future railway interface
- REAL: Live authorized CRIS / Railway endpoint
- EXTERNAL: Third-party service (e.g. Open-Meteo Weather API)
- MANUAL_UPLOAD: Planner CSV / Excel upload
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, List
from datetime import datetime


class BaseConnector(ABC):
    def __init__(self, system_name: str, source_type: str = "SIMULATED"):
        self.system_name = system_name
        self.source_type = source_type
        self.last_sync_time: datetime = datetime.now()
        self.sync_status: str = "CONNECTED"
        self.data_quality: str = "VALID"
        self.latency_ms: int = 35
        self.records_received_count: int = 0
        self.error_count: int = 0
        self.last_error: str = ""

    @abstractmethod
    def sync_data(self) -> Dict[str, Any]:
        """Performs data ingestion and validation."""
        pass

    def health_check(self) -> Dict[str, Any]:
        """Returns connector operational status and data freshness."""
        now = datetime.now()
        seconds_ago = int((now - self.last_sync_time).total_seconds())
        
        # Calculate human freshness string
        if seconds_ago < 60:
            freshness_str = f"{seconds_ago}s ago"
        elif seconds_ago < 3600:
            freshness_str = f"{seconds_ago // 60}m ago"
        else:
            freshness_str = f"{seconds_ago // 3600}h ago"

        return {
            "source_name": self.system_name,
            "source_type": self.source_type,
            "sync_status": self.sync_status,
            "data_quality": self.data_quality,
            "last_sync_time": self.last_sync_time.isoformat(),
            "freshness_display": freshness_str,
            "latency_ms": self.latency_ms,
            "records_received_count": self.records_received_count,
            "error_count": self.error_count
        }
