import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, MapPin, Cpu, Download, Mail } from 'lucide-react';
import { Profile, SocialLink } from '../types';
import { getCvDownloadName, getCvHref, downloadOriginalCv } from '../lib/cv';

interface HeroProps {
  profile: Profile;
  socialLinks: SocialLink[];
  onOpenAbout: () => void;
}

export default function Hero({ profile }: HeroProps) {
  const [imageError, setImageError] = useState(false);
  const reducedMotion = useReducedMotion();
  const cvHref = getCvHref(profile.resume_url);

  return (
    <section
      id="home"
      className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-white dark:bg-[#0A0A0A] border-b border-neutral-200/80 dark:border-neutral-800/80"
    >
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] [background-size:40px_40px] [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] dark:[background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]" />

      {profile.availability_status && (
        <div className="hidden xl:flex absolute right-6 top-1/2 -translate-y-1/2 items-center gap-2 rotate-90 origin-right pointer-events-none select-none z-20">
          <span className="w-2 h-2 rounded-full bg-[#FF3B30] animate-ping" />
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
            • {profile.availability_status}
          </span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0.3 : 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            <div className="mb-6">
              <span className="block text-xs sm:text-sm font-extrabold uppercase tracking-[0.22em] text-neutral-900 dark:text-white">
                {profile.name}
              </span>
              <span className="block text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400 mt-1">
                {profile.supporting_line}
              </span>
            </div>

            <div className="relative mb-6 select-none">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-tight text-neutral-950 dark:text-white uppercase leading-[0.92] font-sans">
                Software <br />
                <span className="relative inline-block">
                  Engineer
                  <svg
                    className="absolute -bottom-2 -left-4 w-[115%] h-6 sm:h-8 text-[#FF3B30] -rotate-1 pointer-events-none"
                    viewBox="0 0 320 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M6 18C45 12 140 6 312 14" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                    <path d="M24 23C78 19 198 12 290 19" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
            </div>

            <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed mb-6 max-w-xl font-normal">
              {profile.short_intro}
            </p>

            <div className="flex flex-wrap items-center gap-2 mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                Web Development
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Competitive Programming
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                Prompt Engineering
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-8">
              <a
                id="hero-view-work-btn"
                href="#work"
                className="group inline-flex items-center justify-center gap-2 h-11 px-5 sm:px-6 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all duration-200 shadow-2xs hover:shadow-sm hover:-translate-y-0.5 cursor-pointer"
              >
                <span>VIEW MY WORK</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <a
                id="hero-download-cv-btn"
                href={cvHref}
                download={getCvDownloadName()}
                onClick={(event) => {
                  event.preventDefault();
                  void downloadOriginalCv(profile.resume_url).catch(() => {
                    window.location.href = cvHref;
                  });
                }}
                className="group inline-flex items-center justify-center gap-2 h-11 px-5 sm:px-6 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/60 backdrop-blur-xs text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white hover:border-neutral-900 dark:hover:border-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] transition-all duration-200 shadow-2xs hover:-translate-y-0.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white group-hover:translate-y-0.5 transition-all duration-200" />
                <span>DOWNLOAD CV</span>
              </a>

              <a
                id="hero-contact-btn"
                href="#contact"
                className="group inline-flex items-center justify-center gap-2 h-11 px-5 sm:px-6 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/60 backdrop-blur-xs text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white hover:border-neutral-900 dark:hover:border-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] transition-all duration-200 shadow-2xs hover:-translate-y-0.5 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors duration-200" />
                <span>GET IN TOUCH</span>
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-600 dark:text-neutral-400">
              <div className="flex items-center gap-2 bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60 px-3.5 py-1.5 rounded-lg font-semibold">
                <MapPin className="w-3.5 h-3.5 text-sky-500" />
                <span>{profile.location}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, x: 48 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: reducedMotion ? 0.3 : 1, delay: reducedMotion ? 0 : 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative flex flex-col items-center justify-center"
          >
            <div className="w-full flex justify-end mb-4 pr-2 sm:pr-4">
              <div className="text-right">
                <span className="block text-[10px] font-extrabold uppercase tracking-[0.25em] text-neutral-400 dark:text-neutral-500">
                  CURRENT LOCATION
                </span>
                <span className="block text-xs font-bold uppercase tracking-[0.18em] text-neutral-900 dark:text-white">
                  BASED IN BARISHAL, BANGLADESH
                </span>
              </div>
            </div>

            <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[410px] lg:h-[410px] aspect-square flex items-center justify-center">
              <div className="absolute -inset-6 rounded-full bg-gradient-to-tr from-[#FF3B30]/30 via-sky-500/25 to-amber-500/25 blur-3xl -z-10 pointer-events-none" />
              <div className="absolute -inset-1 sm:-inset-2 translate-x-2.5 translate-y-2.5 sm:translate-x-3.5 sm:translate-y-3.5 rounded-full bg-gradient-to-br from-[#FF3B30] to-[#E02E24] -z-10 shadow-2xl opacity-95 transition-transform duration-500 hover:translate-x-2 hover:translate-y-2" />

              <motion.div
                animate={reducedMotion ? undefined : { rotate: 360 }}
                transition={reducedMotion ? undefined : { duration: 14, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-4 sm:-inset-6 md:-inset-7 pointer-events-none z-20 flex items-center justify-center"
              >
                <svg className="w-full h-full" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="smoothContinuousRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FF3B30" stopOpacity="1" />
                      <stop offset="25%" stopColor="#FB923C" stopOpacity="0.9" />
                      <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.95" />
                      <stop offset="75%" stopColor="#818CF8" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="#FF3B30" stopOpacity="0" />
                    </linearGradient>
                    <filter id="seamlessRingGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#FF3B30" floodOpacity="0.6" />
                    </filter>
                  </defs>
                  <circle cx="200" cy="200" r="184" fill="none" stroke="currentColor" className="text-neutral-300/40 dark:text-neutral-700/50" strokeWidth="1.5" strokeDasharray="6 8" />
                  <circle cx="200" cy="200" r="184" fill="none" stroke="url(#smoothContinuousRingGrad)" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="380 90 140 70" filter="url(#seamlessRingGlow)" />
                  <circle cx="200" cy="16" r="6.5" fill="#FF3B30" filter="url(#seamlessRingGlow)" />
                  <circle cx="200" cy="16" r="3" fill="#FFFFFF" />
                  <circle cx="384" cy="200" r="4" fill="#38BDF8" opacity="0.95" />
                  <circle cx="16" cy="200" r="3.5" fill="#F59E0B" opacity="0.9" />
                </svg>
              </motion.div>

              <motion.div
                animate={reducedMotion ? undefined : { rotate: -360 }}
                transition={reducedMotion ? undefined : { duration: 28, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-1.5 sm:-inset-2 md:-inset-2.5 pointer-events-none z-15 flex items-center justify-center"
              >
                <svg className="w-full h-full" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="200" cy="200" r="196" fill="none" stroke="#FF3B30" strokeWidth="1" strokeDasharray="2 16" opacity="0.5" />
                </svg>
              </motion.div>

              <div className="relative z-10 w-full h-full rounded-full overflow-hidden border-4 sm:border-[5px] border-white dark:border-[#121212] shadow-2xl bg-neutral-900 group">
                {!imageError && profile.profile_image ? (
                  <img
                    src={profile.profile_image}
                    alt={profile.name}
                    className="w-full h-full object-cover object-[center_12%] transition-transform duration-700 group-hover:scale-[1.03]"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-white p-6 text-center">
                    <Cpu className="w-16 h-16 text-[#FF3B30] mb-3" />
                    <span className="text-xl font-black uppercase tracking-wider">{profile.logo_text || 'SN'}</span>
                    <span className="text-xs text-neutral-400 mt-1 uppercase tracking-widest">Software Engineer</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
