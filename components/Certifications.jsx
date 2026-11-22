'use client';

import { useState } from 'react';
import { Award, ExternalLink, Calendar, Building, Search } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

export default function Certifications({ certificates }) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [limit, setLimit] = useState(6);

  const filtered = (certificates || []).filter((c) => {
    const q = searchTerm.toLowerCase();
    return (
      c.title?.toLowerCase().includes(q) ||
      c.issuer?.toLowerCase().includes(q) ||
      c.issue_date?.toLowerCase().includes(q)
    );
  });

  const displayed = filtered.slice(0, limit);

  return (
    <section id="certifications" className="py-20 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-[11px] font-semibold tracking-widest uppercase text-purple-600 dark:text-purple-400 mb-2">
            {t('certifications.eyebrow')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading tracking-tight text-gray-900 dark:text-white">
            {t('certifications.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-3 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {t('certifications.desc')}
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('certifications.search_placeholder')}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setLimit(6);
              }}
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-purple-500 placeholder-gray-400 dark:placeholder-gray-500 backdrop-blur-md shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayed.map((cert) => (
            <div
              key={cert.id}
              className="glass-card p-6 rounded-3xl border border-gray-200 dark:border-white/10 hover:border-purple-400 dark:hover:border-purple-500/40 flex flex-col justify-between group transition-all duration-300 shadow-sm hover:shadow-xl"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 border border-purple-200 dark:border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-[#e879f9] group-hover:scale-110 transition-transform">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-500/20 px-2 py-0.5 rounded-full">
                    <Calendar className="w-3 h-3" />
                    {cert.issue_date}
                  </span>
                </div>

                <h3 className="text-base font-bold font-heading text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-[#a78bfa] transition-colors mb-2 line-clamp-2">
                  {cert.title}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 mb-4">
                  <Building className="w-3.5 h-3.5 text-[#8245ec] shrink-0" />
                  <span className="line-clamp-1">{cert.issuer}</span>
                </div>
              </div>

              {cert.credential_url && (
                <div className="pt-3 border-t border-gray-200 dark:border-white/5">
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-300 hover:text-purple-800 dark:hover:text-white transition-colors group/link"
                  >
                    <span>Verifikasi Kredensial</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Show More / Show Less */}
        {filtered.length > 6 && (
          <div className="text-center mt-10">
            <button
              onClick={() => setLimit(limit >= filtered.length ? 6 : filtered.length)}
              className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-purple-700 dark:text-purple-200 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 border border-purple-300 dark:border-purple-500/40 transition-all shadow-sm"
            >
              {limit >= filtered.length ? 'Tampilkan Lebih Sedikit' : `Lihat Semua Sertifikat (${filtered.length})`}
            </button>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500 text-sm">
            Tidak ditemukan sertifikat dengan kata kunci &quot;{searchTerm}&quot;.
          </div>
        )}
      </div>
    </section>
  );
}
