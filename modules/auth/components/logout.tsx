'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/logout', { method: 'POST' });
      if (res.ok) router.push('/login');
      else console.error('Logout failed');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleLogout}
      className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-900 to-green-400 text-white px-4 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300"
    >
      <ArrowRightOnRectangleIcon className="h-5 w-5" />
      Logout
    </motion.button>
  );
}
