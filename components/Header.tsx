'use client';
import React from 'react';
import JoinButton from './JoinButton';
import { motion } from 'framer-motion';
import { useEffect, useState } from "react";

export default function Header() {

    return (
        <header
            id="home"
            className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#000000]"
        >
            {/* Arrow Image - ADD THIS HERE */}
            <motion.img
                src="/arrow.png"
                alt=""
                // initial={{ opacity: 0, scale: 0.8 }}
                // animate={{ opacity: 1, scale: 1 }}
                // transition={{ duration: 1, delay: 1.2, ease: 'easeOut' }}
                className="absolute top-[10] left-[-2vw] w-[500px] md:w-[700px] lg:w-[900px] h-auto z-0 pointer-events-none"
                style={{ transform: 'rotate(10deg)' }}
            />

            <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="relative z-10 w-full px-8 text-center"
            >
                {/* Pyramid-style text layout with individual animations */}
                <div className="flex flex-col items-center justify-center space-y-2 md:space-y-3 mb-8">
                    {/* Line 1: "A strong" */}
                    <div className="text-4xl md:text-6xl lg:text-8xl text-gray-500">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            A{' '}
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            strong
                        </motion.span>
                    </div>
                    
                    {/* Line 2: "brain creates" */}
                    <div className="flex items-center justify-center gap-3 md:gap-4 text-4xl md:text-6xl lg:text-8xl">
                        <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                            className="text-[#16DB65] italic font-serif font-bold underline "
                        >
                            brain
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="text-gray-500"
                        >
                            creates
                        </motion.span>
                    </div>
                    
                    {/* Line 3: "a strong thought" */}
                    <div className="flex items-center justify-center gap-3 md:gap-4 text-4xl md:text-6xl lg:text-8xl ">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className=" text-gray-500"
                        >
                            a{' '}
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                            className="text-gray-500 "
                        >
                            strong{' '}
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7, delay: 0.8 }}
                            className="text-[#16DB65] italic font-serif font-bold  underline"
                        >
                            thought
                        </motion.span>
                    </div>
                </div>

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 1.0 }}
                    className="flex justify-center mt-10 md:mt-14"
                >
                    <JoinButton />
                </motion.div>
            </motion.div>
        </header>
    );
}