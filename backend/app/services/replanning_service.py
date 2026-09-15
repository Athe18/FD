"""
Dynamic Real-Time Re-Planning Service
=====================================
Handles live operational disruptions (e.g., unexpected train delays from RTIS)
by triggering deterministic conflict detection and generating alternative
conflict-free candidate windows for Section Controller approval.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from app.domain.conflicts.detector import conflict_detector, Conflict
from app.optimization.optimizer import block_optimizer


class ReplanningService:
    """
    Manages live disruption response and automatic alternative generation.
    """

    @classmethod
    def handle_train_delay_event(
        cls,
        train_number: str,
        delay_minutes: int,
        section_id: str,
        active_blocks: List[Dict[str, Any]],
        train_schedules: List[Dict[str, Any]],
        teams: List[Dict[str, Any]],
        equipment: List[Dict[str, Any]],
        inventory: Dict[str, int]
    ) -> Dict[str, Any]:
        """
        Simulates an RTIS train delay injection, detects emerging conflicts,
        and solves for alternative feasible blocks.
        """
        # 1. Update train schedule with injected delay
        updated_schedules = []
        affected_train = None
        
        for sch in train_schedules:
            sch_copy = dict(sch)
            if sch_copy.get("train_number") == train_number or sch_copy.get("train_id") == train_number:
                sch_copy["entry_time"] = sch_copy["entry_time"] + timedelta(minutes=delay_minutes)
                sch_copy["exit_time"] = sch_copy["exit_time"] + timedelta(minutes=delay_minutes)
                sch_copy["delay_minutes"] = delay_minutes
                affected_train = sch_copy
            updated_schedules.append(sch_copy)

        # 2. Check for newly emerged collisions with active/proposed blocks
        detected_conflicts = []
        conflicting_blocks = []
        
        for blk in active_blocks:
            b_start = datetime.fromisoformat(blk["scheduled_start"]) if isinstance(blk["scheduled_start"], str) else blk["scheduled_start"]
            b_end = datetime.fromisoformat(blk["scheduled_end"]) if isinstance(blk["scheduled_end"], str) else blk["scheduled_end"]
            
            c_list = conflict_detector.check_train_conflicts(
                b_start, b_end, blk.get("block_section_id", "BS-01"), updated_schedules
            )
            if c_list:
                detected_conflicts.extend(c_list)
                conflicting_blocks.append(blk)

        # 3. If conflicts exist, re-run OR-Tools optimization to discover alternatives
        alternative_plans = []
        if detected_conflicts and conflicting_blocks:
            # Re-optimize for conflicting tasks
            tasks_to_reschedule = []
            for cb in conflicting_blocks:
                tasks_to_reschedule.extend(cb.get("tasks", []))
                
            # If tasks list is empty, create placeholder task representing the block
            if not tasks_to_reschedule:
                tasks_to_reschedule = [{
                    "id": f"TSK-REPLAN-{cb['block_id']}",
                    "task_code": f"TSK-REPLAN-{cb['block_code']}",
                    "title": f"Rescheduled Tasks for {cb['block_code']}",
                    "department": cb.get("departments", ["ENGINEERING"])[0],
                    "section_id": section_id,
                    "block_section_id": cb.get("block_section_id", "BS-01"),
                    "estimated_duration_min": cb.get("duration_minutes", 120),
                    "priority_score": 85.0
                }]

            # Horizon: from earliest block start to 12 hours later
            horizon_start = datetime.fromisoformat(conflicting_blocks[0]["scheduled_start"]) if isinstance(conflicting_blocks[0]["scheduled_start"], str) else conflicting_blocks[0]["scheduled_start"]
            horizon_end = horizon_start + timedelta(hours=12)

            opt_res = block_optimizer.optimize_corridor_blocks(
                planning_start=horizon_start,
                planning_end=horizon_end,
                tasks=tasks_to_reschedule,
                train_schedules=updated_schedules,
                teams=teams,
                equipment=equipment,
                inventory=inventory
            )
            
            alternative_plans = opt_res.get("blocks", [])

        return {
            "event_type": "LIVE_RTIS_TRAIN_DELAY",
            "train_number": train_number,
            "delay_minutes": delay_minutes,
            "timestamp": datetime.now().isoformat(),
            "conflicts_detected_count": len(detected_conflicts),
            "conflicts": [c.to_dict() for c in detected_conflicts],
            "conflicting_blocks_count": len(conflicting_blocks),
            "conflicting_blocks": conflicting_blocks,
            "alternative_blocks_count": len(alternative_plans),
            "alternative_blocks": alternative_plans,
            "recommended_action": "CONTROLLER_APPROVAL_REQUIRED" if alternative_plans else "MANUAL_REGULATION_REQUIRED",
            "justification": (
                f"Train {train_number} delayed by {delay_minutes}m created a conflict with Block {conflicting_blocks[0]['block_code'] if conflicting_blocks else 'N/A'}. "
                f"Prabal solver discovered {len(alternative_plans)} collision-free alternative window(s)."
            )
        }


replanning_service = ReplanningService()
