'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Check,
  BookOpen,
  Tag,
  Copy,
  Heart,
  Sparkles,
  List,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Linkedin,
  Twitter,
  Send
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

function slugifyHeading(text) {
  return (text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

export default function BlogPostView({ blog, relatedBlogs = [] }) {
  const { language } = useLanguage();

  // 1. Reading Progress Bar State
  const [scrollProgress, setScrollProgress] = useState(0);

  // 2. Claps / Like System State
  const [claps, setClaps] = useState(blog?.claps || 0);
  const [clappingAnim, setClappingAnim] = useState(false);
  const [clappedTimes, setClappedTimes] = useState(0);

  // 3. Copy States
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState(null);

  // 4. TOC Collapse State
  const [tocOpen, setTocOpen] = useState(true);

  // Dynamic Texts
  const title = (language === 'en' && blog.title_en) ? blog.title_en : blog.title;
  const summary = (language === 'en' && blog.summary_en) ? blog.summary_en : blog.summary;
  const content = (language === 'en' && blog.content_en) ? blog.content_en : blog.content;
  const tags = cleanTagsList(blog.tags);

  // 1. Scroll listener for reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Extract Table of Contents (TOC) from content
  const tableOfContents = useMemo(() => {
    if (!content) return [];
    const headings = [];
    const lines = content.split('\n');

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('## ') || trimmed.startsWith('### ')) {
        const level = trimmed.startsWith('### ') ? 3 : 2;
        const text = trimmed.replace(/^#{2,3}\s+/, '').trim();
        const id = slugifyHeading(text);
        if (text && id) {
          headings.push({ id, text, level });
        }
      }
    });

    return headings;
  }, [content]);

  // 3. Handle Claps Click
  const handleClap = async () => {
    setClaps((prev) => prev + 1);
    setClappedTimes((prev) => prev + 1);
    setClappingAnim(true);
    setTimeout(() => setClappingAnim(false), 700);

    try {
      await fetch('/api/blogs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: blog.slug })
      });
    } catch (err) {
      console.warn('Gagal mencatat apresiasi:', err);
    }
  };

  // 4. Copy Code Block Snippet
  const handleCopyCode = (codeText, id) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(codeText);
      setCopiedCodeId(id);
      setTimeout(() => setCopiedCodeId(null), 2000);
    }
  };

  // 5. Copy Link & Social Share Handlers
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const shareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareTwitter = () => {
    const text = `${title} oleh Iqbal Musyaffa`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareWhatsApp = () => {
    const text = `Baca artikel ini: "${title}" ${currentUrl}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Render formatted markdown content with IDs for smooth TOC scrolling
  const renderFormattedContent = (rawText) => {
    if (!rawText) return null;
    const sections = rawText.split('\n\n');

    return sections.map((sec, idx) => {
      const trimmed = sec.trim();

      // Heading 3
      if (trimmed.startsWith('### ')) {
        const text = trimmed.replace('### ', '');
        const id = slugifyHeading(text);
        return (
          <h3
            key={idx}
            id={id}
            className="text-xl sm:text-2xl font-bold font-heading text-gray-900 dark:text-white mt-10 mb-4 tracking-tight scroll-mt-28"
          >
            {text}
          </h3>
        );
      }

      // Heading 2
      if (trimmed.startsWith('## ')) {
        const text = trimmed.replace('## ', '');
        const id = slugifyHeading(text);
        return (
          <h2
            key={idx}
            id={id}
            className="text-2xl sm:text-3xl font-bold font-heading text-gray-900 dark:text-white mt-12 mb-5 pb-3 border-b border-gray-200 dark:border-purple-900/40 tracking-tight scroll-mt-28"
          >
            {text}
          </h2>
        );
      }

      // Code block with Copy button
      if (trimmed.startsWith('```')) {
        const lines = trimmed.split('\n');
        const lang = lines[0].replace('```', '') || 'code';
        const code = lines.slice(1, -1).join('\n');
        const snippetId = `code-${idx}`;

        return (
          <div
            key={idx}
            className="my-7 rounded-2xl overflow-hidden border border-purple-500/30 bg-[#070417] shadow-2xl group/code"
          >
            <div className="flex items-center justify-between px-5 py-2.5 bg-purple-950/50 border-b border-purple-900/40 text-xs font-mono">
              <span className="font-semibold text-purple-300">{lang}</span>
              <button
                type="button"
                onClick={() => handleCopyCode(code, snippetId)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-sans font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-purple-500/30 transition-all cursor-pointer"
                title="Salin potongan kode ini"
              >
                {copiedCodeId === snippetId ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-purple-400" />
                    <span>Salin Kode</span>
                  </>
                )}
              </button>
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
    <>
      {/* 1. TOP READING PROGRESS BAR */}
      <div
        className="fixed top-0 left-0 h-[3.5px] bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-500 z-[9999] transition-all duration-75 shadow-lg shadow-purple-500/50"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={scrollProgress}
        aria-valuemin={0}
        aria-valuemax={100}
      />

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

          {/* Share Action Pill */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={shareLinkedIn}
              className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 hover:text-blue-400 border border-gray-200 dark:border-white/10 transition-all cursor-pointer"
              title="Bagikan ke LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </button>
            <button
              onClick={shareWhatsApp}
              className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-emerald-900/30 text-gray-700 dark:text-gray-300 hover:text-emerald-400 border border-gray-200 dark:border-white/10 transition-all cursor-pointer"
              title="Bagikan ke WhatsApp"
            >
              <Send className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 transition-colors cursor-pointer"
              title="Salin tautan artikel ini"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-purple-400" />}
              <span>{copiedLink ? (language === 'en' ? 'Copied!' : 'Tersalin!') : (language === 'en' ? 'Share' : 'Bagikan')}</span>
            </button>
          </div>
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

          {/* Author Bio Row with Interactive Claps Button */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-purple-900/30">
            <div className="flex items-center gap-3">
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

            {/* Quick Header Clap Button */}
            <button
              onClick={handleClap}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all cursor-pointer ${
                clappingAnim
                  ? 'scale-110 bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-900/50'
                  : 'bg-white dark:bg-[#0c0824] hover:bg-purple-50 dark:hover:bg-purple-950/40 border-purple-300 dark:border-purple-500/30 text-gray-800 dark:text-purple-200'
              }`}
              title="Beri apresiasi untuk artikel ini"
            >
              <span className="text-base">👏</span>
              <span className="text-xs sm:text-sm font-bold font-mono">{claps}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">Claps</span>
            </button>
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

        {/* 2. TABLE OF CONTENTS (Daftar Isi Otomatis) */}
        {tableOfContents.length > 0 && (
          <div className="my-8 rounded-3xl p-5 sm:p-6 bg-white dark:bg-[#0b081e] border border-gray-200 dark:border-purple-500/30 shadow-lg">
            <button
              type="button"
              onClick={() => setTocOpen(!tocOpen)}
              className="w-full flex items-center justify-between text-left font-bold text-gray-900 dark:text-white text-base sm:text-lg font-heading cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <List className="w-5 h-5 text-purple-500" />
                <span>{language === 'en' ? 'Table of Contents' : 'Daftar Isi Artikel'}</span>
              </div>
              {tocOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>

            {tocOpen && (
              <nav className="mt-4 pt-4 border-t border-gray-100 dark:border-purple-900/30 space-y-2">
                {tableOfContents.map((h, i) => (
                  <a
                    key={i}
                    href={`#${h.id}`}
                    className={`block text-xs sm:text-sm text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-300 transition-colors py-1 ${
                      h.level === 3 ? 'pl-6 text-gray-500 dark:text-gray-400 text-xs' : 'font-medium'
                    }`}
                  >
                    • {h.text}
                  </a>
                ))}
              </nav>
            )}
          </div>
        )}

        {/* Formatted Article Body */}
        <div className="prose dark:prose-invert max-w-none py-6 border-b border-gray-200 dark:border-purple-900/30">
          {renderFormattedContent(content)}
        </div>

        {/* 3. INTERACTIVE CLAP & REACTION BAR */}
        <div className="py-8 my-6 flex flex-col sm:flex-row items-center justify-between gap-5 bg-purple-50 dark:bg-[#0c0824]/90 p-6 rounded-3xl border border-purple-200 dark:border-purple-500/30 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={handleClap}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all cursor-pointer shadow-lg ${
                  clappingAnim
                    ? 'scale-125 bg-purple-600 text-white shadow-purple-500/50'
                    : 'bg-white dark:bg-[#140f33] hover:scale-105 border border-purple-300 dark:border-purple-500/40'
                }`}
                aria-label="Tepuk tangan"
              >
                👏
              </button>
              {clappingAnim && (
                <span className="absolute -top-3 right-0 text-xs font-bold text-purple-400 animate-bounce">
                  +1
                </span>
              )}
            </div>

            <div>
              <div className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>{claps} Apresiasi</span>
                {clappedTimes > 0 && (
                  <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                    (Anda memberi +{clappedTimes})
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Sukai artikel ini? Klik tepuk tangan untuk memberi dukungan!
              </p>
            </div>
          </div>

          {/* Social Share Group */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 mr-1 hidden sm:inline">
              Bagikan:
            </span>
            <button
              onClick={shareLinkedIn}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#140f33] hover:bg-[#0077b5] text-gray-700 dark:text-gray-300 hover:text-white border border-gray-200 dark:border-purple-500/30 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </button>
            <button
              onClick={shareWhatsApp}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#140f33] hover:bg-[#25D366] text-gray-700 dark:text-gray-300 hover:text-white border border-gray-200 dark:border-purple-500/30 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={shareTwitter}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#140f33] hover:bg-black text-gray-700 dark:text-gray-300 hover:text-white border border-gray-200 dark:border-purple-500/30 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <Twitter className="w-3.5 h-3.5" />
              <span>X</span>
            </button>
          </div>
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

        {/* 6. CALL TO ACTION (CTA) COLLABORATION BOX */}
        <div className="my-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-purple-900/40 via-indigo-950/40 to-[#0c0824] border border-purple-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Terbuka untuk Kolaborasi & Full-time</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
              Tertarik Membahas Arsitektur Web atau Peluang Kerja?
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl leading-relaxed">
              Saya siap berkolaborasi dalam pembangunan aplikasi backend berskala besar, optimasi database MySQL, atau pengembangan sistem Next.js modern.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <Link
              href="/#contact"
              className="w-full sm:w-auto text-center px-6 py-3 rounded-2xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 hover:opacity-95 shadow-lg shadow-purple-900/50 transition-all cursor-pointer"
            >
              Kirim Pesan Sekarang
            </Link>
            <a
              href="https://www.linkedin.com/in/iqbalmusyaffa"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto text-center px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold text-gray-200 hover:text-white bg-white/5 hover:bg-white/10 border border-purple-500/30 transition-all cursor-pointer"
            >
              Profil LinkedIn →
            </a>
          </div>
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
    </>
  );
}
