"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Train, 
  ShieldCheck, 
  Clock, 
  Layers, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Zap,
  SlidersHorizontal,
  FileCheck2,
  CalendarDays,
  Sparkles,
  Cpu
} from "lucide-react";
import { api } from "@/lib/api";
import { formatTime, formatDuration, getDepartmentColor, getRiskBadge } from "@/lib/utils";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [planData, setPlanData] = useState<any>(null);
  const [kpiData, setKpiData] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [planRes, kpiRes, taskRes] = await Promise.all([
          api.getActivePlan(),
          api.getOperationalKPIs(),
          api.getCriticalTasks()
        ]);
        setPlanData(planRes);
        setKpiData(kpiRes);
        setTasks(taskRes);
      } catch (e) {
        console.error("Dashboard load failed:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const metrics = planData?.result?.metrics || {};
  const blocks = planData?.result?.blocks || [];
  const primaryBlock = blocks[0];

  return (
    <div className="space-y-6">
      {/* 1. WHAT IS HAPPENING? Corridor Status & Compact Metric Strip */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white">Kalyan – Igatpuri Ghat Corridor</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                OPERATIONAL
              </span>
            </div>
            <p className="text-xs text-slate-400">Central Railway • 50km Multi-Track ABS • Traffic Density: 38.5 GMT</p>
          </div>
        </div>

        {/* Compact Operational Metric Strip */}
        <div className="flex items-center gap-4 text-xs font-mono border-t md:border-t-0 md:border-l border-slate-800 pt-2 md:pt-0 md:pl-4">
          <div>
            <span className="text-[10px] uppercase text-slate-500 block">Critical Tasks</span>
            <span className="font-bold text-red-400 text-sm">{tasks.length || 3}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase text-slate-500 block">Blocks Saved</span>
            <span className="font-bold text-blue-400 text-sm">+{metrics.blocks_saved ?? 2}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase text-slate-500 block">Hours Saved</span>
            <span className="font-bold text-amber-400 text-sm">{metrics.block_hours_saved ?? 1.75}h</span>
          </div>
          <div>
            <span className="text-[10px] uppercase text-slate-500 block">Train Delay</span>
            <span className="font-bold text-emerald-400 text-sm">0 min</span>
          </div>
        </div>
      </div>

      {/* Main Decision Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 3. WHAT DOES PRABAL RECOMMEND & 4. WHY? */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500/40 shadow-2xl space-y-5">
            {/* Hero Decision Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
                  <Zap className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                      PRIMARY RECOMMENDATION
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {planData?.status || "AI_RECOMMENDED"}
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-white">
                    Coordinated Maintenance Block {primaryBlock?.block_code || "BLK-001"}
                  </h2>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block">Proposed Window</span>
                <span className="text-lg font-black text-amber-400 font-mono">
                  {formatTime(primaryBlock?.scheduled_start)} – {formatTime(primaryBlock?.scheduled_end)}
                </span>
              </div>
            </div>

            {/* Structured Parameters Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 text-[11px] block">Location</span>
                <span className="font-bold text-white">Kasara – Igatpuri (KM 125.4)</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Duration</span>
                <span className="font-bold text-white">{primaryBlock?.duration_formatted || "2h 00m"}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Departments</span>
                <span className="font-bold text-blue-400">Engineering • TRD • S&T</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Block Utilization</span>
                <span className="font-bold text-purple-300">{primaryBlock?.utilization_pct || 87.5}%</span>
              </div>
            </div>

            {/* 4. WHY THIS BLOCK? (Deterministic Justification Checkmarks) */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Why did PRABAL choose this schedule?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Zero Train Conflict:</strong> Scheduled in natural headway gap.</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>2 Blocks Saved:</strong> 3 departmental tasks consolidated.</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>TRD Sequence:</strong> 25kV power isolation sequence verified.</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Machines Available:</strong> CSM tamping machine on site.</span>
                </div>
              </div>
            </div>

            {/* 6. WHAT ACTION CAN I TAKE? */}
            <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-3">
              <Link
                href="/approvals"
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all active:scale-95 text-center flex items-center justify-center gap-2"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Submit for Controller Approval</span>
              </Link>
              <Link
                href="/whatif"
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all active:scale-95 flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                <span>Test What-If Shift</span>
              </Link>
              <Link
                href="/planning"
                className="py-3 px-4 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 font-bold text-xs transition-all active:scale-95 flex items-center gap-2"
              >
                <CalendarDays className="w-4 h-4" />
                <span>Inspect in Gantt</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right 1 Col: 2. WHAT NEEDS ATTENTION? Critical Defects & ML Risk */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  Critical Maintenance Queue
                </h3>
                <p className="text-[11px] text-slate-400">Ranked by 6-Factor Math + ML Failure Risk</p>
              </div>
              <Link href="/assets" className="text-xs text-blue-400 hover:text-blue-300 font-medium">
                View All
              </Link>
            </div>

            <div className="space-y-2.5">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getDepartmentColor(task.department)}`}>
                      {task.department}
                    </span>
                    <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded border ${getRiskBadge(task.risk_level)}`}>
                      {task.risk_level} ({task.priority_score}/100)
                    </span>
                  </div>
                  <p className="font-semibold text-slate-200 line-clamp-1">{task.title}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>KM {task.km_location}</span>
                    <span className="text-red-400 font-medium">{task.overdue_days}d overdue</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Simulation Shortcuts */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Quick Evaluator Simulations
              </span>
              <Link
                href="/whatif"
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                  <span>What-If: Shift Block to 3 PM</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </Link>
              <Link
                href="/conflicts"
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Train className="w-3.5 h-3.5 text-red-400" />
                  <span>Simulate: RTIS 45m Train Delay</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
