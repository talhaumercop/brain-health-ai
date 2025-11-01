import React from 'react';
import Link from 'next/link';


export default function Footer(){
return (
<footer id="contact" className="bg-black/60 border-t border-[#16DB65]/8 py-8 mt-12">
<div className="container mx-auto max-w-6xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#04471C] to-[#058C42] flex items-center justify-center">
<span className="text-black font-bold">GT</span>
</div>
<div>
<div className="text-white font-semibold">GreenTech</div>
<div className="text-xs text-gray-400">Modern components · Motion · Accessibility</div>
</div>
</div>


<div className="flex items-center gap-4">
<Link href="#" aria-label="Twitter" className="text-gray-300 hover:text-[#16DB65]">Twitter</Link>
<Link href="#" aria-label="Github" className="text-gray-300 hover:text-[#16DB65]">GitHub</Link>
<Link href="#" aria-label="Dribbble" className="text-gray-300 hover:text-[#16DB65]">Dribbble</Link>
</div>
</div>
</footer>
);
}