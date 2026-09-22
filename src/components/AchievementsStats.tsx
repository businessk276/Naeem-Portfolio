import { motion, useReducedMotion } from 'motion/react';
import { Award, Testimonial } from '../types';
import { Quote, ArrowUpRight } from 'lucide-react';
import { enterFrom } from '../lib/motion';

interface AchievementsStatsProps {
  awards: Award[];
  testimonials: Testimonial[];
}

const highlights = [
  { name: 'NEXT.JS', label: 'Web Framework' },
  { name: 'REACT', label: 'UI Library' },
  { name: 'POSTGRESQL', label: 'Database' },
  { name: 'CODEFORCES', label: 'Online Judge' },
  { name: 'LEETCODE', label: 'Problem Solving' },
  { name: 'GITHUB', label: 'Version Control' },
];

export default function AchievementsStats({ awards, testimonials }: AchievementsStatsProps) {
  const reduced = useReducedMotion();
  const publishedTestimonials = testimonials.filter((item) => item.status === 'published');

  return (
    <div id="clients" className="border-b border-neutral-200/80 dark:border-neutral-800/80">
      <section className="py-20 md:py-24 bg-white dark:bg-[#0A0A0A] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-10">
            <span className="w-2 h-2 rounded-full bg-[#FF3B30]" />
            <span className="text-xs font-black uppercase tracking-[0.25em] text-neutral-900 dark:text-neutral-100">
              STACK & PLATFORMS
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 items-center py-6 border-b border-neutral-200/80 dark:border-neutral-800/80 mb-12">
            {highlights.map((brand, i) => (
              <motion.div
                key={brand.name}
                {...enterFrom('up', reduced, i * 0.06)}
                className="flex flex-col items-center justify-center text-center p-3 opacity-60 hover:opacity-100 transition-opacity"
              >
                <span className="text-sm sm:text-base font-black tracking-widest text-neutral-900 dark:text-white uppercase font-sans">
                  {brand.name}
                </span>
                <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest mt-0.5">
                  {brand.label}
                </span>
              </motion.div>
            ))}
          </div>

          {awards.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
              {awards.slice(0, 4).map((aw, idx) => (
                <motion.div
                  key={aw.id}
                  {...enterFrom('scale', reduced, idx * 0.08)}
                  className="p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/70 dark:bg-neutral-900/40 transition-all hover:shadow-md"
                >
                  <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full mb-3 bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    HONOR & AWARD
                  </span>
                  <h4 className="text-xs font-black uppercase tracking-wider text-neutral-950 dark:text-white mb-1.5 leading-snug">
                    {aw.title}
                  </h4>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                    {aw.issuer} • <span className="font-mono text-neutral-400">{aw.year}</span>
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {publishedTestimonials.length > 0 && (
        <section id="testimonials" className="py-20 md:py-24 bg-[#FAFAFA] dark:bg-[#0E0E0E] border-t border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-10">
              <span className="w-2 h-2 rounded-full bg-[#FF3B30]" />
              <span className="text-xs font-black uppercase tracking-[0.25em] text-neutral-900 dark:text-neutral-100">
                WHAT CLIENTS SAY
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {publishedTestimonials.map((item, index) => (
                <motion.div
                  key={item.id}
                  {...enterFrom(index % 2 === 0 ? 'left' : 'right', reduced, index * 0.1)}
                  className="p-8 rounded-2xl bg-white dark:bg-[#121212] border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs flex flex-col justify-between transition-all hover:shadow-lg"
                >
                  <div>
                    <div className="mb-4">
                      <Quote className="w-8 h-8 rotate-180 text-[#FF3B30] fill-[#FF3B30]" />
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-normal mb-8">
                      "{item.text}"
                    </p>
                  </div>
                  <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800/80">
                    <h4 className="text-xs font-black uppercase tracking-wider text-neutral-950 dark:text-white">
                      {item.client_name}
                    </h4>
                    <p className="text-[11px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-medium">
                      {item.position}, {item.company}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 md:py-28 bg-white dark:bg-[#0A0A0A] relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-gradient-to-tr from-[#FF3B30]/15 via-purple-500/15 to-sky-500/15 blur-3xl rounded-full pointer-events-none -mr-20 -mb-20" />
        <div className="absolute left-0 top-0 w-80 h-80 bg-gradient-to-br from-amber-500/10 via-red-500/10 to-transparent blur-3xl rounded-full pointer-events-none -ml-20 -mt-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <motion.div {...enterFrom('left', reduced)} className="lg:col-span-8">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-neutral-950 dark:text-white leading-[0.95]">
                LET'S CREATE SOMETHING <br />
                <span className="text-[#FF3B30] relative inline-block">
                  EXTRAORDINARY.
                  <svg className="absolute -bottom-2 left-0 w-full h-4 text-[#FF3B30]" viewBox="0 0 300 20" fill="none" aria-hidden="true">
                    <path d="M2 15C80 6 220 4 298 12" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span>
              </h2>
            </motion.div>
            <motion.div {...enterFrom('right', reduced, 0.12)} className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center">
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-6 text-left lg:text-right max-w-xs">
                Have a software role, full-stack project, or collaboration in mind? I'd love to hear from you.
              </p>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-black uppercase tracking-[0.18em] hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all duration-200 shadow-xl hover:-translate-y-0.5"
              >
                <span>GET IN TOUCH</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
