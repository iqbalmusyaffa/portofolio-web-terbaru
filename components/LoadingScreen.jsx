'use client';

import { useState, useEffect } from 'react';
import { Code2, Sparkles } from 'lucide-react';

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState('Menginisialisasi sistem...');
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // Stage 1: Fast start
    const t1 = setTimeout(() => {
      setProgress(45);
      setStatusText('Menyiapkan proyek & teknologi...');
    }, 250);

    // Stage 2: Mid progress
    const t2 = setTimeout(() => {
      setProgress(85);
      setStatusText('Menghubungkan portofolio...');
    }, 600);

    // Stage 3: Complete
    const t3 = setTimeout(() => {
      setProgress(100);
      setStatusText('Selamat datang!');
    }, 1000);

    // Stage 4: Trigger smooth fade out
    const t4 = setTimeout(() => {
      setFadingOut(true);
    }, 1300);

    // Stage 5: Remove from DOM
    const t5 = setTimeout(() => {
      setLoading(false);
    }, 1900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#030014] select-none transition-all duration-700 ease-in-out ${
        fadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background ambient radial glow */}
      <div className="absolute w-[360px] h-[360px] sm:w-[500px] sm:h-[500px] bg-gradient-to-tr from-[#8245ec]/25 to-[#00f2fe]/20 rounded-full blur-[100px] animate-pulse pointer-events-none" />

      <div className="relative flex flex-col items-center max-w-sm w-full px-6 z-10">
        {/* Animated Outer Ring with Logo */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Outer spinning dashed ring */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-dashed border-purple-500/40 animate-spin" style={{ animationDuration: '8s' }} />

          {/* Inner counter-spinning glowing gradient ring */}
          <div
            className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-t-purple-400 border-r-cyan-400 border-b-transparent border-l-transparent animate-spin"
            style={{ animationDuration: '2s', animationDirection: 'reverse' }}
          />

          {/* Center Icon with Pulse */}
          <div className="absolute w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#1b103e] to-[#0a0624] border border-purple-500/50 flex items-center justify-center shadow-lg shadow-purple-600/30">
            <Code2 className="w-7 h-7 sm:w-8 sm:h-8 text-purple-300 animate-pulse" />
          </div>
        </div>

        {/* Branding Title */}
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-bounce" />
          <h2 className="text-xl sm:text-2xl font-bold font-heading tracking-wide bg-gradient-to-r from-white via-purple-200 to-cyan-300 bg-clip-text text-transparent">
            &lt; Iqbal Musyaffa /&gt;
          </h2>
        </div>

        {/* Dynamic Status Text */}
        <p className="text-xs text-gray-400 font-medium tracking-wide mb-6 h-5 transition-all text-center">
          {statusText}
        </p>

        {/* Progress Bar Container */}
        <div className="w-full bg-[#120a2e] rounded-full h-2 p-0.5 border border-purple-500/30 overflow-hidden shadow-inner shadow-black/60 relative">
          {/* Glowing Fill Bar */}
          <div
            className="h-full bg-gradient-to-r from-[#8245ec] via-[#a855f7] to-[#00f2fe] rounded-full transition-all duration-300 ease-out relative shadow-sm shadow-purple-500"
            style={{ width: `${progress}%` }}
          >
            {/* Shimmer light sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
          </div>
        </div>

        {/* Percentage Counter */}
        <div className="flex justify-between items-center w-full mt-2.5 px-1 text-[11px] font-mono text-gray-400">
          <span>MEMUAT</span>
          <span className="text-purple-300 font-semibold">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
