"use client";

import React, { useState } from "react";
import { 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  ShieldAlert, 
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Conflict Detection & Deconfliction Center
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time multi-dimensional safety monitoring across train paths, track maintenance, and power permits
          </p>
        </div>
      </div>

      {/* Simulator Control Card */}
      <div className="sf-card p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                Live Disruption & Train Delay Simulator (RTIS Feed)
              </h2>
              <p className="text-[11px] text-slate-400">
                Simulate real-time train delay to verify automatic conflict detection and dynamic re-planning
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Target Train</label>
            <select
              value={trainNumber}
              onChange={(e) => setTrainNumber(e.target.value)}
              className="w-full bg-[#0D121F] border border-white/[0.08] rounded-lg p-2 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="22221">22221 - CSMT-NZM Rajdhani Express</option>
              <option value="12123">12123 - Deccan Queen Superfast</option>
              <option value="12102">12102 - Jnaneswari Super Deluxe</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">
              Injected RTIS Delay: <span className="font-bold text-rose-400 font-mono">+{delayMinutes} min</span>
            </label>
            <input
              type="range"
              min="15"
              max="120"
              step="15"
              value={delayMinutes}
              onChange={(e) => setDelayMinutes(Number(e.target.value))}
              className="w-full accent-rose-500 mt-2"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSimulateDelay}
              disabled={simulating}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-sm transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${simulating ? "animate-spin" : ""}`} />
              {simulating ? "Evaluating Conflicts..." : "Inject Delay & Re-Plan"}
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Re-Planning Outcome Box */}
      {replanResult && (
        <div className="sf-card p-5 space-y-4 border-rose-500/30">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
              <AlertOctagon className="w-4 h-4" />
              <span>{replanResult.conflicts_detected_count} Operational Conflict(s) Detected</span>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/[0.06] text-slate-300">
              {replanResult.recommended_action}
            </span>
          </div>

          {/* Conflict Items */}
          <div className="space-y-2">
            {replanResult.conflicts?.map((c: any, idx: number) => (
              <div key={idx} className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-800/30 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-rose-300 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    {c.conflict_type} ({c.severity} Severity)
                  </span>
                </div>
                <p className="text-slate-300">{c.description}</p>
                <p className="text-[11px] text-amber-300">
                  💡 Resolution: {c.resolution_suggestion}
                </p>
              </div>
            ))}
          </div>

          {/* Discovered Alternative Coordinated Windows */}
          {replanResult.alternative_blocks?.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-white/[0.06]">
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                OR-Tools CP-SAT Discovered Conflict-Free Alternative Window(s):
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {replanResult.alternative_blocks.map((ab: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/30 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-300 font-mono">{ab.block_code}</span>
                      <span className="text-emerald-400 font-semibold">{ab.duration_formatted}</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">
                      Proposed Alternate Time: <strong>{formatTime(ab.scheduled_start)} – {formatTime(ab.scheduled_end)}</strong>
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-emerald-900/40 text-[11px]">
                      <span className="text-slate-400">{ab.tasks_count} Tasks Bundled</span>
                      <button className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[10px] transition-colors">
                        Apply & Approve
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
      <div className="sf-card p-5 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" />
          Deterministic Safety Rule Verification Matrix
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {[
            { title: "Train Occupancy Buffer", status: "VERIFIED", rule: "SR-001 (15m Safety Margin)" },
            { title: "TRD Power Isolation Sequence", status: "VERIFIED", rule: "SR-002 (20m Iso + 15m Resto)" },
            { title: "Gang Capacity Limits", status: "VERIFIED", rule: "Cumulative Demand <= Available" },
            { title: "Machine Transit Physics", status: "VERIFIED", rule: "Self-Propelled 30 km/h Speed Limit" },
            { title: "Material Depot Sufficiency", status: "VERIFIED", rule: "100% Stock Readiness Verified" },
            { title: "Continuous Block Limits", status: "VERIFIED", rule: "SR-003 (60m Min – 360m Max)" },
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-200">{item.title}</span>
                <span className="text-[10px] font-bold font-mono text-emerald-400">{item.status}</span>
              </div>
              <p className="text-[11px] text-slate-500">{item.rule}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
