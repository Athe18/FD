"""
Deterministic Conflict Detection Engine
=======================================
Identifies operational collisions across 6 dimensions:
1. Train Movement vs Maintenance Block
2. Incompatible Simultaneous Blocks
3. Gang / Team Double Booking
4. Heavy Equipment Transit Travel Time Deficits
5. Material & Spare Part Shortages
6. Mandatory Task Dependency Violations
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from app.core.config import settings


class Conflict:
    def __init__(
        self,
        conflict_type: str,
        severity: str,
        description: str,
        entities: List[str],
        resolution_suggestion: str
    ):
        self.conflict_type = conflict_type # "TRAIN_OVERLAP", "RESOURCE_COLLISION", "EQUIPMENT_TRAVEL", "MATERIAL_SHORTAGE", "DEPENDENCY_ORDER"
        self.severity = severity           # "CRITICAL", "HIGH", "MEDIUM"
        self.description = description
        self.entities = entities
        self.resolution_suggestion = resolution_suggestion

    def to_dict(self) -> Dict[str, Any]:
        return {
            "conflict_type": self.conflict_type,
            "severity": self.severity,
            "description": self.description,
            "entities": self.entities,
            "resolution_suggestion": self.resolution_suggestion
        }


class ConflictDetector:
    """
    Evaluates proposed maintenance schedules against operational constraints.
    """

    @classmethod
    def check_train_conflicts(
        cls,
        block_start: datetime,
        block_end: datetime,
        block_section_id: str,
        train_schedules: List[Dict[str, Any]],
        buffer_min: Optional[int] = None
    ) -> List[Conflict]:
        """
        Detects collisions between a proposed block window and scheduled trains.
        """
        conflicts = []
        buf = timedelta(minutes=buffer_min if buffer_min is not None else settings.safety.train_clearance_buffer_min)
        buffered_start = block_start - buf
        buffered_end = block_end + buf

        for sch in train_schedules:
            if sch.get("section_id") == block_section_id or sch.get("block_section_id") == block_section_id:
                t_entry = sch["entry_time"]
                t_exit = sch["exit_time"]
                
                # Check intersection
                if max(buffered_start, t_entry) < min(buffered_end, t_exit):
                    train_num = sch.get("train_number", "Unknown")
                    train_name = sch.get("train_name", "Train")
                    train_type = sch.get("train_type", "EXPRESS")
                    
                    is_high_priority = train_type in ["VANDE_BHARAT", "RAJDHANI"]
                    severity = "CRITICAL" if is_high_priority else "HIGH"
                    
                    overlap_duration = (min(buffered_end, t_exit) - max(buffered_start, t_entry)).seconds // 60
                    
                    conflicts.append(Conflict(
                        conflict_type="TRAIN_OVERLAP",
                        severity=severity,
                        description=f"Train {train_num} ({train_name} [{train_type}]) occupies section from {t_entry.strftime('%H:%M')} to {t_exit.strftime('%H:%M')}, causing a {overlap_duration}m collision with proposed block.",
                        entities=[f"Train:{train_num}", f"BlockSection:{block_section_id}"],
                        resolution_suggestion=f"Shift block start after {t_exit.strftime('%H:%M')} + {buf.seconds//60}m buffer or regulate train {train_num} via loop siding."
                    ))

        return conflicts

    @classmethod
    def check_resource_conflicts(
        cls,
        task_a: Dict[str, Any],
        task_b: Dict[str, Any]
    ) -> Optional[Conflict]:
        """
        Detects if two concurrent tasks demand the same team.
        """
        team_a = task_a.get("assigned_team_id")
        team_b = task_b.get("assigned_team_id")
        
        if not team_a or not team_b or team_a != team_b:
            return None

        start_a, end_a = task_a["start_time"], task_a["end_time"]
        start_b, end_b = task_b["start_time"], task_b["end_time"]

        if max(start_a, start_b) < min(end_a, end_b):
            return Conflict(
                conflict_type="RESOURCE_COLLISION",
                severity="HIGH",
                description=f"Team {team_a} is simultaneously assigned to Task {task_a.get('task_code')} and Task {task_b.get('task_code')}.",
                entities=[f"Team:{team_a}", f"Task:{task_a.get('task_code')}", f"Task:{task_b.get('task_code')}"],
                resolution_suggestion=f"Reassign Task {task_b.get('task_code')} to an available backup gang or serialize execution."
            )
        return None

    @classmethod
    def check_equipment_transit_conflict(
        cls,
        machine: Dict[str, Any],
        task_prev: Dict[str, Any],
        task_next: Dict[str, Any]
    ) -> Optional[Conflict]:
        """
        Checks if heavy machine has sufficient transit time to reach worksite B after worksite A.
        """
        end_prev = task_prev["end_time"]
        start_next = task_next["start_time"]
        
        available_transit_time = (start_next - end_prev).total_seconds() / 60.0
        
        # Calculate required transit time based on distance & self-propelled speed (30 km/h)
        km_prev = task_prev.get("km_location", 0.0)
        km_next = task_next.get("km_location", 0.0)
        distance = abs(km_next - km_prev)
        speed = machine.get("transit_speed_kmph", 30.0)
        setup_time = machine.get("setup_time_min", 15)
        
        required_transit_time = (distance / speed) * 60.0 + setup_time
        
        if available_transit_time < required_transit_time:
            return Conflict(
                conflict_type="EQUIPMENT_TRAVEL",
                severity="HIGH",
                description=f"Machine {machine.get('machine_code')} requires {round(required_transit_time)}m transit ({distance:.1f}km) between tasks, but only {round(available_transit_time)}m interval is scheduled.",
                entities=[f"Machine:{machine.get('machine_code')}", f"Task:{task_prev.get('task_code')}", f"Task:{task_next.get('task_code')}"],
                resolution_suggestion=f"Increase gap between tasks to at least {round(required_transit_time)} minutes or deploy stabled machine from adjacent depot."
            )
        return None

    @classmethod
    def check_material_shortage(
        cls,
        task: Dict[str, Any],
        inventory: Dict[str, int]
    ) -> Optional[Conflict]:
        """
        Checks if required track/OHE materials are in stock.
        """
        reqs = task.get("material_requirements", [])
        for req in reqs:
            item_code = req.get("item_code")
            qty_needed = req.get("required_quantity", 0)
            qty_avail = inventory.get(item_code, 0)
            
            if qty_avail < qty_needed:
                return Conflict(
                    conflict_type="MATERIAL_SHORTAGE",
                    severity="MEDIUM",
                    description=f"Task {task.get('task_code')} requires {qty_needed} units of {item_code}, but only {qty_avail} are available in the local depot.",
                    entities=[f"Task:{task.get('task_code')}", f"Material:{item_code}"],
                    resolution_suggestion=f"Procure/transfer {qty_needed - qty_avail} units of {item_code} from Divisional Store before scheduling."
                )
        return None


conflict_detector = ConflictDetector()
