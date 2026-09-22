import { motion, useReducedMotion } from 'motion/react';
import { Profile } from '../types';
import { ShieldCheck } from 'lucide-react';
import { enterFrom } from '../lib/motion';

interface AboutMeProps {
  profile: Profile;
}

export default function AboutMe({ profile }: AboutMeProps) {
  const reduced = useReducedMotion();

  return (
    <section
      id="about"
      className="py-20 md:py-28 bg-[#FAFAFA] dark:bg-[#0E0E0E] border-b border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#FF3B30]" />
          <span className="text-xs font-black uppercase tracking-[0.25em] text-neutral-900 dark:text-neutral-100">
            ABOUT ME
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <motion.div {...enterFrom('left', reduced)} className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-950 dark:text-white uppercase leading-[1.12] tracking-tight mb-6">
                I'M A SOFTWARE ENGINEER WHO BUILDS RELIABLE, WELL-STRUCTURED WEB APPLICATIONS.
              </h2>
              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal mb-8">
                {profile.about_description}
              </p>
            </div>

            <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <div className="font-serif italic text-2xl font-bold tracking-wider text-neutral-900 dark:text-neutral-100 select-none">
                  Naeem
                </div>
                <div className="mt-1">
                  <span className="block text-[11px] font-extrabold uppercase tracking-widest text-neutral-900 dark:text-white">
                    {profile.name}
                  </span>
                  <span className="block text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
                    Software Engineer
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-800 dark:text-neutral-200">
                <ShieldCheck className="w-5 h-5 text-[#FF3B30]" />
              </div>
            </div>
          </motion.div>

          <motion.div {...enterFrom('up', reduced, 0.12)} className="lg:col-span-3 flex flex-col justify-center pl-0 lg:pl-4">
            <div className="mb-6">
              <span className="text-7xl sm:text-8xl font-black bg-gradient-to-r from-[#FF3B30] via-[#F97316] to-[#F59E0B] bg-clip-text text-transparent tracking-tight leading-none block">
                1500+
              </span>
              <span className="text-xs font-black uppercase tracking-[0.22em] text-neutral-900 dark:text-white block mt-2">
                PROBLEMS SOLVED
              </span>
              <div className="w-24 h-[3.5px] bg-gradient-to-r from-[#FF3B30] via-[#F97316] to-[#F59E0B] rounded-full mt-3" />
            </div>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-center justify-between border-b border-neutral-200/80 dark:border-neutral-800/80 pb-2.5">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-red-500/10 text-[#FF3B30] border border-red-500/20">60+</span>
                <span className="text-xs text-neutral-600 dark:text-neutral-300 font-semibold">Students Taught</span>
              </div>
              <div className="flex items-center justify-between border-b border-neutral-200/80 dark:border-neutral-800/80 pb-2.5">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">3.55</span>
                <span className="text-xs text-neutral-600 dark:text-neutral-300 font-semibold">CGPA out of 4.00</span>
              </div>
              <div className="flex items-center justify-between pb-1">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">2</span>
                <span className="text-xs text-neutral-600 dark:text-neutral-300 font-semibold">Featured Web Projects</span>
              </div>
            </div>
          </motion.div>

          <motion.div {...enterFrom('right', reduced, 0.2)} className="lg:col-span-5 relative">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl group">
              <img
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80"
                alt="Software development workspace"
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 filter brightness-95 group-hover:brightness-105"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-neutral-950/70 via-sky-950/15 to-transparent pointer-events-none" />
              <div className="absolute -bottom-6 -right-6 w-48 h-32 bg-gradient-to-br from-[#FF3B30] to-[#E02E24] -rotate-12 transform origin-bottom-right shadow-2xl pointer-events-none" />
              <div className="absolute top-4 left-4 bg-neutral-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/15 text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF3B30] animate-pulse" />
                <span>Software Engineer • Barishal</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
