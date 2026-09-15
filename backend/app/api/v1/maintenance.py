"""
Maintenance Tasks & Defects API Endpoints
=========================================
"""

from fastapi import APIRouter
from typing import Dict, Any, List
from scripts.synthetic_data_generator import generate_prabal_dataset

router = APIRouter(prefix="/maintenance", tags=["Maintenance"])


@router.get("/tasks")
def get_maintenance_tasks() -> List[Dict[str, Any]]:
    return generate_prabal_dataset()["tasks"]


@router.get("/critical")
def get_critical_tasks() -> List[Dict[str, Any]]:
    tasks = generate_prabal_dataset()["tasks"]
    return [t for t in tasks if t.get("priority_score", 0) >= 70.0]
