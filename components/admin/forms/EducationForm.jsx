'use client';

export default function EducationForm({
  item,
  setItem,
  onSubmit,
  onClose
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 scrollbar-thin scrollbar-thumb-purple-900/40">
        <div>
          <label className="block text-xs text-gray-300 mb-1">Institusi / Sekolah</label>
          <input
            type="text"
            required
            value={item.school || ''}
            onChange={(e) => setItem({ ...item, school: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-300 mb-1">Jurusan / Jenjang</label>
          <input
            type="text"
            required
            value={item.degree || ''}
            onChange={(e) => setItem({ ...item, degree: e.target.value })}
            placeholder="Sarjana S1 Sistem Informasi"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-300 mb-1">Tahun Periode</label>
            <input
              type="text"
              required
              value={item.period || ''}
              onChange={(e) => setItem({ ...item, period: e.target.value })}
              placeholder="2021 - 2025"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-300 mb-1">Nilai / IPK</label>
            <input
              type="text"
              value={item.grade || ''}
              onChange={(e) => setItem({ ...item, grade: e.target.value })}
              placeholder="IPK: 3.4 / 4.0"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-300 mb-1">Deskripsi & Kegiatan</label>
          <textarea
            rows={3}
            value={item.description || ''}
            onChange={(e) => setItem({ ...item, description: e.target.value })}
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
          Simpan Pendidikan
        </button>
      </div>
    </form>
  );
}
