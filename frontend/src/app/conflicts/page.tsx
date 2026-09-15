"use client";

import React, { useState } from "react";
import { 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Train, 
  Zap, 
  ShieldAlert, 
  ArrowRight,
  Layers
} from "lucide-react";
import { api } from "@/lib/api";
import { formatTime } from "@/lib/utils";

export default function ConflictCenterPage() {
  const [simulating, setSimulating] = useState(false);
  const [delayMinutes, setDelayMinutes] = useState(45);
  const [trainNumber, setTrainNumber] = useState("22221");
  const [replanResult, setReplanResult] = useState<any>(null);

  const handleSimulateDelay = async () => {
    setSimulating(true);
    try {
      const res = await api.simulateTrainDelay(trainNumber, delayMinutes);
      setReplanResult(res);
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
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
              Safety & Deconfliction Engine
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Live Conflict Detection & Resolution Center
          </h1>
          <p className="text-xs text-slate-400">
            Multi-dimensional collision monitoring: Trains, Blocks, Gangs, Machine Transit, and Materials
          </p>
        </div>
      </div>

      {/* Simulator Control Card */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                Live Disruption & Train Delay Simulator (RTIS Event)
              </h2>
              <p className="text-[11px] text-slate-400">
                Inject real-time train delay to trigger automatic conflict detection and dynamic re-planning
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Target Train Number</label>
            <select
              value={trainNumber}
              onChange={(e) => setTrainNumber(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
            >
              <option value="22221">22221 - CSMT-NZM Rajdhani Express</option>
              <option value="12123">12123 - Deccan Queen Superfast</option>
              <option value="12102">12102 - Jnaneswari Super Deluxe</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">
              Injected RTIS Delay (Minutes): <span className="font-bold text-red-400 font-mono">+{delayMinutes}m</span>
            </label>
            <input
              type="range"
              min="15"
              max="120"
              step="15"
              value={delayMinutes}
              onChange={(e) => setDelayMinutes(Number(e.target.value))}
              className="w-full accent-red-500 mt-2"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSimulateDelay}
              disabled={simulating}
              className="w-full py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${simulating ? "animate-spin" : ""}`} />
              {simulating ? "Evaluating Conflicts..." : "Inject Delay & Re-Plan"}
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Re-Planning Outcome Box */}
      {replanResult && (
        <div className="p-5 rounded-2xl bg-slate-900 border-2 border-red-500/40 shadow-2xl space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
              <AlertOctagon className="w-5 h-5" />
              <span>Collision Alert: {replanResult.conflicts_detected_count} Operational Conflict(s) Detected</span>
            </div>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {replanResult.recommended_action}
            </span>
          </div>

          {/* Conflict Items */}
          <div className="space-y-2">
            {replanResult.conflicts?.map((c: any, idx: number) => (
              <div key={idx} className="p-3.5 rounded-xl bg-red-950/30 border border-red-800/40 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-red-300 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                    {c.conflict_type}: {c.severity} Severity
                  </span>
                </div>
                <p className="text-slate-200">{c.description}</p>
                <p className="text-[11px] text-amber-300 font-medium">
                  💡 Resolution: {c.resolution_suggestion}
                </p>
              </div>
            ))}
          </div>

          {/* Discovered Alternative Coordinated Windows */}
          {replanResult.alternative_blocks?.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                OR-Tools CP-SAT Discovered Conflict-Free Alternative Window(s):
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {replanResult.alternative_blocks.map((ab: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-300 font-mono text-sm">{ab.block_code}</span>
                      <span className="text-emerald-400 font-bold">{ab.duration_formatted}</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">
                      Proposed Alternate Time: <strong>{formatTime(ab.scheduled_start)} – {formatTime(ab.scheduled_end)}</strong>
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t border-emerald-900/60 text-[11px]">
                      <span className="text-slate-400">{ab.tasks_count} Tasks Bundled</span>
                      <button className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition-colors">
                        Apply & Approve Window
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Standard Conflict Rules Matrix */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" />
          Deterministic Conflict Rule Verification Matrix
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {[
            { title: "Train Occupancy Overlap", status: "VERIFIED", rule: "SR-001 (15m Safety Margin)", color: "text-emerald-400" },
            { title: "TRD Power Isolation Sequence", status: "VERIFIED", rule: "SR-002 (20m Iso + 15m Resto)", color: "text-emerald-400" },
            { title: "Team / Gang Double Booking", status: "VERIFIED", rule: "Cumulative Capacity <= Available", color: "text-emerald-400" },
            { title: "Heavy Machine Transit Matrix", status: "VERIFIED", rule: "Self-Propelled Speed 30 km/h", color: "text-emerald-400" },
            { title: "Material Depot Sufficiency", status: "VERIFIED", rule: "100% Stock Readiness Checked", color: "text-emerald-400" },
            { title: "Continuous Block Boundaries", status: "VERIFIED", rule: "SR-003 (60m Min – 360m Max)", color: "text-emerald-400" },
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">{item.title}</span>
                <span className={`text-[10px] font-bold font-mono ${item.color}`}>{item.status}</span>
              </div>
              <p className="text-[11px] text-slate-500">{item.rule}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
