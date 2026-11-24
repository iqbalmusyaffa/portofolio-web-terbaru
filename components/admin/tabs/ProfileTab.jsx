'use client';

import { useState } from 'react';
import { Upload, Save, Bot } from 'lucide-react';
import CityTagSelector from '@/components/admin/CityTagSelector';
import AiAssistantModal from '@/components/admin/AiAssistantModal';

export default function ProfileTab({
  profile = {},
  setProfile,
  onSave,
  onUploadFile
}) {
  const [aiModal, setAiModal] = useState({ isOpen: false, text: '', onApply: null, title: '' });

  const openAiModal = (title, initialText, onApply) => {
    setAiModal({ isOpen: true, text: initialText, onApply, title });
  };
  return (
    <div className="max-w-4xl bg-[#0b081e] p-6 sm:p-8 rounded-3xl border border-purple-500/20 space-y-8 animate-fadeIn shadow-2xl">
      <div>
        <h2 className="text-xl font-bold font-heading text-white">Biodata & Konten About Me</h2>
        <p className="text-xs text-gray-400">
          Kelola identitas utama, ringkasan bio, checklist keahlian, dan filosofi kode yang tampil di website
        </p>
      </div>

      <form onSubmit={onSave} className="space-y-6">
        {/* Bagian 1: Identitas Utama */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-purple-300 border-b border-purple-900/30 pb-2">
            1. Identitas Utama & Kontak
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-200 mb-1">Nama Tampilan</label>
              <input
                type="text"
                value={profile.name || ''}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-200 mb-1">Nama Lengkap & Gelar</label>
              <input
                type="text"
                value={profile.full_name || ''}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-200 mb-1">Tagline</label>
              <input
                type="text"
                value={profile.tagline || ''}
                onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                placeholder="Software Engineer"
                className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-200 mb-1">Alamat Email</label>
              <input
                type="email"
                value={profile.email || ''}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-200 mb-1">Lokasi</label>
              <input
                type="text"
                value={profile.location || ''}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-gray-200">Foto Avatar URL</label>
                <label className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer">
                  <Upload className="w-3 h-3" />
                  <span>Upload (JPG/PNG)</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => onUploadFile(e, (url) => setProfile({ ...profile, avatar_url: url }))}
                  />
                </label>
              </div>
              <input
                type="text"
                value={profile.avatar_url || ''}
                onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
                placeholder="/foto2.jpg"
                className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-200 mb-1">Link Google Drive CV</label>
              <input
                type="text"
                value={profile.cv_url || ''}
                onChange={(e) => setProfile({ ...profile, cv_url: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-200 mb-1">File / Link Direct PDF CV</label>
              <input
                type="text"
                value={profile.cv_pdf_url || ''}
                onChange={(e) => setProfile({ ...profile, cv_pdf_url: e.target.value })}
                placeholder="/cv-iqbal-musyaffa.pdf"
                className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>
        </div>

        {/* Bagian 2: Media Sosial */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-purple-300 border-b border-purple-900/30 pb-2">
            2. Media Sosial
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-200 mb-1">GitHub URL</label>
              <input
                type="text"
                value={profile.github_url || ''}
                onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-200 mb-1">LinkedIn URL</label>
              <input
                type="text"
                value={profile.linkedin_url || ''}
                onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-200 mb-1">Instagram URL</label>
              <input
                type="text"
                value={profile.instagram_url || ''}
                onChange={(e) => setProfile({ ...profile, instagram_url: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-200 mb-1">Facebook URL</label>
              <input
                type="text"
                value={profile.facebook_url || ''}
                onChange={(e) => setProfile({ ...profile, facebook_url: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>
        </div>

        {/* Bagian 3: Konten Section About Me */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-purple-300 border-b border-purple-900/30 pb-2">
            3. Konten Section About Me
          </h3>

          <div>
            <label className="block text-xs font-semibold text-gray-200 mb-1">Judul Utama About</label>
            <input
              type="text"
              value={profile.about_title || ''}
              onChange={(e) => setProfile({ ...profile, about_title: e.target.value })}
              placeholder="Dedikasi untuk Solusi Digital Berkualitas"
              className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-gray-200">Paragraf 1 Bio</label>
                <button
                  type="button"
                  onClick={() => openAiModal('Bantuan AI: Paragraf 1 Bio', profile.bio || '', (val) => setProfile({ ...profile, bio: val }))}
                  className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Bot className="w-3 h-3" />
                  <span>Bantuan AI</span>
                </button>
              </div>
              <textarea
                rows={4}
                value={profile.bio || ''}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Saya adalah lulusan S1 Sistem Informasi Universitas Telkom Surabaya..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-gray-200">Paragraf 2 Bio</label>
                <button
                  type="button"
                  onClick={() => openAiModal('Bantuan AI: Paragraf 2 Bio', profile.about_bio_2 || '', (val) => setProfile({ ...profile, about_bio_2: val }))}
                  className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Bot className="w-3 h-3" />
                  <span>Bantuan AI</span>
                </button>
              </div>
              <textarea
                rows={4}
                value={profile.about_bio_2 || ''}
                onChange={(e) => setProfile({ ...profile, about_bio_2: e.target.value })}
                placeholder="Dengan pengalaman dalam ekosistem modern seperti Next.js, React, Node.js..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-emerald-300">🇬🇧 Bio Ringkasan (English - Ditampilkan saat klik EN)</label>
              <button
                type="button"
                onClick={async () => {
                  if (!profile.bio) {
                    alert('Isi Paragraf 1 Bio terlebih dahulu untuk diterjemahkan.');
                    return;
                  }
                  try {
                    const res = await fetch('/api/ai', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ action: 'translate', text: profile.bio, targetLang: 'en' })
                    });
                    const d = await res.json();
                    if (d.success && d.result) {
                      setProfile(prev => ({ ...prev, bio_en: d.result }));
                    } else {
                      alert(d.error || 'Gagal menerjemahkan');
                    }
                  } catch (e) {
                    alert('Gagal terhubung ke AI');
                  }
                }}
                className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
              >
                <Bot className="w-3 h-3" />
                <span>Terjemahkan Bio ke English (Gemini AI)</span>
              </button>
            </div>
            <textarea
              rows={3}
              value={profile.bio_en || ''}
              onChange={(e) => setProfile({ ...profile, bio_en: e.target.value })}
              placeholder="Terjemahan bahasa Inggris untuk bio..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-200 mb-1">
              Checklist Poin Keahlian / Highlights (Pisahkan dengan baris baru / Enter)
            </label>
            <textarea
              rows={5}
              value={
                (() => {
                  if (!profile.about_highlights) return '';
                  try {
                    const parsed = typeof profile.about_highlights === 'string'
                      ? (profile.about_highlights.startsWith('[') ? JSON.parse(profile.about_highlights) : profile.about_highlights)
                      : profile.about_highlights;
                    return Array.isArray(parsed) ? parsed.join('\n') : String(profile.about_highlights);
                  } catch (e) {
                    return String(profile.about_highlights || '');
                  }
                })()
              }
              onChange={(e) => setProfile({ ...profile, about_highlights: e.target.value })}
              placeholder="Pengembangan web modern end-to-end (Frontend & Backend)&#10;Arsitektur RESTful API performa tinggi & keamanan JWT&#10;Optimasi database relasional MySQL & query efisien"
              className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white font-mono text-xs focus:outline-none focus:border-purple-400"
            />
            <span className="text-[11px] text-gray-400">
              Setiap baris akan otomatis menjadi 1 item checklist berikon centang di website.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-200 mb-1">Keterangan Lokasi & Ketersediaan</label>
              <textarea
                rows={2}
                value={profile.availability_status || ''}
                onChange={(e) => setProfile({ ...profile, availability_status: e.target.value })}
                placeholder="Terbuka untuk kesempatan kerja Full-time, Remote, Hybrid, maupun Freelance..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-200 mb-1">Nilai IPK Telkom</label>
              <input
                type="text"
                value={profile.gpa_score || ''}
                onChange={(e) => setProfile({ ...profile, gpa_score: e.target.value })}
                placeholder="3.40"
                className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>

          <CityTagSelector
            value={profile.relocation_cities || ''}
            onChange={(val) => setProfile({ ...profile, relocation_cities: val })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-200 mb-1">Label Kategori Card</label>
              <input
                type="text"
                value={profile.code_philosophy_label || ''}
                onChange={(e) => setProfile({ ...profile, code_philosophy_label: e.target.value })}
                placeholder="Prinsip Rekayasa"
                className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
              />
              <span className="text-[10px] text-gray-400">Cth: Prinsip Rekayasa / Standar Teknis</span>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-200 mb-1">Judul Prinsip / Fokus</label>
              <input
                type="text"
                value={profile.code_philosophy_title || ''}
                onChange={(e) => setProfile({ ...profile, code_philosophy_title: e.target.value })}
                placeholder="Maintainable & Scalable Architecture"
                className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
              />
              <span className="text-[10px] text-gray-400">Cth: Maintainable & Scalable Architecture</span>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-200 mb-1">Deskripsi Pendukung</label>
              <textarea
                rows={2}
                value={profile.code_philosophy_desc || ''}
                onChange={(e) => setProfile({ ...profile, code_philosophy_desc: e.target.value })}
                placeholder="Mengutamakan struktur kode modular yang mudah dirawat tim..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
              />
              <span className="text-[10px] text-gray-400">Penjelasan pendekatan kerja Anda</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-purple-900/30">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#8245ec] to-[#a855f7] shadow-lg shadow-purple-900/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan Biodata & About Me</span>
          </button>
        </div>
      </form>

      <AiAssistantModal
        isOpen={aiModal.isOpen}
        onClose={() => setAiModal({ ...aiModal, isOpen: false })}
        initialText={aiModal.text}
        onApply={aiModal.onApply}
        title={aiModal.title}
      />
    </div>
  );
}
