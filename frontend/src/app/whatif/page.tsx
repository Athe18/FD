"use client";

import React, { useState } from "react";
import { 
  SlidersHorizontal, 
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { api } from "@/lib/api";
import { formatTime } from "@/lib/utils";

export default function WhatIfPage() {
  const [startHour, setStartHour] = useState(15);
  const [startMinute, setStartMinute] = useState(0);
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState<any>(null);

  const handleSimulate = async () => {
    setSimulating(true);
    try {
      const res = await api.simulateWhatIf("BLK-001", startHour, startMinute);
      setSimResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            What-If Scenario Sandbox
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Test hypothetical schedule shifts and evaluate impact on passenger delays and safety conflicts
          </p>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="sf-card p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-blue-400" />
            Hypothetical Block Parameter Adjustment
          </h2>
          <span className="text-xs text-slate-400">Target Block: <strong>BLK-001 (KM 125.4)</strong></span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Modified Start Time: <span className="text-blue-400 font-bold font-mono text-sm">{`${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`}</span>
            </label>
            <input
              type="range"
              min="8"
              max="18"
              step="1"
              value={startHour}
              onChange={(e) => setStartHour(Number(e.target.value))}
              className="w-full accent-blue-500 mt-2"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>08:00</span>
              <span>11:30 (Optimal)</span>
              <span>15:00</span>
              <span>18:00</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Minute Offset: <span className="text-blue-400 font-bold font-mono">{startMinute}m</span>
            </label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {[0, 15, 30, 45].map((m) => (
                <button
                  key={m}
                  onClick={() => setStartMinute(m)}
                  className={`py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all ${
                    startMinute === m
                      ? "bg-blue-600 text-white border-blue-500"
                      : "bg-white/[0.02] text-slate-300 border-white/[0.06] hover:bg-white/[0.05]"
                  }`}
                >
                  +{m}m
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSimulate}
              disabled={simulating}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-sm transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${simulating ? "animate-spin" : ""}`} />
              {simulating ? "Calculating Deltas..." : "Run What-If Simulation"}
            </button>
          </div>
        </div>
      </div>

      {/* Before vs After Side-by-Side Comparison */}
      {simResult && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* BASELINE Card */}
            <div className="sf-card p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Baseline (Optimal Schedule)
                </span>
                <span className="text-xs font-semibold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  0 Train Conflicts
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-slate-400">Scheduled Window:</span>
                  <span className="font-bold text-white font-mono">
                    {formatTime(simResult.before.start)} – {formatTime(simResult.before.end)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-slate-400">Block Duration:</span>
                  <span className="font-bold text-white font-mono">{simResult.before.duration_min} min</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-slate-400">Predicted Disruption:</span>
                  <span className="font-bold text-emerald-400 font-mono">0 min delay</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Block Track Utilization:</span>
                  <span className="font-bold text-slate-200 font-mono">{simResult.before.utilization_pct}%</span>
                </div>
              </div>
            </div>

            {/* AFTER Card */}
            <div className={`sf-card p-5 space-y-4 ${
              simResult.after.conflicts_count > 0 ? "border-rose-500/40" : "border-emerald-500/40"
            }`}>
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Modified (What-If Shift)
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                  simResult.after.conflicts_count > 0
                    ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                }`}>
                  {simResult.calculated_recommendation}
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-slate-400">Modified Window:</span>
                  <span className="font-bold text-blue-400 font-mono">
                    {formatTime(simResult.after.start)} – {formatTime(simResult.after.end)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-slate-400">Block Duration:</span>
                  <span className="font-bold text-white font-mono">{simResult.after.duration_min} min</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-slate-400">Predicted Disruption:</span>
                  <span className={`font-bold font-mono ${simResult.after.predicted_train_delay_min > 0 ? "text-rose-400" : "text-emerald-400"}`}>
                    +{simResult.after.predicted_train_delay_min} min delay
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Block Track Utilization:</span>
                  <span className="font-bold text-slate-200 font-mono">{simResult.after.utilization_pct}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delta Summary Strip */}
          <div className="p-4 rounded-xl sf-card-subtle text-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="font-semibold text-slate-200">Simulation Summary:</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span>Conflicts Delta: <strong className={simResult.deltas.conflicts_delta > 0 ? "text-rose-400" : "text-emerald-400"}>+{simResult.deltas.conflicts_delta}</strong></span>
              <span>Train Delay Delta: <strong className={simResult.deltas.train_delay_delta_min > 0 ? "text-rose-400" : "text-emerald-400"}>+{simResult.deltas.train_delay_delta_min}m</strong></span>
              <span>Duration Delta: <strong>{simResult.deltas.duration_delta_min}m</strong></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
