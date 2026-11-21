'use client';

import Link from 'next/link';
import { Shield, Eye, Menu, X, ChevronRight } from 'lucide-react';

export default function AdminHeader({
  activeTab,
  currentTabLabel,
  sidebarOpen,
  setSidebarOpen,
}) {
  return (
    <>
      {/* Mobile Top Bar (Visible only on mobile/tablet) */}
      <div className="lg:hidden border-b border-purple-900/30 bg-[#070518]/95 backdrop-blur-xl px-4 py-3 sticky top-0 z-40 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-900/40">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-sm text-white leading-tight">Admin Panel</h1>
            <p className="text-[10px] text-purple-300/70">Portfolio Iqbal</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-cyan-400 hover:text-white"
            title="Lihat Web"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300 hover:text-white transition-all cursor-pointer"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Desktop Sticky Header */}
      <div className="hidden lg:flex items-center justify-between px-8 py-4 border-b border-purple-900/20 bg-[#070417]/50 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-2.5 text-xs text-gray-400">
          <span className="text-gray-500 font-medium">Dashboard</span>
          <ChevronRight className="w-3.5 h-3.5 text-purple-400/60" />
          <span className="text-purple-300 font-semibold">
            {currentTabLabel || activeTab}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Database Terhubung
          </span>

          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-200 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>Buka Website</span>
          </Link>
        </div>
      </div>
    </>
  );
}
