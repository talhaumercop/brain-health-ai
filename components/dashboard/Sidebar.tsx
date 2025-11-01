'use client';
import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { ChatBubbleOvalLeftEllipsisIcon, ClockIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import LogoutButton from '@/modules/auth/components/logout';
import { useEffect, useState } from "react";
import { BrainIcon, HomeIcon } from 'lucide-react';
import { IconDeviceVisionProFilled } from '@tabler/icons-react';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();


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


  const navItems = [
    { name: 'Home', icon: HomeIcon, path: `/dashboard/${userId}/home` },
    { name: 'Chat', icon: ChatBubbleOvalLeftEllipsisIcon, path: `/dashboard/${userId}/chat` },
    { name: 'History', icon: ClockIcon, path: `/dashboard/${userId}/history` },
    { name: 'Personalization', icon: Cog6ToothIcon, path: `/dashboard/${userId}/personalization` },
    { name: 'About', icon: IconDeviceVisionProFilled, path: `/dashboard/${userId}/about` },
    { name: 'Brain', icon: BrainIcon, path: `/dashboard/${userId}/brain` },
  ];

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="fixed left-0 top-0 h-screen w-64 bg-[#000000] border-r border-emerald-900 flex flex-col justify-between p-6 shadow-2xl z-50"
    >
      {/* TOP: LOGO + NAV */}
      <div>
        <h1 className="text-3xl font-serif italic text-[#16DB65] mb-10 text-center tracking-wide">
          Synapse
        </h1>

        <nav className="flex flex-col gap-4">
          {navItems.map((item) => (
            <motion.button
              key={item.name}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(item.path)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${pathname === item.path
                  ? 'bg-emerald-900/30 text-[#16DB65]'
                  : 'text-white hover:bg-emerald-950/40 hover:text-[#16DB65]'
                }`}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-lg font-medium">{item.name}</span>
            </motion.button>
          ))}
        </nav>
      </div>

      {/* BOTTOM: LOGOUT */}
      <div className="mt-10">
        <LogoutButton />
      </div>
    </motion.aside>
  );
}
