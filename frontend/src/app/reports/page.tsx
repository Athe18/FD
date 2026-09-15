"use client";

import React from "react";
import { 
  FileSpreadsheet, 
  FileText, 
  Download, 
  FileCheck2, 
  Printer, 
  Clock, 
  Layers
} from "lucide-react";

export default function ReportsPage() {
  const handleDownload = (format: "pdf" | "excel" | "csv") => {
    const url = `http://127.0.0.1:8000/api/v1/planning/export/${format}`;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              Operational Reporting & Compliance
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Prabal Report & Plan Export Center
          </h1>
          <p className="text-xs text-slate-400">
            Generate and export official Indian Railways weekly block schedules, train impact logs, and audit records
          </p>
        </div>
      </div>

      {/* Export Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* PDF Official Report */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">Official Printable Block Plan (PDF)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Standard operating notice format with divisional authority stamp, coordinated block intervals, safety clearances, and task breakdowns.
            </p>
          </div>
          <button
            onClick={() => handleDownload("pdf")}
            className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Official PDF</span>
          </button>
        </div>

        {/* Excel Multi-Sheet Spreadsheet */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">Comprehensive Data Matrix (Excel)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Multi-sheet workbook containing optimized block schedules, machine transit times, gang allocations, and comparative performance KPIs.
            </p>
          </div>
          <button
            onClick={() => handleDownload("excel")}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Excel (.xlsx)</span>
          </button>
        </div>

        {/* CSV Machine-Readable Export */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">Raw Operational Stream (CSV)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Lightweight comma-separated format for automated ingestion into external CRIS COA/TMS legacy systems.
            </p>
          </div>
          <button
            onClick={() => handleDownload("csv")}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV Stream</span>
          </button>
        </div>
      </div>
    </div>
  );
}
