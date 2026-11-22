'use client';

import { Calendar, MapPin, Building2 } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

export default function Experience({ experiences }) {
  const { t } = useLanguage();

  return (
    <section id="experience" className="py-20 px-4 relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-[11px] font-semibold tracking-widest uppercase text-purple-600 dark:text-purple-400 mb-2">
            {t('experience.eyebrow')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading tracking-tight text-gray-900 dark:text-white">
            {t('experience.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-3 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {t('experience.desc')}
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-purple-300 dark:border-purple-900/50 space-y-12">
          {(experiences || []).map((exp, index) => {
            let techList = [];
            if (exp.technologies) {
              try {
                techList = typeof exp.technologies === 'string' ? JSON.parse(exp.technologies) : exp.technologies;
              } catch (e) {
                techList = exp.technologies.split(',').map((t) => t.trim());
              }
            }

            return (
              <div key={exp.id || index} className="relative group">
                {/* Timeline node */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-white dark:bg-[#030014] border-2 border-purple-500 flex items-center justify-center group-hover:scale-125 group-hover:border-[#e879f9] transition-all shadow-md shadow-purple-500/30">
                  <span className="w-2 h-2 rounded-full bg-[#8245ec] group-hover:bg-[#e879f9]" />
                </div>

                {/* Card */}
                <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-white/10 group-hover:border-purple-400 dark:group-hover:border-purple-500/40 transition-all duration-300 shadow-md dark:shadow-xl dark:shadow-black/30">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <h3 className="text-lg sm:text-xl font-bold font-heading text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-[#a78bfa] transition-colors">
                      {exp.role}
                    </h3>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-500/30 shrink-0 w-fit">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{exp.period}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    <Building2 className="w-4 h-4 text-[#8245ec]" />
                    <span>{exp.company}</span>
                    {exp.location && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        • <MapPin className="w-3 h-3" /> {exp.location}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-5">
                    {exp.description}
                  </p>

                  {/* Tech stack tags */}
                  {techList && techList.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-white/5">
                      {techList.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg hover:border-purple-400/40 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
