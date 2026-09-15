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
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    groupTitle: "OPERATIONS",
    items: [
      { name: "Command Center", href: "/", icon: LayoutDashboard },
      { name: "Gantt Planning", href: "/planning", icon: CalendarDays },
      { name: "Network GIS Map", href: "/map", icon: Map },
    ],
  },
  {
    groupTitle: "SAFETY & CONDITION",
    items: [
      { name: "Asset Diagnostics", href: "/assets", icon: Cpu, badge: "ML" },
      { name: "Conflict Center", href: "/conflicts", icon: AlertOctagon },
    ],
  },
  {
    groupTitle: "SIMULATION",
    items: [
      { name: "What-If Sandbox", href: "/whatif", icon: SlidersHorizontal },
    ],
  },
  {
    groupTitle: "GOVERNANCE",
    items: [
      { name: "Controller Approvals", href: "/approvals", icon: FileCheck2 },
      { name: "System Integrations", href: "/integrations", icon: Radio },
      { name: "Report Exports", href: "/reports", icon: FileSpreadsheet },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-[#090D16]/50 border-r border-white/[0.06] flex flex-col justify-between p-3 shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="space-y-4">
        {NAV_GROUPS.map((group, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-2 py-1 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              {group.groupTitle}
            </div>
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-blue-600/10 text-blue-400 font-semibold border border-blue-500/20"
                      : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Controller Shift Badge */}
      <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-[11px]">Section Controller</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </div>
        <p className="font-medium text-slate-300 text-xs truncate">Thal Ghat Desk</p>
      </div>
    </aside>
  );
}
