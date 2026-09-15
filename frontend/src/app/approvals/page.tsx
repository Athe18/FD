"use client";

import React, { useEffect, useState } from "react";
import { 
  FileCheck2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  History, 
  User, 
  Cpu
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Section Controller Approval & Version Audit Center
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable plan lifecycle, version audit history, and multi-departmental sign-off
          </p>
        </div>
      </div>

      {/* Visual Stepper */}
      <div className="sf-card p-5 space-y-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Plan Lifecycle Progression:
        </h2>
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          {APPROVAL_STEPS.map((step, idx) => {
            const isDone = currentStepIdx >= idx;
            const isCurrent = currentStatus === step;
            return (
              <div key={step} className="flex items-center gap-2">
                <div className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                  isCurrent
                    ? "bg-blue-600 text-white border-blue-500 font-semibold shadow-sm"
                    : isDone
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-white/[0.02] text-slate-500 border-white/[0.06]"
                }`}>
                  {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                  <span>{step}</span>
                </div>
                {idx < APPROVAL_STEPS.length - 1 && (
                  <span className="text-slate-600 hidden sm:inline text-xs">→</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Plan Review Card */}
        <div className="lg:col-span-2 space-y-4">
          <div className="sf-card p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div>
                <h3 className="text-base font-bold text-white">
                  Plan Review: {planState?.plan_id || "PLAN-2026-CR-001"} (Version {planState?.version || 1})
                </h3>
                <p className="text-xs text-slate-400">
                  Authority Level: Division Operating Control Office
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {currentStatus}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl sf-card-subtle space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Corridor Scope:</span>
                  <span className="font-semibold text-white">Kalyan – Igatpuri UP Line (KM 125–126)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Consolidated Block Time:</span>
                  <span className="font-bold text-blue-400 font-mono">11:30 – 13:30 (2h 00m)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Departments Bundled:</span>
                  <span className="font-medium text-slate-200">Engineering, TRD (OHE), S&T</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Predicted Disruption:</span>
                  <span className="font-semibold text-emerald-400 font-mono">0 Minutes (Headway Gap)</span>
                </div>
              </div>

              {/* Remarks */}
              <div className="space-y-1.5 pt-2">
                <label className="block text-slate-300 font-medium text-xs">
                  Section Controller Operational Remarks:
                </label>
                <textarea
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Enter approval remarks or cautionary orders for station masters..."
                  className="w-full bg-[#0D121F] border border-white/[0.08] rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 placeholder-slate-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleApprove}
                  disabled={approving || currentStatus === "APPROVED"}
                  className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-sm transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{currentStatus === "APPROVED" ? "Plan Approved" : "Approve & Publish Plan"}</span>
                </button>
                <button
                  onClick={handleReject}
                  disabled={approving}
                  className="py-3 px-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] text-rose-400 border border-rose-500/20 font-semibold text-xs transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
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
          <div className="sf-card p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-blue-400" />
              Compliance Audit Trail
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl sf-card-subtle space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Cpu className="w-3 h-3 text-blue-400" /> Prabal Solver
                  </span>
                  <span>10 mins ago</span>
                </div>
                <p className="font-semibold text-slate-200">Generated Optimal Version v1</p>
                <p className="text-[11px] text-slate-400">
                  Consolidated 3 tasks with 87.5% utilization score.
                </p>
              </div>

              {planState?.approved_by && (
                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/30 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-emerald-400">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" /> {planState.approved_by}
                    </span>
                    <span>Just now</span>
                  </div>
                  <p className="font-semibold text-white">Status: APPROVED (v2)</p>
                  <p className="text-[11px] text-slate-300">
                    Officially cleared for execution on corridor.
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
