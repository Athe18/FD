from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root_endpoint():
    res = client.get("/")
    assert res.status_code == 200
    data = res.json()
    assert data["platform"] == "Prabal"
    assert data["status"] == "OPERATIONAL"


def test_infrastructure_corridor():
    res = client.get("/api/v1/infrastructure/corridor")
    assert res.status_code == 200
    data = res.json()
    assert "stations" in data
    assert len(data["stations"]) > 0


def test_maintenance_critical():
    res = client.get("/api/v1/maintenance/critical")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) > 0


def test_planning_run_and_active():
    res = client.post("/api/v1/planning/run")
    assert res.status_code == 200
    plan = res.json()
    assert "result" in plan
    assert plan["result"]["solver_status"] in ("OPTIMAL", "FEASIBLE")

    res_active = client.get("/api/v1/planning/active")
    assert res_active.status_code == 200
    active_data = res_active.json()
    assert active_data["plan_id"] == "PLAN-2026-CR-001"


def test_simulation_whatif():
    res = client.post("/api/v1/simulation/what-if", json={
        "block_code": "BLK-001",
        "new_start_hour": 15,
        "new_start_minute": 0
    })
    assert res.status_code == 200
    data = res.json()
    assert "deltas" in data
    assert "before" in data
    assert "after" in data


def test_ai_chat():
    res = client.post("/api/v1/ai/chat", json={
        "message": "Why did Prabal recommend this consolidated block?"
    })
    assert res.status_code == 200
    data = res.json()
    assert "response" in data
    assert "tools_executed" in data
    assert "run_corridor_optimization" in data["tools_executed"]
