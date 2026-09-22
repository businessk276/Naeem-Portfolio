import { motion, useReducedMotion } from 'motion/react';
import { Service, Skill } from '../types';
import { Code2, Target, Sparkles, Users, Layers } from 'lucide-react';
import { enterFrom } from '../lib/motion';

interface WhatIDoProps {
  services: Service[];
  skills: Skill[];
}

const serviceThemes: Record<string, { icon: typeof Code2; color: string; bg: string; border: string; hoverBg: string; tagColor: string }> = {
  '01': { icon: Code2, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', hoverBg: 'group-hover:bg-amber-500 group-hover:text-white', tagColor: 'text-amber-600 dark:text-amber-400 bg-amber-500/10' },
  '02': { icon: Target, color: 'text-sky-500', bg: 'bg-sky-500/10', border: 'border-sky-500/20', hoverBg: 'group-hover:bg-sky-500 group-hover:text-white', tagColor: 'text-sky-600 dark:text-sky-400 bg-sky-500/10' },
  '03': { icon: Sparkles, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', hoverBg: 'group-hover:bg-emerald-500 group-hover:text-white', tagColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' },
  '04': { icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20', hoverBg: 'group-hover:bg-purple-500 group-hover:text-white', tagColor: 'text-purple-600 dark:text-purple-400 bg-purple-500/10' },
  '05': { icon: Layers, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20', hoverBg: 'group-hover:bg-rose-500 group-hover:text-white', tagColor: 'text-rose-600 dark:text-rose-400 bg-rose-500/10' },
};

export default function WhatIDo({ services, skills }: WhatIDoProps) {
  const reduced = useReducedMotion();
  const activeSkills = skills.filter((skill) => skill.is_active).sort((a, b) => a.sort_order - b.sort_order);
  const categories = Array.from(new Set(activeSkills.map((skill) => skill.category)));

  return (
    <section id="services" className="py-20 md:py-28 bg-white dark:bg-[#0A0A0A] border-b border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-24">
          <div className="flex items-center gap-2 mb-10">
            <span className="w-2 h-2 rounded-full bg-[#FF3B30]" />
            <span className="text-xs font-black uppercase tracking-[0.25em] text-neutral-900 dark:text-neutral-100">
              SERVICES
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
            {services.filter((srv) => srv.is_active).slice(0, 5).map((srv, idx) => {
              const theme = serviceThemes[srv.code] || serviceThemes['01'];
              const IconComp = theme.icon;
              return (
                <motion.div
                  key={srv.id}
                  {...enterFrom(idx % 2 === 0 ? 'up' : 'scale', reduced, idx * 0.1)}
                  className="flex flex-col justify-between p-4 rounded-xl border border-neutral-100 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-900/30 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-lg transition-all group"
                >
                  <div>
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${theme.bg} ${theme.color} border ${theme.border} ${theme.hoverBg} mb-5 transition-all duration-300 shadow-xs`}>
                      <IconComp className="w-5 h-5 stroke-[2]" />
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-[0.16em] text-neutral-950 dark:text-white mb-2 leading-tight">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal">
                      {srv.description}
                    </p>
                  </div>
                  {srv.tags && srv.tags.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-neutral-200/60 dark:border-neutral-800/80 flex flex-wrap gap-1.5">
                      {srv.tags.slice(0, 2).map((t) => (
                        <span key={t} className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${theme.tagColor}`}>
                          #{t.replace(/\s+/g, '')}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        <div id="skills" className="pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <motion.div {...enterFrom('left', reduced)} className="lg:col-span-4">
              <div className="relative inline-flex items-center gap-2 mb-4">
                <motion.span
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="w-2 h-2 rounded-full bg-[#FF3B30] shadow-[0_0_0_6px_rgba(255,59,48,0.12)] animate-pulse"
                />
                <motion.span
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, delay: 0.1, ease: 'easeOut' }}
                  className="text-xs font-black uppercase tracking-[0.25em] text-neutral-900 dark:text-neutral-100"
                >
                  SKILLS
                </motion.span>
                <motion.span
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.18, ease: 'easeInOut' }}
                  className="absolute -bottom-2 left-0 h-0.5 w-full origin-left rounded-full bg-gradient-to-r from-[#FF3B30] via-orange-500 to-transparent"
                />
              </div>

              <motion.h3
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
                className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-950 dark:text-white leading-[1.15]"
              >
                SKILLS THAT <br />
                <span className="bg-gradient-to-r from-[#FF3B30] via-orange-500 to-amber-500 bg-clip-text text-transparent">
                  DRIVE IMPACT
                </span>
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
                className="text-xs text-neutral-500 dark:text-neutral-400 mt-4 leading-relaxed max-w-sm"
              >
                Languages, web technologies, databases, software development, competitive programming, and tools from my CV.
              </motion.p>
            </motion.div>

            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7">
              {categories.map((category, index) => (
                <motion.div
                  key={category}
                  {...enterFrom(index % 2 === 0 ? 'right' : 'up', reduced, index * 0.08)}
                  className="space-y-3 p-4 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/30 border border-neutral-100 dark:border-neutral-900 shadow-[0_0_0_rgba(0,0,0,0)] transition-shadow duration-300 hover:shadow-[0_10px_24px_rgba(15,23,42,0.06)]"
                >
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.45, delay: 0.12 + index * 0.08, ease: 'easeOut' }}
                    className="block font-extrabold uppercase tracking-wider text-neutral-900 dark:text-white text-[11px]"
                  >
                    {category}
                  </motion.span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeSkills
                      .filter((skill) => skill.category === category)
                      .map((skill, skillIndex) => (
                        <motion.span
                          key={skill.id}
                          initial={{ opacity: 0, scale: 0.92, y: 8 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ duration: 0.35, delay: 0.18 + index * 0.07 + skillIndex * 0.04, ease: 'easeOut' }}
                          whileHover={{ y: -2, scale: 1.02 }}
                          className="text-[10px] font-semibold px-2 py-1 rounded-md bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                        >
                          {skill.name}
                        </motion.span>
                      ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
