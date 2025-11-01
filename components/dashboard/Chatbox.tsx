'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

type ChatBoxProps = {
    userId: string;
};

export default function ChatBox({ userId }: ChatBoxProps) {
    const [userInput, setUserInput] = useState('');
    const [response, setResponse] = useState<{ question: string; answer: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollTimeoutRef = useRef<NodeJS.Timeout>();

    // Auto-scroll to bottom when response updates
    useEffect(() => {
        if (scrollContainerRef.current) {
            const scrollToBottom = () => {
                if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
                }
            };
            
            // Scroll immediately for text updates
            scrollToBottom();
            
            // Use requestAnimationFrame for smooth animation sync
            const frameId = requestAnimationFrame(scrollToBottom);
            return () => cancelAnimationFrame(frameId);
        }
    }, [response?.answer, loading]);

    // Track scrolling state for visual feedback
    const handleScroll = () => {
        setIsScrolling(true);
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        
        scrollTimeoutRef.current = setTimeout(() => {
            setIsScrolling(false);
        }, 1500);
    };

    // Check if scrolled to bottom
    const isScrolledToBottom = () => {
        if (!scrollContainerRef.current) return true;
        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
        return scrollHeight - scrollTop - clientHeight < 50;
    };

    const handleSubmit = async () => {
        if (!userInput.trim()) return;

        const question = userInput;
        setResponse({ question, answer: '' });
        setUserInput('');
        setLoading(true);

        try {
            const res = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: question, userId }),
            });

            const data = await res.json();
            if (res.ok && data?.rewritten) {
                setResponse({ question, answer: data.rewritten });
            } else {
                setResponse({
                    question,
                    answer: data.error || 'AI failed to respond properly.',
                });
            }
        } catch (error) {
            console.error('AI request failed:', error);
            setResponse({
                question,
                answer: 'Something went wrong connecting to AI.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !loading) handleSubmit();
    };

    return (
        <div className="relative flex flex-col items-center justify-center h-screen w-full bg-black text-white overflow-hidden">
            {/* Heading */}
            <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="absolute top-10 text-4xl md:text-6xl font-normal text-gray-400 underline decoration-emerald-500/50 decoration-4 italic"
            >
                Neural Insight Terminal
            </motion.h1>

            {/* Message Section */}
            <div className="flex flex-col items-center justify-center flex-1 w-full text-center px-6">
                <AnimatePresence mode="wait">
                    {response && (
                        <motion.div
                            key={response.question}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -40 }}
                            transition={{ duration: 0.7, ease: 'easeInOut' }}
                            className="flex flex-col items-center space-y-8 w-full"
                        >
                            <motion.p
                                className="text-2xl md:text-3xl font-light text-emerald-300 italic max-w-2xl"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                            >
                                "{response.question}"
                            </motion.p>

                            {/* Enhanced AI Response Box with smooth scrolling */}
                            <div className="relative w-full max-w-2xl max-h-[40vh]">
                                <motion.div
                                    ref={scrollContainerRef}
                                    onScroll={handleScroll}
                                    className="h-full overflow-y-auto scroll-smooth"
                                    style={{
                                        scrollBehavior: 'smooth',
                                    }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8, duration: 1 }}
                                >
                                    {/* Custom scrollbar styling with CSS */}
                                    <style>{`
                                        .scroll-smooth {
                                            scrollbar-width: thin;
                                            scrollbar-color: rgba(16, 255, 128, 0.6) transparent;
                                        }
                                        .scroll-smooth::-webkit-scrollbar {
                                            width: 8px;
                                        }
                                        .scroll-smooth::-webkit-scrollbar-track {
                                            background: transparent;
                                        }
                                        .scroll-smooth::-webkit-scrollbar-thumb {
                                            background: rgba(16, 255, 128, 0.6);
                                            border-radius: 4px;
                                            transition: background 0.3s;
                                        }
                                        .scroll-smooth::-webkit-scrollbar-thumb:hover {
                                            background: rgba(16, 255, 128, 0.9);
                                        }
                                    `}</style>

                                    <div className="text-lg md:text-xl text-white/90 leading-relaxed font-light px-6 py-4">
                                        {loading ? (
                                            <motion.span
                                                animate={{ opacity: [0.2, 1, 0.2] }}
                                                transition={{ duration: 1.2, repeat: Infinity }}
                                                className="text-emerald-400 italic"
                                            >
                                                Thinking...
                                            </motion.span>
                                        ) : (
                                            <motion.div
                                                className="prose prose-invert prose-lg max-w-none"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                <ReactMarkdown
                                                    components={{
                                                        h1: ({ children }) => <h1 className="text-3xl font-bold text-emerald-500 mt-10 mb-5">{children}</h1>,
                                                        h2: ({ children }) => <h2 className="text-2xl font-bold text-emerald-400 mt-8 mb-4">{children}</h2>,
                                                        h3: ({ children }) => <h3 className="text-xl font-bold text-emerald-300 mt-6 mb-3">{children}</h3>,
                                                        p: ({ children }) => <p className="my-3">{children}</p>,
                                                        code: ({ children }) => (
                                                            <code className="bg-gray-800 px-2 py-1 rounded text-emerald-200 text-sm">{children}</code>
                                                        ),
                                                        pre: ({ children }) => (
                                                            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto my-4">{children}</pre>
                                                        ),
                                                        ul: ({ children }) => <ul className="my-4 ml-4 space-y-2">{children}</ul>,
                                                        li: ({ children }) => (
                                                            <li className="flex items-start">
                                                                <span className="text-emerald-400 mr-2">•</span>
                                                                {children}
                                                            </li>
                                                        ),
                                                        blockquote: ({ children }) => (
                                                            <blockquote className="border-l-4 border-emerald-500 pl-4 my-4 italic text-white/80">
                                                                {children}
                                                            </blockquote>
                                                        ),
                                                        hr: () => <hr className="my-6 border-gray-600" />,
                                                    }}
                                                >
                                                    {response.answer}
                                                </ReactMarkdown>
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Scroll fade indicators */}
                                {!isScrolledToBottom() && (
                                    <motion.div
                                        className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}

                                {/* Scroll indicator */}
                                <motion.div
                                    className="absolute bottom-2 left-1/2 -translate-x-1/2"
                                    animate={isScrolling ? { opacity: 1 } : { opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <motion.div
                                        animate={{ y: [0, 6, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className="text-emerald-400 text-sm"
                                    >
                                        ↓
                                    </motion.div>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Input Field */}
            <div className="w-[90%] md:w-[60%] lg:w-[50%] mb-16 relative flex items-center">
                <motion.input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your thought..."
                    className="w-full text-white text-xl md:text-2xl bg-black border-4 border-emerald-600 rounded-2xl py-6 px-6 placeholder-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500 transition-all duration-300"
                />

                {/* Send Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSubmit}
                    disabled={loading}
                    className="absolute right-4 bg-emerald-600 hover:bg-emerald-500 text-black font-bold rounded-xl px-4 py-3 transition-colors duration-300"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Send className="w-5 h-5" />
                    )}
                </motion.button>

                {/* Glow animation border */}
                <motion.div
                    className="absolute inset-0 rounded-2xl border-4 border-emerald-600 pointer-events-none"
                    animate={{
                        boxShadow: [
                            '0 0 10px rgba(16,255,128,0.3)',
                            '0 0 25px rgba(16,255,128,0.5)',
                            '0 0 10px rgba(16,255,128,0.3)',
                        ],
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                />
            </div>
        </div>
    );
}