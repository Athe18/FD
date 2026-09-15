"use client";

import React, { useEffect, useState } from "react";
import { 
  RefreshCw, 
  Database,
  Radio
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            System Integrations & Feed Freshness
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational status, latency, error monitoring, and data provenance across railway interfaces
          </p>
        </div>

        <button
          onClick={handleSyncAll}
          disabled={syncing}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-sm transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
          <span>{syncing ? "Syncing..." : "Refresh Status"}</span>
        </button>
      </div>

      {/* Connectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {connectors.map((conn) => {
          return (
            <div
              key={conn.source_name}
              className="sf-card p-4 space-y-3 sf-card-hover"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center font-bold text-xs text-blue-400">
                    {conn.source_name}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-xs">{conn.source_name} Adapter</h3>
                    <span className="text-[10px] text-slate-500 uppercase">{conn.source_type}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {conn.sync_status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs border-t border-white/[0.04] pt-2 text-slate-400">
                <div className="flex justify-between">
                  <span>Data Freshness:</span>
                  <span className="font-semibold text-emerald-400 font-mono">{conn.freshness_display}</span>
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
                  <span className="font-medium text-slate-200">{conn.data_quality}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Integration Architectural Notice */}
      <div className="sf-card p-4 text-xs space-y-1.5">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-400" />
          Indian Railways CRIS Integration Architecture Note
        </h3>
        <p className="text-slate-400 leading-relaxed text-[11px]">
          PRABAL interfaces via standard <strong>Adapter Connectors</strong>. In demonstration mode, connectors provide simulated telemetry adhering to authentic CRIS schema structures. In production environments, official credentials allow live streaming into identical internal data structures without code changes.
        </p>
      </div>
    </div>
  );
}
