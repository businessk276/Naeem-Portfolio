import { useState } from 'react';
import { motion } from 'motion/react';
import { Project } from '../types';
import { ArrowUpRight, ExternalLink, Github, Youtube, Eye } from 'lucide-react';

interface FeaturedWorkProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export default function FeaturedWork({ projects, onSelectProject }: FeaturedWorkProps) {
  const [activeFilter, setActiveFilter] = useState('ALL WORK');

  const filterTabs = ['ALL WORK', 'HARDWARE & IT', 'NETWORKING', 'WEB DEV', 'CCTV'];

  const filteredProjects = projects.filter((p) => {
    if (activeFilter === 'ALL WORK') return true;
    if (activeFilter === 'HARDWARE & IT') return p.category.includes('Hardware') || p.category.includes('Diagnostic');
    if (activeFilter === 'NETWORKING') return p.category.includes('Network') || p.category.includes('Cisco');
    if (activeFilter === 'WEB DEV') return p.category.includes('Web') || p.category.includes('Applications');
    if (activeFilter === 'CCTV') return p.category.includes('CCTV') || p.category.includes('Security');
    return true;
  });

  return (
    <section id="work" className="py-20 md:py-28 bg-[#FAFAFA] dark:bg-[#0E0E0E] border-b border-neutral-200/80 dark:border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header: • FEATURED WORK on left, Category Tabs on right */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF3B30]" />
            <span className="text-xs font-black uppercase tracking-[0.25em] text-neutral-900 dark:text-neutral-100">
              FEATURED WORK
            </span>
          </div>

          {/* Filter Tabs matching reference: ALL WORK, BRANDING, CAMPAIGNS, DIGITAL, EXPERIENCES */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-6">
            {filterTabs.map((tab) => (
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
                  <motion.div
                    layoutId="activeWorkTab"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#FF3B30]"
                  />
                )}
              </button>
            ))}
          </div>

        </div>

        {/* 4-Card Grid matching reference layout & colorful theme variations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProjects.slice(0, 4).map((project, idx) => {
            // Distinct Colorful Themes for each card
            const cardThemes = [
              {
                bg: 'bg-gradient-to-br from-[#0F172A] via-[#0C4A6E] to-[#0369A1]',
                badge: 'bg-sky-500/20 text-sky-200 border border-sky-400/30',
                accentText: 'text-sky-300',
                btnHover: 'group-hover:text-sky-600',
              },
              {
                bg: 'bg-gradient-to-br from-[#FF3B30] via-[#E11D48] to-[#BE123C]',
                badge: 'bg-white/20 text-white border border-white/30',
                accentText: 'text-red-100',
                btnHover: 'group-hover:text-[#FF3B30]',
              },
              {
                bg: 'bg-gradient-to-br from-[#064E3B] via-[#0F172A] to-[#047857]',
                badge: 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30',
                accentText: 'text-emerald-300',
                btnHover: 'group-hover:text-emerald-600',
              },
              {
                bg: 'bg-gradient-to-br from-[#2E1065] via-[#1E1B4B] to-[#4F46E5]',
                badge: 'bg-purple-500/20 text-purple-200 border border-purple-400/30',
                accentText: 'text-purple-300',
                btnHover: 'group-hover:text-purple-600',
              },
            ];

            const theme = cardThemes[idx % cardThemes.length];

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
                className="group cursor-pointer flex flex-col"
                onClick={() => onSelectProject(project)}
              >
                {/* Visual Card Box */}
                <div
                  className={`relative w-full aspect-[4/5] rounded-xl overflow-hidden mb-4 shadow-md group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-1.5 flex items-center justify-center p-6 text-white ${theme.bg}`}
                >
                  {/* Subtle Background Photo for photo cards */}
                  {project.thumbnail_url && (
                    <img
                      src={project.thumbnail_url}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700 mix-blend-overlay"
                    />
                  )}

                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

                  {/* Top category / badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`text-[9px] font-extrabold uppercase tracking-[0.2em] px-2.5 py-1 rounded-md backdrop-blur-md ${theme.badge}`}>
                      {project.category}
                    </span>
                  </div>

                  {/* Center Bold Typography Display matching reference cards */}
                  <div className="relative z-10 text-center px-4">
                    {idx === 0 && (
                      <div>
                        <span className={`text-[10px] tracking-[0.3em] uppercase block mb-1 font-bold ${theme.accentText}`}>SYSTEM ARCHITECTURE</span>
                        <h4 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter leading-tight text-white drop-shadow-md">
                          NORTH <br /> EDGE.
                        </h4>
                      </div>
                    )}
                    {idx === 1 && (
                      <div>
                        <h4 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none text-white drop-shadow-md">
                          BOLD <br />
                          BY NETWORK
                        </h4>
                        <span className={`text-[10px] tracking-[0.2em] uppercase block mt-2 font-bold ${theme.accentText}`}>CISCO PACKET TRACER</span>
                      </div>
                    )}
                    {idx === 2 && (
                      <div>
                        <span className={`text-xs font-semibold tracking-[0.2em] uppercase block mb-1 ${theme.accentText}`}>RELIABILITY OVER</span>
                        <h4 className="text-xl sm:text-2xl font-black uppercase tracking-tight leading-tight text-white drop-shadow-md">
                          DOWNTIME
                        </h4>
                      </div>
                    )}
                    {idx === 3 && (
                      <div>
                        <h4 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter text-white drop-shadow-md">
                          KION.
                        </h4>
                        <span className={`text-[10px] tracking-[0.25em] uppercase block mt-1 font-bold ${theme.accentText}`}>IT DIAGNOSTICS</span>
                      </div>
                    )}
                  </div>

                  {/* Hover Inspect Overlay */}
                  <div className="absolute bottom-4 right-4 z-10 w-9 h-9 rounded-full bg-white text-neutral-950 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Card Footer: Title & Subtitle matching reference */}
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
