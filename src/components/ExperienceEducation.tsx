import { useState } from 'react';
import { motion } from 'motion/react';
import { Briefcase, GraduationCap, Award, Calendar, MapPin, CheckCircle2, ChevronRight, ArrowUpRight } from 'lucide-react';
import { Experience, Education, Certification } from '../types';

interface ExperienceEducationProps {
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
}

export default function ExperienceEducation({
  experience,
  education,
  certifications,
}: ExperienceEducationProps) {
  const [activeTab, setActiveTab] = useState<'experience' | 'education' | 'certifications'>('experience');

  return (
    <section
      id="experience"
      className="py-20 md:py-28 bg-[#FAFAFA] dark:bg-[#0E0E0E] border-b border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Marker: • EXPERIENCE & EDUCATION */}
        <div className="flex items-center gap-2 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#FF3B30]" />
          <span className="text-xs font-black uppercase tracking-[0.25em] text-neutral-900 dark:text-neutral-100">
            EXPERIENCE & EDUCATION
          </span>
        </div>

        {/* Header & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-neutral-950 dark:text-white uppercase tracking-tight">
              CAREER & CREDENTIALS
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-2 font-normal">
              Formal B.Sc in CSE, Engineering Diploma, hands-on enterprise troubleshooting, and professional industry certifications.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-2">
            {[
              { id: 'experience', label: 'EXPERIENCE', icon: Briefcase },
              { id: 'education', label: 'EDUCATION', icon: GraduationCap },
              { id: 'certifications', label: 'CERTIFICATIONS', icon: Award },
            ].map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all relative ${
                    isActive
                      ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 shadow-xs'
                      : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area with Motion Fade / Slide */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* TAB 1: EXPERIENCE */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              {experience.map((exp, idx) => {
                const isCurrent = exp.is_current;
                return (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className={`p-8 rounded-2xl bg-white dark:bg-[#121212] border shadow-xs transition-all hover:shadow-lg ${
                      isCurrent
                        ? 'border-red-500/30 dark:border-red-500/30'
                        : 'border-neutral-200/80 dark:border-neutral-800/80 hover:border-neutral-300 dark:hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-neutral-950 dark:text-white">
                            {exp.position}
                          </h3>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              CURRENT ROLE
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-[#FF3B30] uppercase tracking-wider">
                          <span>{exp.company}</span>
                          <span>•</span>
                          <span className="text-neutral-500 font-medium">{exp.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 dark:bg-red-500/15 text-[#FF3B30] border border-red-500/20 text-xs font-mono font-bold self-start md:self-auto">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{exp.start_date} – {exp.is_current ? 'Present' : exp.end_date}</span>
                      </div>
                    </div>

                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <h4 className="text-[11px] font-black uppercase tracking-wider text-neutral-900 dark:text-white">
                          Key Responsibilities & Highlights:
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          {exp.responsibilities.map((ach: string, i: number) => (
                            <div key={i} className="flex items-start gap-2.5 text-xs text-neutral-600 dark:text-neutral-400 p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-100 dark:border-neutral-800/60">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{ach}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* TAB 2: EDUCATION */}
          {activeTab === 'education' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {education.map((edu, idx) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="p-8 rounded-2xl bg-white dark:bg-[#121212] border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs flex flex-col justify-between hover:border-sky-400/50 transition-all hover:shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                        {edu.start_year} – {edu.end_year}
                      </span>
                      {edu.grade && (
                        <span className="text-xs font-black px-2.5 py-1 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase">
                          CGPA: {edu.grade}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-black uppercase tracking-tight text-neutral-950 dark:text-white mb-1">
                      {edu.degree}
                    </h3>
                    <p className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-4">
                      {edu.institution}
                    </p>

                    {edu.description && (
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
                        {edu.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#FF3B30]" />
                      <span>{edu.location}</span>
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase text-[11px] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Verified Academic
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* TAB 3: CERTIFICATIONS */}
          {activeTab === 'certifications' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {certifications.map((cert, idx) => {
                const isCisco = cert.issuer.toLowerCase().includes('cisco');
                const isGoogle = cert.issuer.toLowerCase().includes('google');
                const isICT = cert.issuer.toLowerCase().includes('ict') || cert.issuer.toLowerCase().includes('ledp');
                
                const certTheme = isCisco
                  ? { badge: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20', hover: 'hover:border-sky-400/50' }
                  : isGoogle
                  ? { badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20', hover: 'hover:border-amber-400/50' }
                  : isICT
                  ? { badge: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20', hover: 'hover:border-purple-400/50' }
                  : { badge: 'bg-red-500/10 text-[#FF3B30] border-red-500/20', hover: 'hover:border-red-400/50' };

                return (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.08 }}
                    className={`p-6 rounded-2xl bg-white dark:bg-[#121212] border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs flex flex-col justify-between transition-all hover:shadow-lg ${certTheme.hover}`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${certTheme.badge}`}>
                          <Award className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-mono font-bold text-neutral-400 px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800">
                          {cert.issue_date}
                        </span>
                      </div>

                      <h3 className="text-xs font-black uppercase tracking-wider text-neutral-950 dark:text-white mb-1 leading-snug">
                        {cert.name}
                      </h3>
                      <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-3">
                        {cert.issuer}
                      </p>

                      {cert.description && (
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed">
                          {cert.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-[11px]">
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        VERIFIED
                      </span>
                      {cert.credential_url ? (
                        <a
                          href={cert.credential_url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-[#FF3B30] uppercase flex items-center gap-1 hover:underline"
                        >
                          Verify <ArrowUpRight className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="font-bold text-[#FF3B30] uppercase flex items-center gap-1">
                          Certified <ArrowUpRight className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

      </div>
    </section>
  );
}
