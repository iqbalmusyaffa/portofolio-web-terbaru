'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Check,
  BookOpen,
  Tag,
  Bookmark,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
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

export default function BlogPostView({ blog, relatedBlogs = [] }) {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);

  const title = (language === 'en' && blog.title_en) ? blog.title_en : blog.title;
  const summary = (language === 'en' && blog.summary_en) ? blog.summary_en : blog.summary;
  const content = (language === 'en' && blog.content_en) ? blog.content_en : blog.content;
  const tags = cleanTagsList(blog.tags);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Render formatted markdown content
  const renderFormattedContent = (rawText) => {
    if (!rawText) return null;

    const sections = rawText.split('\n\n');

    return sections.map((sec, idx) => {
      const trimmed = sec.trim();

      // Heading 3
      if (trimmed.startsWith('### ')) {
        return (
          <h3
            key={idx}
            className="text-xl sm:text-2xl font-bold font-heading text-gray-900 dark:text-white mt-10 mb-4 tracking-tight"
          >
            {trimmed.replace('### ', '')}
          </h3>
        );
      }

      // Heading 2
      if (trimmed.startsWith('## ')) {
        return (
          <h2
            key={idx}
            className="text-2xl sm:text-3xl font-bold font-heading text-gray-900 dark:text-white mt-12 mb-5 pb-3 border-b border-gray-200 dark:border-purple-900/40"
          >
            {trimmed.replace('## ', '')}
          </h2>
        );
      }

      // Code block
      if (trimmed.startsWith('```')) {
        const lines = trimmed.split('\n');
        const lang = lines[0].replace('```', '') || 'code';
        const code = lines.slice(1, -1).join('\n');
        return (
          <div
            key={idx}
            className="my-7 rounded-2xl overflow-hidden border border-purple-500/30 bg-[#070417] shadow-2xl"
          >
            <div className="flex items-center justify-between px-5 py-2.5 bg-purple-950/50 border-b border-purple-900/40 text-xs text-purple-300 font-mono">
              <span className="font-semibold">{lang}</span>
              <span className="text-[10px] uppercase tracking-wider text-purple-400/80">Code Snippet</span>
            </div>
            <pre className="p-5 text-xs sm:text-sm font-mono text-purple-100 overflow-x-auto leading-relaxed">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      // Bullet lists
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const items = trimmed
          .split('\n')
          .filter((l) => l.trim().startsWith('- ') || l.trim().startsWith('* '));
        return (
          <ul key={idx} className="my-5 space-y-2.5 pl-2 list-none">
            {items.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed"
              >
                <span className="w-2 h-2 rounded-full bg-purple-500 mt-2.5 shrink-0 shadow-sm shadow-purple-500" />
                <span>{item.replace(/^[-*]\s+/, '')}</span>
              </li>
            ))}
          </ul>
        );
      }

      // Regular paragraph
      return (
        <p
          key={idx}
          className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed my-5"
        >
          {trimmed}
        </p>
      );
    });
  };

  return (
    <article className="min-h-screen pt-28 pb-24 px-4 sm:px-6 relative z-10 max-w-4xl mx-auto">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/#blog"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>{language === 'en' ? 'Back to All Articles' : 'Kembali ke Semua Artikel'}</span>
        </Link>

        {/* Share Button */}
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 transition-colors cursor-pointer"
          title="Salin tautan artikel ini"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-purple-400" />}
          <span>{copied ? (language === 'en' ? 'Link Copied!' : 'Tautan Tersalin!') : (language === 'en' ? 'Share' : 'Bagikan')}</span>
        </button>
      </div>

      {/* Category & Metadata Header */}
      <div className="space-y-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950/90 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-500/40 shadow-sm">
            {blog.category || 'Engineering'}
          </span>
          {blog.is_featured ? (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/90 text-black shadow-md flex items-center gap-1">
              ★ Featured Article
            </span>
          ) : null}
          <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 ml-auto">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-purple-500" />
              {blog.read_time || '5 min read'}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-purple-500" />
              {blog.published_at || 'Terbaru'}
            </span>
          </div>
        </div>

        {/* Article Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-gray-900 dark:text-white leading-tight tracking-tight">
          {title}
        </h1>

        {/* Article Summary Lead */}
        {summary && (
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed italic border-l-4 border-purple-500 pl-4 py-1">
            {summary}
          </p>
        )}

        {/* Author Bio Card */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-purple-900/30">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-purple-900/40">
            IM
          </div>
          <div>
            <span className="font-bold text-gray-900 dark:text-white text-sm sm:text-base block">
              Iqbal Musyaffa
            </span>
            <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
              Software Engineer & Fullstack Developer
            </span>
          </div>
        </div>
      </div>

      {/* Featured Banner Image */}
      <div className="relative w-full h-64 sm:h-[440px] rounded-3xl overflow-hidden my-8 shadow-2xl border border-gray-200 dark:border-purple-500/20 bg-gray-900">
        <img
          src={formatImageUrl(blog.image_url)}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80';
          }}
        />
      </div>

      {/* Formatted Article Body */}
      <div className="prose dark:prose-invert max-w-none py-6 border-b border-gray-200 dark:border-purple-900/30">
        {renderFormattedContent(content)}
      </div>

      {/* Tech Tags */}
      {tags.length > 0 && (
        <div className="py-6 flex flex-wrap items-center gap-2 border-b border-gray-200 dark:border-purple-900/30">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 mr-2 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" /> Tags:
          </span>
          {tags.map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-xl text-xs font-medium bg-gray-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-gray-200 dark:border-purple-800/30"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Author Footer Profile Box */}
      <div className="my-10 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c0824] border border-gray-200 dark:border-purple-500/30 shadow-xl flex flex-col sm:flex-row items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-violet-700 flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-lg shadow-purple-900/50">
          IM
        </div>
        <div className="text-center sm:text-left flex-1">
          <h4 className="text-lg font-bold font-heading text-gray-900 dark:text-white">
            Ditulis oleh Iqbal Musyaffa
          </h4>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
            Software Engineer lulusan S1 Sistem Informasi Universitas Telkom Surabaya. Berfokus pada perancangan arsitektur backend, Next.js modern, optimasi database MySQL, dan penerapan clean code.
          </p>
        </div>
        <Link
          href="/#contact"
          className="px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 shadow-md shadow-purple-900/40 transition-all shrink-0 cursor-pointer"
        >
          Hubungi Penulis
        </Link>
      </div>

      {/* Related Articles Section */}
      {relatedBlogs && relatedBlogs.length > 0 && (
        <div className="mt-14 pt-10 border-t border-gray-200 dark:border-purple-900/30">
          <h3 className="text-xl sm:text-2xl font-bold font-heading text-gray-900 dark:text-white mb-6">
            {language === 'en' ? 'Related Articles' : 'Artikel Terkait Lainnya'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {relatedBlogs.slice(0, 2).map((rel) => {
              const relTitle = (language === 'en' && rel.title_en) ? rel.title_en : rel.title;
              const relSummary = (language === 'en' && rel.summary_en) ? rel.summary_en : rel.summary;
              return (
                <Link
                  key={rel.id || rel.slug}
                  href={`/blog/${rel.slug}`}
                  className="group p-5 rounded-2xl bg-white dark:bg-[#0c0824] border border-gray-200 dark:border-purple-500/20 hover:border-purple-500/50 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 block mb-1">
                      {rel.category}
                    </span>
                    <h4 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors line-clamp-2">
                      {relTitle}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                      {relSummary}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-purple-900/20 flex items-center justify-between text-xs text-purple-600 dark:text-purple-400 font-semibold">
                    <span>Baca Artikel</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </article>
  );
}
