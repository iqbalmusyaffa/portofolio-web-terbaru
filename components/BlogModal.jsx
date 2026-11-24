'use client';

import { useEffect, useState } from 'react';
import { X, Calendar, Clock, Share2, Check, Bookmark, BookOpen, ArrowLeft } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { cleanTagsList } from '@/lib/tagUtils';

function formatImageUrl(url) {
  if (!url || typeof url !== 'string') {
    return 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1200&q=80';
  }
  return url
    .replace(/&#x2F;/g, '/')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '')
    .trim();
}

export default function BlogModal({ blog, onClose }) {
  const { t, language } = useLanguage();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!blog) return null;

  const title = (language === 'en' && blog.title_en) ? blog.title_en : blog.title;
  const content = (language === 'en' && blog.content_en) ? blog.content_en : blog.content;
  const tags = cleanTagsList(blog.tags);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + '#blog');
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Render markdown paragraphs and code snippets with clean styling
  const renderFormattedContent = (rawText) => {
    if (!rawText) return null;

    const sections = rawText.split('\n\n');

    return sections.map((sec, idx) => {
      const trimmed = sec.trim();

      // Heading 3
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-xl sm:text-2xl font-bold font-heading text-gray-900 dark:text-white mt-8 mb-3">
            {trimmed.replace('### ', '')}
          </h3>
        );
      }

      // Heading 2
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-2xl sm:text-3xl font-bold font-heading text-gray-900 dark:text-white mt-10 mb-4 pb-2 border-b border-gray-200 dark:border-purple-900/30">
            {trimmed.replace('## ', '')}
          </h2>
        );
      }

      // Code Block
      if (trimmed.startsWith('```')) {
        const lines = trimmed.split('\n');
        const lang = lines[0].replace('```', '') || 'code';
        const code = lines.slice(1, -1).join('\n');
        return (
          <div key={idx} className="my-6 rounded-2xl overflow-hidden border border-purple-500/30 bg-[#070417] shadow-xl">
            <div className="flex items-center justify-between px-4 py-2 bg-purple-950/40 border-b border-purple-900/40 text-xs text-purple-300 font-mono">
              <span>{lang}</span>
              <span className="text-[10px] uppercase tracking-wider text-gray-400">Snippet</span>
            </div>
            <pre className="p-4 sm:p-5 text-xs sm:text-sm font-mono text-purple-100 overflow-x-auto leading-relaxed">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      // Bullet List
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const items = trimmed.split('\n').filter(l => l.trim().startsWith('- ') || l.trim().startsWith('* '));
        return (
          <ul key={idx} className="my-4 space-y-2 list-none pl-1">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />
                <span>{item.replace(/^[-*]\s+/, '')}</span>
              </li>
            ))}
          </ul>
        );
      }

      // Regular paragraph
      return (
        <p key={idx} className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed my-4">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-[#0c0824] rounded-3xl border border-gray-200 dark:border-purple-500/30 shadow-2xl overflow-hidden animate-scaleUp"
      >
        {/* Modal Top Header Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white/95 dark:bg-[#0c0824]/95 backdrop-blur-md border-b border-gray-200 dark:border-purple-900/30">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
              {blog.category || 'Engineering'}
            </span>
            <div className="hidden sm:flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {blog.read_time || '5 min read'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {blog.published_at || 'Terbaru'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
              title="Salin tautan artikel"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : t('blog.share')}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              aria-label={t('blog.close')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto px-6 sm:px-10 py-6 space-y-6">
          {/* Article Banner Image */}
          <div className="relative w-full h-56 sm:h-80 rounded-2xl overflow-hidden bg-gray-900 border border-gray-200 dark:border-purple-900/40">
            <img
              src={formatImageUrl(blog.image_url)}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80';
              }}
            />
            {blog.is_featured ? (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/90 text-black shadow-lg">
                ★ {t('blog.featured')}
              </span>
            ) : null}
          </div>

          {/* Title & Author Info */}
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-gray-900 dark:text-white leading-tight">
              {title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-purple-900/30 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                  IM
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white block">Iqbal Musyaffa</span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">Software Engineer</span>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:ml-auto">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-purple-500" />
                  {blog.read_time || '5 min read'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  {blog.published_at || 'November 2026'}
                </span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/30"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Formatted Article Content */}
          <div className="prose dark:prose-invert max-w-none pt-4 pb-8 border-t border-gray-100 dark:border-purple-900/20">
            {renderFormattedContent(content)}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-gray-50 dark:bg-[#070417] border-t border-gray-200 dark:border-purple-900/30 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('blog.close')}</span>
          </button>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {t('blog.written_by')} <span className="text-purple-600 dark:text-purple-400 font-semibold">Iqbal Musyaffa</span>
          </div>
        </div>
      </div>
    </div>
  );
}
