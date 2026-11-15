'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const { theme, toggleTheme, mounted } = useTheme();

  // Handle scroll blur & active section spy
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Section scroll spy
      const sections = ['about', 'skills', 'experience', 'education', 'projects', 'certifications', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Tentang', id: 'about', href: '#about' },
    { name: 'Skills', id: 'skills', href: '#skills' },
    { name: 'Pengalaman', id: 'experience', href: '#experience' },
    { name: 'Pendidikan', id: 'education', href: '#education' },
    { name: 'Proyek', id: 'projects', href: '#projects' },
    { name: 'Sertifikasi', id: 'certifications', href: '#certifications' },
    { name: 'Kontak', id: 'contact', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#030014]/85 dark:bg-[#030014]/85 bg-white/85 backdrop-blur-xl border-b border-white/10 dark:border-white/10 border-gray-200/80 shadow-lg shadow-purple-950/10 py-3'
          : 'bg-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-1.5 shrink-0">
            <span className="text-[#a78bfa] font-mono text-base sm:text-lg font-bold group-hover:text-purple-300 transition-colors">
              &lt;
            </span>
            <span className="font-heading font-bold text-base sm:text-lg lg:text-xl text-white dark:text-white text-gray-900 tracking-wide group-hover:text-[#e879f9] transition-colors">
              Iqbal Musyaffa
            </span>
            <span className="text-[#8245ec] font-mono text-base sm:text-lg font-bold group-hover:text-purple-400 transition-colors">
              /&gt;
            </span>
          </Link>

          {/* Desktop Navigation Links & Theme Toggle */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-1.5 lg:px-3.5 lg:py-2 text-xs lg:text-sm font-medium rounded-xl transition-all duration-200 relative ${
                    isActive
                      ? 'text-white dark:text-white text-purple-700 bg-purple-900/30 dark:bg-purple-900/40 bg-purple-100 font-semibold shadow-sm'
                      : 'text-gray-300 dark:text-gray-300 text-gray-700 hover:text-white dark:hover:text-white hover:text-purple-700 hover:bg-white/5 dark:hover:bg-white/5 hover:bg-gray-100'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#a78bfa] rounded-full animate-fadeIn" />
                  )}
                </a>
              );
            })}

            {/* Dark / Light Mode Switcher */}
            <div className="ml-2 pl-2 border-l border-white/10 dark:border-white/10 border-gray-300">
              <button
                onClick={toggleTheme}
                aria-label="Ganti Mode Tema"
                title={theme === 'dark' ? 'Ganti ke Light Mode' : 'Ganti ke Dark Mode'}
                className="p-2 rounded-xl text-gray-300 dark:text-gray-300 text-gray-700 hover:text-white dark:hover:text-white hover:text-purple-700 bg-white/5 dark:bg-white/5 bg-gray-100 hover:bg-purple-900/30 dark:hover:bg-purple-900/40 hover:bg-purple-100 border border-white/10 dark:border-white/10 border-gray-200 transition-all hover:scale-110 active:scale-95"
              >
                {mounted && theme === 'light' ? (
                  <Moon className="w-4 h-4 text-purple-700 animate-fadeIn" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-300 animate-fadeIn" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Right Bar: Theme Toggle + Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              aria-label="Ganti Mode Tema"
              className="p-2 rounded-xl text-gray-300 dark:text-gray-300 text-gray-700 bg-white/5 dark:bg-white/5 bg-gray-100 border border-white/10 dark:border-white/10 border-gray-200"
            >
              {mounted && theme === 'light' ? (
                <Moon className="w-4 h-4 text-purple-700" />
              ) : (
                <Sun className="w-4 h-4 text-amber-300" />
              )}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-gray-300 dark:text-gray-300 text-gray-700 hover:text-white dark:hover:text-white hover:bg-white/10 dark:hover:bg-white/10 hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {isOpen && (
        <div className="md:hidden bg-[#050414]/95 dark:bg-[#050414]/95 bg-white/95 backdrop-blur-2xl border-b border-white/10 dark:border-white/10 border-gray-200 px-4 pt-3 pb-6 space-y-1.5 animate-fadeIn shadow-2xl">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3.5 py-2.5 text-sm font-medium rounded-xl transition-all ${
                  isActive
                    ? 'text-white dark:text-white text-purple-700 bg-purple-900/30 dark:bg-purple-900/40 bg-purple-100 font-semibold'
                    : 'text-gray-300 dark:text-gray-300 text-gray-700 hover:text-white dark:hover:text-white hover:text-purple-700 hover:bg-white/5 dark:hover:bg-white/5 hover:bg-gray-100'
                }`}
              >
                {link.name}
              </a>
            );
          })}
        </div>
      )}
    </nav>
  );
}
