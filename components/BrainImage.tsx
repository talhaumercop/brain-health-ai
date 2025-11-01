'use client';
import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';

const BrainImage = () => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      // normalize cursor position to [-1, 1]
      const x = (e.clientX / innerWidth) * 2 - 1;
      const y = (e.clientY / innerHeight) * 2 - 1;
      setCoords({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className='relative flex justify-center items-center w-full h-screen overflow-hidden bg-black'>
      <motion.img
        src="/brain.png"
        alt="floating brain"
        className="h-[80vh] w-[80vw] object-contain"
        animate={{
          x: coords.x * -30, // move opposite direction
          y: coords.y * -30,
        }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 20,
        }}
      />
    </div>
  );
};

export default BrainImage;
