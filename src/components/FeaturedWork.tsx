import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Project } from '../types';
import { ArrowUpRight } from 'lucide-react';
import { enterFrom } from '../lib/motion';

interface FeaturedWorkProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export default function FeaturedWork({ projects, onSelectProject }: FeaturedWorkProps) {
  const reduced = useReducedMotion();
  const published = projects.filter((p) => p.status === 'published');
  const categories = useMemo(() => ['ALL WORK', ...Array.from(new Set(published.map((p) => p.category.toUpperCase())))], [published]);
  const [activeFilter, setActiveFilter] = useState('ALL WORK');

  const filteredProjects = published.filter((p) => {
    if (activeFilter === 'ALL WORK') return true;
    return p.category.toUpperCase() === activeFilter;
  });

  return (
    <section id="work" className="py-20 md:py-28 bg-[#FAFAFA] dark:bg-[#0E0E0E] border-b border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF3B30]" />
            <span className="text-xs font-black uppercase tracking-[0.25em] text-neutral-900 dark:text-neutral-100">
              FEATURED WORK
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-6">
            {categories.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`text-[11px] font-extrabold tracking-[0.18em] uppercase transition-colors relative py-1 ${
                  activeFilter === tab
                    ? 'text-neutral-950 dark:text-white font-black'
                    : 'text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                {tab}
                {activeFilter === tab && (
                  <motion.div layoutId="activeWorkTab" className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#FF3B30]" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProjects.map((project, idx) => {
            const cardThemes = [
              { bg: 'bg-gradient-to-br from-[#0F172A] via-[#0C4A6E] to-[#0369A1]', badge: 'bg-sky-500/20 text-sky-200 border border-sky-400/30', accentText: 'text-sky-300' },
              { bg: 'bg-gradient-to-br from-[#FF3B30] via-[#E11D48] to-[#BE123C]', badge: 'bg-white/20 text-white border border-white/30', accentText: 'text-red-100' },
              { bg: 'bg-gradient-to-br from-[#064E3B] via-[#0F172A] to-[#047857]', badge: 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30', accentText: 'text-emerald-300' },
              { bg: 'bg-gradient-to-br from-[#2E1065] via-[#1E1B4B] to-[#4F46E5]', badge: 'bg-purple-500/20 text-purple-200 border border-purple-400/30', accentText: 'text-purple-300' },
            ];
            const theme = cardThemes[idx % cardThemes.length];
            const titleLines = project.title.split(' ');

            return (
              <motion.div
                key={project.id}
                {...enterFrom(idx % 2 === 0 ? 'up' : 'right', reduced, idx * 0.12)}
                className="group cursor-pointer flex flex-col"
                onClick={() => onSelectProject(project)}
              >
                <div className={`relative w-full aspect-[4/5] rounded-xl overflow-hidden mb-4 shadow-md group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-1.5 flex items-center justify-center p-6 text-white ${theme.bg}`}>
                  {project.thumbnail_url && (
                    <img src={project.thumbnail_url} alt={project.title} className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700 mix-blend-overlay" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`text-[9px] font-extrabold uppercase tracking-[0.2em] px-2.5 py-1 rounded-md backdrop-blur-md ${theme.badge}`}>
                      {project.category}
                    </span>
                  </div>
                  <div className="relative z-10 text-center px-4">
                    <span className={`text-[10px] tracking-[0.3em] uppercase block mb-2 font-bold ${theme.accentText}`}>
                      {(project.technologies || []).slice(0, 2).join(' · ') || project.category}
                    </span>
                    <h4 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter leading-tight text-white drop-shadow-md">
                      {titleLines.slice(0, Math.ceil(titleLines.length / 2)).join(' ')}
                      <br />
                      {titleLines.slice(Math.ceil(titleLines.length / 2)).join(' ')}
                    </h4>
                  </div>
                  <div className="absolute bottom-4 right-4 z-10 w-9 h-9 rounded-full bg-white text-neutral-950 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-black uppercase tracking-[0.14em] text-neutral-950 dark:text-white group-hover:text-[#FF3B30] transition-colors">
                    {project.title}
                  </h4>
                  <p className="text-[11px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-medium">
                    {project.category}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
