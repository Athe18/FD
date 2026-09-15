from app.ml.inference import ml_engine


def test_ml_asset_failure_risk_prediction():
    res = ml_engine.predict_asset_risk(
        health_score=45.0,
        overdue_days=14.0,
        ultrasonic_defect_count=3,
        cumulative_traffic_gmt=45.0
    )
    assert "failure_probability" in res
    assert res["failure_probability"] > 0.0
    assert res["risk_category"] in ("CRITICAL", "HIGH", "MEDIUM", "LOW")
    assert "model_metadata" in res
    assert res["model_metadata"]["roc_auc"] > 0.70


def test_ml_delay_prediction():
    res = ml_engine.predict_train_delay(
        traffic_density=38.5,
        block_duration_min=120,
        train_priority=2
    )
    assert "predicted_delay_minutes" in res
    assert res["predicted_delay_minutes"] >= 0.0
    assert "model_metadata" in res
    assert res["model_metadata"]["r2_score"] > 0.60
