'use client';

import { GraduationCap, Calendar, MapPin, Award } from 'lucide-react';

export default function Education({ educations }) {
  return (
    <section id="education" className="py-20 px-4 relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-[11px] font-semibold tracking-widest uppercase text-purple-600 dark:text-purple-400 mb-2">
            Riwayat Pendidikan
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading tracking-tight text-gray-900 dark:text-white">
            Latar Belakang Akademik
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-3 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Fondasi akademik dan pembentukan karakter disiplin kepemimpinan yang saya tempuh.
          </p>
        </div>

        {/* Education Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(educations || []).map((edu, idx) => (
            <div
              key={edu.id || idx}
              className="glass-panel p-6 sm:p-7 rounded-3xl border border-gray-200 dark:border-white/10 hover:border-purple-400 dark:hover:border-purple-500/40 transition-all duration-300 shadow-md dark:shadow-xl dark:shadow-black/30 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-800/40 dark:to-indigo-950/60 border border-purple-200 dark:border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-[#a78bfa] group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
                      <Calendar className="w-3 h-3" />
                      {edu.period}
                    </span>
                    {edu.grade && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                        <Award className="w-3 h-3" />
                        {edu.grade}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-bold font-heading text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-[#a78bfa] transition-colors mb-1">
                  {edu.school}
                </h3>
                <div className="text-sm font-semibold text-purple-600 dark:text-purple-300/90 mb-2">
                  {edu.degree}
                </div>
                {edu.location && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <MapPin className="w-3.5 h-3.5 text-[#8245ec]" />
                    <span>{edu.location}</span>
                  </div>
                )}

                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {edu.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
