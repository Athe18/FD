"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  Cpu, 
  Sliders
} from "lucide-react";
import { api } from "@/lib/api";

interface AICopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  sender: "user" | "ai";
  text: string;
  toolsExecuted?: string[];
  citations?: string[];
  time: string;
}

export default function AICopilotDrawer({ isOpen, onClose }: AICopilotDrawerProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "### 🛡️ Prabal Intelligent Decision Co-Pilot\n\nI am connected to the deterministic **OR-Tools CP-SAT Optimizer**, **Safety Rule Engine**, and **Railway Knowledge Base**.\n\nAsk any question or click a prompt shortcut below to analyze maintenance windows or test operational what-if scenarios.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      sender: "user",
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput("");
    setLoading(true);

    try {
      const res = await api.sendChatMessage(textToSend);
      const aiMsg: Message = {
        sender: "ai",
        text: res.response,
        toolsExecuted: res.tools_executed,
        citations: res.citations,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "⚠️ Failed to connect to Prabal decision engine. Please verify the backend is running.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 md:w-[480px] bg-slate-900/95 border-l border-slate-800 shadow-2xl z-50 flex flex-col backdrop-blur-xl animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              Prabal AI Co-Pilot
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 font-mono">
                GROUNDED
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Zero Hallucination • Deterministic Tools</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Quick Action Prompts */}
      <div className="p-3 bg-slate-950/40 border-b border-slate-800/80 flex flex-wrap gap-1.5 text-[11px]">
        <button
          onClick={() => handleSend("Why did Prabal recommend this consolidated block?")}
          className="px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700/60 flex items-center gap-1 text-left"
        >
          <Cpu className="w-3 h-3 text-blue-400" /> Why this block schedule?
        </button>
        <button
          onClick={() => handleSend("What happens if we move the block to 3 PM?")}
          className="px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700/60 flex items-center gap-1 text-left"
        >
          <Sliders className="w-3 h-3 text-amber-400" /> Shift block to 3 PM
        </button>
        <button
          onClick={() => handleSend("Simulate 45-minute RTIS train delay on Express 22221")}
          className="px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700/60 flex items-center gap-1 text-left"
        >
          <AlertTriangle className="w-3 h-3 text-red-400" /> Simulate Train Delay
        </button>
        <button
          onClick={() => handleSend("Query IRPWM rule on track machine block clearance")}
          className="px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700/60 flex items-center gap-1 text-left"
        >
          <BookOpen className="w-3 h-3 text-emerald-400" /> IRPWM Block Rules
        </button>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              m.sender === "user" ? "items-end" : "items-start"
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1 px-1">
              {m.sender === "user" ? (
                <>
                  <span className="text-[10px] text-slate-500">{m.time}</span>
                  <span className="text-[11px] font-semibold text-blue-400">Section Controller</span>
                  <User className="w-3.5 h-3.5 text-blue-400" />
                </>
              ) : (
                <>
                  <Bot className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[11px] font-semibold text-emerald-400">Prabal AI</span>
                  <span className="text-[10px] text-slate-500">{m.time}</span>
                </>
              )}
            </div>

            <div
              className={`p-3.5 rounded-xl max-w-[92%] leading-relaxed ${
                m.sender === "user"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "bg-slate-800/90 text-slate-200 border border-slate-700/80 shadow-sm"
              }`}
            >
              {/* Tool Execution Badges */}
              {m.toolsExecuted && m.toolsExecuted.length > 0 && (
                <div className="mb-2.5 flex flex-wrap gap-1.5 border-b border-slate-700/60 pb-2">
                  {m.toolsExecuted.map((t, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1"
                    >
                      <Cpu className="w-2.5 h-2.5" /> Executed: {t}
                    </span>
                  ))}
                </div>
              )}

              {/* Message Content (Formatted Markdown) */}
              <div className="whitespace-pre-wrap space-y-2 text-xs">
                {m.text}
              </div>

              {/* Verified Citations */}
              {m.citations && m.citations.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-700/60 text-[11px] text-amber-300/90 flex items-start gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                  <span>
                    <strong>Rule Authority:</strong> {m.citations.join(" • ")}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs italic py-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            <span>Consulting OR-Tools CP-SAT & Conflict Engine...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Prabal about corridor maintenance, what-if, or safety rules..."
            className="flex-1 bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
