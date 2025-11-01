'use client';
import React from 'react';
import JoinButton from './JoinButton';
import { motion } from 'framer-motion';

export default function Header() {
    return (
        <header
            id="home"
            className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#011409]"
        >
         {/* EXT + CTA ---- */} 
            <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="relative z-10 max-w-4xl w-full md:w-2/3 lg:w-1/2 px-8 py-8 text-center"
            >
                <h1 className="text-6xl md:text-8xl font-thin leading-tight text-white mb-6 relative">
                    A strong{' '}
                    <span className="text-[#16DB65] italic font-serif font-extrabold mask-radial-from-neutral-400 bg-emerald-950 p-4 border rounded-2xl">
                        brain
                    </span>{' '}
                    creates a strong 
                    <span className=" text-[#16DB65] italic font-serif font-extrabold mask-radial-from-neutral-400 bg-emerald-950 p-4 border rounded-2xl">
                        thought
                    </span>{' '}
                </h1>

                <div className="mt-8 flex items-center justify-center">
                    <JoinButton />
                </div>
            </motion.div>
        </header>
    );
}
