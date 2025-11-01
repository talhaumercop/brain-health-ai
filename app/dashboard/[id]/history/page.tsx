"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [chats, setChats] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openChatId, setOpenChatId] = useState<string | null>(null);

  const limit = 5; // 🧩 Number of chats per page

  useEffect(() => {
   const fetchChats = async () => {
  setLoading(true);
  try {
    const res = await fetch(`/api/history?page=${page}&limit=${limit}`, {
      credentials: "include",
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : { success: false };
    if (data.success) {
      setChats(data.chats);
      setTotal(data.total);
    } else {
      console.error("Error fetching chats:", data);
    }
  } catch (err) {
    console.error("Failed to fetch chats:", err);
  } finally {
    setLoading(false);
  }
};
    fetchChats();
  }, [page]);

  const totalPages = Math.ceil(total / limit);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-gray-400">
        Loading...
      </div>
    );

  if (!chats.length)
    return (
      <div className="flex h-screen items-center justify-center text-gray-400 text-lg">
        No chat history yet 💬
      </div>
    );

  return (
    <div className="min-h-screen text-white px-6 py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center mb-10">
          🧠 Chat History
        </h1>

        {chats.map((chat) => (
          <div
            key={chat.id}
            className="p-6 bg-neutral-900 rounded-2xl shadow-md border border-neutral-800 hover:border-neutral-700 transition-colors duration-200 cursor-pointer"
            onClick={() =>
              setOpenChatId((prev) => (prev === chat.id ? null : chat.id))
            }
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">
                {new Date(chat.createdAt).toLocaleString()}
              </span>
              <span className="text-xs text-gray-500">
                {openChatId === chat.id ? "▲ Hide" : "▼ View"}
              </span>
            </div>

            <p className="text-blue-400 font-semibold">You:</p>
            <p className="text-gray-300 line-clamp-1">
              {chat.question.slice(0, 150)}...
            </p>

            {openChatId === chat.id && (
              <div className="mt-4 border-t border-neutral-800 pt-4 space-y-2 animate-fadeIn">
                <p className="font-semibold text-blue-400">You:</p>
                <p className="text-gray-300 leading-relaxed">{chat.question}</p>

                <p className="font-semibold text-emerald-400 mt-4">AI:</p>
                <p className="text-gray-200 leading-relaxed">{chat.answer}</p>
              </div>
            )}
          </div>
        ))}

        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 bg-neutral-800 rounded-lg disabled:opacity-40 hover:bg-neutral-700 transition-all"
          >
            Prev
          </button>

          <span className="text-gray-400">
            Page {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-neutral-800 rounded-lg disabled:opacity-40 hover:bg-neutral-700 transition-all"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
