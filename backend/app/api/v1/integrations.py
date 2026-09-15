"""
Integrations & Data Freshness API Endpoints
===========================================
"""

from fastapi import APIRouter
from typing import Dict, Any, List
from app.integrations.railway_connectors import integration_manager

router = APIRouter(prefix="/integrations", tags=["Integrations & Freshness"])


@router.get("/health")
def get_integrations_health() -> List[Dict[str, Any]]:
    return integration_manager.get_all_health()


@router.post("/sync")
def trigger_sync() -> Dict[str, Any]:
    results = integration_manager.sync_all()
    return {
        "status": "ALL_SYNCS_COMPLETED",
        "results": results
    }
