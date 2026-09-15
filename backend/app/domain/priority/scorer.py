"""
Deterministic Maintenance Priority & Risk Engine
=================================================
Calculates asset maintenance urgency using a 6-factor weighted model.
Weights are fully configurable via settings and recorded for auditability.
"""

from typing import Dict, Any, Tuple
from app.core.config import settings


class PriorityEngine:
    """
    Evaluates maintenance tasks and assigns explainable priority scores.
    """

    SEVERITY_SCORES = {
        "CRITICAL": 1.0,
        "MAJOR": 0.75,
        "MODERATE": 0.45,
        "MINOR": 0.20
    }

    SAFETY_IMPACT_SCORES = {
        "CRITICAL": 1.0,  # Direct derailment / OHE snapping / collision risk
        "HIGH": 0.70,      # Speed cautionary order imposed
        "MEDIUM": 0.40,    # Asset degradation
        "LOW": 0.15        # Cosmetic or preventive
    }

    @classmethod
    def calculate_priority(
        cls,
        asset_criticality: float,        # 0.0 to 1.0
        defect_severity: str,           # "CRITICAL", "MAJOR", "MODERATE", "MINOR"
        overdue_days: int,              # >= 0
        corridor_traffic_gmt: float,     # Gross Million Tonnes (e.g. 10 to 60)
        safety_risk_category: str,      # "CRITICAL", "HIGH", "MEDIUM", "LOW"
        operational_impact_score: float  # 0.0 to 1.0
    ) -> Dict[str, Any]:
        """
        Calculates standardized 0-100 score and returns explainable feature breakdown.
        """
        weights = settings.priority_weights
        
        # 1. Criticality Factor (0.0 to 1.0)
        c_val = max(0.0, min(1.0, asset_criticality))
        
        # 2. Defect Severity Factor (0.0 to 1.0)
        s_val = cls.SEVERITY_SCORES.get(defect_severity.upper(), 0.3)
        
        # 3. Overdue Factor: Sigmoid/Logarithmic saturation (0.0 to 1.0)
        # 0 days = 0.0, 7 days = 0.5, 14+ days -> 1.0
        o_val = min(1.0, overdue_days / 14.0) if overdue_days > 0 else 0.0
        
        # 4. Traffic Density Factor: Normalized against 60 GMT heavy trunk capacity
        t_val = min(1.0, max(0.0, corridor_traffic_gmt / 60.0))
        
        # 5. Safety Impact Factor
        sf_val = cls.SAFETY_IMPACT_SCORES.get(safety_risk_category.upper(), 0.3)
        
        # 6. Operational Impact Factor
        op_val = max(0.0, min(1.0, operational_impact_score))
        
        # Weighted combination
        raw_score = (
            (weights.criticality_weight * c_val) +
            (weights.severity_weight * s_val) +
            (weights.overdue_weight * o_val) +
            (weights.traffic_density_weight * t_val) +
            (weights.safety_impact_weight * sf_val) +
            (weights.operational_impact_weight * op_val)
        ) * 100.0
        
        final_score = round(max(0.0, min(100.0, raw_score)), 2)
        
        # Determine Risk Level & Recommended Urgency
        if final_score >= 80.0:
            risk_level = "CRITICAL"
            urgency = "WITHIN_24_HOURS"
        elif final_score >= 65.0:
            risk_level = "HIGH"
            urgency = "WITHIN_3_DAYS"
        elif final_score >= 40.0:
            risk_level = "MEDIUM"
            urgency = "WITHIN_WEEK"
        else:
            risk_level = "LOW"
            urgency = "ROUTINE"
            
        return {
            "priority_score": final_score,
            "risk_level": risk_level,
            "recommended_urgency": urgency,
            "weights_used": {
                "criticality": weights.criticality_weight,
                "severity": weights.severity_weight,
                "overdue": weights.overdue_weight,
                "traffic": weights.traffic_density_weight,
                "safety": weights.safety_impact_weight,
                "operational_impact": weights.operational_impact_weight
            },
            "factor_values": {
                "asset_criticality": c_val,
                "defect_severity": s_val,
                "overdue_normalized": round(o_val, 2),
                "traffic_density_normalized": round(t_val, 2),
                "safety_risk": sf_val,
                "operational_disruption": op_val
            },
            "justification": f"Score {final_score}/100 based on {defect_severity} severity, {overdue_days}d overdue status, and {risk_level} asset risk."
        }


priority_engine = PriorityEngine()
