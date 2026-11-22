'use client';

import { Mail, MapPin, Send, CheckCircle2, AlertCircle, Loader2, MessageSquare } from 'lucide-react';
import { useContactForm } from '@/hooks/useContactForm';
import { useLanguage } from './LanguageProvider';

export default function Contact({ profile }) {
  const { t } = useLanguage();
  const { formData, setFormData, loading, status, handleSubmit } = useContactForm();

  return (
    <section id="contact" className="py-20 px-4 relative z-10">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-[11px] font-semibold tracking-widest uppercase text-purple-600 dark:text-purple-400 mb-2">
            {t('contact.eyebrow')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading tracking-tight text-gray-900 dark:text-white">
            {t('contact.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-3 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {t('contact.desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-gray-200 dark:border-white/10 space-y-6 shadow-md dark:shadow-none">
              <h3 className="text-lg font-bold font-heading text-gray-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                {t('contact.info_title')}
              </h3>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-purple-100 dark:bg-purple-900/40 border border-purple-200 dark:border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-[#a78bfa] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</div>
                  <a
                    href={`mailto:${profile?.email || 'contact@iqbaldeveloper.my.id'}`}
                    className="text-sm font-semibold text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-[#a78bfa] transition-colors break-all"
                  >
                    {profile?.email || 'contact@iqbaldeveloper.my.id'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-sky-100 dark:bg-purple-900/40 border border-sky-200 dark:border-purple-500/30 flex items-center justify-center text-sky-600 dark:text-[#38bdf8] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lokasi</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {profile?.location || 'Surabaya, Jawa Timur, Indonesia'}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-pink-100 dark:bg-purple-900/40 border border-pink-200 dark:border-purple-500/30 flex items-center justify-center text-pink-600 dark:text-[#e879f9] shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status Respon</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    Biasanya merespon dalam 24 jam
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-white/10 shadow-xl dark:shadow-2xl">
            <h3 className="text-xl font-bold font-heading text-gray-900 dark:text-white mb-6">
              Kirim Pesan
            </h3>

            {status.message && (
              <div
                className={`p-4 rounded-2xl mb-6 text-sm flex items-start gap-3 transition-all ${
                  status.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-200'
                    : 'bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-500/40 text-rose-800 dark:text-rose-200'
                }`}
              >
                {status.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
                )}
                <span className="leading-relaxed">{status.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot field (hidden from real users, traps bots) */}
              <input
                type="text"
                name="hp_trap"
                value={formData.hp_trap}
                onChange={(e) => setFormData({ ...formData, hp_trap: e.target.value })}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    {t('contact.name_label')} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    placeholder={t('contact.name_placeholder')}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-purple-500 placeholder-gray-400 dark:placeholder-gray-500 transition-all shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    {t('contact.email_label')} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    maxLength={120}
                    placeholder={t('contact.email_placeholder')}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-purple-500 placeholder-gray-400 dark:placeholder-gray-500 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  {t('contact.subject_label')}
                </label>
                <input
                  type="text"
                  maxLength={150}
                  placeholder={t('contact.subject_placeholder')}
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-purple-500 placeholder-gray-400 dark:placeholder-gray-500 transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  {t('contact.message_label')} <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  maxLength={3000}
                  placeholder={t('contact.message_placeholder')}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-purple-500 placeholder-gray-400 dark:placeholder-gray-500 transition-all resize-none shadow-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#8245ec] via-[#9333ea] to-[#a855f7] hover:from-[#7335de] hover:to-[#9333ea] shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t('contact.sending')}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{t('contact.send')}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
