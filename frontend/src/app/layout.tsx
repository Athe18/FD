"use client";

import React, { useState } from "react";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import AICopilotDrawer from "@/components/ai/AICopilotDrawer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [copilotOpen, setCopilotOpen] = useState(false);

  return (
    <html lang="en" className="dark">
      <head>
        <title>Prabal | Railway Maintenance & Block Optimization</title>
        <meta name="description" content="Intelligent Coordination Layer for Railway Maintenance Planning and Automatic Block Optimization (SIH 2026)" />
      </head>
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-blue-600 selection:text-white">
        <Navbar 
          copilotOpen={copilotOpen} 
          onToggleCopilot={() => setCopilotOpen(!copilotOpen)} 
        />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6 overflow-y-auto max-w-[1600px] w-full mx-auto">
            {children}
          </main>
        </div>
        <AICopilotDrawer 
          isOpen={copilotOpen} 
          onClose={() => setCopilotOpen(false)} 
        />
      </body>
    </html>
  );
}
