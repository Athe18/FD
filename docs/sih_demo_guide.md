# SIH 2026 Live Demonstration Script
## Prabal: Intelligent Railway Maintenance Coordination & Automatic Block Optimization

---

## 1. Demonstration Scenario Overview
- **Corridor**: Kalyan – Igatpuri (Thal Ghat Section, Central Railway Mumbai Division, 50 km).
- **Incoming Requests**:
  1. **Engineering**: Rail defect (IMR flaw) at KM 125.4 (2-hour duration, Critical severity, Overdue 14 days).
  2. **TRD (Traction Distribution)**: 25kV OHE Cantilever adjustment at KM 125.4 (1-hour duration, High severity, Power block required).
  3. **S&T (Signalling & Telecom)**: Point machine backlash adjustment at KM 126.0 (1-hour duration, High severity).
- **Corridor Traffic**: High-density Rajdhani, Vande Bharat, Suburban EMU Locals, and Container Freight.

---

## 2. Step-by-Step Evaluation Walkthrough

### Step 1: Command Dashboard & Multi-Department Ingestion
1. Open Command Dashboard (`http://localhost:3000`).
2. Point out the **Comparative KPI Card** (Manual Scheduling vs Prabal CP-SAT):
   - **Separate Blocks Avoided:** 2 blocks saved (1 Coordinated vs 3 Separate).
   - **Track Occupancy Saved:** 1.75 hours saved for train traffic.
   - **Passenger Train Delay:** 0 minutes.
   - **Block Utilization:** 87.5%.
3. Point out the **Recommended Coordinated Block (`BLK-001`)** scheduled at **11:30 – 13:30**, consolidating Engineering, TRD, and S&T tasks in the natural headway gap between morning and afternoon express trains.

---

### Step 2: Interactive Multi-Track Gantt Planning Board
1. Navigate to `/planning`.
2. Inspect the interactive time string chart (06:00 to 20:00).
3. Demonstrate the color-coded train paths (Blue = Vande Bharat/Rajdhani, Green = Mail/Express, Slate = Freight).
4. Click on the golden **BLK-001** block to open the inspection drawer showing all 3 bundled departmental tasks.

---

### Step 3: MapLibre GL JS Railway Geospatial Topology
1. Navigate to `/map`.
2. Observe the interactive MapLibre track network connecting Kalyan Junction $\to$ Titwala $\to$ Asangaon $\to$ Kasara $\to$ Igatpuri.
3. Click on station nodes to view chainage KM and platforms.
4. Observe the flashing maintenance zone marker at **KM 125.4**.

---

### Step 4: What-If Scenario Sandbox (Mathematical Recalculation)
1. Navigate to `/whatif`.
2. Ask: *"What happens if the Section Controller shifts the block from 11:30 to 15:00 (3 PM)?"*
3. Move the slider to **15:00** and click **Execute What-If Simulation**.
4. Show the side-by-side Before vs After delta:
   - **Operational Conflicts:** 0 $\to$ 1 Detected.
   - **Predicted Train Disruption:** +15 min delay on approaching Gitanjali Express (15:15).
   - **Recommendation:** `CONFLICT_DETECTED` (Not feasible without train regulation).
5. Emphasize that all deltas are **100% calculated by the deterministic conflict engine**, not hallucinated by AI.

---

### Step 5: Live RTIS Train Delay & Dynamic Re-Planning
1. Navigate to `/conflicts`.
2. Select **Train 22221 (Rajdhani Express)** and set an injected delay of **+45 minutes**.
3. Click **Inject Delay & Re-Plan**.
4. The system immediately flags a **Train Occupancy Overlap** on the UP Main Line.
5. The Google OR-Tools CP-SAT solver dynamically re-evaluates the corridor constraints and automatically presents **alternative conflict-free candidate windows** for Section Controller sign-off.

---

### Step 6: AI Decision Co-Pilot & Verified Rule Citations
1. Click the **Prabal AI Co-Pilot** button in the top right.
2. Click the quick prompt: *"Why did Prabal recommend this consolidated block?"*
3. Observe the AI explanation citing the headway gap between trains, 2 blocks saved, and verified clauses from the **CRIS Joint Operating Guidelines (Item 4.1 Shadow Blocks)**.
4. Test asking: *"Query IRPWM rule on track machine block clearance"* to see verified citations from the loaded **IRPWM 2020 Manual (Para 603)**.

---

### Step 7: Section Controller 10-State Approval & Report Export
1. Navigate to `/approvals`.
2. Review the 10-state progression (`AI_RECOMMENDED` $\to$ `APPROVED`).
3. Click **Approve & Publish Plan** to sign off as the Division Controller.
4. Navigate to `/reports` and click **Download Official PDF** to generate the printable Indian Railways Block Operating Notice.
