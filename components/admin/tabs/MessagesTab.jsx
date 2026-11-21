'use client';

import { MessageSquare, Trash2 } from 'lucide-react';

export default function MessagesTab({
  messages = [],
  onToggleRead,
  onDelete
}) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold font-heading text-white">Pesan Masuk (Kontak Form)</h2>
        <p className="text-xs text-gray-400">Pesan dari pengunjung yang tersimpan di tabel messages MySQL</p>
      </div>

      {messages.length === 0 ? (
        <div className="bg-[#0b081e] p-12 text-center rounded-3xl border border-purple-500/20 text-gray-400">
          <MessageSquare className="w-10 h-10 mx-auto mb-3 text-purple-400/50" />
          <p className="text-sm">Belum ada pesan masuk dari form kontak.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`bg-[#0b081e] p-5 rounded-2xl border transition-all ${
                m.is_read
                  ? 'border-purple-900/20 opacity-75'
                  : 'border-purple-500/50 shadow-md shadow-purple-950/30'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  {!m.is_read && (
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                  )}
                  <h4 className="font-bold text-white text-sm sm:text-base">{m.name}</h4>
                  <span className="text-xs text-gray-400">&lt;{m.email}&gt;</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>{new Date(m.created_at).toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="text-xs font-semibold text-purple-300 mb-2">
                Subjek: {m.subject}
              </div>

              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed bg-[#130f2e] p-3 rounded-xl border border-purple-500/20 mb-4">
                {m.message}
              </p>

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => onToggleRead(m.id, m.is_read)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-gray-300 cursor-pointer"
                >
                  {m.is_read ? 'Tandai Belum Dibaca' : 'Tandai Sudah Dibaca'}
                </button>
                <a
                  href={`mailto:${m.email}?subject=Balasan: ${encodeURIComponent(m.subject)}`}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-900/40 text-purple-200 border border-purple-500/30"
                >
                  Balas via Email
                </a>
                <button
                  onClick={() => onDelete(m.id)}
                  className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40 cursor-pointer"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
