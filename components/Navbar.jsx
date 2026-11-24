'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Sun, Moon, Globe } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useLanguage } from './LanguageProvider';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const { theme, toggleTheme, mounted } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  // Handle scroll blur & active section spy
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Section scroll spy
      const sections = ['about', 'skills', 'experience', 'education', 'projects', 'blog', 'certifications', 'contact'];
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
    { name: t('nav.about'), id: 'about', href: '#about' },
    { name: t('nav.skills'), id: 'skills', href: '#skills' },
    { name: t('nav.experience'), id: 'experience', href: '#experience' },
    { name: t('nav.education'), id: 'education', href: '#education' },
    { name: t('nav.projects'), id: 'projects', href: '#projects' },
    { name: t('nav.blog'), id: 'blog', href: '#blog' },
    { name: t('nav.certifications'), id: 'certifications', href: '#certifications' },
    { name: t('nav.contact'), id: 'contact', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#030014]/90 dark:bg-[#030014]/90 bg-white/90 backdrop-blur-xl border-b border-gray-200 dark:border-purple-900/30 shadow-lg shadow-purple-950/20 py-3'
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
                  className={`px-3 py-1.5 lg:px-3.5 lg:py-2 text-xs lg:text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'text-white bg-gradient-to-r from-purple-600 to-indigo-600 font-semibold shadow-md shadow-purple-950/40 border border-purple-400/30'
                      : 'text-gray-300 dark:text-gray-300 text-gray-700 hover:text-white dark:hover:text-white hover:text-purple-700 hover:bg-white/5 dark:hover:bg-white/5 hover:bg-gray-100'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}

            {/* Dark / Light Mode Switcher */}
            <div className="ml-2 pl-2 border-l border-gray-200 dark:border-purple-900/40 flex items-center gap-1.5">
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

              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                aria-label="Ganti Bahasa / Switch Language"
                title={language === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
                className="px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-white/5 dark:bg-white/5 bg-gray-100 hover:bg-purple-900/30 dark:hover:bg-purple-900/40 text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-white border border-gray-200 dark:border-white/10 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span className="font-mono">{language === 'id' ? 'ID' : 'EN'}</span>
              </button>
            </div>
          </div>

          {/* Mobile Right Bar: Language + Theme Toggle + Menu Button */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={toggleLanguage}
              aria-label="Ganti Bahasa"
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold font-mono text-gray-700 dark:text-gray-300 bg-white/5 dark:bg-white/5 bg-gray-100 border border-gray-200 dark:border-white/10 flex items-center gap-1"
            >
              <Globe className="w-3 h-3 text-purple-500" />
              <span>{language === 'id' ? 'ID' : 'EN'}</span>
            </button>

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
        <div className="md:hidden bg-[#050414]/95 dark:bg-[#050414]/95 bg-white/95 backdrop-blur-2xl border-b border-gray-200 dark:border-purple-900/30 px-4 pt-3 pb-6 space-y-1.5 animate-fadeIn shadow-2xl">
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
