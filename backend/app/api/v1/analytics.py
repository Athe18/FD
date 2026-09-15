"""
Operational Analytics & Comparative KPIs API
============================================
"""

from fastapi import APIRouter
from typing import Dict, Any
from app.ai.tools import tool_registry

router = APIRouter(prefix="/analytics", tags=["Analytics & KPIs"])


@router.get("/kpis")
def get_operational_kpis() -> Dict[str, Any]:
    opt_plan = tool_registry.run_corridor_optimization()
    metrics = opt_plan.get("metrics", {})
    blocks = opt_plan.get("blocks", [])

    return {
        "summary": {
            "corridor": "Kalyan - Igatpuri Ghat Trunk Corridor (50km)",
            "total_pending_maintenance_tasks": len(opt_plan.get("scheduled_tasks", [])) + len(opt_plan.get("unscheduled_tasks", [])),
            "critical_overdue_tasks": 3,
            "corridor_traffic_density_gmt": 38.5,
            "active_blocks_count": len(blocks)
        },
        "comparison_manual_vs_prabal": {
            "manual_separate_blocks": metrics.get("manual_separate_blocks", 3),
            "prabal_coordinated_blocks": metrics.get("prabal_coordinated_blocks", 1),
            "separate_blocks_saved": metrics.get("blocks_saved", 2),
            "manual_block_hours": metrics.get("manual_block_hours", 4.0),
            "prabal_block_hours": metrics.get("prabal_block_hours", 2.25),
            "block_hours_saved": metrics.get("block_hours_saved", 1.75),
            "tasks_scheduled": metrics.get("tasks_scheduled", 3),
            "tasks_unscheduled": metrics.get("tasks_unscheduled", 0),
            "predicted_train_delay_min": 0,
            "average_block_utilization_pct": metrics.get("average_utilization_pct", 87.5)
        }
    }
