'use client';

import { ShieldCheck, Mail, User, Lock } from 'lucide-react';

export default function SecurityTab({
  credForm,
  setCredForm,
  credLoading,
  onUpdateCredentials
}) {
  return (
    <div className="space-y-6 animate-fadeIn max-w-2xl">
      <div>
        <h2 className="text-xl font-bold font-heading text-white">Keamanan Akun &amp; Kredensial</h2>
        <p className="text-xs text-gray-400">
          Ubah username, email login, dan password akun admin. Anda dapat menggunakan username atau email untuk masuk ke panel admin.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-start gap-3 text-xs text-purple-200">
        <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-semibold text-white">Login Fleksibel:</span> Anda dapat masuk ke panel admin menggunakan <strong>Username</strong> atau <strong>Email</strong> yang terdaftar di bawah ini dengan password yang sama.
        </div>
      </div>

      <div className="bg-[#0b081e] p-6 sm:p-8 rounded-3xl border border-purple-500/30 space-y-6 shadow-xl">
        <form onSubmit={onUpdateCredentials} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-purple-400" />
              <span>Username Baru (Bisa berupa nama akun atau email)</span>
            </label>
            <input
              type="text"
              value={credForm.username || ''}
              onChange={(e) => setCredForm({ ...credForm, username: e.target.value })}
              placeholder="Contoh: iqbal atau yusa82401@gmail.com"
              className="w-full px-4 py-3 rounded-xl bg-[#140f33] border border-purple-500/30 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-400 transition-all font-mono"
            />
            <span className="text-[10px] text-gray-400 block mt-1">
              Kosongkan jika tidak ingin mengubah username yang sudah ada.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-purple-400" />
              <span>Email Login Baru (Opsional)</span>
            </label>
            <input
              type="email"
              value={credForm.email || ''}
              onChange={(e) => setCredForm({ ...credForm, email: e.target.value })}
              placeholder="Contoh: yusa82401@gmail.com"
              className="w-full px-4 py-3 rounded-xl bg-[#140f33] border border-purple-500/30 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-400 transition-all font-mono"
            />
            <span className="text-[10px] text-gray-400 block mt-1">
              Jika diisi, Anda bisa masuk menggunakan alamat email ini selain username.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-purple-400" />
              <span>Password Baru (Minimal 6 karakter) *</span>
            </label>
            <input
              type="password"
              required
              value={credForm.newPassword || ''}
              onChange={(e) => setCredForm({ ...credForm, newPassword: e.target.value })}
              placeholder="Masukkan password baru Anda"
              className="w-full px-4 py-3 rounded-xl bg-[#140f33] border border-purple-500/30 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-purple-400" />
              <span>Ulangi Password Baru *</span>
            </label>
            <input
              type="password"
              required
              value={credForm.confirmPassword || ''}
              onChange={(e) => setCredForm({ ...credForm, confirmPassword: e.target.value })}
              placeholder="Ulangi password baru Anda"
              className="w-full px-4 py-3 rounded-xl bg-[#140f33] border border-purple-500/30 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-400 transition-all"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={credLoading}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#8245ec] via-[#9333ea] to-[#a855f7] hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-purple-600/40 transition-all cursor-pointer disabled:opacity-50"
            >
              {credLoading ? 'Menyimpan...' : 'Perbarui Kredensial Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
