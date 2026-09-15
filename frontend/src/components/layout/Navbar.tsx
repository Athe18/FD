"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Train, 
  Activity, 
  Sparkles, 
  RefreshCw, 
  Search,
  CloudSun,
  ShieldCheck
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
      <header className="h-16 bg-[#090D16]/80 backdrop-blur-xl border-b border-white/[0.06] px-6 flex items-center justify-between sticky top-0 z-40">
        {/* Brand & Division */}
        <div className="flex items-center gap-5">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-blue-600/90 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Train className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white">PRABAL</span>
              <span className="text-[10px] font-semibold tracking-wide px-1.5 py-0.5 rounded-md bg-white/[0.06] text-slate-300 border border-white/[0.08]">
                Central Railway
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-white/[0.08] text-xs text-slate-400">
            <span>Corridor:</span>
            <span className="text-slate-200 font-medium bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
              Kalyan – Igatpuri (Thal Ghat)
            </span>
          </div>
        </div>

        {/* Action Controls & Search */}
        <div className="flex items-center gap-3">
          {/* Search Trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-xs text-slate-400 hover:text-slate-200 transition-all"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search assets, stations, trains...</span>
            <kbd className="text-[10px] font-mono bg-white/[0.06] text-slate-400 px-1.5 py-0.5 rounded border border-white/[0.08]">
              ⌘K
            </kbd>
          </button>

          {/* Quick Solver Trigger */}
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/[0.08] text-xs font-medium transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${syncing ? "animate-spin text-blue-400" : ""}`} />
            <span className="hidden sm:inline">{syncing ? "Optimizing..." : "Re-Optimize"}</span>
          </button>

          {/* AI Copilot Toggle */}
          <button
            onClick={onToggleCopilot}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              copilotOpen
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Copilot</span>
          </button>
        </div>
      </header>

      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
