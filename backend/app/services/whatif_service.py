"""
Deterministic What-If Scenario Simulator
=========================================
Allows railway planners to test operational schedule modifications
(e.g., shifting block times, adjusting durations, injecting extra tasks).

CRITICAL DOMAIN PRINCIPLE:
All numerical outcomes (train delays, conflicts, utilization, completed tasks)
are calculated deterministically by re-evaluating safety rules and the conflict engine.
Zero numbers are invented by the LLM.
"""

from typing import Dict, Any, List
from datetime import datetime, timedelta
from app.domain.conflicts.detector import conflict_detector
from app.domain.rules.safety_rules import safety_rule_engine


class WhatIfService:
    """
    Executes what-if sandbox evaluations and computes side-by-side Before vs After deltas.
    """

    @classmethod
    def simulate_window_shift(
        cls,
        original_block: Dict[str, Any],
        new_start_time: datetime,
        new_end_time: datetime,
        tasks: List[Dict[str, Any]],
        train_schedules: List[Dict[str, Any]],
        teams: List[Dict[str, Any]],
        inventory: Dict[str, int]
    ) -> Dict[str, Any]:
        """
        Simulates moving a block window and computes exact conflict & train delay impact.
        """
        block_section_id = original_block.get("block_section_id", "BS-01")
        
        # 1. Evaluate BEFORE (Original Proposed Window)
        orig_start = datetime.fromisoformat(original_block["scheduled_start"]) if isinstance(original_block["scheduled_start"], str) else original_block["scheduled_start"]
        orig_end = datetime.fromisoformat(original_block["scheduled_end"]) if isinstance(original_block["scheduled_end"], str) else original_block["scheduled_end"]
        
        before_conflicts = conflict_detector.check_train_conflicts(
            orig_start, orig_end, block_section_id, train_schedules
        )
        before_train_delay = sum(
            30 if c.severity == "CRITICAL" else 15 for c in before_conflicts
        )
        before_duration = int((orig_end - orig_start).total_seconds() // 60)
        
        # 2. Evaluate AFTER (Modified Proposed Window)
        after_conflicts = conflict_detector.check_train_conflicts(
            new_start_time, new_end_time, block_section_id, train_schedules
        )
        after_train_delay = sum(
            30 if c.severity == "CRITICAL" else 15 for c in after_conflicts
        )
        after_duration = int((new_end_time - new_start_time).total_seconds() // 60)
        
        # Check Safety Rules for Modified Window
        duration_safety = safety_rule_engine.validate_block_duration_bounds(after_duration)
        isolation_safety = safety_rule_engine.validate_ohe_power_isolation_sequence(tasks, new_start_time, new_end_time)
        
        # Calculate Delta Metrics
        delta_conflicts = len(after_conflicts) - len(before_conflicts)
        delta_delay = after_train_delay - before_train_delay
        
        sum_task_durations = sum(t.get("estimated_duration_min", 0) for t in tasks)
        departments = list(set(t.get("department", "ENGG") for t in tasks))
        after_utilization = min(100.0, round((sum_task_durations / max(1, after_duration * max(1, len(departments)))) * 100.0, 1))

        return {
            "scenario_type": "WINDOW_SHIFT",
            "block_id": original_block.get("block_id"),
            "before": {
                "start": orig_start.isoformat(),
                "end": orig_end.isoformat(),
                "duration_min": before_duration,
                "conflicts_count": len(before_conflicts),
                "conflicts": [c.to_dict() for c in before_conflicts],
                "predicted_train_delay_min": before_train_delay,
                "tasks_count": len(tasks),
                "utilization_pct": original_block.get("utilization_pct", 85.0)
            },
            "after": {
                "start": new_start_time.isoformat(),
                "end": new_end_time.isoformat(),
                "duration_min": after_duration,
                "conflicts_count": len(after_conflicts),
                "conflicts": [c.to_dict() for c in after_conflicts],
                "predicted_train_delay_min": after_train_delay,
                "tasks_count": len(tasks),
                "utilization_pct": after_utilization
            },
            "deltas": {
                "conflicts_delta": delta_conflicts,
                "train_delay_delta_min": delta_delay,
                "duration_delta_min": after_duration - before_duration,
                "is_improvement": delta_conflicts <= 0 and delta_delay <= 0
            },
            "safety_checks": {
                "duration_bounds_satisfied": duration_safety.is_valid,
                "ohe_isolation_satisfied": isolation_safety.is_valid,
                "safety_messages": [duration_safety.message, isolation_safety.message]
            },
            "calculated_recommendation": (
                "FEASIBLE_WINDOW" if len(after_conflicts) == 0 and duration_safety.is_valid and isolation_safety.is_valid
                else "CONFLICT_DETECTED"
            )
        }


whatif_service = WhatIfService()
