'use client';

import { useState } from 'react';
import { Bot } from 'lucide-react';
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
  return (
    <form onSubmit={onSubmit} className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 scrollbar-thin scrollbar-thumb-purple-900/40">
        <div>
          <label className="block text-xs text-gray-300 mb-1">Role / Posisi</label>
          <input
            type="text"
            required
            value={item.role || ''}
            onChange={(e) => setItem({ ...item, role: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
          />
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
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-gray-300">Deskripsi Tugas &amp; Hasil</label>
            <button
              type="button"
              onClick={() => setAiModalOpen(true)}
              className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Bot className="w-3 h-3" />
              <span>Bantuan AI (Terjemah / Poles)</span>
            </button>
          </div>
          <textarea
            rows={4}
            value={item.description || ''}
            onChange={(e) => setItem({ ...item, description: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
          />
        </div>
        <SkillTagSelector
          label="Teknologi yang Digunakan (koma)"
          value={typeof item.technologies === 'string' ? item.technologies : JSON.stringify(item.technologies || [])}
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
        initialText={item.description || ''}
        onApply={(val) => setItem({ ...item, description: val })}
        title="Asisten AI: Deskripsi Pengalaman"
      />
    </form>
  );
}
