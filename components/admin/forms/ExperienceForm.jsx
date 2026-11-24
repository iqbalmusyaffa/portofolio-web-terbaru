'use client';

import { useState } from 'react';
import { Bot, Sparkles, Loader2, Check } from 'lucide-react';
import SkillTagSelector from '@/components/admin/SkillTagSelector';
import AiAssistantModal from '@/components/admin/AiAssistantModal';

export default function ExperienceForm({
  item,
  setItem,
  skills = [],
  onSubmit,
  onClose
}) {
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiTargetField, setAiTargetField] = useState('description');
  const [autoTranslating, setAutoTranslating] = useState(false);
  const [translateSuccess, setTranslateSuccess] = useState(false);
  const [translatingRole, setTranslatingRole] = useState(false);
  const [translateRoleSuccess, setTranslateRoleSuccess] = useState(false);

  const handleAutoTranslateRole = async (direction = 'to_en') => {
    const sourceText = direction === 'to_en' ? item.role : item.role_en;
    const targetLang = direction === 'to_en' ? 'en' : 'id';

    if (!sourceText || !sourceText.trim()) {
      alert(direction === 'to_en' ? 'Isi Role / Posisi Bahasa Indonesia terlebih dahulu.' : 'Isi Role English terlebih dahulu.');
      return;
    }

    setTranslatingRole(true);
    setTranslateRoleSuccess(false);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'translate',
          text: sourceText,
          targetLang: targetLang
        })
      });

      const data = await res.json();
      if (data.success && data.result) {
        if (direction === 'to_en') {
          setItem(prev => ({ ...prev, role_en: data.result }));
        } else {
          setItem(prev => ({ ...prev, role: data.result }));
        }
        setTranslateRoleSuccess(true);
        setTimeout(() => setTranslateRoleSuccess(false), 3000);
      } else {
        alert(data.error || 'Gagal menerjemahkan role');
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi saat memanggil AI');
    } finally {
      setTranslatingRole(false);
    }
  };

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
        {/* Role Bilingual */}
        <div className="p-4 rounded-2xl bg-[#0f0b2a] border border-purple-900/40 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-900/30 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-xs font-bold text-white font-heading">Role / Posisi (Bilingual)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleAutoTranslateRole('to_en')}
                disabled={translatingRole || !item.role?.trim()}
                className="text-[11px] font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                title="Terjemahkan role dari Bahasa Indonesia ke English"
              >
                {translatingRole ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Menerjemahkan...</span>
                  </>
                ) : translateRoleSuccess ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-300" />
                    <span>Tersalin ke English!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>Terjemahkan Role (Gemini AI)</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAiTargetField('role_en');
                  setAiModalOpen(true);
                }}
                className="text-[11px] text-purple-400 hover:text-purple-300 p-1 rounded-lg hover:bg-purple-950/60 transition-colors cursor-pointer"
                title="Bantuan AI untuk Role"
              >
                <Bot className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-purple-300 mb-1.5">
                🇮🇩 Versi Bahasa Indonesia
              </label>
              <input
                type="text"
                required
                value={item.role || ''}
                onChange={(e) => setItem({ ...item, role: e.target.value })}
                placeholder="Contoh: Backend Developer"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-300 mb-1.5">
                🇬🇧 Versi English
              </label>
              <input
                type="text"
                placeholder="Contoh: Backend Developer Intern"
                value={item.role_en || ''}
                onChange={(e) => setItem({ ...item, role_en: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-300 mb-1">Perusahaan / Organisasi</label>
          <input
            type="text"
            required
            value={item.company || ''}
            onChange={(e) => setItem({ ...item, company: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-300 mb-1">Periode</label>
            <input
              type="text"
              required
              value={item.period || ''}
              onChange={(e) => setItem({ ...item, period: e.target.value })}
              placeholder="Juni 2024 - November 2024"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-300 mb-1">Lokasi</label>
            <input
              type="text"
              value={item.location || ''}
              onChange={(e) => setItem({ ...item, location: e.target.value })}
              placeholder="Surabaya, Indonesia"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
            />
          </div>
        </div>

        {/* Deskripsi Bahasa Indonesia */}
        <div className="p-3.5 rounded-2xl bg-[#0f0b2a] border border-purple-900/40 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
              <span>🇮🇩 Deskripsi Tugas &amp; Hasil (Bahasa Indonesia)</span>
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
            value={item.description || ''}
            onChange={(e) => setItem({ ...item, description: e.target.value })}
            placeholder="Jelaskan peran, tanggung jawab, dan hasil kerja dalam Bahasa Indonesia..."
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

        <SkillTagSelector
          label="Teknologi yang Digunakan (koma)"
          value={item.technologies || ''}
          onChange={(val) => setItem({ ...item, technologies: val })}
          skills={skills}
          placeholder="HTML, CSS, JavaScript, Laravel, MySQL"
        />
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
          Simpan Pengalaman
        </button>
      </div>

      <AiAssistantModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        initialText={
          aiTargetField === 'role_en'
            ? (item.role_en || item.role || '')
            : aiTargetField === 'description_en'
            ? (item.description_en || item.description || '')
            : (item.description || '')
        }
        onApply={(val) => {
          if (aiTargetField === 'role_en') {
            setItem(prev => ({ ...prev, role_en: val }));
          } else if (aiTargetField === 'description_en') {
            setItem(prev => ({ ...prev, description_en: val }));
          } else {
            setItem(prev => ({ ...prev, description: val }));
          }
        }}
        title={
          aiTargetField === 'role_en'
            ? 'Asisten AI: Role / Posisi (English)'
            : aiTargetField === 'description_en'
            ? 'Asisten AI: Deskripsi English'
            : 'Asisten AI: Deskripsi Pengalaman (ID)'
        }
      />
    </form>
  );
}
