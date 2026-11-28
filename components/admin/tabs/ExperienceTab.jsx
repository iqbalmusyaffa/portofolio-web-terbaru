'use client';

import { Plus, Edit2, Trash2, Building2 } from 'lucide-react';

export default function ExperienceTab({
  experiences = [],
  onAdd,
  onEdit,
  onDelete
}) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-heading text-white">Kelola Pengalaman</h2>
          <p className="text-xs text-gray-400">Total {experiences.length} pengalaman kerja / bootcamp</p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#8245ec] to-[#a855f7] shadow-lg shadow-purple-900/30 hover:scale-105 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pengalaman</span>
        </button>
      </div>

      <div className="space-y-4">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="bg-[#0b081e] p-6 rounded-2xl border border-purple-500/20 flex flex-col sm:flex-row items-start justify-between gap-4 shadow-xl"
          >
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 rounded-xl bg-[#140e3d] p-1.5 border border-purple-500/30 shrink-0 flex items-center justify-center overflow-hidden">
                {exp.company_logo ? (
                  <img
                    src={exp.company_logo}
                    alt={exp.company}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Building2 className="w-6 h-6 text-purple-400" />
                )}
              </div>

              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-bold text-white text-base">{exp.role}</h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/30">
                    {exp.period}
                  </span>
                </div>
                <div className="text-xs font-semibold text-gray-300 flex items-center gap-2">
                  <span className="text-purple-300">{exp.company}</span>
                  {exp.location && <span>• {exp.location}</span>}
                </div>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{exp.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
              <button
                onClick={() => onEdit(exp)}
                className="p-2 rounded-xl bg-white/5 hover:bg-purple-900/40 text-purple-300 cursor-pointer"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(exp.id)}
                className="p-2 rounded-xl bg-white/5 hover:bg-rose-950/40 text-rose-400 cursor-pointer"
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
