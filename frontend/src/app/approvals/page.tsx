"use client";

import React, { useEffect, useState } from "react";
import { 
  FileCheck2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  History, 
  User, 
  Cpu, 
  AlertCircle
} from "lucide-react";
import { api } from "@/lib/api";

const APPROVAL_STEPS = [
  "DRAFT",
  "AI_RECOMMENDED",
  "PLANNER_REVIEW",
  "PENDING_APPROVAL",
  "APPROVED",
  "ACTIVE",
  "COMPLETED",
];

export default function ApprovalsPage() {
  const [planState, setPlanState] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [comment, setComment] = useState("");

  const loadData = async () => {
    try {
      const res = await api.getActivePlan();
      setPlanState(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async () => {
    setApproving(true);
    try {
      await api.approvePlan("Chief Controller (Central Railway)", comment || "Coordinated shadow block approved as optimal.");
      await loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    setApproving(true);
    try {
      await api.rejectPlan(comment || "Overlaps with VIP Special Run.");
      await loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setApproving(false);
    }
  };

  const currentStatus = planState?.status || "AI_RECOMMENDED";
  const currentStepIdx = APPROVAL_STEPS.indexOf(currentStatus);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Governance & Human-in-the-Loop
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Section Controller Approval & Version Audit Center
          </h1>
          <p className="text-xs text-slate-400">
            Immutable 10-state plan lifecycle, version history diffs, and compliance logs
          </p>
        </div>
      </div>

      {/* 10-State Visual Stepper */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Plan Lifecycle State Progression:
        </h2>
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
          {APPROVAL_STEPS.map((step, idx) => {
            const isDone = currentStepIdx >= idx;
            const isCurrent = currentStatus === step;
            return (
              <div key={step} className="flex items-center gap-2">
                <div className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 ${
                  isCurrent
                    ? "bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/20"
                    : isDone
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-slate-950 text-slate-500 border-slate-800"
                }`}>
                  {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                  <span>{step}</span>
                </div>
                {idx < APPROVAL_STEPS.length - 1 && (
                  <span className="text-slate-600 hidden sm:inline">→</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Approval Action & Version Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Plan Version Card & Controller Sign-Off */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-white">
                  Plan Review: {planState?.plan_id || "PLAN-2026-CR-001"} (Version {planState?.version || 1})
                </h3>
                <p className="text-xs text-slate-400">
                  Authority Level: Division Operating Control Office
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {currentStatus}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Corridor Scope:</span>
                  <span className="font-bold text-white">Kalyan – Igatpuri UP Line (KM 125–126)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Consolidated Block Time:</span>
                  <span className="font-bold text-amber-400 font-mono">11:30 – 13:30 (2h 00m)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Departments Bundled:</span>
                  <span className="font-bold text-blue-400">Engineering, TRD (OHE), S&T</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Predicted Passenger Disruption:</span>
                  <span className="font-bold text-emerald-400 font-mono">0 Minutes (Headway Gap)</span>
                </div>
              </div>

              {/* Approval Comment Box */}
              <div className="space-y-1.5 pt-2">
                <label className="block text-slate-300 font-semibold text-xs">
                  Section Controller Operational Remarks:
                </label>
                <textarea
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Enter approval note or cautionary instruction for station masters..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleApprove}
                  disabled={approving || currentStatus === "APPROVED"}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{currentStatus === "APPROVED" ? "Plan Approved" : "Approve & Publish Plan"}</span>
                </button>
                <button
                  onClick={handleReject}
                  disabled={approving}
                  className="py-3 px-4 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 font-bold text-xs transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Audit Log */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-blue-400" />
              Compliance Audit Trail
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-blue-400" /> Prabal CP-SAT Engine
                  </span>
                  <span>10 mins ago</span>
                </div>
                <p className="font-semibold text-slate-200">Generated Optimal Version v1</p>
                <p className="text-[11px] text-slate-400">
                  Consolidated 3 tasks with 87.5% block utilization score.
                </p>
              </div>

              {planState?.approved_by && (
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-emerald-400">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" /> {planState.approved_by}
                    </span>
                    <span>Just now</span>
                  </div>
                  <p className="font-semibold text-white">Status Transition: APPROVED (v2)</p>
                  <p className="text-[11px] text-slate-300">
                    Officially cleared for execution on Kasara-Igatpuri corridor.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
