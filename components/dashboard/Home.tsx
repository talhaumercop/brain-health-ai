// components/Dashboard.tsx
'use client';

import React, { useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Eye, Download } from "lucide-react";

type ChatRow = {
  id: string;
  question: string;
  answer: string;
  zone?: string | null;
  score?: number | null;
  createdAt: string;
};

type InitialData = {
  chats: ChatRow[];
  zoneCounts: { Red: number; Yellow: number; Green: number; Unknown?: number };
  scores: { date: string; score: number }[];
};

const COLORS = {
  Red: "#FF6B6B",
  Yellow: "#FFC857",
  Green: "#16DB65",
  Unknown: "#2D2D2D",
};

function smallDateLabel(dateStr: string) {
  // "2025-10-30" -> "Oct 30"
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}

export default function Dashboard({ userId, initialData }: { userId: string; initialData: InitialData }) {
  const { chats, zoneCounts, scores } = initialData;

  const [selectedChat, setSelectedChat] = useState<ChatRow | null>(null);

  // Prepare pie data
  const pieData = useMemo(() => {
    return [
      { name: "Red", value: zoneCounts.Red || 0 },
      { name: "Yellow", value: zoneCounts.Yellow || 0 },
      { name: "Green", value: zoneCounts.Green || 0 },
    ];
  }, [zoneCounts]);

  // Score timeseries
  const scoreData = useMemo(() => scores.map((s) => ({ date: smallDateLabel(s.date), score: s.score })), [scores]);

  // Recent chats top 6
  const recentChats = chats.slice(0, 8);

  // Average score
  const avgScore = useMemo(() => {
    if (!scores.length) return null;
    const sum = scores.reduce((acc, s) => acc + s.score, 0);
    return Math.round(sum / scores.length);
  }, [scores]);

  // Zone dominant
  const totalZones = (zoneCounts.Red || 0) + (zoneCounts.Yellow || 0) + (zoneCounts.Green || 0);
  let dominantZone: string | null = null;
  if (totalZones > 0) {
    if (zoneCounts.Red >= zoneCounts.Yellow && zoneCounts.Red >= zoneCounts.Green) dominantZone = "Red";
    else if (zoneCounts.Yellow >= zoneCounts.Green) dominantZone = "Yellow";
    else dominantZone = "Green";
  }

  return (
    <div className="max-w-7xl mx-auto px-6">
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <header className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-extralight text-white">Neural Insight — Dashboard</h2>
            <p className="text-sm text-gray-400 mt-1">Weekly snapshot · Personalized mental-performance metrics</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-gray-400">Avg. Performance</div>
              <div className="text-2xl font-bold text-white">{avgScore ?? "—"}</div>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg bg-[#0D2818] border border-[#16DB65]/20 text-[#16DB65] hover:bg-[#0D2818]/80 transition"
              aria-label="Refresh"
            >
              Refresh
            </button>
          </div>
        </header>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Top row charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Zone pie */}
              <div className="bg-neutral-900 rounded-2xl p-5 border border-[#16DB65]/10 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg text-white font-medium">Zone Distribution</h3>
                  <div className="text-sm text-gray-400">Last {chats.length} entries</div>
                </div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={44} outerRadius={72} paddingAngle={4}>
                        {pieData.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={COLORS[entry.name as keyof typeof COLORS] || COLORS.Unknown} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: "#0b0b0b", border: "1px solid rgba(22,219,101,0.12)" }}
                        formatter={(value: number) => `${value}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 flex gap-3 flex-wrap">
                  {pieData.map((p) => (
                    <div key={p.name} className="flex items-center gap-2 text-sm">
                      <span style={{ background: COLORS[p.name as keyof typeof COLORS] }} className="w-3 h-3 rounded-full inline-block" />
                      <span className="text-gray-300">{p.name}</span>
                      <span className="text-gray-400 ml-1">({p.value})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Score trend */}
              <div className="bg-neutral-900 rounded-2xl p-5 border border-[#16DB65]/10 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg text-white font-medium">Performance Trend</h3>
                  <div className="text-sm text-gray-400">Average score per day</div>
                </div>

                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={scoreData}>
                      <CartesianGrid stroke="#111" vertical={false} />
                      <XAxis dataKey="date" tick={{ fill: "#9CA3AF" }} />
                      <YAxis domain={[0, 100]} tick={{ fill: "#9CA3AF" }} />
                      <Tooltip contentStyle={{ background: "#0b0b0b", border: "1px solid rgba(22,219,101,0.12)" }} />
                      <Line type="monotone" dataKey="score" stroke="#16DB65" strokeWidth={3} dot={{ r: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 text-sm text-gray-400">Higher is better — aim for consistent green zone.</div>
              </div>
            </div>

            {/* Recent insights list */}
            <div className="bg-neutral-900 rounded-2xl p-5 border border-[#16DB65]/8 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg text-white font-medium">Recent Insights</h3>
                <div className="text-sm text-gray-400">{chats.length} total</div>
              </div>

              <div className="grid gap-3">
                {recentChats.map((c) => (
                  <motion.button
                    key={c.id}
                    onClick={() => setSelectedChat(c)}
                    whileHover={{ scale: 1.01 }}
                    className="w-full text-left rounded-xl p-4 bg-[#060606] border border-[#16DB65]/6 hover:border-[#16DB65]/30 transition flex flex-col"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm text-gray-400">{new Date(c.createdAt).toLocaleString()}</div>
                        <div className="text-md font-semibold text-emerald-300 mt-1 line-clamp-2">{c.question}</div>
                      </div>
                      <div className="ml-4 text-right">
                        <div className="text-sm text-gray-300">{c.zone ?? "—"}</div>
                        <div className="text-sm text-gray-400">{c.score ?? "—"}</div>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-gray-300 line-clamp-3">{c.answer}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Summary & Actions */}
          <aside className="space-y-6">
            <div className="bg-neutral-900 rounded-2xl p-5 border border-[#16DB65]/8 shadow-lg text-center">
              <h4 className="text-sm text-gray-400">Current State</h4>
              <div className="mt-3">
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${dominantZone === "Red" ? "bg-red-700 text-white" : dominantZone === "Yellow" ? "bg-yellow-600 text-black" : dominantZone === "Green" ? "bg-emerald-600 text-black" : "bg-gray-700 text-white"}`}>
                  {dominantZone ?? "—"}
                </div>
              </div>

              <div className="mt-4">
                <div className="text-xs text-gray-400">Latest action</div>
                <div className="text-sm text-white mt-1">{recentChats[0]?.question ?? "—"}</div>
              </div>

              <div className="mt-6 flex gap-3 justify-center">
                <button className="px-4 py-2 rounded-lg bg-[#0D2818] text-[#16DB65] border border-[#16DB65]/20">New Insight</button>
                <button
                  onClick={() => {
                    // Export chat history (simple JSON download)
                    const a = document.createElement("a");
                    const blob = new Blob([JSON.stringify(chats, null, 2)], { type: "application/json" });
                    a.href = URL.createObjectURL(blob);
                    a.download = `brain-chats-${new Date().toISOString().slice(0,10)}.json`;
                    a.click();
                  }}
                  className="px-3 py-2 rounded-lg bg-[#0D2818] text-[#16DB65] border border-[#16DB65]/10 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Export
                </button>
              </div>
            </div>

            {/* Zone breakdown bars */}
            <div className="bg-neutral-900 rounded-2xl p-5 border border-[#16DB65]/8 shadow-lg">
              <h4 className="text-sm text-gray-400 mb-4">Zone Breakdown</h4>
              <div className="space-y-3">
                {(["Green", "Yellow", "Red"] as const).map((key) => {
                  const val = (zoneCounts as any)[key] ?? 0;
                  const pct = (totalZones === 0 ? 0 : Math.round((val / totalZones) * 100));
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <div className="w-20 text-sm text-gray-300">{key}</div>
                      <div className="flex-1 bg-[#050505] rounded-full h-3 overflow-hidden">
                        <div style={{ width: `${pct}%`, background: COLORS[key as keyof typeof COLORS] }} className="h-3 rounded-full" />
                      </div>
                      <div className="w-10 text-sm text-gray-300 text-right">{val}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mini score sparkline */}
            <div className="bg-neutral-900 rounded-2xl p-5 border border-[#16DB65]/8 shadow-lg">
              <h4 className="text-sm text-gray-400">Score Sparkline</h4>
              <div className="h-28 mt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={scoreData}>
                    <Line type="monotone" dataKey="score" stroke="#16DB65" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 text-xs text-gray-400">Recent trend</div>
            </div>
          </aside>
        </div>
      </motion.div>

      {/* Chat detail modal */}
      {selectedChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSelectedChat(null)} />
          <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.18 }} className="relative max-w-3xl w-full bg-neutral-900 rounded-2xl p-6 border border-[#16DB65]/10 shadow-xl">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-gray-400">{new Date(selectedChat.createdAt).toLocaleString()}</div>
                <h3 className="text-xl text-white font-semibold mt-2">{selectedChat.question}</h3>
                <div className="mt-2 text-sm text-gray-300">Zone: <span className="font-medium text-emerald-300 ml-2">{selectedChat.zone ?? "—"}</span> · Score: <span className="font-medium text-emerald-300 ml-1">{selectedChat.score ?? "—"}</span></div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setSelectedChat(null)} className="px-3 py-2 rounded-lg bg-[#0D2818] text-[#16DB65]">Close</button>
              </div>
            </div>

            <div className="mt-6 prose prose-invert max-w-none text-white/90">
              <ReactMarkdown>{selectedChat.answer}</ReactMarkdown>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
