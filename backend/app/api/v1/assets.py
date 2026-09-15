"""
Assets & Health API Endpoints
=============================
"""

from fastapi import APIRouter
from typing import Dict, Any, List
from scripts.synthetic_data_generator import generate_prabal_dataset

router = APIRouter(prefix="/assets", tags=["Assets"])


@router.get("/")
def get_assets() -> List[Dict[str, Any]]:
    return generate_prabal_dataset()["assets"]


@router.get("/{asset_id}")
def get_asset_detail(asset_id: str) -> Dict[str, Any]:
    assets = generate_prabal_dataset()["assets"]
    asset = next((a for a in assets if a["id"] == asset_id or a["asset_code"] == asset_id), None)
    if not asset:
        return {"error": "Asset not found"}
    return asset
