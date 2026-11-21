'use client';

import { Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';

export default function ProjectsTab({
  projects = [],
  onAdd,
  onEdit,
  onDelete
}) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-heading text-white">Kelola Proyek</h2>
          <p className="text-xs text-gray-400">Total {projects.length} proyek tersimpan di MySQL</p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#8245ec] to-[#a855f7] shadow-lg shadow-purple-900/30 hover:scale-105 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Proyek</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="bg-[#0b081e] rounded-2xl overflow-hidden border border-purple-500/20 flex flex-col justify-between shadow-xl"
          >
            <div className="h-40 relative bg-black/40 overflow-hidden">
              <img src={proj.image_url} alt={proj.title} className="w-full h-full object-cover" />
              {proj.featured ? (
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950/90 text-purple-200 border border-purple-500/40">
                  Featured
                </span>
              ) : null}
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-white text-base mb-1">{proj.title}</h3>
                <p className="text-xs text-gray-400 line-clamp-2 mb-3">{proj.description}</p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-purple-900/20">
                <div className="flex items-center gap-2">
                  {proj.live_url && (
                    <a
                      href={proj.live_url}
                      target="_blank"
                      className="text-xs text-purple-300 hover:text-white flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" /> Live
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEdit(proj)}
                    className="p-1.5 rounded-lg text-purple-300 hover:bg-purple-900/40 cursor-pointer"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(proj.id)}
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40 cursor-pointer"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
