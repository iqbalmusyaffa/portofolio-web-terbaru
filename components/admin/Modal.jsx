'use client';

import { useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  maxWidth = 'max-w-lg sm:max-w-xl',
  children
}) {
  // Tutup modal dengan keyboard Escape (ESC)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Kunci scroll halaman belakang saat modal aktif
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-[#0e0a29] ${maxWidth} w-full rounded-2xl sm:rounded-3xl border border-purple-500/40 shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[90vh] text-white overflow-hidden relative transition-all duration-200`}
      >
        {/* Persistent Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-purple-900/40 bg-[#110c30] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-900/60 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-heading text-white">
                {title}
              </h3>
              {subtitle && (
                <p className="text-[11px] text-gray-400">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        {children}
      </div>
    </div>
  );
}
