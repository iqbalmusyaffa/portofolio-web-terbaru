'use client';

import {
  Code,
  Palette,
  FileCode,
  Zap,
  Atom,
  Globe,
  Wind,
  Layout,
  Server,
  Cpu,
  Database,
  HardDrive,
  Layers,
  Flame,
  FileCode2,
  Terminal,
  GitBranch,
  Github,
  Laptop,
  Send,
  Triangle,
  Figma
} from 'lucide-react';

const iconMap = {
  Code,
  Palette,
  FileCode,
  Zap,
  Atom,
  Globe,
  Wind,
  Layout,
  Server,
  Cpu,
  Database,
  HardDrive,
  Layers,
  Flame,
  FileCode2,
  Terminal,
  GitBranch,
  Github,
  Laptop,
  Send,
  Triangle,
  Figma
};

export default function Skills({ skills }) {
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
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] via-[#c026d3] to-[#7c3aed] dark:from-[#a78bfa] dark:via-[#e879f9] dark:to-[#a78bfa] animate-gradient-x">
            SKILLS
          </h2>
          <div className="w-20 h-1 bg-[#8245ec] mx-auto mt-3 rounded-full" />
          <p className="text-gray-600 dark:text-gray-400 mt-4 text-sm sm:text-base max-w-2xl mx-auto">
            A collection of my technical skills and expertise honed through various projects and experiences
          </p>
        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const list = groupedSkills[cat] || [];
            
            return (
              <div
                key={cat}
                className="glass-panel p-6 rounded-3xl border border-gray-200 dark:border-white/10 hover:border-purple-400 dark:hover:border-purple-500/40 transition-all duration-300 shadow-md dark:shadow-lg dark:shadow-black/40 flex flex-col"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200 dark:border-white/10">
                  <h3 className="text-lg font-bold font-heading text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                    {cat}
                  </h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 font-semibold">
                    {list.length} item
                  </span>
                </div>

                {/* Skills badges */}
                <div className="flex flex-wrap gap-2.5">
                  {list.map((skill) => {
                    const IconComponent = iconMap[skill.icon] || Code;
                    return (
                      <div
                        key={skill.id || skill.name}
                        className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-purple-100 dark:hover:bg-purple-900/30 border border-gray-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-400/50 transition-all duration-200 cursor-default"
                        title={`${skill.name} - ${skill.level || 'Advanced'}`}
                      >
                        <IconComponent className="w-4 h-4 text-purple-600 dark:text-[#a78bfa] group-hover:text-purple-800 dark:group-hover:text-[#e879f9] group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 group-hover:text-purple-900 dark:group-hover:text-white">
                          {skill.name}
                        </span>
                      </div>
                    );
                  })}
                  {list.length === 0 && (
                    <p className="text-xs text-gray-500 italic py-2">Belum ada skill ditambahkan</p>
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
