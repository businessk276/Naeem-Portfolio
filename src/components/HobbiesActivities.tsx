import { motion } from 'motion/react';
import { Activity, Hobby } from '../types';
import { Users, HeartHandshake, BookOpen, Compass, Sun, Cpu, Video, Sparkles } from 'lucide-react';

interface HobbiesActivitiesProps {
  activities: Activity[];
  hobbies: Hobby[];
}

export default function HobbiesActivities({ activities, hobbies }: HobbiesActivitiesProps) {
  if (activities.length === 0 && hobbies.length === 0) return null;
  const getHobbyTheme = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen':
        return {
          icon: <BookOpen className="w-4 h-4" />,
          badge: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
          hoverBorder: 'hover:border-purple-400/50',
        };
      case 'Compass':
        return {
          icon: <Compass className="w-4 h-4" />,
          badge: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
          hoverBorder: 'hover:border-sky-400/50',
        };
      case 'Sun':
        return {
          icon: <Sun className="w-4 h-4" />,
          badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
          hoverBorder: 'hover:border-amber-400/50',
        };
      case 'Cpu':
        return {
          icon: <Cpu className="w-4 h-4" />,
          badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
          hoverBorder: 'hover:border-emerald-400/50',
        };
      case 'Video':
        return {
          icon: <Video className="w-4 h-4" />,
          badge: 'bg-red-500/10 text-[#FF3B30] border-red-500/20',
          hoverBorder: 'hover:border-red-400/50',
        };
      default:
        return {
          icon: <Sparkles className="w-4 h-4" />,
          badge: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
          hoverBorder: 'hover:border-indigo-400/50',
        };
    }
  };

  return (
    <section className="py-20 md:py-28 bg-white dark:bg-[#0A0A0A] border-b border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Marker */}
        <div className="flex items-center gap-2 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#FF3B30]" />
          <span className="text-xs font-black uppercase tracking-[0.25em] text-neutral-900 dark:text-neutral-100">
            LEADERSHIP & PERSONAL PURSUITS
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Extra-Curricular Activities */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white uppercase tracking-tight mb-8">
              ORGANIZATIONAL LEADERSHIP
            </h2>

            <div className="space-y-4">
              {activities.map((act, idx) => {
                const isRover = act.organization.toLowerCase().includes('scout');
                return (
                  <motion.div
                    key={act.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className={`p-6 rounded-2xl bg-neutral-50 dark:bg-[#121212] border border-neutral-200/80 dark:border-neutral-800/80 flex items-start gap-4 shadow-xs transition-all hover:shadow-md ${
                      isRover ? 'hover:border-red-400/60' : 'hover:border-sky-400/60'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-1 ${
                      isRover
                        ? 'bg-red-500/10 text-[#FF3B30] border border-red-500/20'
                        : 'bg-sky-500/10 text-sky-500 border border-sky-500/20'
                    }`}>
                      <Users className="w-5 h-5" />
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                        <h3 className="text-sm font-black uppercase tracking-tight text-neutral-950 dark:text-white">
                          {act.title}
                        </h3>
                        <span className="text-[11px] font-mono text-neutral-400 font-semibold px-2 py-0.5 rounded bg-neutral-200/50 dark:bg-neutral-800/50">
                          {act.period}
                        </span>
                      </div>

                      <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                        isRover ? 'text-[#FF3B30]' : 'text-sky-500'
                      }`}>
                        {act.role} • <span className="text-neutral-500 font-medium">{act.organization}</span>
                      </div>

                      <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
                        {act.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right: Personal Pursuits & Interests */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-5"
          >
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white uppercase tracking-tight mb-8">
              INTERESTS & HOBBIES
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {hobbies.map((h, i) => {
                const theme = getHobbyTheme(h.icon);
                return (
                  <motion.div
                    key={h.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className={`p-5 rounded-xl bg-neutral-50/80 dark:bg-[#121212] border border-neutral-200/80 dark:border-neutral-800/80 flex items-start gap-3 transition-all hover:shadow-md ${theme.hoverBorder}`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${theme.badge}`}>
                      {theme.icon}
                    </div>
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-neutral-950 dark:text-white mb-0.5">
                        {h.name}
                      </h3>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-normal leading-relaxed">
                        {h.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
