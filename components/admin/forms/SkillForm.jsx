'use client';

import { Upload, Code } from 'lucide-react';
import { iconMap, isImageIcon } from '@/components/Skills';

export default function SkillForm({
  item,
  setItem,
  onSubmit,
  onClose,
  onUploadFile,
  uploadingImage
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 scrollbar-thin scrollbar-thumb-purple-900/40">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-300 mb-1">Kategori</label>
            <select
              value={item.category || 'Frontend'}
              onChange={(e) => setItem({ ...item, category: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
            >
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Languages">Languages</option>
              <option value="Tools">Tools</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-300 mb-1">Tingkat Kemahiran</label>
            <select
              value={item.level || 'Advanced'}
              onChange={(e) => setItem({ ...item, level: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
            >
              <option value="Advanced">Advanced</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Beginner">Beginner</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-300 mb-1">Nama Skill</label>
          <input
            type="text"
            required
            value={item.name || ''}
            onChange={(e) => setItem({ ...item, name: e.target.value })}
            placeholder="Contoh: Next.js"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
          />
        </div>

        {/* ICON & IMAGE UPLOAD CUSTOMIZER */}
        <div>
          <label className="block text-xs text-gray-300 mb-1">Icon / Logo Gambar</label>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-[#140f33] border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 overflow-hidden">
              {item.icon && isImageIcon(item.icon) ? (
                <img src={item.icon} alt="preview" className="w-7 h-7 object-contain" />
              ) : (
                (() => {
                  const PreIcon = iconMap[item.icon] || Code;
                  return <PreIcon className="w-6 h-6 text-purple-400" />;
                })()
              )}
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={item.icon || 'Code'}
                onChange={(e) => setItem({ ...item, icon: e.target.value })}
                placeholder="Nama icon (cth: Code, Zap) atau path gambar /assets/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400 font-mono"
              />
            </div>
          </div>

          {/* Upload File Mandiri (JPG, PNG, SVG) */}
          <div className="p-3 rounded-xl bg-[#120e2e] border border-purple-500/20 mb-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-purple-300">
                Upload Mandiri Logo/Gambar (JPG, PNG, SVG):
              </span>
              {uploadingImage && (
                <span className="text-[10px] text-purple-400 animate-pulse">
                  Mengunggah ke assets...
                </span>
              )}
            </div>
            <label className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-lg border border-dashed border-purple-400/40 hover:border-purple-400 hover:bg-purple-950/40 text-purple-200 text-xs font-medium cursor-pointer transition-all">
              <Upload className="w-4 h-4 text-purple-400" />
              <span>Pilih File Gambar dari Komputer (JPG/PNG/SVG)</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="hidden"
                onChange={(e) => onUploadFile(e, (url) => setItem({ ...item, icon: url }), 'skills')}
              />
            </label>
          </div>

          {/* Pilihan Cepat Icon Bawaan */}
          <div>
            <span className="block text-[11px] text-gray-400 mb-1.5">Atau pilih icon standar bawaan:</span>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-[#120e2e] rounded-xl border border-purple-500/20 scrollbar-thin scrollbar-thumb-purple-900/40">
              {[
                { name: 'Code', label: 'HTML (<>)' },
                { name: 'Palette', label: 'CSS' },
                { name: 'FileCode', label: 'SASS' },
                { name: 'Zap', label: 'JavaScript' },
                { name: 'Atom', label: 'React JS' },
                { name: 'Globe', label: 'Next JS' },
                { name: 'Wind', label: 'Tailwind CSS' },
                { name: 'Layout', label: 'Bootstrap' },
                { name: 'Server', label: 'Node JS' },
                { name: 'Cpu', label: 'Express JS' },
                { name: 'Database', label: 'MySQL' },
                { name: 'HardDrive', label: 'SQLite' },
                { name: 'Layers', label: 'Laravel' },
                { name: 'Flame', label: 'Firebase' },
                { name: 'FileCode2', label: 'PHP' },
                { name: 'Terminal', label: 'Python' },
                { name: 'GitBranch', label: 'Git' },
                { name: 'Github', label: 'GitHub' },
                { name: 'Laptop', label: 'VS Code' },
                { name: 'Send', label: 'Postman' },
                { name: 'Triangle', label: 'Vercel' },
                { name: 'Figma', label: 'Figma' }
              ].map((ic) => {
                const IconComp = iconMap[ic.name] || Code;
                const isSelected = item.icon === ic.name;
                return (
                  <button
                    type="button"
                    key={ic.name}
                    onClick={() => setItem({ ...item, icon: ic.name })}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-600 text-white font-semibold shadow-md'
                        : 'bg-white/5 hover:bg-white/10 text-gray-300'
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                    <span>{ic.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
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
          Simpan Skill
        </button>
      </div>
    </form>
  );
}
