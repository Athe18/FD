"""
Train Timetables & Live Movements API
=====================================
"""

from fastapi import APIRouter
from typing import Dict, Any, List
from scripts.synthetic_data_generator import generate_prabal_dataset

router = APIRouter(prefix="/trains", tags=["Trains"])


@router.get("/schedules")
def get_train_schedules() -> List[Dict[str, Any]]:
    schedules = generate_prabal_dataset()["train_schedules"]
    res = []
    for s in schedules:
        s_copy = dict(s)
        s_copy["entry_time"] = s_copy["entry_time"].isoformat()
        s_copy["exit_time"] = s_copy["exit_time"].isoformat()
        res.append(s_copy)
    return res
