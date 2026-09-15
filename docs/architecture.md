# PRABAL: Architectural Specification & System Design
## Intelligent Railway Maintenance Coordination & Automatic Block Optimization Platform (SIH 2026)

---

## 1. System Overview
**Prabal** is an enterprise-grade railway maintenance coordination, decision-support, and automatic block optimization platform developed for Indian Railways. It acts as an intelligent interoperability and optimization layer over existing siloed systems (**TMS, TDMS, SMMS, COA, RTIS, NTES, FOIS**).

### Core Principle: Hybrid AI + Mathematical Optimization
Prabal strictly adheres to the principle that **an LLM is never the scheduling or safety authority**:
- **Deterministic Core (OR-Tools CP-SAT + Safety Rule Engine)**: Mathematically computes candidate windows, verifies train safety headway buffers, consolidates cross-departmental tasks, and calculates exact objective scores.
- **Agentic AI Layer (Supervisor + Tool Calling + RAG)**: Interprets natural language, invokes deterministic calculation tools, queries verified railway manuals, and provides human-understandable justifications.
- **Human-in-the-Loop**: All final operational blocks require explicit Section Controller approval through an immutable 10-state lifecycle.

---

## 2. Layered Architecture

```text
┌────────────────────────────────────────────────────────┐
│   Railway Systems / Simulators (TMS, TDMS, SMMS, COA, RTIS, NTES, FOIS, Weather)  │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│   Integration Layer (BaseConnector Adapters & Data Freshness Tracker)   │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│   System of Record: PostgreSQL / Supabase + PostGIS + pgvector          │
└───────────────────────────┬────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
┌───────────────────────┐       ┌────────────────────────┐
│ Safety Rule Engine    │       │ Maintenance Priority   │
│ (Hard Constraints)    │       │ & Risk Engine          │
└───────────┬───────────┘       └───────────┬────────────┘
            │                               │
            └───────────────┬───────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│   Multi-Dimensional Conflict Detection Engine          │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│   Google OR-Tools CP-SAT Mathematical Block Optimizer  │
└───────────────────────────┬────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
┌───────────────────────┐       ┌────────────────────────┐
│ What-If Simulator     │       │ Dynamic Re-Planning    │
│ (Deterministic Delta) │       │ (Live RTIS Disruption) │
└───────────┬───────────┘       └───────────┬────────────┘
            │                               │
            └───────────────┬───────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│   Prabal AI Supervisor & Explainability Co-Pilot       │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│   Human-in-the-Loop Section Controller Approval        │
│   (10 Operational States & Immutable Plan Versioning)  │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│   Railway Command Center UI (Next.js + MapLibre GL)   │
└────────────────────────────────────────────────────────┘
```

---

## 3. Approval Lifecycle States

Prabal implements 10 explicit operational states for full auditability:
1. `DRAFT`: Initial draft plan generated.
2. `AI_RECOMMENDED`: Optimal CP-SAT consolidated block proposed.
3. `PLANNER_REVIEW`: Corridor planner evaluating candidate windows.
4. `MODIFIED`: Plan adjusted via What-If sandbox or dynamic re-planning.
5. `PENDING_APPROVAL`: Submitted to Division Operating Branch.
6. `APPROVED`: Formally signed off by Section Chief Controller.
7. `REJECTED`: Rejected with explicit operational reason.
8. `ACTIVE`: Live block currently underway on track.
9. `COMPLETED`: Maintenance completed and track restored to traffic.
10. `CANCELLED`: Block cancelled prior to execution.
