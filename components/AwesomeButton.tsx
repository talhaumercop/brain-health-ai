import React from 'react';
import '../app/styles/buttons.css';


export default function AwesomeButton({ onClick, ariaLabel = 'Awesome' }: { onClick?: ()=>void; ariaLabel?: string }){
return (
<div className="awesome-root" role="button" tabIndex={0} aria-label={ariaLabel} onClick={onClick} onKeyDown={(e)=>{ if(e.key === 'Enter') onClick?.(); }}>
<div className="circular" style={{'--size':'96px'} as React.CSSProperties}>
<div className="ring" aria-hidden />
<div className="rotor" aria-hidden>
<svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
<defs>
<path id="circlePath" d="M70 10a60 60 0 1 1 0 120a60 60 0 1 1 0-120z" />
</defs>
<g fill="none" stroke="none" strokeWidth="0">
<text>
<textPath href="#circlePath" startOffset="0%" textLength="380">AWESOME • JOIN • CREATE • INNOVATE • </textPath>
</text>
</g>
</svg>
</div>
<div className="label text-black bg-[rgba(255,255,255,0.06)] px-3 py-2 rounded-full font-semibold">Awesome</div>
</div>
</div>
);
}