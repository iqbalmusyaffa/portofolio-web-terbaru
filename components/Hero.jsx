'use client';

import { useState, useEffect } from 'react';
import { Download, Github, Linkedin, Instagram, Facebook, ArrowRight, Sparkles } from 'lucide-react';

export default function Hero({ profile }) {
  const defaultRoles = ["Software Engineer", "Fullstack Developer", "Problem Solver"];
  
  let roles = defaultRoles;
  if (profile?.roles) {
    try {
      roles = typeof profile.roles === 'string' ? JSON.parse(profile.roles) : profile.roles;
    } catch (e) {
      roles = defaultRoles;
    }
  }

  // Robust, smooth typewriter state machine
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [currentText, setCurrentText] = useState('Software Engineer');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = roles[currentWordIdx] || 'Software Engineer';
    let timer;

    if (!isDeleting) {
      if (currentText.length < word.length) {
        timer = setTimeout(() => {
          setCurrentText(word.slice(0, currentText.length + 1));
        }, 85);
      } else {
        // Word completed, wait 2 seconds before erasing
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
    } else {
      if (currentText.length > 0) {
        timer = setTimeout(() => {
          setCurrentText(word.slice(0, currentText.length - 1));
        }, 40);
      } else {
        // Word erased, move to next
        setIsDeleting(false);
        setCurrentWordIdx((prev) => (prev + 1) % roles.length);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIdx, roles]);

  const name = profile?.name || "Iqbal Musyaffa";
  const bio = profile?.bio || "Lulusan Universitas Telkom Surabaya yang senang menerjemahkan ide menjadi antarmuka web yang bersih dan efisien. Berpengalaman membangun aplikasi dengan ekosistem Laravel & React. Fokus utama saya bukan sekadar menulis kode, tapi memberikan dampak nyata bagi pengguna dan tim.";
  const cvUrl = profile?.cv_url || "https://drive.google.com/drive/folders/1Pot8GeUM6s_4J7n_8VlcULaMaycx1sD4?usp=sharing";
  const avatarUrl = profile?.avatar_url || "/foto2.jpg";

  return (
    <section id="hero" className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 px-4 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-purple-600/20 via-fuchsia-600/15 to-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-72 h-72 bg-purple-900/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-900/10 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
        {/* Profile Avatar with glowing neon ring */}
        <div className="relative mb-6 group">
          <div className="absolute -inset-2 bg-gradient-to-r from-[#8245ec] via-[#e879f9] to-[#38bdf8] rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse-glow" />
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-full overflow-hidden border-2 border-purple-400/60 bg-[#0c0822] shadow-2xl flex items-center justify-center">
            <img
              src={avatarUrl}
              alt={name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/foto2.jpg";
              }}
            />
          </div>
          {/* Status badge */}
          <div className="absolute bottom-2 right-2 bg-white dark:bg-[#050414] border border-purple-500/40 rounded-full px-2.5 py-1 flex items-center gap-1.5 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-semibold text-gray-800 dark:text-gray-200">Available</span>
          </div>
        </div>

        {/* Greeting Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-950/50 border border-purple-300 dark:border-purple-500/40 text-purple-700 dark:text-purple-200 text-xs sm:text-sm font-semibold mb-4 backdrop-blur-md shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#8245ec] dark:text-[#e879f9]" />
          <span>Halo, Saya</span>
        </div>

        {/* Name */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-heading tracking-tight mb-3">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] via-[#c026d3] to-[#0284c7] dark:from-[#a78bfa] dark:via-[#e879f9] dark:to-[#38bdf8] animate-gradient-x">
            {name}
          </span>
        </h1>

        {/* Roles with Typewriter Effect */}
        <div className="min-h-[40px] flex items-center justify-center text-xl sm:text-2xl md:text-3xl font-semibold mb-5 font-heading text-gray-800 dark:text-gray-200">
          <span className="text-gray-500 dark:text-gray-400 mr-2">I am a</span>
          <span className="text-purple-600 dark:text-[#a78bfa] font-bold">
            {currentText}
          </span>
          <span className="text-[#8245ec] dark:text-[#e879f9] animate-pulse ml-0.5">|</span>
        </div>

        {/* Bio */}
        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8 px-4 text-center">
          {bio}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10 w-full sm:w-auto">
          <a
            href={cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-[#8245ec] via-[#9333ea] to-[#a855f7] hover:from-[#7335de] hover:to-[#9333ea] shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <span>Lihat CV</span>
            <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </a>

          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 border border-gray-300 dark:border-white/10 hover:border-purple-400/50 hover:scale-105 active:scale-95 transition-all duration-200 backdrop-blur-md"
          >
            <span>Hubungi Saya</span>
            <ArrowRight className="w-4 h-4 text-[#8245ec] dark:text-[#a78bfa]" />
          </a>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
          {profile?.github_url && (
            <a
              href={profile.github_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="p-3 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-purple-100 dark:hover:bg-purple-900/30 border border-gray-200 dark:border-white/10 hover:border-purple-500/50 hover:text-purple-700 dark:hover:text-white hover:scale-110 transition-all duration-200"
            >
              <Github className="w-5 h-5" />
            </a>
          )}
          {profile?.linkedin_url && (
            <a
              href={profile.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="p-3 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-purple-100 dark:hover:bg-purple-900/30 border border-gray-200 dark:border-white/10 hover:border-purple-500/50 hover:text-purple-700 dark:hover:text-white hover:scale-110 transition-all duration-200"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          )}
          {profile?.instagram_url && (
            <a
              href={profile.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="p-3 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-purple-100 dark:hover:bg-purple-900/30 border border-gray-200 dark:border-white/10 hover:border-purple-500/50 hover:text-purple-700 dark:hover:text-white hover:scale-110 transition-all duration-200"
            >
              <Instagram className="w-5 h-5" />
            </a>
          )}
          {profile?.facebook_url && (
            <a
              href={profile.facebook_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="p-3 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-purple-100 dark:hover:bg-purple-900/30 border border-gray-200 dark:border-white/10 hover:border-purple-500/50 hover:text-purple-700 dark:hover:text-white hover:scale-110 transition-all duration-200"
            >
              <Facebook className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
