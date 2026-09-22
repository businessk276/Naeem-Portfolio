import { motion, useReducedMotion } from 'motion/react';
import { ProcessStep } from '../types';
import { Search, FileSpreadsheet, PenTool, Code, CheckCircle2 } from 'lucide-react';
import { enterFrom } from '../lib/motion';

interface MyProcessProps {
  steps: ProcessStep[];
}

export default function MyProcess({ steps }: MyProcessProps) {
  const reduced = useReducedMotion();
  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'Search':
        return <Search className="w-5 h-5" />;
      case 'FileSpreadsheet':
        return <FileSpreadsheet className="w-5 h-5" />;
      case 'PenTool':
        return <PenTool className="w-5 h-5" />;
      case 'Code':
        return <Code className="w-5 h-5" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-5 h-5" />;
      default:
        return <CheckCircle2 className="w-5 h-5" />;
    }
  };

  return (
    <section
      id="process"
      className="py-20 md:py-28 bg-[#FAFAFA] dark:bg-[#0E0E0E] border-b border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Marker: • MY PROCESS */}
        <div className="flex items-center gap-2 mb-10">
          <span className="w-2 h-2 rounded-full bg-[#FF3B30]" />
          <span className="text-xs font-black uppercase tracking-[0.25em] text-neutral-900 dark:text-neutral-100">
            MY PROCESS
          </span>
        </div>

        {/* Section Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-neutral-950 dark:text-white uppercase tracking-tight">
              ENGINEERING METHODOLOGY
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-md font-normal">
            A software development lifecycle from requirement analysis through debugging and quality delivery.
          </p>
        </div>

        {/* 5-Step Process Roadmap with Scrollable Animations */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
            {steps.map((step, idx) => (
              <motion.div
                key={step.id}
                {...enterFrom(idx % 2 === 0 ? 'up' : 'scale', reduced, idx * 0.1)}
                className="flex flex-col p-6 rounded-2xl bg-white dark:bg-[#121212] border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                {/* Step Icon & Number */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-11 h-11 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white flex items-center justify-center group-hover:bg-[#FF3B30] group-hover:text-white transition-colors">
                    {getStepIcon(step.icon)}
                  </div>
                  <span className="text-[11px] font-mono font-black text-neutral-400 group-hover:text-[#FF3B30] transition-colors">
                    {step.step_number}
                  </span>
                </div>

                {/* Step Title & Subtitle */}
                <h3 className="font-black text-sm text-neutral-950 dark:text-white uppercase tracking-tight mb-1">
                  {step.title}
                </h3>
                <p className="text-[10px] font-bold text-[#FF3B30] uppercase tracking-wider mb-3">
                  {step.subtitle}
                </p>

                {/* Description */}
                <p className="text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed font-normal">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
