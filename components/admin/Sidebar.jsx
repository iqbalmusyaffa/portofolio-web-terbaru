'use client';

import Link from 'next/link';
import {
  Shield,
  FolderGit2,
  BookOpen,
  Zap,
  Briefcase,
  GraduationCap,
  Award,
  User,
  Globe,
  MessageSquare,
  Eye,
  RotateCcw,
  LogOut,
  X
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  counts = {},
  onSeedReset,
  onLogout
}) {
  const navGroups = [
    {
      group: 'KONTEN UTAMA',
      items: [
        { id: 'projects', label: 'Proyek', icon: FolderGit2, count: counts.projects },
        { id: 'blogs', label: 'Blog & Artikel', icon: BookOpen, count: counts.blogs },
        { id: 'skills', label: 'Skills', icon: Zap, count: counts.skills },
        { id: 'experience', label: 'Pengalaman', icon: Briefcase, count: counts.experiences },
        { id: 'education', label: 'Pendidikan', icon: GraduationCap, count: counts.educations },
        { id: 'certificates', label: 'Sertifikasi', icon: Award, count: counts.certificates },
      ],
    },
    {
      group: 'PROFIL & TAMPILAN',
      items: [
        { id: 'profile', label: 'Biodata & About Me', icon: User },
        { id: 'seo', label: 'Pengaturan SEO', icon: Globe },
      ],
    },
    {
      group: 'ADMIN & SISTEM',
      items: [
        {
          id: 'messages',
          label: 'Pesan Masuk',
          icon: MessageSquare,
          count: counts.unreadMessages,
          isBadge: true
        },
        { id: 'security', label: 'Keamanan Akun', icon: Shield },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm lg:hidden animate-fadeIn"
        />
      )}

      {/* Modern Left Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 lg:z-30 h-screen w-72 bg-[#070417] border-r border-purple-900/30 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-purple-900/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-violet-700 flex items-center justify-center text-white shadow-lg shadow-purple-900/50 border border-purple-400/30">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-base text-white tracking-wide">
                  Admin Panel
                </h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] text-emerald-400/90 font-medium">MySQL Active</span>
                </div>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
              aria-label="Tutup Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sidebar Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-5 scrollbar-thin scrollbar-thumb-purple-900/30">
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              <p className="px-3 text-[10px] font-bold text-purple-400/70 tracking-wider uppercase mb-1.5">
                {group.group}
              </p>
              <div className="space-y-1">
                {group.items.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all group cursor-pointer ${
                        active
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-md shadow-purple-950 border border-purple-400/30'
                          : 'text-gray-400 hover:text-white hover:bg-purple-950/30'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            active ? 'text-white' : 'text-gray-400 group-hover:text-purple-300'
                          }`}
                        />
                        <span className="truncate">{tab.label}</span>
                      </div>

                      {tab.count !== undefined && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            tab.isBadge && tab.count > 0
                              ? 'bg-rose-500 text-white animate-pulse'
                              : active
                              ? 'bg-white/20 text-white'
                              : 'bg-purple-950/80 text-purple-300 border border-purple-800/40'
                          }`}
                        >
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer Actions */}
        <div className="p-3.5 border-t border-purple-900/30 bg-[#060314]/80 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 transition-all text-center"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Lihat Web</span>
            </Link>

            <button
              onClick={onSeedReset}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-purple-300 bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/40 transition-all cursor-pointer text-center"
              title="Reset dan isi ulang data awal website"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar dari Admin</span>
          </button>
        </div>
      </aside>
    </>
  );
}
