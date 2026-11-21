'use client';

import { Upload } from 'lucide-react';

export default function CertificateForm({
  item,
  setItem,
  onSubmit,
  onClose,
  onUploadFile
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 scrollbar-thin scrollbar-thumb-purple-900/40">
        <div>
          <label className="block text-xs text-gray-300 mb-1">Nama Sertifikat</label>
          <input
            type="text"
            required
            value={item.title || ''}
            onChange={(e) => setItem({ ...item, title: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-300 mb-1">Penerbit (Issuer)</label>
          <input
            type="text"
            required
            value={item.issuer || ''}
            onChange={(e) => setItem({ ...item, issuer: e.target.value })}
            placeholder="Dicoding Indonesia"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-300 mb-1">Tanggal Terbit</label>
          <input
            type="text"
            value={item.issue_date || ''}
            onChange={(e) => setItem({ ...item, issue_date: e.target.value })}
            placeholder="25 April 2025"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-gray-300">URL Kredensial / PDF Sertifikat</label>
            <label className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer">
              <Upload className="w-3 h-3" />
              <span>Upload (PDF/JPG/PNG)</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,application/pdf"
                className="hidden"
                onChange={(e) => onUploadFile(e, (url) => setItem({ ...item, credential_url: url }))}
              />
            </label>
          </div>
          <input
            type="text"
            value={item.credential_url || ''}
            onChange={(e) => setItem({ ...item, credential_url: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
          />
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
          Simpan Sertifikat
        </button>
      </div>
    </form>
  );
}
