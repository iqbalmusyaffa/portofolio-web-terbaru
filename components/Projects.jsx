'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Github, Star, Info, X } from 'lucide-react';

export default function Projects({ projects }) {
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [selectedProject, setSelectedProject] = useState(null);

  // Clean UX: Tutup modal dengan ESC & kunci body scroll
  useEffect(() => {
    if (!selectedProject) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedProject]);

  const filters = ['Semua', 'Fullstack', 'Frontend', 'Backend'];

  const filteredProjects = (projects || []).filter((p) => {
    if (activeFilter === 'Semua') return true;
    
    let tags = [];
    try {
      tags = typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags;
    } catch (e) {
      tags = (p.tags || '').split(',').map((t) => t.trim());
    }

    const tagsJoined = tags.join(' ').toLowerCase();
    const titleAndDesc = `${p.title} ${p.description}`.toLowerCase();
    
    if (activeFilter === 'Frontend') {
      return tagsJoined.includes('react') || tagsJoined.includes('frontend') || tagsJoined.includes('tailwind') || tagsJoined.includes('bootstrap');
    }
    if (activeFilter === 'Backend') {
      return tagsJoined.includes('node') || tagsJoined.includes('laravel') || tagsJoined.includes('mysql') || tagsJoined.includes('api') || tagsJoined.includes('backend');
    }
    if (activeFilter === 'Fullstack') {
      return (
        (tagsJoined.includes('next') || tagsJoined.includes('laravel') || tagsJoined.includes('fullstack') || titleAndDesc.includes('end-to-end'))
      );
    }
    return true;
  });

  return (
    <section id="projects" className="py-20 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-[11px] font-semibold tracking-widest uppercase text-purple-600 dark:text-purple-400 mb-2">
            Portofolio Karya
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading tracking-tight text-gray-900 dark:text-white">
            Proyek Pilihan & Rekayasa Web
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-3 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Karya dan proyek aplikasi nyata yang telah saya rancang dan kembangkan dengan standar arsitektur modern.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeFilter === f
                  ? 'bg-gradient-to-r from-[#8245ec] to-[#a855f7] text-white shadow-md shadow-purple-900/30'
                  : 'bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            let tags = [];
            if (project.tags) {
              try {
                tags = typeof project.tags === 'string' ? JSON.parse(project.tags) : project.tags;
              } catch (e) {
                tags = project.tags.split(',').map((t) => t.trim());
              }
            }

            return (
              <div
                key={project.id}
                className="glass-card rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 hover:border-purple-400 dark:hover:border-purple-500/40 flex flex-col justify-between group transition-all duration-300 shadow-sm hover:shadow-xl"
              >
                {/* Project Image */}
                <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-[#0c0822]">
                  <img
                    src={project.image_url || 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80'}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 dark:from-[#050414] via-transparent to-transparent" />

                  {project.featured ? (
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide text-amber-200 bg-black/70 border border-amber-500/40 backdrop-blur-md flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      Featured
                    </span>
                  ) : null}
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold font-heading text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-[#a78bfa] transition-colors mb-2 line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4 line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  <div>
                    {/* Tags */}
                    {tags && tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {tags.slice(0, 4).map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/20"
                          >
                            {tag}
                          </span>
                        ))}
                        {tags.length > 4 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/5 text-gray-500">
                            +{tags.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-white/10">
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#8245ec] to-[#9333ea] hover:from-[#7335de] hover:to-[#8245ec] shadow-sm hover:shadow-purple-600/30 transition-all"
                        >
                          <span>Live Demo</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}

                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 transition-all"
                          title="Lihat Source Code GitHub"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>Code</span>
                        </a>
                      )}

                      <button
                        onClick={() => setSelectedProject(project)}
                        className="p-2 rounded-xl text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-300 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 transition-all"
                        title="Detail Proyek"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 text-gray-500 text-sm">
            Tidak ada proyek yang sesuai dengan filter ini.
          </div>
        )}
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <div
          onClick={() => setSelectedProject(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-panel max-w-xl w-full rounded-2xl sm:rounded-3xl border border-purple-300 dark:border-purple-500/40 p-5 sm:p-7 relative shadow-2xl bg-white dark:bg-[#0c0822] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-900/40"
          >
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20 transition-all cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="h-48 sm:h-56 rounded-2xl overflow-hidden mb-5 bg-gray-100 dark:bg-[#0c0822]">
              <img
                src={selectedProject.image_url}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="text-xl sm:text-2xl font-bold font-heading text-gray-900 dark:text-white mb-2 pr-8">
              {selectedProject.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              {selectedProject.description}
            </p>

            <div className="flex flex-wrap gap-3">
              {selectedProject.live_url && (
                <a
                  href={selectedProject.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#8245ec] to-[#9333ea] shadow-md shadow-purple-900/30 hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  <span>Buka Aplikasi</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {selectedProject.github_url && (
                <a
                  href={selectedProject.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 border border-gray-200 dark:border-white/10 hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub Repository</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
