from datetime import datetime, timedelta
from app.optimization.optimizer import block_optimizer
from scripts.synthetic_data_generator import generate_prabal_dataset


def test_ortools_optimizer_consolidation():
    data = generate_prabal_dataset()
    base_date = datetime(2026, 9, 15, 0, 0)
    
    result = block_optimizer.optimize_corridor_blocks(
        planning_start=base_date + timedelta(hours=6),
        planning_end=base_date + timedelta(hours=22),
        tasks=data["tasks"],
        train_schedules=data["train_schedules"],
        teams=data["teams"],
        equipment=data["equipment"],
        inventory=data["inventory"]
    )

    assert result["solver_status"] in ("OPTIMAL", "FEASIBLE")
    assert len(result["blocks"]) > 0
    
    # Check that multi-department tasks were bundled
    first_block = result["blocks"][0]
    assert len(first_block["departments"]) >= 2  # Engg, TRD, S&T consolidated
    assert first_block["separate_blocks_avoided"] >= 1
    assert result["metrics"]["blocks_saved"] >= 1
    assert result["metrics"]["train_delay_minutes"] == 0
    assert result["metrics"]["tasks_scheduled"] == 3
