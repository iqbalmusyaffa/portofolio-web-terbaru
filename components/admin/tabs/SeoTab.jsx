'use client';

import { Globe, Eye, Upload, Save } from 'lucide-react';

export default function SeoTab({
  profile = {},
  setProfile,
  onSave,
  onUploadFile
}) {
  return (
    <div className="max-w-4xl bg-[#0b081e] p-6 sm:p-8 rounded-3xl border border-purple-500/20 space-y-8 animate-fadeIn shadow-2xl">
      <div>
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-bold font-heading text-white">Pengaturan SEO & OpenGraph</h2>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Atur judul, deskripsi pencarian Google, kata kunci, dan gambar thumbnail sosial media untuk WhatsApp, Facebook, Twitter/X, dan LinkedIn.
        </p>
      </div>

      {/* Live Google Search Results Snippet Preview */}
      <div className="p-5 rounded-2xl bg-[#030014] border border-purple-500/30 space-y-2">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5" />
          <span>Pratinjau Hasil Pencarian Google (Live Search Snippet)</span>
        </div>

        <div className="pt-2">
          <div className="text-[12px] text-gray-400 font-mono truncate">
            {profile.canonical_url || 'https://iqbalmusyaffa.my.id'}
          </div>
          <h4 className="text-base sm:text-lg font-semibold text-[#8ab4f8] hover:underline cursor-pointer truncate">
            {profile.meta_title || `${profile.name || 'Iqbal Musyaffa'} - Software Engineer & Fullstack Developer`}
          </h4>
          <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">
            {profile.meta_description || profile.bio || 'Portofolio profesional Iqbal Musyaffa - Software Engineer & Fullstack Developer lulusan Telkom University Surabaya.'}
          </p>
        </div>
      </div>

      <form onSubmit={onSave} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-gray-200 mb-1">
            Judul Website (Meta Title) *
          </label>
          <input
            type="text"
            required
            value={profile.meta_title || ''}
            onChange={(e) => setProfile({ ...profile, meta_title: e.target.value })}
            placeholder="Iqbal Musyaffa - Software Engineer & Fullstack Developer"
            className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
          />
          <span className="text-[11px] text-gray-400">
            Tampil sebagai judul tab browser dan judul link di Google (Ideal: 50-60 karakter).
          </span>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-gray-200">
              Deskripsi Mesin Pencari (Meta Description) *
            </label>
            <span className="text-[11px] text-purple-300">
              {(profile.meta_description || '').length} / 160 karakter
            </span>
          </div>
          <textarea
            rows={3}
            required
            value={profile.meta_description || ''}
            onChange={(e) => setProfile({ ...profile, meta_description: e.target.value })}
            placeholder="Portofolio resmi Iqbal Musyaffa - Software Engineer & Fullstack Developer lulusan Telkom University Surabaya..."
            className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
          />
          <span className="text-[11px] text-gray-400">
            Tampil sebagai ringkasan teks di bawah judul pencarian Google dan saat dibagikan ke WhatsApp.
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-200 mb-1">
            Kata Kunci Pencarian (Meta Keywords)
          </label>
          <textarea
            rows={2}
            value={profile.meta_keywords || ''}
            onChange={(e) => setProfile({ ...profile, meta_keywords: e.target.value })}
            placeholder="Iqbal Musyaffa, Software Engineer, Fullstack Developer, Next.js, React, Laravel, MySQL, Portfolio"
            className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
          />
          <span className="text-[11px] text-gray-400">Pisahkan setiap kata kunci pencarian dengan koma (,).</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-200 mb-1">
              URL Domain Resmi (Canonical URL)
            </label>
            <input
              type="text"
              value={profile.canonical_url || ''}
              onChange={(e) => setProfile({ ...profile, canonical_url: e.target.value })}
              placeholder="https://iqbalmusyaffa.my.id/"
              className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
            />
            <span className="text-[11px] text-gray-400">URL utama situs untuk mencegah duplikasi konten SEO.</span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-gray-200">
                Gambar Thumbnail Sosial (OpenGraph Image URL)
              </label>
              <label className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer">
                <Upload className="w-3 h-3" />
                <span>Upload Banner (JPG/PNG)</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => onUploadFile(e, (url) => setProfile({ ...profile, og_image: url }))}
                />
              </label>
            </div>
            <input
              type="text"
              value={profile.og_image || ''}
              onChange={(e) => setProfile({ ...profile, og_image: e.target.value })}
              placeholder="/foto2.jpg"
              className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
            />
            <span className="text-[11px] text-gray-400">
              Gambar kartu pratinjau yang muncul saat link website dikirim di WhatsApp atau sosmed.
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-200 mb-1">
            Google Search Console Verification Tag (Opsional)
          </label>
          <input
            type="text"
            value={profile.google_site_verification || ''}
            onChange={(e) => setProfile({ ...profile, google_site_verification: e.target.value })}
            placeholder="Kode verifikasi Google Search Console (content code)"
            className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
          />
          <span className="text-[11px] text-gray-400">
            Masukkan kode verifikasi HTML tag Google untuk memantau performa ranking website Anda.
          </span>
        </div>

        <div className="pt-4 border-t border-purple-900/30">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 via-[#8245ec] to-[#a855f7] shadow-lg shadow-purple-900/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Pengaturan SEO & Metadata</span>
          </button>
        </div>
      </form>
    </div>
  );
}
