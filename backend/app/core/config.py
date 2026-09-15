"""
Prabal Central Business and System Configuration
=================================================
Central authority for all railway domain parameters, safety rules,
priority weights, optimization targets, and data source thresholds.

Note: Safety rule parameters are explicitly labeled as PROTOTYPE_DEMO_RULE
unless directly backed by verified railway manual citations.
"""

from typing import Dict, Any, List
from pydantic_settings import BaseSettings
from pydantic import Field


class SafetyRuleConfig(BaseSettings):
    """
    Safety rules configuration.
    Hard constraints enforced deterministically by the Safety Rule Engine.
    """
    # Safety buffer before and after train movement in the section (in minutes)
    train_clearance_buffer_min: int = Field(
        default=15,
        description="Buffer time before/after scheduled train run required for maintenance block (PROTOTYPE_DEMO_RULE: Standard operational safety margin)."
    )
    
    # Minimum and maximum allowable maintenance block duration (in minutes)
    min_block_duration_min: int = Field(
        default=60,
        description="Minimum duration for an operational block window (PROTOTYPE_DEMO_RULE)."
    )
    max_block_duration_min: int = Field(
        default=360,
        description="Maximum allowable single continuous block duration (6 hours) (PROTOTYPE_DEMO_RULE)."
    )
    
    # Power Isolation & Restoration mandatory sequence buffers (in minutes)
    ohe_power_isolation_buffer_min: int = Field(
        default=20,
        description="Mandatory TRD power block permit-to-work isolation duration prior to work commencement (PROTOTYPE_DEMO_RULE)."
    )
    ohe_power_restoration_buffer_min: int = Field(
        default=15,
        description="Mandatory TRD power restoration and track bonding inspection buffer post-work (PROTOTYPE_DEMO_RULE)."
    )
    
    # Safety spatial buffer for adjacent line activity (in km)
    adjacent_track_safety_buffer_km: float = Field(
        default=0.5,
        description="Spatial safety buffer around high-risk track machinery operations (PROTOTYPE_DEMO_RULE)."
    )

    rule_provenance: str = "PROTOTYPE_DEMO_RULE - Configurable parameters for SIH demonstration"


class PriorityWeightsConfig(BaseSettings):
    """
    Configurable weights for the 6-factor Maintenance Prioritization Formula.
    Weights must sum to 1.0 (100%).
    """
    criticality_weight: float = Field(default=0.30, description="Asset criticality weight (30%)")
    severity_weight: float = Field(default=0.25, description="Defect severity weight (25%)")
    overdue_weight: float = Field(default=0.20, description="Overdue days urgency weight (20%)")
    traffic_density_weight: float = Field(default=0.10, description="Corridor traffic density weight (10%)")
    safety_impact_weight: float = Field(default=0.10, description="Safety risk category weight (10%)")
    operational_impact_weight: float = Field(default=0.05, description="Passenger/Freight disruption weight (5%)")


class OptimizerWeightsConfig(BaseSettings):
    """
    Weights for Google OR-Tools CP-SAT Soft Objectives.
    """
    weight_consolidation: int = 1000       # Multi-department task bundling reward
    weight_priority_completion: int = 500  # High-priority task completion reward
    weight_minimize_delay: int = 300       # Penalty for train delay minutes
    weight_minimize_block_hours: int = 100 # Penalty for excessive total track occupancy
    weight_minimize_transit: int = 50      # Penalty for machine transit time


class Settings(BaseSettings):
    PROJECT_NAME: str = "Prabal"
    PROJECT_TAGLINE: str = "Intelligent Railway Maintenance Coordination & Automatic Block Optimization Platform"
    API_V1_STR: str = "/api/v1"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    
    # Database: Supabase / PostgreSQL (System of Record)
    # Default points to local or hosted PostgreSQL connection string
    DATABASE_URL: str = "postgresql+psycopg://postgres:postgres@localhost:5432/prabal_railway"
    
    # Supabase credentials (optional for managed cloud)
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    
    # LLM Provider Configuration (Configurable abstraction)
    LLM_PROVIDER: str = "mock"  # "mock", "gemini", "openai"
    LLM_API_KEY: str = ""
    LLM_MODEL: str = "gemini-2.0-flash"
    
    # Planning Horizon (Configurable: default 7 days for SIH evaluation)
    PLANNING_HORIZON_DAYS: int = 7
    
    # Safety & Priority Sub-configurations
    safety: SafetyRuleConfig = SafetyRuleConfig()
    priority_weights: PriorityWeightsConfig = PriorityWeightsConfig()
    optimizer_weights: OptimizerWeightsConfig = OptimizerWeightsConfig()
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ]

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8", "case_sensitive": True, "extra": "ignore"}


settings = Settings()
