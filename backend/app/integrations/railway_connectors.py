"""
Railway Mock & External Connectors
==================================
Simulated adapters for Indian Railways core operational systems:
- TMSConnector (Track Management System)
- TDMSConnector (Traction Distribution Management System)
- SMMSConnector (Signalling & Telecom Maintenance Management System)
- COAConnector (Control Office Application)
- RTISConnector (Real-Time Train Information System)
- NTESConnector (National Train Enquiry System)
- FOISConnector (Freight Operations Information System)
- WeatherConnector (Environmental Open Data)
"""

from typing import Dict, Any, List
from datetime import datetime, timedelta
import random
from app.integrations.base import BaseConnector


class TMSConnector(BaseConnector):
    def __init__(self):
        super().__init__(system_name="TMS", source_type="SIMULATED")
        self.records_received_count = 1420
        self.latency_ms = 45

    def sync_data(self) -> Dict[str, Any]:
        self.last_sync_time = datetime.now()
        self.sync_status = "CONNECTED"
        self.data_quality = "VALID"
        return {"status": "SUCCESS", "records_ingested": 1420, "system": "TMS"}


class TDMSConnector(BaseConnector):
    def __init__(self):
        super().__init__(system_name="TDMS", source_type="SIMULATED")
        self.records_received_count = 680
        self.latency_ms = 52

    def sync_data(self) -> Dict[str, Any]:
        self.last_sync_time = datetime.now()
        self.sync_status = "CONNECTED"
        self.data_quality = "VALID"
        return {"status": "SUCCESS", "records_ingested": 680, "system": "TDMS"}


class SMMSConnector(BaseConnector):
    def __init__(self):
        super().__init__(system_name="SMMS", source_type="SIMULATED")
        self.records_received_count = 540
        self.latency_ms = 38

    def sync_data(self) -> Dict[str, Any]:
        self.last_sync_time = datetime.now()
        self.sync_status = "CONNECTED"
        self.data_quality = "VALID"
        return {"status": "SUCCESS", "records_ingested": 540, "system": "SMMS"}


class COAConnector(BaseConnector):
    def __init__(self):
        super().__init__(system_name="COA", source_type="SIMULATED")
        self.records_received_count = 2100
        self.latency_ms = 60

    def sync_data(self) -> Dict[str, Any]:
        self.last_sync_time = datetime.now()
        self.sync_status = "CONNECTED"
        self.data_quality = "VALID"
        return {"status": "SUCCESS", "records_ingested": 2100, "system": "COA"}


class RTISConnector(BaseConnector):
    def __init__(self):
        super().__init__(system_name="RTIS", source_type="SIMULATED")
        self.records_received_count = 8950
        self.latency_ms = 22

    def sync_data(self) -> Dict[str, Any]:
        self.last_sync_time = datetime.now()
        self.sync_status = "CONNECTED"
        self.data_quality = "VALID"
        return {"status": "SUCCESS", "records_ingested": 8950, "system": "RTIS"}


class NTESConnector(BaseConnector):
    def __init__(self):
        super().__init__(system_name="NTES", source_type="SIMULATED")
        self.records_received_count = 1200
        self.latency_ms = 40

    def sync_data(self) -> Dict[str, Any]:
        self.last_sync_time = datetime.now()
        self.sync_status = "CONNECTED"
        self.data_quality = "VALID"
        return {"status": "SUCCESS", "records_ingested": 1200, "system": "NTES"}


class FOISConnector(BaseConnector):
    def __init__(self):
        super().__init__(system_name="FOIS", source_type="SIMULATED")
        self.records_received_count = 850
        self.latency_ms = 68

    def sync_data(self) -> Dict[str, Any]:
        self.last_sync_time = datetime.now()
        self.sync_status = "CONNECTED"
        self.data_quality = "VALID"
        return {"status": "SUCCESS", "records_ingested": 850, "system": "FOIS"}


class WeatherConnector(BaseConnector):
    def __init__(self):
        super().__init__(system_name="WEATHER", source_type="EXTERNAL")
        self.records_received_count = 120
        self.latency_ms = 110

    def sync_data(self) -> Dict[str, Any]:
        self.last_sync_time = datetime.now()
        self.sync_status = "CONNECTED"
        self.data_quality = "VALID"
        return {
            "status": "SUCCESS",
            "temperature_c": 28.5,
            "rain_probability_pct": 10,
            "wind_speed_kmph": 12.0,
            "visibility_km": 10.0,
            "severe_weather_alert": False
        }


class IntegrationManager:
    """
    Orchestrates and tracks data freshness across all railway connectors.
    """
    def __init__(self):
        self.connectors: Dict[str, BaseConnector] = {
            "TMS": TMSConnector(),
            "TDMS": TDMSConnector(),
            "SMMS": SMMSConnector(),
            "COA": COAConnector(),
            "RTIS": RTISConnector(),
            "NTES": NTESConnector(),
            "FOIS": FOISConnector(),
            "WEATHER": WeatherConnector()
        }

    def get_all_health(self) -> List[Dict[str, Any]]:
        return [conn.health_check() for conn in self.connectors.values()]

    def sync_all(self) -> Dict[str, Any]:
        results = {}
        for name, conn in self.connectors.items():
            results[name] = conn.sync_data()
        return results


integration_manager = IntegrationManager()
