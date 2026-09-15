# Google OR-Tools CP-SAT Block Optimization Formulation
## Prabal Mathematical Constraint Optimization Engine

---

## 1. Problem Formulation

The Railway Maintenance Block Optimization problem on a multi-track corridor is modeled as a discrete-time Constraint Satisfaction and Multi-Objective Optimization Problem (COP).

Let:
- $\mathcal{T} = \{t_1, t_2, \dots, t_N\}$ be the set of pending maintenance tasks across Engineering, TRD, and S&T.
- $\mathcal{S} = \{s_1, s_2, \dots, s_M\}$ be the set of scheduled train movements through the corridor.
- $\mathcal{G} = \{g_1, g_2, \dots, g_K\}$ be the available maintenance gangs/teams per department.
- $\mathcal{H} = [0, T]$ be the discrete planning horizon discretized into $\Delta \tau = 15$-minute intervals.

---

## 2. Hard Constraints (Non-Negotiable Railway Safety Rules)

### 2.1 Train-Block Headway Clearance (Safety Rule SR-001)
For every scheduled task $t \in \mathcal{T}$ and train movement $s \in \mathcal{S}$ sharing the same block section $\mathcal{B}$:
$$\text{End}(t) + \delta_{\text{clearance}} \le \text{Entry}(s) \quad \lor \quad \text{Start}(t) - \delta_{\text{clearance}} \ge \text{Exit}(s)$$
where $\delta_{\text{clearance}} = 15 \text{ min}$ is the required safety headway margin.

### 2.2 Gang Cumulative Capacity
For each department $d \in \{\text{ENGG}, \text{TRD}, \text{SNT}\}$ and any time step $\tau \in \mathcal{H}$:
$$\sum_{t \in \mathcal{T}_d} \mathbb{I}(\text{Start}(t) \le \tau < \text{End}(t)) \le |\mathcal{G}_d|$$

### 2.3 Power Isolation Sequence (Safety Rule SR-002)
For any block containing TRD 25kV OHE maintenance:
$$\text{Duration}(\text{Block}) \ge \delta_{\text{isolation}} + \text{Duration}(t_{\text{TRD}}) + \delta_{\text{restoration}}$$
where $\delta_{\text{isolation}} = 20\text{m}$ and $\delta_{\text{restoration}} = 15\text{m}$.

### 2.4 Heavy Machine Transit Matrix
For any machine assigned sequentially to task $t_A$ at $km_A$ and task $t_B$ at $km_B$:
$$\text{Start}(t_B) - \text{End}(t_A) \ge \frac{|km_B - km_A|}{v_{\text{machine}}} + \tau_{\text{setup}}$$

---

## 3. Soft Multi-Objective Optimization Function

The CP-SAT solver maximizes the global utility function:

$$\max \quad \mathcal{Z} = W_{\text{consol}} \sum_{i < j} \mathcal{C}_{ij} + W_{\text{prio}} \sum_{t} \mathcal{P}_t \cdot x_t - W_{\text{hours}} \sum_{t} \text{End}(t) - W_{\text{delay}} \sum_{s} \text{Delay}(s)$$

Where:
- $\mathcal{C}_{ij} \in \{0, 1\}$ is a Boolean variable indicating successful cross-departmental consolidation of task $i$ and task $j$ into a single coordinated block.
- $\mathcal{P}_t$ is the 6-factor priority score of task $t$.
- $x_t \in \{0, 1\}$ indicates whether task $t$ was scheduled in the horizon.
- $W_{\text{consol}} = 1000$, $W_{\text{prio}} = 500$, $W_{\text{hours}} = 100$, $W_{\text{delay}} = 300$ are configurable objective weights.

---

## 4. Calculated Runtime Output Metrics

All output metrics are calculated dynamically from solver decision variables:
1. $\text{Blocks Saved} = \text{Tasks Scheduled} - \text{Coordinated Blocks Formed}$
2. $\text{Block Utilization \%} = \frac{\sum \text{Task Durations}}{\text{Block Duration} \times \text{Number of Departments}} \times 100\%$
3. $\text{Block Hours Saved} = \sum \text{Manual Task Durations} - \sum \text{Coordinated Block Durations}$
4. $\text{Passenger Delay} = 0 \text{ min}$ (when fitted into natural headway gap).
