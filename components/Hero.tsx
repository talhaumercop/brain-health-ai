'use client';
import React from 'react';
import AwesomeButton from './AwesomeButton';
import { motion } from 'framer-motion';


export default function Hero(){
return (
<section id="about" className="container mx-auto max-w-6xl py-20 px-6">
<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
<motion.div initial={{opacity:0, x:-20}} whileInView={{opacity:1, x:0}} viewport={{once:true}} transition={{duration:0.7}}>
<h2 className="text-3xl md:text-4xl font-bold text-white">Design-forward components, engineered for scale.</h2>
<p className="mt-4 text-gray-300">We combine motion, performance, and accessibility into a single component system. Works beautifully across devices with a consistent theme that feels premium and alive.</p>


<div className="mt-6 flex items-center gap-4">
<AwesomeButton />
<button className="px-5 py-3 rounded-md border border-[#16DB65]/20 text-sm font-semibold hover:bg-[#16DB65]/8 transition">Get the kit</button>
</div>
</motion.div>


<motion.div initial={{opacity:0, y:12}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.9}} className="flex items-center justify-center">
{/* Placeholder mockup - replace with an SVG/PNG or Lottie */}
<div className="w-full max-w-sm rounded-2xl p-6 bg-gradient-to-b from-[#052414]/60 to-[#00120A]/30 border border-[#16DB65]/6 shadow-2xl">
<div className="h-48 bg-[linear-gradient(135deg,#04471C,rgba(5,140,66,0.2))] rounded-lg flex items-center justify-center text-[#e6fff0] font-bold">Product Mockup</div>
<div className="mt-4 space-y-2">
<div className="h-3 bg-[#052414]/50 rounded w-3/4" />
<div className="h-3 bg-[#052414]/40 rounded w-1/2" />
</div>
</div>
</motion.div>
</div>
</section>
);
}