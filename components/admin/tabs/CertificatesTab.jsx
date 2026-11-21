'use client';

import { Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';

export default function CertificatesTab({
  certificates = [],
  onAdd,
  onEdit,
  onDelete
}) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-heading text-white">Kelola Sertifikasi</h2>
          <p className="text-xs text-gray-400">Total {certificates.length} sertifikat tersimpan di MySQL</p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#8245ec] to-[#a855f7] shadow-lg shadow-purple-900/30 hover:scale-105 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Sertifikat</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="bg-[#0b081e] p-5 rounded-2xl border border-purple-500/20 flex flex-col justify-between shadow-xl"
          >
            <div>
              <span className="text-[10px] text-purple-400 font-medium">{cert.issue_date}</span>
              <h3 className="font-bold text-white text-sm mb-1 line-clamp-2">{cert.title}</h3>
              <p className="text-xs text-gray-400 mb-2">{cert.issuer}</p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-purple-900/20">
              {cert.credential_url ? (
                <a
                  href={cert.credential_url}
                  target="_blank"
                  className="text-[11px] text-purple-300 hover:text-white flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" /> Verifikasi
                </a>
              ) : (
                <span />
              )}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit(cert)}
                  className="p-1 rounded text-purple-300 hover:bg-white/10 cursor-pointer"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDelete(cert.id)}
                  className="p-1 rounded text-rose-400 hover:bg-white/10 cursor-pointer"
                  title="Hapus"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
