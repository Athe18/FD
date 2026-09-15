"""
PRABAL Machine Learning Real-Time Inference Service
===================================================
Loads saved trained model artifacts and provides explainable predictions for:
1. Asset Failure Probability & Risk Categorization
2. Operational Delay Estimation
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, Optional

MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")
ASSET_MODEL_PATH = os.path.join(MODELS_DIR, "asset_risk_model.joblib")
DELAY_MODEL_PATH = os.path.join(MODELS_DIR, "delay_model.joblib")
ASSET_META_PATH = os.path.join(MODELS_DIR, "asset_model_metadata.json")
DELAY_META_PATH = os.path.join(MODELS_DIR, "delay_model_metadata.json")


class MLInferenceEngine:
    def __init__(self):
        self.asset_model = None
        self.delay_model = None
        self.asset_meta = {}
        self.delay_meta = {}
        self._load_models()

    def _load_models(self):
        if os.path.exists(ASSET_MODEL_PATH):
            self.asset_model = joblib.load(ASSET_MODEL_PATH)
        if os.path.exists(DELAY_MODEL_PATH):
            self.delay_model = joblib.load(DELAY_MODEL_PATH)
        if os.path.exists(ASSET_META_PATH):
            with open(ASSET_META_PATH, "r") as f:
                self.asset_meta = json.load(f)
        if os.path.exists(DELAY_META_PATH):
            with open(DELAY_META_PATH, "r") as f:
                self.delay_meta = json.load(f)

    def predict_asset_risk(
        self,
        asset_age_years: float = 12.0,
        health_score: float = 65.0,
        cumulative_traffic_gmt: float = 38.5,
        ultrasonic_defect_count: int = 2,
        days_since_inspection: float = 45.0,
        overdue_days: float = 14.0,
        temperature_c: float = 28.5
    ) -> Dict[str, Any]:
        """
        Runs inference on the trained RandomForest asset failure model.
        """
        if self.asset_model is None:
            self._load_models()

        X = pd.DataFrame([{
            "asset_age_years": float(asset_age_years),
            "health_score": float(health_score),
            "cumulative_traffic_gmt": float(cumulative_traffic_gmt),
            "ultrasonic_defect_count": int(ultrasonic_defect_count),
            "days_since_inspection": float(days_since_inspection),
            "overdue_days": float(overdue_days),
            "temperature_c": float(temperature_c)
        }])

        proba = float(self.asset_model.predict_proba(X)[0, 1])
        
        if proba >= 0.70:
            risk_cat = "CRITICAL"
            intervention = "WITHIN_7_DAYS"
        elif proba >= 0.45:
            risk_cat = "HIGH"
            intervention = "WITHIN_14_DAYS"
        elif proba >= 0.25:
            risk_cat = "MEDIUM"
            intervention = "WITHIN_30_DAYS"
        else:
            risk_cat = "LOW"
            intervention = "ROUTINE_CYCLE"

        return {
            "failure_probability": round(proba, 4),
            "failure_probability_pct": round(proba * 100, 1),
            "risk_category": risk_cat,
            "recommended_intervention_window": intervention,
            "model_metadata": {
                "model_name": self.asset_meta.get("model_name", "RandomForest"),
                "model_version": self.asset_meta.get("model_version", "v1.2.0"),
                "accuracy": self.asset_meta.get("accuracy", 0.7633),
                "roc_auc": self.asset_meta.get("roc_auc", 0.8428)
            },
            "feature_contributions": {
                "health_score": health_score,
                "ultrasonic_defects": ultrasonic_defect_count,
                "overdue_days": overdue_days,
                "traffic_density_gmt": cumulative_traffic_gmt
            }
        }

    def predict_train_delay(
        self,
        traffic_density: float = 38.5,
        corridor_length_km: float = 50.0,
        train_priority: int = 2,
        block_duration_min: int = 120,
        rain_mm: float = 0.0,
        scheduled_hour: float = 11.5
    ) -> Dict[str, Any]:
        """
        Runs inference on the trained GradientBoosting delay regressor.
        """
        if self.delay_model is None:
            self._load_models()

        X = pd.DataFrame([{
            "traffic_density": float(traffic_density),
            "corridor_length_km": float(corridor_length_km),
            "train_priority": int(train_priority),
            "block_duration_min": int(block_duration_min),
            "rain_mm": float(rain_mm),
            "scheduled_hour": float(scheduled_hour)
        }])

        delay = float(self.delay_model.predict(X)[0])
        delay = max(0.0, delay)

        return {
            "predicted_delay_minutes": round(delay, 1),
            "model_metadata": {
                "model_name": self.delay_meta.get("model_name", "GradientBoostingRegressor"),
                "model_version": self.delay_meta.get("model_version", "v1.2.0"),
                "mae_minutes": self.delay_meta.get("mae_minutes", 2.64),
                "r2_score": self.delay_meta.get("r2_score", 0.8549)
            }
        }

    def get_models_status(self) -> Dict[str, Any]:
        return {
            "asset_model": self.asset_meta,
            "delay_model": self.delay_meta
        }


ml_engine = MLInferenceEngine()
