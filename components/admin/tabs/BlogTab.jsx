'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, BookOpen, Clock, Calendar, Search, Star, Eye } from 'lucide-react';

function formatImageUrl(url) {
  if (!url || typeof url !== 'string') {
    return 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=800&q=80';
  }
  return url.replace(/&#x2F;/g, '/').replace(/&amp;/g, '&').replace(/&quot;/g, '').trim();
}

export default function BlogTab({
  blogs = [],
  onAdd,
  onEdit,
  onDelete
}) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const categories = ['Semua', ...Array.from(new Set(blogs.map(b => b.category).filter(Boolean)))];

  const filteredBlogs = blogs.filter((b) => {
    if (selectedCategory !== 'Semua' && b.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        (b.title || '').toLowerCase().includes(q) ||
        (b.title_en || '').toLowerCase().includes(q) ||
        (b.category || '').toLowerCase().includes(q) ||
        (b.tags || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-heading text-white">Kelola Blog & Artikel</h2>
          <p className="text-xs text-gray-400">Total {blogs.length} artikel teknis tersimpan di MySQL</p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#8245ec] to-[#a855f7] shadow-lg shadow-purple-900/30 hover:scale-105 transition-all cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Artikel Blog</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul artikel, kategori, atau tag..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-[#0b081e] border border-purple-500/20 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white'
                  : 'bg-[#0b081e] text-gray-300 hover:bg-purple-950/40 border border-purple-500/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBlogs.map((b) => (
          <div
            key={b.id}
            className="bg-[#0b081e] rounded-2xl overflow-hidden border border-purple-500/20 flex flex-col justify-between shadow-xl"
          >
            {/* Thumbnail */}
            <div className="h-40 relative bg-black/40 overflow-hidden">
              <img
                src={formatImageUrl(b.image_url)}
                alt={b.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950/90 text-purple-200 border border-purple-500/40">
                  {b.category || 'Article'}
                </span>
                {b.is_featured ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/90 text-black flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-black" /> Featured
                  </span>
                ) : null}
              </div>

              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-medium bg-black/75 text-gray-300 backdrop-blur-sm">
                {b.read_time || '5 min read'}
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-purple-400" />
                    {b.published_at || 'Terbaru'}
                  </span>
                  {b.title_en ? (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                      Bilingual (ID + EN)
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-medium bg-amber-950/60 text-amber-300 border border-amber-500/30">
                      ID Saja
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-white text-sm line-clamp-2 mb-1.5">{b.title}</h3>
                {b.title_en && (
                  <h4 className="text-xs text-purple-300/80 italic line-clamp-1 mb-2">
                    {b.title_en}
                  </h4>
                )}
                <p className="text-xs text-gray-400 line-clamp-2 mb-3">{b.summary}</p>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-purple-900/20">
                <span className="text-[11px] text-gray-400">
                  Slug: <span className="font-mono text-purple-300">{b.slug}</span>
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEdit(b)}
                    className="p-1.5 rounded-lg text-purple-300 hover:bg-purple-900/40 cursor-pointer"
                    title="Edit Artikel"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(b.id)}
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40 cursor-pointer"
                    title="Hapus Artikel"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredBlogs.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400 bg-[#0b081e] rounded-2xl border border-dashed border-purple-900/40">
            <BookOpen className="w-10 h-10 mx-auto mb-2 text-purple-400 opacity-60" />
            <p className="text-sm">Belum ada artikel yang cocok dengan filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
