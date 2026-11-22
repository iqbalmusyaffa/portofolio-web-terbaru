'use client';

import { CheckCircle2 } from 'lucide-react';
import { iconMap, defaultSkillIconMap, isImageIcon } from '@/lib/constants/skills';
import { useLanguage } from './LanguageProvider';

// Re-export constants for backwards compatibility
export { iconMap, defaultSkillIconMap, isImageIcon };

export default function Skills({ skills }) {
  const { t } = useLanguage();
  const categories = ['Frontend', 'Backend', 'Languages', 'Tools'];
  
  const groupedSkills = categories.reduce((acc, cat) => {
    acc[cat] = (skills || []).filter(
      (s) => s.category?.toLowerCase() === cat.toLowerCase()
    );
    return acc;
  }, {});

  return (
    <section id="skills" className="py-20 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-[11px] font-semibold tracking-widest uppercase text-purple-600 dark:text-purple-400 mb-2">
            {t('skills.eyebrow')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading tracking-tight text-gray-900 dark:text-white">
            {t('skills.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-3 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {t('skills.desc')}
          </p>
        </div>

        {/* Skills Cards Grid - Sesuai mockup 4 kolom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => {
            const list = groupedSkills[cat] || [];
            
            return (
              <div
                key={cat}
                className="bg-[#0b081e] p-6 rounded-3xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-purple-500/20">
                    <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#d946ef] shrink-0" />
                      <span>{cat}</span>
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1b1444] text-purple-300 border border-purple-500/30 font-semibold">
                      {list.length} item
                    </span>
                  </div>

                  {/* Skills badges */}
                  <div className="flex flex-wrap gap-2.5">
                    {list.map((skill) => {
                      const hasImage = isImageIcon(skill.icon);
                      const normName = (skill.name || '').toLowerCase().trim();
                      const IconComponent = iconMap[skill.icon] || defaultSkillIconMap[normName] || Code;

                      return (
                        <div
                          key={skill.id || skill.name}
                          className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-[#140f33] hover:bg-[#20174e] border border-purple-500/20 hover:border-purple-400/50 transition-all duration-200 cursor-default shadow-sm"
                          title={`${skill.name} - ${skill.level || 'Advanced'}`}
                        >
                          {hasImage ? (
                            <img
                              src={skill.icon}
                              alt={skill.name}
                              className="w-4 h-4 object-contain group-hover:scale-110 transition-transform shrink-0"
                            />
                          ) : (
                            <IconComponent className="w-4 h-4 text-purple-400 group-hover:text-[#e879f9] group-hover:scale-110 transition-transform shrink-0" />
                          )}
                          <span className="text-xs font-semibold text-gray-200 group-hover:text-white">
                            {skill.name}
                          </span>
                        </div>
                      );
                    })}
                    {list.length === 0 && (
                      <p className="text-xs text-gray-400 italic py-2">Belum ada skill ditambahkan</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
