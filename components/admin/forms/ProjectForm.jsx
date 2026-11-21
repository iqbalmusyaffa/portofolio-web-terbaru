'use client';

import { Upload } from 'lucide-react';

export default function ProjectForm({
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
          <label className="block text-xs text-gray-300 mb-1">Judul Proyek</label>
          <input
            type="text"
            required
            value={item.title || ''}
            onChange={(e) => setItem({ ...item, title: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-300 mb-1">Deskripsi</label>
          <textarea
            rows={3}
            value={item.description || ''}
            onChange={(e) => setItem({ ...item, description: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
          />
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
        <div>
          <label className="block text-xs text-gray-300 mb-1">Tags (pisahkan dengan koma)</label>
          <input
            type="text"
            value={typeof item.tags === 'string' ? item.tags : JSON.stringify(item.tags || [])}
            onChange={(e) => setItem({ ...item, tags: e.target.value })}
            placeholder="Next.js, Tailwind, MySQL"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
          />
        </div>
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
    </form>
  );
}
