# PRABAL
## Intelligent Railway Maintenance Coordination & Automatic Block Optimization Platform (SIH 2026)

**Prabal** is an enterprise-grade railway operations platform designed for Indian Railways to solve the challenge of fragmented departmental maintenance planning across **Engineering (P-Way), Traction Distribution (TRD), and Signalling & Telecommunication (S&T)**.

---

## 🌟 Key Innovations & USPs

1. **Hybrid Architecture**: Real mathematical constraint optimization using **Google OR-Tools CP-SAT**, guaranteeing zero hallucinations for safety-critical railway scheduling.
2. **Shadow Block Consolidation**: Dynamically bundles co-located maintenance tasks across 3 departments into single coordinated windows, saving **2 separate track closures** and **1.75 hours of track occupancy** with **0 passenger train delay**.
3. **Deterministic What-If Sandbox**: Planners can shift or resize block windows and immediately inspect exact mathematical Before vs After deltas.
4. **Dynamic Real-Time Re-Planning**: Ingests live RTIS GPS train delay events, detects collisions on active blocks, and solves for conflict-free alternatives in real time.
5. **Authentic RAG & Grounded Explainability**: Natural-language co-pilot backed by loaded Indian Railways manuals (**IRPWM 2020, ACTM Vol II, SEM Part I, CRIS Guidelines**), with strict policy to cite only loaded documents or output *"Source not available"*.
6. **10-State Human Approval Workflow**: Section Controllers retain ultimate sign-off authority through an immutable versioned plan lifecycle (`DRAFT` $\to$ `AI_RECOMMENDED` $\to$ `APPROVED`).

---

## 🚀 Quick Start Guide

### 1. Start the FastAPI Backend
```bash
cd backend
python run.py
```
- API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)
- Base API Endpoint: [http://localhost:8000/api/v1](http://localhost:8000/api/v1)

### 2. Start the Next.js Command Center
```bash
cd frontend
npm run dev
```
- Web Application: [http://localhost:3000](http://localhost:3000)

### 3. Run Automated Tests
```bash
cd backend
pytest tests/
```

---

## 🧭 Major Web Application Modules

| Module | Route | Purpose |
| :--- | :--- | :--- |
| **Command Dashboard** | `/` | Live corridor health, comparative KPIs (Manual vs Prabal), recommended block card |
| **Gantt Planning Board** | `/planning` | Interactive string chart of train paths vs consolidated departmental blocks |
| **Railway Network Map** | `/map` | MapLibre GL JS geospatial topology with station markers and defect zones |
| **Conflict Center** | `/conflicts` | Multi-dimensional collision matrix & live RTIS delay simulator |
| **What-If Sandbox** | `/whatif` | Interactive time slider with Before vs After mathematical delta comparator |
| **Asset Health & Risk** | `/assets` | ML-driven failure probability scoring, USFD flaw logs, and condition tags |
| **Approval & Audit** | `/approvals` | 10-state Section Controller sign-off workflow & immutable plan version history |
| **Integrations & Freshness**| `/integrations` | Connector health, freshness latency, and quality tags (TMS, TDMS, SMMS, RTIS) |
| **Reports & Exports** | `/reports` | 1-Click download of official PDF Block Plans, Excel workbooks, and CSV streams |
| **Prabal AI Co-Pilot** | Top-Right Drawer | Grounded intelligent assistant with tool execution badges and manual citations |

---

## 📚 Technical Documentation
- [Architecture & System Design](docs/architecture.md)
- [Mathematical CP-SAT Formulation](docs/optimization_formulation.md)
- [SIH 2026 Evaluation Script](docs/sih_demo_guide.md)
