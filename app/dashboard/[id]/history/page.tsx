"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Brain, Loader2 } from "lucide-react";

export default function Page() {
  const [chats, setChats] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openChatId, setOpenChatId] = useState<string | null>(null);

  const limit = 5;

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

  // 🔄 Loading state
  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-emerald-400 text-lg">
        <Loader2 className="animate-spin mr-3" /> Syncing neural memories...
      </div>
    );

  // 🫥 Empty state
  if (!chats.length)
    return (
      <div className="flex h-screen items-center justify-center text-gray-500 text-lg">
        No memory logs yet 💬
      </div>
    );

  return (
    <div className="bg-black text-white px-6 py-12 relative h-full">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,128,0.1),transparent_70%)] pointer-events-none" />

      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center text-5xl font-bold mb-12 tracking-wide flex items-center justify-center gap-3 text-emerald-400"
      >
        <Brain className="w-10 h-10 text-emerald-400" />
        Neural Memory Archive
      </motion.h1>

      <div className="max-w-3xl mx-auto space-y-6">
        <AnimatePresence>
          {chats.map((chat, idx) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
              className="relative border border-emerald-600/20 bg-neutral-950/70 rounded-2xl p-6 shadow-[0_0_25px_rgba(0,255,128,0.05)] hover:shadow-[0_0_30px_rgba(0,255,128,0.2)] transition-all duration-300 cursor-pointer"
              onClick={() =>
                setOpenChatId((prev) => (prev === chat.id ? null : chat.id))
              }
            >
              {/* Timestamp */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-500">
                  {new Date(chat.createdAt).toLocaleString()}
                </span>
                {openChatId === chat.id ? (
                  <ChevronUp className="text-emerald-400" size={18} />
                ) : (
                  <ChevronDown className="text-gray-500" size={18} />
                )}
              </div>

              {/* Preview */}
              <p className="text-emerald-400 font-semibold">You:</p>
              <p className="text-gray-300 line-clamp-1">
                {chat.question.slice(0, 150)}...
              </p>

              {/* Expanded content */}
              <AnimatePresence>
                {openChatId === chat.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="mt-4 border-t border-emerald-600/20 pt-4 space-y-3 overflow-hidden"
                  >
                    <p className="font-semibold text-emerald-400">You:</p>
                    <p className="text-gray-200 leading-relaxed">
                      {chat.question}
                    </p>

                    <p className="font-semibold text-cyan-400 mt-4">AI:</p>
                    <p className="text-gray-100 leading-relaxed whitespace-pre-line">
                      {chat.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Decorative pulse */}
              <motion.div
                className="absolute -top-[1px] left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-50"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Pagination */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center items-center gap-4 mt-10"
        >
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-5 py-2 bg-neutral-900 border border-emerald-600/40 rounded-lg hover:bg-neutral-800 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Prev
          </button>

          <span className="text-gray-400 font-medium">
            Page {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-5 py-2 bg-neutral-900 border border-emerald-600/40 rounded-lg hover:bg-neutral-800 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </motion.div>
      </div>

      {/* Ambient bottom glow */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-emerald-500/10 to-transparent pointer-events-none" />
    </div>
  );
}
