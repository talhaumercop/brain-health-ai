import Link from 'next/link';
import React from 'react';


export default function Navbar(){
return (
<nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[92%] max-w-6xl z-50 glass px-6 py-3 rounded-xl flex items-center justify-between">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#04471C] to-[#058C42] shadow-md">
<span className="text-sm font-extrabold text-black">GT</span>
</div>
<span className="font-semibold text-[#16DB65] tracking-wide">GreenTech</span>
</div>


<ul className="flex items-center gap-6 text-sm md:text-base">
<li><Link href="#home" className="hover:text-[#16DB65] transition">Home</Link></li>
<li><Link href="#about" className="hover:text-[#16DB65] transition">About</Link></li>
<li><Link href="#contact" className="hover:text-[#16DB65] transition">Contact</Link></li>
<li><Link href="#join" className="px-3 py-2 rounded-md bg-[#16DB65] text-black font-semibold hover:brightness-95 transition">Join</Link></li>
</ul>
</nav>
);
}