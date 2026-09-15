"use client";

import React, { useEffect, useState } from "react";
import { 
  Cpu, 
  Search, 
  Filter, 
  TrendingDown, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Wrench
} from "lucide-react";
import { api } from "@/lib/api";
import { getDepartmentColor, getRiskBadge } from "@/lib/utils";

export default function AssetsPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDept, setFilterDept] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getAssets();
        setAssets(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredAssets = assets.filter((a) => {
    const matchesDept = filterDept === "ALL" || a.department === filterDept;
    const matchesSearch = 
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.asset_code.toLowerCase().includes(search.toLowerCase()) ||
      a.asset_type.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              Asset Lifecycle & Condition Monitoring
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Corridor Asset Health & Predictive Maintenance
          </h1>
          <p className="text-xs text-slate-400">
            ML-driven failure probability modeling, ultrasonic flaw history, and risk prioritization
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search assets, rails, OHE..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            {["ALL", "ENGINEERING", "TRD", "SNT"].map((d) => (
              <button
                key={d}
                onClick={() => setFilterDept(d)}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  filterDept === d
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Assets Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-bold text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Asset Code & Name</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Health Score</th>
                <th className="py-3.5 px-4">ML Failure Risk</th>
                <th className="py-3.5 px-4">Criticality</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white text-xs">{asset.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{asset.asset_code} ({asset.asset_type})</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getDepartmentColor(asset.department)}`}>
                      {asset.department}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-300">
                    KM {asset.km_location}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full ${
                            asset.health_score < 60
                              ? "bg-red-500"
                              : asset.health_score < 80
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                          }`}
                          style={{ width: `${asset.health_score}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-xs">{asset.health_score}/100</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${getRiskBadge(asset.risk_category)}`}>
                      {(asset.failure_probability * 100).toFixed(0)}% ({asset.risk_category})
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    {(asset.asset_criticality * 100).toFixed(0)}%
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {asset.status || "OPERATIONAL"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
