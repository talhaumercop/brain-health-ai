'use client';
import React, { useState } from 'react';

export default function PersonalizationPage() {
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ bio }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage('✨ Your personalization info was saved successfully.');
        setBio('');
      } else {
        setMessage('❌ Failed to update bio. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setMessage('⚠️ Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center px-4">
      <h1 className="text-4xl font-bold text-white mb-10 text-center">
        🧬 Personalize Your AI
      </h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-neutral-950 border-2 border-green-500/50 rounded-2xl p-8 shadow-lg transition hover:border-green-400"
      >
        <label htmlFor="bio" className="block text-white text-lg mb-3 font-medium">
          Tell the AI about yourself
        </label>

        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Example: I’m a frontend developer who loves 3D design and AI tools."
          className="w-full h-40 bg-black text-white border-2 border-green-600 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none placeholder-gray-500"
        />

        <button
          type="submit"
          disabled={loading}
          className={`mt-6 w-full py-3 rounded-xl font-semibold text-lg transition 
          ${loading
              ? 'bg-green-800 text-gray-300 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-500 text-white shadow-[0_0_10px_rgba(0,255,0,0.4)]'}
          `}
        >
          {loading ? 'Saving...' : 'Save Personalization'}
        </button>

        {message && (
          <p className="text-center mt-6 text-green-400 text-sm font-medium">{message}</p>
        )}
      </form>
    </div>
  );
}
