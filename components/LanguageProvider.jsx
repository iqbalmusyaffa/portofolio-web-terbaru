'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '@/lib/i18n';

const LanguageContext = createContext({
  language: 'id',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key) => key
});

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState('id');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('portfolio_lang');
      if (saved === 'id' || saved === 'en') {
        setLanguageState(saved);
      } else {
        // Detect browser language
        const browserLang = navigator.language?.toLowerCase() || '';
        if (browserLang.startsWith('en')) {
          setLanguageState('en');
        }
      }
    } catch (e) {
      // Ignore localStorage issues
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang) => {
    if (lang === 'id' || lang === 'en') {
      setLanguageState(lang);
      try {
        localStorage.setItem('portfolio_lang', lang);
      } catch (e) {}
    }
  };

  const toggleLanguage = () => {
    const nextLang = language === 'id' ? 'en' : 'id';
    setLanguage(nextLang);
  };

  const t = (key) => {
    const langDict = translations[language] || translations.id;
    return langDict[key] || translations.id[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, mounted }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: 'id',
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: (key) => key,
      mounted: false
    };
  }
  return context;
}
