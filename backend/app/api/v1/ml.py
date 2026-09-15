"""
Machine Learning API Endpoints
==============================
Exposes trained model inference, genuine evaluation metrics, and feature importances.
"""

from fastapi import APIRouter
from typing import Dict, Any, Optional
from pydantic import BaseModel
from app.ml.inference import ml_engine

router = APIRouter(prefix="/ml", tags=["Machine Learning"])


class AssetRiskInferenceRequest(BaseModel):
    asset_age_years: float = 12.0
    health_score: float = 48.0
    cumulative_traffic_gmt: float = 38.5
    ultrasonic_defect_count: int = 2
    days_since_inspection: float = 45.0
    overdue_days: float = 14.0
    temperature_c: float = 28.5


class TrainDelayInferenceRequest(BaseModel):
    traffic_density: float = 38.5
    corridor_length_km: float = 50.0
    train_priority: int = 2
    block_duration_min: int = 120
    rain_mm: float = 0.0
    scheduled_hour: float = 11.5


@router.post("/predict-asset-risk")
def predict_asset_risk(payload: AssetRiskInferenceRequest) -> Dict[str, Any]:
    return ml_engine.predict_asset_risk(
        asset_age_years=payload.asset_age_years,
        health_score=payload.health_score,
        cumulative_traffic_gmt=payload.cumulative_traffic_gmt,
        ultrasonic_defect_count=payload.ultrasonic_defect_count,
        days_since_inspection=payload.days_since_inspection,
        overdue_days=payload.overdue_days,
        temperature_c=payload.temperature_c
    )


@router.post("/predict-delay")
def predict_train_delay(payload: TrainDelayInferenceRequest) -> Dict[str, Any]:
    return ml_engine.predict_train_delay(
        traffic_density=payload.traffic_density,
        corridor_length_km=payload.corridor_length_km,
        train_priority=payload.train_priority,
        block_duration_min=payload.block_duration_min,
        rain_mm=payload.rain_mm,
        scheduled_hour=payload.scheduled_hour
    )


@router.get("/models-status")
def get_models_status() -> Dict[str, Any]:
    return ml_engine.get_models_status()
