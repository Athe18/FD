"use client";

import React, { useEffect, useState } from "react";
import { 
  Radio, 
  Activity, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Database,
  ArrowRight
} from "lucide-react";
import { api } from "@/lib/api";

export default function IntegrationsPage() {
  const [connectors, setConnectors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const loadData = async () => {
    try {
      const data = await api.getIntegrationsHealth();
      setConnectors(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSyncAll = async () => {
    setSyncing(true);
    try {
      await api.getIntegrationsHealth();
      await loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              CRIS & Railway Interoperability Layer
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Integration Health & Data Freshness Monitor
          </h1>
          <p className="text-xs text-slate-400">
            Real-time status, latency, error monitoring, and provenance tracking across all railway systems
          </p>
        </div>

        <button
          onClick={handleSyncAll}
          disabled={syncing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
          <span>{syncing ? "Syncing Adapters..." : "Refresh Connector Health"}</span>
        </button>
      </div>

      {/* Connectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {connectors.map((conn) => {
          const isSimulated = conn.source_type === "SIMULATED";
          const isExternal = conn.source_type === "EXTERNAL";
          return (
            <div
              key={conn.source_name}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-lg space-y-3 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-xs text-blue-400">
                    {conn.source_name}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-xs">{conn.source_name} Adapter</h3>
                    <span className="text-[10px] text-slate-500 uppercase">{conn.source_type}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {conn.sync_status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs border-t border-slate-800/80 pt-2 text-slate-400">
                <div className="flex justify-between">
                  <span>Data Freshness:</span>
                  <span className="font-bold text-emerald-400 font-mono">{conn.freshness_display}</span>
                </div>
                <div className="flex justify-between">
                  <span>Latency:</span>
                  <span className="font-mono text-slate-300">{conn.latency_ms} ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Records Ingested:</span>
                  <span className="font-mono text-slate-300">{conn.records_received_count.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Data Quality:</span>
                  <span className="font-bold text-emerald-400">{conn.data_quality}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Integration Architectural Notice */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-400" />
          Indian Railways CRIS Integration Architecture Note
        </h3>
        <p className="text-slate-400 leading-relaxed text-[11px]">
          Prabal connects via standard <strong>Adapter Interfaces</strong>. For systems without public credentials (TMS, TDMS, SMMS, COA, RTIS, NTES, FOIS), the platform executes realistic simulated connectors with synthetic datasets matching official CRIS relational schemas. When official authorized credentials are provided, production connectors plug into the identical interface without modifying the core optimization or safety engines.
        </p>
      </div>
    </div>
  );
}
