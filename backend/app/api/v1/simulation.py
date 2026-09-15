"""
Simulation & What-If API Endpoints
==================================
"""

from fastapi import APIRouter
from typing import Dict, Any, Optional
from pydantic import BaseModel
from app.ai.tools import tool_registry

router = APIRouter(prefix="/simulation", tags=["Simulation & What-If"])


class WhatIfRequest(BaseModel):
    block_code: str = "BLK-001"
    new_start_hour: int = 15
    new_start_minute: int = 0


class TrainDelayRequest(BaseModel):
    train_number: str = "12102"
    delay_minutes: int = 45


@router.post("/what-if")
def simulate_what_if(payload: WhatIfRequest) -> Dict[str, Any]:
    return tool_registry.simulate_what_if_shift(
        block_code=payload.block_code,
        new_start_hour=payload.new_start_hour,
        new_start_minute=payload.new_start_minute
    )


@router.post("/rtis-delay")
def simulate_train_delay(payload: TrainDelayRequest) -> Dict[str, Any]:
    return tool_registry.simulate_rtis_train_delay(
        train_number=payload.train_number,
        delay_minutes=payload.delay_minutes
    )
