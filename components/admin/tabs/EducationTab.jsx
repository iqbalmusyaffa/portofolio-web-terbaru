'use client';

import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function EducationTab({
  educations = [],
  onAdd,
  onEdit,
  onDelete
}) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-heading text-white">Kelola Pendidikan</h2>
          <p className="text-xs text-gray-400">Total {educations.length} riwayat pendidikan</p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#8245ec] to-[#a855f7] shadow-lg shadow-purple-900/30 hover:scale-105 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pendidikan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {educations.map((edu) => (
          <div
            key={edu.id}
            className="bg-[#0b081e] p-6 rounded-2xl border border-purple-500/20 flex flex-col justify-between shadow-xl"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/30">
                  {edu.period}
                </span>
                {edu.grade && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-semibold">
                    {edu.grade}
                  </span>
                )}
              </div>
              <h3 className="font-bold text-white text-base">{edu.school}</h3>
              <div className="text-xs text-purple-300 font-semibold">{edu.degree}</div>
              <p className="text-xs text-gray-300 leading-relaxed">{edu.description}</p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-purple-900/20">
              <button
                onClick={() => onEdit(edu)}
                className="p-1.5 rounded text-purple-300 hover:bg-white/10 cursor-pointer"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(edu.id)}
                className="p-1.5 rounded text-rose-400 hover:bg-white/10 cursor-pointer"
                title="Hapus"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
