from datetime import datetime
from app.services.whatif_service import whatif_service
from app.services.replanning_service import replanning_service
from app.ai.tools import tool_registry


def test_whatif_window_shift():
    # Moving block to 15:00 should collide with Gitanjali Express (15:15–15:45)
    sim = tool_registry.simulate_what_if_shift("BLK-001", new_start_hour=15, new_start_minute=0)
    assert "after" in sim
    assert sim["after"]["conflicts_count"] > 0
    assert sim["deltas"]["train_delay_delta_min"] > 0
    assert sim["calculated_recommendation"] == "CONFLICT_DETECTED"


def test_dynamic_replanning_on_train_delay():
    replan = tool_registry.simulate_rtis_train_delay(train_number="22221", delay_minutes=45)
    assert replan["event_type"] == "LIVE_RTIS_TRAIN_DELAY"
    assert replan["conflicts_detected_count"] > 0
    assert replan["recommended_action"] in ("CONTROLLER_APPROVAL_REQUIRED", "MANUAL_REGULATION_REQUIRED")
