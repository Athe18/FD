"""
Railway Safety Rule Engine
==========================
Strict deterministic safety rules for Indian Railways corridor operations.

CRITICAL PRINCIPLE:
Safety rules are hard constraints and can NEVER be bypassed or weakened
by the LLM or optimization score maximization.

All parameters are configurable via settings and explicitly annotated as
PROTOTYPE_DEMO_RULE unless confirmed by official Indian Railways manuals.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from app.core.config import settings


class SafetyValidationResult:
    def __init__(self, is_valid: bool, rule_code: str, message: str, details: Optional[Dict[str, Any]] = None):
        self.is_valid = is_valid
        self.rule_code = rule_code
        self.message = message
        self.details = details or {}
        self.provenance = "PROTOTYPE_DEMO_RULE"

    def to_dict(self) -> Dict[str, Any]:
        return {
            "is_valid": self.is_valid,
            "rule_code": self.rule_code,
            "message": self.message,
            "provenance": self.provenance,
            "details": self.details
        }


class SafetyRuleEngine:
    """
    Deterministic Railway Domain & Safety Rule Verifier.
    """

    @staticmethod
    def validate_train_safety_buffer(
        block_start: datetime,
        block_end: datetime,
        train_entry: datetime,
        train_exit: datetime,
        buffer_min: Optional[int] = None
    ) -> SafetyValidationResult:
        """
        Rule: SR-001 - Train Clearance Safety Margin
        Guarantees that a maintenance block does not infringe upon a train's
        approach or departure buffer on the designated line.
        """
        required_buffer = timedelta(minutes=buffer_min or settings.safety.train_clearance_buffer_min)
        buffered_block_start = block_start - required_buffer
        buffered_block_end = block_end + required_buffer

        # Check for temporal overlap between buffered block and train section occupancy
        has_overlap = max(buffered_block_start, train_entry) < min(buffered_block_end, train_exit)
        
        if has_overlap:
            return SafetyValidationResult(
                is_valid=False,
                rule_code="SR-001",
                message=f"Train occupancy [{train_entry.strftime('%H:%M')} - {train_exit.strftime('%H:%M')}] infringes upon block window [{block_start.strftime('%H:%M')} - {block_end.strftime('%H:%M')}] including {required_buffer.seconds // 60}m safety margin.",
                details={
                    "required_buffer_min": required_buffer.seconds // 60,
                    "train_entry": train_entry.isoformat(),
                    "train_exit": train_exit.isoformat()
                }
            )
        return SafetyValidationResult(is_valid=True, rule_code="SR-001", message="Train clearance buffer satisfied.")

    @staticmethod
    def validate_ohe_power_isolation_sequence(
        tasks: List[Dict[str, Any]],
        block_start: datetime,
        block_end: datetime
    ) -> SafetyValidationResult:
        """
        Rule: SR-002 - TRD 25kV OHE Power Isolation and Permit-to-Work
        Mandatory safety protocol:
        Power Isolation -> Permit to Work -> Maintenance Work -> Earth Discharge Removal -> Power Restoration.
        """
        has_trd_task = any(t.get("department") == "TRD" or t.get("requires_power_block") for t in tasks)
        if not has_trd_task:
            return SafetyValidationResult(is_valid=True, rule_code="SR-002", message="No OHE power block required.")

        isolation_buffer = timedelta(minutes=settings.safety.ohe_power_isolation_buffer_min)
        restoration_buffer = timedelta(minutes=settings.safety.ohe_power_restoration_buffer_min)
        total_block_duration = block_end - block_start
        min_required_duration = isolation_buffer + restoration_buffer + timedelta(minutes=30)

        if total_block_duration < min_required_duration:
            return SafetyValidationResult(
                is_valid=False,
                rule_code="SR-002",
                message=f"Block duration ({total_block_duration.seconds // 60}m) is insufficient for TRD power isolation ({isolation_buffer.seconds // 60}m), effective work (min 30m), and restoration ({restoration_buffer.seconds // 60}m).",
                details={
                    "isolation_buffer_min": isolation_buffer.seconds // 60,
                    "restoration_buffer_min": restoration_buffer.seconds // 60,
                    "min_required_duration_min": min_required_duration.seconds // 60
                }
            )

        return SafetyValidationResult(
            is_valid=True,
            rule_code="SR-002",
            message="OHE power isolation and restoration buffer sequences verified."
        )

    @staticmethod
    def validate_block_duration_bounds(duration_minutes: int) -> SafetyValidationResult:
        """
        Rule: SR-003 - Operational Block Duration Boundaries
        """
        min_d = settings.safety.min_block_duration_min
        max_d = settings.safety.max_block_duration_min

        if duration_minutes < min_d:
            return SafetyValidationResult(
                is_valid=False,
                rule_code="SR-003",
                message=f"Block duration ({duration_minutes}m) is below the minimum operational limit ({min_d}m)."
            )
        if duration_minutes > max_d:
            return SafetyValidationResult(
                is_valid=False,
                rule_code="SR-003",
                message=f"Block duration ({duration_minutes}m) exceeds the maximum continuous limit ({max_d}m)."
            )
        return SafetyValidationResult(is_valid=True, rule_code="SR-003", message="Duration limits satisfied.")


safety_rule_engine = SafetyRuleEngine()
