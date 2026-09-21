import { motion } from 'motion/react';
import { Award, Testimonial } from '../types';
import { Quote, ArrowUpRight, Award as AwardIcon, ShieldCheck } from 'lucide-react';

interface AchievementsStatsProps {
  awards: Award[];
  testimonials: Testimonial[];
}

export default function AchievementsStats({ awards, testimonials }: AchievementsStatsProps) {
  // Certification & Tech Partner brands matching the reference brand bar
  const trustedBrands = [
    { name: 'CISCO', label: 'Networking Academy' },
    { name: 'MICROSOFT', label: 'Windows Server' },
    { name: 'GOOGLE', label: 'Digital Garage' },
    { name: 'ICT DIVISION', label: 'LEDP Project' },
    { name: 'BARISAL POLY', label: 'Engineering' },
    { name: 'WUB', label: 'Computer Science' },
  ];

  const clientTestimonials = testimonials.length > 0 ? testimonials.slice(0, 3) : [
    {
      id: 't1',
      client_name: 'Engr. Tariq Al-Otaibi',
      position: 'Operations Manager',
      company: 'Enterprise Systems, Riyadh',
      text: 'Jobaer is exceptionally fast and methodical when identifying hardware and network bottlenecks. His diligence and calm demeanor during high-pressure situations ensure zero downtime.',
    },
    {
      id: 't2',
      client_name: 'Dr. Rafiqul Islam',
      position: 'Head of CSE Department',
      company: 'World University of Bangladesh',
      text: 'An exceptional computer engineer with strong technical foundations in networking, Cisco routing, and software systems. Highly reliable and innovative.',
    },
    {
      id: 't3',
      client_name: 'Fahad Al-Harbi',
      position: 'IT Infrastructure Lead',
      company: 'Commercial Retail Network',
      text: 'His setup of our supermarket CCTV surveillance and DVR networking was completely seamless. Highly recommended for any IT support role.',
    },
  ];

  return (
    <div id="clients" className="border-b border-neutral-200/80 dark:border-neutral-800/80">
      
      {/* ======================================================= */}
      {/* SECTION 1: TRUSTED BY / ACHIEVEMENTS                    */}
      {/* ======================================================= */}
      <section className="py-20 md:py-24 bg-white dark:bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Marker: • TRUSTED BY / ACHIEVEMENTS */}
          <div className="flex items-center gap-2 mb-10">
            <span className="w-2 h-2 rounded-full bg-[#FF3B30]" />
            <span className="text-xs font-black uppercase tracking-[0.25em] text-neutral-900 dark:text-neutral-100">
              TRUSTED BY / ACHIEVEMENTS
            </span>
          </div>

          {/* Clean Monochrome Brand Strip matching reference logos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 items-center py-6 border-b border-neutral-200/80 dark:border-neutral-800/80 mb-12">
            {trustedBrands.map((brand, i) => (
              <motion.div
                key={brand.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
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

          {/* 4 Distinction Accolade Columns with colorful card themes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
            {awards.slice(0, 4).map((aw, idx) => {
              const awardThemes = [
                {
                  badge: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25',
                  cardBorder: 'hover:border-amber-400/50',
                  dot: 'bg-amber-500',
                },
                {
                  badge: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/25',
                  cardBorder: 'hover:border-purple-400/50',
                  dot: 'bg-purple-500',
                },
                {
                  badge: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25',
                  cardBorder: 'hover:border-emerald-400/50',
                  dot: 'bg-emerald-500',
                },
                {
                  badge: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/25',
                  cardBorder: 'hover:border-sky-400/50',
                  dot: 'bg-sky-500',
                },
              ];
              const theme = awardThemes[idx % awardThemes.length];

              return (
                <motion.div
                  key={aw.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className={`p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/70 dark:bg-neutral-900/40 transition-all hover:shadow-md ${theme.cardBorder}`}
                >
                  <span className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full mb-3 ${theme.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`} />
                    HONOR & AWARD
                  </span>
                  <h4 className="text-xs font-black uppercase tracking-wider text-neutral-950 dark:text-white mb-1.5 leading-snug">
                    {aw.title}
                  </h4>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                    {aw.issuer} • <span className="font-mono text-neutral-400">{aw.year}</span>
                  </p>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ======================================================= */}
      {/* SECTION 2: WHAT CLIENTS SAY (TESTIMONIALS)              */}
      {/* ======================================================= */}
      <section id="testimonials" className="py-20 md:py-24 bg-[#FAFAFA] dark:bg-[#0E0E0E] border-t border-neutral-200/80 dark:border-neutral-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Marker: • WHAT CLIENTS SAY */}
          <div className="flex items-center gap-2 mb-10">
            <span className="w-2 h-2 rounded-full bg-[#FF3B30]" />
            <span className="text-xs font-black uppercase tracking-[0.25em] text-neutral-900 dark:text-neutral-100">
              WHAT CLIENTS SAY
            </span>
          </div>

          {/* 3 Testimonial Cards with Red Quotation Marks matching reference */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {clientTestimonials.map((item, index) => {
              const borderHoverColors = ['hover:border-red-400/50', 'hover:border-sky-400/50', 'hover:border-emerald-400/50'];
              const quoteColors = ['text-[#FF3B30] fill-[#FF3B30]', 'text-sky-500 fill-sky-500', 'text-emerald-500 fill-emerald-500'];

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className={`p-8 rounded-2xl bg-white dark:bg-[#121212] border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs flex flex-col justify-between transition-all hover:shadow-lg ${borderHoverColors[index % 3]}`}
                >
                  <div>
                    {/* Vibrant Colored Quote Mark Icon */}
                    <div className="mb-4">
                      <Quote className={`w-8 h-8 rotate-180 ${quoteColors[index % 3]}`} />
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
              );
            })}
          </div>

        </div>
      </section>

      {/* ======================================================= */}
      {/* SECTION 3: CALL TO ACTION BANNER (EXTRAORDINARY CTA)    */}
      {/* ======================================================= */}
      <section className="py-20 md:py-28 bg-white dark:bg-[#0A0A0A] relative overflow-hidden">
        
        {/* Multi-Hue Gradient Glow in Background */}
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-gradient-to-tr from-[#FF3B30]/15 via-purple-500/15 to-sky-500/15 blur-3xl rounded-full pointer-events-none -mr-20 -mb-20" />
        <div className="absolute left-0 top-0 w-80 h-80 bg-gradient-to-br from-amber-500/10 via-red-500/10 to-transparent blur-3xl rounded-full pointer-events-none -ml-20 -mt-20" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Huge Display Headline matching reference */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-8"
            >
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-neutral-950 dark:text-white leading-[0.95]">
                LET'S CREATE SOMETHING <br />
                <span className="text-[#FF3B30] relative inline-block">
                  EXTRAORDINARY.
                  {/* Decorative underline slash */}
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-4 text-[#FF3B30]"
                    viewBox="0 0 300 20"
                    fill="none"
                  >
                    <path d="M2 15C80 6 220 4 298 12" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span>
              </h2>
            </motion.div>

            {/* Right Question & Get in Touch Button */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center"
            >
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-6 text-left lg:text-right max-w-xs">
                Have an IT support vacancy, infrastructure project, or inquiry in Riyadh? I'd love to hear from you.
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
