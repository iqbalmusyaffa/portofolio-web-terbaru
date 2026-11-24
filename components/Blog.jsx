'use client';

import { useState, useMemo } from 'react';
import { Search, Calendar, Clock, ArrowRight, BookOpen, Sparkles, Filter, X } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import BlogModal from './BlogModal';
import { cleanTagsList } from '@/lib/tagUtils';

function formatImageUrl(url) {
  if (!url || typeof url !== 'string') {
    return 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=800&q=80';
  }
  return url
    .replace(/&#x2F;/g, '/')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '')
    .trim();
}

export default function Blog({ blogs = [] }) {
  const { t, language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBlog, setSelectedBlog] = useState(null);

  // Extract unique categories dynamically
  const categories = useMemo(() => {
    const set = new Set();
    blogs.forEach((b) => {
      if (b.category && b.category.trim()) {
        set.add(b.category.trim());
      }
    });
    // Ensure default core categories exist if list is small
    const defaults = ['Backend Architecture', 'Database & MySQL', 'Security & Auth'];
    defaults.forEach((c) => set.add(c));
    return ['Semua', ...Array.from(set)];
  }, [blogs]);

  // Filter and search
  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      // Category filter
      if (activeCategory !== 'Semua' && b.category !== activeCategory) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const title = (b.title || '').toLowerCase();
        const titleEn = (b.title_en || '').toLowerCase();
        const summary = (b.summary || '').toLowerCase();
        const summaryEn = (b.summary_en || '').toLowerCase();
        const tags = (b.tags || '').toLowerCase();
        const cat = (b.category || '').toLowerCase();

        return (
          title.includes(query) ||
          titleEn.includes(query) ||
          summary.includes(query) ||
          summaryEn.includes(query) ||
          tags.includes(query) ||
          cat.includes(query)
        );
      }

      return true;
    });
  }, [blogs, activeCategory, searchQuery]);

  return (
    <section id="blog" className="py-24 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40 mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t('blog.eyebrow')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading tracking-tight text-gray-900 dark:text-white">
            {t('blog.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-3 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {t('blog.desc')}
          </p>
        </div>

        {/* Filter and Search Bar Container */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 w-full md:w-auto">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#8245ec] to-[#a855f7] text-white shadow-md shadow-purple-900/30 scale-105'
                      : 'bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10'
                  }`}
                >
                  {cat === 'Semua' ? t('blog.filter.all') : cat}
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('blog.search_placeholder')}
              className="w-full pl-10 pr-9 py-2 rounded-2xl text-xs sm:text-sm bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                title="Hapus pencarian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Blog Cards Grid */}
        {filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => {
              const title = (language === 'en' && blog.title_en) ? blog.title_en : blog.title;
              const summary = (language === 'en' && blog.summary_en) ? blog.summary_en : blog.summary;
              const tags = cleanTagsList(blog.tags);

              return (
                <article
                  key={blog.id || blog.slug}
                  onClick={() => setSelectedBlog(blog)}
                  className="group relative bg-white dark:bg-[#0b081e] rounded-3xl overflow-hidden border border-gray-200 dark:border-purple-500/20 shadow-lg hover:shadow-2xl hover:border-purple-500/50 transition-all duration-300 flex flex-col justify-between cursor-pointer transform hover:-translate-y-1"
                >
                  {/* Top Image & Badge */}
                  <div>
                    <div className="relative h-48 w-full overflow-hidden bg-gray-900">
                      <img
                        src={formatImageUrl(blog.image_url)}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />

                      {/* Category Badge */}
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold bg-purple-900/80 backdrop-blur-md text-purple-200 border border-purple-400/30">
                        {blog.category || 'Engineering'}
                      </span>

                      {/* Featured Badge */}
                      {blog.is_featured ? (
                        <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/90 text-black shadow-md">
                          ★ Featured
                        </span>
                      ) : null}

                      {/* Date & Read time overlay */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-gray-200 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-purple-400" />
                          {blog.published_at || 'Terbaru'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-purple-400" />
                          {blog.read_time || '5 min read'}
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6">
                      <h3 className="text-lg font-bold font-heading text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors line-clamp-2 mb-2.5 leading-snug">
                        {title}
                      </h3>

                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 leading-relaxed">
                        {summary}
                      </p>

                      {/* Tag badges */}
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {tags.slice(0, 3).map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 dark:bg-purple-950/40 text-gray-700 dark:text-purple-300 border border-gray-200 dark:border-purple-900/30"
                            >
                              #{tag}
                            </span>
                          ))}
                          {tags.length > 3 && (
                            <span className="text-[10px] text-gray-500 self-center">
                              +{tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Action Link */}
                  <div className="px-6 py-4 border-t border-gray-100 dark:border-purple-900/20 bg-gray-50/50 dark:bg-purple-950/10 flex items-center justify-between text-xs font-semibold text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300">
                    <span>{t('blog.read_more')}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center bg-white dark:bg-white/5 rounded-3xl border border-dashed border-gray-300 dark:border-purple-900/40">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t('blog.empty')}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-3 text-xs text-purple-600 dark:text-purple-400 hover:underline"
              >
                Reset pencarian
              </button>
            )}
          </div>
        )}
      </div>

      {/* Full Article Modal */}
      {selectedBlog && (
        <BlogModal
          blog={selectedBlog}
          onClose={() => setSelectedBlog(null)}
        />
      )}
    </section>
  );
}
