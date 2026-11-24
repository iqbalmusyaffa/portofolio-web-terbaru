'use client';

import { useState } from 'react';
import { Upload, Bot, Sparkles, Loader2, Check } from 'lucide-react';
import SkillTagSelector from '@/components/admin/SkillTagSelector';
import AiAssistantModal from '@/components/admin/AiAssistantModal';

export default function ProjectForm({
  item,
  setItem,
  skills = [],
  onSubmit,
  onClose,
  onUploadFile
}) {
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiTargetField, setAiTargetField] = useState('description'); // 'description' | 'description_en'
  const [autoTranslating, setAutoTranslating] = useState(false);
  const [translateSuccess, setTranslateSuccess] = useState(false);

  const handleAutoTranslateToEn = async () => {
    if (!item.description || !item.description.trim()) {
      alert('Isi Deskripsi Bahasa Indonesia terlebih dahulu untuk diterjemahkan.');
      return;
    }

    setAutoTranslating(true);
    setTranslateSuccess(false);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'translate',
          text: item.description,
          targetLang: 'en'
        })
      });

      const data = await res.json();
      if (data.success && data.result) {
        setItem(prev => ({ ...prev, description_en: data.result }));
        setTranslateSuccess(true);
        setTimeout(() => setTranslateSuccess(false), 3000);
      } else {
        alert(data.error || 'Gagal menerjemahkan dengan AI');
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi saat memanggil AI');
    } finally {
      setAutoTranslating(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 scrollbar-thin scrollbar-thumb-purple-900/40">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-300 mb-1">Judul Proyek (🇮🇩 ID)</label>
            <input
              type="text"
              required
              value={item.title || ''}
              onChange={(e) => setItem({ ...item, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-300 mb-1">Judul Proyek (🇬🇧 EN - Opsional)</label>
            <input
              type="text"
              placeholder="Contoh: E-Commerce RESTful API"
              value={item.title_en || ''}
              onChange={(e) => setItem({ ...item, title_en: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
            />
          </div>
        </div>

        {/* Deskripsi Bahasa Indonesia */}
        <div className="p-3.5 rounded-2xl bg-[#0f0b2a] border border-purple-900/40 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
              <span>🇮🇩 Deskripsi (Bahasa Indonesia - Teks Utama)</span>
            </label>
            <button
              type="button"
              onClick={() => {
                setAiTargetField('description');
                setAiModalOpen(true);
              }}
              className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Bot className="w-3 h-3" />
              <span>Poles dengan AI</span>
            </button>
          </div>
          <textarea
            rows={3}
            required
            value={item.description || ''}
            onChange={(e) => setItem({ ...item, description: e.target.value })}
            placeholder="Tuliskan deskripsi proyek dalam Bahasa Indonesia..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400 leading-relaxed"
          />
        </div>

        {/* Deskripsi English */}
        <div className="p-3.5 rounded-2xl bg-[#0d0926] border border-purple-500/30 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
              <span>🇬🇧 Description (English - Ditampilkan saat klik EN)</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAutoTranslateToEn}
                disabled={autoTranslating || !item.description?.trim()}
                className="text-[11px] font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {autoTranslating ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Menerjemahkan...</span>
                  </>
                ) : translateSuccess ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-300" />
                    <span>Tersalin ke English!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>Terjemahkan Otomatis (Gemini AI)</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAiTargetField('description_en');
                  setAiModalOpen(true);
                }}
                className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Bot className="w-3 h-3" />
                <span>Bantuan AI</span>
              </button>
            </div>
          </div>
          <textarea
            rows={3}
            value={item.description_en || ''}
            onChange={(e) => setItem({ ...item, description_en: e.target.value })}
            placeholder="Terjemahan bahasa Inggris akan otomatis tampil di sini saat tombol 'Terjemahkan Otomatis' diklik..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400 leading-relaxed"
          />
          <p className="text-[10px] text-gray-400">
            * Ketika pengunjung website mengklik 🇬🇧 EN, deskripsi bahasa Inggris ini yang akan ditampilkan. Jika klik 🇮🇩 ID, deskripsi bahasa Indonesia tetap aman.
          </p>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-gray-300">URL Gambar Preview</label>
            <label className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer">
              <Upload className="w-3 h-3" />
              <span>Upload Foto (JPG/PNG)</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => onUploadFile(e, (url) => setItem({ ...item, image_url: url }))}
              />
            </label>
          </div>
          <input
            type="text"
            value={item.image_url || ''}
            onChange={(e) => setItem({ ...item, image_url: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
          />
          {item.image_url && (
            <div className="mt-2 h-24 rounded-xl overflow-hidden border border-purple-500/20 bg-black/40 flex items-center justify-center">
              <img src={item.image_url} alt="Preview" className="h-full object-cover" />
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-300 mb-1">Live URL Demo</label>
            <input
              type="text"
              value={item.live_url || ''}
              onChange={(e) => setItem({ ...item, live_url: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-300 mb-1">GitHub Repo URL</label>
            <input
              type="text"
              value={item.github_url || ''}
              onChange={(e) => setItem({ ...item, github_url: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
            />
          </div>
        </div>
        <SkillTagSelector
          label="Tags (pisahkan dengan koma)"
          value={typeof item.tags === 'string' ? item.tags : JSON.stringify(item.tags || [])}
          onChange={(val) => setItem({ ...item, tags: val })}
          skills={skills}
          placeholder="Next.js, React, Tailwind, MySQL"
        />
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="feat"
            checked={!!item.featured}
            onChange={(e) => setItem({ ...item, featured: e.target.checked ? 1 : 0 })}
            className="rounded text-purple-600 focus:ring-purple-500"
          />
          <label htmlFor="feat" className="text-xs text-gray-300 cursor-pointer">
            Tampilkan sebagai Featured Project
          </label>
        </div>
      </div>

      {/* Persistent Footer */}
      <div className="px-5 sm:px-6 py-3.5 border-t border-purple-900/40 bg-[#0a0720] shrink-0 flex items-center justify-end gap-2.5">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-xl text-xs font-medium text-gray-300 bg-white/5 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
        >
          Batal
        </button>
        <button
          type="submit"
          className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#8245ec] via-[#9333ea] to-[#a855f7] hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-purple-600/40 transition-all cursor-pointer"
        >
          Simpan Proyek
        </button>
      </div>

      <AiAssistantModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        initialText={aiTargetField === 'description_en' ? (item.description_en || item.description || '') : (item.description || '')}
        onApply={(val) => {
          if (aiTargetField === 'description_en') {
            setItem(prev => ({ ...prev, description_en: val }));
          } else {
            setItem(prev => ({ ...prev, description: val }));
          }
        }}
        title={aiTargetField === 'description_en' ? 'Asisten AI: Deskripsi English' : 'Asisten AI: Deskripsi Proyek (ID)'}
      />
    </form>
  );
}
