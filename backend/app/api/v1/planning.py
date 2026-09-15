"""
Planning, Optimization & Approval API Endpoints
================================================
"""

from fastapi import APIRouter, Response, HTTPException
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel
from app.optimization.optimizer import block_optimizer
from app.services.export_service import export_service
from scripts.synthetic_data_generator import generate_prabal_dataset

router = APIRouter(prefix="/planning", tags=["Planning & Optimization"])

# In-memory session store for current plan versions
_current_plan_state = {
    "plan_id": "PLAN-2026-CR-001",
    "version": 1,
    "status": "AI_RECOMMENDED",
    "approved_by": None,
    "approved_at": None,
    "data": None
}


class ApprovalRequest(BaseModel):
    approver_name: str = "Chief Controller (Central Railway)"
    comments: Optional[str] = "Coordinated block approved as optimal."


@router.post("/run")
def run_optimization() -> Dict[str, Any]:
    data = generate_prabal_dataset()
    base_date = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    
    result = block_optimizer.optimize_corridor_blocks(
        planning_start=base_date + timedelta(hours=6),
        planning_end=base_date + timedelta(hours=22),
        tasks=data["tasks"],
        train_schedules=data["train_schedules"],
        teams=data["teams"],
        equipment=data["equipment"],
        inventory=data["inventory"]
    )
    
    _current_plan_state["data"] = result
    _current_plan_state["status"] = "AI_RECOMMENDED"
    
    return {
        "plan_id": _current_plan_state["plan_id"],
        "version": _current_plan_state["version"],
        "status": _current_plan_state["status"],
        "result": result
    }


@router.get("/active")
def get_active_plan() -> Dict[str, Any]:
    if _current_plan_state["data"] is None:
        run_optimization()
        
    return {
        "plan_id": _current_plan_state["plan_id"],
        "version": _current_plan_state["version"],
        "status": _current_plan_state["status"],
        "approved_by": _current_plan_state["approved_by"],
        "approved_at": _current_plan_state["approved_at"],
        "result": _current_plan_state["data"]
    }


@router.post("/approve")
def approve_plan(payload: ApprovalRequest) -> Dict[str, Any]:
    if _current_plan_state["data"] is None:
        run_optimization()

    _current_plan_state["status"] = "APPROVED"
    _current_plan_state["approved_by"] = payload.approver_name
    _current_plan_state["approved_at"] = datetime.now().isoformat()
    _current_plan_state["version"] += 1

    return {
        "message": "Plan successfully approved by Division Controller.",
        "plan_id": _current_plan_state["plan_id"],
        "version": _current_plan_state["version"],
        "status": _current_plan_state["status"],
        "approved_by": _current_plan_state["approved_by"],
        "approved_at": _current_plan_state["approved_at"]
    }


@router.post("/reject")
def reject_plan(reason: str = "Conflict with upcoming VIP train movement") -> Dict[str, Any]:
    _current_plan_state["status"] = "REJECTED"
    return {
        "message": "Plan rejected.",
        "plan_id": _current_plan_state["plan_id"],
        "status": _current_plan_state["status"],
        "rejection_reason": reason
    }


@router.get("/export/csv")
def export_csv():
    if _current_plan_state["data"] is None:
        run_optimization()
    blocks = _current_plan_state["data"].get("blocks", [])
    csv_content = export_service.export_blocks_csv(blocks)
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=Prabal_Weekly_Block_Plan.csv"}
    )


@router.get("/export/excel")
def export_excel():
    if _current_plan_state["data"] is None:
        run_optimization()
    blocks = _current_plan_state["data"].get("blocks", [])
    metrics = _current_plan_state["data"].get("metrics", {})
    excel_content = export_service.export_blocks_excel(blocks, metrics)
    return Response(
        content=excel_content,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=Prabal_Weekly_Block_Plan.xlsx"}
    )


@router.get("/export/pdf")
def export_pdf():
    if _current_plan_state["data"] is None:
        run_optimization()
    blocks = _current_plan_state["data"].get("blocks", [])
    pdf_content = export_service.export_blocks_pdf(blocks)
    return Response(
        content=pdf_content,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=Prabal_Weekly_Block_Plan.pdf"}
    )
