from datetime import datetime, timedelta
from app.domain.rules.safety_rules import safety_rule_engine


def test_train_safety_buffer_clearance():
    base = datetime(2026, 9, 15, 12, 0)
    block_start = base + timedelta(hours=1) # 13:00
    block_end = base + timedelta(hours=3)   # 15:00

    # Train from 10:00 to 10:30 -> Safe
    train_entry_safe = base - timedelta(hours=2)
    train_exit_safe = base - timedelta(hours=1, minutes=30)
    res_safe = safety_rule_engine.validate_train_safety_buffer(block_start, block_end, train_entry_safe, train_exit_safe)
    assert res_safe.is_valid is True

    # Train from 12:50 to 13:20 -> Collision (infringes on 15m safety buffer)
    train_entry_collide = base + timedelta(minutes=50) # 12:50
    train_exit_collide = base + timedelta(hours=1, minutes=20) # 13:20
    res_collide = safety_rule_engine.validate_train_safety_buffer(block_start, block_end, train_entry_collide, train_exit_collide)
    assert res_collide.is_valid is False
    assert "infringes upon block window" in res_collide.message


def test_ohe_power_isolation_sequence():
    base = datetime(2026, 9, 15, 11, 0)
    # 2-hour block with TRD task -> Sufficient for 20m iso + 15m resto + 30m work
    block_start = base
    block_end = base + timedelta(hours=2)
    trd_tasks = [{"department": "TRD", "requires_power_block": True}]
    
    res = safety_rule_engine.validate_ohe_power_isolation_sequence(trd_tasks, block_start, block_end)
    assert res.is_valid is True

    # 45-min block with TRD task -> Insufficient duration
    short_end = base + timedelta(minutes=45)
    res_short = safety_rule_engine.validate_ohe_power_isolation_sequence(trd_tasks, block_start, short_end)
    assert res_short.is_valid is False
