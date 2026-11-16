'use client';

import { Code2, Award, Briefcase, GraduationCap, CheckCircle2 } from 'lucide-react';

export default function About({ profile, projectCount, certCount, expCount }) {
  const stats = [
    { label: 'Proyek Selesai', value: `${projectCount || 6}+`, icon: Code2, desc: 'Web & Backend' },
    { label: 'Sertifikasi', value: `${certCount || 17}+`, icon: Award, desc: 'Dicoding & Komdigi' },
    { label: 'Pengalaman', value: `${expCount || 2}+`, icon: Briefcase, desc: 'Intern & Bootcamp' },
    { label: 'IPK Telkom', value: profile?.gpa_score || '3.40', icon: GraduationCap, desc: 'S1 Sistem Informasi' },
  ];

  let highlights = [
    'Pengembangan web modern end-to-end (Frontend & Backend)',
    'Arsitektur RESTful API performa tinggi & keamanan JWT',
    'Optimasi database relasional MySQL & query efisien',
    'Pengalaman kerja nyata di industri dan tim kolaboratif',
    'Penerapan clean code, reusable components & SEO friendly'
  ];

  if (profile?.about_highlights) {
    try {
      const parsed = typeof profile.about_highlights === 'string'
        ? JSON.parse(profile.about_highlights)
        : profile.about_highlights;
      if (Array.isArray(parsed) && parsed.length > 0) {
        highlights = parsed;
      }
    } catch (e) {}
  }

  return (
    <section id="about" className="py-20 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] via-[#c026d3] to-[#0284c7] dark:from-[#a78bfa] dark:via-[#e879f9] dark:to-[#38bdf8]">
            ABOUT ME
          </h2>
          <div className="w-20 h-1 bg-[#8245ec] mx-auto mt-3 rounded-full" />
          <p className="text-gray-600 dark:text-gray-400 mt-4 text-sm sm:text-base max-w-2xl mx-auto">
            Mengenal lebih dekat latar belakang, keahlian, dan komitmen profesional saya dalam rekayasa perangkat lunak.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="glass-card p-6 rounded-2xl flex flex-col items-center text-center group"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/40 border border-purple-200 dark:border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-[#a78bfa] mb-3 group-hover:scale-110 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-heading text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {stat.label}
                </div>
                <div className="text-[11px] text-gray-500 dark:text-gray-500 mt-0.5">
                  {stat.desc}
                </div>
              </div>
            );
          })}
        </div>

        {/* Story & Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-white/10 shadow-lg dark:shadow-none">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white font-heading mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8245ec]" />
              {profile?.about_title || 'Dedikasi untuk Solusi Digital Berkualitas'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
              {profile?.bio || 'Saya adalah lulusan S1 Sistem Informasi Universitas Telkom Surabaya yang memiliki passion mendalam pada perancangan dan pembangunan aplikasi web yang scalable, responsif, dan mudah digunakan.'}
            </p>
            {profile?.about_bio_2 && (
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed mb-6">
                {profile.about_bio_2}
              </p>
            )}

            <div className="space-y-2.5 mt-4">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-[#a78bfa] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="glass-card p-6 rounded-2xl border border-purple-200 dark:border-purple-500/20">
              <div className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-[#a78bfa] mb-1">
                Lokasi & Ketersediaan
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {profile?.location || 'Surabaya, Jawa Timur, Indonesia'}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                {profile?.availability_status || 'Terbuka untuk kesempatan kerja Full-time, Remote, Hybrid, maupun On-site di Jakarta, Surabaya, Bandung, Tangerang, Yogyakarta, Semarang, Sidoarjo, Malang, dan Banyuwangi.'}
              </p>

              {/* Badges Kota Pilihan */}
              <div className="pt-3 border-t border-purple-200 dark:border-purple-900/30">
                <div className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  Siap Bekerja & Relokasi di:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Jakarta',
                    'Surabaya',
                    'Bandung',
                    'Tangerang',
                    'Yogyakarta',
                    'Semarang',
                    'Sidoarjo',
                    'Malang',
                    'Banyuwangi',
                    'Remote (WFH)'
                  ].map((city, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30"
                    >
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-sky-200 dark:border-cyan-500/20">
              <div className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-cyan-400 mb-1">
                Filosofi Kode
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {profile?.code_philosophy_title || 'Clean, Fast & Impactful'}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {profile?.code_philosophy_desc || 'Fokus utama saya bukan sekadar menulis baris kode, melainkan menciptakan sistem yang stabil, mudah dirawat, dan memberikan dampak positif bagi para penggunanya.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
