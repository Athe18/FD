"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Train, 
  Layers, 
  AlertTriangle, 
  MapPin, 
  SlidersHorizontal, 
  FileCheck2, 
  Cpu, 
  ArrowRight,
  X
} from "lucide-react";

interface SearchResult {
  title: string;
  category: "ASSET" | "TRAIN" | "BLOCK" | "ACTION" | "PAGE";
  href: string;
  description: string;
}

const SEARCH_INDEX: SearchResult[] = [
  { title: "Recommended Block BLK-001 (KM 125.4)", category: "BLOCK", href: "/planning", description: "Consolidated Engineering, TRD, S&T 11:30–13:30 block" },
  { title: "Rail Flaw Defect (IMR) KM 125.4", category: "ASSET", href: "/assets", description: "Critical USFD defect on 60kg Flash-butt welded rail" },
  { title: "OHE Mast 125-14 (KM 125.4)", category: "ASSET", href: "/assets", description: "25kV Cantilever assembly requiring power block" },
  { title: "Point Machine SIG-PT-126B (KM 126.0)", category: "ASSET", href: "/assets", description: "Electric switch motor & dual axle counter" },
  { title: "22221 - CSMT-NZM Rajdhani Express", category: "TRAIN", href: "/planning", description: "Scheduled entry 10:40, exit 11:10 on UP Main" },
  { title: "12102 - Jnaneswari Super Deluxe", category: "TRAIN", href: "/planning", description: "Scheduled entry 14:20, exit 14:50 on UP Main" },
  { title: "What-If Scenario Sandbox", category: "PAGE", href: "/whatif", description: "Test hypothetical schedule modifications and deltas" },
  { title: "Conflict Detection Center", category: "PAGE", href: "/conflicts", description: "Live collision matrix and RTIS delay simulation" },
  { title: "Section Controller Approvals", category: "PAGE", href: "/approvals", description: "10-state plan sign-off and version history" },
  { title: "ML Asset Failure Risk Inference", category: "ACTION", href: "/assets", description: "Inspect trained Random Forest failure probabilities" },
  { title: "Export Weekly Block Notice (PDF)", category: "ACTION", href: "/reports", description: "Download printable official operating notice" }
];

export default function GlobalSearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = SEARCH_INDEX.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/60">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            autoFocus
            type="text"
            placeholder="Search assets, train timetables, blocks, or actions (Ctrl+K)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1 text-xs">
          {results.length > 0 ? (
            results.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(item.href)}
                className="w-full p-3 rounded-xl hover:bg-slate-800/80 text-left flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-800 group-hover:bg-blue-600/30 flex items-center justify-center text-slate-400 group-hover:text-blue-400">
                    {item.category === "BLOCK" && <Layers className="w-3.5 h-3.5" />}
                    {item.category === "ASSET" && <AlertTriangle className="w-3.5 h-3.5" />}
                    {item.category === "TRAIN" && <Train className="w-3.5 h-3.5" />}
                    {item.category === "PAGE" && <MapPin className="w-3.5 h-3.5" />}
                    {item.category === "ACTION" && <Cpu className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <div className="font-bold text-slate-200 group-hover:text-white flex items-center gap-2">
                      <span>{item.title}</span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{item.description}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
              </button>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              No matching records found for "{query}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
