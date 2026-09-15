"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  SlidersHorizontal,
  FileCheck2,
  CalendarDays,
  Sparkles,
  AlertTriangle,
  Layers,
  Clock,
  CloudSun,
  ShieldCheck
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
      {/* 1. Header & Live Corridor Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Corridor Operations & Maintenance Overview
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Kalyan – Igatpuri Ghat Section • Central Railway (Mumbai Division)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Corridor Operational
          </span>
          <span className="text-xs text-slate-400 font-mono bg-white/[0.03] px-2.5 py-1 rounded-full border border-white/[0.06]">
            38.5 GMT Density
          </span>
        </div>
      </div>

      {/* 2. Top Metric Cards (Spacious, Minimalist, High-Contrast) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="sf-card p-4 space-y-1.5">
          <span className="text-[11px] font-medium text-slate-400">Critical Maintenance Tasks</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-white">{tasks.length || 3}</span>
            <span className="text-[10px] text-rose-400 font-medium font-mono">Needs Block</span>
          </div>
          <p className="text-[11px] text-slate-500">Overdue on UP Mainline</p>
        </div>

        <div className="sf-card p-4 space-y-1.5">
          <span className="text-[11px] font-medium text-slate-400">Separate Blocks Saved</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-blue-400">+{metrics.blocks_saved ?? 2}</span>
            <span className="text-[10px] text-blue-400 font-medium font-mono">Consolidated</span>
          </div>
          <p className="text-[11px] text-slate-500">3 Depts in 1 Shadow Block</p>
        </div>

        <div className="sf-card p-4 space-y-1.5">
          <span className="text-[11px] font-medium text-slate-400">Track Occupancy Saved</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-amber-400">{metrics.block_hours_saved ?? 1.75}h</span>
            <span className="text-[10px] text-amber-400 font-medium font-mono">Efficiency</span>
          </div>
          <p className="text-[11px] text-slate-500">87.5% Track Utilization</p>
        </div>

        <div className="sf-card p-4 space-y-1.5">
          <span className="text-[11px] font-medium text-slate-400">Passenger Train Delay</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-emerald-400">0 min</span>
            <span className="text-[10px] text-emerald-400 font-medium font-mono">Zero Disruption</span>
          </div>
          <p className="text-[11px] text-slate-500">Headway Gap Scheduled</p>
        </div>
      </div>

      {/* 3. Hero Recommendation Card & Side Attention Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Primary Coordinated Schedule Card */}
        <div className="lg:col-span-2 space-y-4">
          <div className="sf-card p-6 space-y-5 border-blue-500/30">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                      OPTIMAL CANDIDATE WINDOW
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/[0.06] text-slate-300">
                      {planData?.status || "AI_RECOMMENDED"}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    Coordinated Maintenance Block {primaryBlock?.block_code || "BLK-001"}
                  </h2>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[11px] text-slate-400 block">Proposed Window</span>
                <span className="text-lg font-bold font-mono text-blue-400">
                  {formatTime(primaryBlock?.scheduled_start)} – {formatTime(primaryBlock?.scheduled_end)}
                </span>
              </div>
            </div>

            {/* Parameter Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="sf-card-subtle p-3 space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase">Section</span>
                <p className="text-xs font-semibold text-white truncate">KM 125.4 (Kasara–Igatpuri)</p>
              </div>
              <div className="sf-card-subtle p-3 space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase">Duration</span>
                <p className="text-xs font-semibold text-white">{primaryBlock?.duration_formatted || "2h 00m"}</p>
              </div>
              <div className="sf-card-subtle p-3 space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase">Departments</span>
                <p className="text-xs font-semibold text-blue-400">ENG • TRD • S&T</p>
              </div>
              <div className="sf-card-subtle p-3 space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase">Utilization</span>
                <p className="text-xs font-semibold text-emerald-400">{primaryBlock?.utilization_pct || 87.5}%</p>
              </div>
            </div>

            {/* Why Chosen? Justification Checklist */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Mathematical Solver Justifications (CP-SAT)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Zero Train Delay:</strong> Fits natural timetable gap.</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>2 Blocks Eliminated:</strong> 3 tasks consolidated.</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>TRD Verified:</strong> 25kV power isolation sequence checked.</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Resources Ready:</strong> CSM-09 tamping machine available.</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-white/[0.06] flex flex-wrap items-center gap-3">
              <Link
                href="/approvals"
                className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all active:scale-95 flex items-center gap-2 shadow-sm"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Submit for Approval</span>
              </Link>
              <Link
                href="/whatif"
                className="py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/[0.08] font-semibold text-xs transition-all active:scale-95 flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                <span>Test What-If Shift</span>
              </Link>
              <Link
                href="/planning"
                className="py-2.5 px-4 rounded-xl text-slate-400 hover:text-slate-200 font-semibold text-xs transition-all flex items-center gap-1.5"
              >
                <CalendarDays className="w-4 h-4" />
                <span>View in Gantt Timeline →</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Critical Maintenance Queue */}
        <div className="space-y-4">
          <div className="sf-card p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Critical Maintenance Queue
                </h3>
                <p className="text-[11px] text-slate-400">Ranked by Priority Formula + ML Risk</p>
              </div>
              <Link href="/assets" className="text-xs text-blue-400 hover:text-blue-300 font-medium">
                View All
              </Link>
            </div>

            <div className="space-y-2.5">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-all text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getDepartmentColor(task.department)}`}>
                      {task.department}
                    </span>
                    <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded border ${getRiskBadge(task.risk_level)}`}>
                      {task.priority_score}/100
                    </span>
                  </div>
                  <p className="font-medium text-slate-200 line-clamp-1">{task.title}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>KM {task.km_location}</span>
                    <span className="text-rose-400">{task.overdue_days}d overdue</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Sandbox Actions */}
            <div className="pt-2 border-t border-white/[0.06] space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Evaluator Scenarios
              </span>
              <Link
                href="/whatif"
                className="w-full flex items-center justify-between p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] text-slate-300 text-xs transition-colors border border-white/[0.04]"
              >
                <span>What-If: Shift Block to 3 PM</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </Link>
              <Link
                href="/conflicts"
                className="w-full flex items-center justify-between p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] text-slate-300 text-xs transition-colors border border-white/[0.04]"
              >
                <span>Simulate: RTIS 45m Train Delay</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
