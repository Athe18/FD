# PRABAL: Technical System Audit & Real-Data Modernization Report
## Comprehensive Codebase, Data Truth, and Architecture Assessment

---

## 1. Executive Summary

This audit evaluates the current state of **PRABAL**, distinguishing what is genuinely calculated, what is simulated, what is real external data, and what must be upgraded to meet the enterprise real-data and ML standards.

---

## 2. Technical Audit Matrix

| Layer / Component | Current State | Target Enhancement | Classification |
| :--- | :--- | :--- | :--- |
| **Railway Infrastructure** | 50 km Kalyan-Igatpuri Thal Ghat multi-track network in PostgreSQL/PostGIS. | Ingest real open Indian Railways station dataset from official open data (data.gov.in / Ministry of Railways). | `REAL_PUBLIC` + `CONTROLLED_DOMAIN` |
| **Train Timetable & Schedules** | Realistic schedules matching Central Railway timings. | Ingest real publicly published timetable paths for Central Railway Express & Freight trains. | `REAL_PUBLIC` |
| **Weather & Environmental** | Basic weather connector. | Real live Open-Meteo weather API integration influencing block scoring. | `REAL_EXTERNAL` |
| **Legacy Railway Systems (TMS, TDMS, SMMS, COA, RTIS, FOIS)** | Simulated mock connectors with CRIS schemas. | Explicit labeling as `SIMULATED` simulation feeds; adapter architecture ready for authorized endpoints. | `SIMULATED` |
| **Machine Learning (Asset Risk & Delay)** | Heuristic failure probabilities. | **Train real Supervised ML models** (`RandomForest` / `GradientBoosting`) with saved `.joblib` artifacts and calculated ROC-AUC/F1/MAE metrics. | **REAL ML** |
| **Deterministic Priority Engine** | Configurable 6-factor weighted math formula. | Retain as deterministic baseline and fuse with ML risk prediction. | `CALCULATED` |
| **Safety Rule Engine** | Deterministic train clearance, TRD power isolation, and duration bounds. | Retain with explicit `PROTOTYPE_DEMO_RULE` labeling. | `CALCULATED` |
| **Google OR-Tools CP-SAT Optimizer** | Real mathematical constraint solver for multi-department consolidation. | Real mathematical solver producing 100% runtime calculated metrics. | `CALCULATED` |
| **What-If Sandbox & Re-Planner** | Deterministic recalculation via conflict & solver engines. | Retain exact runtime deltas with zero LLM fabrication. | `CALCULATED` |
| **Agentic AI & Knowledge Base** | Tool-calling supervisor + pgvector/manual store. | Full tool registry executing deterministic backend services + strict authentic citations. | `AGENTIC_AI` |
| **Frontend UX & Information Architecture** | Dense cards dashboard. | **Redesign into professional railway control center** with Hero Recommended Block decision panel, compact KPI strip, and `Ctrl+K` global search. | `UX_REDESIGN` |

---

## 3. Data Truth Classifications

Every data stream in PRABAL is classified into one of the following explicit categories:
1. `REAL_PUBLIC`: Open government data and published railway network schedules.
2. `REAL_EXTERNAL`: Third-party APIs (e.g. Open-Meteo weather).
3. `AUTHORIZED`: Protected CRIS systems when authorized credentials exist.
4. `CONTROLLED_DOMAIN`: Railway engineering manual parameters and domain rules.
5. `SIMULATED`: Realistic simulated operational feeds where real internal APIs are confidential.
6. `DERIVED`: Outputs computed by ML models, the rule engine, or the OR-Tools solver.
