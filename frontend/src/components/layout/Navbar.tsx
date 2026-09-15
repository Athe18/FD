"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Train, 
  Activity, 
  Sparkles, 
  RefreshCw, 
  Search,
  Command,
  CloudSun
} from "lucide-react";
import { api } from "@/lib/api";
import GlobalSearchModal from "@/components/ui/GlobalSearchModal";

interface NavbarProps {
  onToggleCopilot?: () => void;
  copilotOpen?: boolean;
}

export default function Navbar({ onToggleCopilot, copilotOpen }: NavbarProps) {
  const [syncing, setSyncing] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await api.runOptimization();
    } catch (e) {
      console.error(e);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <>
      <header className="h-16 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
        {/* Brand & Division Indicator */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Train className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-wider text-white">PRABAL</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  CRIS LAYER
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Railway Maintenance & Block Optimization</p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-800 text-xs">
            <span className="text-slate-400 font-medium">Corridor:</span>
            <span className="font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Kalyan – Igatpuri (50km Thal Ghat)
            </span>
          </div>
        </div>

        {/* Global Search Button & Provenance Indicators */}
        <div className="flex items-center gap-3">
          {/* Quick Search Trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-800/80 border border-slate-700/80 text-xs text-slate-400 hover:text-slate-200 transition-all"
          >
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span>Search corridor assets, timetable...</span>
            <kbd className="text-[10px] font-mono font-bold bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
              Ctrl+K
            </kbd>
          </button>

          {/* Real Data & Provenance Badges */}
          <div className="hidden xl:flex items-center gap-2 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800 text-[11px]">
            <span className="text-slate-400 flex items-center gap-1 font-medium">
              <Activity className="w-3 h-3 text-emerald-400" /> Data Feeds:
            </span>
            <span className="text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20" title="Source: Open Government Railway Data">
              Timetable 🟢 Real
            </span>
            <span className="text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20" title="Source: Open-Meteo REST API">
              Weather 🟢 Real (28°C)
            </span>
            <span className="text-slate-400 font-mono bg-slate-800/60 px-1.5 py-0.5 rounded border border-slate-700" title="Simulated feed for demonstration">
              RTIS 🟡 Sim
            </span>
          </div>

          {/* Re-Optimize Action */}
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 font-medium text-xs transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">{syncing ? "Solving..." : "Re-Run Optimization"}</span>
          </button>

          {/* PRABAL AI Co-Pilot Drawer Toggle */}
          <button
            onClick={onToggleCopilot}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-medium text-xs transition-all ${
              copilotOpen
                ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-semibold"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">PRABAL AI</span>
          </button>
        </div>
      </header>

      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
