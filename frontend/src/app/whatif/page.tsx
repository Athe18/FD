"use client";

import React, { useState } from "react";
import { 
  SlidersHorizontal, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Train, 
  Layers, 
  RefreshCw,
  Sparkles
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Deterministic Simulation Engine
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            What-If Scenario Sandbox
          </h1>
          <p className="text-xs text-slate-400">
            Modify schedule parameters and observe true mathematical before-and-after impact deltas
          </p>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            Hypothetical Block Window Parameter Adjustment
          </h2>
          <span className="text-xs text-slate-400">Target Block: <strong>BLK-001 (KM 125.4)</strong></span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Modified Start Time: <span className="text-amber-400 font-bold font-mono text-sm">{`${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`}</span>
            </label>
            <input
              type="range"
              min="8"
              max="18"
              step="1"
              value={startHour}
              onChange={(e) => setStartHour(Number(e.target.value))}
              className="w-full accent-amber-500 mt-2"
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
              Minute Offset: <span className="text-amber-400 font-bold font-mono">{startMinute}m</span>
            </label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {[0, 15, 30, 45].map((m) => (
                <button
                  key={m}
                  onClick={() => setStartMinute(m)}
                  className={`py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                    startMinute === m
                      ? "bg-amber-500 text-slate-950 border-amber-400"
                      : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700"
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
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${simulating ? "animate-spin" : ""}`} />
              {simulating ? "Recalculating Mathematical Deltas..." : "Execute What-If Simulation"}
            </button>
          </div>
        </div>
      </div>

      {/* Before vs After Side-by-Side Delta Comparison */}
      {simResult && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* BEFORE Card */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Baseline (Optimal Prabal Schedule)
                </span>
                <span className="text-xs font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  0 Train Conflicts
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Proposed Window:</span>
                  <span className="font-bold text-white font-mono">
                    {formatTime(simResult.before.start)} – {formatTime(simResult.before.end)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Block Duration:</span>
                  <span className="font-bold text-white font-mono">{simResult.before.duration_min} min</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Predicted Train Disruption:</span>
                  <span className="font-bold text-emerald-400 font-mono">0 min delay</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Operational Conflicts:</span>
                  <span className="font-bold text-emerald-400 font-mono">{simResult.before.conflicts_count}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Block Track Utilization:</span>
                  <span className="font-bold text-purple-300 font-mono">{simResult.before.utilization_pct}%</span>
                </div>
              </div>
            </div>

            {/* AFTER Card */}
            <div className={`p-5 rounded-2xl bg-slate-900 border shadow-xl space-y-4 ${
              simResult.after.conflicts_count > 0 ? "border-red-500/50" : "border-emerald-500/50"
            }`}>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Modified (What-If Hypothetical)
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                  simResult.after.conflicts_count > 0
                    ? "bg-red-500/20 text-red-400 border-red-500/40"
                    : "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                }`}>
                  {simResult.calculated_recommendation}
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Modified Window:</span>
                  <span className="font-bold text-amber-400 font-mono">
                    {formatTime(simResult.after.start)} – {formatTime(simResult.after.end)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Block Duration:</span>
                  <span className="font-bold text-white font-mono">{simResult.after.duration_min} min</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Predicted Train Disruption:</span>
                  <span className={`font-bold font-mono ${simResult.after.predicted_train_delay_min > 0 ? "text-red-400" : "text-emerald-400"}`}>
                    +{simResult.after.predicted_train_delay_min} min delay
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Operational Conflicts:</span>
                  <span className={`font-bold font-mono ${simResult.after.conflicts_count > 0 ? "text-red-400" : "text-emerald-400"}`}>
                    {simResult.after.conflicts_count} Detected
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Block Track Utilization:</span>
                  <span className="font-bold text-purple-300 font-mono">{simResult.after.utilization_pct}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delta Summary Strip */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-slate-200">Simulation Summary:</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span>Conflicts Delta: <strong className={simResult.deltas.conflicts_delta > 0 ? "text-red-400" : "text-emerald-400"}>+{simResult.deltas.conflicts_delta}</strong></span>
              <span>Train Delay Delta: <strong className={simResult.deltas.train_delay_delta_min > 0 ? "text-red-400" : "text-emerald-400"}>+{simResult.deltas.train_delay_delta_min}m</strong></span>
              <span>Duration Delta: <strong>{simResult.deltas.duration_delta_min}m</strong></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
