"""
Infrastructure API Endpoints
============================
Provides topology, stations, sections, and block sections.
"""

from fastapi import APIRouter
from typing import Dict, Any, List
from scripts.synthetic_data_generator import generate_prabal_dataset

router = APIRouter(prefix="/infrastructure", tags=["Infrastructure"])


@router.get("/corridor")
def get_corridor() -> Dict[str, Any]:
    data = generate_prabal_dataset()
    return {
        "section": data["section"],
        "stations": data["stations"],
        "block_sections": data["block_sections"]
    }


@router.get("/stations")
def get_stations() -> List[Dict[str, Any]]:
    return generate_prabal_dataset()["stations"]


@router.get("/block-sections")
def get_block_sections() -> List[Dict[str, Any]]:
    return generate_prabal_dataset()["block_sections"]
