'use client';

export default function SecurityTab({
  credForm,
  setCredForm,
  credLoading,
  onUpdateCredentials
}) {
  return (
    <div className="space-y-6 animate-fadeIn max-w-2xl">
      <div>
        <h2 className="text-xl font-bold font-heading text-white">Keamanan Akun & Kredensial</h2>
        <p className="text-xs text-gray-400">
          Ubah username dan password akun admin. Password disimpan dalam format hash kriptografis PBKDF2-SHA512 di database MySQL (tidak pernah disimpan dalam bentuk teks biasa).
        </p>
      </div>

      <div className="bg-[#0b081e] p-6 sm:p-8 rounded-3xl border border-purple-500/30 space-y-6 shadow-xl">
        <form onSubmit={onUpdateCredentials} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Username Baru (Opsional, kosongkan jika tidak ingin mengubah username)
            </label>
            <input
              type="text"
              value={credForm.username}
              onChange={(e) => setCredForm({ ...credForm, username: e.target.value })}
              placeholder="Contoh: iqbal"
              className="w-full px-4 py-3 rounded-xl bg-[#140f33] border border-purple-500/30 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Password Baru (Minimal 6 karakter) *
            </label>
            <input
              type="password"
              required
              value={credForm.newPassword}
              onChange={(e) => setCredForm({ ...credForm, newPassword: e.target.value })}
              placeholder="Masukkan password baru Anda"
              className="w-full px-4 py-3 rounded-xl bg-[#140f33] border border-purple-500/30 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Ulangi Password Baru *
            </label>
            <input
              type="password"
              required
              value={credForm.confirmPassword}
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
