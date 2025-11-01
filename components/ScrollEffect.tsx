'use client';
import { useState, useEffect, useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';

export default function ScrollVideo() {
  const { scrollYProgress } = useScroll();
  const [frame, setFrame] = useState(1);
  const frameRef = useRef(1);
  const totalFrames = 192;

  // Smooth interpolation without jumps
  const currentFrame = useTransform(scrollYProgress, [0, 1], [1, totalFrames], {
    clamp: true,
  });

  useEffect(() => {
    const unsubscribe = currentFrame.on('change', (value) => {
      const f = Math.round(value);
      if (f !== frameRef.current && f >= 1 && f <= totalFrames) {
        frameRef.current = f;
        setFrame(f);
      }
    });
    return () => unsubscribe();
  }, [currentFrame, totalFrames]);

  const imageSrc = `/frames/frame_${String(frame).padStart(4, '0')}.jpg`;

  return (
    <div className="relative w-full bg-black "  style={{ height: '500vh' }}>
      {/* Sticky video player */}
      <div className="sticky top-0 flex justify-center items-center h-screen w-full bg-black">
        <motion.img
          src={imageSrc}
          alt="Scroll animation"
          className="h-[99vh] w-[90vw] object-cover border-4 rounded-2xl border-b-emerald-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}