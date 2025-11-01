'use client';
import React from 'react';
import Link from 'next/link';
import '../app/styles/buttons.css';
import { useEffect, useState } from "react";


export default function JoinLink({ 
  className = '', 
  // href = `/dashboard/${userId || ''}/home`, 
  ariaLabel = 'GO TO DASHBOARD', 
}: { 
  className?: string; 
  // href?: string;
  ariaLabel?: string; 
}) {

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserId() {
      try {
        const response = await fetch('/api/user');
        const data = await response.json();
        
        if (response.ok && data.id) {
          setUserId(data.id);
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    }

    fetchUserId();
  }, []);
  return (
    <Link
      href={`/dashboard/${userId || ''}/home`}
      aria-label={ariaLabel}
      className={`join-btn join-gradient ${className} text-sm md:text-base text-black relative inline-flex items-center justify-center no-underline`}
    >
      <span className="glow" aria-hidden />
      <span className="char" aria-hidden>✦</span>
      <span className="px-2">Go to Dashboard</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="ml-1 opacity-90" aria-hidden>
        <path d="M5 12h14M13 6l6 6-6 6" stroke="#00110A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </Link>
  );
}