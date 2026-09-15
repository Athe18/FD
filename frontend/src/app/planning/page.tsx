"use client";

import React, { useEffect, useState } from "react";
import { 
  CalendarDays, 
  Clock, 
  Filter, 
  Layers, 
  Train, 
  ShieldAlert, 
  CheckCircle2, 
  Info,
  ChevronRight
} from "lucide-react";
import { api } from "@/lib/api";
import { formatTime, formatDuration, getDepartmentColor } from "@/lib/utils";

export default function PlanningBoardPage() {
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [plan, setPlan] = useState<any>(null);
  const [selectedDept, setSelectedDept] = useState<string>("ALL");
  const [selectedBlock, setSelectedBlock] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const [schRes, planRes] = await Promise.all([
          api.getTrainSchedules(),
          api.getActivePlan()
        ]);
        setSchedules(schRes);
        setPlan(planRes?.result);
        if (planRes?.result?.blocks?.length > 0) {
          setSelectedBlock(planRes.result.blocks[0]);
        }
      } catch (e) {
        console.error("Planning board load failed:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Time ruler range: 06:00 to 20:00 (14 hours = 840 mins)
  const START_HOUR = 6;
  const END_HOUR = 20;
  const TOTAL_HOURS = END_HOUR - START_HOUR;
  const hoursArray = Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => START_HOUR + i);

  // Position calculation helper: returns left% and width%
  const getPositionStyles = (startTimeStr: string, endTimeStr: string) => {
    try {
      const s = new Date(startTimeStr);
      const e = new Date(endTimeStr);
      const startMin = (s.getHours() - START_HOUR) * 60 + s.getMinutes();
      const durationMin = (e.getTime() - s.getTime()) / (1000 * 60);

      const leftPct = Math.max(0, Math.min(100, (startMin / (TOTAL_HOURS * 60)) * 100));
      const widthPct = Math.max(2, Math.min(100 - leftPct, (durationMin / (TOTAL_HOURS * 60)) * 100));

      return { left: `${leftPct}%`, width: `${widthPct}%` };
    } catch {
      return { left: "0%", width: "10%" };
    }
  };

  const blocks = plan?.blocks || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              Corridor Schedule Visualizer
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Multi-Track Interactive Gantt Planning Board
          </h1>
          <p className="text-xs text-slate-400">
            Real-time visual string chart of train paths vs consolidated departmental blocks
          </p>
        </div>

        {/* Department Filters */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
          {["ALL", "ENGINEERING", "TRD", "SNT"].map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                selectedDept === dept
                  ? "bg-blue-600 text-white shadow-md font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Main Gantt Timeline Container */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6 overflow-x-auto">
        {/* Timeline Header Ruler */}
        <div className="min-w-[900px]">
          <div className="grid grid-cols-14 border-b border-slate-800 pb-2 text-[11px] font-mono text-slate-400">
            {hoursArray.slice(0, -1).map((h) => (
              <div key={h} className="text-left pl-1 border-l border-slate-800/80">
                {`${h.toString().padStart(2, '0')}:00`}
              </div>
            ))}
          </div>

          {/* Track 1: Kasara - Igatpuri UP Line (Maintenance & Trains) */}
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Line 1: UP Main (Thal Ghat Corridor KM 121–137)
              </span>
              <span className="text-[11px] text-slate-500 font-mono">ABS Speed: 75 km/h</span>
            </div>

            {/* Lane: Coordinated Blocks */}
            <div className="relative h-16 bg-slate-950/80 rounded-xl border border-slate-800/80 p-1.5 railway-grid overflow-hidden">
              {blocks.map((b: any) => {
                const pos = getPositionStyles(b.scheduled_start, b.scheduled_end);
                return (
                  <div
                    key={b.block_id}
                    onClick={() => setSelectedBlock(b)}
                    style={{ left: pos.left, width: pos.width }}
                    className="absolute top-1.5 bottom-1.5 rounded-lg bg-gradient-to-r from-amber-500/30 via-orange-500/30 to-amber-500/30 border-2 border-amber-500/80 hover:border-amber-400 cursor-pointer shadow-lg shadow-amber-500/10 p-2 flex flex-col justify-between transition-all group z-10"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-amber-300 font-mono flex items-center gap-1">
                        <Layers className="w-3 h-3 text-amber-400" />
                        {b.block_code}
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                        {b.duration_formatted}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {b.departments.map((d: string) => (
                        <span key={d} className={`text-[8px] font-bold px-1 rounded ${getDepartmentColor(d)}`}>
                          {d}
                        </span>
                      ))}
                      <span className="text-[9px] text-slate-300 font-medium ml-1">
                        ({b.tasks_count} tasks consolidated)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Lane: Train Paths */}
            <div className="relative h-20 bg-slate-950/60 rounded-xl border border-slate-800/60 p-1.5 railway-grid overflow-hidden">
              {schedules.map((tr) => {
                const pos = getPositionStyles(tr.entry_time, tr.exit_time);
                const isRajdhani = tr.train_type === "RAJDHANI" || tr.train_type === "VANDE_BHARAT";
                const isFreight = tr.train_type === "GOODS_FREIGHT";
                return (
                  <div
                    key={tr.train_id}
                    style={{ left: pos.left, width: pos.width }}
                    className={`absolute top-2 bottom-2 rounded-lg border flex flex-col justify-center px-2 text-[10px] font-medium shadow-sm transition-transform hover:scale-105 ${
                      isRajdhani
                        ? "bg-blue-600/30 border-blue-400 text-blue-200"
                        : isFreight
                        ? "bg-slate-700/40 border-slate-500 text-slate-300"
                        : "bg-emerald-600/30 border-emerald-400 text-emerald-200"
                    }`}
                  >
                    <div className="flex items-center gap-1 font-bold">
                      <Train className="w-3 h-3 shrink-0" />
                      <span className="truncate">{tr.train_number}</span>
                    </div>
                    <span className="text-[9px] text-slate-300 truncate">{tr.train_name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-slate-300">Legend:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-500/40 border border-amber-500" />
              <span>Coordinated Multi-Dept Block</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-blue-600/40 border border-blue-400" />
              <span>Vande Bharat / Rajdhani</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-600/40 border border-emerald-400" />
              <span>Mail / Express Train</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-700/40 border border-slate-500" />
              <span>Container Freight (FOIS)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Block Inspection Drawer / Card */}
      {selectedBlock && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" />
                Block Inspection: {selectedBlock.block_code}
              </h2>
              <p className="text-xs text-slate-400">
                Window: {formatTime(selectedBlock.scheduled_start)} – {formatTime(selectedBlock.scheduled_end)} ({selectedBlock.duration_formatted})
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Utilization: {selectedBlock.utilization_pct}%
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {selectedBlock.separate_blocks_avoided} Blocks Saved
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {selectedBlock.tasks?.map((t: any, idx: number) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getDepartmentColor(t.department)}`}>
                    {t.department}
                  </span>
                  <span className="text-amber-400 font-mono font-medium">{formatDuration(t.estimated_duration_min)}</span>
                </div>
                <p className="font-semibold text-slate-200 line-clamp-1">{t.title}</p>
                <p className="text-[11px] text-slate-400">
                  Location: KM {t.km_location} • Team: {t.required_team_type}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
