// app/dashboard/[id]/page.tsx
import React from "react";
import Dashboard from "@/components/dashboard/Home";
import { auth } from "@/auth";
import { db } from "@/lib/db";

type ChatRow = {
  id: string;
  question: string;
  answer: string;
  zone?: string | null;
  score?: number | null;
  createdAt: string;
};

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const session = await auth();

  // Security: ensure the session user matches url id
  if (!session?.user?.id || session.user.id !== id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-red-400">
        Unauthorized
      </div>
    );
  }

  // Fetch recent chats (limit 100)
  const chatsRaw = await db.chat.findMany({
    where: { userId: id },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  // Normalize and prepare data for client
  const chats: ChatRow[] = chatsRaw.map((c) => ({
    id: c.id,
    question: c.question,
    answer: c.answer,
    zone: c.zone ?? null,
    score: c.score ?? null,
    createdAt: c.createdAt.toISOString(),
  }));

  // Compute quick aggregates
  const zoneCounts = { Red: 0, Yellow: 0, Green: 0, Unknown: 0 };
  const scores: { date: string; score: number }[] = [];

  // Helper zone->score fallback if score missing
  const zoneScoreDefault = (zone?: string | null) => {
    if (!zone) return 50;
    if (zone.toLowerCase() === "red") return 20;
    if (zone.toLowerCase() === "yellow") return 50;
    if (zone.toLowerCase() === "green") return 85;
    return 50;
  };

  // We'll build timeseries by date (day)
  const scoreByDay: Record<string, { sum: number; count: number }> = {};

  for (const c of chatsRaw) {
    const zoneKey = c.zone ?? "Unknown";
    if (zoneKey === "Red") zoneCounts.Red += 1;
    else if (zoneKey === "Yellow") zoneCounts.Yellow += 1;
    else if (zoneKey === "Green") zoneCounts.Green += 1;
    else zoneCounts.Unknown += 1;

    const createdDay = c.createdAt.toISOString().slice(0, 10); // YYYY-MM-DD
    const sc = c.score ?? zoneScoreDefault(c.zone);

    if (!scoreByDay[createdDay]) scoreByDay[createdDay] = { sum: 0, count: 0 };
    scoreByDay[createdDay].sum += sc;
    scoreByDay[createdDay].count += 1;
  }

  // Convert scoreByDay -> array sorted ascending
  const dayKeys = Object.keys(scoreByDay).sort();
  for (const day of dayKeys) {
    const entry = scoreByDay[day];
    const avg = Math.round(entry.sum / entry.count);
    scores.push({ date: day, score: avg });
  }

  const initialData = {
    chats,
    zoneCounts,
    scores,
  };

  // Render client component with initialData as prop
  // Dashboard is a client component (renders charts)
  return (
    <div className="min-h-screen bg-[#000000]">
      {/* top spacing to account for your navbar if any */}
      <div className="pt-20">
        {/* @ts-expect-error Server->Client prop transfer OK */}
        <Dashboard userId={id} initialData={initialData} />
      </div>
    </div>
  );
}
