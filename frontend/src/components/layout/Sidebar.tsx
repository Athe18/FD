"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  CalendarDays, 
  Map, 
  AlertOctagon, 
  SlidersHorizontal, 
  Cpu, 
  FileCheck2, 
  Radio, 
  FileSpreadsheet
} from "lucide-react";

interface NavGroup {
  groupTitle: string;
  items: {
    name: string;
    href: string;
    icon: any;
    badge?: string;
    highlight?: boolean;
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    groupTitle: "OPERATIONS",
    items: [
      { name: "Command Dashboard", href: "/", icon: LayoutDashboard },
      { name: "Gantt Planning Board", href: "/planning", icon: CalendarDays },
      { name: "Railway Network Map", href: "/map", icon: Map },
    ],
  },
  {
    groupTitle: "MAINTENANCE & RISK",
    items: [
      { name: "Asset Health & ML Risk", href: "/assets", icon: Cpu, badge: "ML" },
      { name: "Conflict Center", href: "/conflicts", icon: AlertOctagon },
    ],
  },
  {
    groupTitle: "SIMULATION & WHAT-IF",
    items: [
      { name: "What-If Sandbox", href: "/whatif", icon: SlidersHorizontal, highlight: true },
    ],
  },
  {
    groupTitle: "GOVERNANCE & SYSTEM",
    items: [
      { name: "Controller Approvals", href: "/approvals", icon: FileCheck2 },
      { name: "Integrations & Freshness", href: "/integrations", icon: Radio },
      { name: "Reports & Exports", href: "/reports", icon: FileSpreadsheet },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-slate-950/90 border-r border-slate-800/80 flex flex-col justify-between p-3.5 shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="space-y-4">
        {NAV_GROUPS.map((group, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
              {group.groupTitle}
            </div>
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Controller Shift Card */}
      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 font-medium text-[11px]">Active Controller</span>
          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
            ONLINE
          </span>
        </div>
        <p className="font-semibold text-slate-200 text-xs">Section Controller (Thal Ghat)</p>
        <p className="text-[10px] text-slate-400">Shift: 08:00 – 20:00</p>
      </div>
    </aside>
  );
}
