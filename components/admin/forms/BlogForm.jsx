'use client';

import { useState } from 'react';
import { Upload, Sparkles, Loader2, Check, RefreshCw, BookOpen, AlertCircle, FileText } from 'lucide-react';

function slugify(text) {
  return (text || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export default function BlogForm({
  item,
  setItem,
  onSubmit,
  onClose,
  onUploadFile
}) {
  const [translatingTitle, setTranslatingTitle] = useState(false);
  const [translatingSummary, setTranslatingSummary] = useState(false);
  const [translatingContent, setTranslatingContent] = useState(false);

  const [titleSuccess, setTitleSuccess] = useState(false);
  const [summarySuccess, setSummarySuccess] = useState(false);
  const [contentSuccess, setContentSuccess] = useState(false);

  const CATEGORY_PRESETS = [
    'Backend Architecture',
    'Database & MySQL',
    'Security & Auth',
    'Frontend & Next.js',
    'Cloud & DevOps',
    'Software Engineering'
  ];

  // Helper AI translation
  const translateField = async (sourceText, setSourceLoading, setSourceSuccess, targetFieldName) => {
    if (!sourceText || !sourceText.trim()) {
      alert('Isi teks bahasa Indonesia terlebih dahulu untuk diterjemahkan.');
      return;
    }

    setSourceLoading(true);
    setSourceSuccess(false);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'translate',
          text: sourceText,
          targetLang: 'en'
        })
      });

      const data = await res.json();
      if (data.success && data.result) {
        setItem(prev => ({ ...prev, [targetFieldName]: data.result }));
        setSourceSuccess(true);
        setTimeout(() => setSourceSuccess(false), 3000);
      } else {
        alert(data.error || 'Gagal menerjemahkan dengan AI');
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi saat memanggil AI');
    } finally {
      setSourceLoading(false);
    }
  };

  const handleAutoSlug = () => {
    if (item.title) {
      setItem(prev => ({ ...prev, slug: slugify(prev.title) }));
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col flex-1 min-h-0">
      {/* Scrollable Form Body with comfortable padding */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 scrollbar-thin scrollbar-thumb-purple-900/40">
        
        {/* 1. BILINGUAL TITLE ROW */}
        <div className="bg-[#120d36] p-4 sm:p-5 rounded-2xl border border-purple-900/40 space-y-3.5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-purple-900/30">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-xs sm:text-sm font-bold text-white font-heading">
                Judul Artikel Blog (Bilingual)
              </span>
            </div>

            <button
              type="button"
              onClick={() => translateField(item.title, setTranslatingTitle, setTitleSuccess, 'title_en')}
              disabled={translatingTitle || !item.title}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90 disabled:opacity-40 transition-all cursor-pointer shadow-sm"
              title="Terjemahkan Judul ke English otomatis menggunakan AI"
            >
              {translatingTitle ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Menerjemahkan...</span>
                </>
              ) : titleSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Terjemahan Siap!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Terjemahkan Judul (AI)</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                <span className="text-purple-400 font-mono mr-1">ID</span>
                Judul Artikel (Bahasa Indonesia) *
              </label>
              <input
                type="text"
                required
                value={item.title || ''}
                onChange={(e) => setItem({ ...item, title: e.target.value })}
                onBlur={() => {
                  if (!item.slug && item.title) {
                    setItem(prev => ({ ...prev, slug: slugify(prev.title) }));
                  }
                }}
                placeholder="Contoh: Strategi Mengamankan Otentikasi JWT..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#0b081e] border border-purple-500/20 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                <span className="text-emerald-400 font-mono mr-1">GB</span>
                Judul Artikel (English - Opsional)
              </label>
              <input
                type="text"
                value={item.title_en || ''}
                onChange={(e) => setItem({ ...item, title_en: e.target.value })}
                placeholder="Contoh: Securing JWT Authentication Strategy..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#0b081e] border border-purple-500/20 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* 2. SLUG, CATEGORY, READ TIME & DATE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Slug */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-gray-300">
                URL Slug *
              </label>
              <button
                type="button"
                onClick={handleAutoSlug}
                className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer font-medium"
              >
                <RefreshCw className="w-2.5 h-2.5" /> Auto Slug
              </button>
            </div>
            <input
              type="text"
              required
              value={item.slug || ''}
              onChange={(e) => setItem({ ...item, slug: slugify(e.target.value) })}
              placeholder="keamanan-jwt-nextjs"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b081e] border border-purple-500/20 text-white text-xs sm:text-sm font-mono focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Kategori Artikel *
            </label>
            <input
              type="text"
              required
              list="category-presets"
              value={item.category || ''}
              onChange={(e) => setItem({ ...item, category: e.target.value })}
              placeholder="Pilih atau ketik kategori..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b081e] border border-purple-500/20 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500"
            />
            <datalist id="category-presets">
              {CATEGORY_PRESETS.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>

          {/* Read Time */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Estimasi Waktu Baca
            </label>
            <input
              type="text"
              value={item.read_time || '5 min read'}
              onChange={(e) => setItem({ ...item, read_time: e.target.value })}
              placeholder="5 min read"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b081e] border border-purple-500/20 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Published Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Tanggal Terbit
            </label>
            <input
              type="text"
              value={item.published_at || ''}
              onChange={(e) => setItem({ ...item, published_at: e.target.value })}
              placeholder="29 Nov 2026"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b081e] border border-purple-500/20 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* 3. IMAGE URL & UPLOAD */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">
            URL Gambar Sampul / Banner
          </label>
          <div className="flex gap-2.5">
            <input
              type="text"
              value={item.image_url || ''}
              onChange={(e) => setItem({ ...item, image_url: e.target.value })}
              placeholder="https://images.unsplash.com/... atau klik tombol Unggah di samping"
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#0b081e] border border-purple-500/20 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500"
            />
            {onUploadFile && (
              <label className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-900/40 hover:bg-purple-900/60 border border-purple-500/30 text-purple-300 text-xs sm:text-sm font-medium cursor-pointer transition-colors shrink-0">
                <Upload className="w-4 h-4" />
                <span>Unggah</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onUploadFile(e, (url) => setItem({ ...item, image_url: url }))}
                />
              </label>
            )}
          </div>
        </div>

        {/* 4. BILINGUAL SUMMARY ROW */}
        <div className="bg-[#120d36] p-4 sm:p-5 rounded-2xl border border-purple-900/40 space-y-3.5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-purple-900/30">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="text-xs sm:text-sm font-bold text-white font-heading">
                Ringkasan Singkat Artikel (Bilingual)
              </span>
            </div>

            <button
              type="button"
              onClick={() => translateField(item.summary, setTranslatingSummary, setSummarySuccess, 'summary_en')}
              disabled={translatingSummary || !item.summary}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90 disabled:opacity-40 transition-all cursor-pointer shadow-sm"
              title="Terjemahkan Ringkasan ke English dengan AI"
            >
              {translatingSummary ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Menerjemahkan...</span>
                </>
              ) : summarySuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Tersalin ke English!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Terjemahkan Ringkasan (AI)</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                <span className="text-purple-400 font-mono mr-1">ID</span> Ringkasan (Bahasa Indonesia) *
              </label>
              <textarea
                required
                rows={3}
                value={item.summary || ''}
                onChange={(e) => setItem({ ...item, summary: e.target.value })}
                placeholder="Tuliskan 1-2 kalimat gambaran umum artikel ini..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#0b081e] border border-purple-500/20 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                <span className="text-emerald-400 font-mono mr-1">GB</span> Ringkasan (English)
              </label>
              <textarea
                rows={3}
                value={item.summary_en || ''}
                onChange={(e) => setItem({ ...item, summary_en: e.target.value })}
                placeholder="Short summary in English for international visitors..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#0b081e] border border-purple-500/20 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500 leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* 5. BILINGUAL FULL CONTENT (MARKDOWN) */}
        <div className="bg-[#120d36] p-4 sm:p-5 rounded-2xl border border-purple-900/40 space-y-3.5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-purple-900/30">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-500" />
                <span className="text-xs sm:text-sm font-bold text-white font-heading">
                  Isi Konten Lengkap (Format Markdown)
                </span>
              </div>
              <span className="text-[11px] text-gray-400 block mt-0.5">
                Gunakan heading (##, ###), bullet list (-), atau blok kode (```javascript)
              </span>
            </div>

            <button
              type="button"
              onClick={() => translateField(item.content, setTranslatingContent, setContentSuccess, 'content_en')}
              disabled={translatingContent || !item.content}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90 disabled:opacity-40 transition-all cursor-pointer shadow-sm"
              title="Terjemahkan Seluruh Konten Artikel ke English dengan AI"
            >
              {translatingContent ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Menerjemahkan Konten...</span>
                </>
              ) : contentSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Konten EN Siap!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Terjemahkan Konten (AI)</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                <span className="text-purple-400 font-mono mr-1">ID</span> Isi Artikel (Bahasa Indonesia) *
              </label>
              <textarea
                required
                rows={11}
                value={item.content || ''}
                onChange={(e) => setItem({ ...item, content: e.target.value })}
                placeholder="Tulis artikel teknis Anda di sini menggunakan format Markdown..."
                className="w-full px-4 py-3 rounded-xl bg-[#0b081e] border border-purple-500/20 text-white text-xs sm:text-sm font-mono focus:outline-none focus:border-purple-500 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                <span className="text-emerald-400 font-mono mr-1">GB</span> Isi Artikel (English)
              </label>
              <textarea
                rows={11}
                value={item.content_en || ''}
                onChange={(e) => setItem({ ...item, content_en: e.target.value })}
                placeholder="Full article content in English..."
                className="w-full px-4 py-3 rounded-xl bg-[#0b081e] border border-purple-500/20 text-white text-xs sm:text-sm font-mono focus:outline-none focus:border-purple-500 leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* 6. TAGS */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">
            Tech Tags (Pisahkan dengan koma)
          </label>
          <input
            type="text"
            value={item.tags || ''}
            onChange={(e) => setItem({ ...item, tags: e.target.value })}
            placeholder="Next.js, JWT, AES-256, Web Security, Node.js"
            className="w-full px-4 py-2.5 rounded-xl bg-[#0b081e] border border-purple-500/20 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* 7. CHECKBOXES (Featured & Published) */}
        <div className="flex flex-wrap items-center gap-6 pt-1">
          <label className="flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm text-gray-300 select-none">
            <input
              type="checkbox"
              checked={!!item.is_featured}
              onChange={(e) => setItem({ ...item, is_featured: e.target.checked ? 1 : 0 })}
              className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-[#0b081e] border-purple-500/30"
            />
            <span className="font-semibold text-amber-300">Jadikan Featured Article (★)</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm text-gray-300 select-none">
            <input
              type="checkbox"
              checked={item.is_published !== 0}
              onChange={(e) => setItem({ ...item, is_published: e.target.checked ? 1 : 0 })}
              className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-[#0b081e] border-purple-500/30"
            />
            <span>Publikasikan Sekarang (Bisa Dilihat Pengunjung)</span>
          </label>
        </div>
      </div>

      {/* Sticky Bottom Modal Footer */}
      <div className="flex items-center justify-end gap-3 px-5 sm:px-7 py-3.5 border-t border-purple-900/40 bg-[#110c30] shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
        >
          Batal
        </button>
        <button
          type="submit"
          className="px-6 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg shadow-purple-900/40 hover:opacity-95 transition-all cursor-pointer"
        >
          Simpan Artikel
        </button>
      </div>
    </form>
  );
}
