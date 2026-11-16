'use client';

import { Github, Linkedin, Instagram, Facebook, ArrowUp } from 'lucide-react';

export default function Footer({ profile }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#02000e] py-12 px-4 z-10 transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left branding */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-1 font-heading text-lg font-bold text-gray-900 dark:text-white">
            <span className="text-[#8245ec] dark:text-[#a78bfa]">&lt;</span>
            <span>{profile?.name || 'Iqbal Musyaffa'}</span>
            <span className="text-[#8245ec]">/&gt;</span>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-3">
          {profile?.github_url && (
            <a
              href={profile.github_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="p-2.5 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-gray-600 dark:text-gray-400 hover:text-purple-700 dark:hover:text-white border border-gray-200 dark:border-white/10 transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
          {profile?.linkedin_url && (
            <a
              href={profile.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="p-2.5 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-gray-600 dark:text-gray-400 hover:text-purple-700 dark:hover:text-white border border-gray-200 dark:border-white/10 transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          {profile?.instagram_url && (
            <a
              href={profile.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="p-2.5 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-gray-600 dark:text-gray-400 hover:text-purple-700 dark:hover:text-white border border-gray-200 dark:border-white/10 transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
          )}
          {profile?.facebook_url && (
            <a
              href={profile.facebook_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="p-2.5 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-gray-600 dark:text-gray-400 hover:text-purple-700 dark:hover:text-white border border-gray-200 dark:border-white/10 transition-colors"
            >
              <Facebook className="w-4 h-4" />
            </a>
          )}

          {/* Scroll to Top button */}
          <button
            onClick={scrollToTop}
            aria-label="Kembali ke atas"
            className="p-2.5 rounded-full bg-purple-100 dark:bg-purple-900/40 hover:bg-purple-200 dark:hover:bg-purple-800 text-purple-700 dark:text-purple-200 border border-purple-200 dark:border-purple-500/40 transition-all hover:scale-110 ml-2"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="text-center text-[11px] text-gray-500 mt-8">
        &copy; {new Date().getFullYear()} Iqbal Musyaffa. All rights reserved.
      </div>
    </footer>
  );
}
