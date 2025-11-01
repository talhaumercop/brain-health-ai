'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  panelCount?: number;
  loadDuration?: number;
  delayStep?: number;
  duration?: number;
  colors?: string[];
  onComplete?: () => void;
};

export default function StairColumnsReveal({
  panelCount = 5,
  loadDuration = 1200,
  delayStep = 0.25,
  duration = 0.7,
  colors,
  onComplete,
}: Props) {
  const [started, setStarted] = useState(false);
  const [visible, setVisible] = useState(true);

  const panelColors = colors && colors.length >= panelCount
    ? colors
    : ['#0D2818', '#04471C', '#058C42', '#16DB65', '#A3FFBF'];

  useEffect(() => {
    const t = setTimeout(() => {
      setStarted(true);
      const total = (delayStep * (panelCount - 1) + duration) * 1000 + 500;
      setTimeout(() => {
        setVisible(false);
        if (onComplete) onComplete();
      }, total);
    }, loadDuration);
    return () => clearTimeout(t);
  }, [loadDuration, panelCount, delayStep, duration, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
        >
          {/* Base background */}
          <div className="absolute inset-0 bg-black" />

          {/* Stairs (Vertical Panels) */}
          <div className="relative w-full h-full flex">
            {Array.from({ length: panelCount }).map((_, idx) => {
              const delay = idx * delayStep;
              const color = panelColors[idx % panelColors.length];
              return (
                <motion.div
                  key={idx}
                  className="flex-1 h-full"
                  initial={{
                    y: '0%',
                    backgroundColor: '#000000',
                  }}
                  animate={
                    started
                      ? {
                          y: '-100%',
                          backgroundColor: color,
                        }
                      : {
                          y: '0%',
                          backgroundColor: '#000000',
                        }
                  }
                  transition={{
                    y: { duration, delay, ease: [0.65, 0, 0.35, 1] },
                    backgroundColor: {
                      delay: delay / 1.5,
                      duration: duration / 1.2,
                      ease: 'easeInOut',
                    },
                  }}
                />
              );
            })}
          </div>

          {/* Loading Text + Progress Bar */}
          {!started && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Animated Gradient Text */}
              <motion.h1
                className="text-5xl md:text-7xl font-serif italic font-semibold bg-gradient-to-r from-emerald-300 via-lime-400 to-emerald-600 bg-[length:200%_auto] text-transparent bg-clip-text"
                animate={{ backgroundPosition: ['0% center', '200% center'] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                Loading...
              </motion.h1>

              {/* Progress Bar */}
              <motion.div
                className="mt-8 w-[60%] md:w-[40%] h-2 rounded-full bg-neutral-800 overflow-hidden shadow-inner"
              >
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-lime-500"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{
                    duration: loadDuration / 1000,
                    ease: [0.45, 0, 0.55, 1],
                  }}
                />
              </motion.div>

              {/* Optional Subtext */}
              <motion.div
                className="mt-4 text-neutral-400 text-sm tracking-widest font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: loadDuration / 1000,
                  ease: 'easeInOut',
                  times: [0, 0.1, 0.9, 1],
                }}
              >
                Initializing neural pathways...
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
