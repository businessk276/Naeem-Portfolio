import { useState } from 'react';
import { motion } from 'motion/react';
import { Service, Skill } from '../types';
import { 
  Terminal, 
  Network, 
  Code2, 
  ShieldCheck, 
  TrendingUp, 
  Cpu, 
  Eye, 
  Asterisk, 
  Users, 
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

interface WhatIDoProps {
  services: Service[];
  skills: Skill[];
}

export default function WhatIDo({ services, skills }: WhatIDoProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Defined 5 key services matching reference 5-column layout with color palettes
  const serviceThemes: Record<string, { icon: any; color: string; bg: string; border: string; hoverBg: string; tagColor: string }> = {
    '01': {
      icon: Cpu,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      hoverBg: 'group-hover:bg-amber-500 group-hover:text-white',
      tagColor: 'text-amber-600 dark:text-amber-400 bg-amber-500/10',
    },
    '02': {
      icon: Eye,
      color: 'text-sky-500',
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/20',
      hoverBg: 'group-hover:bg-sky-500 group-hover:text-white',
      tagColor: 'text-sky-600 dark:text-sky-400 bg-sky-500/10',
    },
    '03': {
      icon: Asterisk,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      hoverBg: 'group-hover:bg-emerald-500 group-hover:text-white',
      tagColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
    },
    '04': {
      icon: Users,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      hoverBg: 'group-hover:bg-purple-500 group-hover:text-white',
      tagColor: 'text-purple-600 dark:text-purple-400 bg-purple-500/10',
    },
    '05': {
      icon: ArrowUpRight,
      color: 'text-rose-500',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      hoverBg: 'group-hover:bg-rose-500 group-hover:text-white',
      tagColor: 'text-rose-600 dark:text-rose-400 bg-rose-500/10',
    },
  };

  const skillBars = [
    { name: 'COMPUTER HARDWARE & DIAGNOSTICS', level: 95, grad: 'from-amber-400 to-orange-500', textCol: 'text-amber-500' },
    { name: 'CISCO ROUTING & PACKET TRACER', level: 92, grad: 'from-cyan-400 to-blue-600', textCol: 'text-cyan-500' },
    { name: 'WEB DEVELOPMENT (HTML5, CSS, JS)', level: 88, grad: 'from-violet-500 to-indigo-600', textCol: 'text-violet-500' },
    { name: 'CCTV & SURVEILLANCE SYSTEMS', level: 90, grad: 'from-emerald-400 to-teal-600', textCol: 'text-emerald-500' },
    { name: 'DIGITAL MARKETING & CLIENT HUNTING', level: 88, grad: 'from-rose-400 to-pink-600', textCol: 'text-rose-500' },
    { name: 'OFFICE & IT OPERATIONS MANAGEMENT', level: 94, grad: 'from-[#FF3B30] to-red-600', textCol: 'text-[#FF3B30]' },
  ];

  return (
    <section id="services" className="py-20 md:py-28 bg-white dark:bg-[#0A0A0A] border-b border-neutral-200/80 dark:border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ==================================================== */}
        {/* SECTION 1: SERVICES (5-column matching reference)    */}
        {/* ==================================================== */}
        <div className="mb-24">
          {/* Section Marker: • SERVICES */}
          <div className="flex items-center gap-2 mb-10">
            <span className="w-2 h-2 rounded-full bg-[#FF3B30]" />
            <span className="text-xs font-black uppercase tracking-[0.25em] text-neutral-900 dark:text-neutral-100">
              SERVICES
            </span>
          </div>

          {/* 5-Column Grid matching reference cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
            {services.slice(0, 5).map((srv, idx) => {
              const theme = serviceThemes[srv.code] || serviceThemes['01'];
              const IconComp = theme.icon;
              return (
                <motion.div
                  key={srv.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="flex flex-col justify-between p-4 rounded-xl border border-neutral-100 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-900/30 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-lg transition-all group"
                >
                  <div>
                    {/* Colorful Icon Badge */}
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${theme.bg} ${theme.color} border ${theme.border} ${theme.hoverBg} mb-5 transition-all duration-300 shadow-xs`}>
                      <IconComp className="w-5 h-5 stroke-[2]" />
                    </div>

                    {/* Uppercase Title */}
                    <h3 className="text-xs font-black uppercase tracking-[0.16em] text-neutral-950 dark:text-white mb-2 leading-tight">
                      {srv.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal">
                      {srv.description}
                    </p>
                  </div>

                  {/* Micro tags with colorful pills */}
                  {srv.tags && srv.tags.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-neutral-200/60 dark:border-neutral-800/80 flex flex-wrap gap-1.5">
                      {srv.tags.slice(0, 2).map((t) => (
                        <span
                          key={t}
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${theme.tagColor}`}
                        >
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

        {/* ==================================================== */}
        {/* SECTION 2: SKILLS THAT DRIVE IMPACT                   */}
        {/* ==================================================== */}
        <div id="skills" className="pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Title: • SKILLS / SKILLS THAT DRIVE IMPACT */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-4"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-[#FF3B30]" />
                <span className="text-xs font-black uppercase tracking-[0.25em] text-neutral-900 dark:text-neutral-100">
                  SKILLS
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-950 dark:text-white leading-[1.15]">
                SKILLS THAT <br />
                <span className="bg-gradient-to-r from-[#FF3B30] via-orange-500 to-amber-500 bg-clip-text text-transparent">
                  DRIVE IMPACT
                </span>
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-4 leading-relaxed max-w-sm">
                Hands-on practical execution across computer hardware repair, enterprise Cisco networks, web architectures, and digital growth marketing.
              </p>
            </motion.div>

            {/* Right: Two-Column Animated Skill Bars with Unique Color Gradients */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-7">
              {skillBars.map((sk, index) => (
                <motion.div
                  key={sk.name}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="space-y-2 p-3 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/30 border border-neutral-100 dark:border-neutral-900"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold uppercase tracking-wider text-neutral-900 dark:text-white text-[11px]">
                      {sk.name}
                    </span>
                    <span className={`font-mono ${sk.textCol} text-[11px] font-black`}>
                      {sk.level}%
                    </span>
                  </div>

                  {/* Horizontal progress bar with vibrant gradient fill */}
                  <div className="h-[4px] w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${sk.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                      className={`h-full bg-gradient-to-r ${sk.grad} rounded-full`}
                    />
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
