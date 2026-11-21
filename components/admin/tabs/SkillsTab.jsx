'use client';

import { Plus, Edit2, Trash2, Code } from 'lucide-react';
import { iconMap, isImageIcon } from '@/components/Skills';

export default function SkillsTab({
  skills = [],
  onAdd,
  onEdit,
  onDelete
}) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-heading text-white">Kelola Skills</h2>
          <p className="text-xs text-gray-400">Total {skills.length} skills tersimpan di MySQL</p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#8245ec] to-[#a855f7] shadow-lg shadow-purple-900/30 hover:scale-105 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Skill</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {skills.map((s) => {
          const hasImg = isImageIcon(s.icon);
          const IconComp = iconMap[s.icon] || Code;
          return (
            <div
              key={s.id}
              className="bg-[#0b081e] p-4 rounded-2xl border border-purple-500/20 flex items-center justify-between group shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#140f33] border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 overflow-hidden">
                  {hasImg ? (
                    <img src={s.icon} alt={s.name} className="w-5 h-5 object-contain" />
                  ) : (
                    <IconComp className="w-5 h-5 text-purple-400" />
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-purple-400 uppercase tracking-wider">
                    {s.category}
                  </span>
                  <h4 className="font-bold text-white text-sm">{s.name}</h4>
                  <span className="text-xs text-gray-400">{s.level}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                <button
                  onClick={() => onEdit(s)}
                  className="p-1.5 rounded text-purple-300 hover:bg-white/10 cursor-pointer"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDelete(s.id)}
                  className="p-1.5 rounded text-rose-400 hover:bg-white/10 cursor-pointer"
                  title="Hapus"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
