'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Save } from 'lucide-react';

export default function PersonalizationPage() {
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ bio }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage('✨ Your personalization info was saved successfully.');
        setBio('');
      } else {
        setMessage('❌ Failed to update bio. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setMessage('⚠️ Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black flex flex-col justify-center items-center overflow-hidden px-4">
      {/* Floating Particle Lights */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-green-400 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: Math.random(),
            }}
            animate={{
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Page Title */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-5xl md:text-6xl font-semibold text-emerald-400 italic mb-12 tracking-wide flex items-center gap-3 z-10"
      >
        <Sparkles className="text-emerald-400 w-8 h-8" />
        Personalize Your AI
      </motion.h1>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        className="relative w-full max-w-2xl bg-gradient-to-b from-neutral-950 to-black border border-emerald-500/40 rounded-2xl p-8 backdrop-blur-md shadow-[0_0_30px_rgba(0,255,128,0.1)] hover:shadow-[0_0_40px_rgba(0,255,128,0.2)] transition-all duration-500 z-10"
      >
        <motion.label
          htmlFor="bio"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="block text-gray-200 text-lg mb-3 font-medium"
        >
          Tell the AI about yourself
        </motion.label>

        <motion.textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Example: I’m a frontend developer who loves 3D design and AI tools."
          className="w-full h-40 bg-black/70 text-white border border-emerald-600 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder-gray-500 resize-none transition-all duration-300"
          whileFocus={{ scale: 1.01, boxShadow: '0 0 20px rgba(16,255,128,0.3)' }}
        />

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`mt-6 w-full py-3 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition 
            ${loading
              ? 'bg-emerald-900 text-gray-400 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-500 text-black shadow-[0_0_20px_rgba(0,255,128,0.4)]'}
          `}
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
            />
          ) : (
            <>
              <Save className="w-5 h-5" /> Save Personalization
            </>
          )}
        </motion.button>

        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mt-6 text-emerald-400 text-sm font-medium"
          >
            {message}
          </motion.p>
        )}

        {/* Glowing Animated Border */}
        <motion.div
          className="absolute inset-0 rounded-2xl border border-emerald-500/40 pointer-events-none"
          animate={{
            boxShadow: [
              '0 0 10px rgba(16,255,128,0.2)',
              '0 0 30px rgba(16,255,128,0.4)',
              '0 0 10px rgba(16,255,128,0.2)',
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.form>

      {/* Ambient Bottom Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-emerald-500/10 to-transparent pointer-events-none" />
    </div>
  );
}
